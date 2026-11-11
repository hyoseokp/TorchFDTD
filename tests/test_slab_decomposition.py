"""Slab-decomposed solves reproduce the single-device bits for every rank count.

Thread ranks (ThreadTransport) cover CPU and one CUDA device in one process.
Gloo processes cover the torch.distributed transport on Linux.
"""
import os
import sys
import threading

import pytest
import torch

from torchfdtd import (AdjointOptions, DifferentiablePlaneSimulation, DifferentiableSimulation, FieldMonitor,
                       Monitor, Project, Region, ReversibleCPMLOptions, ReversibleCPMLPlaneSimulation,
                       ReversibleCPMLSimulation, Source)
from torchfdtd.adjoint_memory import estimate_adjoint_memory
from torchfdtd.domain_decomposition import SlabDecomposition, ThreadTransport, spawn_local
from torchfdtd.solver import field_axes

PULSE = dict(wavelength=.6, time_definition='standard', pulse_length=.4e-15, pulse_offset=.6e-15)


def at(region, component, index):
    axes = field_axes(region, component)
    return tuple(float(axes[a][index[a]]) for a in range(3))


def lens(device='cpu', steps=40, walls=False):
    """CPML x/z (x_min CPML spans two of four slabs) or lower PMC x and PEC y walls."""
    faces = {'x_min': {'kind': 'pmc' if walls else 'pml', 'layers': 4}, 'x_max': {'kind': 'pml', 'layers': 3},
             'y_min': {'kind': 'pec' if walls else 'periodic'}, 'y_max': {'kind': 'pec' if walls else 'periodic'},
             'z_min': {'kind': 'pml', 'layers': 3}, 'z_max': {'kind': 'pml', 'layers': 4}}
    region = Region(dimension='3d', size=(1.2, .6, 1.4), mesh=.1, steps=steps, courant_factor=.9,
                    backend=device, boundaries=faces, material_sampling='yee')
    sources = [Source(kind='plane', normal='z', component='Ex', center=(.05, 0, at(region, 'Ex', (0, 0, 4))[2]),
                      size=(.45, .35 if walls else .6, 0), **PULSE),
               Source(component='Ey', center=at(region, 'Ey', (5, 2, 6)), amplitude=.3, **PULSE)]
    monitors = [Monitor(component=c, center=at(region, c, index)) for c, index in
                (('Ex', (4, 3, 8)), ('Ey', (5, 1, 9)), ('Hy', (5, 3, 9)), ('Ez', (6, 2, 7)),
                 ('Hx', (8, 4, 5)), ('Ex', (6, 2, 8)), ('Ex', (4, 3, 8)))]
    project = Project(region=region, sources=sources, monitors=monitors)
    epsilon = 1.2+torch.rand((*region.shape, 3), generator=torch.Generator().manual_seed(3))
    return project, epsilon.to(device)


def periodic(device='cpu', steps=96):
    """Periodic x/y with z CPML: the recorded-interface reconstruction contract."""
    faces = {f'{a}_{s}': {'kind': 'periodic'} for a in 'xy' for s in ('min', 'max')}
    faces.update(z_min={'kind': 'pml', 'layers': 3, 'kappa': 2, 'alpha': .03},
                 z_max={'kind': 'pml', 'layers': 4, 'kappa': 2, 'alpha': .03})
    region = Region(dimension='3d', size=(.8, .7, 2), mesh=.1, steps=steps, courant_factor=.9,
                    backend=device, boundaries=faces, material_sampling='yee')
    sources = [Source(component='Ex', center=at(region, 'Ex', (2, 3, 5)), amplitude=amplitude, **PULSE)
               for amplitude in (1., .17)]
    sources.append(Source(kind='plane', normal='z', component='Ey', center=(0, 0, at(region, 'Ey', (0, 0, 6))[2]),
                          size=(.8, .7, 0), amplitude=.4, **PULSE))
    monitors = [Monitor(component=c, center=at(region, c, index)) for c, index in
                (('Ex', (2, 3, 7)), ('Ex', (2, 3, 7)), ('Hy', (5, 3, 13)), ('Ex', (7, 3, 15)), ('Ey', (3, 1, 10)))]
    project = Project(region=region, sources=sources, monitors=monitors)
    design = 1.4+torch.rand(region.shape, generator=torch.Generator().manual_seed(5))
    fixed = torch.full(region.shape, 1.3)
    fixed[:, :, 15:] = 1.7
    return project, design.to(device), fixed.to(device)


def ranks(world, function):
    """Run function(transport) on world thread ranks and return their results in rank order."""
    transports = ThreadTransport.group(world, timeout=120)
    results, errors = [None]*world, []
    def run(rank):
        try:
            results[rank] = function(transports[rank])
        except BaseException as error:
            errors.append(error)
            transports[rank].abort()
    threads = [threading.Thread(target=run, args=(rank,)) for rank in range(world)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    if errors:
        raise errors[0]
    return results


def objective(signals):
    weights = torch.linspace(.5, 1.5, signals.shape[1], device=signals.device)
    return (signals.square().mean(0)*weights).sum()


def seed(signals):
    """Cotangent of objective, for backward calls that bypass the autograd engine."""
    weights = torch.linspace(.5, 1.5, signals.shape[1], device=signals.device)
    return 2*signals.detach()/signals.shape[0]*weights


def node_backward(output, cotangent, name):
    """Call custom backward nodes directly on this thread down to ``name``.

    CUDA autograd runs every backward of one device on one engine thread, so
    thread ranks sharing a GPU cannot use loss.backward() concurrently.
    """
    node = output.grad_fn
    value = node.apply(cotangent)[0]
    node = node.next_functions[0][0]
    while type(node).__name__ != name:
        node = node.next_functions[0][0]
    with torch.no_grad():
        return node.apply(value)[0]


def cuda_kernels():
    if not torch.cuda.is_available():
        pytest.skip('CUDA is unavailable.')
    pytest.importorskip('cupy')


@pytest.mark.parametrize('walls', [False, True])
@pytest.mark.parametrize('world', [1, 2, 4])
def test_checkpointed_signals_and_gradient_match_single_device(world, walls):
    torch.set_num_threads(1)
    project, epsilon = lens(walls=walls)
    reference = epsilon.clone().requires_grad_()
    expected = DifferentiableSimulation(project, AdjointOptions(checkpoints=3))(reference)
    objective(expected.signals).backward()
    def rank(transport):
        decomposition = SlabDecomposition(project.region, transport=transport)
        local = epsilon[decomposition.begin:decomposition.end].clone().requires_grad_()
        result = DifferentiableSimulation(project, AdjointOptions(checkpoints=3), decomposition=decomposition)(local)
        objective(result.signals).backward()
        return result.signals.detach(), local.grad, result.report['decomposition']
    results = ranks(world, rank)
    for signals, _, _ in results:
        assert torch.equal(signals, expected.signals.detach())
    assert torch.equal(torch.cat([grad for _, grad, _ in results]), reference.grad)
    assert [report['owned_rows'] for _, _, report in results] == [(12*r//world, 12*(r+1)//world) for r in range(world)]


@pytest.mark.parametrize('axis, walls, world', [(1, True, 2), (1, True, 3), (2, False, 2), (2, False, 3)])
def test_y_and_z_splits_match_single_device(axis, walls, world):
    torch.set_num_threads(1)
    project, epsilon = lens(walls=walls)
    reference = epsilon.clone().requires_grad_()
    expected = DifferentiableSimulation(project, AdjointOptions(checkpoints=2))(reference)
    objective(expected.signals).backward()
    def rank(transport):
        decomposition = SlabDecomposition(project.region, axis=axis, transport=transport)
        owned = [slice(None)]*3
        owned[axis] = slice(decomposition.begin, decomposition.end)
        local = epsilon[tuple(owned)].clone().requires_grad_()
        result = DifferentiableSimulation(project, AdjointOptions(checkpoints=2), decomposition=decomposition)(local)
        objective(result.signals).backward()
        return result.signals.detach(), local.grad
    results = ranks(world, rank)
    assert all(torch.equal(signals, expected.signals.detach()) for signals, _ in results)
    assert torch.equal(torch.cat([grad for _, grad in results], axis), reference.grad)


@pytest.mark.parametrize('world', [1, 2, 4])
def test_periodic_x_ring_checkpointed_and_reversible(world):
    torch.set_num_threads(1)
    project, design, fixed = periodic()
    checkpointed = design.clone().requires_grad_()
    expected = DifferentiableSimulation(project, AdjointOptions(checkpoints=3))(checkpointed)
    objective(expected.signals).backward()
    recorded = design.clone().requires_grad_()
    reversible = ReversibleCPMLSimulation(project)(recorded, fixed_epsilon=fixed)
    objective(reversible.signals).backward()
    def rank(transport):
        decomposition = SlabDecomposition(project.region, transport=transport)
        owned = slice(decomposition.begin, decomposition.end)
        first = design[owned].clone().requires_grad_()
        result = DifferentiableSimulation(project, AdjointOptions(checkpoints=3), decomposition=decomposition)(first)
        objective(result.signals).backward()
        second = design[owned].clone().requires_grad_()
        traced = ReversibleCPMLSimulation(project, decomposition=decomposition)(second, fixed_epsilon=fixed[owned].contiguous())
        objective(traced.signals).backward()
        return (result.signals.detach(), first.grad, traced.signals.detach(), second.grad,
                traced.report['last_backward']['initial_relative_peak'])
    results = ranks(world, rank)
    for signals, _, traced, _, drift in results:
        assert torch.equal(signals, expected.signals.detach())
        assert torch.equal(traced, reversible.signals.detach())
        assert drift == reversible.report['last_backward']['initial_relative_peak']
    assert torch.equal(torch.cat([r[1] for r in results]), checkpointed.grad)
    assert torch.equal(torch.cat([r[3] for r in results]), recorded.grad)


def test_online_spectra_and_planes_gather_every_sample():
    """Time samples are exact copies. A BLAS product over fewer columns may round differently."""
    torch.set_num_threads(1)
    project, epsilon = lens()
    region = project.region
    frequencies = torch.tensor([.03, .05])/region.time_step
    planes = project.model_copy(deep=True)
    planes.monitors = [FieldMonitor(id='plane', center=(.05, 0, at(region, 'Ex', (0, 0, 8))[2]), size=(.45, .6, 0), normal='z')]
    expected = DifferentiableSimulation(project, AdjointOptions(checkpoints=2)).spectrum(epsilon, frequencies)
    expected_plane = DifferentiablePlaneSimulation(planes, AdjointOptions(checkpoints=2))(epsilon, frequencies)['plane']
    def rank(transport):
        decomposition = SlabDecomposition(region, transport=transport)
        local = epsilon[decomposition.begin:decomposition.end]
        spectrum = DifferentiableSimulation(project, AdjointOptions(checkpoints=2), decomposition=decomposition).spectrum(local, frequencies)
        plane = DifferentiablePlaneSimulation(planes, AdjointOptions(checkpoints=2), decomposition=decomposition)(local, frequencies)['plane']
        return spectrum.fields, plane.fields
    for world in (2, 4):
        for spectrum, plane in ranks(world, rank):
            torch.testing.assert_close(spectrum, expected.fields, rtol=1e-6, atol=1e-6*float(expected.fields.abs().max()))
            torch.testing.assert_close(plane, expected_plane.fields, rtol=1e-6, atol=1e-6*float(expected_plane.fields.abs().max()))
    p, design, fixed = periodic(steps=64)
    p.monitors = [FieldMonitor(id='plane', center=(0, 0, at(p.region, 'Ex', (0, 0, 10))[2]), size=(.8, .7, 0), normal='z')]
    frequencies = torch.tensor([.03, .05])/p.region.time_step
    expected = ReversibleCPMLPlaneSimulation(p)(design, frequencies, fixed_epsilon=fixed)['plane']
    def recorded(transport):
        decomposition = SlabDecomposition(p.region, transport=transport)
        owned = slice(decomposition.begin, decomposition.end)
        model = ReversibleCPMLPlaneSimulation(p, decomposition=decomposition)
        return model(design[owned].contiguous(), frequencies, fixed_epsilon=fixed[owned].contiguous())['plane'].fields
    for plane in ranks(2, recorded):
        torch.testing.assert_close(plane, expected.fields, rtol=1e-6, atol=1e-6*float(expected.fields.abs().max()))


def test_admission_rejections_and_slab_reservation():
    project, epsilon = lens()
    full = estimate_adjoint_memory(project, AdjointOptions(checkpoints=2))
    def rank(transport):
        decomposition = SlabDecomposition(project.region, transport=transport)
        local = estimate_adjoint_memory(project, AdjointOptions(checkpoints=2), decomposition=decomposition)
        model = DifferentiableSimulation(project, AdjointOptions(checkpoints=2), decomposition=decomposition)
        # One rank passes a wrong shape; every rank raises instead of waiting.
        wrong = epsilon if transport.rank == 0 else epsilon[decomposition.begin:decomposition.end]
        with pytest.raises(ValueError, match='shape|rank 0'):
            model(wrong)
        return local['restart_state_bytes']
    states = ranks(4, rank)
    assert max(states) < full['restart_state_bytes']/2
    p, _, _ = periodic()
    with pytest.raises(ValueError, match='periodic split axis must be x'):
        ranks(2, lambda transport: SlabDecomposition(p.region, axis=1, transport=transport))
    with pytest.raises(ValueError, match='at least one row'):
        ranks(2, lambda transport: SlabDecomposition(p.region.model_copy(update=dict(size=(.1, .7, 2))), transport=transport))
    with pytest.raises(ValueError, match='split, single-cell'):
        ranks(1, lambda transport: ReversibleCPMLSimulation(p, ReversibleCPMLOptions(adjoint_kernel='one_pass'),
                                                            decomposition=SlabDecomposition(p.region, transport=transport)))


@pytest.mark.parametrize('walls', [False, True])
def test_cuda_fused_slabs_match_single_device(walls):
    cuda_kernels()
    project, epsilon = lens('cuda', steps=60, walls=walls)
    epsilon = epsilon.to('cuda')
    reference = epsilon.clone().requires_grad_()
    torch_options = AdjointOptions(checkpoints=3, backward_kernel='torch')
    expected = DifferentiableSimulation(project, torch_options)(reference)
    assert expected.report['forward_backend'] == 'fused CUDA'
    expected.signals.backward(seed(expected.signals))
    for world in (1, 2, 4):
        def rank(transport):
            decomposition = SlabDecomposition(project.region, transport=transport)
            local = epsilon[decomposition.begin:decomposition.end].clone().requires_grad_()
            result = DifferentiableSimulation(project, torch_options, decomposition=decomposition)(local)
            extended = node_backward(result.signals, seed(result.signals.detach()), '_FDTDBackward')
            return result.signals.detach(), extended[decomposition.owned], result.report['forward_backend']
        results = ranks(world, rank)
        assert all(torch.equal(signals, expected.signals.detach()) and backend == 'fused CUDA'
                   for signals, _, backend in results)
        assert torch.equal(torch.cat([grad for _, grad, _ in results]), reference.grad)


def test_cuda_reversible_slabs_match_single_device():
    cuda_kernels()
    project, design, fixed = periodic('cuda')
    reference = design.clone().requires_grad_()
    expected = ReversibleCPMLSimulation(project)(reference, fixed_epsilon=fixed)
    expected.signals.backward(seed(expected.signals))
    a, b = expected.report['reconstruction_interval_z']
    for world in (1, 2, 4):
        def rank(transport):
            decomposition = SlabDecomposition(project.region, transport=transport)
            owned = slice(decomposition.begin, decomposition.end)
            local = design[owned].clone().requires_grad_()
            result = ReversibleCPMLSimulation(project, decomposition=decomposition)(local, fixed_epsilon=fixed[owned].contiguous())
            effective = node_backward(result.signals, seed(result.signals.detach()), '_RecordedCPMLBackward')
            return result.signals.detach(), effective[decomposition.owned][:, :, a:b+1]
        results = ranks(world, rank)
        assert all(torch.equal(signals, expected.signals.detach()) for signals, _ in results)
        assert torch.equal(torch.cat([grad for _, grad in results]), reference.grad[:, :, a:b+1])


def _gloo_rank(rank, world, directory):
    torch.set_num_threads(1)
    project, epsilon = lens()
    decomposition = SlabDecomposition(project.region)
    local = epsilon[decomposition.begin:decomposition.end].clone().requires_grad_()
    result = DifferentiableSimulation(project, AdjointOptions(checkpoints=3), decomposition=decomposition)(local)
    objective(result.signals).backward()
    p, design, fixed = periodic()
    decomposition = SlabDecomposition(p.region)
    owned = slice(decomposition.begin, decomposition.end)
    recorded = design[owned].clone().requires_grad_()
    traced = ReversibleCPMLSimulation(p, decomposition=decomposition)(recorded, fixed_epsilon=fixed[owned].contiguous())
    objective(traced.signals).backward()
    torch.save(dict(signals=result.signals.detach(), gradient=local.grad, traced=traced.signals.detach(),
                    recorded=recorded.grad), os.path.join(directory, f'{rank}.pt'))


@pytest.mark.skipif(sys.platform == 'win32', reason='Windows Gloo cannot create its TCP device; run on Linux/WSL.')
@pytest.mark.parametrize('world', [2, 4])
def test_gloo_processes_match_single_device(tmp_path, world):
    torch.set_num_threads(1)
    project, epsilon = lens()
    reference = epsilon.clone().requires_grad_()
    expected = DifferentiableSimulation(project, AdjointOptions(checkpoints=3))(reference)
    objective(expected.signals).backward()
    p, design, fixed = periodic()
    recorded = design.clone().requires_grad_()
    reversible = ReversibleCPMLSimulation(p)(recorded, fixed_epsilon=fixed)
    objective(reversible.signals).backward()
    spawn_local(_gloo_rank, world, str(tmp_path), timeout_seconds=120)
    results = [torch.load(tmp_path/f'{rank}.pt') for rank in range(world)]
    for result in results:
        assert torch.equal(result['signals'], expected.signals.detach())
        assert torch.equal(result['traced'], reversible.signals.detach())
    assert torch.equal(torch.cat([r['gradient'] for r in results]), reference.grad)
    assert torch.equal(torch.cat([r['recorded'] for r in results]), recorded.grad)
