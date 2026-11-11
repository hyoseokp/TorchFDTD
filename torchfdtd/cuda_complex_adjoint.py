"""Complex Bloch Yee/CPML Hermitian transpose with real dielectric VJPs."""
import torch
from .boundaries import CURL_TERMS
from .cuda_adjoint import FusedAdjointCUDA


def complex_definition(real):
    return """
struct C {
    REAL r,j;
    __device__ C(REAL a=0,REAL b=0):r(a),j(b){}
    __device__ C& operator+=(C b){r+=b.r;j+=b.j;return *this;}
    __device__ C& operator-=(C b){r-=b.r;j-=b.j;return *this;}
    __device__ C& operator*=(REAL b){r*=b;j*=b;return *this;}
};
__device__ C operator+(C a,C b){return C(a.r+b.r,a.j+b.j);}
__device__ C operator-(C a,C b){return C(a.r-b.r,a.j-b.j);}
__device__ C operator-(C a){return C(-a.r,-a.j);}
__device__ C operator*(C a,REAL b){return C(a.r*b,a.j*b);}
__device__ C operator*(REAL a,C b){return C(a*b.r,a*b.j);}
__device__ C operator/(C a,REAL b){return C(a.r/b,a.j/b);}
__device__ C operator*(C a,C b){return C(a.r*b.r-a.j*b.j,a.r*b.j+a.j*b.r);}
""".replace('REAL',real)


class FusedComplexAdjointCUDA(FusedAdjointCUDA):
    def observer_kernel(self):
        # Dense spectral observations use prepared index maps, including duplicates.
        return None

    def step(self,index,*,observation_index=None):
        seed=self.signal_bar[index if observation_index is None else observation_index]
        for target,(positions,indices) in zip((self.e_bar,self.h_bar),self.system.observation_maps):
            if indices.numel():target.reshape(-1).index_add_(0,indices,seed.index_select(0,positions))
        super().step(index,observation_index=observation_index)

    def source(self,forward,phase):
        system=self.system;g=system.grid
        shape=system.shape
        strides=(shape[1]*shape[2],shape[2],1)
        real='double' if g.E.dtype==torch.complex128 else 'float'
        cn=f'(({real})({g.courant_number:.17g}))'
        tensors=[];parameters=[]
        def argument(name,tensor,write=False):
            if not tensor.is_contiguous():raise ValueError('CUDA adjoint arrays must be contiguous.')
            tensors.append(tensor)
            parameters.append(f'{"" if write else "const "}{"C" if tensor.is_complex() else real}* __restrict__ {name}')
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
               f'const int z=i%{shape[2]};','C r0=0,r1=0,r2=0;']

        def memory_index(axis,coordinate,seg):
            lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
            coords=['x','y','z'];coords[axis]=f'(({coordinate})-{lo})'
            dims=list(shape);dims[axis]=hi-lo
            return f'({coords[0]}*{dims[1]}+{coords[1]})*{dims[2]}+{coords[2]}',f'({coordinate})-{lo}'

        def edge(term,axis,out,sign,index,coordinate,write):
            target=index if forward else f'({index})+{strides[axis]}'
            scale=f'-{cn}' if forward else f'{cn}/{eps(target,out)}'
            code=[f'C d=({"-" if sign<0 else ""}(({scale})*bar[3*({target})+{out}]));']
            for seg,names in segments[term]:
                lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
                p,q=memory_index(axis,coordinate,seg)
                code.extend([f'if(({coordinate})>={lo} && ({coordinate})<{hi}){{',
                             f'const int p={p},q={q};',f'C b={names["old"]}[p]+d;',
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
                    seam=complex(g.wrap[axis])
                    factor=seam.conjugate() if forward and coord_value==0 else (1/seam).conjugate() if not forward and coord_value==n-1 else 1+0j
                    value=f'({value})*C(({real})({factor.real:.17g}),({real})({factor.imag:.17g}))'
                    if term in metrics:value+=f'*(({real})({metrics[term][1]:.17g}))'
                    lines.append(f'if({coord}=={coord_value})r{comp}{action}{value};')
            elif forward and axis in getattr(g,'pec_upper',{}):
                factor=g.pec_upper[axis]
                value=f'({real})({sign*g.courant_number*factor:.17g})*bar[3*i+{out}]'
                lines.append(f'if({coord}=={n-1})r{comp}+={value};')
        for c in range(3):lines.append(f'target[3*i+{c}]+=r{c};')

        if not forward and self.material_gradient:
            lines.append('C c0=0,c1=0,c2=0;')
            for term,(axis,comp,out,sign) in enumerate(CURL_TERMS):
                n=shape[axis]
                if n==1:continue
                coord='xyz'[axis];stride=strides[axis]
                lines.extend(['{',f'C d=0;',f'if({coord}>0){{',
                              f'd=primal[3*i+{comp}]-primal[3*(i-{stride})+{comp}];'])
                if term in metrics:lines.append(f'd*={metrics[term][0]}[{coord}-1];')
                for seg,names in segments[term]:
                    lo=seg['slice'][axis].start;hi=seg['slice'][axis].stop
                    p,q=memory_index(axis,f'{coord}-1',seg)
                    lines.extend([f'if({coord}-1>={lo} && {coord}-1<{hi}){{',f'const int p={p},q={q};',
                                  f'C memory={names["primal"]}[p]*{names["b"]}[q]+{names["c"]}[q]*d;',
                                  f'd=d*{names["inv_k"]}[q]+memory;','}'])
                lines.append('}')
                if axis in g.wrap:
                    reciprocal=1/complex(g.wrap[axis])
                    lines.extend(['else {',f'd=primal[3*i+{comp}]-primal[3*(i+{(n-1)*stride})+{comp}]*C(({real})({reciprocal.real:.17g}),({real})({reciprocal.imag:.17g}));'])
                    if term in metrics:lines.append(f'd*=(({real})({metrics[term][1]:.17g}));')
                    lines.append('}')
                lines.extend([f'c{out}+={"-" if sign<0 else ""}d;','}'])
            for c in range(3):
                ep=eps('i',c)
                lines.append(f'{real} g{c}=-{cn}*(bar[3*i+{c}].r*c{c}.r+bar[3*i+{c}].j*c{c}.j)/({ep}*{ep});')
            if diagonal:
                for c in range(3):lines.append(f'gradient[3*i+{c}]+=g{c};')
            else:lines.append('gradient[i]+=(g0+g1)+g2;')
        return complex_definition(real)+'extern "C" __global__ void adjoint_update('+','.join(parameters)+'){\n'+'\n'.join(lines)+'\n}',tensors
