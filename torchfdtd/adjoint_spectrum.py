"""Online linear DFT observations and their real-input discrete transpose."""
import copy
from dataclasses import dataclass

import torch


@dataclass
class DifferentiableSpectrum:
    fields: torch.Tensor
    frequency_hz: torch.Tensor
    monitor_components: tuple[str, ...]
    report: dict


class SpectralObservation:
    """Fixed frequencies/window. No timestep-by-frequency table is retained."""
    def __init__(self, epsilon, region, components, frequency_hz, window=None, block_size=32):
        if not isinstance(epsilon, torch.Tensor) or epsilon.dtype not in (torch.float32, torch.float64):
            raise ValueError('epsilon must be a real float32 or float64 torch Tensor.')
        self.components = tuple(components)
        self.steps, self.dt = region.steps, region.time_step
        if isinstance(block_size,bool) or not isinstance(block_size,int) or block_size<1:
            raise ValueError('Spectral block_size must be a positive integer.')
        self.block_size=min(block_size,self.steps)
        self.dtype, self.device = epsilon.dtype, epsilon.device
        self.complex_dtype = torch.complex128 if self.dtype == torch.float64 else torch.complex64
        self.complex_samples=region.complex_fields
        self.frequency = self._fixed(frequency_hz, 'Frequencies').reshape(-1)
        if not self.frequency.numel() or not bool(torch.isfinite(self.frequency).all()) or bool((self.frequency <= 0).any()):
            raise ValueError('Frequencies must be nonempty, finite and positive.')
        if bool((self.frequency*self.dt >= .5).any()):
            raise ValueError('Frequencies must be below temporal Nyquist.')
        self.window = None if window is None else self._fixed(window, 'Window')
        if self.window is not None and (self.window.shape != (self.steps,) or not bool(torch.isfinite(self.window).all())):
            raise ValueError('Window must contain one finite weight per timestep.')
        self.groups = {family: [i for i, c in enumerate(self.components) if c[0] == family] for family in ('E', 'H')}
        self.observers = None
        self._index_tensors = {}

    def _fixed(self, value, name):
        if isinstance(value, torch.Tensor) and value.requires_grad:
            raise ValueError(f'{name} are fixed observation settings, not differentiable inputs.')
        original = torch.as_tensor(value, device=self.device)
        if original.is_complex():raise ValueError(f'{name} must be real.')
        # Convert the original values directly, avoiding a default-FP32 roundtrip
        # when a Python sequence is used for an FP64 calculation.
        return torch.as_tensor(value,device=self.device,dtype=self.dtype).detach().clone()

    def restricted(self, columns):
        """The same observation for the listed component columns only, e.g. one slab's samples."""
        local = copy.copy(self)
        local.components = tuple(self.components[i] for i in columns)
        local.groups = {family: [i for i, c in enumerate(local.components) if c[0] == family] for family in ('E', 'H')}
        local._index_tensors = {}
        return local

    def zeros(self):
        return torch.zeros((self.frequency.numel(), len(self.components)), dtype=self.complex_dtype, device=self.device)

    def kernel(self, start, stop, family):
        times = (torch.arange(start, stop, dtype=self.dtype, device=self.device)+1)*self.dt
        if family == 'H':times = times+self.dt/2
        kernel = torch.exp(-2j*torch.pi*self.frequency[:, None]*times[None, :])*self.dt
        if self.window is not None:kernel = kernel*self.window[None, start:stop]
        return kernel

    def _index(self, family):
        # Built once per observation: indexing with the Python list converted
        # it element by element on every block. Same elements, same order.
        index = self._index_tensors.get(family)
        if index is None:
            index = self._index_tensors[family] = torch.tensor(self.groups[family], dtype=torch.long, device=self.device)
        return index

    def accumulate(self, output, samples, start):
        stop = start+samples.shape[0]
        for family, indices in self.groups.items():
            if indices:
                index = self._index(family)
                output[:, index] += self.kernel(start, stop, family)@samples[:, index].to(self.complex_dtype)

    def transpose(self, seed, start, stop):
        result = torch.empty((stop-start, len(self.components)), dtype=self.complex_dtype if self.complex_samples else self.dtype, device=self.device)
        for family, indices in self.groups.items():
            if indices:
                index = self._index(family)
                values=self.kernel(start, stop, family).conj().T@seed[:, index]
                result[:, index] = values if self.complex_samples else values.real
        return result

    def reservation(self, depth):
        item = torch.empty((), dtype=self.dtype, device='cpu').element_size()
        f, m = self.frequency.numel(), len(self.components)
        output = 2*f*m*item
        # Returned values + seed + accumulator/product/gather temporaries,
        # bounded phase/kernel/transpose workspace and optional cloned window.
        workspace = (8*f*m+12*f*depth+4*depth*m+4*depth+f)*item
        if self.complex_samples:workspace*=2
        window = 0 if self.window is None else self.steps*item
        return dict(spectral_output_bytes=output, spectral_workspace_bytes=workspace,
                    spectral_settings_bytes=window+f*item,
                    spectral_reservation_bytes=2*output+workspace+window+f*item)

    def result(self, fields, report):
        return DifferentiableSpectrum(fields, self.frequency.clone(), self.components, report)
