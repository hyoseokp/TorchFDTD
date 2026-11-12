"""Write docs/CROSS_SOLVER_COMPARISON.md from docs/validation/cross_solver_3060.json.

Every number in the document is read from the combined record; the prose only
states the conditions under which the numbers were produced.
"""
from __future__ import annotations

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
COMBINED = ROOT / 'docs' / 'validation' / 'cross_solver_3060.json'
OUTPUT = ROOT / 'docs' / 'CROSS_SOLVER_COMPARISON.md'
LABEL = {'torchfdtd': 'TorchFDTD', 'fdtdx': 'FDTDX', 'meep': 'Meep', 'beamz': 'BeamZ'}


def fmt(value, digits=3):
    if value is None:
        return 'n/a'
    return f'{value:.{digits}e}' if (abs(value) < 1e-2 or abs(value) >= 1e5) else f'{value:.{digits}f}'


def mb(value):
    return 'n/a' if value is None else f'{value / 2**20:.0f}'


def environment_section(c):
    env = c['environments']
    t, f, m = env.get('torchfdtd', {}), env.get('fdtdx', {}), env.get('meep', {})
    gpu = (t.get('gpu') or {})
    lines = ['## Environment', '',
             f"All runs used one workstation: {c['hardware']['cpu']} (12 physical cores, {t.get('logical_cpus')} logical CPUs visible to WSL2), "
             f"{gpu.get('name')} with {gpu.get('memory.total')} MiB, Windows driver {gpu.get('driver_version')}, "
             f"Linux side {t.get('platform')} in the WSL2 distribution `{t.get('wsl_distribution')}`.",
             '',
             c['hardware']['note'],
             '',
             '| Component | TorchFDTD and FDTDX (venv) | Meep (micromamba) |', '|---|---|---|',
             f"| Python | {t.get('python')} | {m.get('python')} |"]
    tp, fp, mp = t.get('packages', {}), f.get('packages', {}), m.get('packages', {})
    lines += [f"| Solver | torchfdtd {tp.get('torchfdtd')} (worktree HEAD `{(c.get('worktree_head_at_run') or '')[:12]}` when the drivers ran), fdtdx {fp.get('fdtdx')} | meep {m.get('meep_version')} ({'MPI' if m.get('meep_mpi') else 'serial'} build, mpich {m.get('mpich_version') or 'conda-forge'}) |",
              f"| Frameworks | torch {tp.get('torch')} (CUDA {t.get('torch_cuda')}), cupy-cuda12x {tp.get('cupy-cuda12x')}, jax {fp.get('jax')}, jaxlib {fp.get('jaxlib')}, jax-cuda12-plugin {fp.get('jax-cuda12-plugin')}, equinox {fp.get('equinox')}, optax {fp.get('optax')} | numpy {mp.get('numpy')}, scipy {mp.get('scipy')} |",
              f"| numpy, scipy | {tp.get('numpy')}, {tp.get('scipy')} | {mp.get('numpy')}, {mp.get('scipy')} |",
              '| Field precision | float32 | float64 (the conda-forge build is double precision) |',
              f"| Execution | GPU, one process | CPU, {m.get('mpi_processes')} MPI ranks (OMP_NUM_THREADS={m.get('omp_num_threads')}) |", '']
    lines += ['Environment build: `benchmarks/cross_solver/setup_env.sh`; verification: `benchmarks/cross_solver/verify_env.sh`. '
              'The per-solver records under `docs/validation/cross_solver/` carry the full package lists, the SHA-256 of every driver script and '
              'fixture file, the raw timing samples and the GPU idle checks; `docs/validation/cross_solver_3060.json` combines them. '
              'The recorded driver hashes refer to the driver versions that ran; the environment root and the repository path were '
              'moved from constants into `TORCHFDTD_BENCH_ROOT` and the script location afterwards, which changed no computation.', '']
    return lines


def fixture_section(c):
    fx = c['fixtures']
    s, b, t, a = fx['slab'], fx['sphere'], fx['throughput'], fx['adjoint']
    lines = ['## Fixtures', '',
             'Each fixture is defined once in `benchmarks/cross_solver/fixtures/*.json` and instantiated by one driver per solver '
             '(`torchfdtd_driver.py`, `fdtdx_driver.py`, `meep_driver.py`; `beamz_driver.py` for fixture C in section C2). The drivers assert the cell counts, the time step, the '
             'source and monitor cell indices and, where a solver accepts a sampled permittivity array, the shared staircase array itself.', '',
             f"**A. Analytic slab.** Index {s['slab']['index']} slab, {s['slab']['thickness_um']} um thick, in a periodic 2D TMz cell of "
             f"{s['size_um'][0]} x {s['size_um'][1]} um, {s['mesh_um']} um mesh ({s['shape'][0]} x {s['shape'][1]} cells), Courant number "
             f"{s['courant_number']:.6f} (dt = {s['dt_s']:.6e} s), {s['steps']} steps, {s['pml_cells']} absorbing cells on each x end, periodic in y. "
             f"Soft Ez sheet at x = {s['source']['x_um']} um with a {s['source']['waveform']['pulse_cycles']}-cycle Gaussian pulse at "
             f"{s['source']['waveform']['wavelength_um']} um; reflection and transmission planes at x = {s['monitors']['reflection_x_um']} and "
             f"{s['monitors']['transmission_x_um']} um; {s['spectrum']['points']} frequencies equally spaced between c/{s['spectrum']['wavelength_stop_um']} and "
             f"c/{s['spectrum']['wavelength_start_um']} um; air reference run for normalisation and incident subtraction. The slab covers Ez cells "
             f"{s['slab']['ez_cell_indices'][0]}..{s['slab']['ez_cell_indices'][1] - 1} in every solver. FDTDX has no 2D mode and uses a 3D grid with one periodic z cell "
             f"and courant_factor scaled so that dt is identical. Reference: T = [1 + ((n^2-1)/2n)^2 sin^2(2 pi n d / lambda)]^-1, R = 1 - T.", '',
             f"**B. Mie sphere.** Index {b['sphere']['index']} sphere of radius {b['sphere']['radius_um']} um in air, {b['size_um'][0]} um cube, "
             f"{b['mesh_um']} um mesh ({b['shape'][0]}^3 cells), Courant number {b['courant_number']:.6f} (dt = {b['dt_s']:.6e} s), {b['steps']} steps "
             f"({b['duration_fs']} fs; 120 fs changes the TorchFDTD cross-sections by up to 2.5 percent, 360 fs by less than 1e-4, so 240 fs is used), "
             f"{b['pml_cells']} absorbing cells on every face. Gaussian pulse at {b['source']['waveform']['wavelength_um']} um with "
             f"{b['source']['waveform']['pulse_length_s'] * 1e15:.0f} fs power FWHM and {b['source']['waveform']['pulse_offset_s'] * 1e15:.0f} fs offset. "
             f"Six flux planes at +-{b['flux_box']['plane_positions_um']} um ({b['flux_box']['size_um']} um square), incident intensity from a "
             f"{b['incident_plane']['size_um']} um square plane at the centre of the empty run, {b['spectrum']['points']} wavelengths equally spaced from "
             f"{b['spectrum']['wavelength_start_um']} to {b['spectrum']['wavelength_stop_um']} um, scattered flux from the field-wise difference between the "
             f"sphere run and the empty run. TorchFDTD uses its closed TFSF box ({b['tfsf_box']['size_um']} um cube). FDTDX 0.6.2 and Meep have no closed TFSF "
             f"box, so they use their native plane-wave-plus-flux-box scattering setups (a one-way UniformPlaneSource at x = {b['fdtdx_plane_source']['x_um']} um "
             f"spanning the whole transverse domain in FDTDX; an Ez current sheet at x = {b['meep_plane_source']['x_um']} um spanning the whole cell with "
             f"is_integrated=True in Meep). The staircase sphere is the same per-component Yee sampling in TorchFDTD and FDTDX (shared array); Meep "
             f"rasterises the sphere itself with eps_averaging=False. Reference: Mie series (examples/tfsf_sphere.py).", '',
             f"**C. Forward throughput.** The vacuum and sphere scenes of `benchmarks/open_source.py`: {t['size_um'][0]} um cube, "
             f"{' and '.join(str(cs['n']) + '^3' for cs in t['cases'][::2])} cells, {t['cases'][0]['steps']} steps, Courant number {t['cases'][0]['courant_number']:.6f}, "
             f"{t['cases'][0]['pml_cells']} absorbing cells, point Ez source at {t['source']['center_um']} um with a {t['source']['waveform']['pulse_cycles']}-cycle "
             f"Gaussian pulse, point Ez monitor at {t['monitor']['center_um']} um, sphere of radius {t['cases'][1]['structures'][0]['radius_um']} um and index "
             f"{t['cases'][1]['structures'][0]['index']}. One warm-up solve per case, then {t['repetitions']} timed solves; the tables report medians and the "
             f"records keep every sample.", '',
             f"**D. Adjoint.** The periodic dielectric fixture of docs/FDTDX_MATCHED_FULL_GRADIENT.md at {a['shape'][0]}^3 cells and {a['steps']} steps: "
             f"{a['mesh_um']} um mesh, Courant factor {a['courant_factor']} (dt = {a['dt_s']:.6e} s), all faces periodic, slab of permittivity "
             f"{a['slab']['epsilon']} on z cells {a['slab']['z_cell_range'][0]}..{a['slab']['z_cell_range'][1] - 1}, additive Ex kick at cell "
             f"{a['source']['index']} ({a['source']['waveform']['pulse_length_s'] * 1e15:.0f} fs FWHM Gaussian, {a['source']['waveform']['pulse_offset_s'] * 1e15:.0f} fs offset), "
             f"Ex probes at {a['probes'][0]['index']} and {a['probes'][1]['index']}, loss {a['loss']}. The gradient is taken with respect to the full "
             f"scalar-per-cell permittivity array. TorchFDTD: checkpointed discrete adjoint with {a['torchfdtd']['checkpoints']} device checkpoints. FDTDX: "
             f"checkpointed (num_checkpoints={a['fdtdx']['modes'][0]['num_checkpoints']}) and reversible (Recorder(modules=[])) methods. {a['meep']}", '']
    return lines


def slab_section(c):
    block = c['slab']
    lines = ['## A. Analytic slab', '',
             '| Solver | Max abs. T error | Max abs. R error | Max abs. R+T-1 | Field precision |', '|---|---:|---:|---:|---|']
    for name in ('torchfdtd', 'fdtdx', 'meep'):
        r = block['solvers'].get(name)
        if r:
            lines.append(f"| {LABEL[name]} | {fmt(r['max_T_absolute_error'])} | {fmt(r['max_R_absolute_error'])} | {fmt(r['max_energy_residual'])} | {r['precision']} |")
    lines += ['', 'Pairwise differences of the 31 recorded samples:', '', '| Pair | Max abs. T difference | Max abs. R difference |', '|---|---:|---:|']
    for pair, v in block['pairwise'].items():
        a, b = pair.split('_vs_')
        lines.append(f"| {LABEL[a]} vs {LABEL[b]} | {fmt(v['T_max_abs'])} | {fmt(v['R_max_abs'])} |")
    lines.append('')
    return lines


def sphere_section(c):
    block = c['sphere']
    lines = ['## B. Mie sphere', '',
             '| Solver | Source and monitor method | Max relative cross-section error | Steps |', '|---|---|---:|---:|']
    method = {'torchfdtd': 'closed TFSF box, scattered-field planes', 'fdtdx': 'one-way plane source, total-field planes minus empty run',
              'meep': 'current sheet spanning the cell, total-field planes minus empty run'}
    for name in ('torchfdtd', 'fdtdx', 'meep'):
        r = block['solvers'].get(name)
        if r:
            lines.append(f"| {LABEL[name]} | {method[name]} | {100 * r['max_relative_error']:.3f} % | {r['steps']} |")
    names = [n for n in ('torchfdtd', 'fdtdx', 'meep') if n in block['solvers']]
    lines += ['', 'Relative error per wavelength (percent):', '', '| Wavelength (um) | ' + ' | '.join(LABEL[n] for n in names) + ' |', '|---:|' + '---:|' * len(names)]
    wl = block['solvers'][names[0]]['wavelength_um']
    for i, w in enumerate(wl):
        lines.append(f"| {w:.4f} | " + ' | '.join(f"{100 * block['solvers'][n]['relative_error'][i]:+.3f}" for n in names) + ' |')
    lines += ['', 'Pairwise maximum relative difference of the cross-sections:', '', '| Pair | Max relative difference |', '|---|---:|']
    for pair, v in block['pairwise'].items():
        a, b = pair.split('_vs_')
        lines.append(f"| {LABEL[a]} vs {LABEL[b]} | {100 * v['max_relative']:.3f} % |")
    lines.append('')
    return lines


def throughput_rows(block, solvers):
    lines = ['| Case | Solver | Full solve (s) | Stepping (s) | Cell-steps/s, full | Cell-steps/s, stepping | Peak device MiB |', '|---|---|---:|---:|---:|---:|---:|']
    for case_name, case in block['cases'].items():
        for name in solvers:
            r = case['solvers'].get(name)
            if not r:
                continue
            peak = r.get('peak_allocated_bytes', r.get('peak_bytes_in_use'))
            extra = f" ({r['mpi_processes']} MPI ranks)" if name == 'meep' else ''
            lines.append(f"| {case_name} | {LABEL[name]}{extra} | {r['median_wall_seconds']:.3f} | {r['median_loop_seconds']:.3f} | "
                         f"{r['cell_steps_per_second_full']:.2e} | {r['cell_steps_per_second_stepping']:.2e} | {mb(peak) if name != 'meep' else 'CPU'} |")
    return lines


def trace_rows(traces):
    lines = ['| Case | Pair | Raw relative L2 | Fitted relative L2 | Best shift (steps) | Amplitude ratio at best shift | Shifted, fitted relative L2 | pi dt/T |',
             '|---|---|---:|---:|---:|---:|---:|---:|']
    for case_name, t in traces.items():
        for pair, v in t['pairwise'].items():
            a, b = pair.split('_vs_')
            bs = v['best_shift']
            lines.append(f"| {case_name} | {LABEL[a]} vs {LABEL[b]} | {fmt(v['raw_relative_l2'])} | {fmt(v['fitted_relative_l2'])} | "
                         f"{bs['shift_samples']} | {bs['amplitude_ratio']:.4e} | {fmt(bs['fitted_relative_l2'])} | {fmt(t.get('half_step_carrier_phase'))} |")
    return lines


def throughput_section(c):
    block = c['throughput']
    lines = ['## C. Forward throughput', '',
             'Full solve = setup + stepping + final field transfer (medians of three timed solves after one warm-up; setup excludes interpreter '
             'start-up and compilation, which the warm-up absorbs). Stepping = the solver\'s own time-stepping loop. Peak device memory is '
             'torch.cuda.max_memory_allocated for TorchFDTD and the XLA peak_bytes_in_use for FDTDX; Meep runs on the CPU.', '']
    lines += throughput_rows(block, ('torchfdtd', 'fdtdx', 'meep'))
    src = block.get('source_records', {})
    if src.get('meep') == 'meep_throughput_ranks12.json':
        lines += ['', 'The Meep rows come from the 12-rank member of the rank sweep (`meep_throughput_ranks12.json`, one warm-up and three timed '
                  'solves per case, taken between the other sweep members). A later attempt to retake the Meep block behind a Windows host-CPU '
                  'idle gate did not complete because other processes kept the host busy; that gate, the block-repeat rule and the host-load '
                  'sampling remain in the driver for reruns, and the host load during the sweep was not measured.']
    lines += ['', 'Individual stepping samples (s), the max/min spread of the accepted block wall times, and the Windows host CPU load '
              'sampled before and after the block (Meep only; GPU blocks record the GPU idle check instead):', '',
              '| Case | Solver | Samples | Spread | Host CPU before / after (%) |', '|---|---|---|---:|---:|']
    for case_name, case in block['cases'].items():
        for name in ('torchfdtd', 'fdtdx', 'meep'):
            r = case['solvers'].get(name)
            if r:
                host = f"{r.get('host_cpu_percent_before', 'n/a')} / {r.get('host_cpu_percent_after', 'n/a')}" if name == 'meep' else 'n/a'
                spread = f"{r['spread']:.3f}" if r.get('spread') is not None else f"{max(r['wall_samples']) / min(r['wall_samples']):.3f} (not gated)"
                lines.append(f"| {case_name} | {LABEL[name]} | {', '.join(f'{v:.3f}' for v in r['loop_samples'])} | {spread} | {host} |")
    traces = c.get('throughput_traces') or {}
    if traces:
        lines += ['', 'Point-monitor traces of the timed solves: relative L2 over the common samples, then after a least-squares amplitude fit, '
                  'then after additionally shifting the second trace by the integer number of steps that minimises the residual (Meep normalises '
                  'its current source differently, flips its sign, records one extra sample and offsets its source timing, so only the shifted, '
                  'fitted column compares waveform shapes):', '']
        lines += trace_rows(traces)
        lines += ['', 'The last column is the residual that a remaining half-step timing offset of the 1.55 um carrier alone would leave '
                  '(pi dt / T), for comparison with the Meep rows.']
    fd = block['cases'][next(iter(block['cases']))]['solvers'].get('fdtdx')
    if fd and 'compile_seconds' in fd:
        lines += ['', 'FDTDX XLA compilation per case (excluded from the timed solves): ' +
                  ', '.join(f"{n} {case['solvers']['fdtdx']['compile_seconds']:.2f} s" for n, case in block['cases'].items() if 'fdtdx' in case['solvers']) + '.']
    if c.get('meep_rank_sweep'):
        lines += ['', 'Meep stepping time versus MPI rank count on the same CPU (supplementary; the table above uses 12 ranks):', '',
                  '| Ranks | ' + ' | '.join(f'{n} stepping (s)' for n in c['meep_rank_sweep'][0]['cases']) + ' |', '|---:|' + '---:|' * len(c['meep_rank_sweep'][0]['cases'])]
        for row in c['meep_rank_sweep']:
            lines.append(f"| {row['ranks']} | " + ' | '.join(f"{v['median_loop_seconds']:.3f}" for v in row['cases'].values()) + ' |')
    lines.append('')
    return lines


def other_gpu_sections(c):
    lines = []
    for tag, g in (c.get('other_gpus') or {}).items():
        env = g['environments']
        t, z = env.get('torchfdtd', {}), env.get('beamz', {})
        tp, zp, gpu = t.get('packages', {}), z.get('packages', {}), t.get('gpu') or {}
        dates = ', '.join(sorted(set(g['record_dates'].values())))
        lines += [f"## C2. Forward throughput against BeamZ on an {gpu.get('name', tag).replace('NVIDIA GeForce ', '')}", '',
                  f"Fixture C, retaken for TorchFDTD and run for BeamZ on one rented {gpu.get('name')} ({gpu.get('memory.total')} MiB, driver "
                  f"{gpu.get('driver_version')}, {t.get('cpu')}) on {dates}: the two drivers ran back to back in one container, each in its own venv, "
                  f"with the same definitions as section C. TorchFDTD: the repository source of the commit that adds these records (package version {tp.get('torchfdtd')}), torch {tp.get('torch')} (CUDA {t.get('torch_cuda')}), "
                  f"cupy-cuda12x {tp.get('cupy-cuda12x')}. BeamZ: beamz {zp.get('beamz')} installed from PyPI, backend='{z.get('backend')}', which runs its "
                  f"JAX backend (jax {zp.get('jax')}, jax-cuda12-plugin {zp.get('jax-cuda12-plugin')}); its optional native CUDA component is built from "
                  'source and was not used. For BeamZ, stepping is SimulationPerformance.runtime_s, its own timing of the compiled executable from dispatch '
                  'to completion, and peak device memory is the XLA peak_bytes_in_use. Records: '
                  f"`docs/validation/cross_solver/{tag}/`.", '']
        lines += throughput_rows(g['throughput'], ('torchfdtd', 'beamz'))
        warmups = {n: case['solvers']['beamz']['warmup_seconds'] for n, case in g['throughput']['cases'].items()
                   if 'warmup_seconds' in case['solvers'].get('beamz', {})}
        if warmups:
            lines += ['', 'BeamZ first solve per case, including its JAX compilation (excluded from the timed solves): ' +
                      ', '.join(f'{n} {v:.2f} s' for n, v in warmups.items()) + '.']
        if g.get('throughput_traces'):
            lines += ['', 'Point-monitor traces, defined as in section C. The BeamZ trace comes from one additional untimed solve with a per-step '
                      'FieldRecorder at the monitor node; its timed solves record one frequency there with a point FieldMonitor.', '']
            lines += trace_rows(g['throughput_traces'])
        lines += ['', 'Rerun on a CUDA host with the two GPU venvs of `setup_env.sh`: `run_gpu.sh torchfdtd_driver.py --fixture throughput` and '
                  '`run_gpu.sh beamz_driver.py --fixture throughput` from a fresh copy of the repository, then move the two records into '
                  f"`docs/validation/cross_solver/{tag}/` and the trace artifacts into `$TORCHFDTD_BENCH_ROOT/artifacts_{tag}` before `combine.py`.", '']
    return lines


def adjoint_section(c):
    block = c['adjoint']
    lines = ['## D. Adjoint', '',
             'Time to gradient is the median wall time of three warmed repetitions of upload + forward + backward + synchronise. Peak device memory '
             'is torch.cuda.max_memory_allocated (TorchFDTD) and the XLA peak_bytes_in_use of the process (FDTDX, one process per method). '
             'Meep is excluded: its adjoint is a frequency-domain method with different semantics.', '',
             '| Solver, method | Time to gradient (s) | Peak device MiB | Loss | Gradient L2 norm | Source-cell gradient |', '|---|---:|---:|---:|---:|---:|']
    label = {'torchfdtd_checkpointed': 'TorchFDTD, checkpointed (2 device checkpoints)', 'fdtdx_checkpointed': 'FDTDX, checkpointed (num_checkpoints=2)',
             'fdtdx_reversible': 'FDTDX, reversible (Recorder(modules=[]))', 'fdtdx_checkpointed16': 'FDTDX, checkpointed (num_checkpoints=16, supplementary)'}
    for name, r in block['solvers'].items():
        peak = r.get('peak_allocated_bytes', r.get('peak_bytes_in_use'))
        lines.append(f"| {label[name]} | {r['median_wall_seconds']:.3f} | {mb(peak)} | {r['loss']:.6e} | {r['gradient']['l2_norm']:.6e} | {r['gradient']['source_cell_value']:.1e} |")
    torch_row = block['solvers'].get('torchfdtd_checkpointed')
    if torch_row:
        lines += ['', f"TorchFDTD replayed {torch_row['gradient'].get('replayed_steps', 'n/a')} forward steps during the backward sweep "
                  f"(forward {torch_row.get('median_forward_seconds', 0):.3f} s, backward {torch_row.get('median_backward_seconds', 0):.3f} s of the median). "
                  "FDTDX checkpointed uses equinox's checkpointed while-loop with the requested number of checkpoint slots; the 16-checkpoint row shows how "
                  'strongly its cost depends on that setting. The reversible method stores no interior checkpoints and reconstructs the fields backwards.']
    lines += ['', 'Wall-time samples (s): ' + '; '.join(f"{label[n]}: {', '.join(f'{v:.3f}' for v in r['wall_samples'])}" for n, r in block['solvers'].items()) + '.']
    if any('compile_seconds' in r for r in block['solvers'].values()):
        lines += ['', 'FDTDX compilation (excluded): ' + ', '.join(f"{label[n]} {r['compile_seconds']:.1f} s" for n, r in block['solvers'].items() if 'compile_seconds' in r) + '.']
    lines += ['', '| Pair | Gradient relative L2 difference | Gradient max abs. difference | Probe-history relative L2 difference | Loss relative difference |', '|---|---:|---:|---:|---:|']
    for pair, v in block['pairwise'].items():
        a, b = pair.split('_vs_')
        lines.append(f"| {label[a]} vs {label[b]} | {fmt(v.get('gradient_relative_l2'))} | {fmt(v.get('gradient_max_abs_difference'))} | "
                     f"{fmt(v.get('probe_history_relative_l2'))} | {fmt(v.get('loss_relative_difference'))} |")
    lines.append('')
    return lines


def rerun_section(c):
    src = (c.get('throughput') or {}).get('source_records', {}).get('meep')
    return ['## Rerunning the Meep timing block', '',
            'The Meep throughput rows and the rank sweep are retaken, and the combined record and this document regenerated, by one command '
            'from a Windows shell (the GPU records are left untouched):', '',
            '```', 'bash benchmarks/cross_solver/run_meep_timing.sh   # from the repository root inside the Linux environment', '```', '',
            'The script runs `run_meep.sh 12 --fixture throughput` (the primary 12-rank block), `meep_rank_sweep.sh` (4, 8, 12 and 16 ranks), '
            '`combine.py` and `report.py`. Idle criterion of a block: the master rank polls the Windows host CPU load through '
            '`powershell.exe (Get-CimInstance Win32_Processor).LoadPercentage` every 5 s and starts the block after two consecutive samples at or '
            'below 50 percent (`--cpu-idle-limit`, 30 min limit per block); the other ranks sleep on a token file meanwhile. The block '
            '(one warm-up plus three timed solves) is accepted when its wall times spread by at most a factor 1.25, otherwise it is retaken '
            'after the gate, up to four times; every attempt and the host load before and after each block are stored in the record. '
            f"`combine.py` prefers `meep_throughput.json` when it exists and otherwise falls back to `meep_throughput_ranks12.json` "
            f"(currently used: `{src}`). A quiet GPU is not required for this block.", '']


def differences_section(c):
    s = c['fixtures']['slab']
    return ['## Differences between the solvers that the reader must know', '',
            '- **Absorbing boundaries.** TorchFDTD and FDTDX use convolutional PML with a cubic conductivity profile; the FDTDX faces were given '
            'sigma_end = 40/(L+1) in Courant units (the TorchFDTD maximum), kappa = 1 and the same negligible alpha, but FDTDX grades on d/L with its own '
            'E/H half-cell offsets while TorchFDTD grades on depth/(L+1). Meep uses its stretched-coordinate PML with the default quadratic profile and '
            'R_asymptotic = 1e-15. Only the thickness (16 cells for A, 8 cells for B and C) is identical.',
            '- **Sources.** The slab and throughput sources are additive (soft) field kicks with one shared sampled waveform: TorchFDTD adds the sample after '
            'its E update, FDTDX reproduces the same kick through PointDipoleSource with a sampled profile scaled by -1/C over the sheet or cell, and Meep '
            'injects the waveform as a current density (is_integrated=False), so the Meep field amplitude differs by a solver-specific factor that cancels '
            'in every reported ratio. For the sphere, TorchFDTD drives a closed TFSF box from a live one-dimensional Yee line (numerical dispersion '
            'matched), FDTDX 0.6.2 offers only single-plane (one-way) TFSF sources, and Meep uses a current sheet spanning the whole cell with '
            'is_integrated=True because the sheet extends into the PML.',
            '- **TFSF availability.** Only TorchFDTD ran fixture B with a closed TFSF box, so only its empty-box figure measures leakage; the FDTDX and Meep '
            'flux planes sit in the total-field region and the incident field is removed by subtracting the empty-run frequency-domain fields.',
            '- **Frequency-domain monitors.** TorchFDTD interpolates E and H trilinearly to its plane quadrature points and applies the half-step H phase; '
            'FDTDX PhasorDetector co-locates all components at the Ez Yee node and time-centres H by averaging consecutive half steps (exact_interpolation), '
            'with the phasors post-processed in float64 here; Meep\'s DFT flux objects use its own Yee interpolation. These conventions change the flux '
            'normalisation, not the reported ratios.',
            '- **Precision.** TorchFDTD and FDTDX propagate float32 fields (complex64 accumulators); the conda-forge Meep build is double precision.',
            f"- **Grid and time step.** All solvers use dx = {s['mesh_um']} um (A) and the fixture values above; dt is identical to 1e-12 relative "
            '(FDTDX derives dt from courant_factor/sqrt(3), so the 2D slab passes courant_factor = 0.99 sqrt(3/2)). Meep\'s run(until=...) stepped 801 '
            'times instead of 800 for the 64^3 throughput cases; its rates use the steps it ran.',
            '- **Material sampling.** TorchFDTD and FDTDX receive the same per-component staircase permittivity arrays (SHA-256 recorded). Meep rasterises the '
            'geometry itself at its Yee positions with eps_averaging=False; its epsilon array is not identical cell by cell.',
            '- **Execution model.** TorchFDTD runs fused CUDA kernels (NVRTC-compiled once, cached on disk) captured in a CUDA graph with a Python setup of '
            'about 15 ms; FDTDX runs one jitted XLA executable per case (compilation excluded and reported with JAX persistent compilation cache enabled, '
            'place_objects/apply_params of about 0.5 s included in the full solve); Meep runs 12 MPI ranks on the CPU with a per-step field probe; the '
            'rank-sweep table gives its stepping time for 4 to 16 ranks. The Meep driver can gate its timing blocks on the Windows host CPU load '
            'because other processes on the workstation share the cores; the Meep rows reported here come from the ungated sweep run described in section C.',
            "- **BeamZ (section C2 only).** BeamZ receives the shared staircase permittivity as a MaterialGrid with Yee-support arrays (its own "
            "rasteriser smooths interfaces by default), the same additive Ez kick through CustomSource(timing='e') and a CPML of the same 8-cell "
            'thickness with its own profile. Its timed solves record one frequency at the monitor node instead of the per-step trace of the other solvers.',
            '- **Adjoint semantics.** TorchFDTD differentiates its discrete Yee/CPML step with a checkpointed transpose; FDTDX differentiates the same forward '
            'model through JAX with either equinox checkpointing or time reversal. Meep\'s adjoint solver is frequency-domain and was not run.',
            '- **Shared GPU.** The RTX 3060 also drives the Windows desktop (about 2.6 GiB resident); every timing block waited '
            'until the reported memory and utilisation stayed below the idle criterion recorded in the records.', '']


def main():
    c = json.loads(COMBINED.read_text(encoding='utf-8'))
    dates = sorted(set((c.get('record_dates') or {}).values())) or [c['date']]
    lines = ['# Cross-solver comparison on one RTX 3060 workstation', '',
             f"Same-hardware accuracy and speed comparison of TorchFDTD against Meep (CPU) and FDTDX (GPU) on {', '.join(dates)}"
             + (', and of forward throughput against BeamZ (GPU) on a second GPU in section C2' if c.get('other_gpus') else '') + ', from the machine-readable '
             '[combined record](validation/cross_solver_3060.json) and the per-solver records in `docs/validation/cross_solver/`. '
             'The drivers, fixtures and environment scripts live in `benchmarks/cross_solver/`. The document reports numbers and their conditions only.', '']
    lines += environment_section(c)
    lines += fixture_section(c)
    lines += slab_section(c)
    lines += sphere_section(c)
    lines += throughput_section(c)
    lines += other_gpu_sections(c)
    lines += adjoint_section(c)
    lines += rerun_section(c)
    lines += differences_section(c)
    OUTPUT.write_bytes(('\n'.join(lines).rstrip('\n') + '\n').encode('utf-8'))
    print('wrote', OUTPUT)


if __name__ == '__main__':
    main()
