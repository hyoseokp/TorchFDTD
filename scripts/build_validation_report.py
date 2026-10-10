"""Render docs/VALIDATION_REPORT.md, the internal validation report, from machine outputs only (G9-07).

Inputs: the gate file and its evidence runs (judged with the rules of check_release_gates.py),
the platform records, the newest clean-install record, the suite policy of run_suite.py, the
G3 physics records, the cross-solver and Meep comparison records, the known-limitations list
and the version strings of pyproject.toml, COMPATIBILITY.md, CHANGELOG.md and the wheel.
No number in the report is typed by hand, and a mismatch found by the consistency section is
printed into the report and returned as a nonzero exit status, never hidden.

The same run regenerates the parts of docs/RELEASE_SCOPE.md that state gate results: the
"Verified for release" cells that start with a state name and the stage-status block between
the ``stage-status`` markers. The prose of that document is left alone.

    python scripts/build_validation_report.py            # write both documents (clean tree only)
    python scripts/build_validation_report.py --check    # compare with the committed documents, write nothing
    python scripts/build_validation_report.py --allow-dirty   # write on a dirty tree, marked PROVISIONAL

The rendered text is idempotent for one tree state: tests/test_validation_report.py renders
it again and compares it with the committed file.
"""
import argparse
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parent
GATE_FILE = Path('docs') / 'validation' / 'completion_gates.json'
RUNS_DIR = Path('docs') / 'validation' / 'runs'
REPORT = Path('docs') / 'VALIDATION_REPORT.md'
SCOPE = Path('docs') / 'RELEASE_SCOPE.md'
PLATFORMS = Path('docs') / 'validation' / 'platforms'
CLEAN_INSTALL = Path('docs') / 'validation' / 'clean_install'
G3_RECORDS = Path('docs') / 'validation' / 'g3'
CASES = Path('docs') / 'validation' / 'cases'
CROSS_SOLVER = Path('docs') / 'validation' / 'cross_solver_3060.json'
LIMITATIONS = Path('docs') / 'validation' / 'known_limitations.json'
STAGE_BEGIN = '<!-- stage-status:begin -->'
STAGE_END = '<!-- stage-status:end -->'
STATES = ('VERIFIED', 'FAILED', 'NOT_RUN', 'BLOCKED_EXTERNAL')
CELL_STATE = re.compile(r'^(?:VERIFIED|FAILED|NOT_RUN|BLOCKED_EXTERNAL|MIXED)\b')
TASK_REF = re.compile(r'\b([GH]\d-\d\d)\b(?:\s+to\s+([GH]\d-\d\d)\b)?')
UNESCAPED_PIPE = re.compile(r'(?<!\\)\|')
# Wording that would present this internal record as an attestation by a third party.
FORBIDDEN_WORDS = re.compile(r'certif', re.IGNORECASE)


def load_script(name, directory=SCRIPTS):
    spec = importlib.util.spec_from_file_location(name, directory / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


judge = load_script('check_release_gates')
recorder = load_script('record_gate_evidence')
suites = load_script('run_suite')
meep = load_script('render_meep_comparison')


def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def table(header, rows):
    lines = ['| ' + ' | '.join(header) + ' |', '|' + '|'.join(' --- ' for _ in header) + '|']
    lines += ['| ' + ' | '.join(str(cell) for cell in row) + ' |' for row in rows]
    return lines


def g(value, digits=3):
    if value is None:
        return 'n/a'
    if isinstance(value, bool):
        return 'yes' if value else 'no'
    if isinstance(value, float):
        return f'{value:.{digits}g}'
    return str(value)


def cell(text):
    """One table cell: pipes escaped, line breaks collapsed."""
    return str(text).replace('|', '\\|').replace('\r', ' ').replace('\n', ' ')


# --- gate file --------------------------------------------------------------------------------------------------------

def all_tasks(gates):
    return [(stage, task) for stage in gates['stages'] for task in stage['tasks']]


# The task whose evidence is this report: it is recorded after the report is rendered, so the report shows it without
# its own run and judgement (otherwise recording it would change the report it just checked).
SELF_TASK = 'G9-07'
SELF_REASON = 'this report\'s own gate, recorded after the render; judge it with scripts/check_release_gates.py'


def display_state(task):
    if task['id'] == SELF_TASK:
        return 'SELF'
    return 'BLOCKED_EXTERNAL' if task.get('blocker') else task.get('verification_state')


def judgement(root, gates, task, runs_dir):
    """(label, reason, warnings) with the rules of check_release_gates.judge_task, stale evidence never accepted."""
    if task['id'] == SELF_TASK:
        return 'self', SELF_REASON, []
    if task.get('required_by_current_plan') is False:
        return 'optional', 'not required by the current plan', []
    failures, stale, warnings = judge.judge_task(root, gates, task, runs_dir)
    if failures:
        return 'FAIL', failures[0], warnings
    if stale:
        return 'FAIL', judge.STALE + ': ' + stale[0], warnings
    return 'PASS', warnings[0] if warnings else 'evidence matches the current checkout', warnings


def newest_run(root, task, runs_dir):
    ids = [] if task['id'] == SELF_TASK else task.get('evidence') or []
    if not ids:
        return None, None
    path = runs_dir / ids[-1] / 'evidence.json'
    return ids[-1], (load_json(path) if path.is_file() else None)


def judge_all(root, gates, runs_dir):
    """The judgement of every task, computed once per render (each one hashes test sources and asks git)."""
    return {task['id']: judgement(root, gates, task, runs_dir) for _, task in all_tasks(gates)}


def profile_summary(gates, verdicts, profile_id):
    profile = gates['profiles'][profile_id]
    counts = dict(PASS=0, FAIL=0, optional=0, self=0)
    for stage, task in all_tasks(gates):
        if stage['id'] in profile['required_stages']:
            counts[verdicts[task['id']][0]] += 1
    failed_elsewhere = [task['id'] for stage, task in all_tasks(gates)
                        if stage['id'] not in profile['required_stages'] and task.get('verification_state') == 'FAILED']
    counts['FAIL'] += len(failed_elsewhere)
    verdict = 'NOT RELEASABLE' if counts['FAIL'] else 'all judged tasks pass'
    return dict(profile=profile_id, stages=profile['required_stages'], scope_status=profile.get('scope_status'),
                counts=counts, failed_elsewhere=failed_elsewhere, verdict=verdict)


# --- RELEASE_SCOPE.md ---------------------------------------------------------------------------------------------------

def task_ids_in(text, gates):
    """Task ids named in a cell, ranges such as G4-01 to G4-05 expanded along the gate file's order."""
    order = [task['id'] for _, task in all_tasks(gates)]
    ids = []
    for first, last in TASK_REF.findall(text):
        if last and first in order and last in order:
            start, stop = order.index(first), order.index(last)
            ids.extend(order[start:stop + 1] if start <= stop else [first, last])
        else:
            ids.append(first)
    return sorted(set(ids), key=lambda item: (item[0], order.index(item) if item in order else 999))


def render_cell(ids, gates):
    states = {task['id']: display_state(task) for _, task in all_tasks(gates)}
    grouped = {}
    for task_id in ids:
        grouped.setdefault(states.get(task_id, 'UNKNOWN'), []).append(task_id)
    if len(grouped) == 1:
        (state, members), = grouped.items()
        return f"{state} ({', '.join(members)})"
    parts = [f"{state} {', '.join(grouped[state])}" for state in [*STATES, 'UNKNOWN'] if state in grouped]
    return 'MIXED: ' + '; '.join(parts)


def stage_status_block(gates, verdicts):
    lines = [STAGE_BEGIN,
             'Rendered from [validation/completion_gates.json](validation/completion_gates.json) and its evidence runs by '
             '`scripts/build_validation_report.py`; the judge column applies the rules of `scripts/check_release_gates.py` '
             'without accepting stale evidence. BLOCKED_EXTERNAL counts tasks whose `blocker` field is set.', '']
    rows = []
    for stage in gates['stages']:
        counts = {state: 0 for state in STATES}
        labels = dict(PASS=0, FAIL=0, optional=0, self=0)
        for task in stage['tasks']:
            counts[display_state(task)] = counts.get(display_state(task), 0) + 1
            labels[verdicts[task['id']][0]] += 1
        rows.append([stage['id'], cell(stage['title']), stage['profile'], len(stage['tasks']),
                     *[counts[state] for state in STATES], f"{labels['PASS']} pass, {labels['FAIL']} fail"])
    lines += table(['Stage', 'Title', 'Profile', 'Tasks', *STATES, 'Judge'], rows)
    lines.append('')
    for profile_id in gates['profiles']:
        summary = profile_summary(gates, verdicts, profile_id)
        counts = summary['counts']
        judged = counts['PASS'] + counts['FAIL'] + counts['optional']
        line = (f"- {profile_id} (stages {', '.join(summary['stages'])}): {counts['PASS']} of {judged} required tasks pass the judge, "
                f"{counts['FAIL']} fail" + (f", and {SELF_TASK} (this report) is judged after the render" if counts['self'] else '')
                + f"; {summary['verdict']}.")
        if summary['failed_elsewhere']:
            line = line[:-1] + f" FAILED tasks outside the profile count against it: {', '.join(summary['failed_elsewhere'])}."
        lines.append(line)
    lines.append(STAGE_END)
    return lines


def render_scope(text, gates, verdicts):
    """The scope document with its verification cells and stage-status block regenerated; returns (text, cell count)."""
    lines = text.split('\n')
    out, count = [], 0
    in_verified_table = False
    for line in lines:
        if line.startswith('|'):
            cells = UNESCAPED_PIPE.split(line)
            if 'Verified for release' in line and not in_verified_table:
                in_verified_table = True
            elif in_verified_table and len(cells) >= 4 and not set(line) <= set('|- '):
                last = cells[-2].strip()
                if CELL_STATE.match(last):
                    ids = task_ids_in(last, gates)
                    if ids:
                        cells[-2] = ' ' + render_cell(ids, gates) + ' '
                        line = '|'.join(cells)
                        count += 1
        else:
            in_verified_table = False
        out.append(line)
    text = '\n'.join(out)
    if STAGE_BEGIN not in text or STAGE_END not in text:
        raise SystemExit(f'{SCOPE.as_posix()} has no {STAGE_BEGIN} / {STAGE_END} markers; add a "## Stage status" section carrying them')
    head, rest = text.split(STAGE_BEGIN, 1)
    _, tail = rest.split(STAGE_END, 1)
    return head + '\n'.join(stage_status_block(gates, verdicts)) + tail, count


# --- sections -----------------------------------------------------------------------------------------------------------

def version_strings(root):
    pyproject = re.search(r'^version\s*=\s*"([^"]+)"', (root / 'pyproject.toml').read_text(encoding='utf-8'), re.M)
    compatibility = re.search(r'Version of record: \*\*([^*]+)\*\*', (root / 'docs' / 'COMPATIBILITY.md').read_text(encoding='utf-8'))
    # The newest released section; an "Unreleased" section above it collects changes since that release.
    changelog = re.search(r'^## (?!Unreleased\b)([^\s(]+)', (root / 'docs' / 'CHANGELOG.md').read_text(encoding='utf-8'), re.M)
    return dict(pyproject=pyproject.group(1) if pyproject else None,
                compatibility=compatibility.group(1) if compatibility else None,
                changelog=changelog.group(1) if changelog else None)


def clean_install_record(root):
    records = []
    for path in sorted((root / CLEAN_INSTALL).glob('*.json'), key=lambda p: p.name):
        record = load_json(path)
        if record.get('kind') == 'clean_install_record':
            records.append((path, record))
    return records[-1] if records else (None, None)


def wheel_version(name):
    match = re.match(r'torchfdtd-([^-]+)-', name or '')
    return match.group(1) if match else None


def section_header(root, gates, runs_dir, versions, provisional, dirty):
    newest = None
    for _, task in all_tasks(gates):
        run_id, evidence = newest_run(root, task, runs_dir)
        if evidence and (newest is None or evidence['recorded_at'] > newest['recorded_at']):
            newest = evidence
    lines = ['# TorchFDTD internal validation report', '',
             'Validation report, rendered by '
             '`scripts/build_validation_report.py` from the machine outputs named in each section: the gate file and its evidence runs, the '
             'platform, clean-install, physics, cross-solver and Meep comparison records, the suite policy in `scripts/run_suite.py`, the '
             'version strings, and the known-limitations list (a hand-maintained JSON whose entries cite their records). No number here is typed '
             'into this file; `tests/test_validation_report.py` renders it again and compares. It records what was run and what those runs '
             'produced. It is not an attestation by a third party, and a '
             'passing gate is evidence for that gate only, never a general statement that the solver is correct for every problem.', '']
    if provisional:
        lines += [f'**PROVISIONAL**: rendered on a dirty tree ({len(dirty)} changed or untracked paths); '
                  'the judgements below are not tied to one commit. Rebuild on a clean tree before relying on this file.', '']
    lines += [f"Package version `{versions['pyproject']}` (pyproject.toml). Gate file adopted at commit "
              f"`{str(gates.get('adopted_commit'))[:12]}` with {gates['task_count']} tasks in {len(gates['stages'])} stages; "
              f"newest evidence run `{newest['run_id']}` recorded {newest['recorded_at']} at commit `{newest['source_commit'][:12]}`."
              if newest else 'No evidence run is recorded.', '']
    rule = gates.get('release_rule') or {}
    lines += ['Release rule of the gate file: ' + ', '.join(f'`{key}={value}`' for key, value in rule.items()) + '.',
              'Technical readiness of a release candidate (every required task VERIFIED with evidence that matches the candidate) and '
              'authorization of a public release are separate decisions; this report can only inform the first, and the second is not '
              'given by any file in this repository.', '']
    return lines


def section_judgement(gates, verdicts):
    lines = ['## Release judgement by profile', '']
    rows = []
    for profile_id in gates['profiles']:
        summary = profile_summary(gates, verdicts, profile_id)
        counts = summary['counts']
        rows.append([profile_id, ', '.join(summary['stages']), cell(summary['scope_status']), counts['PASS'], counts['FAIL'],
                     counts['optional'], ', '.join(summary['failed_elsewhere']) or 'none', summary['verdict']])
    lines += table(['Profile', 'Required stages', 'Scope status', 'Pass', 'Fail', 'Optional', 'FAILED outside the profile', 'Verdict'], rows)
    lines += ['', 'A task passes when it is VERIFIED by an evidence run whose source commit is an ancestor of the current commit and whose '
              'test sources, fixture and criteria files are unchanged, with no failed, errored, skipped or absent required test and no '
              'external blocker; stale evidence is a failure here, as in `scripts/check_release_gates.py` without `--allow-stale`.', '']
    return lines


def section_gates(root, gates, runs_dir, verdicts):
    lines = ['## Gate tasks by stage', '',
             'One row per task of [validation/completion_gates.json](validation/completion_gates.json): the recorded implementation and '
             'verification states, the newest evidence run and its source commit, and the judgement of that evidence against the current tree.', '']
    for stage in gates['stages']:
        lines += [f"### {stage['id']} {stage['title']} ({stage['profile']}, {stage['priority']})", '']
        rows = []
        for task in stage['tasks']:
            run_id, evidence = newest_run(root, task, runs_dir)
            label, reason, _ = verdicts[task['id']]
            rows.append([task['id'], cell(task['title']), task.get('implementation_state'), display_state(task),
                         f'`{run_id}`' if run_id else 'none', f"`{evidence['source_commit'][:12]}`" if evidence else 'none',
                         label, cell(reason)])
        lines += table(['Task', 'Title', 'Implementation', 'Verification', 'Newest run', 'Source commit', 'Judgement', 'Reason'], rows)
        lines.append('')
    return lines


def platform_of(evidence, records):
    """The platform id an evidence run belongs to: its platform_id field, else the record whose GPU names equal the run's."""
    if evidence.get('platform_id'):
        return evidence['platform_id'], 'platform_id'
    names = sorted(gpu['name'] for gpu in (evidence.get('hardware') or {}).get('gpus') or [])
    matches = [record['platform_id'] for record in records if sorted(gpu['name'] for gpu in record['gpus']) == names and names]
    return (matches[0], 'GPU name') if len(matches) == 1 else (None, None)


def section_platforms(root, gates, runs_dir):
    lines = ['## Platform records', '',
             'Every record written by `scripts/platform_report.py` under `docs/validation/platforms/`; a platform without a record is not '
             'listed, as in [PLATFORM_MATRIX.md](PLATFORM_MATRIX.md). The evidence rows name, per platform, the newest G4 evidence run of '
             'each task that was recorded there (by the `platform_id` the recorder writes with `--platform`, or, for older evidence, by the '
             'GPU names of the run equalling those of exactly one record) and count the other tasks whose newest run was recorded there.', '']
    records = [load_json(path) for path in sorted((root / PLATFORMS).glob('*.json'), key=lambda p: p.name)]
    rows = []
    for record in records:
        gpus = '; '.join(f"{gpu['name']} (cc {gpu['compute_capability']}, {gpu['total_memory_bytes'] // 2**20} MiB)" for gpu in record['gpus']) or 'no CUDA device'
        rows.append([record['platform_id'], gpus, record.get('driver') or 'n/a', record.get('cuda_runtime') or 'n/a', record['torch'],
                     record.get('cupy') or 'absent', record['python'], record['os'], record['recorded_at']])
    lines += table(['Platform id', 'GPU', 'Driver', 'CUDA runtime', 'torch', 'CuPy', 'Python', 'OS', 'Recorded'], rows)
    lines.append('')
    assigned = {record['platform_id']: dict(g4=[], other=0) for record in records}
    unassigned = []
    for stage, task in all_tasks(gates):
        run_id, evidence = newest_run(root, task, runs_dir)
        if evidence is None:
            continue
        platform_id, how = platform_of(evidence, records)
        if platform_id is None:
            unassigned.append(task['id'])
        elif stage['id'] == 'G4':
            assigned[platform_id]['g4'].append(f"{task['id']} `{run_id}` ({how})")
        else:
            assigned[platform_id]['other'] += 1
    rows = [[platform_id, '; '.join(entry['g4']) or 'none', entry['other']] for platform_id, entry in assigned.items()]
    lines += table(['Platform id', 'G4 evidence runs recorded on this platform', 'Other tasks whose newest run was recorded here'], rows)
    lines += ['', 'Newest runs that match no platform record: ' + (', '.join(unassigned) if unassigned else 'none') + '.', '']
    return lines


def section_clean_install(path, record):
    lines = ['## Clean-install record', '']
    if record is None:
        return lines + ['No clean-install record exists under `docs/validation/clean_install/`.', '']
    wheel = record['wheel']
    lines += [f"Newest record `{path.name}` (kind `{record['kind']}`), taken at commit `{record['source_commit'][:12]}` on "
              f"{record['recorded_at']} with {len(record['dirty_paths'])} dirty packaging paths; all steps passed: {g(record['all_passed'])}.", '',
              f"Wheel `{wheel['name']}`, SHA-256 `{wheel['sha256']}`, {wheel['bytes']:,} bytes, {wheel['entries']} entries, "
              f"{wheel['package_files']} package files; browser assets match the committed ones: {g(wheel['web_assets_match_committed'])}; "
              f"frontend assets current: {g(wheel['frontend_assets_current'])}.", '']
    rows = []
    for name, env in record['environments'].items():
        pins = {line.split('==')[0].lower(): line.split('==')[1] for line in env['packages'] if '==' in line}
        rows.append([name, env['base_python'], pins.get('torch', 'absent'), pins.get('cupy-cuda12x', 'absent'), pins.get('numpy', 'absent'),
                     pins.get('torchfdtd', 'absent'), len(env['packages'])])
    lines += table(['Environment', 'Python', 'torch', 'cupy-cuda12x', 'numpy', 'torchfdtd', 'Packages'], rows)
    lines.append('')
    lines += table(['Step', 'Status', 'Seconds'], [[step['name'], step['status'], step['seconds']] for step in record['steps']])
    lines.append('')
    return lines


def section_suites():
    lines = ['## Suite policy', '',
             'The three suites declared in `scripts/run_suite.py` and applied by `tests/conftest.py` (a skip whose reason names CUDA, CuPy or a '
             'GPU fails under `--gpu-required` unless the test carries the `optional` marker).', '']
    rows = []
    for name, spec in suites.SUITES.items():
        rows.append([f'`{name}`', f"`-m \"{spec['marks']}\"`" if spec['marks'] else 'none (every test)', g(spec['gpu_required']),
                     g(spec['needs_cuda']), g(spec['hide_cuda']),
                     ', '.join(f'`{key}={value}`' for key, value in spec['environment'].items()) or 'inherited'])
    lines += table(['Suite', 'Marker expression', '`--gpu-required`', 'Needs CUDA', 'CUDA hidden', 'Environment'], rows)
    lines.append('')
    return lines


# --- physics headlines ---------------------------------------------------------------------------------------------------

def g3_record(root, name):
    path = root / G3_RECORDS / f'{name}.json'
    return load_json(path) if path.is_file() else None


def case_of(root, task_id):
    matches = sorted((root / CASES).glob(f'{task_id}_*.json'), key=lambda p: p.name) or sorted((root / CASES).glob(f'{task_id}.json'), key=lambda p: p.name)
    return load_json(matches[0]) if matches else None


def within(value, limit):
    return value is not None and limit is not None and value <= limit


def headline_g3_01(rec):
    eig = [v for k, v in rec['entries'].items() if k.startswith('eigenmode')]
    prop = [v for k, v in rec['entries'].items() if k.startswith('propagation')]
    residual, limit = max(v['residual'] for v in eig), max(v['limit_residual'] for v in eig if 'limit_residual' in v)
    phase, plimit = max(v['max_phase_residual_vs_yee'] for v in prop), max(v['limit_phase_residual_rad'] for v in prop)
    return (f'abs cos residual at most {g(limit)} (part A, {len(eig)} eigenmode entries); abs(k - k_Yee) D at most {g(plimit)} rad (part B, {len(prop)} runs)',
            f'{g(residual)}; {g(phase)} rad', within(residual, limit) and within(phase, plimit))


def headline_g3_02(rec):
    judged = [v for k, v in rec['entries'].items() if k.startswith('slab') and v.get('rt_limits_apply')]
    limits = judged[0]['limits']
    r, t, phase = (max(v[key] for v in judged) for key in ('R_abs_error', 'T_abs_error', 't_phase_error'))
    passed = sum(1 for v in judged if v['passed'])
    orders = [v for k, v in rec['entries'].items() if k.startswith('order')]
    return (f"abs dR, abs dT at most {g(limits['R'])}, {g(limits['T'])} and t phase at most {g(limits['t_phase'])} rad at 40 cells per material "
            f'wavelength ({len(judged)} instances); 20-cell over 40-cell error ratio between 3 and 5 ({len(orders)} pairs)',
            f'{g(r)}, {g(t)}, {g(phase)} rad; {passed} of {len(judged)} within limits', passed == len(judged) and within(r, limits['R']) and within(t, limits['T']) and within(phase, limits['t_phase']))


def headline_g3_03(rec):
    analytic = [v for k, v in rec['entries'].items() if k.startswith('analytic')]
    fitted = [v['fdtd_fitted_vs_tmm_analytic'] for k, v in rec['entries'].items() if k.startswith('fitted')]
    limits = analytic[0]['limits']
    worst = {key: max(v[key] for v in analytic + fitted) for key in ('R_abs_error', 'T_abs_error', 'A_abs_error', 't_phase_error')}
    ade = [v for k, v in rec['entries'].items() if k.startswith('ade')]
    ade_error = max(max(d['max_abs_n_error'], d['max_abs_k_error']) for v in ade for d in v['per_dt'].values())
    ade_limit = ade[0]['limits']['ade_constitutive_error_max']
    ok = all(within(worst[key], limits[short]) for key, short in (('R_abs_error', 'R'), ('T_abs_error', 'T'), ('A_abs_error', 'A'), ('t_phase_error', 't_phase')))
    return (f"abs dR, dT, dA at most {g(limits['R'])} and t phase at most {g(limits['t_phase'])} rad for {len(analytic)} analytic and "
            f'{len(fitted)} fitted slabs; ADE constitutive n, k error at most {g(ade_limit)}',
            f"{g(worst['R_abs_error'])}, {g(worst['T_abs_error'])}, {g(worst['A_abs_error'])}, {g(worst['t_phase_error'])} rad; ADE {g(ade_error)}",
            ok and within(ade_error, ade_limit))


def headline_g3_07(rec):
    entries = rec['entries']
    normal = [v for k, v in entries.items() if k.startswith('normal')]
    oblique = [v for k, v in entries.items() if k.startswith('oblique')]
    interface = list(entries['interface n=2 half space L10']['monitors'].values())
    stability = [v for k, v in entries.items() if k.startswith('stability') and v.get('decay_criterion_applies')]
    r_normal, l_normal = max(v['R_max_on_band'] for v in normal), max(v['limit'] for v in normal)
    r_oblique, l_oblique = max(v['R_max_on_band'] for v in oblique), max(v['limit'] for v in oblique)
    r_interface, l_interface = max(v['R_max_on_band'] for v in interface), entries['interface n=2 half space L10']['limit']
    decay, l_decay = max(v['energy_last_over_peak'] for v in stability), max(v['limits']['energy_last_over_peak_max'] for v in stability)
    ok = within(r_normal, l_normal) and within(r_oblique, l_oblique) and within(r_interface, l_interface) and within(decay, l_decay)
    return (f'reflected/incident power at most {g(l_normal)} at normal incidence, {g(l_oblique)} at the declared oblique angles and {g(l_interface)} '
            f'next to an n=2 interface; energy after 20,000 steps at most {g(l_decay)} of the peak',
            f'{g(r_normal)}, {g(r_oblique)}, {g(r_interface)}; {g(decay)}', ok)


def headline_g3_04(rec, case):
    limit = case['acceptance']['integrated_cross_section_relative_error']
    judged = {'cylinder TM': 'cylinder/TM/staircase/h=0.0125/cpu-float64', 'cylinder TE': 'cylinder/TE/staircase/h=0.0125/cpu-float64',
              'sphere': 'sphere/h=0.05/cpu-float64'}  # the meshes named in the case's judged_at
    values = {name: rec['rows'].get(key, {}).get('max_relative_error') for name, key in judged.items()}
    layer_a = max((v['layer_a_max_relative_difference'] for v in rec['rows'].values() if 'layer_a_max_relative_difference' in v), default=None)
    return (f'integrated cross-section relative error at most {g(limit)} at the judged meshes (cylinder h = 0.0125 um TM and TE, sphere h = 0.05 um), CPU FP64',
            '; '.join(f'{name} {g(value)}' for name, value in values.items()) + f'; CUDA FP32 layer A max relative difference {g(layer_a)}',
            all(within(value, limit) for value in values.values()))


def headline_g3_05(rec, case):
    budgets = case['acceptance']['per_radius']
    parts, ok = [], True
    for radius, budget in budgets.items():
        row = rec['rows'].get(f'r={radius}/h=0.005/cpu-float64', {})
        sca, absn = row.get('max_scattering_relative_error'), row.get('max_absorption_relative_error')
        ok = ok and within(sca, budget['scattering_relative_error']) and within(absn, budget['absorption_relative_error'])
        parts.append(f'r = {radius} um: scattering {g(sca)} (budget {g(budget["scattering_relative_error"])}), absorption {g(absn)} (budget {g(budget["absorption_relative_error"])})')
    return ("scattering and absorption relative error at h = 0.005 um, CPU FP64, within the case's per-radius budgets", '; '.join(parts), ok)


def headline_g3_08(rec, case):
    acceptance = case['acceptance']
    # The case's judged_at: subpixel interface, h = 0.005 um, 300 fs, CUDA FP32; the other rows are recorded, not judged.
    judged = {k: v for k, v in rec['rows'].items() if not k.startswith('empty/') and 'judged_against_torcwa' not in v
              and v.get('interface') == 'subpixel' and v.get('mesh_um') == 0.005 and v.get('backend') == 'cuda'}
    efficiency = max(v['max_efficiency_error'] for v in judged.values())
    phase = max(v['max_dominant_phase_error_rad'] for v in judged.values())
    layer_rows = {k: v for k, v in rec['rows'].items() if 'layer_a_max_relative_difference' in v}
    layer_a = max(v['layer_a_max_relative_difference'] for v in layer_rows.values())
    layer_limit = max(v['layer_a_rtol'] for v in layer_rows.values())
    ok = within(efficiency, acceptance['efficiency_absolute_error']) and within(phase, acceptance['dominant_order_phase_error_rad']) and within(layer_a, layer_limit)
    return (f"diffraction efficiency error at most {g(acceptance['efficiency_absolute_error'])} and dominant-order phase error at most "
            f"{g(acceptance['dominant_order_phase_error_rad'])} rad against TORCWA at 640 harmonics ({len(judged)} judged configurations); "
            f'CUDA FP32 layer A relative difference at most {g(layer_limit)}',
            f'{g(efficiency)}; {g(phase)} rad; layer A {g(layer_a)} ({len(layer_rows)} rows)', ok)


def headline_g3_13(rec):
    verdicts = {k.split('/')[1]: v for k, v in rec['rows'].items() if k.startswith('verdict/')}
    parts = [f"{pol}: staircase {g(v['staircase_max_relative_error'])}, subpixel {g(v['subpixel_max_relative_error'])}" for pol, v in verdicts.items()]
    return ('subpixel max relative error below the staircase error at h = 0.05 um for TM and TE (the mesh sequence, shifts and smoothing widths are reported only)',
            '; '.join(parts), all(v['subpixel_at_h_beats_staircase_at_h'] for v in verdicts.values()))


def physics_line(root, task, runs_dir):
    """(case, record, criterion, measured, verdict) for one G3 task."""
    case = case_of(root, task['id'])
    name = 'G3-02r2' if task['id'] == 'G3-02' else task['id']
    rec = g3_record(root, name)
    if rec is not None and task['id'] == 'G3-02':
        case = case_of(root, 'G3-02r2')
    handlers = {'G3-01': lambda: headline_g3_01(rec), 'G3-02': lambda: headline_g3_02(rec), 'G3-03': lambda: headline_g3_03(rec),
                'G3-07': lambda: headline_g3_07(rec), 'G3-04': lambda: headline_g3_04(rec, case), 'G3-05': lambda: headline_g3_05(rec, case),
                'G3-08': lambda: headline_g3_08(rec, case), 'G3-13': lambda: headline_g3_13(rec)}
    if rec is not None and task['id'] in handlers:
        criterion, measured, ok = handlers[task['id']]()
        return case, f'`{name}.json`', criterion, measured, 'pass' if ok else '**FAIL**'
    run_id, evidence = newest_run(root, task, runs_dir)
    if evidence is None:
        return case, 'none', 'the assertions of the required tests', 'no evidence run', display_state(task)
    results = evidence['test_results']
    measured = f"{len(results['passed'])} passed, {len(results['failed'])} failed, {len(results['skipped'])} skipped in `{run_id}`"
    if results['failed']:
        measured += '; ' + '; '.join(cell(results['failure_messages'].get(test, test).splitlines()[0]) for test in results['failed'][:3])
    return case, 'none (the test assertions are the record)', 'the pass/fail assertions of the required tests', measured, display_state(task)


def section_physics(root, gates, runs_dir):
    lines = ['## Physics validation (stage G3)', '',
             'One line per G3 task. Where `docs/validation/g3/<task>.json` exists, the criterion and the measured value are read from that record '
             '(limits from the record or from the pre-declared case under `docs/validation/cases/`) and the verdict is the comparison of the two; '
             'the full tables are in [PHYSICS_VALIDATION.md](PHYSICS_VALIDATION.md). Otherwise the newest evidence run supplies the test counts. '
             'A **FAIL** is a finding against a pre-declared limit and stays in the report.', '']
    stage = next(stage for stage in gates['stages'] if stage['id'] == 'G3')
    rows = []
    for task in stage['tasks']:
        case, record, criterion, measured, verdict = physics_line(root, task, runs_dir)
        rows.append([task['id'], cell(case['title']) if case else cell(task['title']), record, cell(criterion), cell(measured), verdict])
    lines += table(['Task', 'Case', 'Record', 'Headline criterion', 'Measured', 'Verdict'], rows)
    lines.append('')
    return lines


def section_comparisons(root):
    lines = ['## Cross-solver and Meep comparison headlines', '']
    record = load_json(root / CROSS_SOLVER)
    lines += [f"Same-hardware comparison of {record['date']} on {record['hardware']['gpu']} / {record['hardware']['cpu']} "
              f"([CROSS_SOLVER_COMPARISON.md](CROSS_SOLVER_COMPARISON.md), record `{CROSS_SOLVER.name}`, drivers at worktree "
              f"`{record['worktree_head_at_run'][:12]}`).", '']
    rows = []
    for solver, entry in record['slab']['solvers'].items():
        sphere = record['sphere']['solvers'].get(solver, {})
        rows.append([solver, g(entry['max_T_absolute_error']), g(entry['max_R_absolute_error']), g(entry['max_energy_residual']),
                     g(sphere.get('max_relative_error'))])
    lines += table(['Solver', 'Slab max abs T error', 'Slab max abs R error', 'Slab max abs R+T-1', 'Mie sphere max relative error'], rows)
    lines.append('')
    rows = []
    for case in ('sphere-64', 'sphere-96'):
        solvers = record['throughput']['cases'][case]['solvers']
        reference = solvers['torchfdtd']['median_wall_seconds']
        rows.append([case, g(reference), *[f"{g(solvers[s]['median_wall_seconds'])} ({solvers[s]['median_wall_seconds'] / reference:.1f}x)"
                                             for s in ('fdtdx', 'meep')]])
    lines += table(['Throughput case', 'TorchFDTD median wall (s)', 'FDTDX (ratio)', 'Meep 12 ranks (ratio)'], rows)
    lines.append('')
    adjoint = record['adjoint']['solvers']
    reference = adjoint['torchfdtd_checkpointed']['median_wall_seconds']
    rows = []
    for key in ('fdtdx_checkpointed', 'fdtdx_reversible'):
        pair = record['adjoint']['pairwise'][f'torchfdtd_checkpointed_vs_{key}']
        rows.append([key, g(adjoint[key]['median_wall_seconds']), f"{adjoint[key]['median_wall_seconds'] / reference:.1f}x",
                     g(pair['gradient_relative_l2']), g(pair['loss_relative_difference'])])
    lines += table(['Adjoint solver', 'Median wall (s)', 'Ratio to TorchFDTD checkpointed', 'Gradient relative L2 vs TorchFDTD', 'Loss relative difference'], rows)
    lines += ['', 'Worked comparisons with Meep from the records under `docs/validation/meep_comparison/` '
              '([MEEP_COMPARISON.md](MEEP_COMPARISON.md)):', '']
    rows = []
    for section in meep.build(meep.load_records()):
        timing = section['timing']
        rows.append([cell(section['readme_device']), f"{timing['cells']:,} x {timing['steps']:,}", cell(section['headline']),
                     f"{section['criteria_passed']}/{section['criteria_total']}" + ('' if section['all_passed'] else ' **FAIL**'),
                     g(timing['t_step']), f"{g(timing['m_step'])} ({timing['ranks']} ranks, {timing['m_mode']})", f"{timing['ratio']:.1f}"])
    lines += table(['Device', 'Cells x steps', 'Agreement', 'Criteria passed', 'TorchFDTD stepping (s)', 'Meep stepping (s)', 'Ratio'], rows)
    lines.append('')
    return lines


def section_warnings(gates, verdicts):
    lines = ['## Evidence warnings', '',
             'Every warning the judge attaches to a task; a warning never passes or fails a task by itself. The kinds: a run that started '
             'before its source commit was made (the tests ran on a tree that is not that commit), a case file first committed with or after '
             'its evidence (declaration order not verified), evidence recorded on a dirty tree, a file-level required test recorded before '
             'the recorder enumerated such files, and a scope change awaiting the owner (listed again below).', '']
    rows = [[task['id'], cell(warning)] for _, task in all_tasks(gates) for warning in verdicts[task['id']][2]]
    if rows:
        lines += table(['Task', 'Warning'], rows)
    else:
        lines.append('No warnings.')
    lines.append('')
    return lines


def declared_scope_changes(root, gates):
    """Task id -> (declarations, approval) for every task whose case files declare a scope change, approved or not."""
    out = {}
    for _, task in all_tasks(gates):
        reasons = judge.scope_change_reasons(root, gates, dict(task, scope_change_approval=None))
        if reasons:
            out[task['id']] = (reasons, task.get('scope_change_approval'))
    return out


def approval_cell(approval):
    if isinstance(approval, dict):
        return cell(f"{approval.get('decision', 'approved')} by {approval.get('approved_by', 'owner')} on {approval.get('date', 'an unrecorded date')}")
    return cell(str(approval))


def section_pending_approvals(root, gates):
    lines = ['## Pending owner approvals', '',
             'Tasks whose case files declare a scope change (a revised case, or a limit looser than the program thresholds of the gate '
             'file) while `scope_change_approval` is still null. Section 0 of the program requires the owner\'s recorded approval for such '
             'changes; nothing here grants it, and the tasks keep their recorded states until it is given.', '']
    pending = judge.pending_scope_changes(root, gates)
    if pending:
        lines += table(['Task', 'Declared change'], [[task_id, cell('; '.join(reasons))] for task_id, reasons in pending.items()])
    else:
        lines.append('None: every declared scope change carries an approval.')
    approved = {task_id: entry for task_id, entry in declared_scope_changes(root, gates).items() if entry[1]}
    if approved:
        lines += ['', '### Approved scope changes', '',
                  'Declared scope changes with the owner\'s recorded approval (`scope_change_approval` in the gate file). An approval accepts '
                  'the declared limits of that task; it does not change the program thresholds.', '']
        lines += table(['Task', 'Declared change', 'Approval'],
                       [[task_id, cell('; '.join(reasons)), approval_cell(approval)] for task_id, (reasons, approval) in approved.items()])
    lines.append('')
    return lines


def section_limitations(root):
    lines = ['## Known limitations', '',
             f'From [validation/known_limitations.json](validation/known_limitations.json); each entry names the record or document it comes from.', '']
    rows = []
    for entry in load_json(root / LIMITATIONS)['limitations']:
        rows.append([entry['id'], cell(entry['statement']), entry['status'], ', '.join(entry.get('tasks') or []) or 'none',
                     ', '.join(f'`{source}`' for source in entry['sources'])])
    lines += table(['Id', 'Limitation', 'Status', 'Gate tasks', 'Sources'], rows)
    lines.append('')
    return lines


# --- consistency ---------------------------------------------------------------------------------------------------------

def readme_checks(root):
    """Call every test function of tests/test_readme_measurements.py; (name, ok, detail) each."""
    module = load_script('test_readme_measurements', root / 'tests')
    results = []
    for name in sorted(dir(module)):
        if name.startswith('test_') and callable(getattr(module, name)):
            try:
                getattr(module, name)()
                results.append((name, True, 'reproduced from its record'))
            except AssertionError as error:
                results.append((name, False, str(error).splitlines()[0] if str(error) else 'assertion failed'))
            except Exception as error:  # noqa: BLE001 - a missing record is a finding, not a crash of the report
                results.append((name, False, f'{type(error).__name__}: {error}'))
    return results


def provenance_check(root):
    """(ok, detail): the committed SBOM's own summary plus the verdict of scripts/provenance_inventory.py --check.

    The detail is rendered from the committed record, never from the local closure, so the line is the same on every
    platform that passes the check; the scanned-file count stays out because every evidence commit changes it.
    """
    sbom = load_json(root / 'docs' / 'validation' / 'sbom.json')
    summary = sbom.get('summary') or dict(components=len(sbom['components']), installed=sum(c['installed'] for c in sbom['components']),
                                          open_items=len(sbom['open_items']), scan_findings=len(sbom['scan']['findings']))
    recorded = f"{sbom['python']['platform']}, Python {sbom['python']['version']}" + (f", {sbom['host']['platform']}" if sbom.get('host') else '')
    detail = (f"committed SBOM taken on {recorded}: {summary['components']} components ({summary['installed']} installed there), "
              f"{summary['open_items']} open items, {summary['scan_findings']} scan findings")
    completed = subprocess.run([sys.executable, str(root / 'scripts' / 'provenance_inventory.py'), '--check'], cwd=str(root),
                               capture_output=True, text=True, encoding='utf-8', errors='replace')
    verdict = None
    for line_number, line in reversed(list(enumerate(completed.stdout.splitlines()))):
        if line.strip() == '{':  # the summary object starts on its own line; nested objects never do at column 0
            try:
                verdict = json.loads('\n'.join(completed.stdout.splitlines()[line_number:]))
                break
            except ValueError:
                continue
    if verdict is None:
        return False, detail + f'; check: provenance_inventory.py --check exit {completed.returncode} without a summary: {cell(completed.stdout[-200:])}'
    if verdict.get('closure_difference'):
        # Printed for the person running the build; it depends on this host's wheels, so it never enters the report text.
        print('provenance check on another platform than the record; closure difference (information, not judged): '
              + json.dumps(verdict['closure_difference'], ensure_ascii=False))
    if verdict['problems'] or completed.returncode != 0:
        return False, detail + '; check: problems: ' + '; '.join(verdict['problems'] or [f'exit {completed.returncode}'])
    return True, detail + '; check: passed against the tracked tree'


def consistency_checks(root, versions, wheel_name, scope_ok, scope_cells):
    checks = []
    wheel = wheel_version(wheel_name)
    same = versions['pyproject'] and versions['pyproject'] == versions['compatibility'] == versions['changelog'] == wheel
    checks.append(('package version', same, f"pyproject.toml {versions['pyproject']}, COMPATIBILITY.md {versions['compatibility']}, "
                                             f"CHANGELOG.md {versions['changelog']}, clean-install wheel {wheel}"))
    for name, ok, detail in readme_checks(root):
        checks.append((f'README row check `{name}`', ok, detail))
    records = meep.load_records()
    readme = (root / 'README.md').read_bytes().decode('utf-8')
    block = readme[readme.index(meep.START):readme.index(meep.END) + len(meep.END)] if meep.START in readme and meep.END in readme else ''
    checks.append(('README "Compared with Meep" block', block == meep.render_readme_block(records), 'equals the renderer output for the committed records'))
    doc = (root / 'docs' / 'MEEP_COMPARISON.md').read_bytes().decode('utf-8')
    checks.append(('MEEP_COMPARISON.md', doc == meep.render_doc(records), 'equals the renderer output for the committed records'))
    checks.append(('third-party notices and SBOM', *provenance_check(root)))
    checks.append(('RELEASE_SCOPE.md support claims', scope_ok,
                   f'{scope_cells} verification cells and the stage-status block rendered from the gate file'))
    return checks


def section_consistency(checks):
    lines = ['## Consistency', '',
             'Each check compares two sources of the same fact; a MISMATCH is reported here and makes the build exit nonzero.', '']
    rows = [[cell(name), 'ok' if ok else '**MISMATCH**', cell(detail)] for name, ok, detail in checks]
    lines += table(['Check', 'Result', 'Detail'], rows)
    mismatches = sum(1 for _, ok, _ in checks if not ok)
    lines += ['', f'{len(checks)} checks, {mismatches} mismatch(es).', '']
    return lines


# --- driver ------------------------------------------------------------------------------------------------------------

def render(root, provisional=False, dirty=(), check_scope=False):
    """Render everything; returns dict(report, scope, scope_changed, checks)."""
    gates = load_json(root / GATE_FILE)
    runs_dir = root / RUNS_DIR
    versions = version_strings(root)
    clean_path, clean = clean_install_record(root)
    verdicts = judge_all(root, gates, runs_dir)
    scope_before = (root / SCOPE).read_bytes().decode('utf-8')
    scope_after, scope_cells = render_scope(scope_before, gates, verdicts)
    scope_changed = scope_after != scope_before
    scope_ok = not scope_changed if check_scope else True
    checks = consistency_checks(root, versions, clean['wheel']['name'] if clean else None, scope_ok, scope_cells)
    lines = []
    lines += section_header(root, gates, runs_dir, versions, provisional, dirty)
    lines += section_judgement(gates, verdicts)
    lines += section_gates(root, gates, runs_dir, verdicts)
    lines += section_platforms(root, gates, runs_dir)
    lines += section_clean_install(clean_path, clean)
    lines += section_suites()
    lines += section_physics(root, gates, runs_dir)
    lines += section_comparisons(root)
    lines += section_limitations(root)
    lines += section_warnings(gates, verdicts)
    lines += section_pending_approvals(root, gates)
    forbidden = [line for line in lines if FORBIDDEN_WORDS.search(line)]
    checks.append(('attestation wording', not forbidden, 'no line uses the words that tests/test_validation_report.py forbids'
                   if not forbidden else 'found in: ' + cell(forbidden[0][:120])))
    lines += section_consistency(checks)
    report = '\n'.join(lines).rstrip('\n') + '\n'
    return dict(report=report, scope=scope_after, scope_changed=scope_changed, checks=checks, scope_cells=scope_cells)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--check', action='store_true', help='write nothing; compare with the committed documents and exit 1 on a difference')
    parser.add_argument('--allow-dirty', action='store_true', help='render on a dirty tree; the report is marked PROVISIONAL')
    parser.add_argument('--output', default=None, help='report path (default docs/VALIDATION_REPORT.md; the scope document is still rewritten in place)')
    parser.add_argument('--root', default=None, help='repository root (default: the checkout containing this script)')
    args = parser.parse_args(argv)
    root = Path(args.root).resolve() if args.root else ROOT
    output = Path(args.output).resolve() if args.output else root / REPORT

    excluded = [GATE_FILE.as_posix(), RUNS_DIR.as_posix(), REPORT.as_posix(), SCOPE.as_posix()]
    dirty = recorder.dirty_source_manifest(root, excluded)
    if dirty and not args.allow_dirty and not args.check:
        print('the tree is dirty; the report must be rendered from one commit (use --allow-dirty for a provisional render):')
        for entry in dirty:
            print(f"  {entry['status']} {entry['path']}")
        return 2
    rendered = render(root, provisional=bool(dirty) and args.allow_dirty, dirty=dirty, check_scope=args.check)
    mismatches = [name for name, ok, _ in rendered['checks'] if not ok]
    for name, ok, detail in rendered['checks']:
        print(f"{'ok      ' if ok else 'MISMATCH'} {name}: {detail}")
    if args.check:
        committed = (root / REPORT).read_bytes().decode('utf-8') if (root / REPORT).is_file() else ''
        same_report = committed == rendered['report']
        print(f"report {'matches' if same_report else 'DIFFERS from'} {REPORT.as_posix()}; "
              f"scope document {'matches' if not rendered['scope_changed'] else 'DIFFERS from'} its regenerated form")
        return 0 if same_report and not rendered['scope_changed'] and not mismatches else 1
    (root / SCOPE).write_bytes(rendered['scope'].encode('utf-8'))
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(rendered['report'].encode('utf-8'))
    print(f"wrote {output} and {'regenerated' if rendered['scope_changed'] else 'kept'} {SCOPE.as_posix()} ({rendered['scope_cells']} cells)")
    return 1 if mismatches else 0


if __name__ == '__main__':
    sys.exit(main())
