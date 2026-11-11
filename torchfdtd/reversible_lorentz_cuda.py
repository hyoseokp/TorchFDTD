"""Packed pole CUDA updates and the exact local density transpose."""
from __future__ import annotations

import torch

from .cuda_kernels import FusedYeeCUDA, _compile, _direct_cuda_view
from .cuda_adjoint import FusedAdjointCUDA


def literal(value):
    return f'((float)({value:.17g}))'


def sum_terms(values):
    values = list(values)
    if not values:
        return '((float)0)'
    result = values[0]
    for value in values[1:]:
        result = '('+result+'+'+value+')'
    return result


def coefficient_source(mat, index='ms', z='z'):
    rows = [f'const float rr=rho[{index}];',
        f'const float ep=__fadd_rn(bg[{z}],__fmul_rn(rr,delta_inf[{z}]));']
    for i, values in enumerate(mat.constants):
        rows += [f'const float k{i}=__fmul_rn(rr,{literal(values[2])});',
                 f'const float ki{i}=__fmul_rn(rr,{literal(values[4])});']
    rows += [f'const float K={sum_terms("k"+str(i) for i in range(mat.pole_count))};',
             f'const float KI={sum_terms("ki"+str(i) for i in range(mat.pole_count))};',
             'const float em=__fsub_rn(ep,K);', 'const float iv=__frcp_rn(__fadd_rn(ep,K));',
             'const float emi=__fsub_rn(ep,KI);', 'const float ivi=__frcp_rn(__fadd_rn(ep,KI));']
    return '\n'.join(rows)


def map_index(mat, xy='r', z='z'):
    return f'(({xy})*{mat.layers}+(({z})-{mat.a})/{mat.cells_per_layer})'


def slots(index):
    return ('xy' if index % 2 == 0 else 'zw')


class LorentzYeeCUDA(FusedYeeCUDA):
    def __init__(self, grid, mat, *, options=None, report=None):
        self.mat = mat
        if grid.E.dtype != torch.float32 or grid.E.is_complex():
            raise ValueError('Packed reversible Lorentz CUDA supports real FP32 fields.')
        super().__init__(grid, direct_views=True,
            block_size=getattr(options, 'block_size', None),
            cells_per_thread=getattr(options, 'cells_per_thread', 1), report=report)

    def _update_statements(self, forward, inverse, argument, real, *, subpixel=False):
        if forward:
            return super()._update_statements(forward, inverse, argument, real, subpixel=subpixel)
        mat = self.mat
        for name, tensor in [('rho', mat.rho), ('bg', mat.background),
                             ('delta_inf', mat.delta_epsilon), ('inverse_bg', mat.inverse_background)]:
            argument(name, tensor)
        argument('packed', mat.state, True)
        cn = literal(self.grid.courant_number)
        pairs = mat.padded_poles//2
        rows = [f'if(z>={mat.a} && z<={mat.b}) {{',
            f'const long long xy=(long long)x*{mat.shape[1]}+y;',
            f'const long long cl=xy*{mat.depth}+(z-{mat.a});',
            f'const long long ms={map_index(mat, "xy")};', coefficient_source(mat),
            f'float4* bank=reinterpret_cast<float4*>(packed)+cl*3*{pairs};']
        for component in range(3):
            rows += ['{', f'const float old=dst[3LL*i+{component}];']
            for j in range(pairs):
                rows.append(f'float4 s{j}=bank[{component*pairs+j}];')
            for j, values in enumerate(mat.constants):
                p, q = slots(j)
                rows.append(f'const float r{j}=(s{j//2}.{q}-{literal(values[0])}*s{j//2}.{p})*{literal(values[1])};')
            rows.append(f'const float nxt=(em*old+{cn}*c{component}-{sum_terms("r"+str(j) for j in range(mat.pole_count))})*iv;')
            for j in range(mat.pole_count):
                p, q = slots(j)
                rows += [f'const float dl{j}=r{j}+k{j}*(nxt+old);',
                    f's{j//2}.{p}+=dl{j};', f's{j//2}.{q}=-s{j//2}.{q}+((float)2)*dl{j};']
            for j in range(pairs):
                rows.append(f'bank[{component*pairs+j}]=s{j};')
            rows += [f'dst[3LL*i+{component}]=nxt;', '}']
        rows += ['} else {']+[f'dst[3LL*i+{j}]+=({cn}*inverse_bg[z])*c{j};' for j in range(3)]+['}']
        return rows


def replace_scale_reads(source, prefix, replacement):
    """Replace balanced generated epsilon subscripts, never regex arithmetic."""
    cursor = 0
    while True:
        start = source.find(prefix, cursor)
        if start < 0:
            return source
        end = start+len(prefix)
        begin = end
        depth = 1
        while depth:
            if end >= len(source):
                raise RuntimeError('Unbalanced generated scale read.')
            depth += (source[end] == '[')-(source[end] == ']')
            end += 1
        expression = source[begin:end-1]
        value = replacement(expression)
        source = source[:start]+value+source[end:]
        cursor = start+len(value)


class LorentzAdjointCUDA(FusedAdjointCUDA):
    def __init__(self, system, mat, signal_bar, *, options=None, report=None):
        self.mat = mat
        placeholder = torch.ones((2, 3), device=system.device, dtype=torch.float32)
        super().__init__(system, torch.empty(0, device=system.device), signal_bar,
            direct_views=True, material_gradient=False, curl_permittivity=placeholder)
        if getattr(options, 'block_size', None) is not None or getattr(options, 'cells_per_thread', 1) != 1:
            from .reversible_cuda_tuning import tune_adjoint
            tune_adjoint(self, getattr(options, 'block_size', None), report,
                         cells_per_thread=getattr(options, 'cells_per_thread', 1))

    def source(self, forward, phase):
        source, tensors = super().source(forward, phase)
        if forward:
            return source, tensors
        mat = self.mat
        cn = literal(self.system.grid.courant_number)
        prefix = cn+'/epsilon['
        if prefix not in source:
            raise RuntimeError('The field transpose no longer exposes the expected scale reads.')
        source = replace_scale_reads(source, prefix,
            lambda expression: f'lorentz_scale((long long)({expression}),rho,bg,delta_inf)')
        source = source.replace('){\n', ',const float* __restrict__ rho,const float* __restrict__ bg,const float* __restrict__ delta_inf){\n', 1)
        helper = f'''__device__ __forceinline__ float lorentz_scale(long long flat,
 const float* rho,const float* bg,const float* delta_inf) {{
 const long long cell=flat/3;
 const int z=cell%{mat.shape[2]};const long long r=cell/{mat.shape[2]};
 if(z>={mat.a} && z<={mat.b}) {{
 const long long ms={map_index(mat)};
 {coefficient_source(mat)}
 return __fmul_rn({cn},iv);
 }}
 return {cn}/bg[z];
 }}\n'''
        return helper+source, [*tensors, mat.rho, mat.background, mat.delta_epsilon]


def interior_indices(system, mat, components, periodic):
    nx, ny, nz = system.region.shape
    depth = mat.depth
    count = nx*ny*depth*components
    rows = [f'const long long q=(long long)blockIdx.x*blockDim.x+threadIdx.x;if(q>={count}LL)return;',
        f'const int c=q%{components};const long long cell=q/{components};',
        f'const long long r=cell/{depth};const int z=cell-r*{depth}+{mat.a};',
        f'const int y=r%{ny};const int x=r/{ny};const long long i=r*{nz}+z;',
        f'const long long xp=x=={nx-1}?i-{(nx-1)*ny*nz}LL:i+{ny*nz}LL;',
        f'const long long xm=x==0?i+{(nx-1)*ny*nz}LL:i-{ny*nz}LL;',
        f'const long long yp=y=={ny-1}?i-{(ny-1)*nz}LL:i+{nz}LL;',
        f'const long long ym=y==0?i+{(ny-1)*nz}LL:i-{nz}LL;']
    rows += ([f'const long long zp=z=={nz-1}?i-{nz-1}:i+1;',
              f'const long long zm=z==0?i+{nz-1}:i-1;'] if periodic else
             ['const long long zp=i+1;const long long zm=i-1;'])
    return '\n'.join(rows), count


class LorentzReconstructionCUDA:
    def __init__(self, system, mat, gradient, signal_bar, *, periodic=False, options=None, report=None):
        from .adjoint_memory import _cuda_index_contract
        _cuda_index_contract(system.region, system.shape, 0, 0)
        self.system, self.mat, self.gradient = system, mat, gradient
        if (signal_bar.ndim != 2 or signal_bar.shape[1] != len(system.monitors)
                or signal_bar.dtype != torch.float32 or signal_bar.device != system.device
                or not signal_bar.is_contiguous()):
            raise ValueError('Lorentz reconstruction needs a contiguous device FP32 observation seed block.')
        self.seed_rows = signal_bar.shape[0]
        self.periodic, self.options, self.report = periodic, options, report
        self.adjoint = LorentzAdjointCUDA(system, mat, signal_bar, options=options, report=report)
        self.pole_bars = torch.zeros_like(mat.state)
        self.kernels = {}
        self.next_step = system.region.steps-1
        self.programs = self._programs()

    def _programs(self):
        system, mat = self.system, self.mat
        cn = literal(system.grid.courant_number)
        head, count_h = interior_indices(system, mat, 1, self.periodic)
        diffs = {(a, j):f'(f[3LL*{p}+{j}]-f[3LL*i+{j}])'
                 for a, p in [('x', 'xp'), ('y', 'yp'), ('z', 'zp')] for j in range(3)}
        curls = [diffs['y', 2]+'-'+diffs['z', 1], diffs['z', 0]+'-'+diffs['x', 2],
                 diffs['x', 1]+'-'+diffs['y', 0]]
        body_h = head+'\n'+''.join(f'const float c{j}={v};out[3LL*i+{j}]+={cn}*c{j};' for j, v in enumerate(curls))
        h_source = 'extern "C" __global__ void reconstruct_h(const float* __restrict__ f,float* __restrict__ out){'+body_h+'}'
        head, count_e = interior_indices(system, mat, 3, self.periodic)
        pairs = mat.padded_poles//2
        rows = [head, 'const int c1=c==2?0:c+1,c2=c==0?2:c-1;',
            'const long long n1=c1==0?xm:(c1==1?ym:zm);',
            'const long long n2=c2==0?xm:(c2==1?ym:zm);',
            'const float cc=(f[3LL*i+c2]-f[3LL*n1+c2])-(f[3LL*i+c1]-f[3LL*n2+c1]);',
            f'const long long ms={map_index(mat)};', coefficient_source(mat),
            'const float nxt=out[3LL*i+c];',
            f'float4* state=reinterpret_cast<float4*>(packed)+q*{pairs};',
            f'float4* bars=reinterpret_cast<float4*>(packed_bar)+q*{pairs};']
        for j in range(pairs):
            rows += [f'float4 s{j}=state[{j}];', f'const float4 b{j}=bars[{j}];']
        for j, values in enumerate(mat.constants):
            p, v = slots(j)
            rows.append(f'const float u{j}=(s{j//2}.{v}+{literal(values[0])}*s{j//2}.{p})*{literal(values[3])};')
        rows.append(f'const float old=(emi*nxt-{cn}*cc+{sum_terms("u"+str(j) for j in range(mat.pole_count))})*ivi;')
        for j in range(mat.pole_count):
            p, v = slots(j)
            rows += [f'const float dl{j}=u{j}-ki{j}*(nxt+old);',
                f's{j//2}.{p}-=dl{j};', f's{j//2}.{v}=((float)2)*dl{j}-s{j//2}.{v};',
                f'const float pb{j}=b{j//2}.{p},qb{j}=b{j//2}.{v};', f'const float db{j}=pb{j}+((float)2)*qb{j};']
        for j in range(pairs):
            rows.append(f'state[{j}]=s{j};')
        rows += [f'const float com={sum_terms("k"+str(j)+"*db"+str(j) for j in range(mat.pole_count))};',
            'const float nb=bar[3LL*i+c];const float numb=nb*iv;const float denb=-(nb*nxt)*iv;',
            'const float oldb=com+em*numb;const float epsb=numb*old+denb;']
        terms = ['epsb*delta_inf[z]']
        for j, values in enumerate(mat.constants):
            rows += [f'const float kb{j}=db{j}*(nxt+old)-numb*old+denb;',
                f'const float rb{j}=db{j}-numb;',
                f'const float pbn{j}=pb{j}-{literal(values[0])}*rb{j}*{literal(values[1])};',
                f'const float qbn{j}=-qb{j}+rb{j}*{literal(values[1])};']
            terms.append(f'kb{j}*{literal(values[2])}')
        for j in range(pairs):
            names = [f'pbn{2*j}', f'qbn{2*j}']
            names += [f'pbn{2*j+1}', f'qbn{2*j+1}'] if 2*j+1 < mat.pole_count else [f'b{j}.z', f'b{j}.w']
            rows.append(f'bars[{j}]=make_float4('+','.join(names)+');')
        rows.append(f'grad[q]+={sum_terms(terms)};')
        rows.append(f'const float comn={sum_terms(f"k{j}*(pbn{j}+((float)2)*qbn{j})" for j in range(mat.pole_count))};')
        rows += ['bar[3LL*i+c]=oldb+comn;out[3LL*i+c]=old;']
        source = '''extern "C" __global__ void reconstruct_e(
 const float* __restrict__ f,float* __restrict__ out,float* __restrict__ bar,
 float* __restrict__ grad,const float* __restrict__ rho,const float* __restrict__ bg,
 const float* __restrict__ delta_inf,float* __restrict__ packed,float* __restrict__ packed_bar){
 '''+'\n'.join(rows)+'\n}'
        return {
            'h': (h_source, (system.grid.E, system.grid.H), count_h, 'reconstruct_h'),
            'e': (source, (system.grid.H, system.grid.E, self.adjoint.e_bar, self.gradient,
                          mat.rho, mat.background, mat.delta_epsilon, mat.state, self.pole_bars), count_e, 'reconstruct_e'),
        }

    def run(self, name):
        cp = self.adjoint.cp
        if name not in self.kernels:
            source, tensors, count, entry = self.programs[name]
            with cp.cuda.Device(self.system.device.index):
                arrays = tuple(_direct_cuda_view(cp, t) for t in tensors)
                requested = getattr(self.options, 'block_size', None)
                if requested is not None:
                    from .reversible_cuda_tuning import select_launch
                    fn, module, block = select_launch(source, entry, tensors, arrays, count,
                        self.system.device.index, requested, default=128,
                        label='lorentz_reconstruct_'+name, report=self.report)
                else:
                    fn, module = _compile(source, self.system.device.index,
                        cp.cuda.Device(self.system.device.index).compute_capability, entry)
                    block = 128
            self.kernels[name] = fn, arrays, module, block, count
        fn, arrays, _, block, count = self.kernels[name]
        with cp.cuda.Device(self.system.device.index), self.adjoint.stream():
            fn(((count+block-1)//block,), (block,), arrays)

    def step(self, step, frame=None, *, observation_index=None):
        from .reversible import _undo_sources
        if type(step) is not int or step != self.next_step or step < 0:
            raise ValueError('Lorentz reconstruction requires descending steps exactly once.')
        system, mat = self.system, self.mat
        row = step if observation_index is None else observation_index
        if type(row) is not int or not 0 <= row < self.seed_rows:
            raise ValueError('Lorentz observation row lies outside the seed block.')
        if not self.periodic:
            if (frame is None or frame.device != system.device or frame.dtype != torch.float32
                    or tuple(frame.shape) != (2,*mat.shape[:2],2)):
                raise ValueError('CPML Lorentz reconstruction requires a device FP32 boundary frame.')
            system.grid.E[:, :, mat.b+1, :2].copy_(frame[0])
        _undo_sources(system, system.grid.H, 'H', step)
        self.run('h')
        if not self.periodic:
            system.grid.H[:, :, mat.a-1, :2].copy_(frame[1])
        _undo_sources(system, system.grid.E, 'E', step)
        self.adjoint.step(step, observation_index=observation_index)
        self.run('e')
        self.next_step -= 1
