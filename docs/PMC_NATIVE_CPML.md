# Native endpoint PMC with restricted CPML

Projects containing PMC or magnetic-symmetry faces can combine those walls
with PEC and restricted endpoint CPML. Native Python `Simulation(project)`,
the CLI `torchfdtd run project.json`, and browser jobs share this dispatch.
Closed PEC/PMC projects keep their existing endpoint path. Pure PEC/PML
projects continue to use the ordinary solver.

This connects the existing `EndpointCPMLSimulation` physics to native results.
It does not establish equivalence to the ordinary scalar-Yee PML sampling,
nor add general combinations of sources, ports or materials.

The restrictions below apply to this forward dispatch only and are checked
when `Simulation.run()` or `estimate()` is called, not by Project validation.
`DifferentiableSimulation`, `StreamedSimulation` and `run_tensor_batch` run
PMC/symmetric faces with the ordinary scalar-Yee CPML, including independent
per-face `layers`, `sigma_scale`, `kappa`, `alpha` and `polynomial`.

## Admitted project

- Three-dimensional, real FP32, resident, fixed-duration execution with
  automatic shutoff disabled. Meshes must have equal uniform spacing along
  all axes, including when represented by explicit coordinates.
- Staircase geometry with Yee material sampling. Native material rasterization
  is isotropic and nondispersive. ADE materials are rejected.
- Face kinds are PEC, PMC, their symmetry aliases, or PML. Periodic and Bloch
  faces are rejected when endpoint dispatch is selected.
- Every active PML face must have the same resolved depth and `sigma_scale`.
  Resolution honors each face's `layers`, falling back to `region.pml_cells`.
  Unequal resolved depths or strengths are rejected, not replaced by defaults.
- PML requires `kappa=1`, `alpha=0`, `polynomial=3`, and
  `alpha_polynomial=0`. In particular the ordinary default `alpha=1e-8` must
  be explicitly changed to zero. Unrepresentable translated decay strengths
  are rejected. Native schema depth and dimension constraints also apply.
- Only enabled point soft electric sources and enabled point E/H monitors
  sampled every timestep are accepted. At least one monitor is required.
  Nearest Yee sample coordinates, including stored upper PMC endpoints, are
  reported. Samples inside CPML or constrained by PEC are rejected. Source
  electric degrees of freedom must be unique.
- Every electric material sample in PML and its one-cell collar must exactly
  equal `region.background_index**2`. This exterior is fixed and its material
  VJP is zero. Structures intersecting this collar with other material fail
  before time stepping. Epsilon must be finite and at least one, and must
  satisfy the conservative Yee CFL constraint.
- The CPU reference is limited to 32768 cells. Native dispatch preflights
  tensor and host reservations against available memory before construction.
  The effective plan includes CPML auxiliary state and its workspace. CPU
  Python topology and allocator/runtime overhead remain outside the direct
  adapter tensor budget, as reported by its memory plan.

```python
from torchfdtd import Project, Region, Source, Monitor
from torchfdtd.solver import Simulation

faces = {a + '_' + side: {'kind': 'pmc'}
         for a in 'xyz' for side in ('min', 'max')}
for side in ('min', 'max'):
    faces['x_' + side] = {'kind': 'pml', 'layers': 3, 'alpha': 0,
                         'sigma_scale': .3}
project = Project(
    region=Region(dimension='3d', size=(1.6, .6, .6), mesh=.1,
                  steps=20, material_sampling='yee', backend='cpu',
                  boundaries=faces),
    sources=[Source(component='Ez', center=(0, 0, 0), pulse='continuous')],
    monitors=[Monitor(component='Ez', center=(.1, 0, 0))],
)
result = Simulation(project).run()
print(result.summary['endpoint_plan']['cpml'])
result.save('endpoint-cpml.npz')
```

The separate `endpoint_from_project(project)` adapter also uses this
translation. Its optional sampled epsilon and waveform tensors retain the
existing first-order endpoint adjoint contract. Native geometry rasterization
itself does not differentiate shape parameters.

## Exact effective profile

Let `h` be the equal cell spacing in micrometres, `L` the resolved layer count,
`s` the native sigma scale, and `epsilon_bg` the fixed background permittivity.
The adapter supplies the existing endpoint solver with

```text
reflection = exp(-20 * s * L * sqrt(epsilon_bg) / (L + 1))
rho = max(1 - distance_from_outer_face / (L * h), 0)
rate = 40 * s / ((L + 1) * h) * rho**3
b = exp(-rate * c0_in_um_per_second * dt_seconds)
c = b - 1
```

Each E or H curl derivative samples `rho` at its own endpoint target
coordinate. Kappa is one and alpha is zero. PML outer faces terminate at PEC.
The `reflection` argument parametrizes the cubic profile and is not a measured
reflection guarantee. The endpoint rho convention differs from ordinary
scalar-Yee PML, so equal GUI coefficients do not imply identical samples.
The complete mapping and `scalar_yee_profile_equivalence=false` are included
in `summary.endpoint_plan.cpml`. Both field and CPML auxiliary finiteness are
checked during the native run. Final E/H arrays and separately stored upper
endpoint arrays follow the established native endpoint result format.

## Browser workflow and focused checks

Open **Edit six faces together**, select the desired PML faces, then explicitly
press **Set supported endpoint CPML profile**. The button stages default region
layers, sigma scale one, kappa one, alpha zero and cubic grading for the selected
PML faces. It does not change geometry, sources, materials or mesh. The visible
description explains those changes before **Apply boundaries** validates the
entire draft. Unsupported combinations leave the saved project unchanged.
Custom common sigma scale and layer counts can be edited in region properties.

Ten focused CPU cases cover native/direct-adapter trace and final-field
agreement, effective profile and memory reporting, translated-parameter
rejections, source placement, fixed collar rejection, nonfinite auxiliary
states, CLI/NPZ and early budget admission. One existing closed-PMC native
trace/NPZ case also passed. The actual browser CPU test exercises explicit
profile selection, atomic rejection, submission and result metadata. It passed
in 3.9 seconds using an isolated API server and Vite, without building tracked
frontend assets. This integration adds no GPU performance or reflection
acceptance claim.

## Native CUDA integration evidence

One focused integration case passed on an RTX 3060 with Torch 2.10.0+cu126,
CUDA 12.6 and driver 591.86. Native CPU/CUDA point traces, final E/H, stored
upper endpoint arrays and NPZ field round-trip agreed. The adapter material
and waveform VJPs also agreed, with exactly zero fixed-collar material
cotangents and a nonzero interior derivative. Maximum errors were 2.7940e-9
for the trace, 8.7312e-11 for material VJP and 2.3284e-9 for waveform VJP.
Peak Torch allocation delta was 214,016 bytes against an admitted 491,620-byte
plan. This is a small correctness test, not a speed or device-capacity claim.

The base checkout was `f355601860c563cbae5a4a57bb6aa1b5dadd6b6c` plus the
working-tree sources below. Pre/post hashes matched. The initial test-only
NPZ metadata assertion compared JSON lists against tuples; it was corrected
by JSON-normalizing the expected metadata. No runtime change was needed,
and the original failure record remains preserved privately.

| Measured source | SHA256 |
| --- | --- |
| `torchfdtd/endpoint_native.py` | `5a9a91dcf442c4a88d79f70d00ddbbfedabdba8240f3016bc1fdde1c8d7d1b55` |
| `torchfdtd/endpoint_project.py` | `9bcb0667ba8469ddca19094fdadb482b696a9745b66c2d45d8b4cc357742784b` |
| `torchfdtd/pmc_cpml.py` | `fc38199b7551203460cec9a5bb881c3650bc8f58994c0ead5e1905a2e37a33d2` |
| `torchfdtd/pmc_cpml_cuda.py` | `c639f98dd3f029316a48b38a0e331a5f660d25c415f0ee26926da0a5032747c6` |
| `tests/test_endpoint_native_cpml_cuda.py` | `9c7d9813f7ea054013a559a8bc8658eabe535832aa442d4e22b93f05420db40f` |

The separate [normal-incidence CPU absorption gate](PMC_CPML_ABSORPTION.md)
checks the direct endpoint API with native-translated coefficients against
a long-domain reference and independent 1D Yee recurrence. Its two-cell
transverse setup does not extend the native Project admission contract.
