# Oracle independence and error budgets of the G3 fixtures

Bookkeeping for stage G3 of the physics validation. For every fixture that a G3 case file under
`docs/validation/cases/` names, this document records what the oracle is, how
independent it is of the code under test, the precision floor of the
comparison, and the time-window and PML budgets as they were recorded. It
does not restate the acceptance limits; those live in the case files, and
`tests/test_oracle_budget.py` checks that every G3 case names its oracle
classes and that this document covers every case. A case whose file is
hash-bound to recorded evidence keeps its classes in a sidecar
`<case_id>.oracles.json` next to it; the test reads the case first and the
sidecar otherwise.

## Oracle classes and validation layers

Section 1 rule 8 of the program separates an analytic oracle, an independent
implementation, another backend of the same discrete equations, and a rerun of
the same code. The case files use these class names:

| Class | Meaning | Layer |
| --- | --- | --- |
| `analytic_continuum` | Closed-form solution of the continuous problem (Fresnel, Airy, Mie, slab or fiber dispersion, Hertzian dipole, transfer matrix) | B |
| `analytic_discrete` | Closed-form solution of the Yee discretisation itself (discrete dispersion, discrete eigenfrequency, discrete interface algebra). It verifies that the implemented operator is the intended one; it closes to the continuum only when the case also compares against `analytic_continuum` or states the analytic numerical dispersion | B |
| `independent_solver` | A separately written solver of the same continuum physics by another method (TORCWA rigorous coupled-wave analysis for the G3-08 grating) | B |
| `causal_reference` | The same discretisation on a domain long enough that no boundary echo reaches the monitor within the window; exact for the discrete problem by causality, so it isolates the physical reflection of an absorber (G3-07) | B |
| `physical_invariant` | A theorem that a correct solution must satisfy: reciprocity, passivity, Poynting flux balance through a closed surface, energy conservation | B |
| `convergence_study` | Refinement of mesh, time window or PML of the same solver at fixed physical geometry, with the continuum limit or a stored fine reference as oracle | B |
| `stored_record` | A benchmark record under `docs/validation/` whose numbers a test checks without recomputing; the record's own oracle class is stated next to it | either |
| `independent_implementation_same_scheme` | A second, separately coded implementation of the same discrete scheme (exact-endpoint engine, NumPy YeeGrid, dense one-step matrix). Independent code, not independent physics | A |
| `shared_discrete_operator` | The same discrete operator on another device, kernel or execution mode, or an explicit adjoint against autograd of the same discretisation | A |
| `finite_difference_same_discretisation` | Central differences, Taylor remainders or `gradcheck` of the same discretisation | A |

Layer A is discrete-operator agreement; layer B is accuracy of the continuous
problem. A case whose only classes are layer A cannot verify physics, which is
what G3-14 and G3-15 record by definition.

## Fixture table

Precision floor: the level at which the comparison is limited by round-off or
by the estimator, as asserted or measured. Time window and PML: what the
fixture fixes, and whether a control run was made. Numbers are the recorded
values of the pilot runs at commit 2b64f91 or of the stored records; none is
an acceptance limit.

### G3-01 `G3-01_uniform_propagation`

Bookkeeping in `G3-01_uniform_propagation.oracles.json` (the case file is
hash-bound to its evidence). Record `docs/validation/g3/G3-01.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Seeded eigenmodes, oblique and on-axis, `tests/test_physics_g3_a.py::TestG301` | Exact Yee dispersion relation written in the test (`analytic_discrete`); polarization identity (`physical_invariant`) | Closed form, no solver code | float64: cos(omega dt) residual and polarization leak recorded 0 against 1e-12; continuum phase error per wavelength 3.3e-3 (2D) to 5.5e-3 (3D, n = 1.5) at N = 40, reported as numerical dispersion | 35 steps (eigenmode) | none |
| Simulation propagation at N = 10, 20, 40, `test_propagation_phase_2d/3d` | Wavenumber from two monitors against the Yee relation (`analytic_discrete`) | Closed form | phase residual against the Yee relation 3.8e-7 rad at most (limit 1e-3, set by window truncation and the C1 taper); continuum error 2.4e-3 to 4.7e-3 rad per wavelength over the band at N = 40 | 553 to 1354 steps, one-cycle Gaussian | 20 layers at N = 40 |
| Layer A, `test_layer_a_cuda_fp32` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | within rtol 1e-4, atol 1e-6 | 553 and 677 steps | 20 layers |

### G3-02 `G3-02_dielectric_slab_tmm` and `G3-02r2_slab_tmm_40_cells`

The first case judged R and T at 20 cells per material wavelength and its run
FAILED on the dispersion of the coarse mesh; revision 2 judges at 40 cells and
keeps the 20-cell rows as the balance and convergence-order finding. The
sidecar of the first case lists the revision-2 tests, since its own 20-cell
R/T test no longer exists. Record `docs/validation/g3/G3-02r2.json` (first run
`G3-02.json`).

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Four lossless slabs (n = 1.5 and 3.5, d = 0.2 and 0.5 um) at 0, 20 and 45 degrees, TE and TM, `TestG302::test_slab_r_t_against_tmm_40_cells` | Fresnel/Airy transfer matrix written in the test (`analytic_continuum`) | Closed form | over the 24 instances at 40 cells: R and T errors 5.0e-4 to 9.3e-3 against 0.01, t phase 1.2e-3 to 1.33e-2 rad against 0.02 (the worst is close to the limit) | 400 fs, 6852 to 15760 steps, three-cycle Gaussian | 0.5 um (20 to 46 layers) |
| Energy balance at 20 cells, `test_slab_balance_20_cells` | |R+T-1| (`physical_invariant`) | Theorem | balance residual 5e-7 to 8.4e-5 at 20 cells and 1e-7 to 5.9e-5 at 40 cells against 0.01 | 400 fs | 0.5 um |
| Convergence order, `test_dispersion_order` | 20-cell over 40-cell error ratio (`convergence_study`) | Same solver, two meshes | ratios 3.93 to 4.25 for R and t phase over the 24 instances against the 3 to 5 band | 400 fs | 0.5 um |
| Layer A, `test_layer_a_cuda_fp32` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | within rtol 1e-4, atol 1e-6 on the 45 degree Bloch slab | 3426 steps | 0.5 um |

### G3-03 `G3-03_dispersive_slab_fit_ade`

Bookkeeping in `G3-03_dispersive_slab_fit_ade.oracles.json`. Record
`docs/validation/g3/G3-03.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Analytic Drude (0.1 um) and Lorentz (0.5 um) slabs at h = 0.02 and 0.01 um, TE and TM, `TestG303::test_analytic_slab_against_tmm` | Complex transfer matrix with the analytic permittivity (`analytic_continuum`) | Closed forms in the test | R, T, A errors 1.7e-4 to 2.7e-3, t phase 3.3e-4 to 5.1e-3 rad against 0.01 and 0.02 | 400 fs, 8565 and 17130 steps | 12 and 24 layers (0.24 um) |
| Fitted materials (1 Drude pole, 2 Lorentz poles) at h = 0.02 um, `test_fitted_material_slab` | Transfer matrix with the fitted and with the analytic permittivity (`analytic_continuum`) | Closed forms; the fit's own contribution is reported | fit band n,k errors 4e-10 and 2e-16; slab errors equal to the analytic-material rows (R 6.8e-4 and 2.0e-3, T 1.1e-3 and 2.7e-3) | 400 fs | 12 layers |
| ADE constitutive response, `test_ade_constitutive_error` | Bilinear ADE closed form against the solver table and a driven cell (`analytic_discrete`) | Closed form in the test | solver table against the closed form 1e-16 relative; driven cell 1e-15 to 9e-15; n,k error 3.4e-5 to 7.6e-4 at dt(h = 0.02 um) halving by 4.00 at h = 0.01 um | 32768 settling steps plus 32 periods | none |

### G3-04 `G3-04_mie_cylinder_sphere`

Bookkeeping in `G3-04_mie_cylinder_sphere.oracles.json`. Record
`docs/validation/g3/G3-04.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Cylinder r = 0.3 um, n = 1.5, TM and TE, h = 0.05, 0.025, 0.0125 um, `tests/test_physics_g3_b.py::test_g3_04_cylinder_scattering` | Infinite-cylinder Mie series with SciPy Bessel functions (`analytic_continuum`), self-checked by `test_g3_04_reference_series_limits` | Written in the test, optical theorem and small-size limits | width error at the judged h = 0.0125 um 1.74 percent (TM) and 0.37 percent (TE) against 2 percent; non-monotone sequence recorded (TM 3.8, 5.1, 1.7 percent) | 120 fs, 1028 to 4112 steps | 0.4 um |
| TE resonance of the n = 3.5, r = 0.25 um cylinder, `test_g3_04_cylinder_resonance` | Mie peak position and width (`analytic_continuum`) | Closed form | peak -0.58 percent (limit 1 percent), FWHM 5.7 percent (limit 15 percent) at h = 0.0125 um | 120 fs | 0.4 um |
| Sphere r = 0.3 um, n = 1.5, h = 0.1, 0.05, 0.025 um, `test_g3_04_sphere_scattering` | Bohren-Huffman series (`analytic_continuum`), cross-checked against `examples/tfsf_sphere.py` | Written in the test | 0.31 percent at the judged h = 0.05 um; 1.05 percent at 0.025 um (non-monotone, recorded) | 120 fs, 630 to 2518 steps | 0.4 um |
| Layer A, `test_g3_04_cylinder_cuda_layer_a`, `test_g3_04_sphere_cuda_layer_a` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | 9.2e-7 to 2.1e-6 relative against rtol 1e-4 | as above | 0.4 um |

### G3-05 `G3-05_drude_sphere`

Bookkeeping in `G3-05_drude_sphere.oracles.json`. Record
`docs/validation/g3/G3-05.json`; the evidence run is FAILED and kept.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Staircased Drude spheres r = 0.02, 0.035, 0.05 um at h = 0.02, 0.01, 0.005 um, `tests/test_physics_g3_b.py::test_g3_05_drude_sphere` | Complex-index Bohren-Huffman series with the analytic Drude permittivity (`analytic_continuum`); an ADE-sampled permittivity variant separates the time discretisation | Closed form in the test | at h = 0.005 um the scattering errors are 138, 46 and 45 percent and the absorption errors 673, 499 and 345 percent against the case budgets of 50/30/20 and 100/60/40 percent: FAILED as the case anticipated; inner/outer surface consistency 3e-4 to 3.2e-3 | 48 fs, 1259 to 5036 steps | 0.08 um |
| Layer A, `test_g3_05_drude_cuda_layer_a` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | 0 to 7e-5 relative against rtol 1e-4 | 1259 and 2518 steps | 0.08 um |

Open residual: the staircase error dominates and the task stays FAILED; the
dispersive subpixel interfaces of
[SUBPIXEL_INTERFACES.md](SUBPIXEL_INTERFACES.md#dispersive-interfaces) were
developed on this fixture and are not judged on it. The held-out revision
G3-05r5 below judges them.

### G3-05r5 `G3-05r5_drude_sphere_subpixel`

The G3-05 physics, band, mesh sequence and budgets with the dispersive subpixel
interfaces, on spheres of radius 0.027, 0.0425 and 0.058 um centred off the node
lattice, which no development run used. G3-05r4 was refused at validation before
any result was observed (its r = 0.06 um averaging window reached the TFSF
neighbourhood); its h = 0.02 um runs of the two smaller spheres were discarded
unseen. The case file lists every run and carries the oracle classes and layers.
Record
`docs/validation/g3/G3-05r5.json` (pending the judged run).

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Drude spheres r = 0.027, 0.0425, 0.058 um off the node lattice, dispersive subpixel interfaces, h = 0.02, 0.01, 0.005 um, `tests/test_physics_g3_05r5.py::test_g3_05r5_drude_sphere_subpixel` | Complex-index Bohren-Huffman series with the analytic Drude permittivity (`analytic_continuum`); an ADE-sampled permittivity variant separates the time discretisation | Closed form in the test | pending; budgets 50/30/20 percent (scattering) and 100/60/40 percent (absorption) at h = 0.005 um, inner/outer consistency 2 percent of the band maximum | 48 fs, 1259 to 5036 steps | 0.08 um |
| Layer A, `test_g3_05r5_drude_cuda_layer_a` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | pending; rtol 1e-4 | 1259 and 2518 steps | 0.08 um |

### G3-07 `G3-07_cpml_reflection_stability`

Bookkeeping in `G3-07_cpml_reflection_stability.oracles.json`. Record
`docs/validation/g3/G3-07.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Normal incidence in vacuum and n = 2, 10 layers at h = 0.025 um, `tests/test_physics_g3_a.py::TestG307::test_normal_reflection` | Reflected over incident power against the 40.5 um long domain (`causal_reference`) | Exact for the discrete problem by causality | R 4.7e-10 and 2.1e-9 (-93 and -87 dB) against 1e-6; broadband energy ratio agrees | 100 fs, 1713 steps | 10 layers (0.25 um) |
| Oblique 30 and 60 degree Bloch sheets, `test_oblique_reflection` | Long domain (`causal_reference`) | Causality | R 3.8e-10 and 8.6e-10 against 1e-4 | 150 fs, 2570 steps, three-cycle 1.45 um pulse | 10 layers |
| n = 2 half space crossing the absorber, `test_interface_reflection` | Long domain (`causal_reference`) | Causality | R 1.2e-5 (vacuum side) and 8.9e-8 (dielectric side) against 1e-4 | 150 fs | 10 layers |
| Depth and window controls, `test_depth_and_time_sweeps` | 20 versus 10 layers, 200 versus 100 fs (`convergence_study`) | Same solver | 20 layers 2.7e-12 (-116 dB); the window change moved R by 1.5e-6 relative | 100 and 200 fs | 10 and 20 layers |
| Long-time stability, `test_long_time_stability` | Energy must not grow (`physical_invariant`) | Theorem | late-growth ratio 1.1e-5 (vacuum), 6.0e-4 (n = 2) and 1.0 (60 degrees) against 1 + 1e-6, judged above a floor of 1e-12 of the peak energy; energy at the end 0 and 9e-7 of the peak | 20000 steps | 10 layers |
| Layer A, `test_layer_a_cuda_fp32` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | within rtol 1e-4, atol 1e-6 | 1713 steps | 10 layers |

### G3-08 `G3-08_bloch_grating_rcwa` and `G3-08r2_bloch_grating_rcwa_layer_a`

The first case's layer-A tolerance (rtol 1e-4, atol 0) failed on one instance
(TM, 20 degrees, 0.92 um: 1.15e-4 relative on an efficiency of 0.022); its
FAILED run stays. Revision 2 restates only that tolerance as the program pair
rtol 1e-4, atol 1e-6 and carries its test in `tests/test_physics_g3_b_r2.py`.
Records `docs/validation/g3/G3-08.json`, `docs/validation/g3/r2/G3-08r2.json`
and the oracle `docs/validation/g3/G3-08_torcwa_reference.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Binary grating, TE and TM, 0 and 20 degrees, 0.92, 1.02 and 1.06 um, subpixel interface, h = 0.005 um, CUDA float32, `tests/test_physics_g3_b.py::test_g3_08_grating_orders` | TORCWA 0.1.4.2 at 640 harmonics run in a separate interpreter by `benchmarks/g3_torcwa_grating.py` (`independent_solver`), converged per `test_g3_08_torcwa_reference_is_converged` | Independent RCWA code and method | efficiency error 1.6e-4 to 3.1e-3 against 0.01; dominant-order phase 4.4e-4 to 1.4e-2 rad against 0.02; efficiency sums 0.993 to 1.003 against the 0.01 balance; TM oracle uncertainty about 4e-4 (Laurent rule 1/N tail) | 300 fs; the 150 fs control rows are recorded only | 0.4 um |
| Empty cell, `test_g3_08_empty_cell` | Unit zero-order transmission, no other orders (`analytic_continuum`) | Closed form | zero-order deficit 3.8e-12 (TE normal) and 2.7e-6 (TM 20 degrees) in CPU float64 against 1e-6 and 1e-4; CUDA float32 3.7e-7 and 6.6e-6 against the layer-A allowance | 150 fs | 0.4 um |
| Layer A at h = 0.01 um, `test_g3_08_grating_cuda_layer_a` (first case) and `tests/test_physics_g3_b_r2.py::test_g3_08r2_grating_cuda_layer_a` | CUDA float32 against CPU float64 (`shared_discrete_operator`) | Same operator | worst relative difference 1.15e-4; excess over rtol 1e-4 plus atol 1e-6 is -6.7e-7 (passes revision 2, failed the atol 0 first case) | 300 fs | 0.4 um |
| Staircase and duration controls, `test_g3_08_staircase_and_duration_controls` | Recorded against TORCWA, not judged (`convergence_study`) | Independent solver | staircase at h = 0.005 um: TE phase error 3.3e-2 rad, TM efficiency error 3.7e-3 | 300 and 150 fs | 0.4 um |

### G3-13 `G3-13_curved_interface_convergence`

Bookkeeping in `G3-13_curved_interface_convergence.oracles.json`. Record
`docs/validation/g3/G3-13.json`.

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| G3-04 cylinder with staircase and subpixel interfaces at h = 0.05, 0.025, 0.0125 um, `tests/test_physics_g3_b.py::test_g3_13_mesh_and_interface_convergence` | Mie series error under mesh refinement and interface method (`convergence_study`) | Closed-form reference, comparative criterion | at h = 0.05 um subpixel 1.0 percent (TM) and 2.0 percent (TE) against staircase 3.8 and 11.2 percent; subpixel order estimates 1.97 to 2.12, staircase -0.42 to 4.0 (non-monotone, recorded) | 120 fs | 0.4 um |
| Sub-cell shifts 0, 0.25 and 0.5 cells at h = 0.05 um, `test_g3_13_subcell_shift` | Error spread against the Mie series (`convergence_study`) | Closed-form reference | spread 2.1 and 8.9 percent (staircase TM, TE) against 0.19 and 0.04 percent (subpixel) | 120 fs | 0.4 um |
| Smoothing width 1e-6 to 2 cells at h = 0.05 um, `test_g3_13_smoothing_width_sweep` | Differentiable-solid width against the staircase image and the Mie series (`convergence_study`) | Closed-form reference | vanishing width equals the staircase image off the contour; the four contour Ez nodes take the half value and change the TM width by 2.7 percent; TE error falls from 11.2 to 1.9 percent at half a cell and rises again at two cells | 120 fs | 0.4 um |

### G3-06 `G3-06_pec_pmc_cavity`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| PEC cube resonance, `tests/test_cavity_resonance.py` | Discrete and continuum TM110 eigenfrequency (`analytic_discrete`, `analytic_continuum`) | Closed forms derived from the Yee stencil and from Maxwell, no shared code | Estimator floor declared 1e-3 relative; measured 3e-6 to 7e-6; numerical dispersion 0.225 percent (n = 1) and 0.457 percent (n = 1.5) reproduced | 4000 steps, 763 fs; source interval of 600 steps excluded; no window sweep | none |
| Seeded eigenmode marching, `tests/test_pec_boundaries.py`, `tests/test_pmc_general.py`, `tests/test_pmc_reference.py` | Discrete Yee dispersion (`analytic_discrete`) | Closed form | float32 round-off 2e-6 to 4e-6 after 24 to 35 steps | 24 to 35 steps | none |
| Mirrored half versus full domain, `tests/test_pmc_general.py`, `tests/test_pmc_dispersive.py` | Full-domain autograd folded onto the half domain (`shared_discrete_operator`) | Same operator | float32 4e-6 absolute on signals, 2e-6 of the gradient maximum | 16 steps | 3 to 4 CPML layers on the non-mirrored axis; not mirrored because uniform PML profiles are half-cell offset |
| Exact-endpoint engine, `tests/test_pmc_general.py` | Sparse-incidence PEC/PMC engine (`independent_implementation_same_scheme`) | Separate code, same scheme | float32 rtol 3e-5, atol 2e-6 | 40 steps | none |

Open residual: the folded gradient of the reduced domain is checked against the
same discretisation only; no continuum derivative exists for this fixture.

### G3-09 `G3-09_mode_solver_oracles`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Periodic slab TE0/TM0, `tests/test_mode_ports.py` | Analytic slab dispersion by root finding (`analytic_continuum`) | Independent closed form | float64 eigenpair residual below 1e-4, Maxwell residual below 2e-5; neff absolute error below 5e-4 at h = 0.025 um | frequency domain | periodic box 2, 4, 6 um; box sensitivity below 2e-6 between 4 and 6 um |
| Open slab, `tests/test_open_mode_ports.py` | `benchmarks/open_mode_oracles.py` `solve_slab` (`analytic_continuum`) | Independent closed form, itself checked by `tests/test_open_mode_oracles.py` | float32 Maxwell residual below 2e-4, collar energy below 1e-4; recorded beta errors 0.150 percent (TE) and 0.0119 percent (TM) at h = 0.025 um | frequency domain | 0.8 um CPML fixed across meshes |
| Open fiber HE11, `tests/test_open_mode_ports.py`, `tests/test_open_mode_padding.py` | `solve_fiber_he11` (`analytic_continuum`) | Independent characteristic equation | recorded beta errors 0.551 and 0.330 percent at h = 0.1 and 0.08 um; staircase circle at 8 to 10 cells per diameter, hence the 2 percent fixture budget | frequency domain | 0.8 um CPML; box and PML sensitivity of beta below 1e-4 |
| Homogeneous medium, `tests/test_mode_ports.py` | Discrete periodic dispersion (`analytic_discrete`) | Closed form | rtol 2e-5 | frequency domain | none |

Open residual: field profile, confinement factor and modal power are not
compared with an analytic value; power normalisation is self-consistency.

### G3-10 `G3-10_pic_networks`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Y branch and crossing flux closure at 0.05 um, `tests/test_mode_branch_passivity.py` | Passivity and Poynting balance through a closed box (`physical_invariant`) | Flux planes do not use the modal projection; the incident power is the calibration guide's own flux | Closure -0.688 percent (Y branch) and -0.344 percent (crossing); Y-branch residual is mesh-, window- and PML-independent and unexplained; crossing residual is O(h^2) quadrature (-1.97 percent at 0.1 um) | 2400 steps, 229 fs; unchanged to five digits at 3200 steps; at 0.1 um 800 steps was truncation-limited (-2.12 percent falling to -0.64 percent at 1200 steps) | 0.8 um CPML; 1.6 and 2.4 um controls at 0.1 um changed the closure by less than 0.15 percentage points |
| Y branch and crossing S at 0.1 um, `tests/test_mode_branches.py` | Reciprocity, passivity bound, symmetry (`physical_invariant`) | Theorems | reciprocity 2.0e-3 (Y branch), 2.4e-4 (crossing) recorded; float32 | 800 steps, 152 fs | 0.8 um CPML |
| Straight guide, `tests/test_mode_branches.py`, `tests/test_mode_network.py` | exp(2 i beta L) from the mode solver (`analytic_discrete`); aperture versus full-cell network (`shared_discrete_operator`) | beta shares the eigensolver | column power within 1e-3 (aperture), 0.74 percent defect recorded for the perturbed full-cell guide | 600 steps | 0.8 um (mesh 0.1) and 5 cells (mesh 0.2) |
| Index step 1.0 to 1.2, `tests/test_mode_network_unequal.py` | Fresnel R and T (`analytic_continuum`); scalar discrete Yee interface (`independent_implementation_same_scheme`) | Fresnel is independent; the interface oracle is separate code of the same scheme, checked unitary to 2e-15 | complex S within 0.004 (recorded 1.29e-5) | 600 steps | 15 cells in the benchmark |

Open residuals: no bend or coupler fixture; no independent solver for the
junction S values; the 0.1 um network mesh cannot meet the 1 percent balance
limit because of the flux quadrature error, so the balance is declared at
0.05 um only.

### G3-11 `G3-11_dipole_radiation`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Analytic six-face dipole, `tests/test_radiation.py` | Hertzian dipole fields and far amplitude with phase (`analytic_continuum`); near flux versus far power (`physical_invariant`) | Closed forms | float64 quadrature convergence with halving ratios above 3.5 to 3.8, final errors below 2e-4 (far) and 5e-4 (near); float32 2e-3 | none (frequency domain input) | none |
| Native vacuum dipole pattern, `tests/test_radiation_dipole_pattern.py` | sin^2 theta with mesh refinement (`convergence_study`) | Closed form; scale factor fitted | pattern errors 1.03, 0.54, 0.23 percent at 0.1, 0.075, 0.05 um; float32; magnitude only | 50 fs fixed within one time step | 0.3 um fixed; no sweep |
| Native far and near objectives VJP, `tests/test_radiation.py` | central difference (`finite_difference_same_discretisation`) | Same discretisation | float64 rtol 2e-6 | 35 steps | 3 cells |

Open residuals: surface-position dependence and the phase of the native far
field are not tested; the native study sweeps the mesh only.

### G3-12 `G3-12_tensor_slab`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Birefringent slab, `tests/test_tensor_slab_acceptance.py` | Scalar-channel transfer matrix and its n_1 derivative (`analytic_continuum`) | Closed form; normal incidence with shared principal axes only | channel-vector error 1.372 percent (0.05 um) and 0.330 percent (0.025 um); index VJP 6.89 percent; tail RMS to peak 9.1e-8; float32 | 80 fs fixed, 594 and 1028 steps; tail decay bounds truncation; no sweep | 1 um tensor-filled CPML; no isolated reflection measurement |
| Coupled PEC standing wave, `tests/test_anisotropy_walls.py` | Discrete eigenpolarization frequency (`analytic_discrete`) with a 3 percent continuum bound | Closed form | float64 rtol 1e-9 | 400 steps | none |
| Fourier symbol and refinement, `tests/test_anisotropy.py` | Independently derived symbol (`analytic_discrete`); continuum eigenfrequency refinement ratio below 0.27 | Closed form | float64 2e-12 | 256 steps for energy conservation | none |
| Tensor gradients, `tests/test_anisotropy*.py` | central differences and Taylor (`finite_difference_same_discretisation`); full autograd (`shared_discrete_operator`) | Same discretisation | float64 rtol 2e-5 (six components), 1e-6 (rotation angle) | 12 to 16 steps | 3 layers |

Open residuals: reflection and channel balance of the tensor slab are not
measured; oblique incidence and unshared axes are outside the fixture.

### G3-14 `G3-14_discrete_backend_agreement`

All fixtures are `shared_discrete_operator` (layer A) by definition. Precision
floors: float32 forward 2e-6 to 3e-6 relative after 23 to 180 steps, float32
VJP 2e-5 to 3e-4 relative after 12 to 512 backward steps, float64 1e-13 to
2e-10. The float32 gradient budgets of 2e-4 to 3e-4 relative (tensor table
VJP, endpoint CPML VJPs, streamed density gradient, all-modes driver,
reversible) exceed the program's float32 rtol 1e-4 and are reported as
differences. Time window: the same steps on both paths. PML: part of the
compared operator, with CPML states compared directly.

### G3-15 `G3-15_gradient_checks`

All fixtures are `finite_difference_same_discretisation` or
`shared_discrete_operator` (layer A). Precision floors: float64 adjoint against
autograd 1e-9 to 1e-12; central differences 1e-6 to 2e-6 relative at h = 1e-5
(difference-quotient floor); float32 checks use steps of 2e-3 to 2e-2 with
2e-2 to 3e-2 budgets. Step sweeps with an asserted second-order trend: the two
PMC tests only; Taylor ratios of about 4 asserted in four tests, superlinear
only in the rest. No test detects the round-off floor adaptively; no
waveform parameter is checked through an FDTD run.

### G3-16 `G3-16_physical_parameter_gradients`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Planar slab thickness and permittivity derivatives, `tests/test_gradient_mesh_slab.py` | Airy T, dT/dd, dT/depsilon (`analytic_continuum`), checked against an independent transfer formula | Closed form | float32 adjoint; conservation error 1.8e-5; followup errors 1.63 and 1.78 percent at (0.01, 0.06) um; the first width 0.08 um missed 3 percent (2.80 and 3.19 percent) and is kept in the record | 90 fs exact; 120 fs control changed outputs by at most 1.8e-7 | 0.4 um; 0.5 um control changed outputs by at most 1.2e-7 |
| Polygon vertices, `tests/test_shape_gradients.py` record | Fine-mesh float64 central differences of the same regularised fill (`stored_record` of a `convergence_study`) | Not sharp-interface; regularised derivative only | float64 control changed the gradient by 6.6e-7 relative; reference step halving 0.066 and 0.055 percent; fine error 0.51 percent | 60 fs; 90 fs control 5.8e-6 relative | 0.24 um; 0.30 um control 1.8e-6 relative |
| Geometry maps, `tests/test_differentiable_geometry.py` | central differences and full autograd (layer A) | Same discretisation | float64 rtol 2e-6; float32 chain 3e-4 | 18 steps | 3 cells |

Open residuals: no sharp-interface shape derivative; no analytic derivative
for curved interfaces; no absolute-scale test of a near-zero derivative.

### G3-17 `G3-17_oracle_budget`

This document and `tests/test_oracle_budget.py`. The test checks every
`docs/validation/cases/G3-*.json` present in the tree: each carries
`oracle_class` and a `tests.layers` entry per listed test, in the case file or
in its `<case_id>.oracles.json` sidecar; every physics task (G3-01 to G3-13
and G3-16) keeps at least one layer-B entry and G3-14 and G3-15 are layer A
only. Test ids may name a class (`file::Class::function`).

## Sidecar files

The ten cases of G3-01 to G3-05, G3-07, G3-08 and G3-13 were declared and
recorded before the bookkeeping fields existed. Their evidence runs store the
case file hash, so the files are not edited; each has a sidecar
`docs/validation/cases/<case_id>.oracles.json` with `oracle_class` and
`tests.layers`. The sidecar of the superseded `G3-02_dielectric_slab_tmm`
lists the tests of the recorded revision-2 run and names the one test of the
first case that no longer exists.
