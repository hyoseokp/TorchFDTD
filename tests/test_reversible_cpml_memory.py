"""Metadata admission only, including emulated CUDA arithmetic without CUDA."""
from types import SimpleNamespace

import pytest
import torch

from torchfdtd.reversible_cpml_memory import _cpml_reversible_reservation


def options(storage='device', **budgets):
    return SimpleNamespace(trace_storage=storage, collar_cells=1, **budgets)


def mock_base(monkeypatch):
    import torchfdtd.adjoint_memory as base
    import torchfdtd.memory_profile as host
    import torchfdtd.cuda_memory as cuda
    calls = []
    def reserve(project, opts, device, spectral=None, decomposition=None):
        assert opts.checkpoints == 1 and opts.storage == 'device'
        assert opts.host_budget_bytes is opts.gpu_budget_bytes is None
        assert opts.backward_kernel == ('fused' if device.type == 'cuda' else 'torch')
        calls.append(opts.resident_budget_bytes)
        return dict(memory_reservation_bytes=1000, host_reservation_bytes=1000 if device.type == 'cpu' else 100,
            workspace_reservation_bytes=400, workspace_components_bytes={'base': 400},
            workspace_model='test', allocation_headroom_bytes=20,
            device_checkpoint_reservation_bytes=900, output_history_bytes=80, history_reservation_bytes=160)
    monkeypatch.setattr(base, '_resident_reservation', reserve)
    monkeypatch.setattr(host, 'host_memory', lambda: {'available_bytes': 10**12})
    monkeypatch.setattr(cuda, 'cuda_budget_limit', lambda device, required, budget: budget or 10**12)
    project = SimpleNamespace(region=SimpleNamespace(shape=(4, 3, 8), steps=10), sources=[])
    return project, calls


@pytest.mark.parametrize('device,storage', [('cpu', 'device'), ('cpu', 'cpu'), ('cuda', 'device'), ('cuda', 'cpu')])
def test_complete_arithmetic_and_metadata_only(monkeypatch, device, storage):
    p, calls = mock_base(monkeypatch)
    monkeypatch.setattr(torch, 'empty', lambda *a, **k: pytest.fail('tensor allocation'))
    monkeypatch.setattr(torch, 'tensor', lambda *a, **k: pytest.fail('tensor allocation'))
    result = _cpml_reversible_reservation(p, options(storage, resident_budget_bytes=10**8), device, (2, 5))
    diagnostic = 24*(3*4*3*4)+4096
    material, frame, trace = 3*96*4, 4*12*4, 10*4*12*4
    transfer = 2*frame if device == 'cuda' and storage == 'cpu' else 0
    active_extra = diagnostic+material+transfer+(trace if device == 'cuda' and storage == 'device' else 0)
    headroom = (active_extra+19)//20+4096 if device == 'cuda' else 0
    host_extra = (trace if device == 'cpu' or storage == 'cpu' else 0)+(frame if transfer else 0)
    expected_active = 1000+active_extra+headroom+(host_extra if device == 'cpu' else 0)
    expected_host = (1000+active_extra if device == 'cpu' else 100)+host_extra
    assert result['memory_reservation_bytes'] == expected_active
    assert result['host_reservation_bytes'] == expected_host
    assert result['trace_bytes'] == trace
    assert result['trace_shape'] == (10, 2, 4, 3, 2)
    assert result['trace_transfer_device_bytes'] == transfer
    assert result['terminal_state_bytes'] == 6*12*4*4
    assert result['terminal_state_allowance_bytes'] == 900
    assert result['checkpoint_states'] == result['device_checkpoint_reservation_bytes'] == 0
    assert result['diagnostic_buffer_bytes'] == 24*144
    assert result['retained_caller_inputs_bytes'] == 2*96*4
    assert result['conservative_extra_active_bytes'] == active_extra+headroom
    assert calls == [10**8]


def test_recorded_observation_map_is_admitted_on_host_and_device(monkeypatch):
    project, _ = mock_base(monkeypatch)
    before = _cpml_reversible_reservation(project, options(), 'cuda', (2, 5))
    project.monitors = [object()]*5
    after = _cpml_reversible_reservation(project, options(), 'cuda', (2, 5))
    assert after['recorded_observation_map_bytes'] == 40
    assert after['host_reservation_bytes'] == before['host_reservation_bytes']+40
    assert after['memory_reservation_bytes'] >= before['memory_reservation_bytes']+40
    with pytest.raises(ValueError, match='CUDA budget'):
        _cpml_reversible_reservation(project, options(gpu_budget_bytes=before['memory_reservation_bytes']), 'cuda', (2, 5))


@pytest.mark.parametrize('device,storage,budget', [
    ('cpu', 'cpu', 'host_budget_bytes'), ('cpu', 'device', 'resident_budget_bytes'),
    ('cuda', 'device', 'gpu_budget_bytes'), ('cuda', 'cpu', 'host_budget_bytes'),
    ('cuda', 'cpu', 'resident_budget_bytes')])
def test_extras_cannot_bypass_budget(monkeypatch, device, storage, budget):
    p, _ = mock_base(monkeypatch)
    with pytest.raises(ValueError, match='budget'):
        _cpml_reversible_reservation(p, options(storage, **{budget: 1000}), device, (2, 5))


def test_live_host_limit_and_invalid_metadata(monkeypatch):
    p, _ = mock_base(monkeypatch)
    import torchfdtd.memory_profile as host
    monkeypatch.setattr(host, 'host_memory', lambda: {'available_bytes': 1100})
    with pytest.raises(ValueError, match='available host memory'):
        _cpml_reversible_reservation(p, options('cpu'), 'cuda', (2, 5))
    for opts, span, match in [(options('disk'), (2, 5), 'storage'),
                              (options(), (-1, 5), 'interval'),
                              (options(host_budget_bytes=True), (2, 5), 'positive integer')]:
        with pytest.raises(ValueError, match=match):
            _cpml_reversible_reservation(p, opts, 'cpu', span)


def test_real_cpml_budgeted_metadata_plan():
    from torchfdtd.models import Monitor, Project, Region, Source
    faces = {a+'_'+side: {'kind': 'periodic'} for a in 'xy' for side in ('min', 'max')}
    faces.update(z_min={'kind': 'pml', 'layers': 3}, z_max={'kind': 'pml', 'layers': 4})
    project = Project(region=Region(dimension='3d', size=(.6, .7, 2), mesh=.1,
        steps=10, backend='cpu', memory_mode='budgeted', boundaries=faces),
        sources=[Source(component='Ex', center=(0, 0, 0))],
        monitors=[Monitor(component='Ex', center=(0, 0, 0))])
    result = _cpml_reversible_reservation(project,
        options('cpu', resident_budget_bytes=64*1024**2), 'cpu', (4, 14))
    assert result['budgeted_resident']
    assert result['terminal_state_allowance_bytes'] > result['terminal_state_bytes']
    assert result['trace_bytes'] == 10*4*6*7*4
    assert result['source_preparation_host_bytes'] == 10*(128+32)
    assert result['gpu_reservation_bytes'] == 0
    assert result['host_reservation_bytes'] == result['memory_reservation_bytes']


@pytest.mark.parametrize('complex_fields,components', [(False, 1), (True, 1), (True, 3)])
def test_async_trace_and_diagonal_complex_accounting(monkeypatch, complex_fields, components):
    p, _ = mock_base(monkeypatch)
    p.region.complex_fields = complex_fields
    p.region.cuda_kernel = 'fused'
    opts = options('cpu', trace_transfers='async', trace_chunk_steps=7)
    result = _cpml_reversible_reservation(p, opts, 'cuda', (2, 5), material_components=components)
    item = 8 if complex_fields else 4
    frame = 4*12*item
    assert result['trace_bytes'] == 10*frame
    assert result['trace_transfer_device_bytes'] == result['trace_pinned_host_bytes'] == 2*7*frame
    assert result['trace_host_metadata_bytes'] == 65536
    assert result['trace_reusable_event_count'] == 8
    assert result['host_reservation_bytes'] == 100+10*frame+2*7*frame+65536
    assert result['material_assembly_and_autograd_bytes'] == 3*components*96*4
    assert result['retained_caller_inputs_bytes'] == 2*components*96*4
    assert result['terminal_state_bytes'] == 6*12*4*item
    assert result['diagnostic_chunk_elements'] == 144*(2 if complex_fields else 1)
    assert result['trace_transfer'] == 'asynchronous'
    short = _cpml_reversible_reservation(p, options('cpu', trace_transfers='async', trace_chunk_steps=32),
        'cuda', (2, 5), material_components=components)
    assert short['trace_chunk_steps'] == 10 and short['trace_requested_chunk_steps'] == 32


@pytest.mark.parametrize('device,storage', [('cpu', 'cpu'), ('cpu', 'device'), ('cuda', 'device')])
def test_async_rejects_unsupported_transport_before_base(monkeypatch, device, storage):
    p, calls = mock_base(monkeypatch)
    with pytest.raises(ValueError, match='Asynchronous traces require'):
        _cpml_reversible_reservation(p, options(storage, trace_transfers='async'), device, (2, 5))
    assert not calls


def test_async_extra_host_and_gpu_budgets_and_component_rejection(monkeypatch):
    p, _ = mock_base(monkeypatch)
    for budget in ('host_budget_bytes', 'resident_budget_bytes', 'gpu_budget_bytes'):
        with pytest.raises(ValueError, match='budget'):
            _cpml_reversible_reservation(p, options('cpu', trace_transfers='async', **{budget: 1000}),
                                         'cuda', (2, 5))
    for components in (0, 2, True):
        with pytest.raises(ValueError, match='material_components'):
            _cpml_reversible_reservation(p, options(), 'cpu', (2, 5), material_components=components)
    for k in (0, 1025, True):
        with pytest.raises(ValueError, match='trace_chunk_steps'):
            _cpml_reversible_reservation(p, options(trace_chunk_steps=k), 'cpu', (2, 5))


def test_complex_fused_project_copy_and_spectral_forwarding(monkeypatch):
    from torchfdtd.models import Monitor, Project, Region
    import torchfdtd.adjoint_memory as base
    p, _ = mock_base(monkeypatch)
    original = base._resident_reservation
    faces = {a+'_'+side: {'kind': 'periodic'} for a in 'xy' for side in ('min', 'max')}
    faces['x_min'] = faces['x_max'] = {'kind': 'bloch'}
    faces.update(z_min={'kind': 'pml', 'layers': 3}, z_max={'kind': 'pml', 'layers': 4})
    project = Project(region=Region(dimension='3d', size=(.6, .7, 2), mesh=.1, steps=10,
        boundaries=faces, bloch_phase=(.2, 0, 0), cuda_kernel='torch'),
        monitors=[Monitor(component='Ex', center=(0, 0, 0))])
    sentinel = SimpleNamespace(block_size=3, components=('Ex',), reservation=lambda depth: {'spectral_reservation_bytes': 160})
    def capture(copy, opts, device, spectral=None, decomposition=None):
        assert copy is not project and copy.region is not project.region
        assert copy.region.cuda_kernel == 'fused'
        assert spectral is sentinel
        return original(copy, opts, device, spectral)
    monkeypatch.setattr(base, '_resident_reservation', capture)
    _cpml_reversible_reservation(project, options('cpu'), 'cuda', (4, 14), spectral=sentinel)
    assert project.region.cuda_kernel == 'torch'


@pytest.mark.parametrize('complex_fields,components', [(False, 1), (True, 3)])
def test_spectral_layout_total_admission_and_bounded_history(monkeypatch, complex_fields, components):
    p, _ = mock_base(monkeypatch)
    p.region.complex_fields = complex_fields
    p.region.cuda_kernel = 'fused'
    import torchfdtd.adjoint_memory as base
    previous = base._resident_reservation
    settings = SimpleNamespace(block_size=3, components=('Ex', 'Hy'), layout_reservation_bytes=12345)
    settings.reservation = lambda depth: dict(spectral_output_bytes=32,
        spectral_workspace_bytes=depth*2*32, spectral_settings_bytes=16,
        spectral_reservation_bytes=64+depth*2*32+16,
        plane_workspace_reservation_bytes=256)
    def spectral_base(project, opts, device, spectral=None, decomposition=None):
        assert spectral is settings
        result = previous(project, opts, device, spectral)
        result.update(output_history_bytes=0, history_reservation_bytes=settings.reservation(3)['spectral_reservation_bytes'])
        return result
    monkeypatch.setattr(base, '_resident_reservation', spectral_base)
    def calculate(device, **budgets):
        return _cpml_reversible_reservation(p, options('cpu', **budgets), device, (2, 5),
                                           material_components=components, spectral=settings)
    for device in ('cpu', 'cuda'):
        full = calculate(device)
        assert not full['observation_history_retained'] and full['online_spectrum']
        assert full['spectral_block_shape'] == (3, 2)
        assert full['spectral_monitor_count'] == 2
        assert full['output_history_bytes'] == 0
        assert full['contiguous_seed_reservation_bytes'] == 3*2*(8 if complex_fields else 4)
        assert full['plane_workspace_reservation_bytes'] == 256
        assert full['host_spectral_layout_bytes'] == 12345
        with pytest.raises(ValueError, match='host budget'):
            calculate(device, host_budget_bytes=full['host_reservation_bytes']-1)
        if device == 'cpu':
            with pytest.raises(ValueError, match='resident budget'):
                calculate(device, resident_budget_bytes=full['memory_reservation_bytes']-1)
        settings.layout_reservation_bytes = 0
        empty = calculate(device)
        assert full['host_reservation_bytes']-empty['host_reservation_bytes'] == 12345
        assert full['memory_reservation_bytes']-empty['memory_reservation_bytes'] == (12345 if device == 'cpu' else 0)
        settings.layout_reservation_bytes = 12345
    short = calculate('cpu')
    p.region.steps = 10000
    long = calculate('cpu')
    assert short['history_reservation_bytes'] == long['history_reservation_bytes']
    assert short['spectral_block_shape'] == long['spectral_block_shape']
    assert long['trace_bytes'] > short['trace_bytes']  # Physical boundary archive is still O(T*area).


def test_spectral_layout_validation_precedes_base(monkeypatch):
    p, calls = mock_base(monkeypatch)
    for invalid in (-1, True, 1.2):
        with pytest.raises(ValueError, match='nonnegative integer'):
            _cpml_reversible_reservation(p, options(), 'cpu', (2, 5),
                                         spectral=SimpleNamespace(layout_reservation_bytes=invalid))
    assert not calls
