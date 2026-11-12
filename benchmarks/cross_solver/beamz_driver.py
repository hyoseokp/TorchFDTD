"""BeamZ side of the cross-solver comparison (fixture C, forward throughput).

Run inside the BeamZ venv from the repository root:
    python benchmarks/cross_solver/beamz_driver.py --fixture throughput
BeamZ is installed from PyPI (`pip install beamz`), whose `backend='auto'` runs the
JAX backend. Writes docs/validation/cross_solver/beamz_throughput.json.
"""
from __future__ import annotations

import argparse
import gc
import json
import math
import os
import sys
import time
from pathlib import Path

os.environ.setdefault('XLA_PYTHON_CLIENT_PREALLOCATE', 'false')
import numpy as np  # noqa: E402

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import common  # noqa: E402

import jax  # noqa: E402
import jax.numpy as jnp  # noqa: E402
import beamz as bz  # noqa: E402
from beamz.design import MaterialGrid  # noqa: E402

PACKAGES = ('beamz', 'jax', 'jaxlib', 'jax-cuda12-plugin', 'jax-cuda12-pjrt', 'numpy', 'scipy')
SOLVER = 'beamz'
BACKEND = 'auto'


def base_record(fixture, spec):
    return dict(schema='torchfdtd-cross-solver-v1', solver=SOLVER, fixture=fixture, fixture_sha256=spec['_sha256'],
                date=time.strftime('%Y-%m-%d'),
                environment=common.environment(dict(packages=common.package_versions(PACKAGES), jax_devices=[str(d) for d in jax.devices()],
                                                    jax_x64=bool(jax.config.read('jax_enable_x64')), backend=BACKEND,
                                                    xla_preallocate=os.environ.get('XLA_PYTHON_CLIENT_PREALLOCATE'))),
                driver_sha256=common.driver_hashes('beamz_driver.py', 'common.py'))


def device_memory():
    stats = jax.devices()[0].memory_stats() or {}
    return dict(peak_bytes_in_use=stats.get('peak_bytes_in_use'), bytes_in_use=stats.get('bytes_in_use'))


def material_grid(eps, mesh):
    """The shared (x, y, z, component) staircase array in BeamZ's (z, y, x) Yee storage; the extra boundary nodes are vacuum.

    BeamZ propagates the given Yee arrays unchanged only for a diagonal-Farjadpour grid; with the default
    volume label it resamples the cell array instead, so the label is set although no smoothing is applied.
    """
    n = eps.shape[0]
    yee = {}
    for c, (name, shape) in enumerate((('eps_x', (n + 1, n + 1, n)), ('eps_y', (n + 1, n, n + 1)), ('eps_z', (n, n + 1, n + 1)))):
        values = np.ones(shape, dtype=np.float64)
        values[:n, :n, :n] = eps[..., c].transpose(2, 1, 0)
        yee[name] = values
    grid = MaterialGrid(permittivity=eps[..., 2].transpose(2, 1, 0).astype(np.float64), conductivity=0.0, permeability=1.0,
                        resolution=mesh, shape=(n, n, n), yee_materials=yee, smoothing='farjadpour_diagonal')
    assert grid.uses_direct_yee_materials
    return grid


def build_throughput(spec, case, eps, monitor):
    """One fixture case. `monitor` is 'dft' (one-frequency point FieldMonitor, timed) or 'trace' (per-step point FieldRecorder)."""
    n, mesh, steps, dt = case['n'], case['mesh_um'] * 1e-6, case['steps'], case['dt_s']
    base = dict(material_grid=material_grid(eps, mesh), time=np.arange(steps) * dt,
                boundaries=[bz.PML(edges='all', thickness=case['pml_cells'] * mesh, formulation='cpml')])
    probe = bz.Simulation(sources=[], monitors=[], **base)
    ez_shape = tuple(probe.initial_state().ez.shape)
    assert tuple(probe.grid.shape) == (n, n, n) and ez_shape == (n, n + 1, n + 1), (probe.grid.shape, ez_shape)
    assert abs(probe.dt / dt - 1) < 1e-12, (probe.dt, dt)
    kick = common.waveform(spec['source']['waveform'], np.arange(1, steps + 1) * dt).astype(np.float32)
    source = bz.CustomSource(component='Ez', timing='e', index=tuple(reversed(case['source_index'])), coeff=1.0, waveform=kick,
                             target_shape=ez_shape)
    i, j, k = case['monitor_index']
    node = (i * mesh, j * mesh, (k + 0.5) * mesh)  # the Ez Yee node of the fixture's monitor cell
    if monitor == 'dft':
        mon = bz.FieldMonitor(center=node, size=(0, 0, 0), freqs=np.array([common.C0 / (spec['source']['waveform']['wavelength_um'] * 1e-6)]),
                              name='probe', fields=('Ez',))
    else:
        mon = bz.FieldRecorder(components=('Ez',), interval=1, name='probe', center=node, size=(0, 0, 0))
    return bz.Simulation(sources=[source], monitors=[mon], **base)


def run_throughput(spec, sizes, repeats, idle_limit_mb, artifact_dir):
    artifact_dir.mkdir(parents=True, exist_ok=True)
    record = base_record('throughput', spec)
    record.update(method=f"Simulation.run(backend='{BACKEND}') on the PyPI release, float32, GPU. Full solve = Simulation.run (plan, runtime setup, "
                         "stepping, result decoding) + host copy of the point DFT value, after one warm-up that includes JAX compilation (recorded "
                         "separately). Stepping = SimulationPerformance.runtime_s, BeamZ's own timing of the compiled executable. The timed solves "
                         "use a one-frequency point FieldMonitor; the point trace comes from one additional untimed solve with a per-step "
                         "FieldRecorder at the same Ez node.",
                  cases=[])
    for case in spec['cases']:
        if case['n'] not in sizes:
            continue
        shape = tuple(case['shape'])
        eps = common.sphere_epsilon_yee(shape, case['mesh_um'], spec['size_um'], case['structures'][0]['radius_um'], case['structures'][0]['index']) \
            if case['structures'] else np.ones((*shape, 3), dtype=np.float32)
        row = dict(name=case['name'], shape=list(shape), cells=math.prod(shape), steps=case['steps'], dt_s=case['dt_s'], mesh_um=case['mesh_um'],
                   pml_cells=case['pml_cells'])
        sim = build_throughput(spec, case, eps, 'dft')
        state = {}

        def sample(repeat):
            gc.collect()
            start = time.perf_counter()
            result = sim.run(backend=BACKEND, performance=True)
            value = np.asarray(result.monitor('probe').get_dft_component('Ez'))
            wall = time.perf_counter() - start
            if 'warmup_seconds' not in state:
                state['warmup_seconds'] = wall
            loop = result.performance.runtime_s
            row_ = dict(wall_seconds=wall, loop_seconds=loop, setup_seconds=wall - loop, steps_run=result.performance.steps,
                        peak_bytes_in_use=device_memory()['peak_bytes_in_use'], probe_dft_abs=float(np.abs(value).max()),
                        finite=bool(np.isfinite(value).all()))
            print(json.dumps(dict(case=case['name'], repeat=repeat, **row_)), flush=True)
            return row_
        row.update(common.stable_runs(sample, repeats, idle_limit_mb))
        row['warmup_seconds'] = state['warmup_seconds']
        row['median_wall_seconds'] = common.median_of(row['runs'], 'wall_seconds')
        row['median_loop_seconds'] = common.median_of(row['runs'], 'loop_seconds')
        row['median_setup_seconds'] = common.median_of(row['runs'], 'setup_seconds')
        row['cell_steps_per_second_full'] = row['cells'] * row['steps'] / row['median_wall_seconds']
        row['cell_steps_per_second_stepping'] = row['cells'] * row['steps'] / row['median_loop_seconds']
        row['peak_bytes_in_use'] = max(s['peak_bytes_in_use'] for s in row['runs'])
        row['shared_epsilon_sha256'] = common.sha256_array(eps)
        trace = np.asarray(build_throughput(spec, case, eps, 'trace').run(backend=BACKEND, performance=False).monitor('probe').fields['Ez'],
                           dtype=np.float32).reshape(-1)
        trace_path = artifact_dir / f"beamz_throughput_{case['name']}_trace.npy"
        np.save(trace_path, trace.astype(np.float64))
        row['trace_artifact'] = str(trace_path)
        row['trace_sha256'] = common.sha256_array(trace)
        record['cases'].append(row)
        common.write_record(f'{SOLVER}_throughput', record)
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', required=True, choices=['throughput'])
    parser.add_argument('--sizes', nargs='+', type=int, default=[64, 96])
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--idle-limit-mb', type=float, default=1500)
    parser.add_argument('--artifacts', default=os.path.join(os.environ.get('TORCHFDTD_BENCH_ROOT', os.path.expanduser('~/torchfdtd-bench')), 'artifacts'))
    args = parser.parse_args()
    spec = common.load_fixture(args.fixture)
    context = common.own_context_mb(lambda: jax.block_until_ready(jnp.zeros(1)))
    args.idle_limit_mb += context['own_mb']
    print(json.dumps(dict(gpu_context=context, idle_limit_mb=args.idle_limit_mb)), flush=True)
    record = run_throughput(spec, args.sizes, args.repeats, args.idle_limit_mb, Path(args.artifacts))
    record['gpu_context'] = context
    path = common.write_record(f'{SOLVER}_throughput', record)
    print('wrote', path)


if __name__ == '__main__':
    main()
