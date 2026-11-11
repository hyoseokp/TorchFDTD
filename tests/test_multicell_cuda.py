"""Multi-entry launches must preserve split fields, archives and material VJPs."""
from types import SimpleNamespace

import pytest
import torch

from torchfdtd import ReversibleCPMLOptions, ReversibleCPMLSimulation
from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
from torchfdtd.reversible_cpml import _recorded_system, _advance_recorded
from torchfdtd.reversible_cuda_tuning import multicell_source, _MultiCellLaunch
from test_reversible_cpml import fixture


@pytest.mark.parametrize('value', [True, False, 0, 3, 8, 2.0, 'strided', None])
def test_invalid_cell_counts(value):
    with pytest.raises(ValueError, match='cells_per_thread'):
        ReversibleCPMLOptions(cells_per_thread=value)


@pytest.mark.parametrize('setting', ['forward_kernel', 'adjoint_kernel'])
def test_multicell_rejects_different_fused_algorithms(setting):
    value = 'fused_eh' if setting == 'forward_kernel' else 'one_pass'
    with pytest.raises(ValueError, match='split E/H'):
        ReversibleCPMLOptions(cells_per_thread=2, **{setting: value})


def test_existing_default_and_cpu_fallback():
    assert ReversibleCPMLOptions().cells_per_thread == 1
    p, base, fixed = fixture(12)
    with torch.no_grad():
        original = ReversibleCPMLSimulation(p)(base, fixed_epsilon=fixed)
        selected = ReversibleCPMLSimulation(p, ReversibleCPMLOptions(
            cells_per_thread='auto', block_size='auto'))(base, fixed_epsilon=fixed)
    assert torch.equal(original.signals, selected.signals)
    assert selected.report['cuda_tuning_scratch_bytes'] == 0
    assert 'CUDA' in selected.report['fallback_reason']['cells_per_thread']


@pytest.mark.parametrize('complex_fields', [False, True])
def test_field_offset_guard_before_any_allocation(complex_fields, monkeypatch):
    from torchfdtd.adjoint_memory import _cuda_index_contract
    lanes = 6 if complex_fields else 3
    boundary = (2**31+lanes-1)//lanes
    monkeypatch.setattr(torch, 'empty', lambda *a, **k: pytest.fail('allocation before rejection'))
    region = SimpleNamespace(shape=(1, 1, boundary-1), complex_fields=complex_fields)
    _cuda_index_contract(region, region.shape, 0, 0)
    region.shape = (1, 1, boundary)
    with pytest.raises(ValueError, match='signed 32-bit'):
        _cuda_index_contract(region, region.shape, 0, 0)
    with pytest.raises(ValueError, match='signed 32-bit'):
        multicell_source('', 'unused', 2**31, 4)


def cuda_case(diagonal, bloch, steps=24):
    prepare_cuda_kernels()
    p, base, fixed = fixture(steps)
    # Nz=21 is divisible by neither two nor four; the launch tail is partial.
    p.region.size = (.6, .7, 2.1)
    p.region._mesh_cache = None
    p.region.backend = 'cuda'
    base = torch.cat((base, base[:, :, -1:]), 2)
    fixed = torch.cat((fixed, fixed[:, :, -1:]), 2)
    if diagonal:
        base = torch.stack((base, base+.13, base+.29), -1)
        fixed = torch.stack((fixed, fixed+.07, fixed+.11), -1)
    if bloch:
        for axis in (0, 1):
            for face in p.region.boundaries.pair(axis):
                face.kind = 'bloch'
        p.region.bloch_phase = (.31, -.47, 0.)
    return p, base.cuda(), fixed.cuda()


@pytest.mark.cuda
@pytest.mark.parametrize('block', [128, 256, 512, 1024])
@pytest.mark.parametrize('cells', [1, 2, 4])
def test_launch_tail_and_void_return_do_not_drop_later_entries(block, cells):
    prepare_cuda_kernels()
    import cupy
    from torchfdtd.cuda_kernels import _compile, _direct_cuda_view
    count = 4*1024+13
    source = f'''extern "C" __global__ void visits(unsigned long long* out){{
const int i=blockIdx.x*blockDim.x+threadIdx.x;
if(i>={count})return;
if(i%17==0)return;
atomicAdd(out+i,1ULL);
}}'''
    source = multicell_source(source, 'visits', count, cells)
    function, module = _compile(source, 0, cupy.cuda.Device(0).compute_capability, 'visits')
    output = torch.zeros(count, dtype=torch.int64, device='cuda')
    with cupy.cuda.ExternalStream(torch.cuda.current_stream().cuda_stream, device_id=0):
        launch = _MultiCellLaunch(function, cells)
        launch(((count+block-1)//block,), (block,), (_direct_cuda_view(cupy, output),))
    expected = (torch.arange(count, device='cuda') % 17 != 0).long()
    assert torch.equal(output, expected)


@pytest.mark.cuda
@pytest.mark.parametrize('diagonal', [False, True])
@pytest.mark.parametrize('bloch', [False, True])
@pytest.mark.parametrize('block', [128, 256, 512, 1024])
@pytest.mark.parametrize('cells', [1, 2, 4])
def test_every_step_fields_and_cpml_are_bitwise_equal(diagonal, bloch, block, cells):
    p, base, _ = cuda_case(diagonal, bloch)
    baseline = _recorded_system(base, p, None)
    report = {}
    selected = _recorded_system(base, p, None, ReversibleCPMLOptions(
        block_size=block, cells_per_thread=cells), report)
    for step in range(p.region.steps):
        for system in (baseline, selected):
            _advance_recorded(system, step, None, 4, 15)
        assert all(torch.equal(a, b) for a, b in zip(baseline.state(), selected.state()))
    if cells != 1 or not bloch:
        assert all(entry['cells_per_thread'] == cells for entry in report['cuda_launches'].values())
        assert not report['fallback_reason']


@pytest.mark.cuda
@pytest.mark.parametrize('diagonal,bloch', [(False, False), (True, False), (False, True), (True, True)])
@pytest.mark.parametrize('storage,transfers', [('device', 'sync'), ('cpu', 'sync'), ('cpu', 'async')])
@pytest.mark.parametrize('block', [128, 256, 512, 1024])
@pytest.mark.parametrize('cells', [2, 4])
def test_archives_terminal_states_and_retained_vjps(diagonal, bloch, storage, transfers, block, cells):
    p, base, fixed = cuda_case(diagonal, bloch)
    leaves = [base.clone().requires_grad_() for _ in range(2)]
    results = [ReversibleCPMLSimulation(p, ReversibleCPMLOptions(
        trace_storage=storage, trace_transfers=transfers, trace_chunk_steps=5,
        block_size=block if index else None, cells_per_thread=cells if index else 1))(
            leaf, fixed_epsilon=fixed) for index, leaf in enumerate(leaves)]
    assert torch.equal(results[0].signals, results[1].signals)
    for a, b in zip(results[0].signals.grad_fn.saved_tensors, results[1].signals.grad_fn.saved_tensors):
        assert torch.equal(a, b)
    for a, b in zip(results[0].signals.grad_fn.system.state(), results[1].signals.grad_fn.system.state()):
        assert torch.equal(a, b)
    generator = torch.Generator().manual_seed(201)
    for _ in range(2):
        seed = torch.randn((4, p.region.steps), dtype=results[0].signals.dtype, generator=generator).cuda().T
        gradients = [torch.autograd.grad(r.signals, leaf, seed, retain_graph=True)[0]
                     for r, leaf in zip(results, leaves)]
        assert torch.equal(gradients[0], gradients[1])
    assert not results[1].report['fallback_reason']
    for name, entry in results[1].report['cuda_launches'].items():
        if name.startswith(('yee_', 'adjoint_')):
            assert entry['cells_per_thread'] == cells


@pytest.mark.cuda
@pytest.mark.parametrize('bloch', [False, True])
def test_joint_autotune_cache_and_reservation(bloch, monkeypatch):
    from collections import OrderedDict
    import torchfdtd.reversible_cuda_tuning as tuning
    monkeypatch.setattr(tuning, '_CACHE', OrderedDict())
    p, base, fixed = cuda_case(True, bloch)
    options = ReversibleCPMLOptions(cells_per_thread='auto', block_size='auto')
    model = ReversibleCPMLSimulation(p, options)
    plan = model.plan(device='cuda', material_components=3)
    assert plan['cuda_tuning_scratch_bytes'] > 6*base.shape[0]*base.shape[1]*base.shape[2]*base.element_size()
    outcomes = []
    for _ in range(2):
        value = base.clone().requires_grad_()
        torch.cuda.synchronize()
        before = torch.cuda.memory_allocated()
        torch.cuda.reset_peak_memory_stats()
        result = model(value, fixed_epsilon=fixed)
        gradient, = torch.autograd.grad(result.signals.abs().square().sum(), value)
        torch.cuda.synchronize()
        assert torch.cuda.max_memory_allocated()-before <= result.report['gpu_reservation_bytes']
        outcomes.append((result, gradient))
    assert torch.equal(outcomes[0][0].signals, outcomes[1][0].signals)
    assert torch.equal(outcomes[0][1], outcomes[1][1])
    for entry in outcomes[1][0].report['cuda_launches'].values():
        assert entry['cached']
        assert entry['cells_per_thread'] in (1, 2, 4)
        if entry['cells_per_thread_requested'] == 'auto':
            assert len(entry['median_ms']) == 12
