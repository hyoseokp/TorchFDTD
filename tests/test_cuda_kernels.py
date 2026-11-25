"""Fused updates must reproduce complete Yee/CPML states, not only a timing."""
import fdtd
import numpy as np
import pytest
import torch

from torchfdtd import Project, Region, Source, Monitor, Structure, Simulation
from torchfdtd.boundaries import YeeGrid
from torchfdtd.cuda_kernels import FusedYeeCUDA
from torchfdtd.models import Boundaries, BoundaryFace, MeshRefinement, Material


def require_cuda():
    if not torch.cuda.is_available():
        pytest.skip('CUDA is unavailable')
    pytest.importorskip('cupy')


def test_automatic_kernels_resolve_by_scene_and_by_what_works_here(monkeypatch):
    from torchfdtd import cuda_kernels
    resolve = cuda_kernels.resolve_cuda_kernel
    real, cpu = Region(), Region(backend='cpu')
    bloch = Region(dimension='3d', size=(2, 2, 2), mesh=.1, pml_cells=3, bloch_phase=(.3, 0, 0),
                   boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'), x_max=BoundaryFace(kind='bloch')))
    assert bloch.complex_fields
    assert real.cuda_kernel == real.cuda_monitor_kernel == 'auto'
    for works in (True, False):
        monkeypatch.setattr(cuda_kernels, 'fused_kernels_available', lambda works=works: works)
        for field in ('cuda_kernel', 'cuda_monitor_kernel'):
            assert resolve(real, field) == ('fused' if works else 'torch')
            assert resolve(cpu, field) == resolve(bloch, field) == 'torch'
        # Above the fused component index range the Torch update still runs.
        assert resolve(Region(dimension='3d', size=(90, 90, 90), mesh=.1, pml_cells=8)) == 'torch'
    assert resolve(Region(cuda_kernel='fused')) == 'fused' and resolve(Region(cuda_kernel='torch')) == 'torch'


def test_an_explicit_kernel_is_saved_and_the_automatic_one_is_left_out():
    automatic, explicit = Region().model_dump(), Region(cuda_kernel='torch', cuda_monitor_kernel='fused').model_dump()
    assert 'cuda_kernel' not in automatic and 'cuda_monitor_kernel' not in automatic
    assert (explicit['cuda_kernel'], explicit['cuda_monitor_kernel']) == ('torch', 'fused')
    assert Region.model_validate(automatic).cuda_kernel == 'auto' and Region.model_validate(explicit).cuda_kernel == 'torch'


def test_the_grid_holds_one_unit_permeability():
    grid = YeeGrid(Region(dimension='3d', size=(1.8, 1.6, 1.4), mesh=.1, pml_cells=3, backend='cpu'))
    assert grid.E.shape == grid.H.shape == grid.inverse_permittivity.shape == (*grid.region.shape, 3)
    assert grid.inverse_permeability.shape == (1,) and grid.inverse_permeability[0] == 1


@pytest.mark.parametrize('monitor', [False, True])
def test_the_default_kernels_are_fused_and_reproduce_the_torch_fields(monitor):
    require_cuda()
    def run(**kernels):
        from torchfdtd import FieldMonitor, SpectrumSettings
        monitors = [Monitor(center=(.5, 0, 0))]
        if monitor:
            monitors.append(FieldMonitor(center=(.7, 0, 0), size=(0, 1.4, 1.4), spectrum=SpectrumSettings(
                sampling='frequency', frequency_points=3, apodization='none')))
        return Simulation(Project(region=Region(dimension='3d', size=(3.2, 2.8, 2.4), mesh=.1, pml_cells=4, steps=60, backend='cuda',
                                                material_sampling='yee', **kernels),
                                  structures=[Structure(kind='sphere', radius=.4, material='SiO2 (constant n)')],
                                  sources=[Source(center=(-.8, 0, 0))], monitors=monitors)).run()
    default, reference = run(), run(cuda_kernel='torch', cuda_monitor_kernel='torch')
    assert default.summary['cuda_kernel'] == default.summary['cuda_monitor_kernel'] == 'fused'
    assert default.summary['memory_model'] == 'fused_cuda'
    for name in ('electric', 'magnetic', 'signals'):
        np.testing.assert_allclose(getattr(default, name), getattr(reference, name), rtol=3e-6, atol=3e-6*np.abs(getattr(reference, name)).max())
    for got, expected in zip(default.frequency_fields, reference.frequency_fields):
        np.testing.assert_allclose(got['fields'], expected['fields'], rtol=0, atol=3e-6*np.abs(expected['fields']).max())


@pytest.mark.parametrize('precision', ['float32', 'float64'])
@pytest.mark.parametrize('layout', ['pml2d', 'pml3d', 'mixed', 'graded'])
def test_fused_random_fields_and_all_cpml_states(precision, layout):
    require_cuda()
    region = Region(dimension='2d' if layout == 'pml2d' else '3d',
                    size=(3.2, 2.8, 2.4), mesh=.1, pml_cells=4, precision=precision)
    region.boundaries.x_min = BoundaryFace(layers=5, kappa=3, alpha=.03, alpha_polynomial=1)
    if layout == 'mixed':
        region.boundaries.y_min = BoundaryFace(kind='periodic')
        region.boundaries.y_max = BoundaryFace(kind='periodic')
    if layout == 'graded':
        region.material_sampling = 'yee'
        region.mesh_type = 'graded'
        region.mesh_max = .2
        region.mesh_auto_refine = False
        region.mesh_refinements = [MeshRefinement(size=(.4, .4, .4))]
    old_dtype = torch.get_default_dtype()
    try:
        fdtd.set_backend('torch.cuda.'+precision)
        fdtd.backend.float = torch.float32 if precision == 'float32' else torch.float64
        reference, candidate = YeeGrid(region), YeeGrid(region)
        rng = np.random.default_rng(615)
        for name in ('E', 'H', 'inverse_permittivity'):
            dst = getattr(reference, name)
            values = rng.normal(size=tuple(dst.shape))*.02 if name != 'inverse_permittivity' else rng.uniform(.25, 1, tuple(dst.shape))
            dst.copy_(torch.as_tensor(values, dtype=dst.dtype, device=dst.device))
            getattr(candidate, name).copy_(dst)
        fused = FusedYeeCUDA(candidate)
        for _ in range(23):
            reference.update_E()
            reference.update_H()
            fused.update_E()
            fused.update_H()
        tol = 3e-6 if precision == 'float32' else 2e-14
        for got, expected in zip([candidate.E, candidate.H]+candidate.memory_states,
                                 [reference.E, reference.H]+reference.memory_states):
            torch.testing.assert_close(got, expected, rtol=tol, atol=tol)
    finally:
        fdtd.set_backend('numpy')
        torch.set_default_dtype(old_dtype)


@pytest.mark.parametrize('material', ['dielectric', 'lorentz'])
def test_complete_fused_graph_matches_reference_and_eager(material):
    require_cuda()
    p = Project(region=Region(size=(4, 3, 1), mesh=.1, pml_cells=5, steps=180, backend='cuda', precision='float64'),
                materials=[Material(name='body', model=material, index=1.5)],
                structures=[Structure(material='body', radius=.4, kind='circle')],
                sources=[Source(center=(-.8, 0, 0), pulse_cycles=1)],
                monitors=[Monitor(center=(.7, 0, 0))])
    reference = Simulation(p).run()
    p.region.cuda_kernel = 'fused'
    eager = Simulation(p).run(cuda_graph=False)
    graph = Simulation(p).run()
    assert graph.summary['cuda_kernel'] == 'fused'
    assert graph.summary['cuda_graph']
    assert np.max(abs(graph.electric)) > 1e-6
    for result in [eager, graph]:
        np.testing.assert_allclose(result.electric, reference.electric, rtol=1e-11, atol=1e-12)
        np.testing.assert_allclose(result.magnetic, reference.magnetic, rtol=1e-11, atol=1e-12)
        np.testing.assert_allclose(result.signals, reference.signals, rtol=1e-11, atol=1e-12)


def test_fused_rejects_cpu_and_complex_fields():
    p = Project(region=Region(backend='cpu', cuda_kernel='fused', size=(3, 3, 1), mesh=.1, pml_cells=4))
    with pytest.raises(ValueError, match='CUDA GPU'):
        Simulation(p).run()
    require_cuda()
    p.region.backend = 'cuda'
    p.region.boundaries.y_min = BoundaryFace(kind='bloch')
    p.region.boundaries.y_max = BoundaryFace(kind='bloch')
    torch.cuda.synchronize();allocated = torch.cuda.memory_allocated()
    with pytest.raises(ValueError, match='Bloch'):
        Simulation(p).run()
    assert torch.cuda.memory_allocated() == allocated   # refused before the grid is built


def test_fused_preserves_subnormal_fields():
    require_cuda()
    old_dtype = torch.get_default_dtype()
    try:
        fdtd.set_backend('torch.cuda.float32')
        fdtd.backend.float = torch.float32
        r = Region(size=(2, 2, 1), mesh=.1, pml_cells=4)
        a, b = YeeGrid(r), YeeGrid(r)
        a.E[10, 10, 0, 2] = 1e-38
        b.E.copy_(a.E)
        fused = FusedYeeCUDA(b)
        for _ in range(20):
            a.update_E()
            a.update_H()
            fused.update_E()
            fused.update_H()
        assert torch.count_nonzero(a.H).item() > 0
        torch.testing.assert_close(b.E, a.E, rtol=0, atol=0)
        torch.testing.assert_close(b.H, a.H, rtol=0, atol=0)
    finally:
        fdtd.set_backend('numpy')
        torch.set_default_dtype(old_dtype)


def test_fused_frequency_plane_matches_cpu_flux():
    require_cuda()
    from test_field_monitors import slab_project
    from torchfdtd import normalize_flux
    p = slab_project()
    p.materials[1].index = 1.5
    cpu = Simulation(p).run()
    p.region.backend = 'cuda'
    p.region.cuda_kernel = 'fused'
    gpu = Simulation(p).run()
    for got, expected in zip(gpu.frequency_fields, cpu.frequency_fields):
        scale = np.max(abs(expected['fields']))
        np.testing.assert_allclose(got['fields']/scale, expected['fields']/scale, rtol=1e-11, atol=1e-11)
        # Backend choice must not invalidate physically matching normalization.
        normalized = normalize_flux(got, expected)
        np.testing.assert_allclose(normalized['ratio'][normalized['valid']], 1, rtol=1e-10)
