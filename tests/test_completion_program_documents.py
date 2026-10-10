"""The gate file and the release scope stay consistent."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _gates():
    return json.loads((ROOT / 'docs/validation/completion_gates.json').read_text(encoding='utf-8'))


def test_gate_file_lists_every_stage_with_dependencies_and_profiles():
    gates = _gates()
    ids = [task['id'] for stage in gates['stages'] for task in stage['tasks']]
    assert len(ids) == gates['task_count'] == len(set(ids))
    stage_ids = {stage['id'] for stage in gates['stages']}
    for stage in gates['stages']:
        assert set(stage['depends_on_stages']) <= stage_ids
        assert stage['profile'] in gates['profiles']
    for profile in gates['profiles'].values():
        assert set(profile['required_stages']) <= stage_ids


def test_release_scope_separates_profiles_and_blocks_hpc_without_two_devices():
    text = (ROOT / 'docs/RELEASE_SCOPE.md').read_text(encoding='utf-8')
    assert 'WORKSTATION' in text and 'HPC' in text
    assert 'BLOCKED_EXTERNAL' in text
    for heading in ('## Physics', '## Platforms', '## Inputs and outputs', '## Differentiation', '## Capacity'):
        assert heading in text
