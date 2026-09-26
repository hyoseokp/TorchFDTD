"""Render the recorded 3D metalens pulse without changing or synthesizing fields.

python examples/visualization/render_metalens_3d_pulse.py --preview-only
python examples/visualization/render_metalens_3d_pulse.py
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
import metalens_3d_pulse as capture


def quads(vertices):
    """Mesh cells with consistent indexing, one face per four corner samples."""
    return np.stack((vertices[:-1, :-1], vertices[1:, :-1],
                     vertices[1:, 1:], vertices[:-1, 1:]), axis=2).reshape(-1, 4, 3)


def face_values(values):
    return .25 * (values[:-1, :-1] + values[1:, :-1] + values[1:, 1:] + values[:-1, 1:]).ravel()


def cylinders(geometry, facets=24):
    """Actual pillar radii and heights. Color encodes only neutral surface shading."""
    faces, colors = [], []
    angle = np.linspace(0, 2 * np.pi, facets, endpoint=False)
    for pillar in geometry["pillars"]:
        x = pillar["x_um"] + pillar["radius_um"] * np.cos(angle)
        y = pillar["y_um"] + pillar["radius_um"] * np.sin(angle)
        low = np.column_stack((x, y, np.full(facets, geometry["pillar_bottom_um"])))
        high = np.column_stack((x, y, np.full(facets, geometry["pillar_top_um"])))
        for i in range(facets):
            j = (i + 1) % facets
            faces.append(np.array([low[i], low[j], high[j], high[i]]))
            gray = .70 + .09 * np.cos(angle[i] - 2.2)
            colors.append((gray, gray + .025, gray + .045, 1.))
        faces.append(high)
        colors.append((.84, .86, .88, 1.))
    return faces, np.asarray(colors)


def render(out, preview_only=False):
    import matplotlib
    matplotlib.use("Agg")
    from matplotlib import font_manager
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap, Normalize
    from matplotlib.cm import ScalarMappable
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection
    from PIL import Image
    import imageio.v2 as imageio
    import imageio_ffmpeg

    arial = Path("C:/Windows/Fonts/arial.ttf")
    if arial.exists():
        font_manager.fontManager.addfont(str(arial))
    fonts = {font.name for font in font_manager.fontManager.ttflist}
    family = next(font for font in ("Arial", "Liberation Sans", "DejaVu Sans") if font in fonts)
    plt.rcParams.update({"font.family": family, "font.size": 14, "axes.linewidth": .75,
                         "text.color": "#26333d", "axes.labelcolor": "#26333d",
                         "xtick.color": "#26333d", "ytick.color": "#26333d",
                         "mathtext.fontset": "custom", "mathtext.rm": family,
                         "mathtext.it": family + ":italic", "mathtext.bf": family + ":bold"})
    with np.load(out / "metalens-3d-planes.npz") as data:
        fields = {key: data[key] for key in ("xz", "yz", "xy")}
        x, y, z = (data[key] for key in ("x", "y", "z"))
        steps, dt = data["steps"], float(data["dt"])
    record = json.loads((out / "metalens-3d-record.json").read_text(encoding="utf-8"))
    geometry = json.loads((capture.FIXTURE / "geometry_3d.json").read_text(encoding="utf-8"))
    shown = capture.display_indices(steps, dt)
    times_fs = steps * dt * 1e15
    vmax = record["display"]["fixed_Emax_reduced_units"]
    cmap = LinearSegmentedColormap.from_list("signed_field", ["#155b94", "#8ab9d7", "#ffffff", "#e6927d", "#ae2635"], N=257)
    norm = Normalize(-1, 1)

    fig = plt.figure(figsize=(14, 8.4), dpi=120, facecolor="white")
    ax = fig.add_axes([-.015, .025, .71, .95], projection="3d")
    ax.view_init(elev=24, azim=-53)
    ax.set_proj_type("persp", focal_length=1.)
    ax.set_box_aspect((6.7, 6.7, 5.5))
    ax.set(xlim=(-3.35, 3.35), ylim=(-3.35, 3.35), zlim=(-2.2, 2.8),
           xticks=[-3, 0, 3], yticks=[-3, 0, 3], zticks=[-2, 0, 2])
    ax.set_xlabel("x (µm)", labelpad=9)
    ax.set_ylabel("y (µm)", labelpad=9)
    ax.set_zlabel("z (µm)", labelpad=6)
    ax.grid(False)
    for axis in (ax.xaxis, ax.yaxis, ax.zaxis):
        axis.pane.fill = False
        axis.pane.set_edgecolor((1, 1, 1, 0))
        axis.line.set_color("#87939b")
        axis.set_tick_params(labelsize=12)

    # The perspective view shows the field above the lens. The XZ inset also
    # includes the incident and reflected pulse below it. No volume is extruded
    # from a 2D calculation: both planes are sampled from the same 3D solve.
    xi, yi = np.arange(0, len(x), 2), np.arange(0, len(y), 2)
    zi = np.flatnonzero(z >= geometry["pillar_top_um"])[::2]
    xx, zz = np.meshgrid(x[xi], z[zi], indexing="ij")
    yy, zz2 = np.meshgrid(y[yi], z[zi], indexing="ij")
    xz_vertices = np.stack((xx, np.zeros_like(xx), zz), axis=-1)
    yz_vertices = np.stack((np.zeros_like(yy), yy, zz2), axis=-1)
    geometry_faces, geometry_colors = cylinders(geometry)
    xz_faces, yz_faces = quads(xz_vertices), quads(yz_vertices)
    faces = geometry_faces + list(xz_faces) + list(yz_faces)
    edges = np.zeros((len(faces), 4))
    edges[:len(geometry_faces)] = [.33, .39, .43, .20]
    collection = Poly3DCollection(faces, facecolors=np.ones((len(faces), 4)),
                                   edgecolors=edges, linewidths=.15, antialiased=False, zsort="average")
    ax.add_collection3d(collection)

    side = fig.add_axes([.713, .55, .207, .37])
    focus = fig.add_axes([.713, .08, .207, .37])

    def extent(a, b):
        return (a[0] - (a[1] - a[0]) / 2, a[-1] + (a[1] - a[0]) / 2,
                b[0] - (b[1] - b[0]) / 2, b[-1] + (b[1] - b[0]) / 2)

    im_side = side.imshow(fields["xz"][0].T, origin="lower", extent=extent(x, z),
                          cmap=cmap, norm=norm, interpolation="bilinear", aspect="equal")
    im_focus = focus.imshow(fields["xy"][0].T, origin="lower", extent=extent(x, y),
                            cmap=cmap, norm=norm, interpolation="bilinear", aspect="equal")
    side.set(xlabel="x (µm)", ylabel="z (µm)", xticks=[-3, 0, 3], yticks=[-2, 0, 2])
    focus.set(xlabel="x (µm)", ylabel="y (µm)", xticks=[-3, 0, 3], yticks=[-3, 0, 3])
    side.text(.02, 1.035, "y = 0", transform=side.transAxes, fontsize=12)
    focus.text(.02, 1.035, "z = 1.65 µm", transform=focus.transAxes, fontsize=12)
    for panel in (side, focus):
        panel.tick_params(labelsize=12, length=3)
    bar = fig.colorbar(ScalarMappable(norm=norm, cmap=cmap), cax=fig.add_axes([.937, .17, .011, .66]), ticks=[-1, 0, 1])
    bar.set_label(r"$E_x / E_{\max}$", labelpad=5, fontsize=13)
    bar.ax.tick_params(labelsize=12)
    bar.outline.set_linewidth(.65)

    # A single collection depth-sorts all polygons, including both intersecting
    # planes and the cylinders. It avoids the wrong whole-plane draw ordering.
    def draw(index):
        xz_values = face_values(fields["xz"][index][np.ix_(xi, zi)]) / vmax
        yz_values = face_values(fields["yz"][index][np.ix_(yi, zi)]) / vmax
        collection.set_facecolor(np.vstack((geometry_colors, cmap(norm(xz_values)), cmap(norm(yz_values)))))
        im_side.set_data(fields["xz"][index].T / vmax)
        im_focus.set_data(fields["xy"][index].T / vmax)
        fig.canvas.draw()
        return np.asarray(fig.canvas.buffer_rgba())[..., :3].copy()

    selected = {int(np.argmin(abs(times_fs - t))) for t in (40., 60., 75., 83., 100., 125.)}
    poster_index = int(shown[np.argmax(np.max(abs(fields["xy"][shown]), axis=(1, 2)))])
    selected.add(poster_index)
    if preview_only:
        for index in sorted(selected):
            Image.fromarray(draw(index)).save(out / f"qa-{times_fs[index]:06.2f}fs.png")
        Image.fromarray(draw(poster_index)).save(out / "metalens-3d-poster.png")
        plt.close(fig)
        print(json.dumps({"event": "previews", "poster_time_fs": float(times_fs[poster_index])}), flush=True)
        return

    video = out / "metalens-3d.mp4"
    writer = imageio.get_writer(video, format="FFMPEG", fps=capture.FPS, codec="libx264",
                               quality=None, pixelformat="yuv420p", macro_block_size=1,
                               ffmpeg_params=["-crf", "18", "-preset", "medium", "-threads", "2", "-movflags", "+faststart"])
    try:
        for j, index in enumerate(shown):
            rgb = draw(index)
            writer.append_data(rgb)
            if index in selected:
                Image.fromarray(rgb).save(out / f"qa-{times_fs[index]:06.2f}fs.png")
            if index == poster_index:
                Image.fromarray(rgb).save(out / "metalens-3d-poster.png")
            if j % 40 == 0:
                print(json.dumps({"event": "render", "frame": j, "total": len(shown)}), flush=True)
    finally:
        writer.close()
        plt.close(fig)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    gif = out / "metalens-3d.gif"
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
                    "-filter_complex", "[0:v]scale=840:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
                    "-loop", "0", str(gif)], check=True)
    for path in (video, gif):
        subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(path), "-f", "null", "-"],
                       check=True, capture_output=True)
    with Image.open(gif) as image:
        assert image.n_frames == len(shown)
        assert all((image.seek(i) or image.info["duration"] == 40) for i in range(image.n_frames))
    metadata = {
        "renderer_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "capture_sha256": hashlib.sha256((HERE / "metalens_3d_pulse.py").read_bytes()).hexdigest(),
        "font": family, "field": "instantaneous signed Ex, one fixed color scale",
        "panels": "3D pillar geometry with XZ and YZ cuts above the lens, full XZ section, XY focal-plane section",
        "perspective_plane_spatial_stride": 2, "perspective_face_value": "mean of four corner samples",
        "temporal_interpolation": "none", "mp4_resolution": [1680, 1008], "gif_resolution": [840, 504],
        "frames": len(shown), "fps": capture.FPS, "duration_s": len(shown) / capture.FPS,
        "poster_time_fs": float(times_fs[poster_index]), "decode_check": "MP4 and GIF passed", "audio": False,
        "sha256": {name: hashlib.sha256((out / name).read_bytes()).hexdigest()
                   for name in ("metalens-3d.mp4", "metalens-3d.gif", "metalens-3d-poster.png")},
    }
    (out / "metalens-3d-render.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"event": "rendered", "frames": len(shown), "mp4_bytes": video.stat().st_size,
                      "gif_bytes": gif.stat().st_size}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=capture.REPO / "results/metalens-3d-video")
    parser.add_argument("--preview-only", action="store_true")
    args = parser.parse_args()
    render(args.out, args.preview_only)
