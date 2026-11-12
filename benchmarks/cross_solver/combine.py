"""Merge the per-solver records into docs/validation/cross_solver_3060.json.

Cross-solver differences (spectra, cross-sections, adjoint gradients and probe
histories) are computed here from the per-solver records and the gradient
artifacts; nothing is typed by hand.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import common  # noqa: E402

ROOT = HERE.parents[1]
RECORDS = ROOT / 'docs' / 'validation' / 'cross_solver'
OUTPUT = ROOT / 'docs' / 'validation' / 'cross_solver_3060.json'


def load(name):
    path = RECORDS / f'{name}.json'
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def record_hashes():
    return {p.relative_to(RECORDS).as_posix(): common.sha256_file(p) for p in sorted(RECORDS.rglob('*.json'))}


def git_commit():
    """HEAD of the worktree at record time (the record itself is committed on top of it)."""
    try:
        return subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.SubprocessError):
        pass
    # A linked worktree under WSL: .git is a file whose gitdir is a Windows path.
    dotgit = ROOT / '.git'
    try:
        gitdir = dotgit.read_text(encoding='utf-8').strip().split('gitdir:', 1)[1].strip()
        if ':' in gitdir[:2]:
            gitdir = '/mnt/' + gitdir[0].lower() + gitdir[2:].replace(chr(92), '/')
        gitdir = Path(gitdir)
        head = (gitdir / 'HEAD').read_text(encoding='utf-8').strip()
        if head.startswith('ref:'):
            ref = head.split(':', 1)[1].strip()
            common_dir = gitdir.parents[1]
            ref_path = common_dir / ref
            if ref_path.exists():
                return ref_path.read_text(encoding='utf-8').strip()
            for line in (common_dir / 'packed-refs').read_text(encoding='utf-8').splitlines():
                if line.endswith(' ' + ref):
                    return line.split()[0]
            return None
        return head
    except (OSError, IndexError):
        return None


def spectra_block(fixture, solvers):
    out = {}
    for name, rec in solvers.items():
        if rec is None:
            continue
        out[name] = {k: rec[k] for k in ('max_T_absolute_error', 'max_R_absolute_error', 'max_energy_residual', 'wavelength_um', 'T', 'R', 'analytic_T')}
        out[name]['method'] = rec['method']
        out[name]['pml'] = rec['pml']
        out[name]['precision'] = rec['grid']['precision']
    present = [n for n in solvers if solvers[n] is not None]
    pairs = {}
    for i, a in enumerate(present):
        for b in present[i + 1:]:
            pairs[f'{a}_vs_{b}'] = dict(T_max_abs=float(np.max(abs(np.array(solvers[a]['T']) - np.array(solvers[b]['T'])))),
                                       R_max_abs=float(np.max(abs(np.array(solvers[a]['R']) - np.array(solvers[b]['R'])))))
    return dict(solvers=out, pairwise=pairs)


def sphere_block(solvers):
    out = {}
    for name, rec in solvers.items():
        if rec is None:
            continue
        out[name] = {k: rec[k] for k in ('max_relative_error', 'relative_error', 'wavelength_um', 'scattering_cross_section_um2',
                                           'mie_cross_section_um2', 'max_empty_box_cross_section_um2')}
        out[name]['method'] = rec['method']
        out[name]['pml'] = rec['pml']
        out[name]['precision'] = rec['grid']['precision']
        out[name]['steps'] = rec['grid'].get('steps', rec['grid'].get('requested_steps'))
    present = [n for n in solvers if solvers[n] is not None]
    pairs = {}
    for i, a in enumerate(present):
        for b in present[i + 1:]:
            sa, sb = np.array(solvers[a]['scattering_cross_section_um2']), np.array(solvers[b]['scattering_cross_section_um2'])
            pairs[f'{a}_vs_{b}'] = dict(max_relative=float(np.max(abs(sa / sb - 1))))
    return dict(solvers=out, pairwise=pairs)


def half_step_phase(case_name, solvers):
    """Relative L2 residual that a half-step timing offset alone produces for the source carrier: pi*dt/T."""
    for rec in solvers.values():
        if rec is None:
            continue
        for case in rec['cases']:
            if case['name'] == case_name:
                period = 1.55e-6 / common.C0
                return float(np.pi * case['dt_s'] / period)
    return None


def trace_comparison(solvers, artifacts):
    """Point-monitor traces of the throughput cases, compared after a least-squares amplitude fit.

    TorchFDTD and FDTDX share the additive kick; Meep injects the waveform as a current density
    with its own normalisation and a different source timing, so only the fitted shape is compared.
    """
    out = {}
    traces = {}
    provenance = {}
    for name, rec in solvers.items():
        if rec is None:
            continue
        for case in rec['cases']:
            path = artifacts / Path(case.get('trace_artifact', '')).name if case.get('trace_artifact') else None
            if path and path.exists():
                array = np.load(path)
                traces.setdefault(case['name'], {})[name] = array.astype(np.float64)
                # BeamZ records its trace once per case, from an untimed solve.
                recorded = {r.get('trace_sha256') for r in case['runs']} | {case.get('trace_sha256')}
                # The GPU drivers hash their float32 device trace; the saved artifact is float64.
                hashes = {common.sha256_array(array), common.sha256_array(array.astype(np.float32))}
                provenance.setdefault(case['name'], {})[name] = dict(artifact=path.name, sha256=common.sha256_array(array),
                                                                      matches_record=bool(hashes & recorded))
    for case_name, per in traces.items():
        pairs = {}
        names = list(per)
        for i, a in enumerate(names):
            for b in names[i + 1:]:
                x, y = per[a], per[b]
                n = min(len(x), len(y))
                x, y = x[:n], y[:n]
                scale = float(x @ y / max(y @ y, 1e-300))
                best = None
                for shift in range(-4, 5):
                    # positive shift: the second trace lags by `shift` samples
                    xa, yb = (x[shift:], y[:n - shift]) if shift >= 0 else (x[:n + shift], y[-shift:])
                    k = float(xa @ yb / max(yb @ yb, 1e-300))
                    err = common.relative_l2(xa, k * yb)
                    if best is None or err < best['fitted_relative_l2']:
                        best = dict(shift_samples=shift, amplitude_ratio=k, fitted_relative_l2=err)
                pairs[f'{a}_vs_{b}'] = dict(samples=n, raw_relative_l2=common.relative_l2(x, y), amplitude_ratio=scale,
                                           fitted_relative_l2=common.relative_l2(x, scale * y), best_shift=best)
        out[case_name] = dict(lengths={n: int(len(v)) for n, v in per.items()}, pairwise=pairs, artifacts=provenance.get(case_name, {}),
                              half_step_carrier_phase=half_step_phase(case_name, solvers))
    return out


def throughput_block(solvers):
    cases = {}
    for name, rec in solvers.items():
        if rec is None:
            continue
        for case in rec['cases']:
            row = cases.setdefault(case['name'], dict(shape=case['shape'], cells=case['cells'], steps=case['steps'], solvers={}))
            entry = dict(median_wall_seconds=case['median_wall_seconds'], median_loop_seconds=case['median_loop_seconds'],
                         median_setup_seconds=case['median_setup_seconds'], cell_steps_per_second_full=case['cell_steps_per_second_full'],
                         cell_steps_per_second_stepping=case['cell_steps_per_second_stepping'],
                         wall_samples=[r['wall_seconds'] for r in case['runs']], loop_samples=[r['loop_seconds'] for r in case['runs']])
            for key in ('peak_allocated_bytes', 'peak_bytes_in_use', 'compile_seconds', 'warmup_seconds', 'steps_run', 'load_average_before', 'load_average_after', 'gpu_idle',
                        'cpu_idle', 'host_cpu_percent_before', 'host_cpu_percent_after', 'spread', 'accepted_attempt'):
                if key in case:
                    entry[key] = case[key]
            if name == 'meep':
                entry['mpi_processes'] = rec['environment']['mpi_processes']
            row['solvers'][name] = entry
    return dict(cases=cases, methods={name: rec['method'] for name, rec in solvers.items() if rec is not None})


def other_gpus(artifacts):
    """Fixture C retaken on another GPU host: records in docs/validation/cross_solver/<gpu>/, trace artifacts in <artifacts>_<gpu>."""
    out = {}
    for folder in sorted(p for p in RECORDS.iterdir() if p.is_dir()):
        names = sorted((p.name[:-len('_throughput.json')] for p in folder.glob('*_throughput.json')), key=lambda n: n != 'torchfdtd')
        solvers = {name: load(f'{folder.name}/{name}_throughput') for name in names}
        out[folder.name] = dict(record_dates={n: r['date'] for n, r in solvers.items()}, environments={n: r['environment'] for n, r in solvers.items()},
                                throughput=throughput_block(solvers), throughput_traces=trace_comparison(solvers, Path(f'{artifacts}_{folder.name}')))
    return out


def meep_rank_sweep():
    rows = []
    for path in sorted(p for p in RECORDS.glob('meep_throughput_ranks*.json') if p.stem.removeprefix('meep_throughput_ranks').isdigit()):  # not the *_quiet retakes
        rec = json.loads(path.read_text(encoding='utf-8'))
        rows.append(dict(ranks=rec['environment']['mpi_processes'], record=path.name,
                         cases={c['name']: dict(median_loop_seconds=c['median_loop_seconds'], cell_steps_per_second_stepping=c['cell_steps_per_second_stepping'],
                                                loop_samples=[r['loop_seconds'] for r in c['runs']], load_average_before=c['load_average_before'])
                                for c in rec['cases']}))
    rows.sort(key=lambda r: r['ranks'])
    return rows


def adjoint_block(torch_rec, fdtdx_ckpt, fdtdx_rev, fdtdx_ckpt16, artifacts):
    entries = {}
    grads = {}
    signals = {}
    for name, rec in (('torchfdtd_checkpointed', torch_rec), ('fdtdx_checkpointed', fdtdx_ckpt), ('fdtdx_reversible', fdtdx_rev),
                      ('fdtdx_checkpointed16', fdtdx_ckpt16)):
        if rec is None:
            continue
        entry = dict(method=rec['method'], options=rec['options'], median_wall_seconds=rec['median_wall_seconds'],
                     wall_samples=[r['wall_seconds'] for r in rec['runs']], loss=rec['loss'], gradient=rec['gradient'], probe_history=rec['probe_history'],
                     gpu_idle=rec.get('gpu_idle'), shared=rec['shared'])
        for key in ('peak_allocated_bytes', 'peak_bytes_in_use', 'compile_seconds', 'median_forward_seconds', 'median_backward_seconds', 'spread', 'accepted_attempt'):
            if key in rec:
                entry[key] = rec[key]
        if rec['runs'] and rec['runs'][0].get('replayed_steps') is not None:
            entry['gradient']['replayed_steps'] = rec['runs'][0]['replayed_steps']
        entries[name] = entry
        gpath = artifacts / Path(rec['artifacts']['gradient']).name
        spath = artifacts / Path(rec['artifacts']['signals']).name
        if gpath.exists():
            grads[name] = np.load(gpath)
            assert common.sha256_array(grads[name]) == rec['gradient']['sha256'], f'{gpath} does not match its record hash'
        if spath.exists():
            signals[name] = np.load(spath)
            assert common.sha256_array(signals[name]) == rec['probe_history']['sha256'], f'{spath} does not match its record hash'
    names = list(entries)
    pairs = {}
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            pair = {}
            if a in grads and b in grads:
                pair['gradient_relative_l2'] = common.relative_l2(grads[a], grads[b])
                pair['gradient_max_abs_difference'] = float(np.max(abs(grads[a].astype(np.float64) - grads[b].astype(np.float64))))
                pair['gradient_reference_max_abs'] = float(np.max(abs(grads[b])))
            if a in signals and b in signals:
                pair['probe_history_relative_l2'] = common.relative_l2(signals[a], signals[b])
                pair['probe_history_max_abs_difference'] = float(np.max(abs(signals[a].astype(np.float64) - signals[b].astype(np.float64))))
            if a in entries and b in entries:
                pair['loss_relative_difference'] = abs(entries[a]['loss'] / entries[b]['loss'] - 1)
            pairs[f'{a}_vs_{b}'] = pair
    return dict(solvers=entries, pairwise=pairs, meep='excluded: Meep implements a frequency-domain adjoint with different semantics')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--artifacts', default=os.path.join(os.environ.get('TORCHFDTD_BENCH_ROOT', os.path.expanduser('~/torchfdtd-bench')), 'artifacts'))
    args = parser.parse_args()
    fixtures = {name: common.load_fixture(name) for name in ('slab', 'sphere', 'throughput', 'adjoint')}
    slab = {s: load(f'{s}_slab') for s in ('torchfdtd', 'fdtdx', 'meep')}
    sphere = {s: load(f'{s}_sphere') for s in ('torchfdtd', 'fdtdx', 'meep')}
    throughput = {s: load(f'{s}_throughput') for s in ('torchfdtd', 'fdtdx', 'meep')}
    throughput_sources = {s: f'{s}_throughput.json' for s in throughput}
    if throughput['meep'] is None:
        # The dedicated 12-rank block could not be completed under a quiet host CPU; the 12-rank
        # member of the rank sweep has the same configuration (12 ranks, one warm-up, three
        # timed solves, per-step probe) and is used as the Meep throughput record.
        throughput['meep'] = load('meep_throughput_ranks12')
        throughput_sources['meep'] = 'meep_throughput_ranks12.json'
    adjoint = adjoint_block(load('torchfdtd_adjoint'), load('fdtdx_adjoint_checkpointed'), load('fdtdx_adjoint_reversible'),
                            load('fdtdx_adjoint_checkpointed16'), Path(args.artifacts))
    environments = {}
    record_dates = {}
    for name, rec in (('torchfdtd', throughput['torchfdtd'] or slab['torchfdtd']), ('fdtdx', throughput['fdtdx'] or slab['fdtdx']), ('meep', throughput['meep'] or slab['meep'])):
        if rec is not None:
            environments[name] = rec['environment']
            record_dates[name] = rec['date']
    # The drivers do not record the git HEAD; keep the HEAD of the original workstation runs when records are added later.
    previous = json.loads(OUTPUT.read_text(encoding='utf-8')) if OUTPUT.exists() else {}
    combined = dict(
        schema='torchfdtd-cross-solver-combined-v1', date=time.strftime('%Y-%m-%d'), record_dates=record_dates,
        worktree_head_at_run=previous.get('worktree_head_at_run') or git_commit(),
        hardware=dict(gpu='NVIDIA GeForce RTX 3060 12 GB (WSL2, driver from Windows)', cpu=common.cpu_model(),
                      note='Linux side: a WSL2 Ubuntu 22.04 distribution. '
                           'GPU shared with the Windows desktop compositor; every timing block waited for the idle criterion recorded in gpu_idle.'),
        environments=environments,
        fixtures={name: {k: v for k, v in spec.items()} for name, spec in fixtures.items()},
        fixture_sha256={name: spec['_sha256'] for name, spec in fixtures.items()},
        driver_sha256=common.driver_hashes('common.py', 'torchfdtd_driver.py', 'fdtdx_driver.py', 'meep_driver.py', 'beamz_driver.py', 'combine.py',
                                           'report.py'),
        records=record_hashes(),
        slab=spectra_block('slab', slab), sphere=sphere_block(sphere), throughput=dict(source_records=throughput_sources, **throughput_block(throughput)),
        throughput_traces=trace_comparison(throughput, Path(args.artifacts)),
        meep_rank_sweep=meep_rank_sweep(), adjoint=adjoint, other_gpus=other_gpus(args.artifacts))
    for spec in combined['fixtures'].values():
        spec.pop('_sha256', None)
    OUTPUT.write_bytes((json.dumps(combined, indent=2, allow_nan=False) + '\n').encode('utf-8'))
    print('wrote', OUTPUT)


if __name__ == '__main__':
    main()
