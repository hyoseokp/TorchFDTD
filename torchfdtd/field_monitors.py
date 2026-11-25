"""Collocated planar frequency fields and signed reduced Poynting flux.

E and H retain their own Yee sampling locations and half-step timestamps.
Interpolation is trilinear with Bloch phase at cyclic seams. Quadrature uses
clipped physical cell widths, including graded and partially covered cells.
"""
from itertools import product
import numpy as np
import torch
from .spectra import frequency_count,frequency_samples,apodization_window
from .models import effective_limit


def plane_plan(region,monitor,quadrature_counts=None):
    if quadrature_counts is not None:
        if region.dimension!='3d' or monitor.spatial_interpolation=='nearest':
            raise ValueError('Explicit quadrature counts require a 3D interpolated plane.')
        if len(quadrature_counts)!=2 or any(isinstance(n,bool) or not isinstance(n,int) or n<1 for n in quadrature_counts):
            raise ValueError('Quadrature counts must be two positive integers in transverse axis order.')
        counts=iter(quadrature_counts)
    axes=[];widths=[];normal='xyz'.index(monitor.normal)
    for a,nodes in enumerate(region.mesh_nodes):
        if region.dimension=='2d' and a==2:
            axes.append(np.array([0.]));widths.append(np.array([1.]));continue
        if a==normal:
            position=monitor.center[a]
            if monitor.spatial_interpolation=='nearest':position=nodes[np.argmin(abs(nodes-position))]
            axes.append(np.array([position]));widths.append(np.array([1.]));continue
        lo,hi=monitor.center[a]-monitor.size[a]/2,monitor.center[a]+monitor.size[a]/2
        if quadrature_counts is not None:
            edges=np.linspace(lo,hi,next(counts)+1)
            axes.append((edges[:-1]+edges[1:])/2);widths.append(np.diff(edges)*1e-6)
            continue
        edges=np.r_[lo,nodes[(nodes>lo+1e-12)&(nodes<hi-1e-12)],hi]
        # Coalesce adjacent quadrature cells. Keep their full combined width.
        stride=monitor.downsample_xyz[a] if monitor.downsample_xyz is not None else monitor.downsample
        edges=edges[np.r_[np.arange(0,len(edges)-1,stride),len(edges)-1]]
        axes.append((edges[:-1]+edges[1:])/2);widths.append(np.diff(edges)*1e-6)
    points=np.stack([v.ravel() for v in np.meshgrid(*axes,indexing='ij')],axis=1)
    area=np.prod(np.stack(np.broadcast_arrays(*[v.reshape(tuple(-1 if a==i else 1 for a in range(3))) for i,v in enumerate(widths)])),axis=0).ravel()
    return dict(points_um=points,weights=area,shape=tuple(len(a) for a in axes),normal=normal)


def plane_point_count(region,monitor):
    """len(plane_plan(region,monitor)['weights']) from the mesh nodes, without building the plane."""
    count=1;normal='xyz'.index(monitor.normal)
    for a,nodes in enumerate(region.mesh_nodes):
        if (region.dimension=='2d' and a==2) or a==normal:continue
        lo,hi=monitor.center[a]-monitor.size[a]/2,monitor.center[a]+monitor.size[a]/2
        inside=int(np.count_nonzero((nodes>lo+1e-12)&(nodes<hi-1e-12)))
        stride=monitor.downsample_xyz[a] if monitor.downsample_xyz is not None else monitor.downsample
        count*=-(-(inside+1)//stride)
    return count


def interpolation_map(region,component,points):
    from .solver import field_axes
    pairs=[]
    for a,coords in enumerate(field_axes(region,component)):
        x=points[:,a];n=len(coords)
        if n==1:
            pairs.append([(np.zeros(len(x),dtype=int),np.ones(len(x)))]);continue
        low=np.searchsorted(coords,x,side='right')-1;high=low+1
        cyclic=region.boundaries.pair(a)[0].kind in ('periodic','bloch')
        if cyclic:
            length=region.actual_size[a];phase=np.exp(1j*region.bloch_phase[a]) if region.complex_fields else 1.
            lower=coords[low%n]-np.where(low<0,length,0)
            upper=coords[high%n]+np.where(high>=n,length,0)
            q=(x-lower)/(upper-lower)
            pairs.append([(low%n,(1-q)*np.where(low<0,1/phase,1)),(high%n,q*np.where(high>=n,phase,1))])
        else:
            if np.any(x<coords[0]-1e-10) or np.any(x>coords[-1]+1e-10):raise ValueError('Monitor interpolation extends beyond the Yee grid.')
            low=np.clip(low,0,n-2);high=low+1;q=(x-coords[low])/(coords[high]-coords[low])
            pairs.append([(low,1-q),(high,q)])
    indices=[];weights=[];ny,nz=region.shape[1:];c='xyz'.index(component[1].lower())
    for terms in product(*pairs):
        indices.append(((terms[0][0]*ny+terms[1][0])*nz+terms[2][0])*3+c)
        weights.append(terms[0][1]*terms[1][1]*terms[2][1])
    return np.array(indices),np.array(weights)


def point_trace_memory(project):
    """Resident point traces (steps x traces x field dtype) plus their post-processed complex spectra."""
    r=project.region;real=8 if r.precision=='float64' else 4;field=real*(2 if r.complex_fields else 1)
    size=0
    for raw in project.monitors:
        if not raw.enabled or raw.kind!='point':continue
        m=project.resolved_monitor(raw);samples=len(range(0,r.steps,m.time_downsample))
        size+=r.steps*field+16*(frequency_count(m.spectrum) if m.spectrum.sampling!='fft' else samples//2+1)
    return size


def plane_sizes(project):
    """(points, frequencies, components, accumulator bytes per sample) of every enabled plane, within the sample cap."""
    r=project.region;sizes=[]
    cap=effective_limit(project.limits.max_monitor_samples,'monitor_samples')
    for raw in project.monitors:
        if not raw.enabled or raw.kind!='field':continue
        # Counted, not built: the cap is checked before any plane array exists.
        m=project.resolved_monitor(raw);n=plane_point_count(project.region,m);nf=frequency_count(m.spectrum)
        nc=len(m.required_fields)
        if cap is not None and n*nf*nc>cap:raise ValueError(f'{m.name}: frequency field buffer of {n*nf*nc:,} complex samples exceeds the limit of {cap:,}. Reduce frequency points or increase monitor downsampling.')
        sizes.append((n,nf,nc,16 if r.precision=='float64' or m.dft_precision=='float64' else 8))
    return sizes


def monitor_memory(project):
    size=point_trace_memory(project)
    r=project.region;real=8 if r.precision=='float64' else 4
    # The shared CUDA DFT (explicit backend="cuda") keeps no step temporaries: the accumulator,
    # the eight-corner interpolation tables, one sample buffer and the two windows. The Torch
    # update is bounded by four accumulators and 192 bytes of tables per point and component.
    from .cuda_kernels import resolve_cuda_kernel
    fused=r.backend=='cuda' and not r.complex_fields and resolve_cuda_kernel(r,'cuda_monitor_kernel')=='fused'
    for n,nf,nc,sample in plane_sizes(project):
        value=n*nf*nc*sample
        size += value+n*nc*(8*(8+real)+real)+2*r.steps*real if fused else value*4+n*nc*8*24+r.steps*16
    return size


class FrequencyPlane:
    def __init__(self,grid,monitor):
        self.grid=grid;self.monitor=monitor;r=grid.region;self.plan=plane_plan(r,monitor)
        self.frequency=frequency_samples(monitor.spectrum);self.torch=grid.is_torch
        high=r.precision=='float64' or monitor.dft_precision=='float64'
        self.complex_dtype=torch.complex128 if high else torch.complex64
        if not self.torch:self.complex_dtype=np.complex128 if high else np.complex64
        def array(a,dtype=None):
            return torch.as_tensor(a,device=grid.E.device,dtype=dtype) if self.torch else np.asarray(a,dtype=dtype)
        self.maps=[];self.components=monitor.required_fields
        for comp in self.components:
            indices,weights=interpolation_map(r,comp,self.plan['points_um'])
            dtype=self.complex_dtype if np.iscomplexobj(weights) else (grid.E.real.dtype)
            self.maps.append((array(indices,torch.long if self.torch else np.int64),array(weights,dtype)))
        shape=(len(self.frequency),len(self.plan['weights']),len(self.components))
        self.value=torch.zeros(shape,device=grid.E.device,dtype=self.complex_dtype) if self.torch else np.zeros(shape,dtype=self.complex_dtype)
        grid.memory_states.append(self.value)
        self.omega=array(2j*np.pi*self.frequency*r.time_step)
        self.half_phase=array(np.exp(1j*np.pi*self.frequency*r.time_step),self.complex_dtype)
        times=np.arange(1,r.steps+1)*r.time_step
        mask=(np.arange(r.steps)%monitor.time_downsample==0)*monitor.time_downsample
        self.windows=[array(apodization_window(times+shift,monitor.spectrum)*r.time_step*mask,grid.E.real.dtype) for shift in (0,r.time_step/2)]

    def update(self,counter):
        fields=[]
        for comp,(indices,weights) in zip(self.components,self.maps):
            family=int(comp.startswith('H'))
            flat=(self.grid.H if family else self.grid.E).reshape(-1)
            sampled=(flat[indices]*weights).sum(axis=0)
            win=self.windows[family].index_select(0,counter)[0] if self.torch else self.windows[family][counter[0]]
            fields.append(sampled*win)
        if self.torch:
            phase=torch.exp(self.omega*(counter+1)).to(self.complex_dtype)
            values=torch.stack(fields,dim=-1)
        else:
            phase=np.exp(self.omega*(counter[0]+1)).astype(self.complex_dtype)
            values=np.stack(fields,axis=-1)
        ne=sum(c.startswith('E') for c in self.components)
        self.value[...,:ne] += phase[:,None,None]*values[None,:,:ne]
        self.value[...,ne:] += (phase*self.half_phase)[:,None,None]*values[None,:,ne:]

    def result(self):
        values=self.value.detach().cpu().numpy() if self.torch else self.value
        return plane_result(self.monitor,self.plan,self.frequency,self.components,values,self.grid.region.dimension)


def plane_result(monitor,plan,frequency,components,values,dimension):
    """Plane record from accumulated (frequency, point, component) DFT values."""
    values=np.asarray(values).astype(np.complex128)
    by_component={c:values[...,i] for i,c in enumerate(components)}
    density={}
    for axis in set(monitor.record_poynting)|({monitor.normal} if monitor.record_flux else set()):
        i='xyz'.index(axis);b='xyz'[(i+1)%3];c='xyz'[(i+2)%3]
        density[axis]=.5*np.real(by_component['E'+b]*by_component['H'+c].conj()-by_component['E'+c]*by_component['H'+b].conj())
    flux=density[monitor.normal]@plan['weights'] if monitor.record_flux else None
    fields=values[..., [components.index(c) for c in monitor.record_fields]]
    poynting=np.stack([density[c] for c in monitor.record_poynting],axis=-1) if monitor.record_poynting else np.empty((*values.shape[:2],0))
    return dict(id=monitor.id,name=monitor.name,
                frequency_hz=frequency,fields=fields,poynting=poynting,flux=flux,**plan,
                components=list(monitor.record_fields),poynting_components=list(monitor.record_poynting),
                accumulated_components=list(components),time_downsample=monitor.time_downsample,
                settings=monitor.model_dump(),flux_units='reduced E*H * s^2 * '+('m per invariant length' if dimension=='2d' else 'm^2'),
                field_units='reduced field * s',normal_axis=monitor.normal)


class FrequencyUpdates:
    """Select the reference path or shared real CUDA monitor kernels."""
    def __init__(self, monitors):
        monitors = list(monitors)
        from .cuda_kernels import resolve_cuda_kernel
        kernels = [resolve_cuda_kernel(m.grid.region, 'cuda_monitor_kernel') for m in monitors]
        selected = [m for m, kernel in zip(monitors, kernels) if kernel == 'fused']
        self.reference = [m for m, kernel in zip(monitors, kernels) if kernel == 'torch']
        self.fused = []
        if selected:
            if any(not m.torch or not m.grid.E.is_cuda or m.grid.E.is_complex() for m in selected):
                raise ValueError('Fused frequency monitors require real CUDA fields. Use cuda_monitor_kernel="torch" for CPU or Bloch fields.')
            from .cuda_monitors import FusedFrequencyPlanes
            groups={}
            for m in selected:groups.setdefault((m.grid.E.dtype,m.value.dtype,m.grid.E.device),[]).append(m)
            self.fused=[FusedFrequencyPlanes(group) for group in groups.values()]

    def update(self, counter):
        for monitor in self.reference:
            monitor.update(counter)
        for fused in self.fused:fused.update(counter)


def normalize_flux(sample,reference,*,subtract_incident=False,min_reference_fraction=.01):
    """Ratio to positive reference power; optionally subtract incident FIELDS.

Use subtract_incident on a reflection monitor. Signed flux is retained, so a
reflected -x wave has a negative ratio on an x-normal monitor. This routine
does not infer direction, absolute source calibration or absorption.
"""
    if not 0<min_reference_fraction<1:raise ValueError('Reference threshold must lie between 0 and 1.')
    for key in ('frequency_hz','points_um','weights'):
        if np.shape(sample[key])!=np.shape(reference[key]) or not np.allclose(sample[key],reference[key],rtol=1e-10,atol=0):
            raise ValueError(f'Reference {key} must match the sample monitor.')
    if sample['normal_axis']!=reference['normal_axis']:raise ValueError('Reference monitor normal differs.')
    if sample['settings'].get('time_downsample',1)!=reference['settings'].get('time_downsample',1):
        raise ValueError('Reference temporal downsampling must match.')
    if sample['settings']['spectrum']['apodization']!='none' or reference['settings']['spectrum']['apodization']!='none':
        raise ValueError('Power normalization requires unapodized sample and reference fields.')
    if sample.get('run_signature')!=reference.get('run_signature') or not sample.get('run_signature'):
        raise ValueError('Reference run settings, sources, mesh and duration must match.')
    if sample['flux'] is None or reference['flux'] is None:
        raise ValueError('Power normalization requires recorded flux in both monitors.')
    axis='xyz'.index(sample['normal_axis'])
    if subtract_incident:
        fields=[]
        for comp in ('E'+'xyz'[(axis+1)%3],'E'+'xyz'[(axis+2)%3],'H'+'xyz'[(axis+1)%3],'H'+'xyz'[(axis+2)%3]):
            arrays=[]
            for m in (sample,reference):
                names=m.get('components',['Ex','Ey','Ez','Hx','Hy','Hz'])
                if comp not in names:raise ValueError('Incident subtraction requires stored tangential E/H components. Enable them and rerun.')
                arrays.append(m['fields'][...,names.index(comp)])
            fields.append(arrays[0]-arrays[1])
        density=.5*np.real(fields[0]*fields[3].conj()-fields[1]*fields[2].conj())
        flux=density@sample['weights']
    else:flux=sample['flux']
    denominator=abs(reference['flux'])
    valid=(denominator>min_reference_fraction*denominator.max())&(denominator>0)
    ratio=np.full(len(flux),np.nan);ratio[valid]=flux[valid]/denominator[valid]
    # Every NaN names its guard (docs/NUMERICAL_GUARDS.md); nothing is clipped to the threshold.
    reasons=np.where(denominator<=0,'reference is zero',
                     np.where(valid,None,f'reference below {min_reference_fraction:g} of its band peak: no supported ratio')).astype(object)
    return dict(frequency_hz=sample['frequency_hz'],ratio=ratio,valid=valid,subtract_incident=subtract_incident,reasons=reasons)
