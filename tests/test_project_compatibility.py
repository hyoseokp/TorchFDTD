"""Saved project JSON and result NPZ files load, round-trip and keep every field they carry.

The fixtures under tests/fixtures are frozen at the schema they were written
with (tests/fixtures/generate_fixtures.py); the example scenes under examples/
are the shipped ones. A newer schema version is refused by name.
"""
import json
from pathlib import Path

import numpy as np
import pydantic
import pytest

from torchfdtd import Project, Result
from torchfdtd.models import SCHEMA_VERSION, migrate_project

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'tests' / 'fixtures'


def _project_payloads():
    """Every project dictionary stored in a JSON file under examples/ and tests/fixtures, nested or top level."""
    found = []
    for path in sorted([*(ROOT / 'examples').glob('*.json'), *FIXTURES.rglob('*.json')]):
        payload = json.loads(path.read_text(encoding='utf-8'))
        if isinstance(payload, dict) and isinstance(payload.get('project'), dict):
            payload = payload['project']
        if isinstance(payload, dict) and ('region' in payload or 'schema_version' in payload or 'structures' in payload):
            found.append((path.relative_to(ROOT).as_posix(), payload))
    return found


PAYLOADS = _project_payloads()


def _subset_equal(original, dumped, where=''):
    """Every field present in the file is present, and equal, in the dumped model."""
    if isinstance(original, dict):
        assert isinstance(dumped, dict), where
        for key, value in original.items():
            assert key in dumped, f'{where}.{key} missing after the round trip'
            _subset_equal(value, dumped[key], f'{where}.{key}')
    elif isinstance(original, list):
        assert isinstance(dumped, list) and len(dumped) == len(original), where
        for index, (a, b) in enumerate(zip(original, dumped)):
            _subset_equal(a, b, f'{where}[{index}]')
    else:
        assert original == dumped, f'{where}: {original!r} != {dumped!r}'


def test_fixtures_are_discovered():
    names = [name for name, _ in PAYLOADS]
    assert 'examples/native_farfield.json' in names and 'examples/open_mode_network.json' in names
    assert len([n for n in names if n.startswith('tests/fixtures/projects/')]) >= 7


@pytest.mark.parametrize('name,payload', PAYLOADS, ids=[name for name, _ in PAYLOADS])
def test_project_file_round_trips_through_the_model(name, payload, tmp_path):
    project = Project.model_validate(payload)
    assert project.schema_version == SCHEMA_VERSION
    dumped = json.loads(project.model_dump_json())
    _subset_equal(payload, dumped, name)
    again = Project.model_validate_json(project.model_dump_json())
    assert again.model_dump() == project.model_dump()
    path = tmp_path / 'saved.json'
    project.save(path)
    loaded = Project.load(path)
    assert loaded.model_dump() == project.model_dump()
    # Derived quantities that a run depends on come back identical: mesh coordinates, time step, duration.
    for axis in range(3):
        np.testing.assert_array_equal(loaded.region.mesh_nodes[axis], project.region.mesh_nodes[axis])
    assert loaded.region.time_step == project.region.time_step and loaded.region.shape == project.region.shape
    assert [loaded.resolved_source(s).model_dump() for s in loaded.sources] == [project.resolved_source(s).model_dump() for s in project.sources]
    assert [loaded.resolved_monitor(m).model_dump() for m in loaded.monitors] == [project.resolved_monitor(m).model_dump() for m in project.monitors]


def test_graded_dispersive_fixture_restores_its_settings():
    project = Project.load(FIXTURES / 'projects' / 'graded_ade_plane.json')
    region = project.region
    assert region.mesh_type == 'graded' and region.material_sampling == 'yee' and len(region.mesh_refinements) == 1
    assert region.backend == 'cpu' and region.precision == 'float64' and region.dimension == '2d'
    assert region.boundaries.y_min.kind == 'pec' and region.boundaries.y_max.kind == 'pec'
    assert region.shape != region.base_shape, 'the graded mesh must not collapse to the uniform shape'
    assert [m.model for m in project.materials] == ['dielectric', 'multipole'] and project.materials[1].poles
    source = project.resolved_source(project.sources[0])
    assert source.kind == 'plane' and source.pulse == 'broadband' and source.time_definition == 'wavelength'
    assert (source.wavelength_start, source.wavelength_stop) == (1.2, 1.4)
    assert [m.kind for m in project.monitors] == ['point', 'field'] and project.monitors[1].normal == 'x'
    assert project.resolved_monitor(project.monitors[1]).spectrum.sampling == 'frequency'


def test_minimal_hand_written_file_takes_the_documented_defaults():
    project = Project.load(FIXTURES / 'projects' / 'minimal_defaults.json')
    assert project.schema_version == 1 and project.region.dimension == '2d' and project.region.backend == 'auto'
    assert project.region.cuda_kernel == 'auto' and project.region.cuda_monitor_kernel == 'auto' and project.region.precision == 'float32'
    assert [s.name for s in project.structures] == ['core'] and project.structures[0].material in {m.name for m in project.materials}
    assert project.sources[0].wavelength == 1.55 and project.monitors[0].name == 'output'


@pytest.mark.parametrize('name', ['tiny_2d_complete', 'tiny_2d_cancelled'])
def test_result_npz_restores_the_run_and_its_state(name, tmp_path):
    path = FIXTURES / 'npz' / f'{name}.npz'
    result = Result.load(path)
    expected = Project.load(FIXTURES / 'projects' / 'tiny_result.json')
    assert result.project.model_dump() == expected.model_dump()
    summary = result.summary
    assert summary['backend'] == 'cpu' and summary['precision'] == 'float32'
    assert summary['units'] == 'geometry: um; time: s; E/H: reduced fields; Bloch phase: rad'
    assert summary['requested_steps'] == 40 and isinstance(summary['warnings'], list)
    if name == 'tiny_2d_cancelled':
        assert summary['cancelled'] is True and summary['termination_reason'] == 'cancelled' and summary['steps'] == 20
    else:
        assert summary['cancelled'] is False and summary['steps'] == 40
    completed = summary['steps']
    assert result.times.shape == (completed,) and result.signals.shape == (completed, 1)
    assert result.frames.shape[0] == len(result.frame_steps) and result.frame_steps[-1] == completed
    assert np.isclose(result.times[1] - result.times[0], summary['dt_fs'] * 1e-15)
    assert result.electric.shape[:2] == result.epsilon.shape == tuple(result.project.region.shape[:2])
    assert np.isfinite(result.electric).all() and np.isfinite(result.magnetic).all()
    with np.load(path, allow_pickle=False) as raw:
        for axis, nodes in zip('xyz', result.project.region.mesh_nodes):
            np.testing.assert_array_equal(raw[f'mesh_{axis}_um'], nodes)
        np.testing.assert_allclose(result.spectra[0]['value'], raw['monitor_0_spectrum'], rtol=1e-12, atol=0)
        np.testing.assert_array_equal(result.spectra[0]['frequency_hz'], raw['monitor_0_frequency_hz'])
    copy = tmp_path / 'copy.npz'
    result.save(copy)
    again = Result.load(copy)
    assert again.summary == summary and again.project.model_dump() == result.project.model_dump()
    for attribute in ('frames', 'frame_steps', 'epsilon', 'signals', 'times', 'electric', 'magnetic'):
        np.testing.assert_array_equal(getattr(again, attribute), getattr(result, attribute))


def test_migration_stub_passes_the_current_schema_and_names_a_newer_one():
    assert migrate_project({'schema_version': 1, 'name': 'a'}) == {'schema_version': 1, 'name': 'a'}
    assert migrate_project({'name': 'no version field'}) == {'name': 'no version field'}
    assert migrate_project('not a mapping') == 'not a mapping'
    with pytest.raises(ValueError, match='schema_version 2 is newer than schema 1'):
        migrate_project({'schema_version': 2})
    with pytest.raises(ValueError, match="Unknown project schema_version 'one'"):
        migrate_project({'schema_version': 'one'})


def test_future_schema_version_is_rejected_by_every_loader(tmp_path):
    payload = json.loads((FIXTURES / 'projects' / 'demo_waveguide.json').read_text(encoding='utf-8'))
    payload['schema_version'] = 2
    with pytest.raises(pydantic.ValidationError, match='schema_version 2 is newer than schema 1'):
        Project.model_validate(payload)
    path = tmp_path / 'future.json'
    path.write_text(json.dumps(payload), encoding='utf-8')
    with pytest.raises(pydantic.ValidationError, match='schema_version 2 is newer than schema 1'):
        Project.load(path)
    with np.load(FIXTURES / 'npz' / 'tiny_2d_complete.npz', allow_pickle=False) as raw:
        arrays = {key: raw[key] for key in raw.files}
    arrays['project'] = json.dumps(payload)
    future = tmp_path / 'future.npz'
    np.savez_compressed(future, **arrays)
    with pytest.raises(pydantic.ValidationError, match='schema_version 2 is newer than schema 1'):
        Result.load(future)
