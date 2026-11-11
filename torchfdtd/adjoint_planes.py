"""Differentiable collocated spectral planes on the real Yee/CPML contract."""
from dataclasses import dataclass
from functools import cached_property
import hashlib
import json
import numpy as np
import torch
from .adjoint_spectrum import SpectralObservation
from .differentiable import DifferentiableSimulation
from .field_monitors import plane_plan, interpolation_map
from .mesh import freeze_refinements
from .models import Project, Monitor
from .plan import SAMPLE_TIME_STEPS, PlanInvalidated
from .solver import field_axes
from .streamed import StreamedSimulation, StreamedAdjointOptions
from .waveforms import source_time_signal

COMPONENTS = ('Ex','Ey','Ez','Hx','Hy','Hz')
# E is observed after its update at (n+1) dt and H half a step later, as in
# the spectral kernel and the native frequency planes (torchfdtd.plan.SAMPLE_TIME_STEPS).


def _reference_payload(project):
    """What a matched reference must share: mesh, time base, sources, exterior and observation.

    Ids, names, display options, execution placement and mesh generation
    settings are left out. Automatic refinement boxes are private state that
    model_dump omits, so the realized nodes identify the mesh, as in the
    Simulation signature. Structures and materials are left out so a
    scatterer and its air reference stay compatible.
    """
    r=project.region
    times=np.arange(1,r.steps+1)*r.time_step
    sources=[]
    for raw in project.sources:
        if not raw.enabled:continue
        s=project.resolved_source(raw)
        waveform=np.asarray(source_time_signal(s,times+s.time_offset_steps*r.time_step),dtype=np.float64)
        # The sampled waveform digest stands in for any long sampled signal.
        sources.append(dict(s.model_dump(mode='json',exclude={'id','name','enabled','signal'}),
            polarization=[[field,float(weight)] for field,weight in s.polarization_components],
            waveform_sha256=hashlib.sha256(waveform.tobytes()).hexdigest()))
    faces=[dict(face.model_dump(mode='json'),layers=r.pml_layers(axis,side))
           for axis in range(3) for side,face in enumerate(r.boundaries.pair(axis))]
    monitors=[]
    for raw in project.monitors:
        if not raw.enabled or raw.kind!='field':continue
        m=project.resolved_monitor(raw)
        monitors.append(dict(m.model_dump(mode='json',include={'normal','center','size','spatial_interpolation',
                'downsample','downsample_xyz','dft_precision','time_downsample'}),
            apodization=m.spectrum.model_dump(mode='json',include={'apodization','apodization_center','apodization_time_width'})))
    return dict(dimension=r.dimension,size=list(r.size),nodes=[a.tolist() for a in r.mesh_nodes],
        time_step=r.time_step,steps=r.steps,sample_time_steps=SAMPLE_TIME_STEPS,fourier_convention='exp(+2 pi i f t)',
        material_sampling=r.material_sampling,background_index=r.background_index,boundaries=faces,
        bloch_phase=list(r.bloch_phase),sources=sources,monitors=monitors)


def _plane_signature(project):
    """Reference-compatibility fingerprint shared by a sample and its reference."""
    return hashlib.sha256(json.dumps(_reference_payload(project),sort_keys=True).encode()).hexdigest()


def _run_fingerprint(project):
    """Full run fingerprint for caches and restarts: the reference payload plus the scene."""
    r=project.region
    structures=[s.model_dump(mode='json',exclude={'id','name','enabled'}) for s in project.structures if s.enabled]
    used={s['material'] for s in structures}
    payload=dict(_reference_payload(project),precision=r.precision,interface_method=r.interface_method,
        subpixel_quadrature=r.subpixel_quadrature,structures=structures,
        materials=[m.model_dump(mode='json',exclude={'color'}) for m in sorted(project.materials,key=lambda m:m.name) if m.name in used])
    return hashlib.sha256(json.dumps(payload,sort_keys=True).encode()).hexdigest()


@dataclass
class DifferentiablePlaneResult:
    fields: torch.Tensor  # frequency, flattened quadrature point, component
    frequency_hz: torch.Tensor
    points_um: torch.Tensor
    weights: torch.Tensor
    shape: tuple
    normal: str
    run_signature: str
    report: dict
    components: tuple = COMPONENTS
    field_units: str = 'reduced field * s'
    flux_units: str = 'reduced E*H * s^2 * m^2'
    fourier_convention: str = 'exp(+2 pi i f t)'
    run_fingerprint: str = ''  # full scene fingerprint for caches; run_signature is reference compatibility

    def poynting(self, normal=None):
        normal=self.normal if normal is None else normal
        if normal not in ('x','y','z'):raise ValueError('Normal must be x, y or z.')
        axis='xyz'.index(normal)
        b,c=(axis+1)%3,(axis+2)%3
        return .5*(self.fields[...,b]*self.fields[...,3+c].conj()-self.fields[...,c]*self.fields[...,3+b].conj()).real

    def flux(self):
        """Signed reduced Poynting integral, not incident normalization."""
        return self.poynting()@self.weights

    def normalized_flux(self, reference, *, subtract_incident=False, min_reference_fraction=.01):
        """Matched-reference ratio, optionally subtracting incident fields."""
        if not 0<min_reference_fraction<1:raise ValueError('Reference threshold must lie between zero and one.')
        if self.run_signature!=reference.run_signature or self.normal!=reference.normal:
            raise ValueError('Reference mesh, sources, duration and normal must match.')
        for name in ('frequency_hz','points_um','weights'):
            a,b=getattr(self,name),getattr(reference,name)
            if a.device!=b.device or a.dtype!=b.dtype or a.shape!=b.shape or not torch.equal(a,b):
                raise ValueError(f'Reference {name} must match exactly, including device and dtype.')
        # Normalize before multiplying SI-scale spectral fields and areas.
        # Dividing an O(dt^2*area) FP32 flux afterward can underflow the value
        # or overflow its backward seed. Common detached scales cancel from
        # the ratio and preserve derivatives wrt both sample and reference.
        field_scale=reference.fields.detach().abs().amax()
        area_scale=reference.weights.detach().abs().amax()
        if not bool(torch.isfinite(field_scale)) or not bool(field_scale>0) or not bool(torch.isfinite(area_scale)) or not bool(area_scale>0):
            raise ValueError('Reference power is zero, nonfinite or too weak. Select a supported frequency band.')
        fields=self.fields/field_scale
        reference_fields=reference.fields/field_scale
        weights=self.weights/area_scale
        a='xyz'.index(self.normal);b,c=(a+1)%3,(a+2)%3
        def density(value):
            return .5*(value[...,b]*value[...,3+c].conj()-value[...,c]*value[...,3+b].conj()).real
        denominator=(density(reference_fields)@weights).abs()
        if not bool(torch.isfinite(denominator).all()) or bool((denominator<=0).any()) or bool((denominator<=min_reference_fraction*denominator.max()).any()):
            raise ValueError('Reference power is zero, nonfinite or too weak. Select a supported frequency band.')
        if subtract_incident:
            fields=fields-reference_fields
        numerator=density(fields)@weights
        return numerator/denominator


class _PlaneSpectrum(SpectralObservation):
    def __init__(self,*args,points,maps,**kwargs):
        super().__init__(*args,**kwargs)
        self.point_count,self.map_bytes=points,maps

    def kernel(self,start,stop,family):
        # Match native FrequencyPlane's positive-frequency exponential.
        # Point-spectrum API retains its documented negative exponential.
        return super().kernel(start,stop,family).conj()

    def reservation(self,depth):
        result=super().reservation(depth)
        item=8 if self.dtype==torch.float64 else 4
        # Collocated output/VJP, eight-corner gathers/products and map copies.
        workspace=128*self.frequency.numel()*self.point_count*item+2*self.map_bytes
        result['plane_workspace_reservation_bytes']=workspace
        result['plane_output_bytes']=12*self.frequency.numel()*self.point_count*item
        result['spectral_reservation_bytes']+=workspace
        return result


class DifferentiablePlaneSimulation(torch.nn.Module):
    """Fixed planes and common explicit frequencies. All six fields are returned.

    Geometry/epsilon differentiates. Monitor positions and mesh remain fixed.
    Every enabled project monitor must be a field plane. With a resident
    ``decomposition`` each rank samples its own slab of every plane and all
    ranks receive the complete planes.
    """
    _resident_model_type = DifferentiableSimulation

    def __init__(self,project,options=None,*,quadrature_counts=None,decomposition=None):
        super().__init__()
        self.project=Project.model_validate(project.model_dump())
        from .boundaries import reject_pmc_faces, reject_pml_dispersion
        reject_pmc_faces(self.project.region,type(self).__name__)
        reject_pml_dispersion(self.project,type(self).__name__,getattr(self._resident_model_type,'_explicit_dispersive_parameters',False))
        active=[m for m in self.project.monitors if m.enabled]
        if not active or any(m.kind!='field' for m in active):
            raise ValueError('DifferentiablePlaneSimulation requires enabled field monitors only.')
        quadrature_counts={} if quadrature_counts is None else dict(quadrature_counts)
        if set(quadrature_counts)-{m.id for m in active}:
            raise ValueError('Quadrature counts must refer to enabled monitor IDs.')
        self.plans=[]
        observers=[]
        lookup={}
        for raw in active:
            monitor=self.project.resolved_monitor(raw)
            if monitor.time_downsample!=1 or monitor.spectrum.apodization!='none':
                raise ValueError('Differentiable planes require time_downsample=1 and no apodization.')
            if monitor.dft_precision=='float64' and self.project.region.precision!='float64':
                raise ValueError('Mixed field/DFT precision is not supported by plane adjoints.')
            plan=plane_plan(self.project.region,monitor,quadrature_counts.get(monitor.id))
            maps=[]
            for component in COMPONENTS:
                indices,weights=interpolation_map(self.project.region,component,plan['points_um'])
                # One observer per distinct Yee location of this component, numbered
                # in first-occurrence order across all planes. Vectorised: a Python
                # loop over every interpolation index took minutes for a
                # million-point plane while the GPU idled.
                flat=np.asarray(indices,dtype=np.int64).reshape(-1)
                known=lookup.setdefault(component,{})
                unique,first,inverse=np.unique(flat,return_index=True,return_inverse=True)
                numbers=np.empty(len(unique),dtype=np.int64)
                locations=np.unravel_index(unique//3,self.project.region.shape)
                slot=COMPONENTS.index(component)%3
                for rank in np.argsort(first,kind='stable'):
                    index=int(unique[rank])
                    number=known.get(index)
                    if number is None:
                        number=known[index]=len(observers)
                        observers.append((component,tuple(int(axis[rank]) for axis in locations),slot))
                    numbers[rank]=number
                samples=numbers[inverse].reshape(np.shape(indices))
                maps.append((samples,weights))
            self.plans.append((monitor.id,monitor.normal,plan,maps))
        self.observers=tuple(observers)
        self.components=tuple(o[0] for o in observers)
        self.signature=_plane_signature(self.project)
        self.fingerprint=_run_fingerprint(self.project)
        # Indexed internal observations avoid thousands of UI point objects.
        # Freeze automatic refinements first: replacing the planes by a point
        # monitor must not re-mesh the internal solver away from the plans.
        region=self.project.region
        internal=freeze_refinements(self.project) if region.mesh_type=='graded' and region.mesh_auto_refine else self.project.model_copy(deep=True)
        internal.monitors=[Monitor()]
        if isinstance(options,StreamedAdjointOptions):
            if decomposition is not None:raise ValueError('Slab decomposition runs the resident solver; use AdjointOptions.')
            self.model=getattr(self, '_streamed_model_type', StreamedSimulation)(internal,options)
        else:self.model=self._resident_model_type(internal,options,decomposition=decomposition)
        inner=self.model.project.region
        for axis,(planned,solved) in enumerate(zip(region.mesh_nodes,inner.mesh_nodes)):
            if not np.array_equal(planned,solved):
                raise ValueError(f'Internal solver mesh differs from the plane plan on the {"xyz"[axis]} axis.')
        if inner.time_step!=region.time_step:
            raise ValueError('Internal solver time step differs from the plane plan.')
        for component in COMPONENTS:
            for axis,(planned,solved) in enumerate(zip(field_axes(region,component),field_axes(inner,component))):
                if not np.array_equal(planned,solved):
                    raise ValueError(f'Internal solver {component} sampling positions differ from the plane plan on the {"xyz"[axis]} axis.')
        self._project_snapshot=self.project.model_dump()
        self._internal_snapshot=self.model.project.model_dump()

    @cached_property
    def plan(self):
        """The resolved plan of the user's project; the internal solver carries its own plan of the same mesh and sources."""
        from .plan import resolve_plan
        return resolve_plan(self.project)

    @property
    def plan_hash(self):
        return self.plan.plan_hash

    def forward(self,epsilon,frequency_hz,*,block_size=32):
        """Return an ordered mapping from monitor IDs to spectral plane results."""
        return self._planes(epsilon,frequency_hz,block_size,lambda spectral:self.model._run(epsilon,spectral))

    @property
    def layout_reservation_bytes(self):
        arrays=sum(plan['points_um'].nbytes+plan['weights'].nbytes+
            sum(i.nbytes+w.nbytes for i,w in entries) for _,_,plan,entries in self.plans)
        # Include an allowance for indexed Python observations and construction
        # containers, in addition to the retained NumPy interpolation arrays.
        return arrays+1024*len(self.observers)+4096*len(self.plans)

    def _spectral(self,epsilon,frequency_hz,block_size):
        points=sum(len(plan['weights']) for _,_,plan,_ in self.plans)
        maps=sum(i.nbytes+w.nbytes for _,_,_,entries in self.plans for i,w in entries)
        spectral=_PlaneSpectrum(epsilon,self.project.region,self.components,frequency_hz,
                                block_size=block_size,points=points,maps=maps)
        spectral.observers=self.observers
        return spectral

    def _planes(self,epsilon,frequency_hz,block_size,run):
        if self.project.model_dump()!=self._project_snapshot or self.model.project.model_dump()!=self._internal_snapshot:
            raise PlanInvalidated('Plane configuration changed. Rebuild the model to regenerate fixed interpolation and source plans.')
        spectral=self._spectral(epsilon,frequency_hz,block_size)
        result=run(spectral)
        output={}
        for identifier,normal,plan,entries in self.plans:
            fields=[]
            for indices,weights in entries:
                index=torch.as_tensor(indices,device=epsilon.device,dtype=torch.int64)
                weight=torch.as_tensor(weights,device=epsilon.device,dtype=result.fields.dtype if np.iscomplexobj(weights) else epsilon.dtype)
                fields.append((result.fields[:,index]*weight[None,:,:]).sum(dim=1))
            fields=torch.stack(fields,dim=-1)
            output[identifier]=DifferentiablePlaneResult(fields,result.frequency_hz.clone(),
                torch.as_tensor(plan['points_um'],device=epsilon.device,dtype=epsilon.dtype).clone(),
                torch.as_tensor(plan['weights'],device=epsilon.device,dtype=epsilon.dtype).clone(),
                plan['shape'],normal,self.signature,result.report,
                flux_units='reduced E*H * s^2 * '+('m per invariant length' if self.project.region.dimension=='2d' else 'm^2'),
                run_fingerprint=self.fingerprint)
        return output
