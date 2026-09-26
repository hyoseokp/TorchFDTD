"""Record a real FDTD pulse circulating in the validated 2D microring fixture.

Run from a source checkout with the optional plotting dependencies installed:
    python examples/visualization/microring_pulse.py

Only this process is instrumented. The Yee/CPML updates are unchanged. CUDA
Graphs are disabled because recording must run once per actual time step.
The movie displays optical-cycle RMS Ez, not sparsely sampled carrier phase.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import os
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch

for key in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
    os.environ.setdefault(key, "2")

import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.signal import find_peaks

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))
FIXTURE = REPO / "examples/meep_comparison/microring"
CAPTURE_EVERY = 8
DISPLAY_EVERY = 4
SPATIAL_STRIDE = 2
FPS = 25
C0 = 299792458.0
CROP_X = (-6.7, 6.7)
CROP_Y = (-6.0, 5.7)


def fixture_module():
    spec = importlib.util.spec_from_file_location("microring_movie_fixture", FIXTURE / "torchfdtd_microring.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_project(backend="cuda", stop_fs=880.):
    from torchfdtd import Monitor

    geometry = json.loads((FIXTURE / "geometry.json").read_text(encoding="utf-8"))
    project = fixture_module().build_project(geometry, with_ring=True)
    project.name = "Microring pulse circulation | 2D Ez"
    # Multiples of 800 make the standard public snapshots coincide with the
    # dense observer, allowing an exact independent recording comparison.
    project.region.steps = math.ceil(stop_fs * 1e-15 / project.region.time_step / 800) * 800
    project.region.snapshot_interval = CAPTURE_EVERY
    project.region.backend = backend
    if backend == "cpu":
        project.region.cuda_kernel = "torch"
        project.region.cuda_monitor_kernel = "torch"
    radius = .5 * (geometry["ring"]["outer_radius_um"] + geometry["ring"]["inner_radius_um"])
    probes = [("bus_in", (-6., geometry["bus"]["center_y_um"], 0)),
              ("ring_bottom", (0, -radius, 0)), ("ring_right", (radius, 0, 0)),
              ("ring_top", (0, radius, 0)), ("ring_left", (-radius, 0, 0)),
              ("bus_out", (6., geometry["bus"]["center_y_um"], 0))]
    # Transmission DFT monitors are unnecessary for a short qualitative movie.
    project.monitors = [Monitor(id=name, name=name, center=center, component="Ez") for name, center in probes]
    return project


def optical_rms(values, sample_dt, period, axis=0):
    """sqrt(Gaussian average of E^2), sigma = half the central optical period.

    This is a symmetric, zero-phase temporal average, not a carrier-phase
    animation. A constant-envelope sinusoid gives amplitude/sqrt(2).
    """
    squared = np.square(values, dtype=np.float32)
    gaussian_filter1d(squared, sigma=.5 * period / sample_dt, axis=axis,
                      mode="constant", cval=0., truncate=4., output=squared)
    return np.sqrt(np.maximum(squared, 0.), out=squared)


def snapshot_overlap_error(dense, steps, result, ix, iy):
    nx, ny, _ = result.project.region.shape
    sx, sy = math.ceil(nx / 256), math.ceil(ny / 256)
    cx, cy = np.flatnonzero(ix % sx == 0), np.flatnonzero(iy % sy == 0)
    lookup = {int(step): i for i, step in enumerate(steps)}
    common = sorted(set(lookup).intersection(result.frame_steps.tolist()))
    if not common or not len(cx) or not len(cy):
        raise AssertionError("No overlapping public snapshots to validate")
    error = 0.
    for j, step in enumerate(result.frame_steps):
        if int(step) not in lookup:
            continue
        observed = dense[lookup[int(step)]][np.ix_(cx, cy)]
        reference = result.frames[j][np.ix_(ix[cx] // sx, iy[cy] // sy)]
        error = max(error, float(np.max(np.abs(observed - reference))))
    return error, common


def simulate(out, backend, stop_fs):
    import torch
    from torchfdtd import Simulation
    import torchfdtd.cuda_kernels as kernels
    from torchfdtd.solver import field_axes

    torch.set_num_threads(2)
    torch.set_num_interop_threads(1)
    project = make_project(backend, stop_fs)
    out.mkdir(parents=True, exist_ok=True)
    project.save(out / "microring-pulse-project.json")
    x, y, _ = field_axes(project.region, "Ez")
    ix = np.flatnonzero((x >= CROP_X[0]) & (x <= CROP_X[1]))[::SPATIAL_STRIDE]
    iy = np.flatnonzero((y >= CROP_Y[0]) & (y <= CROP_Y[1]))[::SPATIAL_STRIDE]
    xs = slice(int(ix[0]), int(ix[-1]) + 1, SPATIAL_STRIDE)
    ys = slice(int(iy[0]), int(iy[-1]) + 1, SPATIAL_STRIDE)
    steps = np.arange(CAPTURE_EVERY, project.region.steps + 1, CAPTURE_EVERY)
    dense = np.lib.format.open_memmap(out / "dense-ez.npy", mode="w+", dtype="float32",
                                      shape=(len(steps), len(ix), len(iy)))
    original_configure = kernels.configure_cuda_kernel
    recorded_count = 0

    def configure_and_observe(grid, choice):
        original_configure(grid, choice)
        original_update = grid.update_H
        completed = 0

        def observed_update():
            nonlocal completed, recorded_count
            original_update()
            completed += 1
            if completed % CAPTURE_EVERY == 0:
                field = grid.E[xs, ys, 0, 2]
                dense[recorded_count] = field.detach().cpu().numpy() if isinstance(field, torch.Tensor) else field
                recorded_count += 1

        grid.update_H = observed_update

    last_report = -10

    def progress(item):
        nonlocal last_report
        percent = int(100 * item["step"] / item["total"])
        if percent >= last_report + 10:
            print(json.dumps({"event": "simulate", "percent": percent, "seconds": item["elapsed"]}), flush=True)
            last_report = percent

    print(json.dumps({"event": "start", "backend": backend, "steps": project.region.steps,
                      "dense_frames": len(steps), "dense_shape": list(dense.shape)}), flush=True)
    with patch.object(kernels, "configure_cuda_kernel", configure_and_observe):
        result = Simulation(project).run(progress=progress, cuda_graph=False)
    dense.flush()
    assert recorded_count == len(steps)
    assert result.summary["steps"] == project.region.steps
    assert result.summary["backend"] == backend
    assert np.isfinite(dense).all() and np.max(np.abs(dense)) > 0
    error, common = snapshot_overlap_error(dense, steps, result, ix, iy)
    assert error == 0., error
    result.save(out / "microring-result.npz")
    period = project.sources[0].wavelength * 1e-6 / C0
    dense_dt = CAPTURE_EVERY * project.region.time_step
    assert period / dense_dt >= 8
    # Filter one spatial block at a time, keeping the large raw data on disk.
    # Exclude the filter's four-sigma edge margins, which otherwise see zero padding.
    margin = math.ceil(2 * period / dense_dt)
    shown = np.arange(margin, len(steps) - margin, DISPLAY_EVERY)
    rms = np.empty((len(shown), len(ix), len(iy)), dtype=np.float32)
    for start in range(0, len(ix), 16):
        section = slice(start, min(start + 16, len(ix)))
        rms[:, section] = optical_rms(dense[:, section], dense_dt, period)[shown]
    np.savez_compressed(out / "rms-frames.npz", rms=rms, x=x[ix], y=y[iy],
                        frame_steps=steps[shown], dt=project.region.time_step)

    probe_rms = optical_rms(result.signals, project.region.time_step, period)
    arrivals = {}
    for j, monitor in enumerate(project.monitors):
        trace = probe_rms[:, j]
        peaks, _ = find_peaks(trace, height=.35 * trace.max(), prominence=.1 * trace.max(),
                              distance=int(35e-15 / project.region.time_step))
        arrivals[monitor.id] = (result.times[peaks] * 1e15).tolist()
    # Check the first strong packet reaches the four ring quadrants in order.
    ring_first = [arrivals[name][0] for name in ("ring_bottom", "ring_right", "ring_top", "ring_left")]
    assert np.all(np.diff(ring_first) > 0), arrivals
    assert arrivals["bus_in"][0] < ring_first[0] < arrivals["bus_out"][0], arrivals
    # Measure the spectrum of the displayed probe envelope before decimation.
    probe_shown_dense = optical_rms(result.signals[CAPTURE_EVERY - 1::CAPTURE_EVERY], dense_dt, period)
    spectrum = abs(np.fft.rfft(probe_shown_dense * np.hanning(len(steps))[:, None], axis=0)) ** 2
    frequencies = np.fft.rfftfreq(len(steps), dense_dt)
    aliased = spectrum[frequencies >= .5 / (dense_dt * DISPLAY_EVERY)].sum(axis=0) / spectrum.sum(axis=0)
    assert np.max(aliased) < 1e-4, aliased
    record = {
        "schema": "torchfdtd-microring-movie-v1",
        "solver_commit": subprocess.check_output(["git", "-C", str(REPO), "rev-parse", "HEAD"], text=True).strip(),
        "fixture": "examples/meep_comparison/microring/geometry.json",
        "fixture_sha256": hashlib.sha256((FIXTURE / "geometry.json").read_bytes()).hexdigest(),
        "generator_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "model": "2D constant-index effective-index microring and bus, unchanged fixture geometry and source",
        "backend": result.summary["backend"], "kernel": result.summary["cuda_kernel"],
        "grid": list(project.region.shape), "dt_fs": project.region.time_step * 1e15,
        "steps": project.region.steps, "wavelength_um": project.sources[0].wavelength,
        "recording": {"every_steps": CAPTURE_EVERY, "samples_per_optical_period": period / dense_dt,
                      "raw_snapshots": len(steps), "spatial_stride": SPATIAL_STRIDE,
                      "public_snapshot_max_abs_error": error, "public_compared_steps": common},
        "display": {"field": "optical-cycle RMS Ez / one global maximum",
                    "definition": "sqrt(Gaussian_t * Ez^2), Gaussian sigma = half the source optical period",
                    "gaussian_sigma_fs": .5 * period * 1e15, "temporal_interpolation": "none",
                    "frames": len(shown), "frame_interval_fs": DISPLAY_EVERY * dense_dt * 1e15,
                    "start_fs": steps[shown[0]] * project.region.time_step * 1e15,
                    "end_fs": steps[shown[-1]] * project.region.time_step * 1e15,
                    "fps": FPS, "fixed_rms_max": float(rms.max()),
                    "probe_spectral_fraction_above_display_nyquist": aliased.tolist()},
        "probe_envelope_peak_arrivals_fs": arrivals,
        "propagation_check": "first strong pulse reaches bottom, right, top, left in order (counterclockwise)",
        "scope": "qualitative transient visualization, not a new Q, transmission or performance benchmark",
        "source_sha256": {str(path): hashlib.sha256((REPO / path).read_bytes()).hexdigest()
                          for path in ("torchfdtd/solver.py", "torchfdtd/cuda_kernels.py", "torchfdtd/boundaries.py")},
    }
    (out / "microring-pulse-record.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "validated", "frames": len(shown), "first_ring_arrivals_fs": ring_first,
                      "observer_error": error, "alias_fraction": float(np.max(aliased))}), flush=True)


def render(out):
    import matplotlib
    matplotlib.use("Agg")
    from matplotlib import font_manager
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap
    from matplotlib.patches import Circle
    import imageio.v2 as imageio
    import imageio_ffmpeg
    from PIL import Image

    arial = Path("C:/Windows/Fonts/arial.ttf")
    if arial.exists():
        font_manager.fontManager.addfont(str(arial))
    installed = {font.name for font in font_manager.fontManager.ttflist}
    family = next(name for name in ("Arial", "Liberation Sans", "DejaVu Sans") if name in installed)
    plt.rcParams.update({"font.family": family, "font.size": 16, "axes.linewidth": .8,
                         "mathtext.fontset": "custom", "mathtext.rm": family,
                         "mathtext.it": family + ":italic", "mathtext.bf": family + ":bold"})
    with np.load(out / "rms-frames.npz") as data:
        rms, x, y = data["rms"], data["x"], data["y"]
        times_fs = data["frame_steps"] * float(data["dt"]) * 1e15
    vmax = float(rms.max())
    # Linear normalization and one fixed colorbar for the entire movie. A
    # high-contrast blue ramp keeps the weaker circulating packet visible.
    cmap = LinearSegmentedColormap.from_list("white_blue", [(0., "#ffffff"), (.04, "#e0edf5"),
                 (.18, "#75acd0"), (.4, "#267daf"), (1., "#093d69")], N=256)
    fig = plt.figure(figsize=(10.8, 9.4), dpi=120, facecolor="white")
    ax = fig.add_axes([.105, .10, .75, .83])
    im = ax.imshow(rms[0].T / vmax, origin="lower",
                   extent=(x[0] - (x[1] - x[0]) / 2, x[-1] + (x[1] - x[0]) / 2,
                           y[0] - (y[1] - y[0]) / 2, y[-1] + (y[1] - y[0]) / 2),
                   cmap=cmap, vmin=0, vmax=1, interpolation="bilinear", aspect="equal")
    for radius in (4.5, 5.):
        ax.add_patch(Circle((0, 0), radius, fill=False, edgecolor="#969da3", linewidth=.8, zorder=3))
    for edge in (-5.304 - .25, -5.304 + .25):
        ax.axhline(edge, color="#969da3", linewidth=.8, zorder=3)
    ax.set(xlim=CROP_X, ylim=CROP_Y, xlabel="x (µm)", ylabel="y (µm)",
           xticks=[-6, -3, 0, 3, 6], yticks=[-6, -3, 0, 3])
    ax.tick_params(length=4)
    colorbar = fig.colorbar(im, cax=fig.add_axes([.89, .17, .017, .64]), ticks=[0, .5, 1])
    colorbar.set_label(r"$E_{z,\mathrm{rms}} / E_{\max}$", labelpad=12)
    colorbar.outline.set_linewidth(.7)
    video = out / "microring-pulse.mp4"
    writer = imageio.get_writer(video, format="FFMPEG", fps=FPS, codec="libx264",
                               quality=None, pixelformat="yuv420p", macro_block_size=1,
                               ffmpeg_params=["-crf", "18", "-preset", "medium", "-threads", "2", "-movflags", "+faststart"])
    selected = {int(np.argmin(abs(times_fs - t))) for t in (90, 140, 210, 280, 350, 480, 620, 800)}
    poster = int(np.argmin(abs(times_fs - 210)))
    try:
        for i, frame in enumerate(rms):
            im.set_data(frame.T / vmax)
            fig.canvas.draw()
            rgb = np.asarray(fig.canvas.buffer_rgba())[..., :3].copy()
            writer.append_data(rgb)
            if i in selected:
                Image.fromarray(rgb).save(out / f"qa-{times_fs[i]:06.1f}fs.png")
            if i == poster:
                Image.fromarray(rgb).save(out / "microring-pulse-poster.png")
            if i % 100 == 0:
                print(json.dumps({"event": "render", "frame": i, "total": len(rms)}), flush=True)
    finally:
        writer.close()
        plt.close(fig)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
                    "-filter_complex", "[0:v]scale=648:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
                    "-loop", "0", str(out / "microring-pulse.gif")], check=True)
    for path in (video, out / "microring-pulse.gif"):
        subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(path), "-f", "null", "-"],
                       check=True, capture_output=True)
    with Image.open(out / "microring-pulse.gif") as gif:
        assert gif.n_frames == len(rms)
        assert all((gif.seek(i) or gif.info["duration"] == 40) for i in range(gif.n_frames))
    render_record = {
        "generator_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "font": family, "field": "optical-cycle RMS Ez", "normalization": "linear, one global maximum",
        "mp4_resolution": [1296, 1128], "gif_resolution": [648, 564],
        "frames": len(rms), "fps": FPS, "duration_s": len(rms) / FPS,
        "temporal_interpolation": "none", "decode_check": "MP4 and GIF passed", "audio": False,
        "sha256": {name: hashlib.sha256((out / name).read_bytes()).hexdigest()
                   for name in ("microring-pulse.mp4", "microring-pulse.gif", "microring-pulse-poster.png")},
    }
    (out / "microring-pulse-render.json").write_text(json.dumps(render_record, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "rendered", "frames": len(rms), "fps": FPS,
                      "mp4_bytes": video.stat().st_size,
                      "gif_bytes": (out / "microring-pulse.gif").stat().st_size}), flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=REPO / "results/microring-video")
    parser.add_argument("--backend", choices=("cuda", "cpu"), default="cuda")
    parser.add_argument("--stop-fs", type=float, default=880.)
    parser.add_argument("--stage", choices=("all", "simulate", "render"), default="all")
    args = parser.parse_args()
    if args.stage != "render":
        simulate(args.out, args.backend, args.stop_fs)
    if args.stage != "simulate":
        render(args.out)


if __name__ == "__main__":
    main()
