"""Direct, order-preserving E/H sampling into a recorded observation block."""
import torch

from .cuda_kernels import _compile, _direct_cuda_view


def recorder(system, samples):
    """Bind stable field/output storage for the recorded CPML forward loop.

    Each monitor has its own output location, including coincident monitors.
    This is a copy of the field bits, with no reduction or arithmetic.
    """
    if not samples.is_cuda or system.face_observation_maps:
        def record(row):
            samples[row].copy_(system.observe(system.state()))
        return record
    return _CUDARecorder(system, samples)


class _CUDARecorder:
    def __init__(self, system, samples):
        import cupy
        import numpy as np
        self.cp, self.device = cupy, samples.device.index
        self.count = len(system.monitors)
        self.rows = samples.shape[0]
        if (samples.dtype not in (torch.float32, torch.complex64) or
                not samples.is_contiguous() or samples.shape != (self.rows, self.count)):
            raise ValueError('Recorded observations require a contiguous FP32 E/H sample block.')
        if self.count >= 2**31:
            raise ValueError('Recorded observation count exceeds the CUDA launch index range.')
        # Encode E/H in the low bit of a field index. The CPU layout is built
        # from monitor metadata, avoiding a device-to-host index transfer.
        shape = system.shape
        mapping = np.empty(self.count, dtype=np.int64)
        for i, (name, loc, component) in enumerate(system.monitors):
            index = 3*((loc[0]*shape[1]+loc[1])*shape[2]+loc[2])+component
            mapping[i] = 2*index + int(name[0] == 'H')
        self.mapping = torch.from_numpy(mapping).to(samples.device)
        word = 'unsigned long long' if samples.is_complex() else 'unsigned int'
        source = '''extern "C" __global__ void record_samples(
            const WORD* __restrict__ e, const WORD* __restrict__ h,
            WORD* __restrict__ samples, const long long* __restrict__ map,
            const int count, const int row) {
            const int i=blockIdx.x*blockDim.x+threadIdx.x;
            if(i>=count)return;
            const long long code=map[i];
            samples[(long long)row*count+i]=(code&1 ? h : e)[code>>1];
        }'''.replace('WORD', word)
        with cupy.cuda.Device(self.device), self.stream():
            self.fn, self.module = _compile(source, self.device,
                cupy.cuda.Device(self.device).compute_capability, 'record_samples')
            self.arrays = tuple(_direct_cuda_view(cupy, value) for value in
                (system.grid.E, system.grid.H, samples, self.mapping)) + (np.int32(self.count),)
            self.engine = getattr(system, 'fused_eh', None)
            if self.engine is not None:
                self.parity_arrays = [tuple(_direct_cuda_view(cupy, value) for value in
                    (self.engine.E[p], self.engine.H[p])) + self.arrays[2:] for p in (0, 1)]

    def stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream,
                                           device_id=self.device)

    def __call__(self, row):
        import numpy as np
        if not 0 <= row < self.rows:
            raise ValueError('Recorded observation row is outside the sample block.')
        if self.count:
            with self.cp.cuda.Device(self.device), self.stream():
                arrays = self.arrays if self.engine is None else self.parity_arrays[self.engine.parity]
                self.fn(((self.count+255)//256,), (256,), (*arrays, np.int32(row)))
