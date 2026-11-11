"""CPU public integration for complex/diagonal recorded-interface CPML."""
import json
import math
from types import SimpleNamespace

import pytest
import torch

from torchfdtd import (AdjointOptions, DifferentiableSimulation,
                       ReversibleCPMLOptions, ReversibleCPMLSimulation)
from test_reversible_cpml import fixture, effective


def extended_fixture(complex_fields=True, zero_phase=False):
    project, base, fixed = fixture(48)
    if complex_fields:
        for axis in 'xy':
            for side in ('min', 'max'):
                getattr(project.region.boundaries, f'{axis}_{side}').kind = 'bloch'
        project.region.bloch_phase = (0., 0., 0.) if zero_phase else (.43, -.37, 0.)
    project.sources = [s.model_copy(update={'kind': 'plane', 'normal': 'z',
        'center': (0., 0., s.center[2]), 'size': (.6, .7, 0.)}) for s in project.sources]
    # fdtd may change Torch's default dtype. Never inherit it in the material,
    # objective or seed contract exercised by these tests.
    offsets = torch.tensor([0., .2, .4], dtype=torch.float32)
    base = base.to(torch.float32)[..., None].repeat(1, 1, 1, 3)+offsets
    fixed = fixed.to(torch.float32)[..., None].repeat(1, 1, 1, 3)+offsets
    return project, base.contiguous(), fixed.contiguous()


def relative(actual, expected):
    return float((actual-expected).abs().double().norm()/expected.abs().double().norm().clamp_min(1e-30))


@pytest.mark.parametrize('complex_fields,zero_phase,storage', [
    (True, False, 'device'), (True, False, 'cpu'),
    (True, True, 'device'), (False, True, 'device'),
])
def test_public_diagonal_plane_material_vjp_and_retained_seeds(complex_fields, zero_phase, storage):
    torch.set_num_threads(1)
    project, base, fixed = extended_fixture(complex_fields, zero_phase)
    model = ReversibleCPMLSimulation(project, ReversibleCPMLOptions(trace_storage=storage))
    parameter, ref_parameter = base.clone().requires_grad_(), base.clone().requires_grad_()
    result = model(parameter, fixed_epsilon=fixed)
    reference = DifferentiableSimulation(project, AdjointOptions(checkpoints=3, backward_kernel='torch'))(
        effective(ref_parameter, fixed, model.interior_z))
    dtype = torch.complex64 if complex_fields else torch.float32
    assert result.signals.dtype == dtype
    assert parameter.dtype == fixed.dtype == torch.float32
    torch.testing.assert_close(result.signals, reference.signals, rtol=0, atol=0)
    weights = torch.tensor([1., .2, .3, .4], dtype=torch.float32)
    loss = (result.signals.abs().square().mean(0)*weights).sum()
    ref_loss = (reference.signals.abs().square().mean(0)*weights).sum()
    grad, = torch.autograd.grad(loss, parameter, retain_graph=True)
    ref_grad, = torch.autograd.grad(ref_loss, ref_parameter, retain_graph=True)
    error = relative(grad, ref_grad)
    assert error < 1e-4
    assert torch.count_nonzero(grad[:, :, :4]) == 0
    assert torch.count_nonzero(grad[:, :, 15:]) == 0
    if complex_fields and not zero_phase:
        assert all(float(grad[..., component].norm()) > 0 for component in range(3))
    else:
        # Normal-incidence Ex in an xy-uniform diagonal guide does not excite
        # Ey or Ez. Their exact zero VJPs are the expected polarization limit.
        assert float(grad[..., 0].norm()) > 0
        assert torch.count_nonzero(grad[..., 1:]) == 0
    generator = torch.Generator().manual_seed(163)
    seed_errors = []
    for index in range(2):
        seed = torch.randn((4, project.region.steps), generator=generator, dtype=dtype).T
        if index == 0:
            seed[:, :3] = 0  # Only the fixed-collar observer is active.
        assert not seed.is_contiguous()
        actual, = torch.autograd.grad(result.signals, parameter, seed, retain_graph=True)
        expected, = torch.autograd.grad(reference.signals, ref_parameter, seed, retain_graph=True)
        seed_errors.append(relative(actual, expected))
        assert seed_errors[-1] < 1e-4
        assert torch.count_nonzero(actual[:, :, :4]) == 0
        assert torch.count_nonzero(actual[:, :, 15:]) == 0
    assert result.report['backward_calls'] == 3
    assert result.report['last_backward']['initial_relative_l2'] < 1e-4
    field_bytes = 8 if complex_fields else 4
    assert result.report['trace_bytes'] == 48*4*6*7*field_bytes
    assert result.report['terminal_state_bytes'] == 6*6*7*11*field_bytes
    print('EXTENDED_METRIC '+json.dumps(dict(complex_fields=complex_fields,
        zero_phase=zero_phase, storage=storage, history_bitwise_equal=True,
        gradient_relative_l2=error, retained_seed_relative_l2=seed_errors,
        initial_relative_l2=result.report['last_backward']['initial_relative_l2'],
        source_kind='z-normal soft E plane', material_shape=list(base.shape),
        trace_bytes=result.report['trace_bytes'], terminal_bytes=result.report['terminal_state_bytes'])))


def test_extended_scope_and_budgets_reject_before_fields(monkeypatch):
    import torchfdtd.reversible_cpml as module
    project, base, fixed = extended_fixture()
    def forbidden(*args, **kwargs):
        pytest.fail('Rejected configuration reached field construction')
    monkeypatch.setattr(module, '_System', forbidden)
    for options in (ReversibleCPMLOptions(resident_budget_bytes=1),
                    ReversibleCPMLOptions(host_budget_bytes=1)):
        with pytest.raises(ValueError, match='budget'):
            ReversibleCPMLSimulation(project, options)(base, fixed_epsilon=fixed)
    with pytest.raises(ValueError, match='same scalar or diagonal shape'):
        ReversibleCPMLSimulation(project)(base, fixed_epsilon=fixed[..., 0].contiguous())
    with pytest.raises(ValueError, match='FP32'):
        ReversibleCPMLSimulation(project)(base.double(), fixed_epsilon=fixed)
    with pytest.raises(ValueError, match='must not require gradients'):
        ReversibleCPMLSimulation(project)(base, fixed_epsilon=fixed.clone().requires_grad_())
    unsupported = project.model_copy(deep=True)
    unsupported.sources[0] = unsupported.sources[0].model_copy(update={'normal': 'x', 'component': 'Ey'})
    with pytest.raises(ValueError, match='z-normal plane'):
        ReversibleCPMLSimulation(unsupported)
    with pytest.raises(ValueError, match='CUDA|cuda|asynchronous|Asynchronous'):
        ReversibleCPMLSimulation(project, ReversibleCPMLOptions(
            trace_storage='cpu', trace_transfers='async'))(base, fixed_epsilon=fixed)


def test_complex_imaginary_diagnostic_and_bounded_chunks():
    from torchfdtd.reversible_cpml import _interior_blocks, _interior_scale
    # Exercise both many transverse rows and a z interval longer than one
    # chunk. Exterior NaNs must be excluded and imaginary lanes included.
    for shape in ((40, 30, 25, 3), (1, 1, 25000, 3)):
        a, b = 2, shape[2]-3
        e = torch.full(shape, complex(float('nan'), float('nan')), dtype=torch.complex64)
        h = e.clone()
        e[:, :, a:b+1] = 2j
        h[:, :, a:b+1] = 3j
        blocks = list(_interior_blocks(e, a, b))
        assert all(block.numel()*2 <= 65536 for block in blocks)
        assert sum(block.numel() for block in blocks) == shape[0]*shape[1]*(b-a+1)*3
        system = SimpleNamespace(device=torch.device('cpu'), state=lambda: (e, h), decomposition=None)
        maximum, norm = _interior_scale(system, a, b)
        count = shape[0]*shape[1]*(b-a+1)*3
        assert maximum == 3.
        assert norm == pytest.approx(math.sqrt(13*count), rel=1e-12)
