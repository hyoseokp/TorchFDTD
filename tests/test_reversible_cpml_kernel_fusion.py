"""Bitwise comparison against separate inverse-E and material-VJP launches."""
from types import SimpleNamespace

import pytest
import torch

from torchfdtd.differentiable import _System
from torchfdtd.reversible_cpml import _advance_recorded
from torchfdtd.reversible_cpml_kernels import (
    InteriorReconstruction, _ComplexInteriorCUDA, _InteriorCUDA,
    _interior_launch_contract,
)
from tests.test_reversible_cpml_complex_kernels import fixture


def legacy_step(helper, n, trace):
    """The pre-1.1 launch order, with the original 64-bit kernel configuration."""
    e, h = helper.system.grid.E, helper.system.grid.H
    e[:, :, helper.b+1, :2].copy_(trace[0])
    helper._undo_sources('H', h, n)
    helper._inverse.run('h')
    h[:, :, helper.a-1, :2].copy_(trace[1])
    helper._undo_sources('E', e, n)
    helper._inverse.run('e')
    helper._fused.step(n, observation_index=n)
    helper._inverse.run('g')


@pytest.mark.cuda
@pytest.mark.parametrize('diagonal', [False, True])
@pytest.mark.parametrize('complex_fields', [False, True])
@pytest.mark.parametrize('source_kind', ['point', 'plane'])
@pytest.mark.parametrize('block_size', [64, 128, 256, 512])
def test_fused_inverse_vjp_is_bitwise_equal(diagonal, complex_fields, source_kind, block_size):
    if not torch.cuda.is_available():
        pytest.skip('CUDA device required')
    from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
    from torchfdtd.cuda_kernels import FusedYeeCUDA
    from torchfdtd.cuda_complex import FusedComplexYeeCUDA
    prepare_cuda_kernels()
    original, base = fixture(diagonal, complex_fields, steps=32)
    dtype = original.field_dtype
    inverse_type = _ComplexInteriorCUDA if complex_fields else _InteriorCUDA
    forward_type = FusedComplexYeeCUDA if complex_fields else FusedYeeCUDA
    generator = torch.Generator().manual_seed(103)
    seed = torch.randn((original.region.steps, 3), generator=generator, dtype=dtype).to('cuda')
    a, b = 4, 14
    helpers, tapes, signals = [], [], []
    for legacy in (True, False):
        system = _System(original.project, base.to('cuda'), prepare_kernels=False)
        wave = original.sources['E'][0][2].to(device='cuda', dtype=dtype)
        if source_kind == 'plane':
            loc = (slice(None), slice(None), 5)
            profile = torch.linspace(.3, 1.1, 42, device='cuda').reshape(6, 7).to(dtype)
        else:
            loc, profile = (0, 3, 5), None
        system.sources = {'E': [(loc, 0, wave, profile)],
                          'H': [((3, 2, 13), 1, .2*wave, None)]}
        system.monitors = original.monitors
        system.prepare_observations()
        system.kernel = forward_type(system.grid, direct_views=True)
        tape, history = [], []
        for n in range(system.region.steps):
            frame = torch.empty((2, 6, 7, 2), device='cuda', dtype=dtype)
            _advance_recorded(system, n, frame, a, b)
            tape.append(frame)
            history.append(system.observe(system.state()).clone())
        signals.append(torch.stack(history))
        # Exterior primal fields must never become dependencies of the adjoint.
        for field in system.state()[:2]:
            field[:, :, :a] = float('nan')
            field[:, :, b+1:] = float('nan')
        gradient = torch.zeros_like(system.epsilon)
        helper = InteriorReconstruction(system, a, b, gradient, seed)
        helper._inverse = inverse_type(system, a, b, gradient, helper.e_bar,
                                       block_size=128 if legacy else block_size,
                                       legacy=legacy)
        helpers.append(helper)
        tapes.append(tape)
    assert torch.equal(signals[0], signals[1])
    assert torch.count_nonzero(signals[0]) > 0
    for n in reversed(range(original.region.steps)):
        assert torch.equal(tapes[0][n], tapes[1][n])
        legacy_step(helpers[0], n, tapes[0][n])
        helpers[1].step(n, tapes[1][n])
        for left, right in zip(helpers[0].system.state()[:2], helpers[1].system.state()[:2]):
            assert torch.equal(left[:, :, a:b+1], right[:, :, a:b+1])
        for name in ('gradient', 'e_bar', 'h_bar'):
            assert torch.equal(getattr(helpers[0], name), getattr(helpers[1], name)), name
        for left, right in zip(helpers[0].psi_bars, helpers[1].psi_bars):
            assert torch.equal(left, right)
    assert torch.count_nonzero(helpers[1].gradient) > 0
    cache = helpers[1]._inverse.launches if complex_fields else helpers[1]._inverse.kernels
    assert set(cache) == {'h', 'eg'}


def test_interior_cuda_index_and_launch_contract_without_allocation():
    system = SimpleNamespace(shape=(6, 7, 20), region=SimpleNamespace(complex_fields=False))
    for block in (64, 128, 256, 512, 1024):
        _interior_launch_contract(system, block)
    for block in (True, 0, 2048, 128.0):
        with pytest.raises(ValueError, match='block size'):
            _interior_launch_contract(system, block)
    for complex_fields in (False, True):
        lanes = 2 if complex_fields else 1
        system.region.complex_fields = complex_fields
        system.shape = (1, 1, (2**31-1)//(3*lanes))
        _interior_launch_contract(system, 128)
        system.shape = (1, 1, (2**31-1)//(3*lanes)+1)
        with pytest.raises(ValueError, match='32-bit'):
            _interior_launch_contract(system, 128)
