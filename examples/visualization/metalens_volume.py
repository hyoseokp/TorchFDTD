"""Capture genuine 3D Ex voxels for a translucent metalens pulse movie.

The solver, source and device are the existing validated 3D metalens fixture.
Only the read-only field observer differs from metalens_3d_pulse.py.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch

import numpy as np
from scipy.ndimage import convolve1d

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import metalens_3d_pulse as reference

SPATIAL_STRIDE = 2
WINDOW_FS = (25., 135.)
FPS = 25


def volume_layout(project, geometry):
    from torchfdtd.solver import field_axes
    axes = field_axes(project.region, "Ex")
    bounds = ((-3.15, 3.15), (-3.15, 3.15), (geometry["pillar_top_um"], 2.7))
    indices = []
    for dim, (axis, (low, high)) in enumerate(zip(axes, bounds)):
        valid = np.flatnonzero((axis >= low - 1e-10) & (axis <= high + 1e-10))
        start = int(valid[0])
        # Retain y=0 so native volume samples can be checked against the public
        # solver snapshots without an interpolated comparison.
        if dim == 1:
            start += (int(np.argmin(abs(axis))) - start) % SPATIAL_STRIDE
        indices.append(np.arange(start, int(valid[-1]) + 1, SPATIAL_STRIDE))
    return dict(axes=[axis[index] for axis, index in zip(axes, indices)],
                indices=indices,
                slices=tuple(slice(int(i[0]), int(i[-1]) + 1, SPATIAL_STRIDE) for i in indices))


def cycle_weights(samples_per_period):
    """Integrate piecewise-linear Ex**2 samples over exactly one central period."""
    half = samples_per_period / 2
    k = np.arange(-int(np.ceil(half)), int(np.ceil(half)) + 1)

    def integral(x):
        return np.where(x <= -1, 0., np.where(x < 0, .5 * (x + 1) ** 2,
                        np.where(x < 1, 1 - .5 * (1 - x) ** 2, 1.)))

    return (integral(half - k) - integral(-half - k)) / samples_per_period


def cycle_rms(field, samples_per_period):
    power = np.square(field, dtype=np.float32)
    power = convolve1d(power, cycle_weights(samples_per_period), axis=0, mode="constant", cval=0.)
    return np.sqrt(np.maximum(power, 0), out=power)


def display_indices(steps, dt):
    time = steps * dt * 1e15
    return np.flatnonzero((time >= WINDOW_FS[0]) & (time <= WINDOW_FS[1]))


def simulate(out, backend="cuda"):
    import torch
    from torchfdtd import Simulation
    import torchfdtd.cuda_kernels as kernels

    torch.set_num_threads(2)
    torch.set_num_interop_threads(1)
    out.mkdir(parents=True, exist_ok=True)
    project, geometry = reference.make_project(backend)
    layout = volume_layout(project, geometry)
    axes = layout["axes"]
    steps = np.arange(reference.CAPTURE_EVERY, project.region.steps + 1, reference.CAPTURE_EVERY)
    shape = (len(steps), *(len(a) for a in axes))
    fields = np.lib.format.open_memmap(out / "Ex.npy", mode="w+", dtype=np.float32, shape=shape)
    configure = kernels.configure_cuda_kernel
    count = 0

    def observe(grid, choice):
        configure(grid, choice)
        update_H = grid.update_H
        completed = 0

        def update():
            nonlocal completed, count
            update_H()
            completed += 1
            if completed % reference.CAPTURE_EVERY == 0:
                field = grid.E[layout["slices"] + (0,)]
                fields[count] = field.detach().cpu().numpy() if isinstance(field, torch.Tensor) else field
                count += 1

        grid.update_H = update

    last = -10

    def progress(item):
        nonlocal last
        percent = int(100 * item["step"] / item["total"])
        if percent >= last + 10:
            print(json.dumps({"event": "capture", "percent": percent}), flush=True)
            last = percent

    print(json.dumps({"event": "start", "volume_shape": shape, "grid": project.region.shape}), flush=True)
    with patch.object(kernels, "configure_cuda_kernel", observe):
        result = Simulation(project).run(cuda_graph=False, progress=progress)
    assert count == len(steps) and np.isfinite(fields).all()
    fields.flush()
    ix, iy, iz = layout["indices"]
    y0 = int(np.argmin(abs(axes[1])))
    assert abs(axes[1][y0]) < 1e-10
    error = 0.
    for j, step in enumerate(result.frame_steps):
        i = int(step // reference.CAPTURE_EVERY - 1)
        expected = result.frames[j][np.ix_(ix, iz)]
        error = max(error, float(np.max(abs(fields[i, :, y0, :] - expected))))
    assert error == 0. and len(result.frames) == 100

    print(json.dumps({"event": "uninstrumented_check"}), flush=True)
    control = Simulation(project).run(cuda_graph=False)
    equal = {name: bool(np.array_equal(getattr(result, name), getattr(control, name)))
             for name in ("electric", "magnetic", "signals", "frames", "frame_steps")}
    equal["dft_fields"] = all(np.array_equal(result.field_monitor(m.id)["fields"], control.field_monitor(m.id)["fields"])
                              for m in project.monitors if m.kind == "field")
    assert all(equal.values()), equal
    dt = project.region.time_step
    period = project.sources[0].wavelength * 1e-6 / 299792458.
    samples = period / (reference.CAPTURE_EVERY * dt)
    shown = display_indices(steps, dt)
    radius = len(cycle_weights(samples)) // 2
    assert shown[0] >= radius and shown[-1] < len(steps) - radius
    rms = cycle_rms(fields, samples)
    np.save(out / "Ex-rms.npy", rms)
    np.savez(out / "coordinates.npz", x=axes[0], y=axes[1], z=axes[2], steps=steps, dt=dt)
    focus_z = int(np.argmin(abs(axes[2] - 1.65)))
    poster = int(shown[np.argmax(np.max(rms[shown, :, :, focus_z], axis=(1, 2)))])
    from scipy.signal import hilbert
    peaks = (result.times[np.argmax(abs(hilbert(result.signals, axis=0)), axis=0)] * 1e15).tolist()
    assert np.all(np.diff(peaks) > 0)
    record = {
        "schema": "torchfdtd-metalens-volume-v1",
        "solver_commit": subprocess.check_output(["git", "-C", str(reference.REPO), "rev-parse", "HEAD"], text=True).strip(),
        "generator_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "reference_capture_sha256": hashlib.sha256(Path(reference.__file__).read_bytes()).hexdigest(),
        "fixture_sha256": geometry["_sha256"],
        "model": "Unchanged 112-pillar 3D Meep-comparison fixture, full resident Yee/CPML FDTD",
        "grid": list(project.region.shape), "steps": project.region.steps,
        "backend": result.summary["backend"], "kernel": result.summary["cuda_kernel"],
        "device": result.summary.get("gpu"), "precision": "float32",
        "dt_fs": dt * 1e15, "raw_frames": len(steps), "volume_shape": list(shape[1:]),
        "recording": {"component": "Ex on native Yee coordinates", "spatial_stride": SPATIAL_STRIDE,
                      "every_steps": reference.CAPTURE_EVERY, "samples_per_optical_period": samples,
                      "crop_bounds_um": [[float(a[0]), float(a[-1])] for a in axes],
                      "public_compared_frames": len(result.frames), "public_snapshot_max_abs_error": error,
                      "uninstrumented_exact_match": equal, "probe_envelope_peak_fs": peaks},
        "rms_reference": {"quantity": "sqrt of one-central-optical-period mean Ex^2, used to select the poster time and for optional RMS rendering",
                    "period_fs": period * 1e15, "averaging_weights": cycle_weights(samples).tolist(),
                    "mean_method": "exact integral of piecewise-linear interpolation of recorded Ex^2",
                    "fixed_RMS_max": float(rms[shown].max()), "poster_index": poster,
                    "frames": len(shown), "fps": FPS,
                    "window_fs": [float(steps[shown[0]] * dt * 1e15), float(steps[shown[-1]] * dt * 1e15)]},
        "source_sha256": {name: hashlib.sha256((reference.REPO / name).read_bytes()).hexdigest()
                          for name in ("torchfdtd/solver.py", "torchfdtd/cuda_kernels.py", "torchfdtd/boundaries.py")},
        "scope": "3D field-envelope visualization, not total intensity, holography or a new lens-performance claim",
    }
    (out / "metalens-volume-record.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "validated", "frames": len(shown), "max": record["rms_reference"]["fixed_RMS_max"],
                      "poster_time_fs": float(steps[poster] * dt * 1e15)}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=reference.REPO / "results/metalens-volume")
    parser.add_argument("--backend", choices=("cuda", "cpu"), default="cuda")
    args = parser.parse_args()
    simulate(args.out, args.backend)
