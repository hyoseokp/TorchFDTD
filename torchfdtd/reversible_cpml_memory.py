"""Metadata-only complete admission for recorded-interface CPML reversal.

The public caller validates physics, input tensors and the descriptor-derived
inclusive reconstruction interval before allocating its effective material.
Caller inputs, optimizer state and CUDA context are not owned allocations.
"""
import math

import torch


class _TraceAdmissionError(ValueError):
    """A complete reservation was denied, rather than invalid physics/metadata."""


def _cpml_reversible_reservation(project, options, device, interval, *, material_components=1, spectral=None,
                                 decomposition=None):
    """Resolve storage using complete reservations, before any solver allocation.

    Keep the device-first choice local to this invocation. The existing CUDA
    admission queries live free memory, including archives held by other graphs,
    and may release unused allocator cache. Host admission counts the archive,
    pinned/device staging and all other solver allocations. Explicit budgets
    bound this solver, not a shared pool or memory reserved for future calls.
    No graph/trace keeper, field offload, partial archive or OOM retry is added.
    A SlabDecomposition admits this rank's slab, trace and halo rows.
    """
    device = torch.device(device)
    requested = options.trace_storage
    transfers = getattr(options, 'trace_transfers', 'sync')
    if requested != 'auto':
        result = _fixed_cpml_reversible_reservation(project, options, device, interval,
            material_components=material_components, spectral=spectral,
            storage=requested, transfers=transfers, decomposition=decomposition)
        result.update(trace_storage_requested=requested, trace_transfers_requested=transfers)
        return result
    if device.type not in ('cpu', 'cuda'):
        raise ValueError('CPML reversible reservation requires CPU or CUDA.')
    if transfers not in ('sync', 'async'):
        raise ValueError('trace_transfers must be sync or async.')
    if getattr(options, 'host_budget_bytes', None) is None:
        raise ValueError('Automatic trace storage requires an explicit host_budget_bytes total budget.')
    candidates = [('device', 'sync'), ('cpu', 'async')] if device.type == 'cuda' else [('cpu', 'sync')]
    attempts = []
    for storage, resolved_transfers in candidates:
        try:
            result = _fixed_cpml_reversible_reservation(project, options, device, interval,
                material_components=material_components, spectral=spectral,
                storage=storage, transfers=resolved_transfers, decomposition=decomposition)
        except _TraceAdmissionError as error:
            attempts.append(dict(storage=storage, transfers=resolved_transfers,
                                 admitted=False, reason=str(error)))
            continue
        attempts.append(dict(storage=storage, transfers=resolved_transfers, admitted=True))
        result.update(trace_storage_requested='auto', trace_transfers_requested=transfers,
            trace_placement_policy='device_then_async_cpu' if device.type == 'cuda' else 'cpu_only',
            trace_placement_attempts=attempts)
        return result
    reasons = ' '.join(attempt['storage']+': '+attempt['reason'] for attempt in attempts)
    raise ValueError('Automatic trace storage cannot admit a complete solver reservation. '+reasons)


def _fixed_cpml_reversible_reservation(project, options, device, interval, *,
                                     material_components=1, spectral=None, storage, transfers,
                                     decomposition=None):
    from .adjoint_memory import _resident_reservation
    from .differentiable import AdjointOptions
    from .memory_profile import host_memory
    from .cuda_memory import cuda_budget_limit
    from .reversible_memory import _source_preparation

    device = torch.device(device)
    if device.type not in ('cpu', 'cuda'):
        raise ValueError('CPML reversible reservation requires CPU or CUDA.')
    if type(material_components) is not int or material_components not in (1, 3):
        raise ValueError('material_components must be 1 or 3.')
    requested_chunk = getattr(options, 'trace_chunk_steps', 32)
    diagnostic_lanes = getattr(options, 'diagnostic_chunk_elements', 65536)
    if transfers not in ('sync', 'async'):
        raise ValueError('trace_transfers must be sync or async.')
    if type(requested_chunk) is not int or not 1 <= requested_chunk <= 1024:
        raise ValueError('trace_chunk_steps must be an integer in [1, 1024].')
    if type(diagnostic_lanes) is not int or not 65536 <= diagnostic_lanes <= 1 << 26:
        raise ValueError('diagnostic_chunk_elements must be an integer in [65536, 2**26].')
    if storage not in ('device', 'cpu'):
        raise ValueError('Trace storage must be device or cpu.')
    if transfers == 'async' and (device.type != 'cuda' or storage != 'cpu'):
        raise ValueError('Asynchronous traces require CUDA with trace_storage=cpu.')
    if type(options.collar_cells) is not int or options.collar_cells < 1:
        raise ValueError('collar_cells must be a positive integer.')
    spectral_layout = getattr(spectral, 'layout_reservation_bytes', 0) if spectral is not None else 0
    if type(spectral_layout) is not int or spectral_layout < 0:
        raise ValueError('Spectral layout_reservation_bytes must be a nonnegative integer.')
    shape = project.region.shape if decomposition is None else decomposition.shape
    if (len(interval) != 2 or any(type(x) is not int for x in interval)
            or not 0 <= interval[0] <= interval[1] < shape[2]):
        raise ValueError('Invalid inclusive reconstruction interval.')
    budgets = {}
    for name in ('host_budget_bytes', 'gpu_budget_bytes', 'resident_budget_bytes'):
        value = getattr(options, name, None)
        if value is not None and (type(value) is not int or value <= 0):
            raise ValueError(f'{name} must be a positive integer byte budget.')
        budgets[name] = value
    # Explicit resident budget also admits budgeted/large scenes through the
    # base contract. Recheck the complete total after all additions below.
    internal = AdjointOptions(checkpoints=1, storage='device',
        backward_kernel='fused' if device.type == 'cuda' else 'torch',
        resident_budget_bytes=budgets['resident_budget_bytes'])
    base_project = project
    # Runtime always uses the fused complex update. Match that allocation
    # model without mutating the caller's project or copying unrelated graphs.
    if device.type == 'cuda' and getattr(project.region, 'complex_fields', False) and getattr(project.region, 'cuda_kernel', 'torch') != 'fused':
        base_project = project.model_copy(update={'region': project.region.model_copy(update={'cuda_kernel': 'fused'})})
    base = _resident_reservation(base_project, internal, device, spectral, decomposition=decomposition)
    cells = math.prod(shape)
    plane = shape[0]*shape[1]
    complex_fields = getattr(project.region, 'complex_fields', False)
    item = 8 if complex_fields else 4
    frame = 4*plane*item
    trace = project.region.steps*frame
    interior_cells = plane*(interval[1]-interval[0]+1)
    chunk = min(diagnostic_lanes, 3*interior_cells*(2 if complex_fields else 1))
    # Rectangular packing and abs scratch each require one FP32 chunk,
    # alongside two FP64 reduction chunks. Never flatten a strided volume.
    diagnostics = 24*chunk+4096
    material = 3*material_components*cells*4
    preparation = _source_preparation(project)
    # Synchronous CPU archive transfers may temporarily own both packing and
    # incoming device frames. No pinned ring or asynchronous transport claimed.
    transfer_device = 2*frame if device.type == 'cuda' and storage == 'cpu' else 0
    transfer_host = frame if device.type == 'cuda' and storage == 'cpu' else 0
    actual_chunk = min(requested_chunk, project.region.steps)
    trace_metadata = 0
    if transfers == 'async':
        from .reversible_trace import metadata
        transport = metadata((project.region.steps, 2, shape[0], shape[1], 2), actual_chunk,
                             torch.complex64 if complex_fields else torch.float32)
        transfer_device = transport['device_staging_bytes']
        transfer_host = transport['pinned_staging_bytes']
        trace_metadata = transport['metadata_allowance_bytes']
    trace_device = trace if device.type == 'cuda' and storage == 'device' else 0
    trace_host = trace if device.type == 'cpu' or storage == 'cpu' else 0
    # The inherited point metadata allocation bounds the number of point
    # monitors. Plane spectra expose their expanded monitor count directly.
    monitor_count = (len(spectral.components) if spectral is not None else
                     len(getattr(project, 'monitors', ())))
    observation_map = 8*monitor_count if device.type == 'cuda' else 0
    forward_buffers = adjoint_buffers = tuning_scratch = 0
    multi_tuning = (getattr(options, 'cells_per_thread', 1) == 'auto' or (
        getattr(options, 'cells_per_thread', 1) != 1 and getattr(options, 'block_size', None) == 'auto'))
    if device.type == 'cuda' and ((not complex_fields and (
            getattr(options, 'forward_kernel', 'split') == 'fused_eh'
            or getattr(options, 'adjoint_kernel', 'split') == 'one_pass'
            or getattr(options, 'block_size', None) == 'auto')) or multi_tuning):
        from .boundaries import BoundaryDescription
        descriptors = BoundaryDescription(project.region)
        if decomposition is not None:
            decomposition.localize(descriptors)
        psi_bytes = electric_psi_bytes = 0
        for (forward, axis, _), segments in descriptors.cpml.items():
            for segment in segments:
                cut = segment['slice'][axis]
                size = (cells // shape[axis]) * (cut.stop-cut.start) * item
                psi_bytes += size
                if not forward:
                    electric_psi_bytes += size
        if getattr(options, 'forward_kernel', 'split') == 'fused_eh':
            forward_buffers = 6*cells*item + electric_psi_bytes
        if getattr(options, 'adjoint_kernel', 'split') == 'one_pass':
            adjoint_buffers = 6*cells*item
        if getattr(options, 'block_size', None) == 'auto' or multi_tuning:
            # Largest simultaneously writable set: two fields and all CPML
            # memories. Interior E+VJP uses at most the same two-field bound.
            tuning_scratch = 6*cells*item + psi_bytes
    kernel_workspace = forward_buffers + adjoint_buffers + tuning_scratch
    extra_active = diagnostics+material+transfer_device+trace_device+observation_map+kernel_workspace
    extra_host = preparation+transfer_host+trace_host+trace_metadata+spectral_layout+observation_map
    # Inherit the existing runtime reserve and add allocator rounding/headroom
    # for new CUDA allocations rather than consuming the old reserve silently.
    headroom = (extra_active+19)//20+4096 if device.type == 'cuda' else 0
    active = base['memory_reservation_bytes']+extra_active+headroom
    host = base['host_reservation_bytes']+extra_host
    if device.type == 'cpu':
        host += extra_active
        active = host
    if budgets['host_budget_bytes'] is not None and host > budgets['host_budget_bytes']:
        raise _TraceAdmissionError('CPML reversible total host reservation exceeds the explicit host budget.')
    if budgets['resident_budget_bytes'] is not None and active > budgets['resident_budget_bytes']:
        raise _TraceAdmissionError('CPML reversible total resident reservation exceeds the explicit resident budget.')
    available = host_memory()['available_bytes']
    if available is not None and host > int(.8*available):
        raise _TraceAdmissionError('CPML reversible total host reservation exceeds available host memory.')
    if device.type == 'cuda' and active > cuda_budget_limit(device, active, budgets['gpu_budget_bytes']):
        raise _TraceAdmissionError('CPML reversible complete reservation exceeds the CUDA budget.')
    parts = dict(base['workspace_components_bytes'])
    parts.update(reconstruction_diagnostics=diagnostics,
                 effective_material_and_autograd=material,
                 trace_device_transfer=transfer_device,
                 recorded_observation_map=observation_map,
                 fused_forward_buffers=forward_buffers,
                 fused_adjoint_buffers=adjoint_buffers,
                 cuda_tuning_scratch=tuning_scratch)
    actual_terminal = 6*plane*(interval[1]-interval[0]+1)*item
    result = dict(base, memory_reservation_bytes=active, host_reservation_bytes=host,
        gpu_reservation_bytes=active if device.type == 'cuda' else 0,
        workspace_reservation_bytes=base['workspace_reservation_bytes']+diagnostics+material+transfer_device+observation_map+kernel_workspace,
        workspace_components_bytes=parts,
        workspace_model='cpml_reversible_conservative_'+base['workspace_model'],
        inherited_workspace_model=base['workspace_model'],
        inherited_workspace_note='Retains full primal CPML, full field/CPML transpose, whole-state replay/conversion and worst-case diagonal coefficient allowances. CPU retains the 102-scalar-per-cell tensor bound.',
        allocation_headroom_bytes=base['allocation_headroom_bytes']+headroom,
        additional_allocation_headroom_bytes=headroom,
        conservative_extra_active_bytes=extra_active+headroom,
        conservative_extra_host_bytes=extra_host+(extra_active if device.type == 'cpu' else 0),
        terminal_state_bytes=actual_terminal,
        terminal_state_allowance_bytes=base['device_checkpoint_reservation_bytes'],
        terminal_state_count=1, checkpoint_states=0, checkpoint_replays=0,
        device_checkpoint_reservation_bytes=0, host_checkpoint_reservation_bytes=0,
        disk_checkpoint_reservation_bytes=0, device_staging_reservation_bytes=0,
        trace_storage=storage, trace_transfers=transfers,
        trace_chunk_steps=actual_chunk, trace_requested_chunk_steps=requested_chunk,
        trace_host_metadata_bytes=trace_metadata,
        trace_pinned_host_bytes=transfer_host if transfers == 'async' else 0,
        trace_reusable_event_count=8 if transfers == 'async' else 0,
        trace_item_bytes=item, material_components=material_components,
        trace_shape=(project.region.steps, 2, shape[0], shape[1], 2),
        trace_bytes=trace, trace_device_bytes=trace_device, trace_host_bytes=trace_host,
        trace_frame_bytes=frame, trace_transfer_device_bytes=transfer_device,
        trace_transfer_host_bytes=transfer_host,
        trace_transfer=('asynchronous' if transfers == 'async' else 'synchronous') if transfer_device else 'none',
        reconstruction_interval=tuple(interval),
        material_assembly_and_autograd_bytes=material,
        diagnostic_chunk_elements=chunk, diagnostic_buffer_bytes=24*chunk,
        diagnostic_rounding_bytes=4096, diagnostic_reservation_bytes=diagnostics,
        recorded_observation_map_bytes=observation_map,
        fused_forward_buffer_bytes=forward_buffers,
        fused_adjoint_buffer_bytes=adjoint_buffers,
        cuda_tuning_scratch_bytes=tuning_scratch,
        source_preparation_host_bytes=preparation,
        retained_caller_epsilon_bytes=material_components*cells*4,
        retained_caller_fixed_epsilon_bytes=material_components*cells*4,
        retained_caller_inputs_bytes=2*material_components*cells*4,
        contiguous_seed_reservation_bytes=base['output_history_bytes'] if spectral is None else spectral.block_size*len(spectral.components)*item,
        strategy='recorded_interface_cpml_reversible',
        state_storage='O(volume) fields/CPML/adjoints plus O(steps*transverse area) lossless trace and point/source histories; no whole-volume time trajectory')

    if spectral is not None:
        # The base history reservation already contains spectral.reservation(B)
        # and source histories. Its 4*B*M real (doubled for complex) workspace
        # covers the stable B*M seed plus transient transpose/output blocks.
        # Do not add a T*M observation history or charge the spectrum twice.
        result.update(spectral.reservation(spectral.block_size))
        result.update(online_spectrum=True, observation_history_retained=False,
            spectral_block_size=spectral.block_size,
            spectral_monitor_count=len(spectral.components),
            spectral_block_shape=(spectral.block_size, len(spectral.components)),
            plane_layout_reservation_bytes=spectral_layout,
            host_spectral_layout_bytes=spectral_layout)
    return result
