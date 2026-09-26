"""Model, sampling and provenance checks for the full-3D README movie."""
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
import pytest

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "examples/visualization" / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="module")
def capture():
    return load("metalens_3d_pulse")


def test_movie_preserves_three_dimensional_fixture(capture):
    project, geometry = capture.make_project()
    reference = capture.fixture_module().build_3d(geometry)
    assert project.region.dimension == "3d"
    assert project.region.shape == reference.region.shape == (160, 160, 134)
    assert project.region.steps == reference.region.steps == 2500
    assert project.region.time_step == reference.region.time_step
    assert len(project.structures) == 112
    assert project.structures == reference.structures
    assert project.sources == reference.sources
    assert project.materials == reference.materials
    assert [m for m in project.monitors if m.kind == "field"] == reference.monitors
    assert project.region.execution_mode != "tiled"


def test_slices_respect_yee_staggering(capture):
    from torchfdtd.solver import field_axes
    project, _ = capture.make_project()
    layout = capture.plane_layout(project)
    x, y, z = field_axes(project.region, "Ex")
    weight = layout["x_right_weight"]
    assert weight == pytest.approx(.5)
    assert (1 - weight) * x[layout["x_left"]] + weight * x[layout["x_right"]] == pytest.approx(0.)
    assert y[layout["y0"]] == pytest.approx(0.)
    assert z[layout["z_focus"]] == pytest.approx(1.65)


def test_sampling_resolves_carrier_and_gif_timing(capture):
    project, _ = capture.make_project()
    period = project.sources[0].wavelength * 1e-6 / 299792458.
    assert period / (capture.CAPTURE_EVERY * project.region.time_step) >= 8
    steps = np.arange(capture.CAPTURE_EVERY, project.region.steps + 1, capture.CAPTURE_EVERY)
    chosen = capture.display_indices(steps, project.region.time_step)
    assert len(chosen) == 294
    assert np.all(np.diff(chosen) == 1)
    assert 1000 / capture.FPS == 40


def test_renderer_cell_values_match_spatial_corners():
    renderer = load("render_metalens_3d_pulse")
    x, z = np.meshgrid(np.arange(3.), np.arange(4.), indexing="ij")
    vertices = np.stack((x, np.zeros_like(x), z), axis=-1)
    cells = renderer.quads(vertices)
    values = 2 * x + 3 * z
    expected = 2 * cells[..., 0].mean(axis=1) + 3 * cells[..., 2].mean(axis=1)
    np.testing.assert_array_equal(renderer.face_values(values), expected)


def test_recorded_checks_and_media_are_reproducible(capture):
    assets = ROOT / "docs/assets"
    record = json.loads((assets / "metalens-3d-record.json").read_text(encoding="utf-8"))
    rendered = json.loads((assets / "metalens-3d-render.json").read_text(encoding="utf-8"))
    generator_hash = hashlib.sha256(Path(capture.__file__).read_bytes()).hexdigest()
    assert record["generator_sha256"] == rendered["capture_sha256"] == generator_hash
    renderer_path = ROOT / "examples/visualization/render_metalens_3d_pulse.py"
    assert rendered["renderer_sha256"] == hashlib.sha256(renderer_path.read_bytes()).hexdigest()
    assert record["fixture_sha256"] == hashlib.sha256((capture.FIXTURE / "geometry_3d.json").read_bytes()).hexdigest()
    checks = record["recording"]
    assert checks["public_snapshot_max_abs_error"] == 0
    assert checks["public_compared_frames"] == 100
    assert all(checks["uninstrumented_exact_match"].values())
    assert np.all(np.diff(checks["probe_envelope_peak_fs"]) > 0)
    assert max(checks["probe_spectral_fraction_above_snapshot_nyquist"]) < 1e-4
    for check in record["spectral_checks_against_existing_fixture"]:
        assert max(check["absolute_difference_vs_committed"].values()) < 1e-4
    assert record["display"]["frames"] == rendered["frames"] == 294
    for name, digest in rendered["sha256"].items():
        assert hashlib.sha256((assets / name).read_bytes()).hexdigest() == digest


def test_readme_keeps_existing_movies_visible():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for name in ("microring-pulse", "phc-waveguide", "metalens-volume"):
        assert f"](docs/assets/{name}.gif)" in readme
    volume_doc = (ROOT / "docs/assets/metalens-volume.md").read_text(encoding="utf-8")
    assert "metalens-3d.md" in volume_doc
