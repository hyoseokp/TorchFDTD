"""Fixed plane maps must preserve observation order and per-solve bindings."""
from types import SimpleNamespace

import numpy as np
import pytest
import torch

from torchfdtd.cuda_adjoint import FusedAdjointCUDA
from torchfdtd.differentiable import _System
from torchfdtd.reversible_cpml_planes import ReversibleCPMLPlaneSimulation
from test_differentiable import gpu, project
from test_reversible_cpml_planes import fixture


def map_system(observers, cache, shape=(3, 4, 5)):
    system = _System.__new__(_System)
    system.region = SimpleNamespace(shape=shape)
    system.shape = shape
    system.grid = SimpleNamespace(pmc_blocks={'E': [], 'H': []})
    system.device = torch.device('cpu')
    system.monitors = observers
    system.segments = []
    system.observation_cache = cache
    system.prepare_observations()
    return system


def test_cached_gathers_keep_interleaved_and_duplicate_observations(monkeypatch):
    observers = (('Hy', (1, 2, 3), 1), ('Ex', (0, 1, 2), 0),
                 ('Hy', (1, 2, 3), 1), ('Ez', (2, 3, 4), 2))
    fields = (torch.arange(180).reshape(3, 4, 5, 3),
              torch.arange(180, 360).reshape(3, 4, 5, 3))
    expected = torch.tensor([fields[1][1, 2, 3, 1], fields[0][0, 1, 2, 0],
                             fields[1][1, 2, 3, 1], fields[0][2, 3, 4, 2]])
    cache = {}
    first = map_system(observers, cache)
    assert torch.equal(first.observe(fields), expected)

    def rebuilt(*args):
        pytest.fail('The fixed observation table was rebuilt on a cache hit.')
    monkeypatch.setattr('torchfdtd.differentiable.face_index', rebuilt)
    second = map_system(observers, cache)
    assert torch.equal(second.observe(fields), expected)
    assert first.observation_maps is not second.observation_maps
    assert all(t.device.type == 'cpu' for pair in cache['prepare', (3, 4, 5)][1] for t in pair)


def test_cache_replacement_and_shape_change_do_not_reuse_old_indices():
    cache = {}
    original = (('Ex', (1, 1, 1), 0),)
    changed = (('Ex', (0, 2, 3), 0),)
    old = map_system(original, cache)
    fresh = map_system(changed, cache)
    fields = (torch.arange(180).reshape(3, 4, 5, 3), torch.zeros(3, 4, 5, 3))
    assert fresh.observe(fields).item() == fields[0][0, 2, 3, 0].item()
    assert not torch.equal(fresh.observe(fields), old.observe(fields))
    larger = map_system(changed, cache, shape=(3, 5, 6))
    fields = (torch.arange(270).reshape(3, 5, 6, 3), torch.zeros(3, 5, 6, 3))
    assert larger.observe(fields).item() == fields[0][0, 2, 3, 0].item()
    assert cache['prepare', (3, 4, 5)][0] is changed


def test_mutable_observations_and_stored_faces_bypass_cache():
    cache = {}
    system = map_system([('Ex', (0, 0, 0), 0)], cache)
    assert cache == {}
    system.monitors[0] = ('Hy', (1, 1, 1), 1)
    system.prepare_observations()
    fields = (torch.zeros(3, 4, 5, 3), torch.ones(3, 4, 5, 3))
    assert system.observe(fields).item() == 1
    system.monitors = tuple(system.monitors)
    system.grid.pmc_blocks['E'] = [(0, (0,), (1, 4, 5))]
    assert system.observation_cache_key('prepare') is None


@pytest.mark.parametrize('device', ['cpu', 'cuda'])
@pytest.mark.parametrize('complex_fields,diagonal', [(False, False), (False, True), (True, True)])
def test_repeated_plane_solves_are_bit_identical_without_cached_state(device, complex_fields, diagonal):
    if device == 'cuda':
        gpu()
    torch.set_num_threads(1)
    p, base, fixed = fixture(complex_fields)
    if diagonal and base.ndim == 3:
        base = base[..., None].expand(*base.shape, 3).clone()
        fixed = fixed[..., None].expand_as(base).clone()
        base[..., 1] += .1
    base, fixed = base.to(device), fixed.to(device)
    model = ReversibleCPMLPlaneSimulation(p, quadrature_counts={'incident': (3, 4), 'detector': (3, 4)})
    frequencies = torch.tensor([.033, .057], device=device) / p.region.time_step
    cache = model._observation_cache
    generator = torch.Generator().manual_seed(551)
    seeds = [torch.randn(6, 12, 2, 2, generator=generator, dtype=torch.complex64)
             .to(device).permute(2, 3, 1, 0) for _ in range(2)]
    def run(cache_enabled, material, block):
        model._observation_cache = cache if cache_enabled else None
        parameter = material.clone().requires_grad_()
        planes = model(parameter, frequencies, fixed_epsilon=fixed, block_size=block)
        fields = torch.stack([plane.fields for plane in planes.values()]) / p.region.time_step
        gradients = [torch.autograd.grad(fields, parameter, seed, retain_graph=i == 0)[0]
                     for i, seed in enumerate(seeds)]
        return fields.detach(), gradients
    expected = run(False, base, 7)
    for _ in range(2):
        actual = run(True, base, 7)
        assert torch.equal(actual[0], expected[0])
        assert all(torch.equal(a, b) for a, b in zip(actual[1], expected[1]))
    # Change material, spectral block size and seeds on the same cached model.
    base[:, :, 9:11] += .15
    seeds.reverse()
    expected = run(False, base, 1)
    if device == 'cuda':
        # The same model's host tables must be safe on a new compute stream.
        current = torch.cuda.current_stream()
        other = torch.cuda.Stream()
        other.wait_stream(current)
        with torch.cuda.stream(other):
            actual = run(True, base, 1)
        current.wait_stream(other)
    else:
        actual = run(True, base, 1)
    assert torch.equal(actual[0], expected[0])
    assert all(torch.equal(a, b) for a, b in zip(actual[1], expected[1]))
    with torch.no_grad():
        planes = model(base, frequencies, fixed_epsilon=fixed, block_size=1)
        fields = torch.stack([plane.fields for plane in planes.values()]) / p.region.time_step
    assert torch.equal(fields, actual[0])
    assert cache and all(entry[0] is model.observers for entry in cache.values())
    for entry in cache.values():
        tables = (entry[1],) if isinstance(entry[1], torch.Tensor) else [t for pair in entry[1] for t in pair]
        assert all(t.device.type == 'cpu' and not t.requires_grad for t in tables)


@pytest.mark.parametrize('precision', ['float32', 'float64'])
def test_cached_cuda_layout_keeps_duplicate_sum_order_and_fresh_buffers(precision):
    gpu()
    p = project('3d', precision=precision, steps=10)
    dtype = getattr(torch, precision)
    epsilon = torch.full(p.region.shape, 1.4, dtype=dtype, device='cuda')
    observers = (('Ex', (1, 2, 3), 0), ('Hy', (2, 1, 3), 1),
                 ('Ex', (1, 2, 3), 0), ('Ex', (1, 2, 3), 0))
    cache = {}
    helpers = []
    for call in range(2):
        system = _System(p, epsilon, observation_monitors=observers,
                         observation_cache=cache, prepare_kernels=False)
        seed = torch.tensor([[1e20, 2 + call, -1e20, 3 + call]], dtype=dtype, device='cuda')
        helper = FusedAdjointCUDA(system, torch.zeros_like(epsilon), seed, direct_views=True)
        helpers.append(helper)
        helper.e_bar.fill_(call + 1)
        helper.h_bar.fill_(call + 1)
        expected = [helper.e_bar.clone(), helper.h_bar.clone()]
        for monitor, value in zip(observers, seed[0]):
            name, loc, component = monitor
            expected[name[0] == 'H'][(*loc, component)] += value
        fn, args, module, count = helper.observer
        with helper.cp.cuda.Device(helper.device), helper.stream():
            fn(((count + 127) // 128,), (128,), (*args, np.int32(0)))
        assert torch.equal(helper.e_bar, expected[0])
        assert torch.equal(helper.h_bar, expected[1])
    assert torch.equal(helpers[0].observer_layout, helpers[1].observer_layout)
    assert helpers[0].observer_layout.data_ptr() != helpers[1].observer_layout.data_ptr()
    assert cache['adjoint', tuple(p.region.shape)][1].device.type == 'cpu'
