"""G4-06: the workflow keeps fork code off the lab GPU hosts, and the policy names the suites."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / '.github' / 'workflows' / 'test.yml'
POLICY = ROOT / 'docs' / 'GPU_RUNNER_POLICY.md'
SUITES = ('cpu-pr', 'gpu-nightly', 'release-full')


def workflow_text():
    return WORKFLOW.read_text(encoding='utf-8')


def test_workflow_has_no_self_hosted_runner_and_no_pull_request_target():
    text = workflow_text()
    assert 'self-hosted' not in text
    assert 'pull_request_target' not in text
    runners = re.findall(r'^\s*runs-on:\s*(.+)$', text, re.MULTILINE)
    assert runners and all(runner.strip().startswith('ubuntu-') for runner in runners), runners


def test_workflow_triggers_are_the_declared_three():
    text = workflow_text()
    block = re.search(r'^on:\n((?:[ \t]+.*\n)+)', text, re.MULTILINE).group(1)
    triggers = re.findall(r'^  (\w+):', block, re.MULTILINE)
    assert set(triggers) == {'push', 'pull_request', 'workflow_dispatch'}, triggers


def test_workflow_skips_only_the_manuscripts():
    """Tests read the README and documents under docs/ (the validation report, the gate records, the release review),
    so a push that changes only those must still run the suite; only the manuscripts are skipped."""
    ignored = re.findall(r"^\s+- '([^']+)'", workflow_text().split('jobs:', 1)[0], re.MULTILINE)
    assert ignored and set(ignored) == {'docs/paper/**'}, ignored


def test_workflow_runs_the_cpu_pr_suite_only():
    text = workflow_text()
    assert 'scripts/run_suite.py cpu-pr' in text
    assert re.search(r'run:\s*python -m pytest', text) is None, 'pytest must be launched through the suite runner'
    assert '--gpu-required' not in text


def test_policy_names_the_three_suites_and_the_fork_rule():
    text = POLICY.read_text(encoding='utf-8')
    for suite in SUITES:
        assert f'`{suite}`' in text, suite
    assert 'Fork pull requests never execute on them' in text
    for phrase in ('by commit hash', 'no `GITHUB_TOKEN`', 'worktree remove', '--gpu-required', 'optional platform check:'):
        assert phrase in text, phrase


def test_suite_runner_knows_the_same_three_suites():
    import importlib.util
    spec = importlib.util.spec_from_file_location('run_suite', ROOT / 'scripts' / 'run_suite.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    assert tuple(sorted(module.SUITES)) == tuple(sorted(SUITES))
