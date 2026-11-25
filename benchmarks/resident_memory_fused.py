"""Peak CUDA memory of resident Simulation runs against the resident estimate.

Each case runs in a fresh process (``--case NAME`` prints one JSON line), so the
Torch allocator starts empty and its peak counters describe that run alone. The
driver runs the cases one after another and writes the record: device, driver,
library versions, source hashes, each case's project, the peak allocated and
reserved Torch bytes and ``estimate(project)``. The forward run is the public
``Simulation(project).run()`` with its CUDA graph, run-control diagnostics and
snapshot frames.

    python benchmarks/resident_memory_fused.py --output docs/validation/resident_memory_fused_3060.json

``--wrap`` prefixes every case process, for example with a GPU slot lock; the
text ``{vram_mib}`` in it is replaced by the case's estimate plus 512 MiB.
``--merge`` rewrites the record from one-line case files written by ``--case NAME
--case-output FILE``, so the cases can run as separate short GPU jobs.

The metalens cases are lateral tiles of the configuration measured on an RTX
5880 (``metalens_tile``); the record also states the estimate of that 41 um,
4.33e8-cell tile next to its measured peak.
"""
import argparse
import hashlib
import json
import math
import platform
import shlex
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from benchmarks.provenance import git_revision  # noqa: E402

MESH = .05
PML = 10
STEPS = 60
SOURCES = ('torchfdtd/models.py', 'torchfdtd/solver.py', 'torchfdtd/boundaries.py', 'torchfdtd/cuda_kernels.py',
           'torchfdtd/cuda_monitors.py', 'torchfdtd/cuda_diagnostics.py', 'torchfdtd/cuda_graph.py',
           'torchfdtd/field_monitors.py', 'torchfdtd/materials.py', 'torchfdtd/run_control.py', 'torchfdtd/plan.py',
           'torchfdtd/tensor_batch.py', 'torchfdtd/cuda_batch.py', 'benchmarks/resident_memory_fused.py')


def _case(shape, precision='float32', kernel='fused', boundary='cpml', plane=False, poles=0, sampling='cell', batch=1,
          monitor_kernel=None, graph_steps=1, metalens=None):
    return dict(shape=shape, precision=precision, kernel=kernel, monitor_kernel=monitor_kernel or kernel, boundary=boundary,
                plane=plane, poles=poles, sampling=sampling, batch=batch, graph_steps=graph_steps, metalens=metalens)


def _metalens(lateral_um):
    return _case(None, plane=True, sampling='yee', metalens=lateral_um)


CUBES = {'1m': (100, 100, 100), '4m': (160, 160, 160), '16m': (252, 252, 252), '32m': (320, 320, 320), '64m': (400, 400, 400)}
CASES = {
    **{f'fused-f32-cpml-{k}': _case(CUBES[k]) for k in ('1m', '4m', '16m', '64m')},
    'fused-f32-cpml-slab-64m': _case((1000, 1000, 64)),
    'fused-f32-cpml-slab-plane-64m': _case((1000, 1000, 64), plane=True),
    **{f'fused-f32-periodic-{k}': _case(CUBES[k], boundary='periodic') for k in ('4m', '16m', '64m')},
    **{f'fused-f32-plane-{k}': _case(CUBES[k], plane=True) for k in ('4m', '16m')},
    'fused-f32-torchplane-4m': _case(CUBES['4m'], plane=True, monitor_kernel='torch'),
    **{f'fused-f32-yee-{k}': _case(CUBES[k], sampling='yee') for k in ('4m', '16m')},
    'fused-f32-yee-periodic-64m': _case(CUBES['64m'], sampling='yee', boundary='periodic'),
    'fused-f64-yee-16m': _case(CUBES['16m'], sampling='yee', precision='float64'),
    **{f'fused-f32-lorentz-{k}': _case(CUBES[k], poles=1) for k in ('4m', '16m')},
    'fused-f32-multipole2-4m': _case(CUBES['4m'], poles=2),
    'fused-f32-multipole3-4m': _case(CUBES['4m'], poles=3),
    'fused-f32-yee-lorentz-4m': _case(CUBES['4m'], poles=1, sampling='yee'),
    'fused-f32-yee-multipole2-4m': _case(CUBES['4m'], poles=2, sampling='yee'),
    # cuda_graph_steps=8 captures a second graph, with its own pool of step temporaries.
    'fused-f32-lorentz-graph8-4m': _case(CUBES['4m'], poles=1, graph_steps=8),
    'fused-f32-multipole2-graph8-4m': _case(CUBES['4m'], poles=2, graph_steps=8),
    'fused-f32-multipole3-graph8-4m': _case(CUBES['4m'], poles=3, graph_steps=8),
    'fused-f32-yee-lorentz-graph8-4m': _case(CUBES['4m'], poles=1, sampling='yee', graph_steps=8),
    'fused-f32-yee-multipole2-graph8-4m': _case(CUBES['4m'], poles=2, sampling='yee', graph_steps=8),
    'fused-f32-cpml-graph8-16m': _case(CUBES['16m'], graph_steps=8),
    'fused-f32-plane-graph8-4m': _case(CUBES['4m'], plane=True, graph_steps=8),
    'fused-f32-torchplane-graph8-4m': _case(CUBES['4m'], plane=True, monitor_kernel='torch', graph_steps=8),
    **{f'fused-f64-cpml-{k}': _case(CUBES[k], precision='float64') for k in ('1m', '4m', '16m', '32m')},
    'fused-f64-lorentz-4m': _case(CUBES['4m'], precision='float64', poles=1),
    'fused-f64-multipole2-4m': _case(CUBES['4m'], precision='float64', poles=2),
    'fused-f64-lorentz-graph8-4m': _case(CUBES['4m'], precision='float64', poles=1, graph_steps=8),
    'fused-f64-plane-4m': _case(CUBES['4m'], precision='float64', plane=True),
    **{f'torch-f32-cpml-{k}': _case(CUBES[k], kernel='torch') for k in ('1m', '4m', '16m')},
    'torch-f32-lorentz-4m': _case(CUBES['4m'], kernel='torch', poles=1),
    'torch-f64-cpml-4m': _case(CUBES['4m'], kernel='torch', precision='float64'),
    # Lateral tiles of the RTX 5880 metalens configuration: 410, 615 and 775 cells across, 103 in z.
    **{f'fused-f32-metalens-{k}': _metalens(lateral) for k, lateral in (('17m', 8.2), ('39m', 12.3), ('62m', 15.5))},
    'tensor-batch-f32-2x16m': _case(CUBES['16m'], batch=2),
    'tensor-batch-f32-lorentz-graph8-2x4m': _case(CUBES['4m'], poles=1, batch=2, graph_steps=8),
}


# The RTX 5880 run: one 41 um tile of a 1 mm metalens, fused FP32 kernels with the CUDA graph, 1600
# steps, peak 25.6 GB for the process read with nvidia-smi (so the CUDA context is included).
REFERENCE_5880 = dict(hardware='NVIDIA RTX 5880 Ada Generation, 48 GB', lateral_um=41., steps=1600, measured_peak_gb=25.6,
                      instrument='nvidia-smi process peak, including the CUDA context', seconds_per_tile=125,
                      unit_permeability_bytes_per_cell=12)  # That run still held a full unit permeability array.


def metalens_tile(lateral_um, steps=1600):
    """A square lateral tile of the RTX 5880 metalens configuration.

    Graded z (20 nm in the 0.8 um pillar layer, at most 40 nm elsewhere, grading
    1.25, 103 cells over 2.6 um), 20 nm in x and y, 12 CPML cells on all six
    faces, Yee-sampled staircase constant-n pillars (n = 2.0) on a substrate box
    (n = 1.444) at a 0.29 um pitch, one soft broadband Ex sheet and one
    nearest-interpolation Ex/Ey/Ez plane at three frequencies, without Poynting
    vector or flux.
    """
    import numpy as np
    from torchfdtd import FieldMonitor, MeshRefinement, Project, Region, Source, Structure
    # mesh_ppw=10 keeps the coarse limit at mesh_max for the 0.45 um band edge, as the 40 nm cap of the run.
    region = Region(dimension='3d', size=(lateral_um, lateral_um, 2.6), mesh=.02, mesh_type='graded', mesh_max=.04,
                    mesh_grading=1.25, mesh_ppw=10, mesh_auto_refine=False, material_sampling='yee', pml_cells=12, steps=steps,
                    mesh_refinements=[MeshRefinement(center=(0, 0, .3), size=(lateral_um, lateral_um, .8))],
                    backend='cuda', cuda_kernel='fused', cuda_monitor_kernel='fused', precision='float32')
    count = int(lateral_um/.29)
    offsets = (np.arange(count)-(count-1)/2)*.29
    pillars = [Structure(id=f'p{i}_{j}', center=(float(x), float(y), .3), size=(w, w, .8), material='SiN (constant n)')
               for i, x in enumerate(offsets) for j, y in enumerate(offsets) for w in [.08+.012*((7*i+13*j) % 10)]]
    substrate = Structure(id='substrate', center=(0, 0, -.7), size=(lateral_um, lateral_um, 1.2), material='SiO2 (constant n)')
    band = dict(wavelength_start=.45, wavelength_stop=.65)
    sheet = Source(id='sheet', kind='plane', normal='z', center=(0, 0, -.5), size=(lateral_um, lateral_um, 0), component='Ex',
                   pulse='broadband', time_definition='wavelength', extend_through_pml=True, **band)
    inner = lateral_um-2*12*.02
    plane = FieldMonitor(id='output', normal='z', center=(0, 0, .78), size=(inner, inner, 0), record_fields=('Ex', 'Ey', 'Ez'),
                         record_poynting=(), record_flux=False, spatial_interpolation='nearest',
                         spectrum=dict(sampling='frequency', frequency_points=3, apodization='none', **band))
    return Project(name=f'metalens tile {lateral_um:g} um', region=region, structures=[substrate, *pillars],
                   sources=[sheet], monitors=[plane])


def project(case, index=0):
    """The case scene: a dielectric block, or a dispersive block filling the grid, a point source and probe."""
    from torchfdtd import BoundaryFace, FieldMonitor, LorentzPole, Material, Monitor, Project, Region, Source
    from torchfdtd.models import default_materials
    if case['metalens']:
        return metalens_tile(case['metalens'])
    nx, ny, nz = case['shape']
    size = (nx*MESH, ny*MESH, nz*MESH)
    faces = {} if case['boundary'] == 'cpml' else {f'{a}_{s}': BoundaryFace(kind='periodic') for a in 'xyz' for s in ('min', 'max')}
    region = Region(dimension='3d', size=size, mesh=MESH, pml_cells=PML, steps=STEPS, backend='cuda',
                    cuda_kernel=case['kernel'], cuda_monitor_kernel=case['monitor_kernel'], precision=case['precision'],
                    material_sampling=case['sampling'], snapshot_interval=20, boundaries=faces)
    materials = default_materials()
    if case['poles']:
        poles = [LorentzPole(resonance_rad_s=2e15*(k+1), strength_rad_s_squared=2e30, damping_rad_s=1e14) for k in range(case['poles'])]
        materials.append(Material(name='dispersive', model='multipole', epsilon_inf=2., poles=poles))
        block = dict(center=(0, 0, 0), size=size, material='dispersive')
    else:
        block = dict(center=(0, 0, 0), size=tuple(s/2 for s in size))
    monitors = [Monitor(id='probe', center=(4*MESH, 0, 0))]
    if case['plane']:
        span = tuple(s - 2*(PML+1)*MESH for s in size[:2])
        monitors.append(FieldMonitor(id='plane', normal='z', center=(0, 0, size[2]/4), size=(*span, 0),
                                     spectrum=dict(sampling='frequency', wavelength_start=1.0, wavelength_stop=1.2,
                                                   frequency_points=5, apodization='none')))
    return Project(name=f'memory {index}', region=region, materials=materials,
                   structures=[dict(id='block', **block)], sources=[Source(id='source', center=(0, 0, 0), wavelength=1.1)],
                   monitors=monitors)


def run_case(name):
    import psutil
    import torch
    from torchfdtd import Simulation
    from torchfdtd.solver import estimate
    case = CASES[name]
    projects = [project(case, i) for i in range(case['batch'])]
    torch.cuda.init()
    torch.cuda.synchronize()
    # Host memory: the growth of the process's peak working set over the run. Under the Windows WDDM
    # driver the private (committed) bytes also count the device allocations, so they are not used.
    base_working_set = psutil.Process().memory_info().wset
    base_allocated, base_reserved = torch.cuda.memory_allocated(), torch.cuda.memory_reserved()
    torch.cuda.reset_peak_memory_stats()
    started = time.perf_counter()
    if case['batch'] == 1:
        result = Simulation(projects[0]).run(cuda_graph_steps=case['graph_steps'])
        finite = bool(torch.isfinite(torch.as_tensor(result.electric)).all())
    else:
        from torchfdtd import run_tensor_batch
        report = run_tensor_batch(projects, memory_fraction=.9, cuda_graph_steps=case['graph_steps'])
        report.raise_for_errors()
        finite = all(bool(torch.isfinite(torch.as_tensor(item.result.electric)).all()) for item in report.items)
    torch.cuda.synchronize()
    seconds = time.perf_counter()-started
    host_peak = psutil.Process().memory_info().peak_wset-base_working_set
    try:
        import cupy
        cupy_pool = int(cupy.get_default_memory_pool().total_bytes())
    except ImportError:
        cupy_pool = None
    summaries = [estimate(p) for p in projects]
    estimates = [int(round(s['estimated_memory_mb']*2**20)) for s in summaries]
    shape = projects[0].region.shape
    return dict(name=name, **{**case, 'shape': list(shape)}, cells=math.prod(shape), steps=projects[0].region.steps,
                peak_allocated_bytes=int(torch.cuda.max_memory_allocated()-base_allocated),
                peak_reserved_bytes=int(torch.cuda.max_memory_reserved()-base_reserved),
                cupy_pool_bytes=cupy_pool, estimate_bytes=sum(estimates), seconds=seconds, finite=finite,
                host_peak_working_set_bytes=int(host_peak),
                host_estimate_bytes=sum(int(round(s['host_estimated_mb']*2**20)) for s in summaries),
                # A metalens tile is rebuilt by metalens_tile(case['metalens']) instead of storing thousands of pillars.
                projects=None if case['metalens'] else [p.model_dump(mode='json') for p in projects],
                environment=environment())


def reference_5880():
    """The estimate of the 41 um RTX 5880 tile, next to its measured peak."""
    from torchfdtd.field_monitors import plane_plan
    from torchfdtd.solver import estimate
    tile = metalens_tile(REFERENCE_5880['lateral_um'], REFERENCE_5880['steps'])
    summary = estimate(tile)
    predicted = int(round(summary['estimated_memory_mb']*2**20))
    return dict(REFERENCE_5880, shape=list(tile.region.shape), cells=math.prod(tile.region.shape),
                pillars=len(tile.structures)-1, monitor_points=len(plane_plan(tile.region, tile.monitors[0])['weights']),
                memory_model=summary['memory_model'], estimate_bytes=predicted, estimate_gb=round(predicted/1e9, 2),
                estimate_gib=round(predicted/2**30, 2))


def environment():
    import torch
    record = dict(device=torch.cuda.get_device_name(0), device_total_bytes=torch.cuda.get_device_properties(0).total_memory,
                  torch=torch.__version__, cuda_runtime=torch.version.cuda, python=platform.python_version(),
                  platform=platform.platform())
    try:
        import cupy
        record['cupy'] = cupy.__version__
    except ImportError:
        record['cupy'] = None
    try:
        record['driver'] = subprocess.run(['nvidia-smi', '--query-gpu=driver_version', '--format=csv,noheader'],
                                          capture_output=True, text=True, timeout=30).stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        record['driver'] = None
    return record


def write_record(records, output):
    records = sorted(records, key=lambda r: list(CASES).index(r['name']))
    payload = dict(kind='resident_memory', environment=records[0]['environment'], revision=git_revision(ROOT),
                   source_sha256={path: hashlib.sha256((ROOT/path).read_bytes()).hexdigest() for path in SOURCES},
                   mesh_um=MESH, pml_cells=PML, steps=STEPS,
                   cases=[{k: v for k, v in r.items() if k != 'environment'} for r in records],
                   reference_5880=reference_5880(),
                   scope='Peak Torch CUDA allocator bytes of one resident forward run per fresh process (Simulation.run '
                         'with its CUDA graph, or one run_tensor_batch cohort), against estimate(project). The CUDA '
                         'context, CuPy module images and other processes are outside the Torch counters.')
    output.write_text(json.dumps(payload, indent=1)+'\n', encoding='utf-8', newline='\n')


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('--case', help='run one case in this process and print its JSON line')
    parser.add_argument('--case-output', type=Path, help='with --case: also write the JSON line to this file')
    parser.add_argument('--merge', type=Path, help='write --output from the case files in this directory')
    parser.add_argument('--cases', nargs='*', default=None, help='subset of case names (default: all)')
    parser.add_argument('--output', type=Path)
    parser.add_argument('--wrap', default='', help='command prefix of every case process; {vram_mib} is substituted')
    args = parser.parse_args(argv)
    if args.case:
        line = json.dumps(run_case(args.case))
        if args.case_output:
            args.case_output.write_text(line+'\n', encoding='utf-8', newline='\n')
        print(line, flush=True)
        return
    if args.output is None:
        parser.error('--output is required unless --case is given')
    if args.merge:
        write_record([json.loads(path.read_text(encoding='utf-8')) for path in sorted(args.merge.glob('*.json'))], args.output)
        return
    from torchfdtd.solver import estimate
    records = []
    for name in args.cases or list(CASES):
        case = CASES[name]
        vram = int(sum(estimate(project(case, i))['estimated_memory_mb'] for i in range(case['batch'])))+512
        command = [*shlex.split(args.wrap.replace('{vram_mib}', str(vram)), posix=False), sys.executable,
                   str(Path(__file__).resolve()), '--case', name]
        output = subprocess.run(command, capture_output=True, text=True, cwd=ROOT)
        lines = [line for line in output.stdout.splitlines() if line.startswith('{')]
        if output.returncode or not lines:
            raise SystemExit(f'{name} failed ({output.returncode}):\n{output.stdout[-2000:]}\n{output.stderr[-4000:]}')
        records.append(json.loads(lines[-1]))
        r = records[-1]
        print(f'{name}: {r["cells"]:,} cells, peak allocated {r["peak_allocated_bytes"]/2**20:.1f} MiB, '
              f'reserved {r["peak_reserved_bytes"]/2**20:.1f} MiB, estimate {r["estimate_bytes"]/2**20:.1f} MiB', flush=True)
    write_record(records, args.output)


if __name__ == '__main__':
    main()
