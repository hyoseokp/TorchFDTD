"""Inventory the provenance of the distributed tree: pip runtime closure, bundled
assets, open licence questions, a private-data scan and a dependency check.

    python scripts/provenance_inventory.py            regenerate docs/THIRD_PARTY_NOTICES.md and docs/validation/sbom.json
    python scripts/provenance_inventory.py --check    exit 1 when the committed outputs are stale, the scan finds something
                                                      or pip check reports a broken requirement
    python scripts/provenance_inventory.py --audit    also run pip-audit on the runtime closure and record the result

The pip rows come from the metadata of the interpreter that runs this script;
the non-pip rows are the hand-maintained tables below. The SBOM records the
platform and interpreter it was taken on. ``--check`` on that platform compares
the whole stable record; on another platform (a Linux CI job against a Windows
record, say) it judges only the tracked-tree scan findings, the non-pip asset
table, the dependency specifiers declared in pyproject.toml and that every
runtime component of the record is installed here or accounted for in the
closure difference. Licence strings, versions, group membership and extra
components differ between wheel builds, so they are reported in the
``closure_difference`` block as information, never judged there. Nothing here is a legal opinion: an item whose
licence or distribution right is not settled is listed under open items with
BLOCKED_EXTERNAL semantics, never omitted. This is the G9-02 tool.
"""
import argparse
import datetime
import hashlib
import json
import os
import platform
import re
import subprocess
import sys
from importlib.metadata import PackageNotFoundError, distribution
from pathlib import Path

try:
    import tomllib
except ImportError:
    import tomli as tomllib
from packaging.markers import default_environment
from packaging.requirements import Requirement
from packaging.utils import canonicalize_name

ROOT = Path(__file__).resolve().parents[1]
NOTICES = ROOT / 'docs' / 'THIRD_PARTY_NOTICES.md'
SBOM = ROOT / 'docs' / 'validation' / 'sbom.json'
GROUPS = ['runtime', 'gds', 'hdf5', 'cuda-kernels', 'dev', 'benchmark']

# Non-pip material in the tracked tree and in the wheel. status is 'cleared'
# when the licence and the right to redistribute are documented, 'own' for the
# project's own work, and 'open' for an item that needs an owner or expert
# decision (BLOCKED_EXTERNAL, G9-03).
ASSETS = [
    dict(name='three.js', version='0.180.0 (r180)', license='MIT', status='cleared',
         source='https://github.com/mrdoob/three.js', paths=['torchfdtd/web/assets/index-*.js'],
         notes='Bundled by the Vite build into the workbench script; the notice is kept in THIRD_PARTY_NOTICES.txt and shipped in the wheel.'),
    dict(name='lucide', version='0.468.0', license='ISC', status='cleared',
         source='https://github.com/lucide-icons/lucide', paths=['torchfdtd/web/assets/index-*.js'],
         notes='Icon set bundled into the same script; its licence header survives minification and the notice is in THIRD_PARTY_NOTICES.txt.'),
    dict(name='vite', version='6.4.3', license='MIT', status='cleared',
         source='https://github.com/vitejs/vite', paths=['vite.config.js', 'package.json'],
         notes='Build tool. Only its module-preload helper (a few lines) ends up in the bundle; the tool itself is not distributed.'),
    dict(name='@playwright/test', version='1.63.0', license='Apache-2.0', status='cleared',
         source='https://github.com/microsoft/playwright', paths=['playwright.config.js', 'tests/ui/*.spec.js'],
         notes='Browser test runner for development only; not part of the wheel.'),
    dict(name='Workbench fonts', version=None, license='not applicable', status='cleared',
         source=None, paths=['torchfdtd/web/assets/index-*.css'],
         notes='No font file is bundled. The stylesheet names system fonts (Inter, Segoe UI, Consolas) with generic fallbacks and loads nothing from the network.'),
    dict(name='Material tables', version=None, license='not applicable', status='cleared',
         source=None, paths=['torchfdtd/models.py', 'torchfdtd/materials.py', 'torchfdtd/material_fit.py'],
         notes='No optical-constant database is bundled. The default materials are constant-index placeholders named as such; dispersive poles are fitted from data the user pastes at run time.'),
    dict(name='Hero artwork', version=None, license='MIT (project licence)', status='own',
         source='docs/assets/hero-provenance.json', paths=['docs/assets/hero.png', 'README.md'],
         notes='Rendered from a native computed field; the provenance file records the project and the script.'),
    dict(name='Manuscript and figures', version=None, license='MIT (project licence)', status='own',
         source='docs/paper/asset-provenance.json', paths=['docs/paper/**'],
         notes='Figures are built from the native validation records listed in the provenance file; the bibliography cites third-party work without reproducing it.'),
    dict(name='Native validation records', version=None, license='MIT (project licence)', status='own',
         source='docs/validation/README.md', paths=['docs/validation/*.json', 'docs/validation/*.png', 'docs/validation/runs/**'],
         notes='Measurements of this solver. The JUnit copies under runs/ keep the recording machine name in their hostname attribute, as docs/validation/runs/README.md states.'),
    dict(name='Reference outputs of other open-source solvers', version=None, license='not applicable (numerical output; the tools are not bundled)', status='own',
         source='flaport/fdtd (MIT), FDTDX (MIT), TORCWA (GitHub kch3782/torcwa)',
         paths=['docs/validation/open-source-flaport.json', 'docs/validation/fdtdx_*.json', 'docs/validation/cr-full-torcwa-*.json'],
         notes='Comparison numbers produced by running those tools on synthetic fixtures; no source code of theirs is included.'),
    dict(name='Colour-router application records', version=None, license='MIT (project licence)', status='own',
         source=None, paths=['docs/validation/cr-*.json'],
         notes='The author\'s own research fixtures and native results, published with the repository on 2026-09-21. New application runs are outside the completion program.'),
    dict(name='Examples and test fixtures', version=None, license='MIT (project licence)', status='own',
         source=None, paths=['examples/*.json', 'tests/**'],
         notes='Synthetic projects and GDS layouts generated by the tests themselves; no binary fixture is tracked.'),
    dict(name='Installed-API property catalogue', version='collected 2026-09-18', license='unclear', status='open',
         source='names queried from a locally installed vendor API',
         paths=['docs/validation/installed-property-catalog.json', 'torchfdtd/feature_inventory.json', 'benchmarks/build_feature_inventory.py'],
         notes='Object and property names of a commercial solver, turned into the feature inventory that the wheel ships and /api/capabilities serves. The permitted use of this extraction is an unresolved decision.'),
    dict(name='FSP layout support', version=None, license='unclear', status='open',
         source='independently observed file layout, docs/FSP_BINARY.md',
         paths=['torchfdtd/fsp_binary.py', 'torchfdtd/fsp_native.py', 'torchfdtd/fsp_geometry.py', 'torchfdtd/fsp_objects.py',
                'torchfdtd/fsp_instruments.py', 'torchfdtd/fsp_settings.py', 'torchfdtd/fsp_service.py', 'docs/FSP*.md'],
         notes='Reader and writer of a documented subset of a vendor project format. The contract and interoperability question stays open.'),
]

# The Hangul account name is spelled with escapes so this file never carries it verbatim.
_HANGUL_USER = '\\uc5f0\\uad6c\\uc2e4'
_PRIVATE_USER = r'(?:admin|' + _HANGUL_USER + r')\b'
_SEP = r'(?:[\\/]|\\\\)+'
SCAN_PATTERNS = {
    'private_windows_user_path': r'(?i)[A-Z]:' + _SEP + 'Users' + _SEP + _PRIVATE_USER,
    # Without a drive letter, not the tail of a drive or UNC path already matched by the rules above and below.
    'private_driveless_user_path': r'(?i)(?<![A-Za-z0-9:$\\])\\+Users\\+' + _PRIVATE_USER,
    # UNC administrative share (server, drive$), also with doubled JSON-escaped backslashes.
    'private_unc_user_path': r'(?i)\\{2,}[^\\/\s]+\\+[a-z]\$\\+Users\\+' + _PRIVATE_USER,
    # macOS home directories of the lab accounts; with a drive-letter prefix it is the Windows form above.
    'private_macos_user_path': r'(?<!:)/Users/(?:bot_s|admin|' + _HANGUL_USER + r')\b',
    'hangul_user_path': r'Users' + _SEP + _HANGUL_USER,
    'address_100_x_x_x': r'\b100\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
    'password_literal': r'(?i)\b(?:password|passwd)\s*[:=]\s*["\'][^"\'\s]{3,}["\']',
    'ssh_password_environment': r'TORCHFDTD_SSH_PASSWORD\s*=\s*["\'][^"\']{2,}["\']',
    'credential_token': r'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{32,}|xox[abp]-[A-Za-z0-9-]{10,}|tskey-[A-Za-z0-9-]{10,})\b',
    'private_key_block': r'-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----',
    'ssh_public_key': r'\bssh-(?:rsa|ed25519|dss) AAAA[0-9A-Za-z+/]{20,}',
}
HISTORY_PATTERN = r'C:[/\\]+Users[/\\]+admin'
SCAN_EXCLUDED = ['scripts/provenance_inventory.py', 'docs/THIRD_PARTY_NOTICES.md', 'docs/validation/sbom.json',
                 'tests/test_provenance_inventory.py']
BINARY_SUFFIXES = {'.png', '.pdf', '.zip', '.whl', '.pyc', '.jpg', '.ico', '.gds', '.npz', '.npy', '.woff', '.woff2', '.ttf'}
STABLE_SECTIONS = ['project', 'components', 'assets', 'open_items', 'history_note']


def git(*args):
    return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, check=True).stdout.decode('utf-8', 'replace')


def tracked_paths():
    return [p for p in git('ls-files', '-z').split('\0') if p]


def license_of(metadata):
    """(label, classifiers): the SPDX expression when declared, else the trove classifiers, else a short License field."""
    expression = metadata.get('License-Expression')
    label = (metadata.get('License') or '').strip()
    classifiers = [c for c in metadata.get_all('Classifier', []) if c.startswith('License ::')]
    if expression:
        return expression, classifiers
    if classifiers:
        return ' / '.join(c.split('::')[-1].strip() for c in classifiers), classifiers
    if label and label.upper() != 'UNKNOWN' and len(label.splitlines()) == 1 and len(label) <= 80:
        return label, classifiers
    return None, classifiers


def source_of(metadata):
    urls = {}
    for entry in metadata.get_all('Project-URL', []):
        key, _, value = entry.partition(',')
        urls[key.strip().lower()] = value.strip()
    for key in ('source', 'source code', 'repository', 'code', 'homepage', 'home'):
        if key in urls:
            return urls[key]
    return metadata.get('Home-page') or next(iter(urls.values()), None)


def runtime_closure(pyproject):
    """Installed distributions reachable from the declared dependencies, by dependency group."""
    roots = {'runtime': list(pyproject['project']['dependencies'])}
    roots.update({group: list(specs) for group, specs in pyproject['project'].get('optional-dependencies', {}).items()})
    environment = default_environment()
    components = {}

    def visit(spec, group, parent):
        requirement = Requirement(spec)
        name = canonicalize_name(requirement.name)
        record = components.setdefault(name, dict(name=name, groups=[], required_by=[], specifiers=[]))
        if group not in record['groups']:
            record['groups'].append(group)
        if parent and parent not in record['required_by']:
            record['required_by'].append(parent)
        if str(requirement.specifier) and str(requirement.specifier) not in record['specifiers']:
            record['specifiers'].append(str(requirement.specifier))
        if 'version' in record:
            return
        try:
            dist = distribution(requirement.name)
        except PackageNotFoundError:
            record.update(version=None, installed=False, license=None, license_classifiers=[], license_files=[], source_url=None)
            return
        metadata = dist.metadata
        label, classifiers = license_of(metadata)
        record.update(version=dist.version, installed=True, license=label, license_classifiers=classifiers,
                      license_files=sorted({Path(str(p)).name for p in dist.files or [] if 'licen' in str(p).lower() and 'dist-info' in str(p)}),
                      source_url=source_of(metadata))
        wanted = set(requirement.extras)
        for child in metadata.get_all('Requires-Dist', []) or []:
            child_requirement = Requirement(child)
            marker = child_requirement.marker
            if marker is None:
                applies = True
            else:
                applies = any(marker.evaluate({**environment, 'extra': extra}) for extra in (wanted or {''}))
            if applies:
                visit(child, group, name)

    for group in GROUPS:
        for spec in roots.get(group, []):
            visit(spec, group, None)
    ordered = []
    for name in sorted(components):
        record = components[name]
        record['groups'] = [g for g in GROUPS if g in record['groups']]
        record['required_by'] = sorted(record['required_by'])
        ordered.append(record)
    return ordered


def _json_unescaped(text):
    """JSON \\uXXXX escapes decoded: json.dumps writes non-ASCII path characters this way unless ensure_ascii=False."""
    def decode(match):
        try:
            return json.loads('"' + match.group(0) + '"')
        except ValueError:
            return match.group(0)
    return re.sub(r'(?:\\u[0-9A-Fa-f]{4})+', decode, text)


def _percent_decoded(text):
    """Percent-encoded UTF-8 decoded (URL and file-URI paths); line breaks stay encoded so line numbers hold."""
    def decode(match):
        raw = bytes.fromhex(match.group(0).replace('%', ''))
        return raw.decode('utf-8', 'replace').replace('\n', '%0A').replace('\r', '%0D')
    return re.sub(r'(?:%[0-9A-Fa-f]{2})+', decode, text)


def scan_text(text):
    """Every pattern match in the text as written and in its JSON-unescaped and percent-decoded forms; positions only."""
    findings, seen = [], set()
    views = [('verbatim', text)]
    for encoding, decode in (('json_escaped', _json_unescaped), ('percent_encoded', _percent_decoded)):
        view = decode(text)
        if view != text:
            views.append((encoding, view))
    for encoding, view in views:
        for kind, pattern in SCAN_PATTERNS.items():
            for match in re.finditer(pattern, view):
                line = view[:match.start()].count('\n') + 1
                if (kind, line) not in seen:
                    seen.add((kind, line))
                    findings.append(dict(kind=kind, line=line, encoding=encoding))
    return findings


def scan_tree(paths):
    """Match the credential and private-path patterns in every tracked text file; report positions only."""
    findings, scanned = [], 0
    for relative in paths:
        if relative in SCAN_EXCLUDED or Path(relative).suffix.lower() in BINARY_SUFFIXES:
            continue
        data = (ROOT / relative).read_bytes()
        if b'\0' in data[:8192]:
            continue
        text = data.decode('utf-8', 'replace')
        scanned += 1
        findings.extend(dict(file=relative, **finding) for finding in scan_text(text))
    return scanned, findings


def history_note():
    """Commits whose tree still contains the historic workstation path, from the pickaxe of the current branch."""
    listing = git('log', '--format=%H\t%as\t%s', '--pickaxe-regex', f'-S{HISTORY_PATTERN}', 'HEAD')
    commits = []
    for line in listing.splitlines():
        commit, date, subject = line.split('\t', 2)
        pathspec = ['.'] + [':!' + path for path in SCAN_EXCLUDED]
        present = subprocess.run(['git', 'grep', '-q', '-I', '-E', HISTORY_PATTERN, commit, '--', *pathspec], cwd=ROOT, capture_output=True).returncode == 0
        if present:
            commits.append(dict(commit=commit[:12], date=date, subject=subject))
    return dict(pattern=HISTORY_PATTERN, commits=commits,
                note='The path was the scratch directory of the remote workstation, recorded by three beyond-VRAM records and by early scripts. The current tree carries a redacted placeholder in the records. The listed commits are those at which occurrences were added or changed; the string is present in every commit from the first listed one up to the redaction, and stays in the public history as a known fact, not as a finding.')


def pip_check():
    result = subprocess.run([sys.executable, '-m', 'pip', 'check'], cwd=ROOT, capture_output=True, text=True)
    lines = [line for line in result.stdout.splitlines() if not line.startswith('WARNING: Ignoring invalid distribution')]
    return dict(tool='pip check', exit_code=result.returncode, output='\n'.join(lines).strip())


def pip_audit(components):
    """Audit the pinned runtime closure with pip-audit; the advisory database needs the network."""
    requirements = ROOT / '.local' / 'tmp' / 'provenance-requirements.txt'
    requirements.parent.mkdir(parents=True, exist_ok=True)
    requirements.write_text(''.join(f"{c['name']}=={c['version']}\n" for c in components if c['installed']), encoding='utf-8')
    try:
        version = subprocess.run([sys.executable, '-m', 'pip_audit', '--version'], capture_output=True, text=True, check=True).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return dict(tool='pip-audit', status='NOT_RUN', reason='pip-audit is not installed in this interpreter')
    result = subprocess.run([sys.executable, '-m', 'pip_audit', '-r', str(requirements), '--no-deps', '--disable-pip', '-f', 'json', '--progress-spinner', 'off'],
                            cwd=ROOT, capture_output=True, text=True)
    record = dict(tool=version, date=datetime.date.today().isoformat(), exit_code=result.returncode,
                  audited=sum(1 for c in components if c['installed']))
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError:
        record.update(status='BLOCKED_EXTERNAL', reason=(result.stderr or result.stdout).strip()[-800:])
        return record
    vulnerable = [dict(name=d['name'], version=d['version'], vulnerabilities=[dict(id=v['id'], fix_versions=v.get('fix_versions', []))
                       for v in d.get('vulns', [])]) for d in payload.get('dependencies', []) if d.get('vulns')]
    skipped = [dict(name=d['name'], reason=d.get('skip_reason')) for d in payload.get('dependencies', []) if d.get('skip_reason')]
    record.update(status='CLEAN' if not vulnerable and result.returncode == 0 else 'FINDINGS', vulnerable=vulnerable, skipped=skipped)
    return record


def build(audit):
    pyproject = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    components = runtime_closure(pyproject)
    paths = tracked_paths()
    scanned, findings = scan_tree(paths)
    previous = json.loads(SBOM.read_text(encoding='utf-8')) if SBOM.exists() else {}
    if audit:
        vulnerability_audit = pip_audit(components)
    else:
        vulnerability_audit = previous.get('vulnerability_audit') or dict(tool='pip-audit', status='NOT_RUN', reason='run with --audit')
    open_items = [dict(name=a['name'], paths=a['paths'], why=a['notes'], state='BLOCKED_EXTERNAL',
                       decision='owner or counsel decision; tracked by gate task G9-03')
                  for a in ASSETS if a['status'] == 'open']
    open_items += [dict(name=f"pip: {c['name']} {c['version'] or '(not installed)'}", paths=[], state='BLOCKED_EXTERNAL',
                        why='the installed metadata declares no licence' if c['installed'] else 'the distribution is not installed, so its licence was not read',
                        decision='read the licence from the project source and record it here before release')
                   for c in components if c['license'] is None]
    return dict(
        schema_version=1, kind='sbom', generator='scripts/provenance_inventory.py',
        project=dict(name=pyproject['project']['name'], version=pyproject['project']['version'], license=pyproject['project']['license'],
                     license_files=pyproject['project']['license-files'], requires_python=pyproject['project']['requires-python']),
        python=dict(version='.'.join(map(str, sys.version_info[:3])), platform=sys.platform,
                    environment_sha256=hashlib.sha256(os.path.realpath(sys.prefix).encode('utf-8')).hexdigest()[:16]),
        host=dict(os=platform.system(), platform=platform.platform(), machine=platform.machine()),
        declared_dependencies=dict(runtime=list(pyproject['project']['dependencies']),
                                   **{group: list(specs) for group, specs in pyproject['project'].get('optional-dependencies', {}).items()}),
        summary=dict(components=len(components), installed=sum(c['installed'] for c in components), open_items=len(open_items),
                     scan_findings=len(findings)),
        components=components, assets=ASSETS, open_items=open_items,
        scan=dict(patterns=sorted(SCAN_PATTERNS), excluded=SCAN_EXCLUDED, files_scanned=scanned, tracked_files=len(paths), findings=findings),
        history_note=history_note(), dependency_check=pip_check(), vulnerability_audit=vulnerability_audit)


def markdown(sbom):
    def cell(value):
        return '' if value is None else str(value).replace('|', '\\|')

    lines = ['# Third-party notices and provenance inventory', '',
             'Generated by `scripts/provenance_inventory.py` from the installed package metadata,',
             'the hand-maintained asset table in that script and a scan of the tracked tree.',
             'The machine-readable form is [validation/sbom.json](validation/sbom.json).',
             'Licence texts of the bundled frontend libraries and of the grid dependency are in',
             '[THIRD_PARTY_NOTICES.txt](../THIRD_PARTY_NOTICES.txt), which the wheel ships.',
             'This inventory records what is known; it is not a legal opinion, and every item whose',
             'right to distribute is unsettled is listed under open items rather than left out.', '',
             f"Project: {sbom['project']['name']} {sbom['project']['version']}, licence {sbom['project']['license']}; "
             f"inventoried with Python {sbom['python']['version']} on {sbom['python']['platform']}"
             + (f" ({sbom['host']['platform']})" if sbom.get('host') else '') + '.', '',
             '## Python dependencies', '',
             'Every distribution reachable from the declared dependencies of `pyproject.toml`, resolved in the',
             'development interpreter. Group `runtime` is the base install; the other groups are extras.', '',
             '| Package | Version | Licence | Groups | Required by | Source |', '| --- | --- | --- | --- | --- | --- |']
    for c in sbom['components']:
        version = c['version'] if c['installed'] else 'not installed'
        lines.append(f"| {cell(c['name'])} | {cell(version)} | {cell(c['license'])} | {', '.join(c['groups'])} | "
                     f"{', '.join(c['required_by']) or 'pyproject.toml'} | {cell(c['source_url'])} |")
    lines += ['', '## Bundled and tracked assets', '',
              '| Item | Version | Licence | Status | Paths | Notes |', '| --- | --- | --- | --- | --- | --- |']
    for a in sbom['assets']:
        lines.append(f"| {cell(a['name'])} | {cell(a['version'])} | {cell(a['license'])} | {a['status']} | "
                     f"{', '.join('`' + p + '`' for p in a['paths'])} | {cell(a['notes'])} |")
    lines += ['', '## Open items (BLOCKED_EXTERNAL)', '',
              'These need a decision that this program cannot make. They stay listed until',
              'the owner records it; gate task G9-03 tracks them.', '']
    for item in sbom['open_items']:
        lines.append(f"- **{item['name']}** ({', '.join('`' + p + '`' for p in item['paths'])}): {item['why']} State: {item['state']}; {item['decision']}.")
    scan = sbom['scan']
    lines += ['', '## Credential and private-path scan', '',
              f"{scan['files_scanned']} text files of {scan['tracked_files']} tracked paths were scanned for: "
              + ', '.join('`' + p + '`' for p in scan['patterns']) + '.',
              'Excluded because they name the patterns themselves: ' + ', '.join('`' + p + '`' for p in scan['excluded']) + '.', '']
    if scan['findings']:
        lines += ['Findings (file, pattern, line; the matched text is never printed):', '']
        lines += [f"- `{f['file']}` {f['kind']} line {f['line']}" for f in scan['findings']]
    else:
        lines.append('No finding in the tracked tree.')
    history = sbom['history_note']
    lines += ['', '### Known history note', '', history['note'], '',
              f"Commits on the current branch whose tree contains `{history['pattern']}`:", '']
    lines += [f"- {c['commit']} ({c['date']}) {c['subject']}" for c in history['commits']]
    check = sbom['dependency_check']
    lines += ['', '## Dependency and vulnerability checks', '',
              f"`{check['tool']}` exit code {check['exit_code']}: {check['output'] or '(no output)'}", '']
    audit = sbom['vulnerability_audit']
    if audit.get('status') in ('CLEAN', 'FINDINGS'):
        lines += [f"`{audit['tool']}` on {audit['date']} audited the {audit['audited']} installed distributions of the closure at their",
                  f"installed versions: {audit['status']}. The advisories below describe the development interpreter, whose",
                  'packages are older than the `pyproject.toml` minimums admit; they are not pins of the project. The release',
                  'environment of gate task G9-06 must resolve to versions at or above every listed fix, and a fix that the',
                  'declared bounds exclude (a transitive requirement of a pinned direct dependency) is a bound to raise there.', '']
        for entry in audit.get('vulnerable', []):
            identifiers = sorted({v['id'] for v in entry['vulnerabilities']})
            fixes = sorted({f for v in entry['vulnerabilities'] for f in v['fix_versions']})
            count = f"{len(identifiers)} advisor{'y' if len(identifiers) == 1 else 'ies'}"
            lines.append(f"- {entry['name']} {entry['version']}: {count} ({', '.join(identifiers[:6])}{', ...' if len(identifiers) > 6 else ''}); fixed in {', '.join(fixes) or 'no released fix'}")
        for entry in audit.get('skipped', []):
            lines.append(f"- skipped {entry['name']}: {entry['reason']}")
    else:
        lines.append(f"`pip-audit`: {audit.get('status')}. {audit.get('reason', '')}".strip())
    return '\n'.join(lines) + '\n'


def stable(sbom):
    return {key: sbom[key] for key in STABLE_SECTIONS}


def same_platform(committed, fresh):
    """The committed record was taken on this interpreter's platform and Python minor version."""
    return (committed.get('python', {}).get('platform') == fresh['python']['platform']
            and committed.get('python', {}).get('version', '').rsplit('.', 1)[0] == fresh['python']['version'].rsplit('.', 1)[0]
            and committed.get('python', {}).get('environment_sha256') == fresh['python'].get('environment_sha256'))


def compare(committed, fresh):
    """(problems, information) of the committed SBOM against a fresh build.

    On the recording platform every stable section must match. On another platform only the
    platform-independent parts are compared, and the closure difference is information.
    """
    if committed is None:
        return [f'{SBOM.relative_to(ROOT).as_posix()} is missing; generate it'], dict(platform_match=False, closure_difference=None)
    if same_platform(committed, fresh):
        problems = [] if stable(committed) == stable(fresh) else [f'{SBOM.relative_to(ROOT).as_posix()} is stale; regenerate it']
        return problems, dict(platform_match=True, closure_difference=None)
    # Another platform judges only what does not depend on the interpreter's wheels: the scan (judged by the
    # caller from the fresh findings), the asset table, the declared specifiers, and that every runtime
    # component of the record is installed here or accounted for below. Everything else is information.
    problems = []
    if committed.get('assets') != fresh['assets']:
        problems.append(f'{SBOM.relative_to(ROOT).as_posix()}: the asset table differs from the tracked tree; regenerate it on its platform')
    if committed.get('declared_dependencies') != fresh['declared_dependencies']:
        problems.append(f'{SBOM.relative_to(ROOT).as_posix()}: the dependency specifiers declared in pyproject.toml differ from the record; regenerate it on its platform')
    mine = {c['name']: c for c in committed.get('components', [])}
    theirs = {c['name']: c for c in fresh['components']}
    both = set(mine) & set(theirs)
    difference = dict(
        only_in_record=sorted(set(mine) - set(theirs)), only_here=sorted(set(theirs) - set(mine)),
        not_installed_here=sorted(n for n in both if mine[n]['installed'] and not theirs[n]['installed']),
        not_installed_on_record=sorted(n for n in both if theirs[n]['installed'] and not mine[n]['installed']),
        version_differs=sorted(n for n in both if mine[n]['installed'] and theirs[n]['installed'] and mine[n]['version'] != theirs[n]['version']),
        license_differs={n: dict(record=mine[n]['license'], here=theirs[n]['license']) for n in sorted(both)
                         if mine[n]['installed'] and theirs[n]['installed'] and mine[n]['license'] != theirs[n]['license']},
        groups_differ={n: dict(record=mine[n]['groups'], here=theirs[n]['groups']) for n in sorted(both) if mine[n]['groups'] != theirs[n]['groups']})
    accounted = set(difference['only_in_record']) | set(difference['not_installed_here'])
    for name in sorted(n for n, c in mine.items() if 'runtime' in c['groups']):
        if not (name in theirs and theirs[name]['installed']) and name not in accounted:
            problems.append(f'runtime component {name} of the record is neither installed here nor listed in the closure difference')
    return problems, dict(platform_match=False, closure_difference=difference)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--check', action='store_true', help='compare with the committed outputs instead of writing them')
    parser.add_argument('--audit', action='store_true', help='run pip-audit on the runtime closure (needs the network)')
    args = parser.parse_args()
    sbom = build(args.audit)
    problems = []
    if sbom['scan']['findings']:
        problems.append(f"{len(sbom['scan']['findings'])} scan finding(s)")
    if sbom['dependency_check']['exit_code']:
        problems.append('pip check reports broken requirements')
    # Advisories against the development interpreter are recorded, not gated
    # here: the release environment of G9-06 resolves the pinned versions.
    information = dict(platform_match=True, closure_difference=None)
    if args.check:
        committed = json.loads(SBOM.read_text(encoding='utf-8')) if SBOM.exists() else None
        compared, information = compare(committed, sbom)
        problems += compared
        if committed is not None and not compared and (not NOTICES.exists() or NOTICES.read_text(encoding='utf-8') != markdown(committed)):
            problems.append(f'{NOTICES.relative_to(ROOT).as_posix()} is stale; regenerate it')
        information['recorded_on'] = None if committed is None else dict(python=committed.get('python'), host=committed.get('host'))
    else:
        SBOM.write_text(json.dumps(sbom, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
        NOTICES.write_text(markdown(sbom), encoding='utf-8', newline='\n')
        print(f'wrote {SBOM.relative_to(ROOT).as_posix()} and {NOTICES.relative_to(ROOT).as_posix()}')
    print(json.dumps(dict(components=len(sbom['components']), installed=sum(c['installed'] for c in sbom['components']),
                          open_items=len(sbom['open_items']), files_scanned=sbom['scan']['files_scanned'],
                          findings=sbom['scan']['findings'], history_commits=len(sbom['history_note']['commits']),
                          pip_check=sbom['dependency_check']['exit_code'], audit=sbom['vulnerability_audit'].get('status'),
                          problems=problems, **information), ensure_ascii=False, indent=2))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
