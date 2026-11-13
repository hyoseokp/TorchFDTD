"""The MCP tools validate and run Projects through the same path as a workbench job, and register with the MCP server."""
import asyncio

import numpy as np
import pytest

from torchfdtd import Result
from torchfdtd import mcp_server as tools


@pytest.fixture(autouse=True)
def results(tmp_path, monkeypatch):
    monkeypatch.setenv('TORCHFDTD_RESULTS', str(tmp_path))
    return tmp_path


def small_waveguide():
    project = tools.example_project('waveguide')
    project['region'].update(backend='cpu', steps=60)
    return project


def test_environment_names_the_version_examples_and_citation():
    from torchfdtd import __version__
    report = tools.environment()
    assert report['version'] == __version__ and set(report['examples']) == set(tools.EXAMPLES)
    assert '2609.30039' in report['citation'] and 'zenodo' in report['citation']


@pytest.mark.parametrize('name', sorted(tools.EXAMPLES))
def test_every_example_project_validates(name):
    report = tools.validate_project(tools.example_project(name))
    assert report['cells'] > 0 and report['plan_hash'] and 'mode' in report['execution']
    assert 'project' not in report


def test_unknown_example_is_rejected_with_the_choices():
    with pytest.raises(ValueError, match='waveguide'):
        tools.example_project('ring')


def test_run_project_saves_the_result_and_returns_its_spectra(results):
    out = tools.run_project(small_waveguide(), name='wave guide/1')
    path = results / 'mcp' / 'wave_guide_1.npz'
    assert out['output'] == str(path) and path.exists()
    assert out['summary']['steps'] == 60 and out['summary']['cancelled'] is False
    assert out['point_monitors'] and len(out['point_monitors'][0]['signal']) <= tools.MAX_TRACE_VALUES
    saved = Result.load(path)
    assert np.isfinite(saved.signals).all()


def test_python_script_rebuilds_the_project():
    script = tools.python_script(small_waveguide())
    assert 'from torchfdtd import' in script and 'Project' in script


def test_tools_register_with_the_mcp_server():
    pytest.importorskip('mcp')
    names = {tool.name for tool in asyncio.run(tools.build_server().list_tools())}
    assert names == {tool.__name__ for tool in tools.TOOLS}


def slab_projects():
    from torchfdtd import Project, Region, Structure, Source, FieldMonitor, SpectrumSettings, Boundaries, BoundaryFace
    sample = Project(name='slab', region=Region(size=(8, .5, 1), mesh=.05, steps=800, pml_cells=12, backend='cpu',
                     material_sampling='yee', boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'), y_max=BoundaryFace(kind='periodic'))),
                     structures=[Structure(center=(0, 0, 0), size=(.2, .5, 1), material='SiO2 (constant n)')],
                     sources=[Source(id='source', kind='plane', center=(-1.5, 0, 0), size=(0, .5, 0), pulse_cycles=1)],
                     monitors=[FieldMonitor(id='t', name='transmission', center=(.8, 0, 0), size=(0, .5, 1),
                                            spectrum=SpectrumSettings(sampling='frequency', frequency_points=11, apodization='none'))])
    air = sample.model_copy(deep=True)
    air.structures = []
    return sample.model_dump(mode='json'), air.model_dump(mode='json')


def test_flux_ratio_normalises_a_slab_by_its_air_reference():
    sample, air = slab_projects()
    s, a = tools.run_project(sample, name='slab'), tools.run_project(air, name='air')
    same = tools.flux_ratio(a['output'], 'transmission', a['output'], 'transmission')
    assert all(v for v in same['valid']) and np.allclose(same['ratio'], 1.0)
    out = tools.flux_ratio(s['output'], 'transmission', a['output'], 'transmission')
    ratio = np.array([r for r, v in zip(out['ratio'], out['valid']) if v])
    assert ratio.size and ((ratio > 0.85) & (ratio < 1.01)).all()


def test_flux_ratio_refuses_runs_with_different_sources(results):
    sample, air = slab_projects()
    air['sources'][0]['pulse_cycles'] = 2
    s, a = tools.run_project(sample, name='slab'), tools.run_project(air, name='air2')
    with pytest.raises(ValueError, match='sources'):
        tools.flux_ratio(s['output'], 'transmission', a['output'], 'transmission')
    with pytest.raises(ValueError, match='saved TorchFDTD result'):
        tools.flux_ratio(str(results / 'missing.npz'), 'transmission', a['output'], 'transmission')
