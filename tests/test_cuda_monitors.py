"""Full complex spectra, half-step phases and independent batch state checks."""
import fdtd
import numpy as np
import pytest
import torch

from torchfdtd import FieldMonitor, SpectrumSettings, Simulation, run_tensor_batch
from torchfdtd.boundaries import YeeGrid
from torchfdtd.field_monitors import FrequencyPlane
from torchfdtd.cuda_monitors import FusedFrequencyPlanes
from test_tensor_batch import cases

pytestmark = pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA unavailable')


def field_planes():
    return [FieldMonitor(id='x-plane', normal='x', center=(.7, 0, 0), size=(0, 1.03, 1),
                spectrum=SpectrumSettings(sampling='frequency', frequency_points=7, apodization='none')),
            FieldMonitor(id='y-plane', normal='y', center=(0, .2, 0), size=(1.17, 0, .8), downsample=2,
                spectrum=SpectrumSettings(sampling='wavelength', frequency_points=3, apodization='end'))]


@pytest.mark.parametrize('precision', ['float32', 'float64'])
@pytest.mark.parametrize('layout', ['2d', '3d', 'graded', 'periodic'])
def test_random_fields_match_reference_full_complex_dft(precision, layout):
    pytest.importorskip('cupy')
    p = cases(1, precision, '2d' if layout == '2d' else '3d')[0]
    if layout == 'graded':
        p.region.mesh_type='graded';p.region.mesh_auto_refine=False;p.region.mesh_max=.2
    if layout == 'periodic':
        for a in ('x', 'y', 'z'):
            for side in ('min', 'max'):
                getattr(p.region.boundaries, a+'_'+side).kind='periodic'
    old_dtype = torch.get_default_dtype()
    try:
        fdtd.set_backend('torch.cuda.'+precision)
        fdtd.backend.float = torch.float32 if precision == 'float32' else torch.float64
        grid = YeeGrid(p.region)
        raw = field_planes()
        if layout == 'periodic':
            raw[0].size=(0, p.region.actual_size[1], p.region.actual_size[2])
        reference = [FrequencyPlane(grid, m) for m in raw]
        candidate = [FrequencyPlane(grid, m) for m in raw]
        fused = FusedFrequencyPlanes(candidate)
        counter = torch.zeros(1, dtype=torch.long, device=grid.E.device)
        rng = np.random.default_rng(701)
        for step in range(31):
            for field in (grid.E, grid.H):
                field.copy_(torch.as_tensor(rng.normal(size=field.shape), device=field.device, dtype=field.dtype))
            counter.fill_(step)
            for monitor in reference:
                monitor.update(counter)
            fused.update(counter)
        tolerance = 3e-6 if precision == 'float32' else 3e-14
        for expected, got in zip(reference, candidate):
            a, b = expected.result(), got.result()
            scale = np.max(abs(a['fields']))
            np.testing.assert_allclose(b['fields']/scale, a['fields']/scale, rtol=tolerance, atol=tolerance)
            scale = np.max(abs(a['flux']))
            np.testing.assert_allclose(b['flux']/scale, a['flux']/scale, rtol=tolerance, atol=tolerance)
    finally:
        fdtd.set_backend('numpy');fdtd.backend.float=np.float64
        torch.set_default_dtype(old_dtype)


@pytest.mark.parametrize('precision', ['float32', 'float64'])
@pytest.mark.parametrize('graph', [False, True])
def test_complete_solve_and_mixed_batch_with_fused_monitors(precision, graph):
    pytest.importorskip('cupy')
    projects = cases(2, precision, '3d')
    for p in projects:
        p.monitors.extend(field_planes())
        p.region.cuda_monitor_kernel='torch'
    reference = [Simulation(p).run(cuda_graph=graph) for p in projects]
    for p in projects:
        p.region.cuda_monitor_kernel='fused'
    independent = [Simulation(p).run(cuda_graph=graph) for p in projects]
    batch = run_tensor_batch(projects, cuda_graph=graph)
    batch.raise_for_errors()
    tolerance = 3e-6 if precision == 'float32' else 3e-14
    for expected, single, item in zip(reference, independent, batch.items):
        actual = item.load()
        for key in ('electric', 'magnetic', 'signals', 'frames'):
            np.testing.assert_array_equal(getattr(actual, key), getattr(expected, key))
        for got, one, ref in zip(actual.frequency_fields, single.frequency_fields, expected.frequency_fields):
            np.testing.assert_array_equal(got['fields'], one['fields'])
            scale = np.max(abs(ref['fields']))
            np.testing.assert_allclose(got['fields']/scale, ref['fields']/scale, rtol=tolerance, atol=tolerance)
            assert got['run_signature'] == ref['run_signature']
    # A mixed selection must not drop reference-path planes or share state.
    projects[0].region.cuda_monitor_kernel='torch'
    mixed = run_tensor_batch(projects, cuda_graph=graph)
    for item, expected in zip(mixed.items, (reference[0], independent[1])):
        for got, ref in zip(item.load().frequency_fields, expected.frequency_fields):
            np.testing.assert_array_equal(got['fields'], ref['fields'])


def test_fused_monitor_rejects_cpu_and_complex_fields():
    p = cases(1)[0]
    p.monitors.extend(field_planes());p.region.cuda_monitor_kernel='fused'
    p.region.backend='cpu';p.region.cuda_kernel='torch'
    with pytest.raises(ValueError, match='real CUDA fields'):
        Simulation(p).run()
    p.region.backend='cuda'
    p.region.boundaries.y_min.kind=p.region.boundaries.y_max.kind='bloch'
    with pytest.raises(ValueError, match='real CUDA fields'):
        Simulation(p).run()


@pytest.mark.parametrize('precision',['float32','float64'])
def test_fused_phase_matches_absolute_time_law_without_recurrence_drift(precision):
    pytest.importorskip('cupy')
    p=cases(1,precision,'3d')[0]
    old=torch.get_default_dtype()
    try:
        fdtd.set_backend('torch.cuda.'+precision)
        fdtd.backend.float=torch.float32 if precision=='float32' else torch.float64
        grid=YeeGrid(p.region)
        monitors=field_planes()
        monitors[0].spectrum.frequency_points=257
        monitors[1].spectrum.frequency_points=19
        fused=FusedFrequencyPlanes([FrequencyPlane(grid,m) for m in monitors])
        counter=torch.zeros(1,dtype=torch.long,device=grid.E.device)
        counter_view=fused.cp.from_dlpack(counter)
        for step in (0,137,65537,1_000_000_001):
            counter.fill_(step)
            with fused.cp.cuda.Device(fused.device),fused._stream():
                fused.phase_function(((fused.max_frequencies+127)//128,len(fused.phases)),(128,),
                                     (fused.phase_table,counter_view))
            for omega,half,_,e,h in fused.phases:
                expected=torch.exp(omega*(counter+1)).to(e.dtype)
                tol=3e-7 if precision=='float32' else 3e-15
                torch.testing.assert_close(e,expected,rtol=tol,atol=tol)
                torch.testing.assert_close(h,expected*half,rtol=tol,atol=tol)
    finally:
        fdtd.set_backend('numpy');fdtd.backend.float=np.float64;torch.set_default_dtype(old)
