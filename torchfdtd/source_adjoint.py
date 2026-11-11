"""Fixed-profile source waveform and dielectric VJPs with bounded checkpoint replay."""
from __future__ import annotations

import hashlib
import numpy as np
import torch

from .differentiable import AdjointOptions, DifferentiableSimulation, _System
from .adjoint_planes import DifferentiablePlaneSimulation
from .adjoint_memory import _resident_reservation, _resident_contract
from .waveforms import source_time_signal


class _SourceSystem(_System):
    def __init__(self, project, epsilon, *, carrier, wave_shape, wave_complex, layout,
                 observation_monitors=None):
        self.material_shape=tuple(epsilon.shape)
        self.material_elements=epsilon.numel()
        self.waveform_shape=wave_shape
        self.waveform_complex=wave_complex
        super().__init__(project, epsilon, observation_monitors=observation_monitors)
        waves=self.waveform_gradient(carrier)
        counters={'E':0,'H':0}
        columns=[]
        for column,term in enumerate(layout):
            family=term['component'][0]
            index=counters[family]; counters[family]+=1
            loc,component,_,profile=self.sources[family][index]
            self.sources[family][index]=(loc,component,waves[:,column],profile)
            columns.append((family,index,column))
        self.source_columns=tuple(columns)

    def material_gradient_view(self, packed):
        return packed[:self.material_elements].view(self.material_shape)

    epsilon_gradient=material_gradient_view

    def waveform_gradient(self, packed):
        offset=self.material_elements+(self.material_elements%2 if self.waveform_complex else 0)
        tail=packed[offset:]
        if self.waveform_complex:
            return torch.view_as_complex(tail.view(*self.waveform_shape,2))
        return tail.view(self.waveform_shape)

    def accumulate_waveform_gradient(self, family, field_bar, packed, step):
        gradient=self.waveform_gradient(packed)
        for kind,index,column in self.source_columns:
            if kind!=family:continue
            loc,component,_,profile=self.sources[kind][index]
            value=field_bar[loc+(component,)]
            seed=value.sum() if profile is None else (profile.conj()*value).sum()
            gradient[step,column].add_(seed if self.waveform_complex else seed.real)

    def fused_adjoint(self, gradient, signal_bar):
        from .source_adjoint_cuda import SourceFusedAdjointCUDA
        return SourceFusedAdjointCUDA(self,gradient,signal_bar)

    def transpose_accumulate(self,state,adjoint,signal_bar,gradient,step):
        e_bar,h_bar,*psi_bar=adjoint
        for target,(positions,indices) in zip((e_bar,h_bar),self.observation_maps):
            if indices.numel():target.reshape(-1).index_add_(0,indices,signal_bar.index_select(0,positions))
        self.accumulate_waveform_gradient('H',h_bar,gradient,step)
        contribution,psi_bar=self.curl_transpose(-self.grid.courant_number*h_bar,psi_bar,True)
        e_bar=e_bar+contribution
        self.accumulate_waveform_gradient('E',e_bar,gradient,step)
        curl_e,_=self.curl(state[1],state[2:],False)
        full=-self.grid.courant_number*(e_bar.conj()*curl_e).real/self.eps4.square()
        part=full.sum_to_size(self.eps4.shape)
        if self.epsilon.ndim==3:part=part[...,0]
        self.material_gradient_view(gradient).add_(part)
        contribution,psi_bar=self.curl_transpose(self.grid.courant_number/self.eps4*e_bar,psi_bar,False)
        return (e_bar,h_bar+contribution,*psi_bar)


class SourceWaveformSimulation(DifferentiableSimulation):
    """Train additive temporal increments, with fixed source geometry/profiles.

    Columns follow enabled source order then native polarization term order.
    Complex fields accept real or complex increments. Positions are not trainable.
    """
    def __init__(self,project,options=None,*,decomposition=None):
        if options is not None and not isinstance(options,AdjointOptions):
            raise ValueError('Source waveform derivatives require resident AdjointOptions.')
        super().__init__(project,options,decomposition=decomposition)
        from .boundaries import reject_pmc_faces
        reject_pmc_faces(self.project.region,'SourceWaveformSimulation')
        layout=[]
        for raw in self.project.sources:
            source=self.project.resolved_source(raw)
            if not source.enabled:continue
            if source.kind not in ('point','plane') or source.injection!='soft':
                raise ValueError('Waveform derivatives support ordinary soft point/plane sources only.')
            for ordinal,(component,weight) in enumerate(source.polarization_components):
                layout.append(dict(source_id=source.id,component=component,ordinal=ordinal,
                    polarization_weight=weight,time_offset_steps=source.time_offset_steps))
        if not layout:raise ValueError('At least one enabled soft source is required.')
        self._layout=tuple(layout)
        self._configuration=self.project.model_dump()

    def _check_fixed(self):
        if self.project.model_dump()!=self._configuration:
            raise ValueError('Source configuration changed. Rebuild the simulation.')

    @property
    def term_layout(self):
        return tuple(dict(term) for term in self._layout)

    def source_times(self,device='cpu'):
        self._check_fixed()
        r=self.project.region
        dtype=torch.float64 if r.precision=='float64' else torch.float32
        _resident_reservation(self.project,self.options,torch.device(device),
            parameter_elements=r.steps*len(self._layout))
        times=np.arange(1,r.steps+1,dtype=np.float64)[:,None]*r.time_step
        times=times+np.asarray([t['time_offset_steps'] for t in self._layout])[None,:]*r.time_step
        return torch.tensor(times,device=device,dtype=dtype)

    def default_waveforms(self,device='cpu'):
        self._check_fixed()
        r=self.project.region
        _resident_reservation(self.project,self.options,torch.device(device),
            parameter_elements=r.steps*len(self._layout))
        columns=[]
        for raw in self.project.sources:
            source=self.project.resolved_source(raw)
            if not source.enabled:continue
            times=np.arange(1,r.steps+1)*r.time_step+source.time_offset_steps*r.time_step
            wave=source_time_signal(source,times)
            columns.extend(wave*weight for _,weight in source.polarization_components)
        dtype=torch.float64 if r.precision=='float64' else torch.float32
        return torch.tensor(np.stack(columns,axis=1),device=device,dtype=dtype)

    def _pack(self,epsilon,waveforms,spectral=None):
        self._check_fixed()
        r=self.project.region
        _resident_contract(r,self.options)
        dtype=torch.float64 if r.precision=='float64' else torch.float32
        if not isinstance(epsilon,torch.Tensor) or epsilon.dtype!=dtype or epsilon.device.type not in ('cpu','cuda'):
            raise ValueError('epsilon must match project real precision on CPU or CUDA.')
        if tuple(epsilon.shape) not in (r.shape,r.shape+(3,)):
            raise ValueError('epsilon shape must match the grid, optionally three diagonal components.')
        if not isinstance(waveforms,torch.Tensor) or tuple(waveforms.shape)!=(r.steps,len(self._layout)):
            raise ValueError('waveforms must have shape (steps, prepared source terms).')
        if waveforms.device!=epsilon.device or waveforms.real.dtype!=dtype:
            raise ValueError('waveforms must match epsilon device and real precision.')
        if waveforms.is_complex() and not r.complex_fields:
            raise ValueError('Complex waveforms require complex fields.')
        padding=epsilon.numel()%2 if waveforms.is_complex() else 0
        count=epsilon.numel()+padding+waveforms.numel()*(2 if waveforms.is_complex() else 1)
        _resident_reservation(self.project,self.options,epsilon.device,spectral,parameter_elements=count)
        if not bool(torch.isfinite(epsilon).all()) or bool((epsilon<1).any()):
            raise ValueError('epsilon must be finite and at least one.')
        if not bool(torch.isfinite(waveforms).all()):raise ValueError('waveforms must be finite.')
        wave_lanes=torch.view_as_real(waveforms.resolve_conj()) if waveforms.is_complex() else waveforms
        carrier=torch.cat((epsilon.reshape(-1),epsilon.new_zeros(padding),wave_lanes.reshape(-1)))
        return carrier,count

    def _evaluate(self,epsilon,waveforms,spectral):
        carrier,count=self._pack(epsilon,waveforms,spectral)
        owned=carrier[:epsilon.numel()].view(epsilon.shape)
        def factory(project,value,**kwargs):
            return _SourceSystem(project,value,carrier=carrier,wave_shape=tuple(waveforms.shape),
                wave_complex=waveforms.is_complex(),layout=self._layout,**kwargs)
        result=super()._run(owned,spectral,system_factory=factory,autograd_input=carrier,
                            material_parameter_elements=count)
        result.report.update(source_waveform_shape=list(waveforms.shape),
            source_waveform_complex=waveforms.is_complex(),source_parameter_elements=count,
            source_term_layout=self.term_layout,source_reduction='one support and one row at a time')
        return result

    def forward(self,epsilon,waveforms):
        return self._evaluate(epsilon,waveforms,None)

    def spectrum(self,epsilon,waveforms,frequency_hz,*,window=None,block_size=32):
        from .adjoint_spectrum import SpectralObservation
        spectral=SpectralObservation(epsilon,self.project.region,
            [m.component for m in self.project.monitors if m.enabled],frequency_hz,window,block_size)
        return self._evaluate(epsilon,waveforms,spectral)

    def reference(self,epsilon,waveforms,*,graph_budget_bytes=None):
        """Full-autograd oracle, admitted by its estimated graph memory; graph_budget_bytes caps it."""
        from .oracle_memory import admit_oracle,oracle_graph_bytes
        admit_oracle(oracle_graph_bytes(self.project.region,'yee',material_elements=epsilon.numel(),source_terms=len(self._layout)),
                     epsilon.device,graph_budget_bytes)
        carrier,_=self._pack(epsilon,waveforms)
        owned=carrier[:epsilon.numel()].view(epsilon.shape)
        system=_SourceSystem(self.project.model_copy(deep=True),owned,carrier=carrier,
            wave_shape=tuple(waveforms.shape),wave_complex=waveforms.is_complex(),layout=self._layout)
        state=tuple(torch.zeros_like(x) for x in system.state())
        signals=[]
        for step in range(system.region.steps):
            state=system.reference_step(state,step,owned)
            signals.append(system.observe(state))
        return torch.stack(signals)


class SourceWaveformPlaneSimulation(DifferentiablePlaneSimulation):
    """Fixed collocated six-field planes with online DFT and waveform VJPs.

    As with DifferentiablePlaneSimulation, host interpolation maps are constructed
    at initialization. Execution uses bounded blocks rather than a time history.
    """
    _resident_model_type=SourceWaveformSimulation

    def __init__(self,project,options=None,*,quadrature_counts=None):
        if options is not None and not isinstance(options,AdjointOptions):
            raise ValueError('Source waveform planes require resident AdjointOptions.')
        super().__init__(project,options,quadrature_counts=quadrature_counts)

    @property
    def term_layout(self):return self.model.term_layout

    def source_times(self,device='cpu'):return self.model.source_times(device)

    def default_waveforms(self,device='cpu'):return self.model.default_waveforms(device)

    def forward(self,epsilon,waveforms,frequency_hz,*,block_size=32):
        result=self._planes(epsilon,frequency_hz,block_size,
            lambda spectral:self.model._evaluate(epsilon,waveforms,spectral))
        # Hash bounded row blocks after admission, without a device-wide host
        # copy or retaining live parameter references in normalization metadata.
        digest=hashlib.sha256(str((waveforms.dtype,tuple(waveforms.shape),self.term_layout)).encode())
        rows_per_block=max(1,(64*1024)//(waveforms.shape[1]*waveforms.element_size()))
        detached=waveforms.detach()
        for start in range(0,waveforms.shape[0],rows_per_block):
            block=detached[start:start+rows_per_block]
            digest.update(block.resolve_conj().contiguous().cpu().numpy().tobytes())
        signature=self.signature+':source-waveforms:'+digest.hexdigest()
        for plane in result.values():
            plane.run_signature=signature
            plane.run_fingerprint=self.fingerprint+':source-waveforms:'+digest.hexdigest()
        return result
