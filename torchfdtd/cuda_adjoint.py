"""Race-free native CUDA transpose of the real diagonal Yee/CPML update.

Each field thread gathers its neighboring derivative adjoints. CPML adjoints
use two buffers, so no thread reads a memory another thread is overwriting.
The material VJP is accumulated in the E-transpose launch without atomics.
"""
from __future__ import annotations

import math
import torch

from .boundaries import CURL_TERMS
from .cuda_kernels import _compile, _direct_cuda_view


class FusedAdjointCUDA:
    def __init__(self,system,gradient,signal_bar,*,direct_views=False,buffers=None,
                 material_gradient=True,electric_seed=None,curl_permittivity=None):
        import cupy
        self.cp=cupy
        self.direct_views=direct_views
        self.buffers=buffers
        self.system=system
        decomposition=system.decomposition
        if decomposition is not None and (material_gradient or any(face.kind=='pml' for face in system.region.boundaries.pair(decomposition.axis))):
            raise ValueError('The fused slab transpose exchanges only field-adjoint halo rows: no material VJP and no CPML on the split axis.')
        self.device=system.device.index
        self.gradient=gradient
        self.signal_bar=signal_bar.contiguous()
        self.epsilon=(system.eps4 if curl_permittivity is None else curl_permittivity).detach().contiguous()
        self.material_gradient=material_gradient
        allocate = lambda name, value: buffers.zeros(name, value) if buffers is not None else torch.zeros_like(value)
        self.e_bar=allocate('bar:E',system.grid.E)
        self.h_bar=allocate('bar:H',system.grid.H)
        self.electric_seed=self.e_bar if electric_seed is None else electric_seed
        self.psi_bars=[tuple(allocate(f'bar:psi:{phase}:{i}',s['psi']) for i,s in enumerate(system.segments)) for phase in range(2)]
        self.phase=0
        self.launches={}
        self.count=math.prod(system.shape)
        with cupy.cuda.Device(self.device),self.stream():
            for phase in (0,1):
                for forward in (True,False):
                    code,tensors=self.source(forward,phase)
                    fn,module=_compile(code,self.device,cupy.cuda.Device(self.device).compute_capability,'adjoint_update')
                    arrays=buffers.cuda_arguments(code,tensors,self.view) if buffers is not None else tuple(self.view(t) for t in tensors)
                    self.launches[forward,phase]=(fn,arrays,module)
            self.observer=self.observer_kernel()

    def view(self,tensor):
        return _direct_cuda_view(self.cp,tensor) if self.direct_views else self.cp.from_dlpack(tensor.detach())

    def stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream,device_id=self.device)

    def observer_kernel(self):
        if not self.system.monitors:return None
        import numpy as np
        g=self.system.grid
        real='double' if g.E.dtype==torch.float64 else 'float'
        shape=g.E.shape[:3]
        key=self.system.observation_cache_key('adjoint') if self.buffers is None and self.direct_views else None
        cached=None if key is None else self.system.observation_cache.get(key)
        if cached is not None and cached[0] is self.system.monitors:
            host,count=cached[1:]
        else:
            groups={}
            for m,(name,loc,component) in enumerate(self.system.monitors):
                index=3*((loc[0]*shape[1]+loc[1])*shape[2]+loc[2])+component
                groups.setdefault((name[0],index),[]).append(m)
            count=len(groups)
            # One thread owns each distinct field location. Preserve the original
            # monitor order within duplicate groups without atomics. Indices are
            # runtime data, so dense planes do not generate a huge NVRTC program.
            layout=np.empty(3*count+1+len(self.system.monitors),dtype=np.int64)
            cursor=0
            for i,((family,index),monitors) in enumerate(groups.items()):
                layout[i]=cursor
                layout[count+1+i]=index
                layout[2*count+1+i]=int(family=='H')
                layout[3*count+1+cursor:3*count+1+cursor+len(monitors)]=monitors
                cursor+=len(monitors)
            layout[count]=cursor
            host=torch.from_numpy(layout)
            if key is not None:
                self.system.observation_cache[key]=(self.system.monitors,host,count)
        # Cache the read-only host packet, never a CUDA binding. The receiving
        # solve owns its device copy and binds its fresh fields/seed below.
        self.observer_layout=(host.to(self.system.device) if self.buffers is None else
                              self.buffers.copy('adjoint_observer_layout',host))
        code='''extern "C" __global__ void add_observations(
            REAL* e,REAL* h,const REAL* v,const long long* map,
            int count,int monitors,int step) {
            const int i=blockIdx.x*blockDim.x+threadIdx.x;
            if(i>=count)return;
            const long long begin=map[i],end=map[i+1];
            const long long target=map[count+1LL+i];
            REAL* field=map[2LL*count+1+i]?h:e;
            REAL value=field[target];
            for(long long j=begin;j<end;++j)
                value+=v[(long long)step*monitors+map[3LL*count+1+j]];
            field[target]=value;
        }'''.replace('REAL',real)
        fn,module=_compile(code,self.device,self.cp.cuda.Device(self.device).compute_capability,'add_observations')
        arrays=tuple(self.view(t) for t in (self.e_bar,self.h_bar,self.signal_bar))
        arrays+=(self.view(self.observer_layout),)
        return fn,(*arrays,np.int32(count),np.int32(len(self.system.monitors))),module,count

    def source(self,forward,phase):
        system=self.system;g=system.grid
        shape=system.shape
        strides=(shape[1]*shape[2],shape[2],1)
        real='double' if g.E.dtype==torch.float64 else 'float'
        cn=f'(({real})({g.courant_number:.17g}))'
        tensors=[];parameters=[]
        def argument(name,tensor,write=False):
            if not tensor.is_contiguous():raise ValueError('CUDA adjoint arrays must be contiguous.')
            tensors.append(tensor)
            parameters.append(f'{"" if write else "const "}{real}* __restrict__ {name}')
            return name
        argument('bar',self.h_bar if forward else self.electric_seed)
        argument('target',self.e_bar if forward else self.h_bar,True)
        argument('epsilon',self.epsilon)
        if not forward and self.material_gradient:
            argument('primal',g.H)
            argument('gradient',self.gradient,True)
        diagonal=self.epsilon.shape[-1]==3
        def eps(index,component):return 'epsilon[0]' if self.epsilon.numel()==1 else f'epsilon[{"3*("+index+")+"+str(component) if diagonal else index}]'
        metrics={}
        segments={}
        for term,(axis,comp,_,_) in enumerate(CURL_TERMS):
            if shape[axis]==1:continue
            metric=g.metric.get((forward,axis))
            if metric:metrics[term]=(argument(f'metric{term}',metric[0]),metric[1])
            segments[term]=[]
            for index in system.keys[forward,axis,comp]:
                seg=system.segments[index]
                values={k:argument(f'{k}_{index}',seg[k]) for k in ('b','c','inv_k')}
                values['old']=argument(f'old_{index}',self.psi_bars[phase][index])
                values['new']=argument(f'new_{index}',self.psi_bars[1-phase][index],True)
                if not forward and self.material_gradient:values['primal']=argument(f'primal_{index}',seg['psi'])
                segments[term].append((seg,values))
        lines=[f'const int i=blockIdx.x*blockDim.x+threadIdx.x;',f'if(i>={self.count})return;',
               f'const int x=i/{strides[0]};',f'const int y=(i/{strides[1]})%{shape[1]};',
               f'const int z=i%{shape[2]};',f'{real} r0=0,r1=0,r2=0;']

        def memory_index(axis,coordinate,seg):
            lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
            coords=['x','y','z'];coords[axis]=f'(({coordinate})-{lo})'
            dims=list(shape);dims[axis]=hi-lo
            return f'({coords[0]}*{dims[1]}+{coords[1]})*{dims[2]}+{coords[2]}',f'({coordinate})-{lo}'

        def edge(term,axis,out,sign,index,coordinate,write):
            target=index if forward else f'({index})+{strides[axis]}'
            scale=f'-{cn}' if forward else f'{cn}/{eps(target,out)}'
            code=[f'{real} d=({"-" if sign<0 else ""}(({scale})*bar[3*({target})+{out}]));']
            for seg,names in segments[term]:
                lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
                p,q=memory_index(axis,coordinate,seg)
                code.extend([f'if(({coordinate})>={lo} && ({coordinate})<{hi}){{',
                             f'const int p={p},q={q};',f'{real} b={names["old"]}[p]+d;',
                             f'd=d*{names["inv_k"]}[q]+{names["c"]}[q]*b;'])
                if write:code.append(f'{names["new"]}[p]={names["b"]}[q]*b;')
                code.append('}')
            if term in metrics:code.append(f'd*={metrics[term][0]}[{coordinate}];')
            return code

        for term,(axis,comp,out,sign) in enumerate(CURL_TERMS):
            n=shape[axis]
            if n==1:continue
            coord='xyz'[axis];stride=strides[axis]
            lines.append(f'if({coord}>0){{')
            lines+=edge(term,axis,out,sign,f'i-{stride}',f'{coord}-1',False)
            lines.extend([f'r{comp}+=d;','}',f'if({coord}<{n-1}){{'])
            lines+=edge(term,axis,out,sign,'i',coord,True)
            lines.extend([f'r{comp}-=d;','}'])
            if axis in g.wrap:
                for coord_value,action in ((0,'+='),(n-1,'-=')):
                    target=f'i+{(n-1-coord_value)*stride}' if forward else f'i-{coord_value*stride}'
                    scale=f'-{cn}' if forward else f'{cn}/{eps(target,out)}'
                    value=f'({"-" if sign<0 else ""}(({scale})*bar[3*({target})+{out}]))'
                    if term in metrics:value+=f'*(({real})({metrics[term][1]:.17g}))'
                    lines.append(f'if({coord}=={coord_value})r{comp}{action}{value};')
            elif forward and axis in getattr(g,'pec_upper',{}):
                factor=g.pec_upper[axis]
                value=f'({real})({sign*g.courant_number*factor:.17g})*bar[3*i+{out}]'
                lines.append(f'if({coord}=={n-1})r{comp}+={value};')
        for c in range(3):lines.append(f'target[3*i+{c}]+=r{c};')

        if not forward and self.material_gradient:
            lines.append(f'{real} c0=0,c1=0,c2=0;')
            for term,(axis,comp,out,sign) in enumerate(CURL_TERMS):
                n=shape[axis]
                if n==1:continue
                coord='xyz'[axis];stride=strides[axis]
                lines.extend(['{',f'{real} d=0;',f'if({coord}>0){{',
                              f'd=primal[3*i+{comp}]-primal[3*(i-{stride})+{comp}];'])
                if term in metrics:lines.append(f'd*={metrics[term][0]}[{coord}-1];')
                for seg,names in segments[term]:
                    lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
                    p,q=memory_index(axis,f'{coord}-1',seg)
                    lines.extend([f'if({coord}-1>={lo} && {coord}-1<{hi}){{',f'const int p={p},q={q};',
                                  f'{real} memory={names["primal"]}[p]*{names["b"]}[q]+{names["c"]}[q]*d;',
                                  f'd=d*{names["inv_k"]}[q]+memory;','}'])
                lines.append('}')
                if axis in g.wrap:
                    lines.extend(['else {',f'd=primal[3*i+{comp}]-primal[3*(i+{(n-1)*stride})+{comp}];'])
                    if term in metrics:lines.append(f'd*=(({real})({metrics[term][1]:.17g}));')
                    lines.append('}')
                lines.extend([f'c{out}+={"-" if sign<0 else ""}d;','}'])
            for c in range(3):
                ep=eps('i',c)
                lines.append(f'{real} g{c}=(-{cn}*bar[3*i+{c}])*c{c}/({ep}*{ep});')
            if diagonal:
                for c in range(3):lines.append(f'gradient[3*i+{c}]+=g{c};')
            else:lines.append('gradient[i]+=(g0+g1)+g2;')
        return 'extern "C" __global__ void adjoint_update('+','.join(parameters)+'){\n'+'\n'.join(lines)+'\n}',tensors

    def step(self,index,*,observation_index=None):
        import numpy as np
        one_pass = getattr(self, 'one_pass', None)
        if one_pass is not None:
            return one_pass.step(index if observation_index is None else observation_index)
        with self.cp.cuda.Device(self.device),self.stream():
            if self.observer is not None:
                fn,arrays,_,count=self.observer
                fn(((count+127)//128,),(128,),(*arrays,np.int32(index if observation_index is None else observation_index)))
            for forward in (True,False):
                if self.system.decomposition is not None:
                    # The gathered split-axis derivatives read the previous (E target) or next (H target) adjoint row.
                    self.system.decomposition.fill_halo(self.h_bar if forward else self.electric_seed,not forward)
                fn,arrays,_=self.launches[forward,self.phase]
                block = getattr(self, 'tuned_blocks', {}).get((forward, self.phase), 256)
                fn(((self.count+block-1)//block,),(block,),arrays)
        self.phase=1-self.phase
