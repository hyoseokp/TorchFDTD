"""Model Context Protocol server: TorchFDTD as tools for AI agents.

Start it over stdio with `torchfdtd mcp` after `pip install "torchfdtd[mcp]"`, or register
that command in an MCP client (Claude Code, Claude Desktop, Cursor, VS Code). The tools are
plain functions of this module, so they also work, and are tested, without the MCP package:
they validate and run a Project exactly as a workbench job does (torchfdtd.server).
Results are written under $TORCHFDTD_RESULTS/mcp (default ./results/mcp).
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

from fastapi.encoders import jsonable_encoder

from . import __version__
from .models import Project, demo_project
from .solver import hardware

EXAMPLES = {'waveguide': '2D silicon nitride waveguide with a source and two point monitors',
            'scatterer': '2D cylinder scattering',
            '3d': '3D dielectric sphere',
            'pmc': '3D cavity with a PMC wall'}
DOCS = 'https://github.com/hyoseokp/TorchFDTD'
CITATION = ('If results go into a paper, report or thesis, cite the TorchFDTD paper (arXiv:2609.30039, '
            'doi:10.48550/arXiv.2609.30039) and the software (doi:10.5281/zenodo.22928834); BibTeX is in the README '
            'section "Citing TorchFDTD" and in CITATION.cff.')
MAX_TRACE_VALUES = 200


def _json(value):
    from .server import _finite
    return jsonable_encoder(value, custom_encoder={float: _finite})


def results_root():
    root = Path(os.environ.get('TORCHFDTD_RESULTS', 'results')).resolve() / 'mcp'
    root.mkdir(parents=True, exist_ok=True)
    return root


def environment() -> dict:
    """TorchFDTD version, the device a run would use, example names, documentation and how to cite."""
    return dict(version=__version__, hardware=hardware(), examples=EXAMPLES, documentation=DOCS,
                agent_guide=f'{DOCS}/blob/main/AGENTS.md', units='lengths and wavelengths in micrometres', citation=CITATION)


def example_project(name: str) -> dict:
    """A complete, runnable Project as JSON, to edit into the user's device. Names: waveguide, scatterer, 3d, pmc."""
    if name not in EXAMPLES:
        raise ValueError(f'Unknown example {name!r}; choose one of {", ".join(EXAMPLES)}.')
    return demo_project(name).model_dump(mode='json')


def project_schema() -> dict:
    """JSON schema of a Project: region, materials, structures, sources and monitors, with units and limits."""
    return Project.model_json_schema()


def validate_project(project: dict) -> dict:
    """Check a Project before running it: cells, memory estimate, time step, warnings and the execution mode."""
    from .server import validation_report
    report = validation_report(Project.model_validate(project), results_root())
    report.pop('project', None)
    return _json(report)


def run_project(project: dict, name: str = 'run') -> dict:
    """Run a Project and return its summary, point-monitor spectra and flux spectra; the full result is saved as NPZ.

    Load the NPZ with torchfdtd.Result.load(path), which reads it without unpickling.
    """
    from .server import execute_project
    from .stability_checks import stability_warnings
    parsed = Project.model_validate(project)
    root = results_root()
    result, execution = execute_project(parsed, root)
    path = root / f"{re.sub(r'[^A-Za-z0-9_.-]', '_', name)[:64] or 'run'}.npz"
    result.save(path)
    summary = dict(result.summary, warnings=list(result.summary['warnings']) + stability_warnings(parsed))
    monitors = result.monitor_data(max_values=MAX_TRACE_VALUES) if len(result.times) > 1 else []
    return _json(dict(output=str(path), execution=execution, summary=summary, point_monitors=monitors,
                      flux_monitors=result.flux_data(max_values=MAX_TRACE_VALUES), citation=CITATION))


def flux_ratio(sample_result: str, sample_monitor: str, reference_result: str, reference_monitor: str) -> dict:
    """Signed flux through a field monitor of one run divided by the flux through a field monitor of a reference run.

    Use it for transmission normalised by a reference without the device, for example a bend's output arm against
    a straight guide: run both with the same sources, mesh, time step and step count, then pass the NPZ paths that
    run_project returned and the field-monitor names. The two planes may differ. A negative ratio means power crossed
    the plane against its normal. Frequencies where the reference flux is below 1% of its peak are marked invalid.
    For reflection with incident-field subtraction on identical planes, use torchfdtd.normalize_flux in Python.
    """
    import numpy as np
    from .solver import Result
    runs = []
    for path in (sample_result, reference_result):
        path = Path(path)
        if path.suffix.lower() not in ('.npz', '.h5', '.hdf5') or not path.is_file():
            raise ValueError(f'{path} is not a saved TorchFDTD result (.npz, .h5 or .hdf5).')
        runs.append(Result.load(path))
    sample, reference = runs
    a, b = sample.field_monitor(sample_monitor), reference.field_monitor(reference_monitor)
    if a['flux'] is None or b['flux'] is None:
        raise ValueError('Both field monitors need recorded flux.')
    if np.shape(a['frequency_hz']) != np.shape(b['frequency_hz']) or not np.allclose(a['frequency_hz'], b['frequency_hz'], rtol=1e-10, atol=0):
        raise ValueError('The two monitors must sample the same frequencies.')
    for label, first, second in (('sources', [s.model_dump() for s in sample.project.sources], [s.model_dump() for s in reference.project.sources]),
                                 ('mesh', sample.project.region.mesh, reference.project.region.mesh),
                                 ('step count', sample.summary['steps'], reference.summary['steps']),
                                 ('time step', sample.summary['dt_fs'], reference.summary['dt_fs'])):
        if first != second:
            raise ValueError(f'The sample and reference runs differ in their {label}; normalise only runs with the same {label}.')
    flux, ref = np.asarray(a['flux'], dtype=float), np.asarray(b['flux'], dtype=float)
    valid = np.abs(ref) >= 0.01 * np.abs(ref).max()
    ratio = np.where(valid, flux / np.where(valid, ref, 1.0), np.nan)
    return _json(dict(wavelength_um=(299792458.0 / np.asarray(a['frequency_hz']) * 1e6).tolist(), ratio=ratio.tolist(),
                      valid=valid.tolist(), sample_normal=a['normal_axis'], reference_normal=b['normal_axis']))


def python_script(project: dict) -> str:
    """The equivalent standalone Python script of a Project, using the torchfdtd API."""
    return Project.model_validate(project).python_script()


TOOLS = (environment, example_project, project_schema, validate_project, run_project, flux_ratio, python_script)


def build_server():
    try:
        from mcp.server.mcpserver import MCPServer as Server     # mcp 2
    except ImportError:
        from mcp.server.fastmcp import FastMCP as Server         # mcp 1
    server = Server('torchfdtd', instructions=(
        'TorchFDTD is a GPU FDTD electromagnetic simulator for photonics (lengths in micrometres). Start from '
        'example_project, edit the structures, sources and monitors, call validate_project, then run_project. '
        'For transmission, also run a reference without the device and call flux_ratio. Check the result on a finer '
        'mesh before quoting numbers. Project sources are point, plane (sheet) and TFSF; there is no eigenmode '
        'source in the project schema. Use python_script to hand the user a reproducible script. ' + CITATION))
    for tool in TOOLS:
        server.tool()(tool)
    return server


def main():
    try:
        server = build_server()
    except ImportError as exc:
        raise SystemExit('The MCP server needs the optional dependency: pip install "torchfdtd[mcp]"') from exc
    server.run()


if __name__ == '__main__':
    main()
