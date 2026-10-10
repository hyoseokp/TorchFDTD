"""G9-02: the provenance inventory is current, its scan of the tracked tree is clean
and the generated notices and SBOM carry no private path themselves."""
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import provenance_inventory as inventory  # noqa: E402

try:
    import tomllib
except ImportError:
    import tomli as tomllib
from packaging.requirements import Requirement  # noqa: E402
from packaging.utils import canonicalize_name  # noqa: E402

HANGUL_USER = chr(0xC5F0) + chr(0xAD6C) + chr(0xC2E4)
# The samples are assembled here so that no tracked file spells the historic path,
# the addresses are synthetic, and the parametrized ids are short labels so that
# no sample string reaches a test id, a JUnit report or an evidence record.
ADMIN = 'ad' + 'min'
POSITIVE = {
    'admin_forward_slash': ('private_windows_user_path', 'scratch C:/Users/' + ADMIN + '/photonweave/.local'),
    'admin_json_escaped': ('private_windows_user_path', json.dumps({'dir': 'C:\\Users\\' + ADMIN + '\\photonweave'})),
    'hangul_drive_path': ('private_windows_user_path', 'c:\\Users\\' + HANGUL_USER + '\\Desktop'),
    'hangul_user_path': ('hangul_user_path', 'C:/Users/' + HANGUL_USER + '/AppData'),
    'driveless_backslash': ('private_driveless_user_path', 'saved under \\Users\\' + ADMIN + '\\photonweave'),
    'driveless_json_escaped': ('private_driveless_user_path', json.dumps({'dir': '\\Users\\' + ADMIN + '\\photonweave'})),
    'unc_admin_share': ('private_unc_user_path', '\\\\server\\c$\\Users\\' + ADMIN + '\\x'),
    'unc_json_escaped': ('private_unc_user_path', json.dumps({'dir': '\\\\server\\c$\\Users\\' + ADMIN + '\\x'})),
    'macos_home': ('private_macos_user_path', 'scp results /Users/bot_s/runs/'),
    'address_ssh': ('address_100_x_x_x', 'ssh user@100.100.100.100'),
    'address_url': ('address_100_x_x_x', 'http://100.64.1.2:9802/'),
    'password_single_quoted': ('password_literal', "password = 'hunter2'"),
    'passwd_double_quoted': ('password_literal', 'PASSWD: "1234"'),
    'ssh_password_environment': ('ssh_password_environment', 'TORCHFDTD_SSH_PASSWORD="letmein"'),
    'github_token': ('credential_token', 'token ghp_' + 'A' * 36 + ' end'),
    'aws_key_id': ('credential_token', 'AKIA' + 'Q' * 16),
    'tailscale_key': ('credential_token', 'tskey-auth-abcdefghijklmnop'),
    'private_key_block': ('private_key_block', '-----BEGIN OPENSSH PRIVATE KEY-----'),
    'ssh_public_key': ('ssh_public_key', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIABCDEFGHIJKLMNOPQRSTUVWXYZ user@host'),
}
# Encodings a file may wrap a path in: the pattern alone misses them, scan_text decodes them first.
ENCODED = {
    'json_escaped_hangul': ('private_windows_user_path', 'json_escaped', json.dumps({'dir': 'C:\\Users\\' + HANGUL_USER + '\\Desktop'})),
    'json_escaped_hangul_driveless': ('private_driveless_user_path', 'json_escaped', json.dumps({'dir': '\\Users\\' + HANGUL_USER + '\\x'})),
    'percent_encoded_hangul': ('private_windows_user_path', 'percent_encoded',
                               'file:///C:/Users/' + ''.join('%%%02X' % b for b in HANGUL_USER.encode('utf-8')) + '/x'),
    'percent_encoded_macos': ('private_macos_user_path', 'percent_encoded', 'http://host/Users/bot%5Fs/runs'),
}
BENIGN = {
    'administrator': 'C:/Users/' + ADMIN + 'istrator/x',
    'program_files_users': 'C:\\Program Files\\Users\\shared',
    'users_word': 'the Users directory of every account',
    'web_admin_route': 'https://example.org/Users/' + ADMIN + 'istration',
    'percent_progress': '100%20done',
    'public_user': 'C:/Users/public/x',
    'project_scratch': 'D:/TorchFDTD/.local/tmp',
    'version_number': 'version 100.0.1',
    'four_part_version': 'numpy 1.100.2.3 is not an address',
    'environment_read': "os.environ.get('TORCHFDTD_SSH_PASSWORD')",
    'powershell_prompt': '$env:TORCHFDTD_SSH_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)',
    'prose_password': 'the password is requested interactively',
    'prose_key_type': 'ssh-ed25519 keys are accepted',
}


def test_inventory_check_passes_on_the_tracked_tree():
    result = subprocess.run([sys.executable, str(ROOT / 'scripts' / 'provenance_inventory.py'), '--check'],
                            cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    summary = json.loads(result.stdout[result.stdout.index('{'):])
    assert result.returncode == 0, (summary, result.stderr[-800:])
    assert summary['findings'] == [] and summary['problems'] == []
    assert summary['components'] > 20 and summary['pip_check'] == 0
    assert summary['recorded_on']['python']['platform'] and summary['recorded_on']['host']['os']
    if summary['platform_match']:
        assert summary['components'] == summary['installed'] and summary['closure_difference'] is None
    else:  # another platform compares the portable parts and reports the closure difference as information
        assert set(summary['closure_difference']) <= {'only_in_record', 'only_here', 'not_installed_here', 'not_installed_on_record',
                                                     'version_differs', 'license_differs', 'groups_differ'}


def test_committed_sbom_records_its_platform_and_summary():
    sbom = json.loads((ROOT / 'docs' / 'validation' / 'sbom.json').read_text(encoding='utf-8'))
    assert sbom['python']['platform'] and sbom['host']['os'] and sbom['host']['platform']
    pyproject = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    assert sbom['declared_dependencies']['runtime'] == pyproject['project']['dependencies']
    assert sbom['declared_dependencies']['dev'] == pyproject['project']['optional-dependencies']['dev']
    assert sbom['summary'] == dict(components=len(sbom['components']), installed=sum(c['installed'] for c in sbom['components']),
                                   open_items=len(sbom['open_items']), scan_findings=len(sbom['scan']['findings']))


def test_check_on_another_platform_compares_only_the_portable_parts():
    import copy
    committed = json.loads((ROOT / 'docs' / 'validation' / 'sbom.json').read_text(encoding='utf-8'))
    fresh = copy.deepcopy(committed)
    fresh['python'] = dict(version='3.11.9', platform='linux' if committed['python']['platform'] != 'linux' else 'win32')
    fresh['host'] = dict(os='Linux', platform='Linux-6.8.0-x86_64', machine='x86_64')
    installed = [c for c in fresh['components'] if c['installed']]
    dropped = installed[0]
    dropped.update(installed=False, version=None, license=None)  # not installed here, for example cupy on a CPU-only host
    installed[1]['version'] = installed[1]['version'] + '.post1'
    installed[2]['license'] = 'MIT License' if installed[2]['license'] != 'MIT License' else 'MIT'  # wheel metadata spells licences differently
    installed[3]['groups'] = installed[3]['groups'] + ['benchmark']  # a transitive dependency reached through another group here
    fresh['components'].append(dict(name='linux-only-dep', groups=['runtime'], required_by=[], specifiers=[], version='1.0', installed=True,
                                    license='MIT', license_classifiers=[], license_files=[], source_url=None))
    fresh['components'] = [c for c in fresh['components'] if c['name'] != installed[4]['name']]  # absent from this closure entirely
    fresh['open_items'] = [item for item in fresh['open_items'] if item.get('paths')] + [dict(name=f"pip: {dropped['name']} (not installed)", paths=[], state='BLOCKED_EXTERNAL', why='x', decision='y')]
    fresh['history_note'] = dict(pattern='x', commits=[], note='a shallow clone sees another history')
    problems, information = inventory.compare(committed, fresh)
    assert problems == [], problems
    assert information['platform_match'] is False
    difference = information['closure_difference']
    assert difference['only_here'] == ['linux-only-dep'] and difference['only_in_record'] == [installed[4]['name']]
    assert difference['not_installed_here'] == [dropped['name']] and difference['version_differs'] == [installed[1]['name']]
    assert difference['license_differs'] == {installed[2]['name']: dict(record=committed['components'][[c['name'] for c in committed['components']].index(installed[2]['name'])]['license'], here=installed[2]['license'])}
    assert list(difference['groups_differ']) == [installed[3]['name']]
    # Only the asset table and the declared specifiers are judged on another platform.
    fresh['declared_dependencies']['runtime'] = fresh['declared_dependencies']['runtime'] + ['extra-dep>=1']
    problems, _ = inventory.compare(committed, fresh)
    assert problems == ['docs/validation/sbom.json: the dependency specifiers declared in pyproject.toml differ from the record; regenerate it on its platform']
    fresh['declared_dependencies'] = committed['declared_dependencies']
    fresh['assets'] = []
    problems, _ = inventory.compare(committed, fresh)
    assert problems == ['docs/validation/sbom.json: the asset table differs from the tracked tree; regenerate it on its platform']
    # On the recording platform the whole stable record must match.
    same = copy.deepcopy(committed)
    assert inventory.compare(committed, same) == ([], dict(platform_match=True, closure_difference=None))
    same['components'][0]['version'] = '0.0.0'
    assert inventory.compare(committed, same)[0] == ['docs/validation/sbom.json is stale; regenerate it']


@pytest.mark.parametrize('label', sorted(POSITIVE))
def test_scan_patterns_catch_the_named_secrets(label):
    kind, sample = POSITIVE[label]
    assert re.search(inventory.SCAN_PATTERNS[kind], sample), label


@pytest.mark.parametrize('label', sorted(BENIGN))
def test_scan_patterns_ignore_benign_text(label):
    assert not [kind for kind, pattern in inventory.SCAN_PATTERNS.items() if re.search(pattern, BENIGN[label])], label
    assert inventory.scan_text(BENIGN[label]) == [], label


@pytest.mark.parametrize('label', sorted(ENCODED))
def test_scan_decodes_json_and_percent_escapes_before_matching(label):
    kind, encoding, sample = ENCODED[label]
    assert HANGUL_USER not in sample or 'json' not in label
    assert not re.search(inventory.SCAN_PATTERNS[kind], sample), label      # the pattern alone misses the encoded form
    findings = inventory.scan_text(sample)
    assert (kind, encoding) in {(f['kind'], f['encoding']) for f in findings}, (label, findings)
    assert all(f['line'] == 1 for f in findings)


def test_scan_reports_each_position_once_and_keeps_line_numbers():
    text = 'line one\nC:/Users/' + ADMIN + '/x\n%0A%0A\n' + json.dumps({'p': 'C:\\Users\\' + ADMIN}) + '\n'
    findings = inventory.scan_text(text)
    assert [(f['kind'], f['line'], f['encoding']) for f in findings] == [
        ('private_windows_user_path', 2, 'verbatim'), ('private_windows_user_path', 4, 'verbatim')]


def test_sbom_covers_every_declared_dependency_with_licence_and_source():
    sbom = json.loads(inventory.SBOM.read_text(encoding='utf-8'))
    pyproject = tomllib.loads((ROOT / 'pyproject.toml').read_text(encoding='utf-8'))
    components = {c['name']: c for c in sbom['components']}
    declared = list(pyproject['project']['dependencies'])
    for group, specs in pyproject['project']['optional-dependencies'].items():
        declared += specs
    for spec in declared:
        name = canonicalize_name(Requirement(spec).name)
        assert name in components, name
        record = components[name]
        assert record['installed'] and record['version'] and record['source_url'], record
        assert record['license'] or any(item['name'] == f"pip: {name} {record['version']}" for item in sbom['open_items']), record
    unlicensed = [c['name'] for c in sbom['components'] if c['license'] is None]
    assert all(any(item['name'].startswith(f'pip: {name} ') for item in sbom['open_items']) for name in unlicensed), unlicensed
    assert sbom['project'] == dict(name='torchfdtd', version=pyproject['project']['version'], license='MIT',
                                   license_files=['LICENSE', 'THIRD_PARTY_NOTICES.txt'], requires_python='>=3.10')
    lock = json.loads((ROOT / 'package-lock.json').read_text(encoding='utf-8'))['packages']
    assets = {a['name']: a for a in sbom['assets']}
    assert assets['three.js']['version'].startswith(lock['node_modules/three']['version'])
    assert assets['lucide']['version'] == lock['node_modules/lucide']['version']
    assert {item['name'] for item in sbom['open_items']} >= {'Installed-API property catalogue', 'FSP layout support'}
    assert all(item['state'] == 'BLOCKED_EXTERNAL' for item in sbom['open_items'])
    assert sbom['scan']['findings'] == []
    assert sbom['history_note']['commits'] and all(len(c['commit']) == 12 for c in sbom['history_note']['commits'])


def test_notices_document_matches_the_sbom_and_names_the_open_items():
    sbom = json.loads(inventory.SBOM.read_text(encoding='utf-8'))
    text = inventory.NOTICES.read_text(encoding='utf-8')
    assert text == inventory.markdown(sbom)
    assert '## Open items (BLOCKED_EXTERNAL)' in text and '### Known history note' in text
    for item in sbom['open_items']:
        assert item['name'] in text
    for commit in sbom['history_note']['commits']:
        assert commit['commit'] in text
    assert 'No finding in the tracked tree.' in text
    assert (ROOT / 'THIRD_PARTY_NOTICES.txt').exists()


def test_generated_outputs_carry_no_private_path_or_credential():
    for path in (inventory.SBOM, inventory.NOTICES):
        text = path.read_text(encoding='utf-8')
        assert inventory.scan_text(text) == [], path.name
        assert HANGUL_USER not in text and 'site-packages' not in text and '.venv' not in text, path.name
