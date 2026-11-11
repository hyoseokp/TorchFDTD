"""Resident adjoint admission before material packing or field allocation."""
import math
import os
import re

import torch

from .boundaries import BoundaryDescription
from .memory_profile import host_memory
from .models import server_limit
from .cuda_memory import cuda_budget_limit
from .state_store import disk_free


def _resident_contract(region,options):
    if options.resident_budget_bytes is None:
        region.require_resident()
        return
    if region.memory_mode=='streamed':
        raise ValueError('Use memory_mode="budgeted" for byte-admitted resident execution.')
    # A byte budget replaces the memory estimate, not the server's resident-cell limit.
    refusal=region.cell_cap_refusal() if server_limit('resident_cells') is not None else None
    if refusal:raise ValueError(refusal+'. Use memory_mode="streamed" with StreamedSimulation.')


def _cuda_index_contract(region,shape,monitor_count,observation_steps):
    # Fused Yee field offsets use signed int arithmetic. Complex forward uses
    # two real lanes. ADE pole and packed-parameter offsets already use int64.
    lanes=2 if region.complex_fields else 1
    if 3*lanes*math.prod(shape)>=2**31:
        raise ValueError('Resident CUDA field indexing exceeds the signed 32-bit range. Use spatial streaming.')
    # Retain the conservative observation bound for all CUDA paths.
    # Spectral observations seed bounded time blocks instead of full history.
    if lanes*monitor_count*observation_steps>=2**31:
        raise ValueError('Resident CUDA observation indexing exceeds the signed 32-bit range. Use online spectra or fewer observations.')


def _material_shapes(region, parameter_shapes):
    from .boundaries import material_shape
    shapes=tuple(tuple(s) for s in parameter_shapes)
    grid=material_shape(region)
    if len(shapes)!=4 or shapes[0] not in (grid,grid+(3,)):
        raise ValueError('Provide four material shapes starting with the epsilon_inf grid shape.')
    if not shapes[1] or isinstance(shapes[1][0],bool) or not isinstance(shapes[1][0],int) or not 1<=shapes[1][0]<=64:
        raise ValueError('Strength needs a leading pole axis of length 1 to 64.')
    poles=shapes[1][0]
    for shape in shapes[1:]:
        if any(isinstance(v,bool) or not isinstance(v,int) for v in shape) or shape not in ((),(poles,),(poles,*grid),(poles,*grid,3)):
            raise ValueError('Oscillator shape must be scalar, (P,), (P,Nx,Ny,Nz), or (P,Nx,Ny,Nz,3).')
    return shapes,poles


def _source_spatial_budget(project,item):
    """Bound prepared profiles and one injection without materializing profiles."""
    from .solver import source_slice
    region=project.region
    profiles=largest=0
    for raw in project.sources:
        source=project.resolved_source(raw)
        if not source.enabled:continue
        if source.injection=='oneway':
            axis='xyz'.index(source.normal)
            largest=max(largest,math.prod(n for a,n in enumerate(region.shape) if a!=axis))
            continue
        for component,_ in source.polarization_components:
            scalar=source.model_copy(update=dict(component=component,theta=None))
            loc=source_slice(scalar,region)
            count=math.prod(len(range(*sl.indices(n))) if isinstance(sl,slice) else 1
                            for sl,n in zip(loc,region.shape))
            largest=max(largest,count)
            if source.kind=='plane' and region.complex_fields:profiles+=count
    # Profiles persist for each prepared polarization term. The multiply and
    # injection sum have at most two simultaneous source-support temporaries.
    return profiles*item,2*largest*item


def _spectral_library_reservation(device):
    """Cold cuBLAS/Lt pools for caller and autograd threads on one stream each.

    Defaults and environment units follow PyTorch 2.10 CublasHandlePool.cpp.
    No handle is created and no matrix multiply is run during admission.
    Unknown devices retain the larger default used by Hopper.
    """
    capability=torch.cuda.get_device_capability(device) if torch.cuda.is_available() else (9,0)
    default=32*1024**2 if capability==(9,0) else (4096*2+16*8)*1024
    configured=sum(int(size)*int(count)*1024 for size,count in
        re.findall(r':([0-9]+):([0-9]+)',os.environ.get('CUBLAS_WORKSPACE_CONFIG','')))
    lt=os.environ.get('CUBLASLT_WORKSPACE_SIZE','1024')
    if lt.lstrip().startswith('-'):raise ValueError('CUBLASLT_WORKSPACE_SIZE must not be negative.')
    match=re.match(r'\s*\+?([0-9]+)',lt)
    lt_bytes=max(1024,int(match[1]) if match else 1024)*1024
    # Keep separate pools even when the caller has enabled unified workspaces.
    # Existing warm caches are not relied on to make a cold invocation fit.
    return 2*(max(default,configured)+lt_bytes)


def _workspace(project,options,device,boundary,segments,n,cpml,item,real_item,poles,state,monitors):
    region=project.region
    pmc=bool(boundary.pmc_lower or boundary.pmc_upper)
    native_forward=device.type=='cuda' and (region.cuda_kernel=='fused' or (not poles and not region.complex_fields))
    native_backward=device.type=='cuda' and not pmc and (options.backward_kernel=='fused' or
        (not poles and not region.complex_fields and options.backward_kernel=='auto'))
    fused=native_forward and native_backward
    if fused:
        # _System/_DispersiveSystem own primal E/H/P/Q. The CUDA transpose owns
        # E/H/P/Q adjoints and two CPML adjoint banks. Pointer views do not copy.
        parts=dict(primal_and_adjoint_fields=(12+12*poles)*n*item,
                   primal_and_adjoint_cpml=3*cpml*item,
                   replay_and_conversion_allowance=state)
        if poles:
            parts['ade_numerator_and_recomputed_electric']=6*n*item
            # At most one shared scalar per pole for each of s, omega and gamma.
            # Actual scalar/pole shape information may give a smaller reduction.
            parts['ade_shared_reduction_bound']=3*poles*((n+255)//256)*real_item
        else:
            # Worst-case diagonal inverse epsilon, contiguous epsilon copy and
            # returned epsilon gradient. Original caller parameters are excluded.
            parts['dielectric_coefficients_and_gradient']=9*n*real_item
        coefficient_elements=sum(seg[key].size for seg in segments for key in ('b','c','inv_k'))
        coefficient_elements+=sum(values.size for values,_ in boundary.metric.values())+2
        parts['boundary_coefficients']=coefficient_elements*real_item
        model='fused_cuda_allocations'
    else:
        parts=dict(tensor_workspace_bound=102*n*item)
        if poles:parts['tensor_ade_workspace_bound']=(36*poles+12)*n*(item+real_item)
        model='conservative_tensor_bound'
    profiles,injection=_source_spatial_budget(project,item)
    parts.update(source_profiles=profiles,source_injection=injection,observation_gathers=3*monitors*item)
    return model,parts


def _resident_reservation(project, options, device, spectral=None, *, pole_count=0, parameter_elements=0,
                          decomposition=None):
    """Shared planner/execution calculation, including original tier semantics.

    With a SlabDecomposition the volume, CPML and halo terms are this rank's
    slab; observation histories keep their full, replicated size.
    """
    region=project.region
    _resident_contract(region,options)
    device=torch.device(device)
    if device.type not in ('cpu','cuda'):raise ValueError('Only CPU and CUDA execution are supported.')
    if device.type!='cuda' and options.backward_kernel=='fused':raise ValueError('The fused backward requires a CUDA tensor.')
    if device.type!='cuda' and options.checkpoint_transfers=='async':raise ValueError('Asynchronous checkpoints require a CUDA tensor.')
    monitor_count=sum(m.enabled for m in project.monitors) if spectral is None else len(spectral.components)
    shape=region.shape if decomposition is None else decomposition.shape
    if device.type=='cuda':
        _cuda_index_contract(region,shape,monitor_count,region.steps if spectral is None else spectral.block_size)
    n=math.prod(shape)
    real_item=8 if region.precision=='float64' else 4
    item=real_item*(2 if region.complex_fields else 1)
    boundary=BoundaryDescription(region)
    if decomposition is not None:decomposition.localize(boundary)
    segments=[s for group in boundary.cpml.values() for s in group]
    cpml=sum(math.prod(s['shape']) for s in segments)
    # Stored upper PMC faces/edges are exact element counts, not a padded volume.
    faces=sum(math.prod(shape) for blocks in boundary.pmc_blocks.values() for _,_,shape in blocks)
    electric_faces=sum(math.prod(shape) for _,_,shape in boundary.pmc_blocks['E'])
    state=(6*n+cpml+faces+6*pole_count*n+2*pole_count*electric_faces)*item
    from .boundaries import material_shape
    workspace_model,workspace_parts=_workspace(project,options,device,boundary,segments,
        math.prod(material_shape(region) if decomposition is None else shape),cpml,item,real_item,pole_count,state,monitor_count)
    if decomposition is not None:
        # The halo-extended diagonal material and its staging copy, plus one
        # send and one receive row for each of the field and derivative halos.
        row=n//shape[decomposition.axis]
        workspace_parts['slab_material_and_halo_rows']=6*n*real_item+12*row*item
    workspace=sum(workspace_parts.values())
    # Packing and its normalization graph precede field creation. Budget those
    # carriers before torch.cat, rather than testing only the packed output.
    packing=4*parameter_elements*real_item
    terms=sum(len(s.polarization_components)*(2 if s.injection=='oneway' else 1)
              for s in project.sources if s.enabled)
    output=region.steps*monitor_count*item if spectral is None else spectral.reservation(spectral.block_size)['spectral_output_bytes']
    source=region.steps*terms*item
    history=2*output+source if spectral is None else spectral.reservation(spectral.block_size)['spectral_reservation_bytes']+source
    index_bytes=16*monitor_count
    real_fused_backward=not region.complex_fields and (options.backward_kernel=='fused' or (not pole_count and options.backward_kernel=='auto'))
    observer_layout=32*monitor_count+8 if monitor_count and device.type=='cuda' and real_fused_backward else 0
    index_bytes+=observer_layout
    # Group construction retains Python keys/lists and a NumPy packet before
    # uploading the compact map. This is an engineering host allowance.
    observer_preparation=512*monitor_count+8 if observer_layout else 0
    if options.storage=='hierarchical':
        device_slots=options.device_checkpoints
        host_slots=options.host_checkpoints
        disk_slots=options.checkpoints-device_slots-host_slots
    else:
        device_slots=options.checkpoints if options.storage=='device' else 0
        host_slots=options.checkpoints if options.storage=='host' else 0
        disk_slots=options.checkpoints if options.storage=='disk' else 0
    asynchronous=options.checkpoint_transfers=='async' and (host_slots or disk_slots)
    staging_slots=options.staging_slots if asynchronous else 0
    host_checkpoint=state*(host_slots+staging_slots+(1 if disk_slots else 0))
    array_count=2+len(segments)+sum(len(blocks) for blocks in boundary.pmc_blocks.values())+((2+2*len(boundary.pmc_blocks['E'])) if pole_count else 0)
    disk_checkpoint=(state+4096+512*array_count)*disk_slots
    device_checkpoint=device_slots*state
    device_staging=staging_slots*state
    library=_spectral_library_reservation(device) if device.type=='cuda' and spectral is not None else 0
    subtotal=workspace+device_checkpoint+device_staging+history+index_bytes+packing+library
    # Runtime/library setup and allocator rounding get explicit headroom. This
    # is an engineering reserve, not a proof of a platform-independent peak.
    headroom=8*1024**2+(subtotal+19)//20 if workspace_model=='fused_cuda_allocations' else 0
    required=subtotal+headroom
    # The resident one-way validator currently copies epsilon to CPU. Reserve
    # the diagonal worst case plus its three-plane NumPy comparison temporaries.
    oneway=any(s.enabled and s.injection=='oneway' for s in project.sources)
    source_validation=(3*n+18*max(region.shape[0]*region.shape[1],region.shape[0]*region.shape[2],region.shape[1]*region.shape[2]))*real_item if oneway and device.type=='cuda' else 0
    host_required=host_checkpoint+(required if device.type=='cpu' else 0)+source_validation+observer_preparation
    if options.resident_budget_bytes is not None:
        active=host_required if device.type=='cpu' else required
        if active>options.resident_budget_bytes:
            raise ValueError('Resident solver reservation exceeds the explicit resident byte budget.')
    # host_budget_bytes retains its existing checkpoint-tier meaning. The
    # current available-host check additionally covers CPU working fields.
    if options.host_budget_bytes is not None and host_checkpoint>options.host_budget_bytes:
        raise ValueError('Host checkpoint budget cannot hold its slots and disk staging state.')
    available=host_memory()['available_bytes']
    if available is not None and host_required>int(available*.8):
        raise ValueError('Resident workspace and checkpoints exceed available host memory.')
    if disk_slots:
        if disk_checkpoint>options.disk_budget_bytes:
            raise ValueError('Disk checkpoint budget must include its slots and archive headers.')
        if disk_checkpoint>int(disk_free(options.checkpoint_directory)*.8):
            raise ValueError('Disk checkpoint reservation exceeds available storage.')
    if device.type=='cuda':
        limit=cuda_budget_limit(device,required,options.gpu_budget_bytes)
        if required>limit:raise ValueError('Adjoint workspace and checkpoint reservation exceed the GPU budget.')
    return dict(memory_reservation_bytes=required,workspace_reservation_bytes=workspace,
        workspace_model=workspace_model,workspace_components_bytes=workspace_parts,
        allocation_headroom_bytes=headroom,device_checkpoint_reservation_bytes=device_checkpoint,
        device_staging_reservation_bytes=device_staging,
        spectral_library_reservation_bytes=library,
        history_reservation_bytes=history,output_history_bytes=output if spectral is None else 0,
        source_history_bytes=source,observation_index_bytes=index_bytes,
        observer_layout_bytes=observer_layout,observer_preparation_bytes=observer_preparation,
        material_packing_reservation_bytes=packing,restart_state_bytes=state,
        host_checkpoint_reservation_bytes=host_checkpoint,disk_checkpoint_reservation_bytes=disk_checkpoint,
        host_source_validation_bytes=source_validation,
        host_reservation_bytes=host_required,gpu_reservation_bytes=required if device.type=='cuda' else 0,
        budgeted_resident=options.resident_budget_bytes is not None)


def estimate_adjoint_memory(project, options=None, *, device='cpu', parameter_shapes=None,
                            frequency_hz=None, window=None, block_size=32, decomposition=None):
    """Admit resident Yee/CPML or ADE without creating fields or scratch files.

    Supply four original material shapes for ADE. Omit them for nondispersive
    epsilon. Point histories and online point spectra are supported here.
    The same calculation also serves internal fixed-plane execution admission.
    Geometry/optimizer graphs and CUDA context are outside this estimate.
    host_budget_bytes limits the checkpoint tier, as in AdjointOptions.
    Current available RAM additionally bounds CPU solver workspace. Execution
    rechecks resources and validates actual tensors and supported physics.
    A SlabDecomposition admits this rank's slab on this rank's device.
    """
    from .differentiable import AdjointOptions, DifferentiableSimulation
    options=options or AdjointOptions()
    if not isinstance(options,AdjointOptions):raise ValueError('Resident planning requires AdjointOptions.')
    model_type=DifferentiableSimulation
    if parameter_shapes is not None:
        from .dispersive_adjoint import DispersiveSimulation
        model_type=DispersiveSimulation
    # Constructors validate the supported physics and observations without
    # creating fields. Do not admit a plane as if it were one point sample.
    model=model_type(project,options)
    project,options=model.project,model.options
    poles=elements=0
    if parameter_shapes is not None:
        shapes,poles=_material_shapes(project.region,parameter_shapes)
        elements=sum(math.prod(s) for s in shapes)
    if window is not None and frequency_hz is None:raise ValueError('A spectral window requires frequency_hz.')
    spectral=None
    if frequency_hz is not None:
        from .adjoint_spectrum import SpectralObservation
        scalar=torch.empty((),dtype=getattr(torch,project.region.precision),device='cpu')
        spectral=SpectralObservation(scalar,project.region,[m.component for m in project.monitors if m.enabled],
            frequency_hz,window,block_size)
    report=_resident_reservation(project,options,device,spectral,pole_count=poles,parameter_elements=elements,
                                 decomposition=decomposition)
    if spectral is not None:report.update(spectral.reservation(spectral.block_size))
    return report
