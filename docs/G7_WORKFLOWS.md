# G7 application workflows: declared fixtures, criteria and measurements

This page fixes, before any G7 run, the three application workflows, the independent-solver comparison and the cost
measurements. The case files `docs/validation/cases/G7-01.json` to `G7-05.json` carry the same
declarations in machine-readable form; a later change to a fixed quantity is a revised case and
needs the owner's approval. Every workflow runs from the installed wheel in an environment outside
the checkout, on the RTX 3060 workstation (`rtx3060-win11-lab`) unless a row says otherwise.

Baselines quoted below were read from records that predate this page:
`docs/validation/meep_comparison/metagrating_comparison.json` (two-ridge metagrating, band-mean
T+1 = 0.7706 in TorchFDTD, 0.7700 in RCWA) and `docs/validation/g6/coupler-seed*.json` (G6 coupler,
best fine-GDS transmission 0.6136, with declared fabrication constraints violated).

## G7-01: metagrating (application A)

The current run is **G7-01r4** below. The original table is retained as the
declaration history. Follow [G7_RUN.md](G7_RUN.md) to run the approved revision
from an installed wheel.

| Quantity | Fixed value |
|---|---|
| Stack | SiO2 substrate (n = 1.444) below y = 0.01 um; design layer 0.01 to 0.51 um; air above; the grid, absorbers, pulse and DFT lines of `examples/meep_comparison/metagrating/geometry.json` |
| Period | 2.0 um, periodic (Bloch) in x |
| Design variables | 100 pixels of 0.02 um across the period, one density per pixel, extruded through the layer; eps = 1 + (3.48^2 - 1) rho |
| Filter and projection | conic filter of radius 0.06 um; tanh projection at beta = 8, 16, 32, 64 for 20 iterations each (80 iterations); Adam, learning rate 0.1 |
| Starts | logits 0.5 * randn with seeds 1, 2 and 3 |
| Objective | mean of the +1 transmitted order efficiency at 1.50, 1.55 and 1.60 um, E along the ridges (TE), normal incidence from the substrate |
| Fabrication | declared minimum linewidth and gap 0.06 um (3 pixels), periodic boundary; binarized at 0.5 after the last beta |
| Final evaluation | every seed's binary design at the design mesh and at 0.01 um: TE and TM (H along the ridges), normal incidence and a fixed Bloch wavevector k_x = 2 pi n_sub sin(10 deg) / 1.55 um (10 degrees in the substrate at 1.55 um; the angle follows the wavelength across the band), 41 wavelengths from 1.50 to 1.60 um, reflected and transmitted orders -1, 0, +1 as complex amplitudes |
| Independent check | TORCWA 0.1.4.2 on the same binary pixel pattern and the same k_x for every evaluated case |

Acceptance: (a) all three seeds reported with history, design and every evaluation; (b) the best
seed's band-mean T+1 (TE, 0 degrees, binary, design mesh) is at least the two-ridge baseline 0.7706;
(c) TorchFDTD and TORCWA differ by at most 0.02 in every order efficiency of every evaluated case, at
the design mesh for TE and at 0.01 um for TM (the staircase error of the normal field component
needs the finer mesh); (d) the 0.01 um mesh changes T+1 (TE, 0 degrees) by at most 0.02 at every wavelength;
(e) |1 - sum R - sum T| <= 0.02 in every evaluated case; (f) the best seed's binary design meets the
declared linewidth and gap, and every seed's violations are reported.

## G7-02: small finite metalens (application B)

| Quantity | Fixed value |
|---|---|
| Lens | the 2D silicon-ridge lens of `examples/meep_comparison/metalens/geometry.json`: 33 ridges on a 0.6 um pitch, 20 um aperture, height 1.0 um, design focal length 15 um, 1.55 um, E out of plane |
| Grid | 0.025 um, 5200 steps, PML 1.0 um, the recorded source and DFT lines (aperture line y = -7.9 um, focal line y = 5.6 um, axis x = 0) |
| Starts | three deterministic width sets: (1) the library design of `design_2d.json`; (2) every ridge one library step wider where the library allows it; (3) one step narrower where it allows it |
| Refinement | ridge widths as shape parameters through the shape VJP, objective the focal-point intensity at 1.55 um, 20 Adam iterations, learning rate 0.01 um |
| Validation of each final design | full-aperture field at the design grid; the same at 0.0125 um with the same physical time; the design grid with 1.5 times the physical time; angular-spectrum propagation of the aperture-line field to the focal and axial lines against the direct DFT lines |
| Observables | focal-line and axial intensity, axial peak position, focal-line FWHM, focusing efficiency as defined in `examples/meep_comparison/metalens/compare.py`, side-lobe ratio |

Acceptance: (a) all three starts reported; (b) the best refined design's focusing efficiency is at
least the library design's recorded 0.5571; (c) the 0.0125 um grid changes the focusing efficiency
by at most 0.02 and the axial peak position by at most 0.1 um; (d) 1.5 times the physical time
changes the focusing efficiency by at most 0.005; (e) the propagated and the direct focal-line
intensities differ by at most 5 percent in relative L2 norm; (f) the focal-line FWHM of the best
design is at most 1.25 times lambda / (2 NA) = 1.76 um. A unit-cell phase library alone is never
reported as a full-lens validation.

## G7-03: passive PIC coupler (application C)

| Quantity | Fixed value |
|---|---|
| Device | the offset-guide coupler of `examples/design_mode_coupler.py`: two slab guides of eps 4 in eps 2.25 cladding, 0.6 um wide, offset 0.6 um, fixed-mode ports on both guides, 6 by 10 pixels of 0.2 um design box with a 180-degree rotation symmetry |
| Starts | logits 0.5 * randn with seeds 1, 2 and 3 |
| Mesh | 0.05 um for the optimization and the evaluation, 0.025 um for the mesh check (G6 optimized at 0.2 um, one cell per pixel) |
| Objective | modal transmission port 1 to port 2 at 1.55 um, held-out wavelength 1.50 um reported and never optimized |
| Fabrication | declared minimum linewidth and gap 0.4 um, enforced through the filter radius and a final check; erosion and dilation of 0.1 um reported |
| Final evaluation | the full 2 x 2 modal S matrix with phases at 1.50, 1.55 and 1.60 um for the binary design; the design exported to GDS, re-imported and simulated again |
| Gradient check | adjoint derivative against central finite differences at three pixels per seed |

Acceptance: (a) all three seeds reported; (b) the best seed's transmission after the GDS round trip
is at least 0.6136 while its design meets the declared linewidth and gap; (c) |S11|^2 + |S21|^2 <= 1.01
and |S22|^2 + |S12|^2 <= 1.01 for every seed and wavelength; (d) |S21 - S12| <= 1e-3 in every case;
(e) the adjoint and finite-difference derivatives agree within 2 percent at every checked pixel;
(f) the GDS round trip changes the transmission by at most 0.005; (g) the 0.025 um mesh changes the
best seed's transmission by at most 0.02.

## G7-04: independent solver at matched accuracy

| Quantity | Fixed value |
|---|---|
| Problem | the fixed two-ridge metagrating of `examples/meep_comparison/metagrating/geometry.json`, TE, normal incidence |
| Reference | TORCWA with 101 Fourier orders, checked against 51 orders (difference at most 1e-4) |
| TorchFDTD | RTX 3060, fused CUDA kernels, meshes 0.04, 0.02, 0.01 and 0.005 um, steps scaled to the same physical time |
| Meep 1.34 | i7-12700, 4 MPI ranks in the torchfdtd-bench WSL distribution, resolutions 25, 50, 100 and 200 per um, the same physical time |
| Observables | T+1 at 1.55 um and the band-mean T+1; error = absolute difference to the reference; cost = wall time (median of three runs), cells and steps |
| Material sampling | two series per solver: staircase (Meep with eps_averaging off), with the whole structure shifted by half a cell in x and y at a mesh where an edge would fall on a node (the shift leaves the order efficiencies of the periodic structure unchanged); and smoothed (Meep's default subpixel averaging, TorchFDTD's experimental subpixel interfaces) without a shift |
| Physical time and absorber | 560 fs and a 0.4 um absorber at every mesh; Courant number of the base fixture |

Acceptance: every point is recorded with its median and range; the accuracy-versus-cost curve of
both solvers is rendered from the record; the cost to reach errors of 0.01, 0.005 and 0.002 is
reported by log-log interpolation for each solver and each sampling series; equal-cell-count and equal-error comparisons are
reported separately; the record states that the two solvers ran on different hardware (CPU against
GPU) and draws no conclusion about algorithms from it.

## G7-05: cost of a design iteration

The current cost case is **G7-05r2** below. Its broadband/sequential adjoint
comparison supersedes the original tensor-batch row.

| Quantity | Fixed value |
|---|---|
| Workloads | one design iteration of G7-01 (three wavelengths, TE) and one of G7-03 |
| Stages | T_geometry, T_setup, T_forward, T_monitor, T_backward, T_transfer/IO, T_optimizer, each bounded by a CUDA synchronization; overlapping asynchronous work is not summed and the overlap definition is recorded |
| Cold and warm | the first iteration of a fresh process (compilation, JIT, mode solve) against the median of iterations 2 to 6 |
| Repeats | five fresh processes; median and range |
| Execution | resident against host-streamed for the G7-01 iteration; the three wavelengths as one tensor batch against three sequential runs, including preparation, normalization and backward |
| Tuning | the cost of the policy autotuner and its break-even iteration count, or the statement that it gives no gain |

Acceptance: every stage is recorded with its median and range for cold and warm iterations; the
streamed and batched comparisons are recorded even where they are slower; the recorded medians
become the baseline and a test flags a later run whose stage median exceeds 1.25 times it.

## Revisions

- G7-01r4 (owner approved 2026-09-27): the r3 performance attempt failed. The
  revised design uses six alternating ridge/gap runs with a minimum of three
  pixels per run. A disclosed TORCWA-assisted initializer is perturbed with
  logit jitter 0.03 for held-out seeds 7, 8 and 9. Six Adam steps at 0.02 um and
  560 fs precede selection of the better initial or final hard design by the
  same short objective. Development used seeds 11 to 13. Judging retains the
  0.01/0.005 um meshes, 2240 fs, all 41 wavelengths, TE/TM and normal/Bloch
  incidence, anomaly exclusions and every numerical limit. Performance is
  compared with the larger of 0.7706 and the baseline in the judged path.
  See [G7-01r4.json](validation/cases/G7-01r4.json).
- G7-05r2 (owner approved 2026-09-27): the released tensor-batch API is forward
  only and cannot perform the required design backward. The cost study compares
  one broadband three-frequency adjoint with three sequential single-frequency
  adjoints contributing to one mean objective and one optimizer update. The
  workload remains G7-01r3 for reproducibility. All seven stages, five fresh
  processes of six iterations, resident/host comparison, tuning cost and 1.25x
  regression limit are retained. The calibrated host policy is 200 x cells,
  48 temporal steps and 16 checkpoints. See
  [G7-05r2.json](validation/cases/G7-05r2.json).

Each revision is a separate case file that supersedes the declared one, with its reason, evidence and the owner's approval; the declared rows above are kept as declared.

- G7-04r2: the reference is checked against 241 orders instead of 51 (every efficiency within 1e-4). Reason: the declared reference check compared the 101-order TORCWA reference with a 51-order solution, which measures the error of the 51-order solution rather than of the reference; a reference is checked against a higher order. Evidence: 101 orders against 51 differ by up to 4.7e-4 (T+1 at 1.50 um); 101 orders against the committed 241-order record (docs/validation/meep_comparison/metagrating_rcwa.json) differ by at most 6.4e-5 in any efficiency, 9.7e-6 in T+1 at 1.55 um and 8.7e-7 in the band mean, far below the smallest error target 0.002. Approved by the owner on 2026-09-24.

- G7-01r2: design and judged mesh 0.01 um with a 0.005 um mesh check; 3 um more air and substrate in every run; 1120 fs of physical time; the filter radius chosen on development seeds 11 to 13 to meet the 3-pixel features; (c) and (e) judged at least 0.02 um from every Rayleigh anomaly, excluded wavelengths reported; TORCWA TM converged to 0.003; acceptance limits unchanged Reason: the declared fixture could not meet its own criteria for any design: (1) at the fixed k_x the +1 air order has a Rayleigh anomaly at 1.5111 um inside the band and the declared cell leaves 0.91 um of air, so the evanescent order reaches the absorber; (2) the 0.02 um mesh is one cell per pixel, too coarse for a 0.02 agreement; (3) 560 fs does not outlast a resonance near 1.50 um; (4) a 0.06 um filter does not guarantee the declared 3-pixel features; (5) TORCWA TM with the Laurent rule converges as 1/N and stopped short of its tolerance. Evidence: best design, fixed k_x, 3 um more air and substrate, wavelengths at least 0.02 um from any anomaly: energy residual 0.0042 (TE) and 0.0039 (TM), largest |FDTD - TORCWA| 0.0035 (TE) and 0.0027 (TM) at 0.01 um, against 0.0903 and 0.0807 residuals in the declared cell; 0.02 um from the anomaly the evanescent decay length is 1.5 um and a propagating order leaves at most 80.7 degrees from the normal; TE at 0.02 um misses 0.02 by discretization (0.0229 at 1.5775 um, 0.0035 at 0.01 um); doubling the time brings the resonant case from 0.090 to 0.0071. Approved by the owner on 2026-09-24.

- G7-03r2: 0.1 um design pixels (12 by 20) in the same box, the filter radius chosen on development seeds to meet the 0.4 um features, and (b) judged against the best G6 design evaluated by the same pipeline at the same 0.05 um mesh (0.6025) instead of its 0.1 um value (0.6136); other limits unchanged Reason: the declared baseline 0.6136 is a G6 design evaluated at 0.1 um, while G7 judges at 0.05 um, and the mesh alone shifts this device by about 0.02; and 0.2 um pixels leave the declared 0.4 um linewidth and gap only two pixels, too coarse a parameterization for a fabrication-aware design. Evidence: the G6 designs through the G7 pipeline (same GDS round trip, 0.05 um, 2000 steps): best 0.6025 at 1.55 um (G6 seed 1, which violates the 0.4 um linewidth and gap); at 0.025 um 0.5961; the G6 value 0.6136 is its 0.1 um evaluation; the compliant 0.2-um-pixel design reaches 0.5915 at 0.05 um. Approved by the owner on 2026-09-24.

- G7-02r2: every forward run continues until the cell energy falls below 1e-3 of its peak after the source (capped at 10 times the declared window), the refinement finds that step count for the current design in every iteration, and (d) compares the efficiency at twice the stop time; the limit 0.005 and the other criteria are unchanged Reason: the declared 303.6 fs window ends while the lens still holds energy in the ridge array: at 1x the cell holds 1.7e-2 (library) to 1.85e-2 (refined) of its peak energy, so the efficiency depends on where the window ends (changes of 0.005 to 0.039 between 1x and 1.5x, and oscillations of 0.005 up to 4x), and a refinement at that window optimizes a truncated response. Evidence: energy stop study: 98 to 99 percent of the energy left at 10x sits within 0.5 um of the ridge layer (a slowly leaking array mode, not absorber reflection); the library design gives 0.55672 at the 1e-3 stop (3.46x) and 0.55671 at the 1e-4 stop (7.77x), and the native auto-shutoff at 1e-4 gives 0.55672; the refined narrower design reaches 1e-3 at 4.97x. Approved by the owner on 2026-09-24.

- G7-01r3: a robust projection (eroded, nominal and dilated designs of the same filtered density, the smallest of their three objectives maximized, the threshold shift chosen on development seeds 11 to 13 from 0.10, 0.20 and 0.25), the 3-pixel open and close still applied to every binary design, evaluations over 2240 fs, and (b) judged against the larger of 0.7706 and the two-ridge baseline evaluated in the judged path; other settings and every limit as in G7-01r2. Reason: the G7-01r2 design procedure could not meet its own criteria: the declared filter and projection leave lines and gaps narrower than 3 pixels, which the declared open and close removes after the optimization at a cost the optimizer never sees (seed 1: band-mean T+1 0.7816 as thresholded, 0.6570 after one changed pixel; development seeds 11 to 13 at 0.06 um: 2, 1 and 6 changed pixels costing 0.186, 0.069 and 0.372), and 1120 fs does not outlast a resonance of a slab-like design (seed 3, TE, normal incidence: energy residual 0.0299 at 0.01 um and 0.0280 at 0.005 um, rippling across 1.50 to 1.52 um while the TORCWA spectrum is smooth there); the baseline value is path-independent but was not evaluated in the judged path. Evidence: the G7-01r2 run at commit 0a2c3e6 (kept outside the repository): (a), (d) and (f) passed; (b) 0.7301 against 0.7706 (seed 2, no pixel changed); (c) 0.0257 (seed 3, TM, normal incidence, R-1 at 1.5225 um, a resonance of slope up to 39 per um shifted by about 0.7 nm at 0.01 um, 0.0028 at 0.005 um); (e) 0.0299 (seed 3, TE, normal incidence, 1.50 um); every case of seeds 1 and 2 within 0.006 of TORCWA and 0.003 in energy; the two-ridge baseline is 0.7706 in TorchFDTD at 0.02 um, 0.7706 in Meep and 0.7700 in TORCWA, and the G7-01r2 path agrees with TORCWA at 0.01 um to 0.0013 in TE at normal incidence; a robust projection, with eroded, nominal and dilated designs optimized together, imposes the length scale during the optimization (Wang, Lazarov and Sigmund, Struct. Multidisc. Optim. 43, 767 (2011)). Approved by the owner on 2026-09-26.
