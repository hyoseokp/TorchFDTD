"""Build every figure used by the PhotonWeave lab-meeting slides.

Two kinds of figures are produced.

1. Field images computed here, on the CPU, with the native PhotonWeave solver.
   They are real solver output, not artwork.
2. Charts of numbers already recorded in this repository. Every chart states
   its source table in ``SOURCES`` below, so a slide value can be traced back
   to README.md or docs/validation.

Run from the repository root::

    python docs/presentation/make_figures.py            # everything
    python docs/presentation/make_figures.py --charts   # charts only, no solver

Figures are written to docs/presentation/figures as PDF.
"""
import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import numpy as np
import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Circle, Rectangle

OUT = Path('docs/presentation/figures')

# Recorded sources for the plotted numbers.
SOURCES = {
    'lumerical': 'README.md, Primary speed comparison: Lumerical FDTD',
    'flaport': 'README.md, Measured CUDA comparisons',
    'batch': 'README.md, Independent structures in one CUDA launch',
    'cpu_gpu': 'docs/validation/BATCH_REPORT.md',
    'ablation': 'README.md, mesh/CAD/output/monitor ablation tables',
    'adjoint': 'docs/validation/CPU_DRAM_COMPARISON.md',
    'dispersive': 'docs/validation/DISPERSIVE_CUDA_REPORT.md',
    'vram': 'docs/BEYOND_VRAM_VALIDATION.md, docs/validation/DISPERSIVE_CAPACITY_REPORT.md',
    'mie': 'docs/validation/TFSF_REPORT.md',
}

INK = '#12263a'
BLUE = '#1f6fb2'
DEEP = '#123f66'
RED = '#d0553f'
GREEN = '#3f8f63'
AMBER = '#e0a300'
GREY = '#8ba0b3'

plt.rcParams.update({
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'font.size': 9,
    'axes.labelsize': 9,
    'axes.titlesize': 10,
    'axes.titleweight': 'bold',
    'axes.edgecolor': '#99a9b8',
    'axes.labelcolor': INK,
    'text.color': INK,
    'xtick.color': '#5b6f80',
    'ytick.color': '#5b6f80',
    'xtick.labelsize': 8,
    'ytick.labelsize': 8,
    'legend.fontsize': 8,
    'legend.frameon': False,
    'grid.color': '#d7dfe6',
    'grid.linewidth': .6,
    'pdf.fonttype': 42,
})

FIELD_CMAP = LinearSegmentedColormap.from_list(
    'pw_field', ['#18375a', '#2f7fb8', '#9fd0e6', '#ffffff', '#f6c4a8', '#dd7048', '#8c2d15'])


def finish(fig, name):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f'{name}.pdf'
    fig.savefig(path, bbox_inches='tight', pad_inches=.02)
    plt.close(fig)
    print(f'wrote {path}')


def bare(ax, axis='y'):
    ax.grid(axis=axis, alpha=.55, zorder=0)
    ax.set_axisbelow(True)
    for side in ('top', 'right'):
        ax.spines[side].set_visible(False)


# --------------------------------------------------------------------------
# Charts from recorded measurements
# --------------------------------------------------------------------------
def chart_lumerical():
    cases = ['Sphere 64$^3$\n1,000 steps', 'Sphere 128$^3$\n2,000 steps', 'Sphere 128$^3$\n2,000 steps\n(CPML revision)']
    wall_lum = [3.997, 30.736, 30.233]
    wall_pw = [0.613, 3.119, 1.990]
    eng_lum = [1.897, 28.186, 28.288]
    eng_pw = [0.561, 3.027, 1.924]
    fig, axes = plt.subplots(1, 2, figsize=(8.4, 3.1), layout='constrained')
    for ax, (lum, pw, title) in zip(axes, [(wall_lum, wall_pw, 'Run wall time'),
                                           (eng_lum, eng_pw, 'Engine / stepping time')]):
        x = np.arange(len(cases))
        ax.bar(x - .2, lum, .38, color=GREY, label='Lumerical FDTD, CPU 16 threads', zorder=3)
        ax.bar(x + .2, pw, .38, color=BLUE, label='PhotonWeave, RTX 5880 Ada', zorder=3)
        for xi, (a, b) in enumerate(zip(lum, pw)):
            ax.text(xi + .2, b * 1.25, f'{a / b:.1f}×', ha='center', color=DEEP, fontweight='bold', fontsize=9)
        ax.set_yscale('log')
        ax.set_ylim(.25, 140)
        ax.set_xticks(x, cases)
        ax.set_ylabel('seconds (log)')
        ax.set_title(title)
        bare(ax)
    axes[0].legend(loc='upper left', bbox_to_anchor=(0, 1.02))
    finish(fig, 'chart-lumerical')


def chart_flaport():
    rows = [('Vacuum', '64$^3$', 649.23, 38.06), ('Sphere', '64$^3$', 629.07, 39.72),
            ('Slab', '64$^3$', 636.26, 37.23), ('Waveguide', '64$^3$', 632.59, 39.90),
            ('Vacuum', '96$^3$', 954.98, 78.77), ('Sphere', '96$^3$', 848.58, 88.05),
            ('Slab', '96$^3$', 836.66, 80.37), ('Waveguide', '96$^3$', 848.07, 80.00)]
    labels = [f'{name}\n{grid}' for name, grid, _, _ in rows]
    base = [r[2] for r in rows]
    pw = [r[3] for r in rows]
    x = np.arange(len(rows))
    fig, ax = plt.subplots(figsize=(8.6, 3.0), layout='constrained')
    ax.bar(x - .2, base, .38, color=GREY, label='flaport/fdtd 0.2.2 + CUDA Graph', zorder=3)
    ax.bar(x + .2, pw, .38, color=BLUE, label='PhotonWeave fused CUDA', zorder=3)
    for xi, (a, b) in enumerate(zip(base, pw)):
        ax.text(xi + .2, b * 1.22, f'{a / b:.1f}×', ha='center', color=DEEP, fontweight='bold', fontsize=8.5)
    ax.set_yscale('log')
    ax.set_ylim(15, 3200)
    ax.set_xticks(x, labels)
    ax.set_ylabel('full solve, ms (log)')
    ax.set_title('Same grid, same source, same monitor — 800 steps, float32, RTX 5880 Ada')
    ax.legend(loc='upper left', ncol=2)
    bare(ax)
    finish(fig, 'chart-flaport')


def chart_cpu_gpu():
    fig, ax = plt.subplots(figsize=(5.0, 2.8), layout='constrained')
    labels = ['NumPy CPU\n1 worker', 'CUDA\n1 worker', 'CUDA\n2 workers', 'CUDA\n4 workers']
    values = [47.04, 1.175, 1.182, 1.204]
    colors = [GREY, BLUE, BLUE, BLUE]
    ax.bar(labels, values, .58, color=colors, zorder=3)
    ax.set_yscale('log')
    ax.set_ylim(.6, 160)
    ax.set_ylabel('batch wall time, s (log)')
    ax.set_title('4 × sphere, 64$^3$, 800 steps')
    for i, v in enumerate(values):
        ax.text(i, v * 1.25, f'{v:.2f} s', ha='center', fontsize=8.5, color=INK)
    ax.annotate('', xy=(1, 2.2), xytext=(0, 2.2),
                arrowprops=dict(arrowstyle='<->', color=DEEP, lw=1.1))
    ax.text(.5, 2.6, '≈ 40×', ha='center', color=DEEP, fontweight='bold')
    bare(ax)
    finish(fig, 'chart-cpu-gpu')


def chart_batch_scaling():
    cases = [1, 2, 4, 8, 16]
    small = [49.06, 63.71, 62.83, 90.66, 112.31]
    large = [24.70, 25.55, 26.00, 22.40, 18.76]
    fig, ax = plt.subplots(figsize=(5.2, 2.9), layout='constrained')
    ax.plot(cases, small, 'o-', color=BLUE, lw=2, label='32$^3$ grid')
    ax.plot(cases, large, 's-', color=RED, lw=2, label='64$^3$ grid')
    ax.axhspan(0, 0, color='none')
    ax.fill_between([4, 16], 0, 30, color=RED, alpha=.06)
    ax.text(10, 5.5, 'measured regression:\nlarger cohorts get slower', color=RED, fontsize=8, ha='center')
    ax.set_xscale('log', base=2)
    ax.set_xticks(cases, [str(c) for c in cases])
    ax.set_xlabel('independent cases in one CUDA launch')
    ax.set_ylabel('cases / s')
    ax.set_ylim(0, 125)
    ax.set_title('Shared batch axis: throughput and its limit')
    ax.legend(loc='upper left')
    bare(ax)
    finish(fig, 'chart-batch-scaling')


def chart_ablation():
    rows = [
        ('Analytic CAD, bounded material prep', 1.44, 21.19, '8 compact-solid ensembles'),
        ('Rectilinear mesh, matched $\\Delta t$', 4.33, 13.39, '8 layer ensembles'),
        ('Shared CUDA spectral monitors', 3.63, 8.12, '8 spectral ensembles'),
        ('Fused CUDA Yee/CPML kernel', 3.67, 5.76, '64$^3$ / 96$^3$ / 128$^3$'),
        ('Selective output (flux only)', 1.14, 1.69, '8 selective ensembles'),
        ('Mixed-mesh grouped batch', 1.05, 1.50, 'vs native sequence'),
    ]
    fig, ax = plt.subplots(figsize=(7.6, 3.1), layout='constrained')
    y = np.arange(len(rows))[::-1]
    for yi, (label, lo, hi, note) in zip(y, rows):
        ax.plot([lo, hi], [yi, yi], color=BLUE, lw=6, solid_capstyle='round', alpha=.85, zorder=3)
        ax.plot([lo], [yi], 'o', color=DEEP, ms=5, zorder=4)
        ax.plot([hi], [yi], 'o', color=DEEP, ms=5, zorder=4)
        ax.text(hi * 1.12, yi, f'{lo:.2f}–{hi:.2f}×', va='center', fontsize=8.5, color=INK)
        ax.text(hi * 1.12, yi - .34, note, va='center', fontsize=7, color=GREY)
    ax.set_yticks(y, [r[0] for r in rows])
    ax.set_xscale('log')
    ax.set_xlim(.9, 60)
    ax.set_xticks([1, 2, 5, 10, 20], ['1×', '2×', '5×', '10×', '20×'])
    ax.axvline(1, color=GREY, lw=1, ls='--')
    ax.set_xlabel('full-wall gain over the matched native baseline (log)')
    ax.set_title('Where the time actually goes: measured native ablations')
    bare(ax, axis='x')
    finish(fig, 'chart-ablation')


def chart_adjoint():
    fig, axes = plt.subplots(1, 2, figsize=(8.4, 3.0), layout='constrained')
    fp32 = [('CPU + DRAM\n8 threads', 1.955, GREY), ('GPU + DRAM\nsync tiles', 0.4612, GREEN),
            ('GPU + DRAM\nasync tiles', 0.3896, AMBER), ('GPU resident', 0.04189, BLUE)]
    fp64 = [('CPU + DRAM\n16 threads', 7.899, GREY), ('GPU + DRAM\nasync tiles', 0.7736, AMBER),
            ('GPU resident', 0.09191, BLUE)]
    for ax, rows, title in [(axes[0], fp32, 'Real FP32, 128×64×64, 32 steps'),
                            (axes[1], fp64, 'Complex FP64 + Bloch, same grid')]:
        labels = [r[0] for r in rows]
        values = [r[1] for r in rows]
        ax.bar(labels, values, .56, color=[r[2] for r in rows], zorder=3)
        for i, v in enumerate(values):
            ax.text(i, v * 1.3, f'{values[0] / v:.1f}×' if i else 'baseline',
                    ha='center', fontsize=8.5, fontweight='bold' if i else 'normal',
                    color=DEEP if i else GREY)
        ax.set_yscale('log')
        ax.set_ylim(.02, values[0] * 12)
        ax.set_ylabel('forward + objective + backward, s (log)')
        ax.set_title(title)
        bare(ax)
    finish(fig, 'chart-adjoint')


def chart_dispersive():
    rows = [('32$^3$ / 64\nFP32', 1.3021, 0.0806), ('32$^3$ / 64\nFP64c', 1.4252, 0.0905),
            ('64$^3$ / 64\nFP32', 1.4026, 0.1033), ('64$^3$ / 64\nFP64c', 1.2523, 0.2637),
            ('128$^3$ / 128\nFP32', 4.2505, 0.5307), ('128$^3$ / 128\nFP64c', 19.9781, 4.6447)]
    x = np.arange(len(rows))
    torch = [r[1] for r in rows]
    fused = [r[2] for r in rows]
    fig, ax = plt.subplots(figsize=(7.4, 2.9), layout='constrained')
    ax.bar(x - .2, torch, .38, color=GREY, label='Torch CUDA reference', zorder=3)
    ax.bar(x + .2, fused, .38, color=BLUE, label='Fused CUDA forward + backward', zorder=3)
    for xi, (a, b) in enumerate(zip(torch, fused)):
        ax.text(xi + .2, b * 1.25, f'{a / b:.1f}×', ha='center', color=DEEP, fontweight='bold', fontsize=8.5)
    ax.set_yscale('log')
    ax.set_ylim(.05, 90)
    ax.set_xticks(x, [r[0] for r in rows])
    ax.set_ylabel('objective + gradient, s (log)')
    ax.set_title('Drude/Lorentz ADE adjoint with checkpoint replay, RTX 5880 Ada')
    ax.legend(loc='upper left', ncol=2)
    bare(ax)
    finish(fig, 'chart-dispersive')


def chart_beyond_vram():
    fig, ax = plt.subplots(figsize=(6.4, 2.9), layout='constrained')
    labels = ['E/H state\ndielectric', 'ADE state\nDrude/Lorentz', 'Peak GPU alloc\ndielectric',
              'Peak GPU alloc\nADE']
    values = [54.0, 54.0, 7.09 / 1.0737, 5.17 / 1.0737]
    colors = [DEEP, DEEP, BLUE, BLUE]
    ax.bar(labels, values, .5, color=colors, zorder=3)
    ax.axhline(44.7, color=RED, lw=1.3, ls='--', zorder=4)
    ax.text(3.45, 46.6, 'RTX 5880 physical VRAM: 48 GB = 44.7 GiB', color=RED, fontsize=8, ha='right')
    for i, v in enumerate(values):
        ax.text(i, v + 1.8, f'{v:.1f} GiB', ha='center', fontsize=8.5)
    ax.set_ylabel('gibibytes')
    ax.set_ylim(0, 66)
    ax.set_title('603,979,776 cells: state beyond VRAM, allocation inside it')
    bare(ax)
    finish(fig, 'chart-beyond-vram')


def chart_mie():
    mesh = [0.1, 0.05, 0.025, 0.02]
    grid = ['32$^3$', '64$^3$', '128$^3$', '160$^3$']
    err = [8.8963, 0.3086, 1.0474, 0.5514]
    fig, ax = plt.subplots(figsize=(5.4, 2.9), layout='constrained')
    ax.plot(mesh, err, 'o-', color=BLUE, lw=2, ms=7, zorder=3)
    for m, e, g in zip(mesh, err, grid):
        ax.annotate(f'{e:.2f}%  ({g})', (m, e), textcoords='offset points', xytext=(6, 8), fontsize=8)
    ax.set_xscale('log')
    ax.set_yscale('log')
    ax.set_xlabel('mesh step (µm)')
    ax.set_ylabel('max relative $\\sigma_{sca}$ error (%)')
    ax.set_title('TFSF sphere vs analytic Mie series, 9 wavelengths')
    ax.set_xlim(.016, .13)
    ax.set_ylim(.15, 25)
    ax.invert_xaxis()
    bare(ax, axis='both')
    finish(fig, 'chart-mie')


def chart_design_loop():
    fig, ax = plt.subplots(figsize=(5.4, 2.8), layout='constrained')
    labels = ['32$^3$ grid', '64$^3$ grid']
    independent = [1.677, 2.468]
    tensor = [0.818, 2.204]
    x = np.arange(2)
    ax.bar(x - .18, independent, .34, color=GREY, label='independent case loop', zorder=3)
    ax.bar(x + .18, tensor, .34, color=BLUE, label='shared CUDA cohorts', zorder=3)
    for xi, (a, b) in enumerate(zip(independent, tensor)):
        ax.text(xi + .18, b + .08, f'{a / b:.2f}×', ha='center', color=DEEP, fontweight='bold')
    ax.set_xticks(x, labels)
    ax.set_ylabel('full DE loop, s (64 solves)')
    ax.set_title('Differential-evolution design loop, population 16 × 3 generations')
    ax.legend(loc='upper left')
    bare(ax)
    finish(fig, 'chart-design-loop')


def chart_grouped():
    rows = [('32$^3$+48$^3$\n800 steps', 6.958, 0.649, 0.455),
            ('32$^3$+64$^3$\n800 steps', 7.892, 0.722, 0.578),
            ('32$^3$\n400+800 steps', 5.827, 0.522, 0.348),
            ('64$^3$\n400+800 steps', 6.337, 0.891, 0.852)]
    x = np.arange(len(rows))
    fig, ax = plt.subplots(figsize=(7.2, 2.9), layout='constrained')
    ax.bar(x - .26, [r[1] for r in rows], .25, color=GREY, label='flaport sequence', zorder=3)
    ax.bar(x, [r[2] for r in rows], .25, color='#7fa8c6', label='native sequence', zorder=3)
    ax.bar(x + .26, [r[3] for r in rows], .25, color=BLUE, label='native grouped batch', zorder=3)
    for xi, r in enumerate(rows):
        ax.text(xi + .26, r[3] * 1.3, f'{r[1] / r[3]:.1f}×', ha='center', color=DEEP, fontweight='bold', fontsize=8.5)
    ax.set_yscale('log')
    ax.set_ylim(.2, 30)
    ax.set_xticks(x, [r[0] for r in rows])
    ax.set_ylabel('16 mixed cases, s (log)')
    ax.set_title('One Python batch, different meshes and durations')
    ax.legend(loc='upper left', ncol=3)
    bare(ax)
    finish(fig, 'chart-grouped')


# --------------------------------------------------------------------------
# Field figures computed here with the native CPU solver
# --------------------------------------------------------------------------
def draw_field(ax, frame, extent, title, vmax=None, structures=()):
    scale = vmax if vmax else float(np.max(np.abs(frame)))
    ax.imshow(frame.T, origin='lower', extent=extent, cmap=FIELD_CMAP,
              vmin=-scale, vmax=scale, interpolation='bilinear', aspect='equal')
    for patch in structures:
        ax.add_patch(patch)
    ax.set_title(title, fontsize=8.5, color=INK, pad=3)
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_color('#b7c4d0')


def field_waveguide():
    from photonweave import Simulation
    from photonweave.models import demo_project
    p = demo_project('waveguide')
    p.region.backend = 'cpu'
    p.region.steps = 900
    p.region.snapshot_interval = 10
    t0 = time.time()
    result = Simulation(p).run()
    print(f'waveguide run {time.time() - t0:.1f} s, frames {np.asarray(result.frames).shape}')
    frames = np.asarray(result.frames)
    steps = list(result.frame_steps)
    picks = [min(range(len(steps)), key=lambda i: abs(steps[i] - target)) for target in (180, 420, 780)]
    vmax = float(np.max(np.abs(frames[picks[1]]))) * .75
    fig, axes = plt.subplots(1, 3, figsize=(8.6, 2.5), layout='constrained')
    for ax, idx in zip(axes, picks):
        core = [Rectangle((-4, -0.325), 8, 0.65, fill=False, ec='#2a4d68', lw=.7, alpha=.7)]
        draw_field(ax, frames[idx], (-4, 4, -3, 3), f'step {steps[idx]}', vmax, core)
    axes[1].set_xlabel('8 × 6 µm domain, six-face CPML, Δ = 0.05 µm', fontsize=8)
    finish(fig, 'field-waveguide')


def field_scatterer():
    from photonweave import Simulation
    from photonweave.models import demo_project
    p = demo_project('scatterer')
    p.region.backend = 'cpu'
    p.region.steps = 1000
    p.region.snapshot_interval = 10
    t0 = time.time()
    result = Simulation(p).run()
    print(f'scatterer run {time.time() - t0:.1f} s')
    frames = np.asarray(result.frames)
    steps = list(result.frame_steps)
    picks = [min(range(len(steps)), key=lambda i: abs(steps[i] - target)) for target in (300, 520, 800)]
    vmax = float(np.max(np.abs(frames[picks[1]]))) * .6
    fig, axes = plt.subplots(1, 3, figsize=(8.6, 2.6), layout='constrained')
    for ax, idx in zip(axes, picks):
        rod = [Circle((0, 0), 0.65, fill=False, ec='#24485f', lw=.8, alpha=.8)]
        draw_field(ax, frames[idx], (-4, 4, -3, 3), f'step {steps[idx]}', vmax, rod)
    finish(fig, 'field-scatterer')


A_LATTICE = 0.5        # lattice constant, µm
ROD_RADIUS = 0.1       # rod radius, µm
ROD_INDEX = 3.4        # silicon-like rods in air
ROD_MATERIAL = 'PhC rod (n = 3.4)'


def field_phc_gap():
    """Measure the TM band gap of a square rod lattice with a broadband one-way plane source."""
    from photonweave import (Project, Region, Structure, Source, FieldMonitor, SpectrumSettings,
                             Boundaries, BoundaryFace, Material, Simulation, normalize_flux)
    from photonweave.models import default_materials

    a, radius, index = A_LATTICE, ROD_RADIUS, ROD_INDEX
    columns = 10

    def build(with_rods):
        rods = [Structure(id=f'rod{i}', name=f'rod{i}', kind='circle',
                          center=(-((columns - 1) / 2) * a + i * a, 0, 0),
                          radius=radius, material=ROD_MATERIAL)
                for i in range(columns)] if with_rods else []
        return Project(
            name='Square rod lattice | TM transmission',
            region=Region(dimension='2d', size=(14, a, 1), mesh=0.02, steps=14000, pml_cells=20,
                          backend='cpu', precision='float64', snapshot_interval=7000,
                          boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'),
                                                y_max=BoundaryFace(kind='periodic'))),
            materials=default_materials() + [Material(name=ROD_MATERIAL, index=index)],
            structures=rods,
            sources=[Source(id='source', kind='plane', injection='oneway', center=(-5.0, 0, 0),
                            size=(0, a, 0), pulse='broadband', time_definition='wavelength',
                            wavelength=1.5, wavelength_start=0.9, wavelength_stop=3.0)],
            monitors=[FieldMonitor(id=label, name=label, center=(x, 0, 0), size=(0, a, 1),
                                   spectrum=SpectrumSettings(sampling='wavelength', wavelength_start=0.9,
                                                             wavelength_stop=3.0, frequency_points=121,
                                                             apodization='none'))
                      for label, x in [('reflection', -4.5), ('transmission', 4.0)]])

    t0 = time.time()
    reference = Simulation(build(False)).run()
    sample = Simulation(build(True)).run()
    print(f'band-gap runs {time.time() - t0:.1f} s (CPU, float64)')
    transmit = normalize_flux(sample.field_monitor('transmission'), reference.field_monitor('transmission'))
    reflect = normalize_flux(sample.field_monitor('reflection'), reference.field_monitor('reflection'),
                             subtract_incident=True)
    wl = 299792458 / transmit['frequency_hz'] * 1e6
    T = np.asarray(transmit['ratio'])
    R = -np.asarray(reflect['ratio'])
    valid = np.asarray(transmit['valid']) & np.asarray(reflect['valid'])
    norm = a / wl
    keep = valid & (norm > .17) & (norm < .48)
    order = np.argsort(norm[keep])
    x = norm[keep][order]
    Tk, Rk = T[keep][order], R[keep][order]
    inside = Tk < 1e-3
    gap = (float(np.min(x[inside])), float(np.max(x[inside]))) if inside.any() else (0, 0)

    fig, axes = plt.subplots(1, 2, figsize=(8.4, 2.9), layout='constrained',
                             gridspec_kw={'width_ratios': [1.35, 1]})
    ax = axes[0]
    ax.axvspan(gap[0], gap[1], color=AMBER, alpha=.16, zorder=1)
    ax.plot(x, Tk, color=BLUE, lw=1.8, label='transmission')
    ax.plot(x, Rk, color=RED, lw=1.4, alpha=.85, label='reflection')
    ax.text((gap[0] + gap[1]) / 2, .52, f'TM band gap\n$a/\\lambda$ = {gap[0]:.3f} – {gap[1]:.3f}\n'
            f'$\\lambda$ = {a / gap[1]:.2f} – {a / gap[0]:.2f} µm',
            ha='center', fontsize=8.5, color='#8a6400')
    ax.set(xlabel='normalised frequency  $a/\\lambda$', ylabel='power ratio', ylim=(-.04, 1.1),
           xlim=(float(x.min()), float(x.max())))
    ax.set_title(f'10 rod rows, a = {a} µm, r/a = {radius / a:.1f}, n = {index}')
    ax.legend(ncol=2, loc='upper left')
    bare(ax, axis='both')

    ax = axes[1]
    ax.semilogy(x, np.maximum(Tk, 1e-9), color=BLUE, lw=1.6)
    ax.axvspan(gap[0], gap[1], color=AMBER, alpha=.16)
    ax.set(xlabel='normalised frequency  $a/\\lambda$', ylabel='transmission (log)', ylim=(1e-9, 3),
           xlim=(float(x.min()), float(x.max())))
    ax.set_title('Five decades of extinction inside the gap')
    bare(ax, axis='both')
    finish(fig, 'field-phc-gap')

    record = dict(a_um=a, radius_um=radius, index=index, columns=columns,
                  gap_normalised=gap, gap_um=(a / gap[1], a / gap[0]),
                  median_energy_residual=float(np.median(np.abs(Rk + Tk - 1))),
                  max_energy_residual=float(np.max(np.abs(Rk + Tk - 1))))
    (OUT / 'phc-gap.json').write_text(json.dumps(record, indent=2), encoding='utf-8')
    print(record)
    return gap


def field_phc_w1():
    """A W1 line defect guiding at mid-gap, computed on the CPU here."""
    from photonweave import Project, Region, Structure, Source, Monitor, Material, Simulation
    from photonweave.models import default_materials

    a, radius, index = A_LATTICE, ROD_RADIUS, ROD_INDEX
    nx, ny = 20, 9
    span_x, span_y = 12.0, 6.0
    rods = []
    for ix in range(nx):
        x = -((nx - 1) / 2) * a + ix * a
        for iy in range(ny):
            y = -((ny - 1) / 2) * a + iy * a
            if abs(y) < a / 2:        # removed row -> W1 line defect
                continue
            rods.append(Structure(id=f'rod{ix}_{iy}', name=f'rod{ix}_{iy}', kind='circle',
                                  center=(x, y, 0), radius=radius, material=ROD_MATERIAL))
    project = Project(
        name='W1 photonic-crystal waveguide | 2D TMz',
        region=Region(dimension='2d', size=(span_x, span_y, 1), mesh=0.025, steps=6000,
                      pml_cells=16, backend='cpu', snapshot_interval=50),
        materials=default_materials() + [Material(name=ROD_MATERIAL, index=index, color='#3f6f96')],
        structures=rods,
        sources=[Source(id='source', center=(-4.0, 0, 0), wavelength=1.55, pulse_cycles=10)],
        monitors=[Monitor(id='near', name='near', center=(-3.0, 0, 0)),
                  Monitor(id='far', name='far', center=(3.6, 0, 0))])
    t0 = time.time()
    result = Simulation(project).run()
    print(f'W1 waveguide run {time.time() - t0:.1f} s ({len(rods)} rods)')
    frames = np.asarray(result.frames)
    steps = list(result.frame_steps)
    targets = (1400, 2600, 4200)
    picks = [min(range(len(steps)), key=lambda i: abs(steps[i] - t)) for t in targets]
    fig, axes = plt.subplots(3, 1, figsize=(7.2, 4.4), layout='constrained')
    for ax, idx in zip(axes, picks):
        patches = [Circle((s.center[0], s.center[1]), radius, fill=False, ec='#2b4a60', lw=.3, alpha=.5)
                   for s in rods]
        vmax = float(np.max(np.abs(frames[idx]))) * .45
        draw_field(ax, frames[idx], (-span_x / 2, span_x / 2, -span_y / 2, span_y / 2),
                   f'$E_z$, step {steps[idx]}', vmax, patches)
    axes[-1].set_xlabel(f'a = {a} µm, r/a = {radius / a:.1f}, n = {index}, λ = 1.55 µm (mid gap), '
                        f'Δ = 0.025 µm, each panel scaled to its own peak', fontsize=7.5)
    finish(fig, 'field-phc-w1')


def field_slab_validation():
    """Reproduce the analytic slab check on the CPU and plot R/T against theory."""
    from photonweave import Simulation, normalize_flux, Project
    import importlib.util
    spec = importlib.util.spec_from_file_location('flux_slab', 'examples/flux_slab.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    project = module.make_project('cpu')
    project.materials[1].index = 1.5
    t0 = time.time()
    sample = Simulation(project).run()
    air = Project.model_validate(project.model_dump())
    air.structures = []
    reference = Simulation(air).run()
    print(f'slab validation run {time.time() - t0:.1f} s')
    reflect = normalize_flux(sample.field_monitor('reflection'), reference.field_monitor('reflection'),
                             subtract_incident=True)
    transmit = normalize_flux(sample.field_monitor('transmission'), reference.field_monitor('transmission'))
    valid = reflect['valid'] & transmit['valid']
    wl = 299792458 / transmit['frequency_hz'] * 1e6
    R = -reflect['ratio']
    T = transmit['ratio']
    exact = 1 / (1 + ((1.5 ** 2 - 1) / 3) ** 2 * np.sin(2 * np.pi * 1.5 * .2 / wl) ** 2)
    order = np.argsort(wl)
    fig, axes = plt.subplots(1, 2, figsize=(8.2, 2.8), layout='constrained')
    axes[0].plot(wl[order], T[order], color=BLUE, lw=2, label='PhotonWeave T')
    axes[0].plot(wl[order], R[order], color=RED, lw=2, label='PhotonWeave R')
    axes[0].plot(wl[order], exact[order], 'k--', lw=1, label='analytic T')
    axes[0].plot(wl[order], 1 - exact[order], 'k:', lw=1, label='analytic R')
    axes[0].set(xlabel='wavelength (µm)', ylabel='power ratio', ylim=(-.03, 1.03))
    axes[0].set_title('n = 1.5 slab, 0.2 µm thick, 31 frequencies')
    axes[0].legend(ncol=2, loc='center left')
    axes[1].semilogy(wl[order], np.abs(T - exact)[order], color=BLUE, label='|T − analytic|')
    axes[1].semilogy(wl[order], np.abs(R - (1 - exact))[order], color=RED, label='|R − analytic|')
    axes[1].semilogy(wl[order], np.abs(R + T - 1)[order], color=GREEN, label='|R + T − 1|')
    axes[1].set(xlabel='wavelength (µm)', ylabel='absolute error')
    axes[1].set_title('Error against the closed-form solution')
    axes[1].legend(loc='lower center')
    for ax in axes:
        bare(ax, axis='both')
    finish(fig, 'field-slab-validation')
    summary = dict(max_T_error=float(np.max(np.abs(T[valid] - exact[valid]))),
                   max_R_error=float(np.max(np.abs(R[valid] - (1 - exact[valid])))),
                   max_energy_residual=float(np.max(np.abs(R[valid] + T[valid] - 1))))
    (OUT / 'slab-validation.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    print(summary)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--charts', action='store_true', help='recorded-measurement charts only')
    ap.add_argument('--fields', action='store_true', help='solver field figures only')
    args = ap.parse_args()
    do_charts = args.charts or not args.fields
    do_fields = args.fields or not args.charts
    if do_charts:
        chart_lumerical()
        chart_flaport()
        chart_cpu_gpu()
        chart_batch_scaling()
        chart_ablation()
        chart_adjoint()
        chart_dispersive()
        chart_beyond_vram()
        chart_mie()
        chart_design_loop()
        chart_grouped()
    if do_fields:
        field_waveguide()
        field_scatterer()
        field_phc_gap()
        field_phc_w1()
        field_slab_validation()


if __name__ == '__main__':
    main()
