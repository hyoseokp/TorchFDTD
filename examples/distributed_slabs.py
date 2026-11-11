"""Slab-decomposed solve: bit digests and step timings per rank. Launch with torchrun.

torchrun --standalone --nproc-per-node=4 -m examples.distributed_slabs \
    --cells 512 512 256 --steps 400 --mode forward --output scratch/slabs4.json

Every rank builds only its owned material rows from a closed-form pattern of the
global indices. Run once with --nproc-per-node=1 and --digest-ranks 2 4 8 to get
the single-device signal and gradient digests of the same row blocks, then compare
them with the multi-rank records. --mode forward times the fused forward only;
checkpointed and reversible also run the adjoint and digest the owned gradient.
"""
import argparse
import hashlib
import json
from pathlib import Path
import time

import torch

from torchfdtd import (AdjointOptions, DifferentiableSimulation, Monitor, Project, Region,
                       ReversibleCPMLSimulation, Source)
from torchfdtd.domain_decomposition import SlabDecomposition, init_process_group_from_env
from torchfdtd.solver import field_axes


def scene(cells, steps, mode, device):
    """Metalens-like slab: CPML on x/z (periodic x for the reversible ring), source and monitors inside."""
    mesh = .02
    x_kind = {'kind': 'periodic'} if mode == 'reversible' else {'kind': 'pml', 'layers': 12}
    faces = {'x_min': x_kind, 'x_max': x_kind, 'y_min': {'kind': 'periodic'}, 'y_max': {'kind': 'periodic'},
             'z_min': {'kind': 'pml', 'layers': 12}, 'z_max': {'kind': 'pml', 'layers': 12}}
    region = Region(dimension='3d', size=tuple(n*mesh for n in cells), mesh=mesh, steps=steps, courant_factor=.95,
                    backend=device.type, boundaries=faces, material_sampling='yee')
    nx, ny, nz = cells
    def at(component, index):
        axes = field_axes(region, component)
        return tuple(float(axes[a][index[a]]) for a in range(3))
    inner = (nx-28)*mesh if mode != 'reversible' else nx*mesh
    source = Source(kind='plane', normal='z', component='Ex', center=(0, 0, at('Ex', (0, 0, 16))[2]),
                    size=(inner, ny*mesh, 0), wavelength=.55, time_definition='standard',
                    pulse_length=2e-15, pulse_offset=4e-15)
    monitors = [Monitor(component=c, center=at(c, (nx*k//8, ny//2, nz-20))) for k in range(2, 7) for c in ('Ex', 'Hy')]
    return Project(region=region, sources=[source], monitors=monitors)


def owned_epsilon(decomposition, region, device):
    """Pillar-like pattern from global indices, built only on the owned rows."""
    x = torch.arange(decomposition.begin, decomposition.end, device=device, dtype=torch.float32)[:, None, None]
    y = torch.arange(region.shape[1], device=device, dtype=torch.float32)[None, :, None]
    z = torch.arange(region.shape[2], device=device, dtype=torch.float32)[None, None, :]
    layer = ((z >= 24) & (z < 24+region.shape[2]//4)).float()
    pillars = (torch.sin(.37*x)*torch.cos(.23*y) > .2).float()
    return (2.1+1.9*pillars*layer).expand(-1, region.shape[1], -1).contiguous()


def digest(tensor):
    return hashlib.sha256(tensor.detach().contiguous().cpu().numpy().tobytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cells', type=int, nargs=3, default=(256, 256, 192))
    parser.add_argument('--steps', type=int, default=200)
    parser.add_argument('--mode', choices=('forward', 'checkpointed', 'reversible'), default='forward')
    parser.add_argument('--checkpoints', type=int, default=8)
    parser.add_argument('--digest-ranks', type=int, nargs='*', default=())
    parser.add_argument('--backend', choices=('nccl', 'gloo'), default=None, help='Default: NCCL when CUDA is visible.')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    device = init_process_group_from_env(args.backend)
    project = scene(args.cells, args.steps, args.mode, device)
    decomposition = SlabDecomposition(project.region, axis=0)
    epsilon = owned_epsilon(decomposition, project.region, device)
    differentiate = args.mode != 'forward'
    parameter = epsilon.clone().requires_grad_(differentiate)
    if device.type == 'cuda':
        torch.cuda.reset_peak_memory_stats(device)
    started = time.perf_counter()
    if args.mode == 'reversible':
        model = ReversibleCPMLSimulation(project, decomposition=decomposition)
        result = model(parameter, fixed_epsilon=epsilon)
    else:
        model = DifferentiableSimulation(project, AdjointOptions(checkpoints=args.checkpoints), decomposition=decomposition)
        result = model(parameter)
    forward = time.perf_counter()-started
    record = dict(rank=decomposition.rank, world_size=decomposition.world_size, mode=args.mode,
                  cells=args.cells, steps=args.steps, owned_rows=(decomposition.begin, decomposition.end),
                  forward_seconds=forward, forward_ms_per_step=1e3*result.report['forward_seconds']/args.steps,
                  signals_sha256=digest(result.signals), halo_bytes_forward=decomposition.halo_bytes)
    if differentiate:
        started = time.perf_counter()
        (result.signals.square().sum()).backward()
        record.update(backward_seconds=time.perf_counter()-started, gradient_sha256=digest(parameter.grad))
        rows = project.region.shape[0]
        # Digests of the row blocks other rank counts would own, from this run's gradient.
        record['block_gradient_sha256'] = {
            str(world): [digest(parameter.grad[rows*r//world-decomposition.begin:rows*(r+1)//world-decomposition.begin])
                         for r in range(world)] for world in args.digest_ranks if decomposition.world_size == 1}
    if device.type == 'cuda':
        record['peak_allocated_bytes'] = torch.cuda.max_memory_allocated(device)
        record['device'] = torch.cuda.get_device_name(device)
    values = decomposition.transport.all_gather_object(record)
    if decomposition.rank == 0:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(values, indent=1))
        print(json.dumps([{k: v for k, v in row.items() if 'sha256' not in k} for row in values], indent=1))


if __name__ == '__main__':
    main()
