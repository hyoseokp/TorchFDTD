"""Native 3D sampling, transfer functions and provenance of the volume movie."""
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
    return load("metalens_volume")


def test_volume_samples_are_native_yee_nodes(capture):
    from torchfdtd.solver import field_axes
    project, geometry = capture.reference.make_project()
    layout = capture.volume_layout(project, geometry)
    assert tuple(len(a) for a in layout["axes"]) == (63, 63, 43)
    for full, sampled, index, section in zip(field_axes(project.region, "Ex"), layout["axes"],
                                           layout["indices"], layout["slices"]):
        np.testing.assert_array_equal(full[index], sampled)
        np.testing.assert_array_equal(full[section], sampled)
        np.testing.assert_allclose(np.diff(sampled), .1)
    assert np.min(abs(layout["axes"][1])) < 1e-10
    assert layout["axes"][2][0] >= geometry["pillar_top_um"]


def test_cycle_average_has_unit_gain_and_retains_constant_field(capture):
    project, _ = capture.reference.make_project()
    period = project.sources[0].wavelength * 1e-6 / 299792458.
    samples = period / (5 * project.region.time_step)
    weights = capture.cycle_weights(samples)
    assert weights.sum() == pytest.approx(1.)
    assert np.all(weights >= 0)
    np.testing.assert_allclose(weights, weights[::-1])
    values = np.full((100, 2, 3, 4), -2., dtype=np.float32)
    np.testing.assert_allclose(capture.cycle_rms(values, samples)[10:-10], 2.)
    signal = np.sin(2 * np.pi * np.arange(1000) / samples)[:, None, None, None]
    np.testing.assert_allclose(capture.cycle_rms(signal, samples)[10:-10], np.sqrt(.5), atol=.002)


def test_native_temporal_sampling_is_not_decimated(capture):
    project, _ = capture.reference.make_project()
    steps = np.arange(5, project.region.steps + 1, 5)
    shown = capture.display_indices(steps, project.region.time_step)
    assert len(shown) == 231
    assert np.all(np.diff(shown) == 1)
    assert 1000 / capture.FPS == 40


def test_opacity_is_symmetric_and_quantized_for_pyvista():
    renderer = load("render_metalens_volume")
    opacity = renderer.opacity_for_mode()
    assert opacity.dtype == np.uint8
    assert opacity.shape == (256,)
    assert opacity[127] == opacity[128] == 0
    assert opacity[0] == opacity[-1] == round(.6 * 255)
    np.testing.assert_array_equal(opacity, opacity[::-1])


def test_volume_provenance_and_files(capture):
    assets = ROOT / "docs/assets"
    record = json.loads((assets / "metalens-volume-record.json").read_text(encoding="utf-8"))
    rendered = json.loads((assets / "metalens-volume-render.json").read_text(encoding="utf-8"))
    assert record["generator_sha256"] == rendered["capture_sha256"] == hashlib.sha256(Path(capture.__file__).read_bytes()).hexdigest()
    assert record["reference_capture_sha256"] == hashlib.sha256(Path(capture.reference.__file__).read_bytes()).hexdigest()
    assert rendered["renderer_sha256"] == hashlib.sha256((ROOT / "examples/visualization/render_metalens_volume.py").read_bytes()).hexdigest()
    assert record["fixture_sha256"] == hashlib.sha256((capture.reference.FIXTURE / "geometry_3d.json").read_bytes()).hexdigest()
    checks = record["recording"]
    assert checks["public_snapshot_max_abs_error"] == 0
    assert checks["public_compared_frames"] == 100
    assert all(checks["uninstrumented_exact_match"].values())
    assert np.all(np.diff(checks["probe_envelope_peak_fs"]) > 0)
    assert checks["samples_per_optical_period"] >= 8
    assert record["rms_reference"]["frames"] == rendered["frames"] == 231
    assert rendered["field"] == "instantaneous signed Ex"
    assert rendered["scalar_range"] == [-1, 1]
    assert rendered["temporal_interpolation"] == "none"
    assert rendered["fixed_field_max"] > 0
    for name, digest in rendered["sha256"].items():
        assert hashlib.sha256((assets / name).read_bytes()).hexdigest() == digest


def test_volume_readme_links_and_old_slices_are_preserved():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for name in ("microring-pulse", "phc-waveguide", "metalens-volume"):
        assert f"](docs/assets/{name}.gif)" in readme
    for suffix in ("gif", "mp4", "md", "-record.json", "-render.json"):
        name = "metalens-3d" + (suffix if suffix.startswith("-") else "." + suffix)
        assert (ROOT / "docs/assets" / name).is_file()
