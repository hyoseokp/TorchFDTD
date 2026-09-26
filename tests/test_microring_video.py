"""Lightweight model and temporal-sampling checks for the README movie."""
import importlib.util
import hashlib
import json
from pathlib import Path

import numpy as np
import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="module")
def movie():
    spec = importlib.util.spec_from_file_location(
        "microring_movie_test", ROOT / "examples/visualization/microring_pulse.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_movie_retains_validated_device_and_source(movie):
    geometry = json.loads((movie.FIXTURE / "geometry.json").read_text(encoding="utf-8"))
    reference = movie.fixture_module().build_project(geometry, True)
    project = movie.make_project()
    assert [x.model_dump() for x in project.structures] == [x.model_dump() for x in reference.structures]
    assert [x.model_dump() for x in project.sources] == [x.model_dump() for x in reference.sources]
    assert project.materials == reference.materials
    assert project.region.shape == reference.region.shape
    assert project.region.time_step == reference.region.time_step
    assert project.region.pml_cells == reference.region.pml_cells
    assert project.region.steps % 800 == 0
    assert project.region.steps < reference.region.steps
    assert all(x.kind == "point" for x in project.monitors)


def test_raw_recording_resolves_optical_period(movie):
    project = movie.make_project()
    period = project.sources[0].wavelength * 1e-6 / movie.C0
    assert period / (movie.CAPTURE_EVERY * project.region.time_step) >= 8
    assert 1000 / movie.FPS == 40  # exact GIF frame timing


def test_optical_rms_of_sinusoid_is_constant_amplitude_over_sqrt_two(movie):
    period = 5.17e-15
    dt = period / 16
    t = np.arange(1600) * dt
    field = 2. * np.sin(2 * np.pi * t / period)
    actual = movie.optical_rms(field, dt, period)
    np.testing.assert_allclose(actual[80:-80], np.sqrt(2), atol=1e-4)


def test_rms_filter_preserves_direction_of_moving_pulse(movie):
    period = 5.17e-15
    dt = period / 16
    t = np.arange(1600) * dt
    delays = np.array([80., 130., 180.]) * 1e-15
    tau = t[:, None] - delays
    fields = np.exp(-.5 * (tau / 20e-15) ** 2) * np.sin(2 * np.pi * tau / period)
    envelopes = movie.optical_rms(fields, dt, period)
    peaks = t[np.argmax(envelopes, axis=0)]
    np.testing.assert_allclose(peaks, delays, atol=dt)
    assert np.all(np.diff(peaks) > 0)


def test_published_record_and_assets_match_generator(movie):
    assets = ROOT / "docs/assets"
    record = json.loads((assets / "microring-pulse-record.json").read_text(encoding="utf-8"))
    rendered = json.loads((assets / "microring-pulse-render.json").read_text(encoding="utf-8"))
    generator_hash = hashlib.sha256(Path(movie.__file__).read_bytes()).hexdigest()
    assert record["generator_sha256"] == rendered["generator_sha256"] == generator_hash
    assert record["fixture_sha256"] == hashlib.sha256((movie.FIXTURE / "geometry.json").read_bytes()).hexdigest()
    assert record["recording"]["public_snapshot_max_abs_error"] == 0
    assert len(record["recording"]["public_compared_steps"]) == 100
    assert max(record["display"]["probe_spectral_fraction_above_display_nyquist"]) < 1e-4
    assert record["display"]["frames"] == rendered["frames"] == 488
    assert rendered["duration_s"] == rendered["frames"] / rendered["fps"]
    for name, digest in rendered["sha256"].items():
        assert hashlib.sha256((assets / name).read_bytes()).hexdigest() == digest
