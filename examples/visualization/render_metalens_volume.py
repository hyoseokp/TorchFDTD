"""Ray-cast the measured 3D Ex field, with no slice sheets or invented rays.

Requires pyvista==0.48.4 and vtk==9.6.2 in addition to the movie dependencies.
CPU fixed-point volume rendering keeps the GPU available for other tasks.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import metalens_volume as capture

SIZE = (1440, 1080)
CAMERA_SCALE = 4.1
OPACITY_KNOTS = ((0., 0.), (.10, 0.), (.2, .01), (.35, .07), (.6, .26), (1., .6))
OPACITY_UNIT_UM = .5


def opacity_for_mode(instantaneous=True):
    # Integer-centered coordinates make both signs exactly symmetric before
    # rounding the transfer function to eight bits.
    values = np.abs(2 * np.arange(256) - 255) / 255 if instantaneous else np.arange(256) / 255
    knots = np.asarray(OPACITY_KNOTS)
    opacity = np.interp(values, knots[:, 0], knots[:, 1])
    # With a complete lookup table, PyVista expects 0..255, not 0..1.
    return np.rint(255 * opacity).astype(np.uint8)


def render(out, preview_only=False, instantaneous=True):
    import pyvista as pv
    import vtk
    from matplotlib.colors import LinearSegmentedColormap
    from PIL import Image, ImageDraw, ImageFont
    import imageio.v2 as imageio
    import imageio_ffmpeg

    vtk.vtkMultiThreader.SetGlobalMaximumNumberOfThreads(4)
    pv.global_theme.font.family = "arial"
    with np.load(out / "coordinates.npz") as coordinates:
        axes = [coordinates[a] for a in ("x", "y", "z")]
        steps, dt = coordinates["steps"], float(coordinates["dt"])
    field = np.load(out / ("Ex.npy" if instantaneous else "Ex-rms.npy"), mmap_mode="r")
    record = json.loads((out / "metalens-volume-record.json").read_text(encoding="utf-8"))
    geometry = json.loads((capture.reference.FIXTURE / "geometry_3d.json").read_text(encoding="utf-8"))
    shown = capture.display_indices(steps, dt)
    times = steps * dt * 1e15
    vmax = float(np.max(abs(field[shown]))) if instantaneous else record["rms_reference"]["fixed_RMS_max"]
    poster = record["rms_reference"]["poster_index"]
    colors = ["#245da4", "#5ca4ca", "#ffffff", "#e6a08a", "#b43350"] if instantaneous else ["#b2e6ed", "#66cbde", "#369cde", "#3465bb", "#4d3790"]
    cmap = LinearSegmentedColormap.from_list("field_volume", colors, N=256)
    scalar_range = (-1, 1) if instantaneous else (0, 1)
    scalar_name = "Ex / max" if instantaneous else "Ex RMS"
    grid = pv.ImageData(dimensions=field.shape[1:], spacing=tuple(a[1] - a[0] for a in axes),
                        origin=tuple(a[0] for a in axes))
    grid.point_data[scalar_name] = np.asarray(field[poster] / vmax).ravel(order="F")
    pl = pv.Plotter(off_screen=True, window_size=SIZE, lighting="three lights")
    pl.set_background("white")
    pl.disable_anti_aliasing()
    pillars = [pv.Cylinder(center=(p["x_um"], p["y_um"], geometry["pillar_z_center_um"]),
                           direction=(0, 0, 1), radius=p["radius_um"],
                           height=geometry["pillar_height_um"], resolution=40)
               for p in geometry["pillars"]]
    mesh = pv.MultiBlock(pillars).combine().extract_surface(algorithm="dataset_surface")
    pl.add_mesh(mesh, color="#a8b3bf", smooth_shading=True, split_sharp_edges=True,
                ambient=.35, diffuse=.65, specular=.2, specular_power=25, show_edges=False)
    volume = pl.add_volume(grid, scalars=scalar_name, clim=scalar_range, cmap=cmap,
                           opacity=opacity_for_mode(instantaneous), opacity_unit_distance=OPACITY_UNIT_UM,
                           mapper="fixed_point", blending="composite", shade=False,
                           show_scalar_bar=False)
    volume.GetProperty().SetInterpolationTypeToLinear()
    volume.mapper.SetSampleDistance(.05)
    volume.mapper.SetAutoAdjustSampleDistances(False)
    volume.mapper.SetImageSampleDistance(1.)
    shells = []
    shell_settings = ((-.55, .14), (.55, .14)) if instantaneous else ((.35, .08), (.65, .16))
    for threshold, alpha in shell_settings:
        surface = grid.contour([threshold], scalars=scalar_name)
        color_value = (threshold + 1) / 2 if instantaneous else threshold
        actor = pl.add_mesh(surface, color=cmap(color_value)[:3], opacity=alpha,
                            smooth_shading=True, ambient=.45, diffuse=.55,
                            specular=.3, specular_power=25, show_scalar_bar=False)
        shells.append((threshold, actor))
    pl.camera_position = [(10., -15., 8.), (0., 0., -.05), (0., 0., 1.)]
    pl.enable_parallel_projection()
    pl.camera.parallel_scale = CAMERA_SCALE
    # No bounding planes or base disk are added. The neutral cylinders are
    # the device, and everything translucent is actual recorded field data.
    pl.add_axes(interactive=False, line_width=2, color="#445160", x_color="#7c8994",
                y_color="#7c8994", z_color="#7c8994", xlabel="x", ylabel="y", zlabel="z",
                viewport=(.065, .07, .22, .255), labels_off=False)
    pl.show(auto_close=False, interactive=False)
    font_path = Path("C:/Windows/Fonts/arial.ttf")
    if not font_path.exists():
        from matplotlib import font_manager
        font_path = Path(font_manager.findfont("DejaVu Sans"))
    font = ImageFont.truetype(str(font_path), 24)
    small = ImageFont.truetype(str(font_path), 22)
    ink = "#3e4c59"
    bar_x, bar_y, bar_w, bar_h = 1300, 354, 15, 300
    gradient = (cmap(np.linspace(1, 0, bar_h))[:, :3] * 255).astype(np.uint8)
    gradient = Image.fromarray(np.repeat(gradient[:, None, :], bar_w, axis=1))

    def draw(index):
        grid.point_data[scalar_name][:] = (field[index] / vmax).ravel(order="F")
        grid.GetPointData().GetScalars().Modified()
        grid.Modified()
        for threshold, actor in shells:
            surface = grid.contour([threshold], scalars=scalar_name)
            actor.mapper.SetInputData(surface)
            actor.SetVisibility(surface.n_points > 0)
        pl.render()
        rgb = Image.fromarray(pl.screenshot(return_img=True))
        pen = ImageDraw.Draw(rgb)
        rgb.paste(gradient, (bar_x, bar_y))
        for value in ((-1., 0., 1.) if instantaneous else (0., .5, 1.)):
            fraction = (value + 1) / 2 if instantaneous else value
            y = bar_y + int((1 - fraction) * (bar_h - 1))
            pen.text((bar_x + 26, y - 13), f"{value:g}", font=small, fill=ink)
        pen.text((bar_x - 18, bar_y - 63), "Eₓ" if instantaneous else "Eₓ RMS", font=font, fill=ink)
        pen.text((bar_x - 18, bar_y - 33), "(norm.)", font=small, fill=ink)
        pen.text((100, 70), f"{times[index]:.1f} fs", font=font, fill=ink)
        # Orthographic camera: one micrometre has the same screen scale at
        # every depth. This is a physical length bar, not an arbitrary glyph.
        length = round(SIZE[1] / (2 * CAMERA_SCALE))
        left, bottom = 1050, 939
        pen.line((left, bottom, left + length, bottom), fill=ink, width=3)
        pen.line((left, bottom - 5, left, bottom + 5), fill=ink, width=2)
        pen.line((left + length, bottom - 5, left + length, bottom + 5), fill=ink, width=2)
        pen.text((left + length / 2, bottom + 12), "1 µm", font=small, fill=ink, anchor="mt")
        return np.asarray(rgb)

    selected = {int(np.argmin(abs(times - t))) for t in (45., 65., 82., 100., 120.)}
    selected.add(poster)
    if preview_only:
        for index in sorted(selected):
            Image.fromarray(draw(index)).save(out / f"volume-qa-{times[index]:06.2f}fs.png")
        Image.fromarray(draw(poster)).save(out / "metalens-volume-poster.png")
        pl.close()
        print(json.dumps({"event": "previews", "poster_time_fs": float(times[poster])}), flush=True)
        return

    video = out / "metalens-volume.mp4"
    writer = imageio.get_writer(video, format="FFMPEG", fps=capture.FPS, codec="libx264",
                               quality=None, pixelformat="yuv420p", macro_block_size=1,
                               ffmpeg_params=["-crf", "18", "-preset", "medium", "-threads", "2", "-movflags", "+faststart"])
    try:
        for j, index in enumerate(shown):
            rgb = draw(index)
            writer.append_data(rgb)
            if index in selected:
                Image.fromarray(rgb).save(out / f"volume-qa-{times[index]:06.2f}fs.png")
            if index == poster:
                Image.fromarray(rgb).save(out / "metalens-volume-poster.png")
            if j % 25 == 0:
                print(json.dumps({"event": "render", "frame": j, "total": len(shown)}), flush=True)
    finally:
        writer.close()
        pl.close()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    gif = out / "metalens-volume.gif"
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(video), "-filter_complex",
                    "[0:v]scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
                    "-loop", "0", str(gif)], check=True)
    for path in (video, gif):
        subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(path), "-f", "null", "-"],
                       check=True, capture_output=True)
    with Image.open(gif) as image:
        assert image.n_frames == len(shown)
        assert all((image.seek(i) or image.info["duration"] == 40) for i in range(image.n_frames))
    metadata = {
        "renderer_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "capture_sha256": hashlib.sha256(Path(capture.__file__).read_bytes()).hexdigest(),
        "pyvista": pv.__version__, "vtk": vtk.vtkVersion.GetVTKVersion(), "font": font_path.name,
        "method": "CPU fixed-point composite ray casting of actual native 3D field samples",
        "field": "instantaneous signed Ex" if instantaneous else "optical-cycle RMS Ex",
        "fixed_field_max": vmax,
        "spatial_interpolation": "trilinear", "scalar_range": scalar_range,
        "opacity_knots_for_field_magnitude": OPACITY_KNOTS, "opacity_unit_distance_um": OPACITY_UNIT_UM,
        "ray_sample_distance_um": .05, "camera": "fixed orthographic, no rotation",
        "isosurfaces": [{"normalized_field": level, "opacity": alpha} for level, alpha in shell_settings],
        "camera_parallel_scale_um": CAMERA_SCALE, "mp4_resolution": list(SIZE), "gif_resolution": [800, 600],
        "temporal_interpolation": "none" if instantaneous else "none after the documented optical-cycle RMS",
        "frames": len(shown), "fps": capture.FPS, "duration_s": len(shown) / capture.FPS,
        "poster_time_fs": float(times[poster]), "decode_check": "MP4 and GIF passed", "audio": False,
        "sha256": {name: hashlib.sha256((out / name).read_bytes()).hexdigest()
                   for name in ("metalens-volume.mp4", "metalens-volume.gif", "metalens-volume-poster.png")},
    }
    (out / "metalens-volume-render.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "rendered", "frames": len(shown), "mp4_bytes": video.stat().st_size,
                      "gif_bytes": gif.stat().st_size}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=capture.reference.REPO / "results/metalens-volume")
    parser.add_argument("--preview-only", action="store_true")
    parser.add_argument("--rms", action="store_true", help="Render the cycle-averaged envelope instead of signed Ex")
    args = parser.parse_args()
    render(args.out, args.preview_only, not args.rms)
