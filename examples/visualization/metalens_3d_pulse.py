"""Record actual 3D FDTD fields of the Meep-comparison metalens fixture.

python examples/visualization/metalens_3d_pulse.py

No tiling, exterior FFT propagation or frequency-domain reconstruction is used.
The unchanged fixture is solved through its full 2500-step time window.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch

for name in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
    os.environ.setdefault(name, "2")

import numpy as np
from scipy.signal import hilbert

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
FIXTURE = REPO / "examples/meep_comparison/metalens"
CAPTURE_EVERY = 5
CROP_TRANSVERSE = (-3.15, 3.15)
CROP_Z = (-2.7, 2.7)
DISPLAY_WINDOW_FS = (20., 160.)
FPS = 25


def fixture_module():
    path = FIXTURE / "torchfdtd_metalens.py"
    spec = importlib.util.spec_from_file_location("metalens_movie_fixture", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_project(backend="cuda", with_lens=True):
    from torchfdtd import Monitor
    module = fixture_module()
    geometry = module.mc.load_geometry("3d")
    project = module.build_3d(geometry, backend=backend, with_lens=with_lens)
    project.name = "3D metalens pulse focusing" if with_lens else "3D metalens reference cell"
    project.region.field = "Ex"
    project.region.slice_axis = "y"
    project.region.slice_position = 0.
    project.region.snapshot_interval = CAPTURE_EVERY
    project.monitors += [Monitor(id=f"probe_{i}", name=f"probe z={z:g} um", component="Ex", center=(0, 0, z))
                         for i, z in enumerate((-1.2, 0., 1.65, 2.5))]
    module.check_grid(project, geometry)
    return project, geometry


def plane_layout(project):
    from torchfdtd.solver import field_axes
    x, y, z = field_axes(project.region, "Ex")
    indices = [np.flatnonzero((axis >= bounds[0] - 1e-10) & (axis <= bounds[1] + 1e-10))
               for axis, bounds in ((x, CROP_TRANSVERSE), (y, CROP_TRANSVERSE), (z, CROP_Z))]
    ix, iy, iz = indices
    # Ex is half a Yee cell off x=0. Interpolate between the two bracketing
    # columns to put the YZ movie exactly on x=0, not on a shifted plane.
    right = int(np.searchsorted(x, 0.))
    left = right - 1
    weight = float(-x[left] / (x[right] - x[left]))
    y0 = int(np.argmin(abs(y)))
    z_focus = int(np.argmin(abs(z - 1.65)))
    assert abs(y[y0]) < 1e-10 and abs(z[z_focus] - 1.65) < 1e-10
    return dict(x=x[ix], y=y[iy], z=z[iz], ix=ix, iy=iy, iz=iz,
                xs=slice(int(ix[0]), int(ix[-1]) + 1), ys=slice(int(iy[0]), int(iy[-1]) + 1),
                zs=slice(int(iz[0]), int(iz[-1]) + 1), y0=y0, z_focus=z_focus,
                x_left=left, x_right=right, x_right_weight=weight)


def display_indices(steps, dt):
    t = np.asarray(steps) * dt * 1e15
    return np.flatnonzero((t >= DISPLAY_WINDOW_FS[0]) & (t <= DISPLAY_WINDOW_FS[1]))


def simulate(out, backend="cuda"):
    import torch
    from torchfdtd import Simulation
    import torchfdtd.cuda_kernels as kernels

    torch.set_num_threads(2)
    torch.set_num_interop_threads(1)
    out.mkdir(parents=True, exist_ok=True)
    project, geometry = make_project(backend)
    layout = plane_layout(project)
    project.save(out / "metalens-3d-project.json")
    steps = np.arange(CAPTURE_EVERY, project.region.steps + 1, CAPTURE_EVERY)
    nx, ny, nz = (len(layout[axis]) for axis in ("x", "y", "z"))
    planes = {"xz": np.empty((len(steps), nx, nz), dtype=np.float32),
              "yz": np.empty((len(steps), ny, nz), dtype=np.float32),
              "xy": np.empty((len(steps), nx, ny), dtype=np.float32)}
    original_configure = kernels.configure_cuda_kernel
    count = 0

    def host(field):
        return field.detach().cpu().numpy() if isinstance(field, torch.Tensor) else np.asarray(field)

    def observe(grid, choice):
        original_configure(grid, choice)
        original_update = grid.update_H
        completed = 0

        def update_and_record():
            nonlocal completed, count
            original_update()
            completed += 1
            if completed % CAPTURE_EVERY:
                return
            e = grid.E[..., 0]
            xs, ys, zs = (layout[k] for k in ("xs", "ys", "zs"))
            planes["xz"][count] = host(e[xs, layout["y0"], zs])
            w = layout["x_right_weight"]
            planes["yz"][count] = host((1 - w) * e[layout["x_left"], ys, zs] + w * e[layout["x_right"], ys, zs])
            planes["xy"][count] = host(e[xs, ys, layout["z_focus"]])
            count += 1

        grid.update_H = update_and_record

    last_report = -10

    def progress(item):
        nonlocal last_report
        percent = int(100 * item["step"] / item["total"])
        if percent >= last_report + 10:
            print(json.dumps({"event": "record", "percent": percent}), flush=True)
            last_report = percent

    print(json.dumps({"event": "start", "grid": list(project.region.shape), "steps": project.region.steps,
                      "backend": backend, "frames": len(steps)}), flush=True)
    with patch.object(kernels, "configure_cuda_kernel", observe):
        result = Simulation(project).run(cuda_graph=False, progress=progress)
    assert count == len(steps) and result.summary["steps"] == project.region.steps
    assert all(np.isfinite(array).all() for array in planes.values())
    common = sorted(set(steps.tolist()).intersection(result.frame_steps.tolist()))
    error = 0.
    for j, step in enumerate(result.frame_steps):
        i = int(step // CAPTURE_EVERY - 1)
        expected = result.frames[j][np.ix_(layout["ix"], layout["iz"])]
        error = max(error, float(np.max(abs(planes["xz"][i] - expected))))
    assert len(common) == 100 and error == 0., (len(common), error)
    result.save(out / "metalens-3d-result.npz")
    np.savez_compressed(out / "metalens-3d-planes.npz", **planes,
                        x=layout["x"], y=layout["y"], z=layout["z"], steps=steps,
                        dt=project.region.time_step)

    print(json.dumps({"event": "uninstrumented_check"}), flush=True)
    unobserved = Simulation(project).run(cuda_graph=False)
    equal = {name: bool(np.array_equal(getattr(result, name), getattr(unobserved, name)))
             for name in ("electric", "magnetic", "signals", "frames", "frame_steps")}
    equal["dft_fields"] = all(np.array_equal(result.field_monitor(m.id)["fields"], unobserved.field_monitor(m.id)["fields"])
                              for m in project.monitors if m.kind == "field")
    assert all(equal.values()), equal
    del unobserved

    print(json.dumps({"event": "bare_cell_check"}), flush=True)
    bare_project, _ = make_project(backend, with_lens=False)
    bare = Simulation(bare_project).run(cuda_graph=False)
    module = fixture_module()
    observables = module.observables_3d(result, bare, geometry)
    committed = json.loads((REPO / "docs/validation/meep_comparison/metalens_3d_torchfdtd.json").read_text(encoding="utf-8"))
    comparisons = []
    metrics = ("axis_peak_z_um", "fwhm_x_um", "fwhm_y_um", "efficiency")
    for actual, expected in zip(observables["summary"], committed["observables"]["summary"]):
        differences = {name: abs(actual[name] - expected[name]) for name in metrics}
        assert all(differences[name] < max(1e-6, abs(expected[name]) * 1e-4) for name in metrics), differences
        comparisons.append(dict(wavelength_um=actual["wavelength_um"], actual={name: actual[name] for name in metrics},
                                absolute_difference_vs_committed=differences))

    dt = project.region.time_step
    period = project.sources[0].wavelength * 1e-6 / module.mc.C0
    sample_dt = CAPTURE_EVERY * dt
    assert period / sample_dt >= 8
    spectrum = abs(np.fft.rfft(result.signals * np.hanning(len(result.signals))[:, None], axis=0)) ** 2
    frequencies = np.fft.rfftfreq(len(result.signals), dt)
    aliased = spectrum[frequencies >= .5 / sample_dt].sum(axis=0) / spectrum.sum(axis=0)
    assert float(aliased.max()) < 1e-4
    peaks = (result.times[np.argmax(abs(hilbert(result.signals, axis=0)), axis=0)] * 1e15).tolist()
    assert np.all(np.diff(peaks) > 0), peaks
    shown = display_indices(steps, dt)
    vmax = max(float(np.max(abs(array[shown]))) for array in planes.values())
    record = {
        "schema": "torchfdtd-metalens-3d-movie-v1",
        "solver_commit": subprocess.check_output(["git", "-C", str(REPO), "rev-parse", "HEAD"], text=True).strip(),
        "generator_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "fixture": "examples/meep_comparison/metalens/geometry_3d.json", "fixture_sha256": geometry["_sha256"],
        "model": "112 silicon cylinders in air, full 3D resident Yee/CPML FDTD, unchanged Meep-comparison fixture",
        "backend": result.summary["backend"], "kernel": result.summary["cuda_kernel"],
        "device": result.summary.get("gpu"), "precision": "float32",
        "grid": list(project.region.shape), "steps": project.region.steps, "dt_fs": dt * 1e15,
        "wavelength_um": project.sources[0].wavelength, "raw_frames": len(steps),
        "recording": {"every_steps": CAPTURE_EVERY, "sample_interval_fs": sample_dt * 1e15,
                      "samples_per_optical_period": period / sample_dt, "xz_plane_y_um": 0.,
                      "yz_plane_x_um": 0., "yz_x_interpolation_right_weight": layout["x_right_weight"],
                      "xy_plane_z_um": 1.65, "public_snapshot_max_abs_error": error,
                      "public_compared_frames": len(common), "uninstrumented_exact_match": equal,
                      "probe_spectral_fraction_above_snapshot_nyquist": aliased.tolist(),
                      "probe_z_um": [-1.2, 0., 1.65, 2.5], "probe_envelope_peak_fs": peaks},
        "display": {"field": "instantaneous signed Ex", "temporal_interpolation": "none",
                    "frames": len(shown), "fps": FPS, "duration_s": len(shown) / FPS,
                    "window_fs": [float(steps[shown[0]] * dt * 1e15), float(steps[shown[-1]] * dt * 1e15)],
                    "fixed_Emax_reduced_units": vmax, "transverse_crop_um": list(CROP_TRANSVERSE), "z_crop_um": list(CROP_Z)},
        "spectral_checks_against_existing_fixture": comparisons,
        "scope": "3D transient field visualization, not an optimized-lens or new performance claim",
        "source_sha256": {name: hashlib.sha256((REPO / name).read_bytes()).hexdigest()
                          for name in ("torchfdtd/solver.py", "torchfdtd/cuda_kernels.py", "torchfdtd/boundaries.py")},
    }
    (out / "metalens-3d-record.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "validated", "display_frames": len(shown), "samples_per_period": period / sample_dt,
                      "probe_peaks_fs": peaks, "alias_fraction": float(aliased.max()), "Emax": vmax}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=REPO / "results/metalens-3d-video")
    parser.add_argument("--backend", choices=("cuda", "cpu"), default="cuda")
    args = parser.parse_args()
    simulate(args.out, args.backend)
