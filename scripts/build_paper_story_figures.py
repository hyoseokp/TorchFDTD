"""Publication figures from completed validation records. No solver is run.

This module also holds the shared figure style (palette, fonts, panel labels)
used by scripts/build_paper_assets.py, so every figure in the manuscript is
typeset with one visual system.
"""
from pathlib import Path
import hashlib
import json
import statistics
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Polygon
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/validation'
OUT = ROOT / 'docs/paper/figures'
if not DATA.is_dir():
    DATA = ROOT / 'anc'
    OUT = ROOT / 'figures'
INPUTS = {}

# Categorical palette validated for lightness, chroma, CVD and normal-vision
# separation against a white surface. Grey is the neutral for references.
BLUE, TEAL, ORANGE, RED, PURPLE = '#2f6db3', '#0f9a8b', '#e07f2c', '#c4423a', '#7a62be'
GREY, INK, MUTED, LINE = '#6b7480', '#24313b', '#4a5560', '#c9ced3'
BLUES = ['#b7cde6', '#7ea6d1', '#4a80bb', '#1f4f86']   # sequential, light to dark
WIDTH = 6.3   # \linewidth of the A4 manuscript with 25 mm margins, in inches
METADATA = {'Author': 'Hyoseok Park', 'CreationDate': None, 'ModDate': None}


def apply_style():
    plt.rcParams.update({
        'font.family': 'Arial', 'font.size': 7.5,
        'mathtext.fontset': 'custom', 'mathtext.rm': 'Arial',
        'mathtext.it': 'Arial:italic', 'mathtext.bf': 'Arial:bold',
        'svg.fonttype': 'none', 'pdf.fonttype': 42, 'ps.fonttype': 42,
        'axes.titlesize': 8, 'axes.labelsize': 7.5, 'axes.labelcolor': INK,
        'xtick.labelsize': 7, 'ytick.labelsize': 7, 'legend.fontsize': 6.8,
        'axes.edgecolor': INK, 'axes.linewidth': 0.6,
        'axes.spines.top': True, 'axes.spines.right': True,
        'xtick.color': INK, 'ytick.color': INK,
        'xtick.major.width': 0.6, 'ytick.major.width': 0.6,
        'xtick.minor.width': 0.4, 'ytick.minor.width': 0.4,
        'xtick.major.size': 2.5, 'ytick.major.size': 2.5,
        'xtick.minor.size': 1.5, 'ytick.minor.size': 1.5,
        'xtick.direction': 'out', 'ytick.direction': 'out',
        'lines.linewidth': 1.3, 'lines.markersize': 4,
        'legend.frameon': False, 'legend.handlelength': 1.6,
        'legend.borderaxespad': 0.2, 'legend.labelspacing': 0.35,
        'savefig.facecolor': 'white', 'text.color': INK,
    })


def panel(ax, letter, title='', y=None):
    """Bold panel letter and a short title, left aligned above the axes. y (axes fraction) fixes its height."""
    ax.set_title(r'$\mathbf{' + letter + '}$' + ('   ' + title if title else ''),
                 loc='left', fontsize=8, pad=7, color=INK, **({} if y is None else {'y': y}))


def align_square_title(fig, square, neighbour, letter, title):
    """Put the title of an equal-aspect panel on the line of the titles of its taller neighbours."""
    fig.canvas.draw()
    lower, upper = square.get_position(), neighbour.get_position()
    panel(square, letter, title, y=(upper.y1 - lower.y0) / lower.height)


def sci_tex(value, digits=1):
    """Mathtext scientific notation such as 1.1 x 10^-4."""
    mantissa, exponent = f'{value:.{digits}e}'.split('e')
    return f'${mantissa}\\times10^{{{int(exponent)}}}$'


def ygrid(ax):
    ax.grid(axis='y', color=LINE, lw=0.5, alpha=0.7)
    ax.set_axisbelow(True)


def read(name):
    p = DATA / name
    INPUTS[name] = hashlib.sha256(p.read_bytes()).hexdigest()
    return json.loads(p.read_text(encoding='utf-8'))


def save(fig, name, png=True):
    OUT.mkdir(exist_ok=True)
    fig.savefig(OUT / (name + '.pdf'), bbox_inches='tight', pad_inches=0.04, metadata=METADATA)
    fig.savefig(OUT / (name + '.svg'), bbox_inches='tight', pad_inches=0.04)
    if png:
        fig.savefig(OUT / (name + '.png'), dpi=220, bbox_inches='tight', pad_inches=0.04)
    plt.close(fig)


# ----------------------------------------------------------------------------
# Geometry panels: what each validation simulated, drawn from its record
# ----------------------------------------------------------------------------

PALE = {'blue': '#dbe7f5', 'teal': '#dff2ef', 'orange': '#fbeee2', 'grey': '#e6e9ec'}
EXAMPLES = ROOT if DATA == ROOT / 'docs/validation' else DATA


def read_repo(name):
    """A record kept outside docs/validation, such as the geometry file of an example."""
    p = EXAMPLES / name
    INPUTS[name] = hashlib.sha256(p.read_bytes()).hexdigest()
    return json.loads(p.read_text(encoding='utf-8'))


def slab_lane(ax, y0, height, x_range, pml, slab, label, source_x, monitors, fill=None):
    """One periodic lane of a normal-incidence slab cell: absorbers, slab, source and monitors, to scale along x."""
    x0, x1 = x_range
    ax.add_patch(Rectangle((x0, y0), x1 - x0, height, facecolor='white', edgecolor=LINE, lw=0.5))
    for start in (x0, x1 - pml):
        ax.add_patch(Rectangle((start, y0), pml, height, facecolor=PALE['grey'], edgecolor='none'))
    lo, hi = slab
    ax.add_patch(Rectangle((lo, y0), hi - lo, height, facecolor=fill or BLUE, edgecolor='none', alpha=0.85))
    ax.text((lo + hi) / 2, y0 + height + 0.04, label, ha='center', va='bottom', fontsize=6.0, color=INK)
    ax.plot([source_x] * 2, [y0 + 0.06 * height, y0 + 0.94 * height], color=ORANGE, lw=1.3, solid_capstyle='butt')
    ax.annotate('', (source_x + 0.55, y0 + height / 2), (source_x + 0.05, y0 + height / 2),
                arrowprops=dict(arrowstyle='-|>', color=ORANGE, lw=0.8, mutation_scale=6))
    for name, x in monitors:
        ax.plot([x] * 2, [y0, y0 + height], color=TEAL, lw=0.9, ls=(0, (2.5, 1.5)))
        ax.text(x, y0 - 0.05, name, ha='center', va='top', fontsize=5.8, color=TEAL)
    for y in (y0, y0 + height):
        ax.plot([x0 + pml, x1 - pml], [y, y], color=MUTED, lw=0.6, ls=(0, (1, 1.5)))


def slab_frame(ax, x_range, y_top, note):
    x0, x1 = x_range
    ax.set_xlim(x0 - 0.05 * (x1 - x0), x1 + 0.05 * (x1 - x0))
    ax.set_ylim(-0.35, y_top)
    ax.set_yticks([])
    for side in ('left', 'right', 'top'):
        ax.spines[side].set_visible(False)
    ax.set_xlabel('x (µm)')
    ax.text(x1, y_top - 0.02, note, ha='right', va='top', fontsize=5.8, color=MUTED)


def flux_slab_geometry(ax, record):
    """Geometry panel of the analytic slab of examples/flux_slab.py."""
    project = record['project']
    region = project['region']
    size_x = region['size'][0]
    pml = region['pml_cells'] * region['mesh']
    structure = project['structures'][0]
    index = {m['name']: m['index'] for m in project['materials']}[structure['material']]
    centre, thickness = structure['center'][0], structure['size'][0]
    source_x = project['sources'][0]['center'][0]
    monitors = [('R' if m['name'] == 'reflection' else 'T', m['center'][0]) for m in project['monitors']]
    slab_lane(ax, 0.0, 0.5, (-size_x / 2, size_x / 2), pml, (centre - thickness / 2, centre + thickness / 2),
              f'slab, n = {index:g}, {thickness:g} µm', source_x, monitors)
    ax.text(-size_x / 2 + pml / 2, 0.25, 'PML', rotation=90, ha='center', va='center', fontsize=5.6, color=MUTED)
    ax.text(source_x, -0.05, 'source', ha='center', va='top', fontsize=5.8, color=ORANGE)
    slab_frame(ax, (-size_x / 2, size_x / 2), 1.05,
               f"{region['size'][1]:g} µm period along y (dotted), mesh {region['mesh']:g} µm, "
               f"{region['pml_cells']} absorbing cells per end")


def dispersive_slab_geometry(ax, case, rec):
    """Geometry panel of the Drude and two-pole Lorentz slabs of the G3-03 fixture."""
    fixture = case['fixture']
    x_range = fixture['domain_um']['x']
    pml = fixture['mesh_sweep'][0]['pml_thickness_um']
    centre = float(fixture['slab_faces'].split('x = ')[1].split(' um')[0])
    source_x = fixture['source']['x_um']
    mon = fixture['monitors']
    monitors = [('R', mon['reflection_x_um']), ('T', mon['transmission_x_um'])]
    lanes = [('drude', 'Drude slab', BLUE), ('lorentz', 'two-pole Lorentz slab', BLUE)]
    for k, (material, name, color) in enumerate(lanes):
        thickness = rec[f'analytic {material} TE h10']['thickness_um']
        y0 = 1.05 - 0.75 * k
        slab_lane(ax, y0, 0.36, x_range, pml, (centre - thickness / 2, centre + thickness / 2),
                  f'{name}, {thickness:g} µm', source_x, monitors, fill=color)
        if k == 0:
            ax.text(source_x, y0 - 0.05, 'source', ha='center', va='top', fontsize=5.8, color=ORANGE)
    slab_frame(ax, x_range, 1.75, f"periodic along y (dotted), PML {pml:g} µm per end")


def sphere_geometry(ax, project):
    """Cross-section z = 0 of the closed total-field/scattered-field sphere scene."""
    region = project['region']
    half = region['size'][0] / 2
    pml = region['pml_cells'] * region['mesh']
    sphere = project['structures'][0]
    index = {m['name']: m['index'] for m in project['materials']}[sphere['material']]
    source = project['sources'][0]
    box = source['size'][0] / 2
    flux = max(abs(m['center'][0]) for m in project['monitors'])
    r = sphere['radius']
    ax.add_patch(Rectangle((-half, -half), 2 * half, 2 * half, facecolor=PALE['grey'], edgecolor=LINE, lw=0.5))
    ax.add_patch(Rectangle((-half + pml, -half + pml), 2 * (half - pml), 2 * (half - pml), facecolor='white', edgecolor='none'))
    ax.add_patch(Rectangle((-box, -box), 2 * box, 2 * box, facecolor=PALE['orange'], edgecolor=ORANGE, lw=0.9,
                           ls=(0, (3, 2))))
    ax.add_patch(Rectangle((-flux, -flux), 2 * flux, 2 * flux, facecolor='none', edgecolor=TEAL, lw=0.9))
    ax.add_patch(plt.Circle((0, 0), r, facecolor=BLUE, edgecolor='none', alpha=0.9))
    ax.text(0, -r - 0.06, f'n = {index:g}\nr = {r:g} µm', ha='center', va='top', fontsize=5.6, color=INK, linespacing=1.2)
    ax.annotate('', (-box + 0.45, box - 0.36), (-box + 0.08, box - 0.36),
                arrowprops=dict(arrowstyle='-|>', color=ORANGE, lw=0.9, mutation_scale=7))
    ax.text(-box + 0.08, box - 0.06, f"+{source['normal']}, {source['component']}", fontsize=5.6, color=ORANGE,
            ha='left', va='top')
    ax.text(box - 0.06, box - 0.06, 'total\nfield', ha='right', va='top', fontsize=5.6, color=ORANGE, linespacing=1.1)
    ax.text(0, (box + flux) / 2, 'flux surface', ha='center', va='center', fontsize=5.4, color=TEAL)
    ax.text(half - pml / 2, 0, 'PML', rotation=90, ha='center', va='center', fontsize=5.6, color=MUTED)
    ax.set(xlim=(-half, half), ylim=(-half, half), aspect='equal', xlabel='x (µm)', ylabel='y (µm)')


def metalens_topview(ax, geometry):
    """Top view of the pillar lens compared with Meep, from its geometry file."""
    cell = geometry['cell_um'][0] / 2
    pml = geometry['pml_um']
    ax.add_patch(Rectangle((-cell, -cell), 2 * cell, 2 * cell, facecolor=PALE['grey'], edgecolor=LINE, lw=0.5))
    ax.add_patch(Rectangle((-cell + pml, -cell + pml), 2 * (cell - pml), 2 * (cell - pml), facecolor='white', edgecolor='none'))
    for p in geometry['pillars']:
        ax.add_patch(plt.Circle((p['x_um'], p['y_um']), p['radius_um'], facecolor=BLUE, edgecolor='none'))
    ax.add_patch(plt.Circle((0, 0), geometry['aperture_um'] / 2, facecolor='none', edgecolor=GREY, lw=0.7, ls=(0, (3, 2))))
    ax.plot([-cell + pml, cell - pml], [0, 0], color=ORANGE, lw=0.8, ls=(0, (1, 1.2)))
    ax.set(xlim=(-cell, cell), ylim=(-cell, cell), aspect='equal', xlabel='x (µm)', ylabel='y (µm)')

# ----------------------------------------------------------------------------
# Figure 1: execution and differentiation schematic
# ----------------------------------------------------------------------------

def architecture():
    """Orthographic algorithm schematic, not a simulated device or field."""
    fig, ax = plt.subplots(figsize=(WIDTH, 4.0))
    fig.subplots_adjust(0, 0, 1, 1)
    ax.set(xlim=(0, 160), ylim=(0, 101.5), aspect='equal')
    ax.axis('off')
    pale = {'blue': '#e4edf7', 'teal': '#dff2ef', 'orange': '#fbeee2', 'grey': '#eef0f2'}

    def text(x, y, s, size=6.8, color=INK, ha='center', va='center', **kw):
        ax.text(x, y, s, fontsize=size, color=color, ha=ha, va=va, **kw)

    def rbox(x, y, w, h, s, edge=INK, fill='white', size=6.8, color=INK, lw=0.7):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0,rounding_size=1.4',
                                    facecolor=fill, edgecolor=edge, linewidth=lw))
        text(x + w / 2, y + h / 2, s, size=size, color=color, linespacing=1.25)

    def rect(x, y, w, h, fc='none', ec=INK, lw=0.6, **kw):
        ax.add_patch(Rectangle((x, y), w, h, facecolor=fc, edgecolor=ec, lw=lw, **kw))

    def arrow(a, b, color=INK, lw=0.8, style='-|>', ls='-', ms=6):
        ax.annotate('', b, a, arrowprops=dict(arrowstyle=style, color=color, lw=lw,
                    linestyle=ls, shrinkA=1.5, shrinkB=1.5, mutation_scale=ms))

    def dim(a, b, label, offset=1.6, size=6.2, color=MUTED):
        """Horizontal dimension line between points a and b with a centred label."""
        (x0, y0), (x1, _) = a, b
        ax.annotate('', (x1, y0), (x0, y0), arrowprops=dict(arrowstyle='<|-|>', color=color,
                    lw=0.55, mutation_scale=4, shrinkA=0, shrinkB=0))
        text((x0 + x1) / 2, y0 - offset, label, size=size, color=color)

    def label(x, y, s):
        text(x, y, s, size=9, weight='bold')

    def title(x, y, s):
        text(x, y, s, size=8, ha='left')

    # ---------------- (a) forward map and its transpose ----------------
    label(2, 98.3, 'a'); title(6.5, 98.3, 'Optical model and its discrete transpose')
    fy, fh = 79, 10          # forward row
    ry, rh = 57, 9           # reverse row
    fwd = [(2, 15, 'Design\nparameters $p$'), (22, 17, 'Material\n$\\epsilon(p)$'),
           (87, 20, 'Plane spectra\n$E_\\omega,\\,H_\\omega$'), (112, 22, 'Angular spectrum\n$P_z=F^{-1}H_zF$'),
           (139, 19, 'Objective\n$J$')]
    for x, w, s in fwd:
        rbox(x, fy, w, fh, s, edge=INK, fill='white')
    rev = [(2, 15, 'Gradient\n$\\nabla_{\\!p}J$'), (22, 17, 'Material\ncotangent $\\bar\\epsilon$'),
           (45, 36, 'Transposed sweep\nwith checkpoint replay'), (87, 20, 'Plane\ncotangent'),
           (112, 22, 'Propagation\ntranspose $P_z^{\\mathsf{T}}$'), (139, 19, 'Seed\n$\\bar J=1$')]
    for x, w, s in rev:
        rbox(x, ry, w, rh, s, edge=TEAL, fill=pale['teal'], color=INK)
    # FDTD domain cross-section, schematic geometry only.
    x0, y0, w0, h0 = 45, 73, 36, 22
    rect(x0, y0, w0, h0, fc=pale['grey'], ec=LINE, lw=0.6)
    rect(x0 + 3, y0 + 2.5, w0 - 6, h0 - 5, fc='white', ec='none')
    text(x0 + w0 - 1.2, y0 + 1.3, 'PML', size=5.4, color=MUTED, ha='right')
    ax.plot([x0 + 4, x0 + w0 - 4], [78.4, 78.4], color=ORANGE, lw=1.1, solid_capstyle='butt')
    text(x0 + 4, 76.7, 'source', size=5.4, color=ORANGE, ha='left')
    for px, pw in [(52, 2.6), (57, 3.6), (62.5, 2.6), (68, 3.6), (73.5, 2.6)]:
        rect(px, 81.6, pw, 3.8, fc=BLUE, ec='none')
    text(63, 87.3, 'design region', size=5.4, color=BLUE)
    ax.plot([x0 + 4, x0 + w0 - 4], [90, 90], color=TEAL, lw=1.1, solid_capstyle='butt')
    text(x0 + 4, 91.7, 'plane monitor', size=5.4, color=TEAL, ha='left')
    text(x0 + 1.2, y0 + h0 - 1.3, 'FDTD domain', size=5.6, color=MUTED, ha='left')
    # forward arrows
    for xa, xb in [(17, 22), (39, 45), (81, 87), (107, 112), (134, 139)]:
        arrow((xa, fy + fh / 2), (xb, fy + fh / 2), color=INK)
    # reverse arrows
    for xa, xb in [(139, 134), (112, 107), (87, 81), (45, 39), (22, 17)]:
        arrow((xa, ry + rh / 2), (xb, ry + rh / 2), color=TEAL)
    # transposition links
    for xc in (30.5, 63, 97, 123):
        ax.plot([xc, xc], [ry + rh, fy if xc != 63 else y0], color=TEAL, lw=0.6, ls=(0, (1.2, 1.6)))
    arrow((148.5, fy), (148.5, ry + rh), color=TEAL, lw=0.8)
    text(150.2, (fy + ry + rh) / 2, 'reverse\nsweep', size=5.6, color=TEAL, ha='left')
    text(80, 52.2, 'Every forward kernel has its own transpose kernel. The reverse row is the '
         'discrete adjoint of the row above it.', size=6.2, color=MUTED)
    ax.plot([2, 158], [48.6, 48.6], color=LINE, lw=0.6)

    # ---------------- (b) host-streamed sweep over causal slabs ----------------
    label(2, 45.5, 'b'); title(6.5, 45.5, 'Host-streamed sweep over causal slabs')
    ox, oy = 9, 9.5                  # origin of the space-time diagram
    sw, bh, halo = 8.0, 9.0, 2.1     # slab width, block height, halo width
    nslab, nblock = 6, 3
    current = (2, 2)                 # (block, slab) of the trapezoid on the GPU
    for b in range(nblock):
        y0, y1 = oy + b * bh, oy + (b + 1) * bh
        for k in range(nslab):
            x0, x1 = ox + k * sw, ox + (k + 1) * sw
            state = 'done' if (b, k) < current else ('now' if (b, k) == current else 'todo')
            poly = [(x0 - halo, y0), (x1 + halo, y0), (x1, y1), (x0, y1)]
            fc = {'done': '#c9ced3', 'now': TEAL, 'todo': 'white'}[state]
            ec = {'done': '#9aa3ad', 'now': TEAL, 'todo': LINE}[state]
            ax.add_patch(Polygon(poly, closed=True, facecolor=fc, edgecolor=ec, alpha=0.45 if state != 'todo' else 1,
                                 lw=0.5, ls='-' if state != 'todo' else (0, (1.6, 1.3)), zorder=2))
            if state != 'todo':
                rect(x0, y0, sw, bh, fc=fc, ec=ec, lw=0.5, zorder=3)
            if state == 'now':
                ax.add_patch(Polygon(poly, closed=True, facecolor=TEAL, edgecolor=TEAL, alpha=0.4, lw=0.8, zorder=5))
                rect(x0, y0, sw, bh, fc=TEAL, ec=TEAL, lw=0.5, zorder=5)
                text((x0 + x1) / 2, (y0 + y1) / 2, 'on\nGPU', size=5.8, color='white', zorder=6)
            if (b, k) == (current[0], current[1] + 1):
                text((x0 + x1) / 2, (y0 + y1) / 2, 'next', size=5.6, color=MUTED, zorder=6)
    # axes of the diagram
    xa0, xa1 = ox - halo - 1.5, ox + nslab * sw + halo + 1.5
    ya0, ya1 = oy, oy + nblock * bh + 2.5
    arrow((xa0, oy), (xa1, oy), color=MUTED, lw=0.6, ms=5)
    arrow((xa0, ya0), (xa0, ya1), color=MUTED, lw=0.6, ms=5)
    text((xa0 + xa1) / 2, oy - 2.1, 'position $x$, slabs of $W$ cells', size=6, color=MUTED)
    text(xa0 - 1.2, (ya0 + ya1) / 2, 'time, blocks of $K$ steps', size=6, color=MUTED, rotation=90)
    text(xa1 + 0.8, oy, '$u^{n}$', size=5.8, color=MUTED, ha='left')
    text(xa1 + 0.8, oy + nblock * bh, '$u^{n+3K}$', size=5.8, color=MUTED, ha='left')
    # annotate the current trapezoid
    cx0 = ox + current[1] * sw
    cy1 = oy + (current[0] + 1) * bh
    dim((cx0, cy1 + 1.1), (cx0 + sw, cy1 + 1.1), '$W$', offset=-2.3)
    t = 0.45   # the leader ends inside the left halo wedge at this fraction of the block height
    ax.annotate('halo $K$', (cx0 - halo * (1 - t) / 2, oy + (current[0] + t) * bh), (cx0 - 9, cy1 + 4.2),
                fontsize=5.8, color=TEAL, ha='center',
                arrowprops=dict(arrowstyle='-', color=TEAL, lw=0.5, shrinkA=0, shrinkB=0))
    # memory tiers
    lx = 67
    ax.add_patch(Polygon([(lx - 2.5, 30), (lx + 4.5, 30), (lx + 3.2, 34.5), (lx - 1.2, 34.5)],
                         closed=True, facecolor=TEAL, edgecolor=TEAL, lw=0.5))
    text(lx + 6.2, 32.3, 'GPU VRAM: one slab\nblock of $(W+2K)$ cells\nfor $K$ steps', size=5.5, ha='left', linespacing=1.15)
    for k in range(4):
        rect(lx - 2.5 + k * 1.8, 18.5, 1.8, 4.5, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
    rect(lx - 2.5 + 1.8, 18.5, 1.8, 4.5, fc=pale['blue'], ec=BLUE, lw=0.6)
    text(lx + 6.2, 20.8, 'Host DRAM: state\nbanks of all slabs and\nblock checkpoints', size=5.5, ha='left', linespacing=1.15)
    arrow((lx + 1, 29.4), (lx + 1, 23.6), color=BLUE, lw=0.6, style='<|-|>', ms=5)
    text(lx + 2.2, 26.5, 'read / write', size=5.4, color=BLUE, ha='left')
    text(47, 2.2, 'Slabs advance one block at a time, left to right. The device holds one slab\n'
         'and the full-domain discrete problem is unchanged.', size=6.0, color=MUTED)
    ax.plot([96, 96], [0.5, 46.5], color=LINE, lw=0.6)

    # ---------------- (c) independent tiles ----------------
    label(100, 45.5, 'c'); title(104.5, 45.5, 'Independent lateral tiles')
    gx, core, ov, pml = 108, 16, 4, 3
    rh, gap, ytop = 6, 3.6, 34.5
    tiles = [('tile 1', 0, BLUE, pale['blue']), ('tile 2', core, TEAL, pale['teal'])]
    for i, (name, cx, col, fill) in enumerate(tiles):
        y = ytop - i * (rh + gap)
        rect(gx + cx - ov - pml, y, pml, rh, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
        rect(gx + cx + core + ov, y, pml, rh, fc='#e3e7eb', ec='#b5bcc4', lw=0.5)
        for hx in (gx + cx - ov, gx + cx + core):
            rect(hx, y, ov, rh, fc='white', ec=col, lw=0.5, hatch='////')
        rect(gx + cx, y, core, rh, fc=fill, ec=col, lw=0.8)
        text(gx + cx + core / 2, y + rh / 2, name, size=6, color=col)
    ya = ytop - 2 * (rh + gap)
    rect(gx, ya, core, rh * 0.6, fc=BLUE, ec='none')
    rect(gx + core, ya, core, rh * 0.6, fc=TEAL, ec='none')
    ax.plot([gx + core, gx + core], [ya, ya + rh * 0.6], color='white', lw=0.8)
    text(gx + core, ya - 2.4, 'assembled output plane, cores only', size=6, color=INK)
    for i, (name, cx, col, fill) in enumerate(tiles):
        y = ytop - i * (rh + gap)
        arrow((gx + cx + core / 2, y), (gx + cx + core / 2, ya + rh * 0.6), color=col, lw=0.6, ms=5)
    ax.plot([gx + core, gx + core], [ya + rh * 0.6 + 0.5, ytop + rh + 1.2], color=ORANGE, lw=0.7, ls=(0, (2, 1.5)))
    text(gx + core, ytop + rh + 2.6, 'artificial cut', size=5.8, color=ORANGE)
    text(148.5, ytop + rh / 2, 'grey: own PML', size=5.6, color=MUTED, ha='left')
    text(148.5, ytop - rh - gap + rh / 2, 'hatched: overlap', size=5.6, color=MUTED, ha='left')
    text(130, 2.2, 'Each tile is solved on its own, so coupling across the cut\nis lost, and its error is measured against the full domain.',
         size=6.0, color=MUTED)
    save(fig, 'execution-overview')


# ----------------------------------------------------------------------------
# Figure: matched memory and time, separate capacity test
# ----------------------------------------------------------------------------

def memory_cost():
    # A100 records when present, otherwise the RTX 5880 originals
    datasets = [read(f'cpu-gpu-adjoint-256-{n}-a100.json') if (DATA / f'cpu-gpu-adjoint-256-{n}-a100.json').exists()
                else read(f'cpu-gpu-adjoint-256-{n}-5880.json') for n in ('dielectric', 'ade')]
    assert all(d['stage'] == 'complete' for d in datasets)
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH * 0.72, 2.25))
    labels = ['Dielectric', 'Two-pole']
    x = np.arange(2)
    modes = [(-0.19, 'cuda_resident', BLUE, 'Resident'), (0.19, 'cuda_dram', TEAL, 'Host-streamed')]

    def value(d, mode, key):
        if key == 'time':
            return d['median_seconds'][mode]
        return statistics.median(r['peak_torch_cuda_allocated_bytes'] for r in d['records'][mode]) / 1e9

    for ax, key, letter, ttl, ylabel in [(axes[0], 'time', 'a', 'Median full-solve time', 'Wall time (s)'),
                                          (axes[1], 'memory', 'b', 'Median peak device allocation', 'Peak Torch allocation (GB)')]:
        series = {}
        for offset, mode, color, name in modes:
            vals = [value(d, mode, key) for d in datasets]
            series[mode] = vals
            bars = ax.bar(x + offset, vals, 0.36, color=color, label=name, linewidth=0)
            ax.bar_label(bars, labels=[f'{v:.2f}' for v in vals], padding=2.5, fontsize=6.5, color=INK)
        top = max(max(v) for v in series.values())
        for i in x:
            r, s = series['cuda_resident'][i], series['cuda_dram'][i]
            note = f'{s / r:.1f}$\\times$ slower' if key == 'time' else f'{100 * (1 - s / r):.0f}% lower'
            ax.text(i, top * 1.26, note, ha='center', va='bottom', fontsize=6.3, color=MUTED)
        ax.set_xticks(x, labels)
        ax.set_ylabel(ylabel)
        ax.set_ylim(0, top * 1.72)
        ax.tick_params(axis='x', length=0)
        panel(ax, letter, ttl)
        ygrid(ax)
    axes[0].legend(loc='upper left', ncol=2, columnspacing=1.0, handlelength=1.0, handleheight=0.9)
    fig.tight_layout(w_pad=1.8)
    save(fig, 'memory-cost')


# ----------------------------------------------------------------------------
# Figure: independent tiles and exterior propagation
# ----------------------------------------------------------------------------

def tiling_overlap():
    """Appendix figure: error and cell overhead of independent overlapping tiles."""
    tiled = read('tiled-stitching-3d-3060.json')
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH, 2.3))
    rows = tiled['through_pml']
    x = np.array([r['overlap_um'] for r in rows])

    ax = axes[0]
    for key, name, color, marker in [('near_error_hard', 'six-component near field', BLUE, 'o'),
                                     ('focal_intensity_error_hard', 'focal-plane intensity', TEAL, 's')]:
        y = np.array([100 * r[key] for r in rows])
        ax.plot(x, y, marker=marker, color=color, ms=4, mfc='white', mew=1.2, label=name)
    ax.legend(loc='upper right')
    ax.set(xlabel='Tile overlap (µm)', ylabel='Relative $L_2$ error (%)', ylim=(0, 14), xlim=(0, 2.75))
    ax.set_xticks([0.5, 1.0, 1.5, 2.0, 2.5])
    panel(ax, 'a', 'Independent-tile error')

    ax = axes[1]
    ratio = np.array([r['total_tile_cells'] / tiled['reference']['cells'] for r in rows])
    ax.plot(x, ratio, marker='o', color=ORANGE, ms=4, mfc='white', mew=1.2)
    ax.axhline(1, color=GREY, ls=(0, (3, 2)), lw=0.8)
    ax.text(2.7, 1.06, 'full grid', fontsize=6.4, color=GREY, va='bottom', ha='right')
    for xi, ri, r in zip(x, ratio, rows):
        ax.annotate(f"{r['tile_shapes'][0][0]}$^2$", (xi, ri), (0, 6), textcoords='offset points',
                    ha='center', fontsize=5.8, color=MUTED)
    ax.set(xlabel='Tile overlap (µm)', ylabel='Sum of tile cells / full-grid cells', ylim=(0.8, 4.0), xlim=(0, 2.75))
    ax.set_xticks([0.5, 1.0, 1.5, 2.0, 2.5])
    ax.text(0.04, 0.96, f"four tiles with {tiled['tile_um']:g} µm cores\nfull grid {tiled['reference']['shape'][0]}$^2\\times${tiled['reference']['shape'][2]}",
            transform=ax.transAxes, ha='left', va='top', fontsize=6.2, color=MUTED)
    panel(ax, 'b', 'Spatial overhead of tiling')
    fig.tight_layout(w_pad=2.2)
    save(fig, 'tiling-overlap')


def exterior_propagation():
    """Angular-spectrum propagation against FDTD through the observation region."""
    asm = read('angular-spectrum-3060.json')['metalens_3d']
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH, 2.3))
    ax = axes[0]
    z = np.asarray(asm['section']['z_um'])
    err = 100 * np.asarray(asm['section']['intensity_error_per_z'])
    ax.plot(z, err, color=BLUE, lw=1.3)
    zf = asm['section']['focus_fdtd']['z_um']
    ax.axvline(zf, color=TEAL, ls=(0, (3, 2)), lw=0.9)
    ax.text(zf + 0.12, 6.4, f'sampled FDTD focus\n{zf:.3f} µm', fontsize=6.3, color=TEAL, va='top')
    mean = 100 * asm['section']['intensity_error']
    ax.axhline(mean, color=GREY, ls=(0, (1, 1.5)), lw=0.8)
    ax.text(0.05, mean + 0.15, f'section {mean:.2f}%', fontsize=6.3, color=GREY, va='bottom')
    ax.set(xlabel='Distance above output plane (µm)', ylabel='Intensity relative $L_2$ error (%)', ylim=(0, 7.5), xlim=(0, 7.6))
    panel(ax, 'a', 'Exterior propagation accuracy')

    ax = axes[1]
    runs = asm['runs']
    names = [f"FDTD through focus\n{'×'.join(map(str, runs['through_focus']['shape']))}, {runs['through_focus']['steps']} steps",
             f"FDTD to output plane\n{'×'.join(map(str, runs['to_plane']['shape']))}, {runs['to_plane']['steps']} steps",
             f"FFT section\n{runs['asm_section']['planes']} planes"]
    vals = [runs[k]['wall_seconds'] for k in ('through_focus', 'to_plane', 'asm_section')]
    ypos = [2, 1, 0]
    bars = ax.barh(ypos, vals, color=[GREY, BLUE, TEAL], height=0.56, linewidth=0)
    ax.set_xscale('log')
    ax.set_xlim(0.01, 400)
    ax.bar_label(bars, labels=[f'{v:.3g} s' for v in vals], padding=3, fontsize=6.5, color=INK)
    ax.set_yticks(ypos, names, fontsize=6.4)
    ax.tick_params(axis='y', length=0)
    ax.set_xlabel('Recorded wall time (s)')
    ax.grid(axis='x', color=LINE, lw=0.5, alpha=0.7)
    ax.set_axisbelow(True)
    panel(ax, 'b', 'Exterior propagation cost')
    fig.tight_layout(w_pad=2.2)
    save(fig, 'exterior-propagation')


# ----------------------------------------------------------------------------
# Figure: propagated optical objective on the workstation
# ----------------------------------------------------------------------------

def application_record():
    p = read('beyond_vram_propagated_3060.json')['record']
    assert p['stage'] == 'complete'
    return p


def application_timeline(ax, p):
    """Timeline of the recorded streamed driver (panel a of the figure)."""
    streamed = p['executions']['streamed']
    runs = p['runs']
    phases = [('Forward solve', runs['streamed_forward']['seconds'], BLUE),
              ('Adjoint sweep', streamed['backward']['seconds'], TEAL),
              ('FD forward +δ', runs['streamed_fd_plus']['seconds'], GREY),
              ('FD forward −δ', runs['streamed_fd_minus']['seconds'], '#98a0a9')]
    total = p['elapsed_seconds']
    other = total - sum(s for _, s, _ in phases)
    phases.append(('Setup and checks', other, '#dfe3e7'))

    left, narrow = 0.0, 0
    for name, seconds, color in phases:
        minutes = seconds / 60
        ax.barh(0, minutes, left=left, color=color, height=0.5, linewidth=0.6, edgecolor='white')
        centre = left + minutes / 2
        if minutes > 6:      # wide segment: label inside
            ax.text(centre, 0, f'{name}\n{minutes:.2f} min', ha='center', va='center', fontsize=6.4, color='white')
        else:                # narrow segment: staggered label above with a thin leader
            ax.annotate(f'{name} {minutes:.2f} min', (centre, 0.25), (centre, 0.42 + 0.22 * narrow),
                        ha='left' if centre < total / 60 * 0.15 else 'center', va='bottom', fontsize=6.0, color=INK,
                        arrowprops=dict(arrowstyle='-', color=LINE, lw=0.5, shrinkA=0, shrinkB=1))
            narrow += 1
        left += minutes
    ax.set_xlim(0, total / 60 * 1.02)
    ax.set_ylim(-0.5, 1.7)
    ax.set_yticks([])
    for side in ('left', 'top', 'right'):
        ax.spines[side].set_visible(False)
    ax.set_xlabel('Driver wall time (min)')
    ax.text(0.3, 1.45, f"total {total / 60:.2f} min on an RTX 3060, "
            f"peak device allocation {streamed['backward']['peak_torch_allocated_bytes'] / 1e9:.2f} GB",
            fontsize=6.3, color=MUTED, va='center')


def application_check(ax, p):
    """Objective at three permittivities with the adjoint and central-difference slopes (panel b)."""
    fd = p['executions']['streamed']['fd']
    delta = fd['step']
    xs = np.array([-delta, 0.0, delta])
    js = np.array([fd['objective_minus'], fd['objective'], fd['objective_plus']])
    xx = np.linspace(-delta * 1.15, delta * 1.15, 2)
    ax.plot(xx, js[1] + fd['directional_derivative'] * xx, color=TEAL, lw=1.4,
            label=f"adjoint slope {fd['directional_derivative']:.5f}")
    ax.plot(xx, js[1] + fd['finite_difference'] * xx, color=GREY, lw=1.0, ls=(0, (3, 2)),
            label=f"central difference {fd['finite_difference']:.5f}")
    ax.plot(xs, js, 'o', color=INK, ms=4.5, mfc='white', mew=1.2, label='objective of one forward solve', zorder=5)
    for xi, ji in zip(xs, js):
        ax.annotate(f'{ji:.4f}', (xi, ji), (0, -9), textcoords='offset points', ha='center', fontsize=6.0, color=MUTED)
    ax.set_xticks(xs, [f'−{delta:g}', '0', f'+{delta:g}'])
    ax.set_xlim(-delta * 1.3, delta * 1.3)
    ax.set_ylim(js.min() - 0.0035, js.max() + 0.0035)
    ax.set_xlabel('Permittivity perturbation $\\delta$')
    ax.set_ylabel('Objective (source-dependent units)')
    ax.legend(loc='upper left', fontsize=6.2, handlelength=1.8)
    ax.text(0.97, 0.05, f"relative difference {100 * fd['relative_error']:.2f}%", transform=ax.transAxes,
            ha='right', va='bottom', fontsize=6.4, color=INK)


def application():
    p = application_record()
    fig, axes = plt.subplots(1, 2, figsize=(WIDTH, 2.3), gridspec_kw={'width_ratios': [1.35, 1]})
    application_timeline(axes[0], p)
    panel(axes[0], 'a', 'Streamed optical-objective evaluation')
    application_check(axes[1], p)
    panel(axes[1], 'b', 'End-to-end derivative check')
    fig.tight_layout(w_pad=2.0)
    save(fig, 'propagated-adjoint')



# ----------------------------------------------------------------------------
# Figures added for the review: dispersive slabs, Meep comparisons
# ----------------------------------------------------------------------------

def dispersive_slabs():
    """Drude and two-pole Lorentz slabs against the transfer-matrix reference with the same permittivity."""
    rec = read('g3/G3-03.json')['entries']
    case = read('cases/G3-03_dispersive_slab_fit_ade.json')
    fig = plt.figure(figsize=(WIDTH, 3.6))
    grid = fig.add_gridspec(2, 3, height_ratios=[0.62, 1], width_ratios=[1, 1, 0.9])
    geo = fig.add_subplot(grid[0, :])
    dispersive_slab_geometry(geo, case, rec)
    panel(geo, 'a', 'Geometry at normal incidence')
    axes = [fig.add_subplot(grid[1, i]) for i in range(3)]
    for ax, material, letter, title in ((axes[0], 'drude', 'b', 'Drude slab, 0.1 µm'),
                                        (axes[1], 'lorentz', 'c', 'Two-pole Lorentz slab, 0.5 µm')):
        e = rec[f'analytic {material} TE h10']
        wl = np.asarray(e['wavelength_um'])
        order = np.argsort(wl)
        for key, color, marker in (('R', BLUE, 'o'), ('T', TEAL, 's'), ('A', ORANGE, '^')):
            ref = np.asarray(e[f'{key}_ref'])[order]
            got = np.asarray(e[f'{key}_fdtd'])[order]
            ax.plot(wl[order], ref, color=INK, lw=0.8, zorder=3)
            ax.plot(wl[order], got, ls='none', marker=marker, ms=3.0, mfc='white', mew=0.8, color=color, zorder=2, label=key)
        ax.set(xlabel='Wavelength (µm)', ylim=(-0.03, 1.03), xlim=(1.28, 1.82))
        ax.set_ylabel('Power fraction')
        panel(ax, letter, title)
    axes[0].legend(loc='center left', ncol=1, handletextpad=0.3)
    axes[1].text(0.97, 0.52, 'lines: transfer matrix\nmarkers: TorchFDTD, 10 nm', transform=axes[1].transAxes,
                 ha='right', va='center', fontsize=6.0, color=MUTED)
    ax = axes[2]
    for material, color, marker in (('drude', BLUE, 'o'), ('lorentz', ORANGE, 's')):
        h = [20, 10]
        err = [max(rec[f'analytic {material} TE h{m}'][f'{k}_abs_error'] for k in ('R', 'T', 'A')) for m in h]
        ax.plot(h, err, marker=marker, color=color, ms=4, mfc='white', mew=1.1, label=material.capitalize())
    ref = np.array([20, 10])
    ax.plot(ref, 3e-3 * (ref / 20) ** 2, color=GREY, lw=0.8, ls=(0, (3, 2)))
    ax.text(14, 3e-3 * (14 / 20) ** 2 * 1.6, 'slope 2', fontsize=6.0, color=GREY, rotation=28)
    ax.set(xscale='log', yscale='log', xlabel='Mesh step (nm)', ylabel='Max. |error| of R, T, A', xlim=(8, 25), ylim=(1e-4, 1e-2))
    ax.set_xticks([10, 20], ['10', '20'])
    ax.minorticks_off()
    ax.legend(loc='lower right')
    panel(ax, 'd', 'Mesh convergence')
    fig.tight_layout(w_pad=1.6, h_pad=1.2)
    save(fig, 'dispersive-slabs')


def metalens_meep():
    """Top view of the 3D pillar lens and its focal xz intensity from TorchFDTD and Meep on the same grid."""
    tr = read('meep_comparison/metalens_3d_torchfdtd.json')
    mr = read('meep_comparison/metalens_3d_meep.json')
    name = 'examples/meep_comparison/metalens/geometry_3d.json'
    geometry = read_repo(name)
    assert INPUTS[name] == tr['geometry_sha256'] == mr['geometry_sha256'], 'the drawn geometry must be the simulated one'
    t, m = tr['observables']['xz'], mr['observables']['xz']
    x = np.asarray(t['transverse_um'])
    z = np.asarray(t['z_um'])
    a = np.asarray(t['intensity'], dtype=float)
    b = np.asarray(m['intensity'], dtype=float)
    peak = b.max()
    fig, axes = plt.subplots(1, 4, figsize=(WIDTH, 2.25), gridspec_kw={'width_ratios': [1.3, 0.92, 1.0, 1.12]})
    metalens_topview(axes[0], geometry)
    panel(axes[0], 'a', 'Top view')
    extent = (z[0], z[-1], x[0], x[-1])
    for ax, data, letter, title in ((axes[1], a, 'b', 'TorchFDTD'), (axes[2], b, 'c', 'Meep')):
        im = ax.imshow(data / peak, origin='lower', extent=extent, aspect='auto', cmap='magma', vmin=0, vmax=1)
        ax.set(xlabel='z (µm)', ylabel='x (µm)')
        panel(ax, letter, f'{title}, |E|$^2$')
    cbar = fig.colorbar(im, ax=axes[2], fraction=0.06, pad=0.03)
    cbar.set_label('Intensity / Meep peak', fontsize=6.3)
    cbar.ax.tick_params(labelsize=6)
    ax = axes[3]
    centre = int(np.argmin(np.abs(x)))
    ax.plot(z, a[centre] / peak, color=BLUE, lw=1.3, label='TorchFDTD')
    ax.plot(z, b[centre] / peak, ls='none', marker='o', ms=2.4, mfc='white', mew=0.7, color=ORANGE, markevery=3, label='Meep')
    ax.set(xlabel='z (µm)', ylabel='On-axis intensity / Meep peak', ylim=(0, 1.1))
    ax.legend(loc='lower right', fontsize=5.8, handlelength=1.0, handletextpad=0.3)
    panel(ax, 'd', 'On-axis intensity')
    fig.tight_layout(w_pad=0.8)
    align_square_title(fig, axes[0], axes[1], 'a', 'Top view')
    save(fig, 'metalens-meep')


def microring_meep():
    """Microring resonator: field on and off resonance, and the transmission of both solvers."""
    tr = read('meep_comparison/microring_torchfdtd.json')
    me = read('meep_comparison/microring_meep.json')
    cmp_ = read('meep_comparison/microring_comparison.json')
    fields_path = DATA / 'paper_review/microring_fields_torchfdtd.npz'
    fig = plt.figure(figsize=(WIDTH, 4.5))
    grid = fig.add_gridspec(2, 2, height_ratios=[1.4, 1], hspace=0.42, wspace=0.3)
    if fields_path.exists():
        INPUTS['paper_review/microring_fields_torchfdtd.npz'] = hashlib.sha256(fields_path.read_bytes()).hexdigest()
        f = np.load(fields_path)
        # arrays are [iy, ix]; each map is divided by the source spectrum at its wavelength so both share one scale
        x, y, eps = f['x_um'], f['y_um'], f['epsilon']
        amp = {key: np.abs(f[key] / f[src]) for key, src in (('Ez_on', 'source_dft_on'), ('Ez_off', 'source_dft_off'))}
        vmax = float(amp['Ez_on'].max())
        level = eps.min() + 0.45 * (eps.max() - eps.min())
        axes_top = []
        for col, key, wl_key, letter in ((0, 'Ez_on', 'wavelength_on_um', 'a'), (1, 'Ez_off', 'wavelength_off_um', 'b')):
            ax = fig.add_subplot(grid[0, col])
            im = ax.imshow(amp[key] / vmax, origin='lower', extent=(x[0], x[-1], y[0], y[-1]), cmap='magma', vmin=0, vmax=1, aspect='equal')
            ax.contour(x, y, eps, levels=[level], colors='white', linewidths=0.35, alpha=0.6)
            ax.set(xlabel='x (µm)', ylabel='y (µm)')
            state = 'on resonance' if key == 'Ez_on' else 'off resonance'
            panel(ax, letter, f'|E$_z$| {state}, {1e3 * float(f[wl_key]):.2f} nm')
            axes_top.append(ax)
    ax = fig.add_subplot(grid[1, 0])
    wl = np.asarray(tr['wavelength_um']) * 1e3
    order = np.argsort(wl)
    ax.plot(wl[order], np.asarray(tr['T'])[order], color=BLUE, lw=1.1, label='TorchFDTD')
    ax.plot(wl[order], np.asarray(me['T'])[order], ls=(0, (3, 2)), color=ORANGE, lw=1.0, label='Meep')
    for r in cmp_['resonances']['torchfdtd']:
        if isinstance(r, dict) and r.get('valid') and r.get('center_nm'):
            ax.axvline(r['center_nm'], color=LINE, lw=0.6, zorder=0)
    ax.axhline(1.0, color=GREY, lw=0.6, ls=(0, (1, 2)), zorder=0)
    ax.set(xlabel='Wavelength (nm)', ylabel='Transmission', xlim=(1500, 1600))
    ax.legend(loc='lower left', ncol=2)
    panel(ax, 'c', 'Bus transmission, 89 219 steps')
    ax = fig.add_subplot(grid[1, 1])
    dT = np.abs(np.asarray(tr['T']) - np.asarray(me['T']))[order]
    ax.plot(wl[order], dT, color=TEAL, lw=0.9)
    ax.set(xlabel='Wavelength (nm)', ylabel='|T$_{TorchFDTD}$ $-$ T$_{Meep}$|', yscale='log', xlim=(1500, 1600), ylim=(1e-9, 1e-3))
    q = cmp_['criteria']
    ax.text(0.03, 0.95, f"resonance wavelengths within {sci_tex(q['resonance_wavelength_nm']['value'])} nm\nloaded Q within {sci_tex(q['q_relative']['value'])} (relative)",
            transform=ax.transAxes, ha='left', va='top', fontsize=6.0, color=MUTED)
    panel(ax, 'd', 'Solver difference')
    fig.subplots_adjust(left=0.08, right=0.98, top=0.95, bottom=0.1)
    if fields_path.exists():
        # place the colorbar against the image of panel b once its equal-aspect box is known
        axes_top[1].apply_aspect()
        pos = axes_top[1].get_position()
        cbar = fig.colorbar(im, cax=fig.add_axes([pos.x1 + 0.012, pos.y0, 0.011, pos.height]))
        cbar.set_label('|E$_z$| / on-resonance maximum', fontsize=6.5)
        cbar.ax.tick_params(labelsize=6)
    save(fig, 'microring-meep')


def grid_scaling():
    """Forward and adjoint time and device memory against grid size on one RTX 3060."""
    fwd = read('paper_review/scaling-forward-3060.json')
    streamed_path = 'paper_review/scaling-forward-streamed-3060.json'
    sfwd = read(streamed_path) if (DATA / streamed_path).exists() else {'cases': [], 'steps': fwd['steps']}
    sizes = [128, 192, 256, 320, 384]
    adj = {n: read(f'paper_review/scaling-adjoint-3060-{n}.json') for n in sizes
           if (DATA / f'paper_review/scaling-adjoint-3060-{n}.json').exists()}
    refused = read('paper_review/scaling-adjoint-3060-384-resident-plan.json')
    res = [c for c in fwd['cases'] if 'median' in c]
    stm = [c for c in sfwd['cases'] if 'median' in c]
    fig, axes = plt.subplots(1, 3, figsize=(WIDTH, 2.45))
    limit_n = 8e6 ** (1 / 3)   # edge of a cube at the eight-million-cell resident limit
    style = dict(ms=4, mfc='white', mew=1.1)

    def xaxis(ax, ticks=(64, 128, 256, 512), lo=56, hi=580):
        ax.set_xscale('log', base=2)
        ax.set_xlim(lo, hi)
        ax.set_xticks(list(ticks), [f'{t}$^3$' for t in ticks])
        ax.minorticks_off()
        ax.set_xlabel('Grid')

    ax = axes[0]
    ax.plot([c['n'] for c in res], [c['cell_steps_per_second_loop'] / 1e9 for c in res],
            marker='o', color=BLUE, label='Resident, stepping', **style)
    ax.plot([c['n'] for c in res], [c['cells'] * fwd['steps'] / c['median']['wall_seconds'] / 1e9 for c in res],
            marker='o', color=BLUE, ls=(0, (3, 2)), ms=3, mew=0, label='Resident, full solve')
    if stm:
        ax.plot([c['n'] for c in stm], [c['cell_steps_per_second_full'] / 1e9 for c in stm],
                marker='D', color=PURPLE, ls=(0, (3, 2)), label='Streamed, full solve', **style)
    ax.axvline(limit_n, color=GREY, lw=0.7, ls=(0, (1, 2)))
    ax.text(limit_n * 0.94, 0.04, 'resident limit\n8 million cells', transform=ax.get_xaxis_transform(), ha='right',
            va='bottom', fontsize=5.8, color=GREY)
    xaxis(ax)
    top = max(c['cell_steps_per_second_loop'] / 1e9 for c in res)
    ax.set(ylabel='Rate (10$^9$ cell-steps/s)', ylim=(0, 1.45 * top))
    ax.legend(loc='upper right', fontsize=5.8)
    ygrid(ax)
    panel(ax, 'a', f"Forward, {fwd['steps']} steps")

    ax = axes[1]
    ax.plot([c['n'] for c in res], [c['median']['peak_allocated_bytes'] / 1e9 for c in res], marker='o', color=BLUE,
            label='Forward, resident', **style)
    if stm:
        ax.plot([c['n'] for c in stm], [c['median']['peak_allocated_bytes'] / 1e9 for c in stm], marker='D', color=PURPLE,
                label='Forward, streamed', **style)
    series = {}
    for mode, color, marker, name in (('cuda_resident', ORANGE, 's', 'Adjoint, resident'),
                                      ('cuda_dram', TEAL, '^', 'Adjoint, streamed')):
        rows = sorted((k, d) for k, d in adj.items() if d.get('stage') == 'complete' and d['records'].get(mode))
        series[mode] = [(k, d['median_seconds'][mode],
                         statistics.median(r['peak_torch_cuda_allocated_bytes'] for r in d['records'][mode]) / 1e9) for k, d in rows]
        ax.plot([s[0] for s in series[mode]], [s[2] for s in series[mode]], marker=marker, color=color, label=name, **style)
    device = float(fwd['hardware'].get('gpu_memory_gb', 12.0))
    ax.axhline(device, color=GREY, lw=0.7, ls=(0, (3, 2)))
    ax.text(560, device * 1.15, f'device {device:.0f} GB', fontsize=5.8, color=GREY, va='bottom', ha='right')
    xaxis(ax)
    ax.set(yscale='log', ylabel='Peak device allocation (GB)', ylim=(3e-3, 1e3))
    ax.legend(loc='upper left', fontsize=5.8, handlelength=1.4)
    panel(ax, 'b', 'Device memory')

    ax = axes[2]
    for mode, color, marker, name in (('cuda_resident', ORANGE, 's', 'Resident'), ('cuda_dram', TEAL, '^', 'Host-streamed')):
        ax.plot([s[0] for s in series[mode]], [s[1] for s in series[mode]], marker=marker, color=color, label=name, **style)
    if refused.get('stage') == 'failed':
        n_refused = refused['configuration']['size']
        ax.text(0.97, 0.04, f'{n_refused}$^3$: only the streamed\nadjoint fits the budget', transform=ax.transAxes,
                ha='right', va='bottom', fontsize=5.8, color=MUTED)
    xaxis(ax, ticks=(128, 256, 384), lo=100, hi=480)
    ax.set(yscale='log', ylabel='Time to gradient (s)')
    ax.legend(loc='upper left')
    panel(ax, 'c', 'Adjoint, 128 steps')
    fig.tight_layout(w_pad=1.2)
    save(fig, 'grid-scaling')


def metagrating_design(mesh='fine', duration='long_duration'):
    """A complete small inverse design: densities, objective history, order spectra and fields."""
    rec = read('paper_review/metagrating_showcase.json')
    fields_path = DATA / 'paper_review/metagrating_fields.npz'
    INPUTS['paper_review/metagrating_fields.npz'] = hashlib.sha256(fields_path.read_bytes()).hexdigest()
    f = np.load(fields_path)
    geo, seed = rec['geometry'], str(rec['chosen_seed'])
    fig = plt.figure(figsize=(WIDTH, 4.7))
    grid = fig.add_gridspec(2, 3, height_ratios=[1, 1.25], hspace=0.5, wspace=0.45, width_ratios=[0.9, 1, 1])

    ax = fig.add_subplot(grid[0, 0])
    edges = np.asarray(geo['pixel_edges_um'])
    strips = np.vstack([rec['densities']['final_binary'], rec['densities']['initial']])
    ax.imshow(strips, extent=(edges[0], edges[-1], -0.5, 1.5), origin='lower', cmap='Greys', vmin=0, vmax=1,
              aspect='auto', interpolation='nearest')
    ax.axhline(0.5, color='white', lw=2.0)
    ax.set_yticks([0, 1], ['final\nbinary', f"initial\n$\\beta$ = {rec['densities']['initial_beta']:g}"])
    ax.tick_params(axis='y', length=0)
    ax.set_xlabel('Position in the period (µm)')
    panel(ax, 'a', 'Design density')

    ax = fig.add_subplot(grid[0, 1])
    for s, hist in sorted(rec['histories'].items()):
        it = [h['iteration'] for h in hist]
        chosen = s == seed
        ax.plot(it, [h['efficiency'] for h in hist], color=BLUE if chosen else GREY, lw=1.3 if chosen else 0.8,
                alpha=1 if chosen else 0.6, label=f'seed {s}, 1.00 µm' if chosen else None, zorder=3 if chosen else 2)
        if chosen:
            ax.plot(it, [h['holdout_efficiency'] for h in hist], color=BLUE, lw=0.9, ls=(0, (3, 2)), label=f'seed {s}, 0.95 µm')
            starts = [hist[0]['iteration'] - 0.5] + [h['iteration'] + 0.5 for h in hist if h['beta_next'] != h['beta']]
            ends = starts[1:] + [hist[-1]['iteration'] + 0.5]
            betas = [hist[0]['beta']] + [h['beta_next'] for h in hist if h['beta_next'] != h['beta']]
            for a, b, beta in zip(starts, ends, betas):
                if a > starts[0]:
                    ax.axvline(a, color=LINE, lw=0.6, zorder=0)
                label = f'$\\beta$ = {beta:g}' if a == starts[0] else f'{beta:g}'
                ax.text(0.5 * (a + b), 0.705, label, ha='center', va='bottom', fontsize=5.8, color=MUTED)
    ax.plot([], [], color=GREY, lw=0.8, alpha=0.6, label='other seeds')
    ax.set(xlabel='Iteration', ylabel='+1 order efficiency', xlim=(0.5, 24.5), ylim=(0, 0.76))
    ax.legend(loc='lower right', fontsize=6.0)
    panel(ax, 'b', 'Objective history')

    ax = fig.add_subplot(grid[0, 2])
    spec = rec['spectra'][mesh][duration]
    wl = np.asarray(rec['spectra']['wavelength_um'])
    for key, color, name in (('T_plus1', BLUE, '+1'), ('T_zero', GREY, '0'), ('T_minus1', ORANGE, '$-$1')):
        ax.plot(wl, spec['final_binary'][key], color=color, lw=1.2, label=name)
        ax.plot(wl, spec['initial'][key], color=color, lw=0.8, ls=(0, (2, 2)))
    ax.axvline(1.0, color=LINE, lw=0.6, zorder=0)
    ax.set(xlabel='Wavelength (µm)', ylabel='Transmitted efficiency', ylim=(0, 1), xlim=(wl.min(), wl.max()))
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, 0.8), ncol=3, columnspacing=0.8, handlelength=1.2, fontsize=6.0,
              title='solid final, dashed initial', title_fontsize=5.8)
    panel(ax, 'c', 'Order spectra')

    x, z = f['x_um'], f['z_um']
    vmax = float(max(np.abs(f['Ex_real_initial']).max(), np.abs(f['Ex_real_final_binary']).max()))
    bottom = grid[1, :].subgridspec(1, 2, wspace=0.12)
    maps = []
    for col, key, letter, title in ((0, 'initial', 'd', 'Initial design'), (1, 'final_binary', 'e', 'Final binary design')):
        ax = fig.add_subplot(bottom[0, col])
        im = ax.imshow(f[f'Ex_real_{key}'], origin='lower', extent=(x[0], x[-1], z[0], z[-1]), cmap='RdBu_r',
                       vmin=-vmax, vmax=vmax, aspect='equal')
        for zz in geo['layer_z_um']:
            ax.axhline(zz, color=INK, lw=0.5, ls=(0, (2, 2)))
        if key == 'final_binary':
            ax.contour(x, z, f['eps_geometric_final_binary'], levels=[0.5 * (geo['background_epsilon'] + geo['design_epsilon'])],
                       colors=INK, linewidths=0.6)
        ax.set(xlabel='x (µm)', ylabel='z (µm)' if col == 0 else '')
        if col:
            ax.tick_params(labelleft=False)
        panel(ax, letter, f'{title}, Re $E_x$ at 1.00 µm')
        maps.append(ax)
    fig.subplots_adjust(left=0.09, right=0.93, top=0.95, bottom=0.08)
    maps[1].apply_aspect()
    pos = maps[1].get_position()
    cbar = fig.colorbar(im, cax=fig.add_axes([pos.x1 + 0.012, pos.y0, 0.011, pos.height]))
    cbar.set_label('Re $E_x$ / incident amplitude', fontsize=6.5)
    cbar.ax.tick_params(labelsize=6)
    save(fig, 'metagrating-design')


def build_story_figures():
    apply_style()
    architecture(); memory_cost(); exterior_propagation(); tiling_overlap(); application()
    dispersive_slabs(); metalens_meep(); microring_meep()
    grid_scaling(); metagrating_design()
    record = {'description': 'Vector schematics and plots from completed records. No new simulation or interpolated field image.',
              'inputs': INPUTS, 'generator_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    (OUT.parent / 'story-figure-provenance.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(record, indent=2))


if __name__ == '__main__':
    build_story_figures()
