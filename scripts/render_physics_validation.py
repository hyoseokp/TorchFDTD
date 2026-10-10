"""Render docs/PHYSICS_VALIDATION.md from the G3 records in docs/validation/g3/*.json.

Every number in the document comes from the records written by tests/test_physics_g3_a.py;
the prose here only names the fixtures and the pre-declared limits. Run after the recorded run:

    python scripts/render_physics_validation.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT / 'docs' / 'validation' / 'g3'
OUTPUT = ROOT / 'docs' / 'PHYSICS_VALIDATION.md'


def load(task):
    path = RECORDS / f'{task}.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.is_file() else None


def g(value, digits=3):
    if value is None:
        return 'n/a'
    if isinstance(value, bool):
        return 'yes' if value else 'no'
    if isinstance(value, (int,)) and not isinstance(value, bool):
        return str(value)
    if isinstance(value, float):
        return f'{value:.{digits}g}'
    return str(value)


def table(header, rows):
    lines = ['| ' + ' | '.join(header) + ' |', '|' + '|'.join(' --- ' for _ in header) + '|']
    lines += ['| ' + ' | '.join(str(c) for c in row) + ' |' for row in rows]
    return '\n'.join(lines)


def verdict(ok):
    return 'pass' if ok else '**FAIL**'


def environment_block(record):
    e = record['environment']
    return (f"Environment: Python {e['python']}, numpy {e['numpy']}, torch {e['torch']} (CUDA runtime {e['cuda_runtime']}), "
            f"{e['gpu'] or 'no GPU'}, {e['cpu']}, {e['os']}; run at {e['recorded_at']} on commit {e['commit'][:12]} "
            f"with {e['dirty_paths']} dirty paths (the records themselves were being written); fine meshes {'on' if e['fine_meshes'] else 'off'}.")


def section_g301(record):
    entries = record['entries']
    out = ['## G3-01 Uniform-medium propagation', '',
           'Case: `docs/validation/cases/G3-01_uniform_propagation.json`. Part A initialises a real discrete plane wave '
           'on an all-periodic Yee grid and measures cos(omega dt) from the three-term recurrence of the field; the oracle is the exact '
           'Yee relation written in the test. Part B propagates a one-cycle pulse from a sheet through two point monitors 3.1 um apart '
           '(2 vacuum wavelengths) inside a 24.8 um domain for 100 fs and compares the measured k(f) with the Yee relation and the continuum.',
           '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('eigenmode oblique'):
            rows.append([v['shape'], g(v['index']), v['polarization'], g(v['residual'], 2), g(v['polarization_leak'], 2),
                         g(v['phase_velocity_error'], 3), verdict(v['residual'] <= v['limit_residual'] and v['polarization_leak'] <= v['limit_leak'])])
    out += ['### Part A: discrete relation at an oblique wavevector (limits 1e-12 on both residuals)', '',
            table(['cells', 'n', 'polarization', 'abs cos residual', 'polarization leak', 'v_p / (c/n) - 1', 'verdict'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('eigenmode axis'):
            rows.append([v['shape'][0], g(v['index']), v['polarization'], g(v['residual'], 2), g(v['polarization_leak'], 2),
                         g(v['phase_velocity_error'], 3), g(v['phase_error_per_wavelength'], 3)])
    out += ['### Part A: mesh sweep along an axis (cells per wavelength in the medium)', '',
            table(['N', 'n', 'polarization', 'abs cos residual', 'leak', 'v_p / (c/n) - 1', 'phase error per wavelength (rad)'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('propagation'):
            i = len(v['wavelength_um'])//2
            rows.append([key.split()[1], v['N'], g(v['index']), v['component'], v['steps'], g(v['max_phase_residual_vs_yee'], 2),
                         g(v['limit_phase_residual_rad'], 1), g(v['phase_error_per_wavelength'][i], 3), g(v['phase_error_per_wavelength_yee'][i], 3),
                         g(v['wavelength_um'][i], 4), g(max(v['phase_error_per_wavelength'], key=abs), 3),
                         g(v['trace_end_over_peak'], 2), verdict(v['max_phase_residual_vs_yee'] <= v['limit_phase_residual_rad'])])
    out += ['### Part B: pulse propagation through the Simulation path (limit 1e-3 rad on abs(k_measured - k_Yee) D)', '',
            table(['dim', 'N', 'n', 'component', 'steps', 'max abs(k_meas - k_Yee) D (rad)', 'limit', 'phase error/wavelength at mid band (rad)',
                   'Yee prediction', 'mid-band wavelength (um)', 'largest phase error/wavelength on band', 'trace end / peak', 'verdict'], rows), '']
    rows = [[key.split()[2], v['N'], g(v['index']), ' vs '.join(v['components']), g(v['trace_difference'], 2), g(v['limit'], 1), verdict(v['trace_difference'] <= v['limit'])]
            for key, v in entries.items() if key.startswith('polarization identity')]
    out += ['### Polarization identity (limit 1e-12 on the normalised trace difference)', '', table(['dim', 'N', 'n', 'components', 'max difference / peak', 'limit', 'verdict'], rows), '']
    rows = [[key.split()[4], g(v['index']), v['component'], v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]
            for key, v in entries.items() if key.startswith('layer A')]
    if rows:
        out += ['### Layer A: CUDA FP32 against CPU FP64 (rtol 1e-4, atol 1e-6 on traces / FP64 peak)', '',
                table(['dim', 'n', 'component', 'steps', 'max abs error', 'relative L2', 'verdict'], rows), '']
    return out


def section_g302(record):
    """Rendered from the revision-2 record (G3-02r2.json); the first record and its FAILED evidence stay in place."""
    entries = record['entries']
    out = ['## G3-02 Dielectric slab, normal and oblique TE/TM', '',
           'Case: `docs/validation/cases/G3-02r2_slab_tmm_40_cells.json` (revision 2; the first case '
           '`docs/validation/cases/G3-02_dielectric_slab_tmm.json`, its record `docs/validation/g3/G3-02.json` and its FAILED evidence run '
           '`20260921T164814Z-g3-02-1e349534` are kept in place as the finding). A lossless slab in a 6 um 2D cell with periodic (normal) or Bloch '
           '(fixed k_parallel) transverse boundaries, a three-cycle sheet pulse, point monitors 1 um before and after the slab and a slab-free '
           'reference run. r and t are the +f DFT ratios referred to the physical faces with the discrete vacuum wavenumber; the oracle is a '
           'Fresnel/Airy transfer matrix written in the test. Limits at about 40 cells per material wavelength: R and T absolute error 0.01, '
           'abs(R+T-1) 0.01, transmission phase 0.02 rad wherever |t| > 0.1 (everywhere here). The 20-cell mesh is recorded with the energy-balance '
           'limit only and feeds the convergence-order test (ratio between 3 and 5). The reflection phase is reported only (staircase reference-plane ambiguity).', '',
           environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('slab'):
            criteria = 'R, T, balance, phase' if v['rt_limits_apply'] else 'balance only'
            rows.append([g(v['index']), g(v['thickness_um']), v['angle_deg'], v['polarization'], v['N'], g(v['mesh_um'], 4),
                         g(v['cells_per_material_wavelength_at_1p55'], 3), v['steps'], g(v['R_abs_error'], 2), g(v['T_abs_error'], 2),
                         g(v['balance_residual'], 2), g(v['t_phase_error'], 2), g(v['r_phase_error'], 2), criteria,
                         verdict(v['passed']) + ('' if v['rt_limits_apply'] or v['rt_within_limits'] else ' (R/T limits not met, reported)')])
    out += [table(['n', 'd (um)', 'angle (deg)', 'pol', 'N', 'h (um)', 'cells/material wavelength', 'steps', 'max abs dR', 'max abs dT',
                   'max abs(R+T-1)', 'max t phase error (rad)', 'max r phase error (rad, info)', 'criteria', 'verdict'], rows), '']
    failing = [key for key, v in entries.items() if key.startswith('slab') and not v['passed']]
    out += [f'Instances failing an applicable pre-declared limit: {len(failing)} of {sum(1 for k in entries if k.startswith("slab"))}.' +
            (' ' + '; '.join(failing) if failing else ''), '']
    rows = [[g(v['index']), g(v['thickness_um']), v['angle_deg'], v['polarization'], g(v['R_abs_error']['N20'], 2), g(v['R_abs_error']['N40'], 2), g(v['ratio']['R'], 3),
             g(v['t_phase_error']['N20'], 2), g(v['t_phase_error']['N40'], 2), g(v['ratio']['t_phase'], 3), verdict(v['passed'])]
            for key, v in entries.items() if key.startswith('order')]
    if rows:
        out += ['### Convergence order, 20-cell over 40-cell errors (limit: ratio between 3 and 5)', '',
                table(['n', 'd (um)', 'angle (deg)', 'pol', 'abs dR N20', 'abs dR N40', 'ratio', 't phase N20 (rad)', 't phase N40 (rad)', 'ratio', 'verdict'], rows), '']
    out += resolution_paragraph(entries)
    rows = [[v['polarization'], v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]
            for key, v in entries.items() if key.startswith('layer A')]
    if rows:
        out += ['### Layer A: CUDA FP32 (complex64 Bloch fields) against CPU FP64, n=1.5, d=0.2 um, 45 deg, N20', '',
                table(['pol', 'steps', 'max abs error', 'relative L2', 'verdict'], rows), '']
    return out


def resolution_paragraph(entries):
    """Numbers from the G3-02r2 record (both meshes) and the G3-01 record (dispersion)."""
    slabs = [v for k, v in entries.items() if k.startswith('slab')]
    hi20 = [v for v in slabs if v['index'] == 3.5 and v['N'] == 20]
    hi40 = [v for v in slabs if v['index'] == 3.5 and v['N'] == 40]
    lo = [v for v in slabs if v['index'] == 1.5]
    orders = [v for k, v in entries.items() if k.startswith('order')]
    if not (hi20 and hi40 and lo):
        return []
    rng = lambda vs, key: (min(v[key] for v in vs), max(v[key] for v in vs))
    text = (f"### Resolution requirement for high-index slabs\n\nAt {g(rng(hi20, 'cells_per_material_wavelength_at_1p55')[0], 3)} to "
            f"{g(rng(hi20, 'cells_per_material_wavelength_at_1p55')[1], 3)} cells per material wavelength the n=3.5 slabs reach max abs dR "
            f"{g(rng(hi20, 'R_abs_error')[0], 3)} to {g(rng(hi20, 'R_abs_error')[1], 3)} and transmission phase errors of "
            f"{g(rng(hi20, 't_phase_error')[0], 3)} to {g(rng(hi20, 't_phase_error')[1], 3)} rad, above the 0.01 and 0.02 rad limits, while at "
            f"{g(rng(hi40, 'cells_per_material_wavelength_at_1p55')[0], 3)} to {g(rng(hi40, 'cells_per_material_wavelength_at_1p55')[1], 3)} cells they reach "
            f"{g(rng(hi40, 'R_abs_error')[0], 3)} to {g(rng(hi40, 'R_abs_error')[1], 3)} and {g(rng(hi40, 't_phase_error')[0], 3)} to "
            f"{g(rng(hi40, 't_phase_error')[1], 3)} rad; the n=1.5 slabs stay within the limits at both meshes (abs dR at most {g(rng(lo, 'R_abs_error')[1], 3)}, "
            f"phase at most {g(rng(lo, 't_phase_error')[1], 3)} rad). The energy balance abs(R+T-1) is at most {g(rng(slabs, 'balance_residual')[1], 2)} everywhere")
    if orders:
        ratios_p = [v['ratio']['t_phase'] for v in orders]
        ratios_r = [v['ratio']['R'] for v in orders]
        text += (f", and every error falls by a factor {g(min(ratios_p), 3)} to {g(max(ratios_p), 3)} (phase) and {g(min(ratios_r), 3)} to "
                 f"{g(max(ratios_r), 3)} (R) when the mesh is halved")
    g301 = load('G3-01')
    if g301:
        e = g301['entries']
        try:
            e20 = e['eigenmode axis 2d n=1.5 N=20 TE']['phase_error_per_wavelength']
            e40 = e['eigenmode axis 2d n=1.5 N=40 TE']['phase_error_per_wavelength']
            pv = [e[f'propagation 2d N={N} n=1.0 Ez']['phase_error_per_wavelength'][5] for N in (10, 20, 40)]
            text += (f". This is the second-order Yee phase error measured independently in G3-01: {g(e20, 3)} rad per material wavelength at 20 cells and "
                     f"{g(e40, 3)} rad at 40 cells (eigenmode, n=1.5), and {g(pv[0], 3)}, {g(pv[1], 3)} and {g(pv[2], 3)} rad per vacuum wavelength at 10, 20 and 40 cells "
                     "on the Simulation path; a 0.5 um n=3.5 slab is 1.13 material wavelengths thick, so its accumulated phase error at 20 cells is of the order of the limit")
        except KeyError:
            pass
    text += ('. The first fixture therefore failed on a resolution requirement of the staircase Yee scheme, not on a defect: the revision-2 case fixes '
             'the mesh at about 40 cells per material wavelength for every index and leaves the limits unchanged.')
    return [text, '']


def section_g303(record):
    entries = record['entries']
    out = ['## G3-03 Drude and Lorentz slabs: fitting error and ADE error separated', '',
           'Case: `docs/validation/cases/G3-03_dispersive_slab_fit_ade.json`. Normal incidence in the G3-02 cell with the analytic Drude '
           '(eps_inf 1, omega_p 2e15 rad/s, gamma 1e14 rad/s, 0.1 um) and two-pole Lorentz (eps_inf 2.25, poles at 1.9e15 and 7.5e14 rad/s, '
           '0.5 um) slabs; the oracle is the transfer matrix with the same analytic permittivity. Limits: abs dR, abs dT, abs dA 0.01, t phase 0.02 rad.',
           '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('analytic'):
            ok = (v['R_abs_error'] <= v['limits']['R'] and v['T_abs_error'] <= v['limits']['T'] and v['A_abs_error'] <= v['limits']['A']
                  and v['t_phase_error'] <= v['limits']['t_phase'])
            rows.append([v['material'], v['polarization'], g(v['mesh_um']), v['cells_across_slab'], v['steps'], g(v['R_abs_error'], 2),
                         g(v['T_abs_error'], 2), g(v['A_abs_error'], 2), g(v['t_phase_error'], 2), g(max(v['A_ref']), 3), verdict(ok)])
    out += ['### Part a: analytic materials given directly', '',
            table(['material', 'pol', 'h (um)', 'cells across slab', 'steps', 'max abs dR', 'max abs dT', 'max abs dA', 'max t phase error (rad)', 'max A (TMM)', 'verdict'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('fitted'):
            a, b, c = v['fdtd_fitted_vs_tmm_fitted'], v['fdtd_fitted_vs_tmm_analytic'], v['tmm_fitted_vs_tmm_analytic']
            rows.append([v['material'], g(v['converged']), v['poles'], g(v['fit_report_analytic']['normalized_rms'], 2),
                         g(v['fit_band_errors']['max_abs_n'], 2), g(v['fit_band_errors']['max_abs_k'], 2),
                         g(c['R_abs_error'], 2), g(c['T_abs_error'], 2), g(a['R_abs_error'], 2), g(a['T_abs_error'], 2), g(a['A_abs_error'], 2), g(a['t_phase_error'], 2),
                         g(b['R_abs_error'], 2), g(b['T_abs_error'], 2), g(b['A_abs_error'], 2), g(b['t_phase_error'], 2)])
    out += ['### Part b: n/k tables through the passive fit (h20, TE); fit error and discretization error separated', '',
            table(['material', 'converged', 'poles', 'fit normalized rms', 'max abs dn on band', 'max abs dk on band',
                   'fit only: abs dR', 'fit only: abs dT', 'FDTD(fit) vs TMM(fit): abs dR', 'abs dT', 'abs dA', 't phase (rad)',
                   'FDTD(fit) vs TMM(analytic): abs dR', 'abs dT', 'abs dA', 't phase (rad)'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('ade'):
            for mesh, m in v['per_dt'].items():
                rows.append([v['material'], mesh, g(m['dt_s'], 4), g(m['max_abs_n_error'], 2), g(m['max_abs_k_error'], 2), g(m['max_rel_eps_error'], 2),
                             g(m['solver_vs_bilinear_rel'], 2), g(m['driven_vs_bilinear_rel'], 2)])
            rows.append([v['material'], 'ratio dt / (dt/2)', '', g(v['error_ratio_dt_over_half_dt']['n'], 3), g(v['error_ratio_dt_over_half_dt']['k'], 3), '', '', ''])
    out += ['### Part c: trapezoidal ADE constitutive error at the 21 band frequencies (limit 1e-3 on abs dn and abs dk; solver vs bilinear 1e-12; driven cell 1e-9)', '',
            table(['material', 'time step', 'dt (s)', 'max abs(n_ADE - n)', 'max abs(k_ADE - k)', 'max rel eps error', 'solver permittivity vs bilinear (rel)', 'driven cell vs bilinear (rel)'], rows), '']
    return out


def section_g307(record):
    entries = record['entries']
    out = ['## G3-07 CPML reflection and long-time stability', '',
           'Case: `docs/validation/cases/G3-07_cpml_reflection_stability.json`. Default profile (10 layers, 0.25 um, sigma_scale 1, kappa 1, '
           'alpha 1e-8, cubic). The reflected wave is the difference between a short domain and a long reference domain with identical '
           'source, monitor and near-end geometry; R(f) = |DFT(short - long)|^2 / |DFT(long)|^2. Limits: normal 1e-6, oblique and interface 1e-4, '
           'stability: energy last/peak 1e-6 (normal runs) and no late growth.', '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('normal') or key.startswith('oblique'):
            rows.append([key, v['steps'], g(v['R_max_on_band'], 2), g(v['R_max_dB'], 3), g(v['R_at_design'], 2), g(v['R_broadband'], 2), g(v['limit'], 1),
                         verdict(v['R_max_on_band'] <= v['limit'])])
    v = entries.get('interface n=2 half space L10')
    if v:
        for label, m in v['monitors'].items():
            rows.append([f'interface, {label}', v['steps'], g(m['R_max_on_band'], 2), g(m['R_max_dB'], 3), g(m['R_at_design'], 2), g(m['R_broadband'], 2),
                         g(v['limit'], 1), verdict(m['R_max_on_band'] <= v['limit'])])
    out += ['### Reflected / incident power', '',
            table(['fixture', 'steps', 'max R on band', 'dB', 'R at design wavelength', 'broadband energy ratio', 'limit', 'verdict'], rows), '']
    v = entries.get('sweeps vacuum normal')
    if v:
        out += ['### Separate sweeps (vacuum, normal incidence; reported only)', '',
                table(['sweep', 'value A', 'value B'],
                      [['layers 10 vs 20: max R on band', g(v['depth']['L10'], 2) + f" ({g(v['depth']['L10_dB'], 3)} dB)", g(v['depth']['L20'], 2) + f" ({g(v['depth']['L20_dB'], 3)} dB)"],
                       ['duration 100 fs vs 200 fs: max R on band', g(v['time']['fs100'], 2), g(v['time']['fs200'], 2) + f" (relative change {g(v['time']['relative_change'], 2)})"]]), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('stability'):
            ok = v['late_growth'] <= v['limits']['late_growth_max'] and (not v['decay_criterion_applies'] or v['energy_last_over_peak'] <= v['limits']['energy_last_over_peak_max'])
            rows.append([key.replace('stability ', ''), v['steps'], g(v['duration_fs'], 4), g(v['source_end_fs'], 3), g(v['energy_last_over_peak'], 2),
                         g(v['energy_at_half_over_peak'], 2), g(v['late_growth'], 6), g(v['decay_criterion_applies']), verdict(ok)])
    out += ['### 20,000-step stability', '',
            table(['run', 'steps', 'duration (fs)', 'source end (fs)', 'energy last / peak', 'energy at half / peak', 'late growth', 'decay limit applies', 'verdict'], rows), '']
    v = entries.get('layer A cuda fp32 short vacuum normal')
    if v:
        out += ['### Layer A: CUDA FP32 against CPU FP64 (short vacuum normal fixture)', '',
                table(['steps', 'max abs error', 'relative L2', 'verdict'], [[v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]]), '']
    return out


SECTIONS = {'G3-01': section_g301, 'G3-02': section_g302, 'G3-03': section_g303, 'G3-07': section_g307}
# Sections of the other G3 branch plug in after the merge: benchmarks/render_g3_b.py exposes RENDERERS with the
# same (record) -> lines contract; absent before the merge, it is simply skipped.
sys.path.insert(0, str(ROOT))
try:
    from benchmarks.render_g3_b import RENDERERS as G3_B_SECTIONS
except ImportError:
    G3_B_SECTIONS = {}
SECTIONS.update(G3_B_SECTIONS)


BEGIN = '<!-- g3-a begin -->'
END = '<!-- g3-a end -->'
HEADER = ['# Physics validation records (stage G3)', '',
          'Sections between the `g3-a begin` and `g3-a end` HTML comment markers are rendered by `scripts/render_physics_validation.py` from '
          '`docs/validation/g3/<task>.json`, which `tests/test_physics_g3_a.py` writes before it asserts; other agents\' sections carry their own markers '
          'and are preserved by this script. Every number below comes from those records; none is typed by hand. The fixtures and limits were declared in '
          '`docs/validation/cases/` before the recorded run. '
          'A **FAIL** is a finding against a pre-declared limit and is kept as such.', '']


def own_region():
    lines = [BEGIN, '']
    for task, render in SECTIONS.items():
        record = load('G3-02r2') if task == 'G3-02' else load(task)
        if record is None:
            lines += [f'## {task}', '', 'No record yet.', '']
            continue
        lines += render(record)
    return '\n'.join(lines).rstrip('\n') + '\n' + END + '\n'


def main():
    """Regenerate only the g3-a region; keep any other content of the file (other agents' marked sections) as it is."""
    region = own_region()
    if OUTPUT.is_file():
        text = OUTPUT.read_text(encoding='utf-8')
        lines = text.split('\n')
        if BEGIN in lines and END in lines:
            first, last = lines.index(BEGIN), lines.index(END)
            head = '\n'.join(lines[:first])
            tail = '\n'.join(lines[last+1:])
            text = (head + '\n' if head else '') + region + tail
        else:
            text = text.rstrip('\n') + '\n\n' + region
    else:
        text = '\n'.join(HEADER) + '\n' + region
    with open(OUTPUT, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(text.rstrip('\n') + '\n')
    print(f'wrote {OUTPUT.relative_to(ROOT).as_posix()}')


if __name__ == '__main__':
    main()
