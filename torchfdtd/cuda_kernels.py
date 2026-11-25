"""Optional, independently implemented fused Yee/CPML CUDA updates.

One kernel updates E and another updates H, with source injection between them.
The stream boundary supplies the necessary global ordering. CPML memory lives
only in boundary slabs. No full-volume derivative or curl temporary is created.
Torch owns every array. CuPy supplies NVRTC compilation and zero-copy launches.
This forward-only implementation deliberately does not advertise autograd.
"""
from __future__ import annotations

import math
import weakref
from functools import lru_cache

import torch

from .boundaries import CURL_TERMS, extended_shape, is_nodal


def _direct_cuda_view(cupy, tensor):
    """Internal contiguous view for kernels launched on the current Torch stream.

    Torch owns the allocation and records the consumer stream. CuPy only wraps
    its pointer and retains a detached tensor owner. This avoids a DLPack stream
    negotiation for every small coefficient view in a short-lived slab.
    """
    dtypes = {torch.float32:'float32', torch.float64:'float64',
              torch.complex64:'complex64', torch.complex128:'complex128', torch.int64:'int64'}
    if not tensor.is_cuda or not tensor.is_contiguous() or tensor.dtype not in dtypes:
        raise ValueError('Direct CUDA views require contiguous CUDA real/complex FP32/FP64 or int64 tensors.')
    if tensor.is_conj() or tensor.is_neg():
        raise ValueError('Direct CUDA views require resolved conjugate/negative storage.')
    tensor.record_stream(torch.cuda.current_stream(tensor.device))
    memory = cupy.cuda.UnownedMemory(tensor.data_ptr(), tensor.numel()*tensor.element_size(),
                                    tensor.detach(), device_id=tensor.device.index)
    return cupy.ndarray(tensor.shape, dtype=dtypes[tensor.dtype],
                        memptr=cupy.cuda.MemoryPointer(memory, 0))


@lru_cache(maxsize=64)
def _compile(source, device, capability, kernel_name='yee_update'):
    # CuPy RawKernel unconditionally adds -ftz=true. FDTD weak fields must
    # retain subnormals, so use the NVRTC API with explicit IEEE options.
    # Compilation stays entirely in memory and needs no include files.
    from cupy_backends.cuda.libs import nvrtc
    from cupy.cuda.function import Module
    program = nvrtc.createProgram(source, 'torchfdtd_yee.cu', (), ())
    try:
        options = ('--std=c++11', '--fmad=false', '--ftz=false',
                   '--gpu-architecture=compute_'+capability)
        try:
            nvrtc.compileProgram(program, options)
        except Exception as exc:
            raise RuntimeError('CUDA kernel compilation failed: '+nvrtc.getProgramLog(program)) from exc
        ptx = nvrtc.getPTX(program)
    finally:
        nvrtc.destroyProgram(program)
    module = Module()
    module.load(ptx)
    return module.get_function(kernel_name), module


def fused_kernels_available():
    """Whether CuPy imports and compiles and loads a kernel for the current CUDA device."""
    if not torch.cuda.is_available() or not torch.cuda.device_count():
        return False
    from .cuda_bootstrap import prepare_cuda_kernels
    device = torch.cuda.current_device()
    try:
        cupy = prepare_cuda_kernels()
        with cupy.cuda.Device(device):
            _compile('extern "C" __global__ void yee_update() {}', device, cupy.cuda.Device(device).compute_capability)
    except Exception:  # noqa: BLE001 - CuPy, NVRTC or driver: the Torch kernels run instead
        return False
    return True


def resolve_cuda_kernel(region, field='cuda_kernel'):
    """The kernel a resident run uses for 'cuda_kernel' or 'cuda_monitor_kernel': the explicit choice, or for 'auto'
    the fused kernels where they support the scene and work here, else the Torch kernels."""
    choice = getattr(region, field)
    if choice != 'auto':
        return choice
    supported = region.backend != 'cpu' and not region.complex_fields and 3*math.prod(region.shape) < 2**31
    return 'fused' if supported and fused_kernels_available() else 'torch'


class FusedYeeCUDA:
    """Specialize a real-valued grid while retaining its CPML and ADE states."""

    complex_fields = False

    def __init__(self, grid, *, direct_views=False, bindings_cache=None,
                 cells_per_thread=1, block_size=None, report=None):
        from .reversible_cuda_tuning import validate_cells_per_thread
        validate_cells_per_thread(cells_per_thread)
        if block_size is not None and block_size != 'auto' and (
                type(block_size) is not int or block_size not in (128, 256, 512, 1024)):
            raise ValueError('block_size must be None, auto, 128, 256, 512 or 1024.')
        if not grid.is_torch or not grid.E.is_cuda:
            raise ValueError('The fused CUDA kernel requires backend="cuda" and a CUDA GPU.')
        if grid.E.is_complex() and not self.complex_fields:
            raise ValueError('The fused CUDA kernel currently supports real fields. Select cuda_kernel="torch" for Bloch fields.')
        # The original per-entry body uses signed 32-bit component offsets.
        # Multi-cell launch arithmetic does not expand that admission contract.
        if (6 if self.complex_fields else 3)*math.prod(grid.E.shape[:3]) >= 2**31:
            raise ValueError('CUDA field indexing exceeds the signed 32-bit range.')
        try:
            import cupy
        except ImportError as exc:
            raise RuntimeError('Install torchfdtd[cuda-kernels] to use the fused CUDA kernel.') from exc
        self.cp = cupy
        self._grid = weakref.ref(grid)
        self.device = grid.E.device.index
        self.launches = {}
        self.interface_update=None
        if getattr(grid,'subpixel',None) is not None:
            from .cuda_subpixel import SubpixelCUDA
            self.interface_update=SubpixelCUDA([grid])
        # Compile and create all views before CUDA graph capture. Keep ownership
        # in both the grid and DLPack views for the complete graph lifetime.
        with cupy.cuda.Device(self.device), self._stream():
            for forward in (False, True):
                source, tensors = self._source(forward)
                kernel, module = _compile(source, self.device, cupy.cuda.Device(self.device).compute_capability)
                view = lambda t: _direct_cuda_view(cupy, t) if direct_views else cupy.from_dlpack(t.detach())
                arrays = bindings_cache.cuda_arguments(source, tensors, view) if bindings_cache is not None else tuple(view(t) for t in tensors)
                self.launches[forward] = kernel, arrays, module
        if cells_per_thread != 1 or block_size is not None:
            from .reversible_cuda_tuning import tune_yee
            tune_yee(self, block_size, report, cells_per_thread=cells_per_thread)

    @property
    def grid(self):
        grid = self._grid()
        if grid is None:
            raise RuntimeError('The CUDA grid is no longer alive.')
        return grid

    def _stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream, device_id=self.device)

    @staticmethod
    def launch_count(grid, forward):
        """Volume cells plus the stored upper PMC faces/edges updated by this launch."""
        blocks = getattr(grid, 'pmc_blocks', None)
        faces = sum(math.prod(shape) for _, _, shape in blocks['H' if forward else 'E']) if blocks else 0
        return math.prod(grid.E.shape[:3])+faces

    def _source(self, forward):
        g = self.grid
        shape = tuple(g.E.shape[:3])
        strides = (shape[1]*shape[2], shape[2], 1)
        real = 'double' if g.E.dtype == torch.float64 else 'float'
        tensors, parameters = [], []

        def argument(name, tensor, write=False):
            if not tensor.is_contiguous():
                raise ValueError('Fused CUDA arrays must be contiguous.')
            if tensor.dtype != g.E.dtype or tensor.device != g.E.device:
                raise ValueError('Fused CUDA arrays must have one real dtype and device.')
            tensors.append(tensor)
            parameters.append(f'{"" if write else "const "}{real}* __restrict__ {name}')
            return name

        argument('src', g.E if forward else g.H)
        argument('dst', g.H if forward else g.E, True)
        subpixel=not forward and getattr(g,'subpixel',None) is not None
        if subpixel:argument('curl_buffer',g.subpixel.curl_buffer,True)
        inverse = g.inverse_permeability if forward else g.inverse_permittivity
        argument('inverse', inverse)
        # PMC/symmetric walls: lower walls mirror inside the volume, upper walls
        # keep stored face/edge blocks that receive their own threads below.
        pmc_lower = getattr(g, 'pmc_lower', {})
        pmc_upper = getattr(g, 'pmc_upper', {})
        upper_axes = tuple(pmc_upper)
        blocks = getattr(g, 'pmc_blocks', None) if (pmc_lower or pmc_upper) else None
        family_in, family_out = ('E', 'H') if forward else ('H', 'E')
        faces_in = faces_out = ()
        if blocks:
            faces_in = tuple(argument(f'fin{k}', value) for k, value in enumerate(g.faces[family_in]))
            faces_out = tuple(argument(f'fout{k}', value, True) for k, value in enumerate(g.faces[family_out]))
            if not forward:
                for k, value in enumerate(g.face_inverse_permittivity):argument(f'finv{k}', value)
        count = math.prod(shape)
        lines = [f'const int i = blockIdx.x * blockDim.x + threadIdx.x;',
                 f'if (i >= {count}) return;',
                 f'const int x = i / {strides[0]};',
                 f'const int y = (i / {strides[1]}) % {shape[1]};',
                 f'const int z = i % {shape[2]};',
                 f'{real} c0=0, c1=0, c2=0;']
        metrics, segments = {}, {}
        for term, (axis, comp, out, sign) in enumerate(CURL_TERMS):
            n, stride = shape[axis], strides[axis]
            if n == 1:
                continue
            coord = 'xyz'[axis]
            guard = f'{coord} < {n-1}' if forward else f'{coord} > 0'
            high = f'i+{stride}' if forward else 'i'
            low = 'i' if forward else f'i-{stride}'
            lines.extend(['{', f'{real} d=0;', f'if ({guard}) {{',
                          f'd = src[3*({high})+{comp}] - src[3*({low})+{comp}];'])
            metric = g.metric.get((forward, axis))
            if metric:
                name = argument(f'metric{term}', metric[0])
                metrics[term] = name
                lines.append(f'd *= {name}[{coord}{"" if forward else "-1"}];')
            active_start = 0 if forward else 1
            # Auxiliary rows follow the derivative target, including its stored
            # upper PMC nodes on transverse axes. Without PMC this is the grid.
            target_shape = extended_shape(shape, upper_axes, family_out, out)
            segments[term] = []
            for si, seg in enumerate(g.cpml.get((forward, axis, comp), [])):
                lo = seg['slice'][axis].start + active_start
                hi = seg['slice'][axis].stop + active_start
                psi = argument(f'psi{term}_{si}', seg['psi'], True)
                b, c, inv_k = [argument(f'{key}{term}_{si}', seg[key]) for key in ('b', 'c', 'inv_k')]
                segments[term].append((lo, hi, psi, b, c, inv_k))
                coords = ['x', 'y', 'z']
                coords[axis] = f'({coord}-{lo})'
                slab = list(target_shape)
                slab[axis] = hi-lo
                index = f'({coords[0]}*{slab[1]}+{coords[1]})*{slab[2]}+{coords[2]}'
                lines.extend([f'if ({coord} >= {lo} && {coord} < {hi}) {{',
                              f'const int p = {index};', f'const int q = {coord}-{lo};',
                              f'{real} memory = {psi}[p]*{b}[q] + {c}[q]*d;',
                                  *([f'{psi}[p] = memory;'] if getattr(self,'write_cpml',True) else []), f'd = d*{inv_k}[q] + memory;', '}'])
            lines.append('}')
            if axis in g.wrap:
                if g.wrap[axis] != 1:
                    raise ValueError('Complex wrapping is not supported by the fused kernel.')
                first = f'i-{(n-1)*stride}' if forward else 'i'
                last = 'i' if forward else f'i+{(n-1)*stride}'
                lines.extend(['else {', f'd = src[3*({first})+{comp}] - src[3*({last})+{comp}];'])
                if metric:
                    lines.append(f'd *= ({real})({metric[1]:.17g});')
                lines.append('}')
            elif forward and axis in pmc_upper:
                # The last magnetic half cell differences the stored wall E.
                k, (_, _, face_shape) = next((k, block) for k, block in enumerate(blocks['E'])
                                             if block[0] == comp and block[1] == (axis,))
                coords = ['x', 'y', 'z']
                coords[axis] = '0'
                index = f'({coords[0]}*{face_shape[1]}+{coords[1]})*{face_shape[2]}+{coords[2]}'
                lines.extend(['else {', f'd = ({real})({pmc_upper[axis]:.17g})*(fin{k}[{index}] - src[3*i+{comp}]);', '}'])
            elif forward and axis in getattr(g,'pec_upper',{}):
                factor=g.pec_upper[axis]
                lines.extend(['else {',f'd = -({real})({factor:.17g})*src[3*i+{comp}];','}'])
            elif not forward and axis in pmc_lower:
                lines.extend(['else {', f'd = 2*({real})({pmc_lower[axis]:.17g})*src[3*i+{comp}];', '}'])
            lines.extend([f'c{out} += {"-" if sign < 0 else ""}d;', '}'])
        finish=getattr(self,'_update_statements',None)
        # Tensor cohorts build templates from a minimal grid-only proxy.
        lines.extend(FusedYeeCUDA._update_statements(self,forward,inverse,argument,real,subpixel=subpixel)
                     if finish is None else finish(forward,inverse,argument,real,subpixel=subpixel))
        if blocks:
            lines[1:2] = FusedYeeCUDA._face_threads(self, forward, shape, real, blocks, faces_in, faces_out, metrics,
                                                    segments, pmc_lower, pmc_upper, getattr(g, 'pec_upper', {}), count)
        return ('extern "C" __global__ void yee_update(' + ', '.join(parameters) + ') {\n' + '\n'.join(lines) + '\n}'), tensors

    def _face_threads(self, forward, shape, real, blocks, faces_in, faces_out, metrics, segments,
                      pmc_lower, pmc_upper, pec_upper, count):
        """Threads past the volume update one stored upper PMC face or edge entry each.

        Every neighbour read resolves an extended Yee index to the volume, a
        stored block, or the omitted upper PEC zero. Wall derivatives use the
        mirrored half cell, +-2 H_wall / dx_wall, exactly as the Torch curl.
        """
        g = self.grid
        family_in, family_out = ('E', 'H') if forward else ('H', 'E')
        upper_axes = tuple(pmc_upper)
        courant = f'(({real})({g.courant_number:.17g}))'
        lines = [f'if (i >= {count}) {{', f'auto read_in=[&](int c,int px,int py,int pz)->{real}{{',
                 f'if(px<{shape[0]}&&py<{shape[1]}&&pz<{shape[2]})return src[3*((px*{shape[1]}+py)*{shape[2]}+pz)+c];',
                 f'const int m=(px=={shape[0]}?1:0)|(py=={shape[1]}?2:0)|(pz=={shape[2]}?4:0);']
        for name, (comp, upper, block_shape) in zip(faces_in, blocks[family_in]):
            q = ['0' if a in upper else v for a, v in enumerate(('px', 'py', 'pz'))]
            lines.append(f'if(c=={comp}&&m=={sum(1<<a for a in upper)})return {name}[(({q[0]})*{block_shape[1]}+({q[1]}))*{block_shape[2]}+({q[2]})];')
        lines.append(f'return ({real})0;}};')
        offset = count
        for k, (name, (comp, upper, block_shape)) in enumerate(zip(faces_out, blocks[family_out])):
            size = math.prod(block_shape)
            lines.append(f'if (i < {offset+size}) {{ const int j = i-{offset};')
            decode = [f'j/{block_shape[1]*block_shape[2]}', f'(j/{block_shape[2]})%{block_shape[1]}', f'j%{block_shape[2]}']
            for a, v in enumerate('xyz'):
                lines.append(f'const int f{v} = {shape[a] if a in upper else decode[a]};')
            lines.append(f'{real} total=0;')
            for term, (axis, ic, out, sign) in enumerate(CURL_TERMS):
                n = shape[axis]
                if out != comp or n == 1:
                    continue
                coord = f'f{"xyz"[axis]}'
                def at(delta):
                    q = [f'f{v}' for v in 'xyz']
                    if delta:q[axis] = f'({coord}{delta:+d})'
                    return ','.join(q)
                target_shape = extended_shape(shape, upper_axes, family_out, out)
                lines.extend(['{', f'{real} d=0;'])
                if not forward and axis in upper:
                    lines.append(f'd = -2*({real})({pmc_upper[axis]:.17g})*read_in({ic},{at(-1)});')
                else:
                    if forward:lines.append(f'if ({coord} < {n-1}) {{ d = read_in({ic},{at(1)}) - read_in({ic},{at(0)});')
                    else:lines.append(f'if ({coord} > 0) {{ d = read_in({ic},{at(0)}) - read_in({ic},{at(-1)});')
                    if term in metrics:lines.append(f'd *= {metrics[term]}[{coord}{"" if forward else "-1"}];')
                    for lo, hi, psi, b, c, inv_k in segments[term]:
                        coords = [f'f{v}' for v in 'xyz']
                        coords[axis] = f'({coord}-{lo})'
                        slab = list(target_shape)
                        slab[axis] = hi-lo
                        index = f'(({coords[0]})*{slab[1]}+({coords[1]}))*{slab[2]}+({coords[2]})'
                        lines.extend([f'if ({coord} >= {lo} && {coord} < {hi}) {{', f'const int p = {index};', f'const int q = {coord}-{lo};',
                                      f'{real} memory = {psi}[p]*{b}[q] + {c}[q]*d;', f'{psi}[p] = memory;', f'd = d*{inv_k}[q] + memory;', '}'])
                    lines.append('}')
                    if forward and (axis in pmc_upper or axis in pec_upper):
                        factor = pmc_upper.get(axis, pec_upper.get(axis))
                        lines.append(f'else {{ d = ({real})({factor:.17g})*(read_in({ic},{at(1)}) - read_in({ic},{at(0)})); }}')
                    elif not forward and axis in pmc_lower:
                        lines.append(f'else {{ d = 2*({real})({pmc_lower[axis]:.17g})*read_in({ic},{at(0)}); }}')
                lines.extend([f'total {"-=" if sign < 0 else "+="} d;', '}'])
            if forward:lines.append(f'{name}[j] -= {courant}*total;')
            else:lines.append(f'{name}[j] += {courant}*finv{k}[j]*total;')
            lines.append('return; }')
            offset += size
        lines.extend(['return;', '}'])
        return lines

    def _update_statements(self,forward,inverse,argument,real,*,subpixel=False):
        g=self.grid
        lines=[]
        absorber=getattr(g,'absorber',None)
        if absorber is not None:
            # Trapezoidal loss of the adiabatic absorber: s summed over the axes in axis order.
            axes=g.absorber_axes()
            names={(axis,k):argument(f'absorber{axis}_{k}',axes[axis][k]) for axis in axes for k in range(2)}
            family='H' if forward else 'E'
        for comp in range(3):
            if subpixel:lines.append(f'curl_buffer[3*i+{comp}]=c{comp};')
            index = '0' if inverse.numel() == 1 else str(comp) if inverse.numel() == 3 else f'3*i+{comp}'
            if absorber is None:
                lines.append(f'dst[3*i+{comp}] {"-=" if forward else "+="} '
                             f'(({real})({g.courant_number:.17g}) * inverse[{index}]) * c{comp};')
                continue
            loss='+'.join(f'{names[axis,0 if is_nodal(family,comp,axis) else 1]}[{"xyz"[axis]}]' for axis in sorted(axes))
            lines.extend(['{',f'const {real} s = ({real})0+{loss};',
                          f'dst[3*i+{comp}] = ((1-s)/(1+s))*dst[3*i+{comp}] {"-" if forward else "+"} '
                          f'((({real})({g.courant_number:.17g}) * (1/(1+s))) * inverse[{index}]) * c{comp};','}'])
        return lines

    def update(self, forward):
        kernel, arrays, _ = self.launches[forward]
        with self.cp.cuda.Device(self.device), self._stream():
            block = getattr(self, 'tuned_blocks', {}).get(forward, 256)
            kernel(((self.launch_count(self.grid, forward)+block-1)//block,), (block,), arrays)

    def update_E(self):
        g = self.grid
        prepared = [state.prepare(g.E) for state in g.material_states]
        self.update(False)
        if self.interface_update is not None:self.interface_update.update()
        if getattr(getattr(g, 'subpixel', None), 'dispersive', None) is not None:g.subpixel.dispersive.apply(g.subpixel.curl_buffer)
        for state, (old, response) in zip(g.material_states, prepared):
            state.correct(g.E, old, response)

    def update_H(self):
        self.update(True)


def configure_cuda_kernel(grid, choice):
    if choice == 'torch':
        return
    implementation = FusedYeeCUDA(grid)
    grid.update_E = implementation.update_E
    grid.update_H = implementation.update_H
