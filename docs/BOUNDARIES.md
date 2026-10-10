# Native boundaries and complex fields

TorchFDTD supports independently configured PML, PEC and anti-symmetric faces, and paired Periodic/Bloch faces in its CPU and CUDA engines. The browser exposes these under FDTD → Boundary conditions. Python uses the same project model.

```python
from torchfdtd import Project, Region, BoundaryFace, Boundaries

project = Project(region=Region(
    boundaries=Boundaries(
        x_min=BoundaryFace(layers=16, kappa=3, alpha=0.02, alpha_polynomial=1),
        x_max=BoundaryFace(layers=20),
        y_min=BoundaryFace(kind="bloch"),
        y_max=BoundaryFace(kind="bloch"),
    ),
    bloch_phase=(0, 0.4, 0),
    complex_display="imag",
))
```

## Periodic and Bloch conventions

- Both ends of a cyclic axis must use the same kind. Browser and familiar `FDTD.set("y min bc", "Bloch")` commands pair the faces automatically. The native model rejects mismatched pairs.
- There are N independent cells on a periodic axis. The period is **N × mesh**, using the mesh-rounded domain size returned by validation. There are no duplicated end planes in saved native arrays.
- `bloch_phase` is in radians, with **F(r + L) = exp(+i φ) F(r)**. A wavevector in rad/m is converted using φ = k × L in metres. A zero Bloch phase matches Periodic, but retains complex storage.
- Periodic/Bloch conditions repeat structures and sources. A dipole becomes a phased array of dipoles. Each E/H sheet component receives the fundamental spatial phase exp(i k·r) along Bloch axes at its own Yee position. A single soft sheet radiates in both directions.
- The phase is fixed across the source spectrum, so this is not broadband fixed-angle/BFAST injection. Diffraction orders can differ by integer multiples of 2π/L.
- The invariant z dimension has no boundary in 2D. Its configuration remains at defaults.

The sign convention follows the documented [Lumerical Bloch phase relationship](https://optics.ansys.com/hc/en-us/articles/360034382714-Bloch-boundary-conditions-in-FDTD-and-MODE). The FSP wavevector mapping (bandstructure or SI units, source-angle fallback) is described in [FSP_NATIVE.md](FSP_NATIVE.md); equivalence against vendor Bloch fields is not measured.

## PEC and anti-symmetric walls

Use `BoundaryFace(kind="pec")` or `BoundaryFace(kind="antisymmetric")`. The browser offers PEC and Anti-symmetric (PEC). The familiar facade accepts `FDTD.set("x min bc", "PEC")` and `FDTD.set("x max bc", "Anti-Symmetric")`. These faces are independent. Entering a cyclic boundary pairs both faces, and replacing one member of a cyclic pair replaces the other to keep the model valid.

Both labels implement the same electromagnetic parity: tangential E and normal H are odd across the wall, while normal E and tangential H are even. Anti-symmetric reduction is valid only when the full material distribution and excitation obey this parity. It does not automatically mirror or validate the omitted geometry. This terminology follows the [Ansys symmetry convention](https://optics.ansys.com/hc/en-us/articles/360034382694-Symmetric-and-anti-symmetric-BCs-in-FDTD-and-MODE).

Walls lie exactly at `region.mesh_nodes[axis][0]` and `[-1]`. For uniform meshes these are the mesh-rounded region endpoints. Tangential E at the lower wall is a stored zero node. The upper tangential E is a zero ghost node, so the last forward derivative is `-E_last / dx_last`. The wall is never moved to a half-cell location. Production zero initialization and validated source injection preserve lower-wall tangential E and normal H constraints. Low-level callers supplying their own initial fields must satisfy those constraints.

Supported scope: staircase materials, real and complex fields, CPU/Torch and fused CUDA updates and explicit adjoints, streamed slabs, and real CUDA batches. Subpixel interfaces with these walls are rejected. Every component of a vector source is checked at its actual Yee support. Sources that write constrained wall components are rejected. Existing one-way and TFSF source restrictions exclude these walls.

Tests cover discrete cavity eigenfrequencies, both transverse polarizations on all three axes, doubled periodic versus reduced domains, corners, nonuniform edge metrics, transpose identities, resident/streamed gradients and CUDA batch consistency. See [numerical tests](../tests/test_pec_boundaries.py) and [delivery-surface tests](../tests/test_pec_surface.py). These are native verification results, not vendor-equivalence measurements.

**PMC and symmetric boundaries support a closed-cavity workflow.** Exact upper-endpoint PMC stores additional tangential E and normal H face states, plus intersecting E-edge states. All six faces must be PEC, PMC or their symmetry equivalents. The ordinary `Simulation` forward keeps that bounded real FP32 3D contract with fixed Yee meshes, nondispersive materials, point electric sources and point E/H monitors, or its restricted equal-profile CPML. `DifferentiableSimulation`, `DispersiveSimulation`, `StreamedSimulation`, `StreamedDispersiveSimulation` and `run_tensor_batch` admit PMC/symmetric faces next to PEC and independently configured per-face CPML, with nondispersive or coupled ADE media carrying polarization banks on the stored upper faces and edges, and with point sources and monitors there; subpixel interfaces, periodic/Bloch mixing and the fused CUDA backward/ADE kernels remain rejected. The PMC implementation contract lists the supported combinations and their evidence. PEC boundaries do not implement a PEC material model.

In the browser, open **PMC cavity** under Example projects, or use **Edit six faces together** in the boundary panel. The dialog validates the complete proposed configuration before replacing the scene. JSON/Python export preserves it. Field plots show the base volume. NPZ also stores the upper face/edge values omitted from that view. These boundaries do not automatically mirror the user's geometry or excitation.

## Native CPML parameters

Each PML face has `layers`, `sigma_scale`, `kappa`, `alpha`, `polynomial` and `alpha_polynomial`. `layers=None` inherits the region's common `pml_cells`. These are **native CPML coefficients**, not a claim of equivalence to Lumerical Standard/Stabilized/Steep-angle profiles or their normalized coefficient values.

For depth fraction ρ at the appropriate staggered E/H derivative location and layer count L:

```
sigma = sigma_scale * 40/(L+1) * rho**polynomial
kappa(rho) = 1 + (kappa_max - 1) * rho**polynomial
alpha(rho) = alpha_max * (1-rho)**alpha_polynomial
b = exp(-(sigma/kappa + alpha) * courant)
c = sigma * (b-1) / (sigma*kappa + alpha*kappa**2)
psi_next = b * psi + c * raw_derivative
stretched_derivative = raw_derivative/kappa + psi_next
```

At zero sigma and alpha, c is defined as zero. The grading uses ρ = depth/(L+1), with E/H half-cell offsets. `polynomial=3`, `kappa=1`, `alpha=1e-8`, `alpha_polynomial=0` and `sigma_scale=1` provide the default cubic profile. Custom coefficients need their own reflection and convergence checks. Lumerical uses a separately documented [PML normalization and profile scheme](https://optics.ansys.com/hc/en-us/articles/360034382674-PML-boundary-conditions-in-FDTD-and-MODE), so FSP values are not copied blindly into these fields.

Unlike the original upstream implementation, the new derivative kernels cover PML interface derivatives directly and implement kappa in both the stretched derivative and convolution coefficients. Corners apply the stretch for each participating axis.

## Results

Bloch runs preserve complex E, H and monitor arrays in NPZ. JSON monitor output includes `signal` (real), `signal_imag` and `complex`. CSV includes a separate imaginary column. Time plots show the real component and label it accordingly. Snapshots can display real, imaginary, magnitude or phase, with phase measured in radians. Their selected display representation does not change stored full fields.

Real traces use a one-sided Hann FFT scaled by 2/N. Complex traces use the positive bins of a full Hann FFT scaled by 1/N. Neither spectrum is normalized transmitted power. E and H remain spatially and temporally staggered.

## Verification and remaining scope

Still required for full parity: independent FSP mapping, named Lumerical PML-profile equivalence, PMC/symmetric coverage in the ordinary forward solver and plane adjoints, PEC/subpixel coupling, automatic angle-to-Bloch source settings, BFAST, dispersive-medium and grazing-angle coverage, and the other families in the parity roadmap.

## Dispersive materials inside PML

`Region.pml_dispersion` selects what happens where a Drude, Lorentz or multipole (ADE) material reaches a PML layer:

- `'ade'` (default): every PML face is the stretched-coordinate CPML above, and the pole update runs inside the layer. This diverges for some geometries (below).
- `'absorber'`: every PML face that an enabled dispersive structure reaches (below) becomes an adiabatic absorber of the same depth, a graded and matched electric and magnetic conductivity, and the pole update runs everywhere. The other PML faces keep the CPML. The absorber is stable for every medium measured. Its reflection depends on what crosses the layer (below).
- `'frozen'`: the CPML is kept, and cells inside a PML layer lose their pole and take the real permittivity of the material at the source centre frequency (the static permittivity without a pulsed source). This is wrong away from that frequency and is refused for a medium whose real permittivity there is not positive.

A face counts as reached when the bounding box of an enabled dispersive structure covers a material sample in the layer's rows, within 1e-6 of a cell. These are the rows `'frozen'` freezes. With Yee sampling E lies on the nodes and half nodes of the axis, so the node on the inner edge of an upper layer is in its rows and the one on the inner edge of a lower layer is not: a structure touching an upper layer reaches it, and one touching a lower layer reaches it only once it covers the half node inside. With cell sampling the cell centres decide. The validation warning, the absorber faces (`torchfdtd.boundaries.absorber_faces`) and the refusals below all use this test, so a mode is refused, or a face switched, only where the run would change. A pole sample therefore never lies in a stretched row, corners included.

Where the absorber faces are recorded:

- the run summaries of `Simulation` and `run_tensor_batch` list them as `absorber_faces`;
- the resolved plan describes them in `boundaries.absorber`, with the per-axis losses and each dispersive material's reference permittivity, and `verify_grid` checks all three against the prepared grid;
- the run signature that matches frequency-plane references, and the tile signature of stitched planes, include them. A device run with absorber faces therefore does not normalise against an air reference whose faces are CPML.

The resident CPU and CUDA solvers (torch and fused kernels) and `run_tensor_batch` implement all three modes. A tensor-batch cohort only groups projects with the same absorber faces. Refusals, each a `ValueError` naming the path:

- the differentiable, plane-adjoint, streamed and reversible solvers refuse a mode other than `'ade'` only when it would change the run: `'absorber'` with absorber faces, `'frozen'` with a dispersive structure reaching a PML layer;
- the paths whose oscillators are parameter tensors rather than structures (`DispersiveSimulation`, `DispersivePlaneSimulation`, `StreamedDispersiveSimulation`) refuse every mode other than `'ade'`, since the structures do not say where their poles are;
- absorber faces are refused next to PMC/symmetric faces, with subpixel interfaces, and with stretching (`kappa` other than 1, or `alpha` above its default; `alpha=0` is accepted);
- a soft sheet with `extend_through_pml` that crosses an absorber face is refused at planning, in the tiled mode's admission and by `run_tiled` before any tile runs.

The sheet refusal comes from a measurement. A CPML leaves alone a wave that has no wavevector along the face normal inside a lateral layer, but the absorber's loss acts in every direction. It damps the sheet's wave inside the lateral layers, and the laterally varying front diffracts back into the interior. In a 2D test, all faces were absorbers (a dilute fill, 40 layers, 25 nm cells) and a y-normal sheet at 1.3–1.8 µm was compared with the same sheet under the CPML. The largest relative power difference over the band, at three interior monitors, was:

| Sheet | Power error |
| --- | --- |
| Extended through the x absorbers | 0.27, 0.038 and 0.37 |
| Ending at the interior | 9.4e-3, 6.6e-3 and 4.7e-2 (the oblique reflection of its edge waves) |

Dividing the soft-source term by (1 + s) in absorber cells changes the extended-sheet error only in the third digit. Every other source is confined to the interior, where the absorber has no loss, so no source term needs that factor.

Validation (`/api/validate`, `torchfdtd run`) warns about every enabled dispersive structure that reaches a PML layer while the mode is `'ade'`, and it separates three cases:

- **Recommends `'absorber'`:** structures whose material's Re ε turns negative somewhere in the band of the grid and that have an end inside a layer, so that along the face normal they miss its innermost or its outermost row. A post in the outer cells of a corner and a post or film entering the corner from the interior both grow below.
- **Claims no stability:** the same materials in structures that cross the layer. A Drude bar through a layer grows below, slowly enough to stay under the run-control growth limit for thousands of steps, while the G3-07 half space reflects 4e-9 to 7e-6 per monitor with the CPML and 0.016 to 1.2 with the absorber. The warning names both and leaves the choice to the user.
- **States the cost:** materials whose Re ε stays positive on the whole band, where the negative-permittivity growth has no band. The warning advises keeping `'ade'` with the run-control divergence check.

### Why the CPML diverges

The numbers come from `docs/validation/dispersive_pml_absorber.json`: case [`DISPERSIVE_PML_ABSORBER`](validation/cases/DISPERSIVE_PML_ABSORBER.json), driver `benchmarks/dispersive_pml_absorber.py`, tables in [DISPERSIVE_PML_ABSORBER.md](DISPERSIVE_PML_ABSORBER.md). The smallest fixture found is a single 3D post. It fills the outer five cells of the x_max/y_max corner of a 12-layer CPML: a 1.2 x 1.2 x 1.0 um box with 20 nm cells, 180,000 cells in all. The post is either the single-pole Lorentz SiN of the original report or the G3-03 Drude metal. With `'ade'`:

- **SiN post.** The state norm grows by e^0.0573 per step, 7.5e14 1/s in amplitude, identically in float64 on the CPU and in float32 on CUDA. Round-off is therefore not the cause. The growing field oscillates at 2.26e16 rad/s, where the bilinear SiN permittivity is -0.53. That frequency lies in the pole's negative band (1.4e16 to 2.8e16 rad/s), which is well inside the band of the grid.
- **Drude post.** It grows at 3.8e14 1/s, at 1.73e15 rad/s, where the permittivity is -0.33.
- **6 um pillar array.** The original report's array (0.2 um SiN pillars on a 0.3 um lattice through the lateral layers) grows at the same rate and frequency as the single post. Its divergence is this corner mode. Whether a domain diverges therefore depends on where the lattice cuts the pillars at the outer wall: the depth rows below show that a piece three or five cells deep grows and one ten cells deep does not.

One-parameter variations of the SiN post, 4000 steps in float64:

| Variation | Result |
| --- | --- |
| Post 0.35 um inside the interior | decays |
| Nondispersive n = 2 post | decays |
| Post 10 cells deep | decays |
| Post 3 cells deep | grows at 1.2e15 1/s |
| `sigma_scale` 0.25 | grows at 2.0e14 1/s, a quarter of the rate |
| CFS `alpha` 0.2 | grows at 7.1e14 1/s |
| `kappa` 4 | grows at 4.3e14 1/s |
| Linewidth 1e14 rad/s | grows at 6.9e14 1/s |
| Linewidth 1e15 rad/s | grows at 1.0e14 1/s |
| 10 nm cells, same physical post and layer (8000 steps) | grows at 1.0e15 1/s, at 1.66e16 rad/s (permittivity -6.1) |

Where the structure ends, in a 0.9 x 0.9 x 1.0 um box in float64, with the CPML and with the absorber:

| Structure | CPML | Absorber, final state norm / peak |
| --- | --- | --- |
| SiN post entering the corner from 0.15 um inside the interior and ending 2 cells short of the outer edge (4000 steps) | grows by e^0.100 per step, at 2.40e16 rad/s (permittivity -0.25) | 2.9e-17 |
| SiN film over the same span in x, through the y layers (4000 steps) | grows by e^0.076 per step, at 2.47e16 rad/s (permittivity -0.13) | 2.7e-17 |
| Drude bar, 0.2 x 0.2 um, crossing the x_max layer (12,000 steps) | grows by e^0.0011 per step, at 1.18e15 rad/s (permittivity -1.85); 1.6e-8 of the peak at the end | 6.8e-24 |

The growth needs a negative permittivity inside the stretched layer. A structure ending inside the layer grows fast; one crossing it can still grow, slowly. It scales with the CPML conductivity, survives mesh refinement and does not depend on the precision. The coupling is already the Roden-Gedney one: the CPML stretches the curl and leaves the constitutive (ADE) update unstretched. This is therefore an instability of the stretched-coordinate PML itself around negative-permittivity (plasmon-like) inclusions, not a coupling defect or a float32 effect. No local change of the coupling removes it. A stretching matched to the dispersion (Becache, Joly and Vinoles) exists for one homogeneous medium, not for posts in vacuum. CFS profiles only slow the growth. The fix removes the stretch from the faces such media cross.

### The absorber

For an absorber face with L layers, `sigma_scale` and `polynomial`, the conductivity at a Yee sample of physical depth ρ (depth into the layer over the layer thickness) is

```
sigma = sigma_scale * 40/(L+1) * rho**polynomial      (units of c/reference_step, the CPML's scale)
s     = sigma * courant / 2                            (corners add the losses of their faces)
E <- (1-s)/(1+s) E + courant/(1+s) * inverse_permittivity * curl H
H <- (1-s)/(1+s) H - courant/(1+s) * inverse_permeability * curl E
```

E and H lose the same fraction per step, so a normal-incidence wave in a nondispersive medium sees an impedance-matched layer.

A pole cell cannot be matched at every frequency by a passive loss. Damping D instead of E, as Meep does, would scale ε(ω) at every frequency, but it injects energy where E·P < 0, and that is the negative band that diverges. The E conductivity of a pole cell is therefore σ·ε_ref. Here ε_ref is the real bilinear permittivity at the source centre frequency: the static value without a pulsed source, and ε∞ where it is not positive. The trapezoidal step solves the pole with it:

```
(eps_inf + s*eps_ref) E_new + (P_new - P_old) = (eps_inf - s*eps_ref) E_old + courant * curl H
```

Every added term is a non-negative loss, so the absorber is a passive medium. That is the argument for its stability, and the record below tests it.

A second check is the spectral radius of the source-free one-step operator (E, H, CPML memories and pole states) on an 11 x 11 x 5-cell box with a post in the corner where x_max and y_max meet. With the CPML it exceeds 1 by about 1e-3 for the SiN and the Drude post. With the absorber it stays within 1e-13 of 1. `tests/test_dispersive_pml_absorber.py` asserts more than 5e-4 and at most 1e-12: on that box in the long tier (about 80 s per case), and in the default suite on an 11 x 5 x 5-cell row, periodic in y and z, with a Drude post ending in the x_max layer (1 + 1.4e-3 with the CPML).

The stretched-coordinate `kappa` and `alpha` have no meaning in the absorber: `kappa` must stay 1 and `alpha` at most its default.

The trapezoidal step is stable for any s, but s above 1 makes the decay factor (1-s)/(1+s) negative. The outermost cells then ring at the Nyquist frequency while they decay: `sigma_scale` 20 over 3 layers gives s = 47.6 and a factor of -0.96 per step. The largest loss is s_max = `sigma_scale`·20/(L+1)·courant. The default profile gives 1.08 at 12 layers in 2D and 0.34 at 40, so keep `sigma_scale` at or below about (L+1)/(20·courant).

Memory: the torch and NumPy updates keep the decay and gain factors of E and H only on the absorber slabs, four arrays of three components per slab cell, and the fused kernel keeps one profile per axis. The pole samples with absorber loss form an ADE state of their own that carries the three coefficients above, so those exist only inside the slabs. The other pole samples take the plain ADE update, the same algebra with zero loss in a different rounding: the fields equal those of one state per material bit for bit on the CPU in float64, and on CUDA to 1e-15 (float64) and 3e-6 (float32) of the signal peak after 200 steps. The resident estimate counts both as `absorber_estimated_bytes`, at most 9 (fused) or 21 (torch, NumPy) reals per slab cell. The CUDA host estimate counts the transient of building the coefficients, 180 bytes per slab cell with Yee sampling and 130 with cell sampling (163 and 118 measured on a full SiN fill).

Unlike a PML, a passive absorber reflects wherever the transverse structure of the wave changes with the loss: at oblique incidence, where a transverse interface crosses the layer, and in a medium whose permittivity changes across the band. A deeper layer reduces that reflection (compare 80 with 40 layers below).

### Measured reflection and stability

Reflection runs use the G3-07 layout: a 2D strip with 25 nm cells, 150 fs, the band 1.3 to 1.8 um, and 40 absorber layers (1 um) unless stated. R is the maximum over the band of the reflected-to-incident power ratio at each monitor.

Judged against the case limits, every row passes:

- **Normal-incidence reflection** through a homogeneous fill of the x absorbers: 6.3e-14 for vacuum carrying a 1e-6 pole, and 1.6e-8 for SiN in TE and in TM. The limit is 1e-6, the program's normal-incidence PML threshold; the CPML gives 5e-14 on the same fills.
- **20,000-step stability of the absorber** on the diverging fixtures, relative to the peak state norm:

| Fixture | Execution | Final state norm / peak |
| --- | --- | --- |
| SiN and Drude posts | float64 CPU | 2.4e-19 (late growth 1.8e-6) |
| SiN and Drude posts | float32 CUDA, fused kernel | 8.2e-14 and 8.6e-14 |
| SiN post | float32 CUDA, torch kernel | 1.1e-13 |
| SiN post | `run_tensor_batch` | 8.2e-14, identical to the fused run |
| 6 um pillar array | float32 CUDA | 1.5e-8 |

  The limits are G3-07's 1e-6 for the final value and 1.000001 for late growth (float64 only), and the stability sweep's growth ratio of 1.5 on the state norm and the interior energy.
- **The CPML controls** of the same fixtures diverge in float64 and float32.

What "every judged row passes" does and does not show:

- **Stability rows.** In float64 the SiN and the Drude post rows agree to six or seven digits at every sample. The post sits deep in a strongly lossy region and contributes almost nothing to the state norm, so the two materials are not independent evidence there. With the tail far below the 1e-12 floor, energy growth slower than about 1e-3 to 5e-3 per step would pass those limits; the measured CPML growth is 0.008 to 0.095 per step. The spectral-radius test above closes that gap.
- **Reflection rows.** The split between judged and recorded rows was fixed after the shakedown, and every configuration that missed the program's limits there is recorded, not judged. The judged rows only show that the absorber meets the normal-incidence limit for weakly dispersive fills.

Recorded, not judged:

- **Drude-dielectric fill.** The stability sweep's medium, whose Re ε runs from 3.1 to 3.5 across the band, reflects 5.0e-5. Its E loss is matched only at the source centre.
- **G3-07 half space** crossing the x absorbers, per monitor (vacuum side / medium side):

| Medium | Polarization | 40 layers | 80 layers | CPML, 40 layers |
| --- | --- | --- | --- | --- |
| Drude metal | TE | 0.027 / 0.030 | 9.2e-3 / 9.5e-3 | 3.5e-9 / 3.7e-9 |
| Drude metal | TM | 0.090 / 0.11 | 0.031 / 0.035 | 1.3e-7 / 4.4e-7 |
| SiN | TE | 0.87 / 0.19 | 0.61 / 0.15 | 6.8e-6 / 1.4e-6 |
| SiN | TM | 1.2 / 0.016 | 0.45 / 5.3e-3 | 3.0e-7 / 4.2e-9 |

  G3-07's interface budget for the CPML is 1e-4. The absorber is far from it at 40 and 80 layers, since a passive absorber is not reflectionless across a transverse interface. The case declares no looser budget.
- **Oblique vacuum**, through the dilute fill: 7.5e-3 at 30 deg and 0.17 at 60 deg, against 1.1e-14 and 8.6e-9 for the CPML.

`'absorber'` is therefore a stability fix, not a better absorber. Prefer ending dispersive structures before the PML. When they must cross it, as SiN pillars cross the lateral faces of a metalens tile, `'absorber'` keeps the run finite. Only the crossed faces change, so the other faces keep the CPML. Give the crossed faces more depth, and expect reflections of order 1e-2 from waves that reach them obliquely or along a transverse interface. A source sheet must then end at the interior of those faces rather than extend through them.
