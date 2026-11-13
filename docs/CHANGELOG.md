# Changelog

User-visible changes of TorchFDTD, newest first, one line per change with the commit
that made it. The rules for what goes here, for deprecations and for result-impact
notices are in [COMPATIBILITY.md](COMPATIBILITY.md). Dated sections correspond
to release versions, and the unreleased section collects changes for the next release.
Commits that only record validation evidence or documentation ("Record ...",
"[skip ci]") are not listed; `git log` has them.

## Unreleased

## 1.3.0 (2026-11-14)

### Added

- `torchfdtd mcp`, a Model Context Protocol server for AI agents (optional `mcp` extra): example projects, the project schema, validation, runs through the workbench job path, flux ratios against a reference run and Python export as seven tools ([AGENTS.md](../AGENTS.md#tools-for-agents-mcp), 8155af6, de7dca2).
- [AGENTS.md](../AGENTS.md), a guide for coding agents with a starting example per task, a checking workflow, citation and contribution rules; a Claude Code plugin marketplace with a simulation skill (`/plugin install torchfdtd --marketplace hyoseokp/TorchFDTD`); `llms.txt` and `llms-full.txt` on the project site (8155af6).

### Changed

- Package metadata: a description that names the solver, keywords, classifiers and project links on PyPI (8155af6).

### Validation scope

- CPU tests of the MCP tools with mcp 1.27 and 2.3, an end-to-end stdio session (list, validate and run on an RTX 3060), the server, API, security and README tests, and `claude plugin validate`. Agents started without context completed a bend-transmission task through the MCP tools and through the Python package. The solver and kernels are unchanged from 1.2.0.

## 1.2.0 (2026-11-13)

### Added

- Experimental slab decomposition (`SlabDecomposition`, `decomposition=`) for `DifferentiableSimulation`, `DifferentiablePlaneSimulation` and the recorded CPML point/plane adjoints: halo rows inside the existing Yee/CPML, fused CUDA and adjoint code, per-rank admission, torchrun and local launchers, bit-identical to one device on CPU, Gloo and single-GPU thread ranks ([DISTRIBUTED.md](DISTRIBUTED.md)) (71ff83f).

### Performance

- CUDA step graphs are captured on their side stream without the full garbage collection and cache release that `torch.cuda.graph()` runs before every capture. Results are bit-identical; the 64^3 throughput solve on an RTX 5090 host took 0.050 s instead of 0.118 s ([CROSS_SOLVER_COMPARISON.md](CROSS_SOLVER_COMPARISON.md#c2-forward-throughput-against-beamz-on-an-rtx-5090), ac7bed8).

### Validation scope

- Changed-code tests on an RTX 3060 (WSL, torch 2.11, CuPy 14.2): 760 passed, covering slab decomposition, the differentiable and recorded CPML adjoints, adjoint memory, planes and spectra, and CUDA graph steps. Slab decomposition is bit-identical to one device on CPU, Gloo and single-GPU thread ranks. The CUDA graph tests also passed on an RTX 5090. Several physical GPUs and the full release suite remain outside this release's validation scope.

## 1.1.7 (2026-10-07)

### Added

- Isotropic Lorentz density mixtures in periodic and recorded CPML point/plane adjoints, with packed CUDA pole state, z-dependent fixed backgrounds, retained VJPs, terminal offload and complete pole memory admission ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#isotropic-lorentz-density-mixtures), 36589c6).
- Public `fit_discrete_lorentz` for timestep-specific Sellmeier and oscillator inputs, reported fit errors and optional normal-incidence Yee phase compensation. A small voxel lens example demonstrates the API (36589c6).

### Validation scope

- Changed-code CPU and RTX 3060 regressions, direct bit comparison with the supplied reference and version-specific clean installation are recorded separately. Full legacy RC, RTX 5880 and multiple GPUs remain outside this patch release's validation scope.

## 1.1.6 (2026-10-06)

### Added

- Example `examples/full-aperture-tiled-adjoint/`: the meta-atom libraries of the baseline designs (`libraries/`).

### Fixed

- Example `examples/full-aperture-tiled-adjoint/`: the source data of Supplementary Fig. 9 list the apertures and wavelengths of the three plotted designs (E3, 100 um at 540 nm), and the README names the examples as in the paper.

## 1.1.5 (2026-10-06)

### Added

- Example `examples/full-aperture-tiled-adjoint/`: full-aperture tiled-adjoint optimization of three freeform metasurfaces (a broadband lens and two holograms), with drivers, settings, final layouts, optimization histories, an evaluation script and the source data of the figures and tables of the accompanying preprint (2fae7bd).

## 1.1.4 (2026-10-02)

### Added

- Optional block-strided multi-entry CUDA launches for split Yee and field-adjoint kernels, with joint block/count tuning, reported choices and bounded scratch admission. The default remains one entry per thread ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#multiple-entries-per-cuda-thread), this commit).

- Recorded CPML point and plane models accept optional `trace_storage="auto"`, selecting a complete device reservation or a bounded asynchronous CPU archive before allocating fields. Selection, budgets and denied candidates are reported per solve. The existing default remains `"device"` ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#automatic-boundary-history-placement), 86e3d01).

## 1.1.3 (2026-10-01)

### Performance

- Recorded CPML plane models reuse fixed host observation tables across solves, avoiding repeated dense-plane index preparation while preserving monitor and duplicate-adjoint ordering. Each solve owns fresh CUDA maps and field/seed bindings ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#online-fixed-plane-spectra), db4d3d0).

## 1.1.2 (2026-09-30)

### Added

- Recorded CPML point and plane APIs accept optional per-kernel CUDA block-size selection, fused E/H forward updates, and a one-pass field adjoint through `ReversibleCPMLOptions`. Reports identify actual kernels, fallbacks and tuning source hashes. Admission includes the extra field/CPML buffers and tuning scratch. Existing defaults remain unchanged ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#optional-cuda-launch-and-fusion-settings), this commit).
- A public-API reversible tile benchmark alternates the optional kernels against the same split-path interval, checks bitwise fields and gradients, and records timings and source hashes (this commit).

### Fixed

- CR and streamed-policy benchmark records retry brief Windows file-replacement errors while preserving the previous complete output. Persistent errors are still reported (this commit).

## 1.1.1 (2026-09-28)

### Added

- `ReversibleCPMLOptions(interior_z=(a, b))` restricts reconstruction to an explicit inclusive z interval inside the CPML-free interior. It reduces reconstruction work and terminal-field storage while preserving the full-domain forward and field adjoint. Each call checks that epsilon equals the fixed material map outside the interval. Point and plane APIs and `PeriodicLayerResponse` use the same interval and support checks ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#restricting-reconstruction-to-the-design-layers), this commit).

### Changed

- Recorded CPML simulations accept soft electric sources outside the reconstruction interval, including its non-PML collar. Each component must lie wholly inside or outside the interval. Exterior sources enter through the recorded halos. The default interval is unchanged, and previously supported inputs keep their forward results and gradients (this commit).

### Performance

- CUDA recorded CPML observations write directly into the sample buffer, preserving field bits and removing temporary gather/scatter outputs. The observation index is included in host/device memory admission. See [measured comparisons](REVERSIBLE_CPML.md#recorded-observation-performance) for workload-specific timings (this commit).

- CUDA reconstruction combines the inverse electric-field update and material VJP in one kernel. Real and complex paths share curl H without changing component arithmetic. Interior kernels use restricted pointers, bounded 32-bit indices and 128-thread launch bounds. Comparisons with the separate kernels require bitwise equality of fields, gradients and adjoint states across block sizes 64, 128, 256 and 512. Changing `interior_z` can change gradient roundoff and remains opt-in (this commit).

## 1.0.0 (2026-09-27)

### Added

- Installed-wheel application examples: an examples-only ZIP with a per-file SHA-256 manifest and a PowerShell guide for the metagrating, finite metalens and PIC coupler. The metagrating r4 workflow uses a disclosed TORCWA-assisted initializer, constrained ridge/gap lengths and new held-out seeds, with unchanged accuracy and efficiency limits (`0f45751`, [G7_RUN.md](G7_RUN.md)).
- Complete design-iteration cost study: seven synchronized stages, five fresh processes with cold/warm statistics, resident versus host-streamed execution, broadband versus sequential adjoints and policy-tuning break-even. The native tensor-batch path remains forward only (`1fb6efd`, case G7-05r2).

- Dispersive subpixel interfaces: with `interface_method='subpixel'`, node cells (two mesh steps per axis) that meet a Drude, Lorentz or multipole object take the dispersive averaging tensor `n n^T (B + f/eps_m) + (I - n n^T)/(C + f eps_m)` with its normal and tangential laminate branches (Deinega and Valuev 2007), assembled on the edge triplets of the coupled operator and advanced by trapezoidal ADE banks driven by D (`torchfdtd/subpixel_dispersive.py`); nondispersive cells next to them take the static tensor without its coupling between a D-driven and an E-updated edge. The D-driven samples keep D as their state and their E is assigned from it every step, so an E write or rounding leaves no static offset. The instantaneous operator stays Hermitian with eigenvalues in (0, 1]. Resident CPU, Torch CUDA, fused CUDA and tensor cohorts run it; two dispersive materials in one node cell, a dispersive surface within one window of a nonperiodic boundary, `pml_dispersion='frozen'` with a dispersive structure, and soft E sources, TFSF face neighbourhoods and one-way injection neighbourhoods on D-driven samples are refused, where subpixel previously refused every dispersive material. `summary['subpixel']['dispersive']['device_bytes']` models the state's device memory and the resident estimate adds an upper bound of it; the subpixel triplet, spectral-bounding and degenerate-normal counts leave out the node triplets the dispersive tensors replace. Dielectric-only subpixel scenes are unchanged bit for bit ([SUBPIXEL_INTERFACES.md](SUBPIXEL_INTERFACES.md#dispersive-interfaces), this commit).

## 0.17.1 (2026-09-26)

### Added

- `Region.pml_dispersion='absorber'`: every PML face whose layer rows hold a material sample of an enabled dispersive (Drude/Lorentz/multipole) structure becomes an adiabatic absorber of the same depth, and the other faces keep the CPML. The absorber is a graded, matched electric and magnetic conductivity, updated trapezoidally; pole cells solve their ADE together with an E loss matched to Re ε at the source centre, and only the pole samples with that loss carry its coefficients. Where it runs: the resident CPU and CUDA solvers (torch and fused kernels) and `run_tensor_batch`, whose summaries list `absorber_faces`. The resolved plan describes the faces, the losses and each reference permittivity, and `verify_grid` checks them. The run and tile signatures that match frequency-plane references include the faces. The estimate counts the absorber's device arrays (`absorber_estimated_bytes`) and the host transient of building them. What it refuses: the differentiable, plane-adjoint, streamed and reversible solvers refuse it when it would add absorber faces, and the paths whose oscillators are parameter tensors (`DispersiveSimulation`, `DispersivePlaneSimulation`, `StreamedDispersiveSimulation`) refuse every mode other than `'ade'`. Absorber faces are refused next to PMC/symmetric faces, with subpixel interfaces, and with stretching (`kappa` other than 1 or `alpha` above its default). A soft sheet with `extend_through_pml` across an absorber face is refused at planning, in the tiled mode's admission and by `run_tiled` before any tile runs (measured error 27 to 37 percent). What it fixes: the divergence of dispersive media in the PML, now reproduced and explained. A SiN or Drude post filling the outer five cells of a CPML corner grows by e^0.057 per step, in float64 and float32 alike, in the pole's negative-permittivity band; a SiN post or film entering the corner layers from the interior grows by e^0.10 and e^0.076, and a Drude bar crossing a layer by e^0.0011. It is an instability of the stretched-coordinate PML around negative-permittivity inclusions, not a coupling defect, and it survives mesh refinement. Evidence: case `DISPERSIVE_PML_ABSORBER`. The SiN and Drude posts and the 6 um SiN pillar array stay stable for 20,000 steps (float64 CPU; float32 CUDA fused, torch kernel and tensor batch), and every structure above decays with the absorber. A homogeneous SiN fill through 40 absorber layers reflects 1.6e-8 at normal incidence, against a limit of 1e-6. The one-step operator of a corner post has spectral radius about 1 + 1e-3 with the CPML and within 1e-13 of 1 with the absorber. Cost: the absorber reflects far more than the CPML at oblique incidence, where a transverse interface crosses it and in strongly dispersive fills. Those numbers are recorded, not judged. Record `docs/validation/dispersive_pml_absorber.json`, tables in [DISPERSIVE_PML_ABSORBER.md](DISPERSIVE_PML_ABSORBER.md), description in [BOUNDARIES.md](BOUNDARIES.md#dispersive-materials-inside-pml) (344fdf1, 639d3ff, 8afce59, e7c8970, 7a66082, b207083).

### Changed

- The plane adjoints (`DifferentiablePlaneSimulation` and its subclasses) and every other `_System`-based solver refuse `pml_dispersion='frozen'` like `DifferentiableSimulation` when a dispersive structure has a material sample in a PML layer, instead of running the plain CPML/ADE update. A project without one runs as before in every mode (344fdf1, e7c8970, b207083).
- The validation warning for dispersive structures inside a PML separates three cases. It recommends `pml_dispersion='absorber'` for a structure whose Re ε turns negative in the band of the grid and that has an end inside a layer, claims no stability for such a structure that crosses a layer, and for a material whose Re ε stays positive states the absorber's reflection cost and advises keeping the CPML. A structure reaches a layer when it covers a material sample in the layer's rows, with Yee or cell sampling (e7c8970, b207083).

## 0.17.0 (2026-09-26)

### Added

- `torchfdtd serve --memory-admission` and `create_app(memory_admission=True)`: the workbench server admits scenes by the memory estimate and the caps a project carries, as the Python API does, instead of `SERVER_LIMITS`, in its requests, job threads and modal worker. Every list keeps a ceiling checked before its items are validated (200,000 structures, 10,000 sources and monitors, 1000 materials, 10,000 refinement boxes, 1,000,000 frequency points and signal samples; `torchfdtd.models.MEMORY_ADMISSION_LIMITS`), so a 32 MB request validates in at most about 3.3 GB. The input limits (request and upload sizes, FSP and GDS parser limits, text caps, route bounds, one million cells per axis, the 2^31 index bound) and the loopback, `Host` and `Origin` checks stay. `/api/health` reports `admission` and `server_limits`, and the execution panel shows the admission. The default is unchanged; the mode is meant for a single user on their own machine ([SECURITY.md](SECURITY.md#memory-admission), this commit).
- `DELETE /api/jobs/{key}` releases a finished job's results and files; while a result file is in use it answers 409 and keeps the job (this commit).
- `ReversibleCPMLOptions(diagnostic_chunk_elements=...)`, 65536 (the previous fixed value) through 2**26, sets the real lanes per chunk of the recorded-CPML drift diagnostic and of the finite and material checks; the report and the reservation carry it (`diagnostic_chunk_elements`, 24 bytes of scratch per lane in `diagnostic_reservation_bytes`). The default reproduces earlier reports bitwise. A larger chunk cuts the number of small reductions (146,224 per 1200-step forward of a 920 x 920 x 125 grid with 99 interior planes at the default, 570 at 2**24) and changes only the float64 summation order of the reported drift L2 values, not signals, spectra or gradients ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#what-is-recorded-and-reconstructed), this commit).

### Changed

- Under memory admission the workbench server checks, from counts alone and where planning or running starts (never in model validation), the host memory that `estimate()`, `resolve_plan` and the resolver will take (`torchfdtd.solver.admit_planning`, `preadmission_bytes`: steps, source terms, monitor frequencies, plane points, Bloch sheet cells and list items) against 80% of the available host memory before any array is built; 10**12 steps, frequencies or plane points answer 422 in either mode, under the fixed limits through the limits. `valid_scene` checks the temporal Nyquist limit and `estimate()` counts frequencies and plane points without building them. The source preview covers the first 100,000 steps of a longer run (`preview_steps`). A finished job keeps its point-monitor series and plane flux strided to at most 400,000 values each and rendered in the route (`spectrum_stride`, `trace_stride`, `flux_stride`), `GET /api/jobs` lists flux planes by name, `GET /api/jobs/{key}/field-monitors/{id}` sends a plane strided along its axes to at most 512 x 512 points (`full_shape`, `stride`), and the CSV exports stream, `spectra.csv` and `monitors.csv` from the saved result with every spectrum sample; the NPZ download keeps every array (this commit).
- The host estimate (`host_estimated_mb`, and the CPU estimate) counts 7 KiB of plan record per structure beyond the first 4096, which the recorded margins cover, so Auto streams a scene with GDS-scale structure counts instead of admitting a resident run that fails (this commit).
- `ReversibleCPMLSimulation` and `ReversibleCPMLPlaneSimulation` run a call that cannot request a gradient (under `torch.no_grad()` or `torch.inference_mode()`, or with an `epsilon` that does not require gradients) forward only: the recorded forward's updates, source injections, observations and DFT blocks in the same order, scalar or diagonal epsilon, CPU or fused CUDA, without the boundary trace, the terminal interior copy or the 64-step reconstruction scale. Signals and spectra are bitwise equal to the recorded forward's. The report gains `forward_only`; on a forward-only call `sampled_forward_peak` and `sampled_forward_l2` are None, `terminal_copies` is 0, and the observations and the final E and H fields are checked for non-finite values. Admission is unchanged. The new option `ReversibleCPMLOptions(forward_only='never')` (default `'auto'`) records every call as before ([REVERSIBLE_CPML.md](REVERSIBLE_CPML.md#forward-only-calls), this commit).

### Performance

- The validity checks of recorded CPML (finite observations and boundary trace, finite `epsilon >= 1` in both material maps) combine their chunks into one device flag and read it once per tensor instead of once per chunk; every chunk is still checked. A recorded forward of the 96-step test fixture makes 8 scalar reads instead of 21 (`tests/test_reversible_cpml_fast_paths.py`, this commit).
- `SpectralObservation` indexes its E and H observer groups with index tensors built once per observation instead of Python lists converted on every DFT block, in the online accumulation and in the adjoint transpose. The gathered elements and their order are unchanged, so spectra and gradients are bitwise equal; every online-spectrum path uses it, including the plane simulations and recorded CPML (`tests/test_adjoint_spectrum_index.py`, this commit).

### Fixed

- A frequency-plane monitor was built point by point before its sample limit was checked, so a plane of 10**12 points answered 500 on `/api/validate` and `/api/jobs`; the points are counted from the mesh nodes and the request answers 422 (this commit).

### Security

- The workbench server limits the cells of the complex Bloch source sheets to 8,000,000 and the plane points x recorded components over every frequency plane to 12,000,000 (`SERVER_LIMITS` `sheet_cells` and `plane_points`), counted before anything is built where planning starts; the other limits left both open, and a 30000 x 30000-cell Bloch sheet took about 34 GB in `/api/validate` (this commit).
- Under the workbench server the `state_directory` of a design configuration names a subdirectory of `<results>/design-state` with forward slashes; a control character, a backslash, a colon, a leading slash, a component over 255 characters or a name resolving outside answers 422 on every platform, where the server used to read and write the path the client chose (this commit).

## 0.16.1 (2026-09-26)

Patch release: the `torchfdtd` package is identical to 0.16.0 apart from its version string.

### Added

- The drivers and records of a tiled 1 mm x 1 mm SiN metalens: `benchmarks/paper_review/lens1mm/` (the tile driver and the stitching and angular-spectrum propagation) and `docs/validation/paper_review/lens1mm-*` (post widths and the compact record of the run on an RTX 5880 Ada) (38c2086).

### Documentation

- README speed table: Meep at its fastest rank count (4 ranks), a double-precision A100 row, and the FDTDX full-solve and stepping ranges over all four scenes, each recomputed from its record by `tests/test_readme_measurements.py` (dd08d4f).
- Citation of the TorchFDTD paper (arXiv:2609.30039) and the Zenodo version DOI of 0.16.0 (70c7bd7).
- The interim release procedure before 1.0.0 (4443b48).

## 0.16.0 (2026-09-26)

### Behaviour change

- The Python API has no fixed size caps. Resident execution is admitted by memory instead of the 8,000,000-cell limit: `Simulation` and the Auto policy against 75% of the free device memory and 80% of the available host memory for the run's host arrays (80% of the available host memory on the CPU, which `Simulation` now also checks), the adjoint entry points against their reservations, the tensor batch against its `memory_fraction` (0.6 by default, at most 0.9), and `BatchRunner` divides 80% of the available host memory among its CPU workers. Also lifted: 1000 structures, 512 sources, 512 monitors, 100 materials, 64 mesh refinements, 12,000,000 samples per frequency plane, 100,000 steps, 2001 frequency points or custom frequencies, 100,000 samples of a sampled source, and the 1,000,000-vertex default of `GDSLimits` (now `None`; `max_structures` may exceed 1000). Monitors, sources, materials and the step count enter the estimate. Resident execution still refuses a grid whose 3 x cells (6 x for complex fields) reach 2^31, the range of the fused CUDA kernels' signed 32-bit field index, on every backend. A script that relied on an early refusal now runs or fails the memory admission; the workbench server keeps every limit (Security below) ([EXECUTION_MODES.md](EXECUTION_MODES.md#size-limits), this commit).
- Full-autograd reference oracles (`DifferentiableSimulation.reference`, which `StreamedSimulation` and `_ModalSimulation` inherit, `DispersiveSimulation.reference`, `TensorDispersiveSimulation.reference`, `SourceWaveformSimulation.reference`, `ModeInjectedPlaneSimulation.reference`) no longer refuse above a fixed product of two million cell-steps (pole-cell-steps for the ADE oracles). They admit the retained autograd graph by a memory estimate instead: per step one restart state (fields, CPML memories, stored PMC faces, pole banks, at the field element size), the reciprocal and scaled permittivity of every material element, and for ADE the coefficients a, d, 4d and k of every oscillator element (per-cell and per-component parameters included), times a measured factor (tensor ADE counts each operator application), against 80% of free CUDA memory (the smaller of the CUDA runtime and NVML readings) or of available host memory; the graph nodes, a base per step plus 32 KiB per source term, against 80% of available host memory, with the device graph added under Windows, where WDDM commits host memory for device allocations. The Yee and modal oracles refuse permittivity whose dtype differs from the project precision, as the checkpointed path does, and the tensor ADE oracle admits before it validates or packs. The new keyword `graph_budget_bytes` caps the estimate, and a refusal names the estimate, the memory it was compared with and that keyword. The factors bound the peaks measured on CPU and on the RTX 3060, held-out cases with a 10% margin ([validation/oracle_graph_memory.json](validation/oracle_graph_memory.json), `benchmarks/oracle_graph_memory.py`) (this commit).
- `EndpointSimulation`, `EndpointCPMLSimulation` and `EndpointProject` (`endpoint_from_project`) default `tensor_budget_bytes` to None instead of 256 MB, and `EndpointProject` defaults `host_preparation_budget_bytes` to None instead of 64 MB. None derives the budget at every admission for the bytes admitted: 80% of free CUDA memory (the smaller of the CUDA runtime and NVML readings, after releasing unused cache when that makes the payload fit) on CUDA, 80% of available host memory on CPU and for the host preparation budget; a refusal names the derived value and the keyword that overrides it. An integer still overrides it. The budgets only admit a planned payload and set no chunk or checkpoint count; run times with the old and new defaults and the peak against available memory are in [validation/endpoint_budget_defaults.json](validation/endpoint_budget_defaults.json) (`benchmarks/endpoint_budget_defaults.py`) (this commit).

### Added

- Optional user caps: `Region.resident_cell_limit` and `Project.limits` (`max_structures`, `max_sources`, `max_monitors`, `max_materials`, `max_mesh_refinements`, `max_monitor_samples`), `None` by default and written to JSON only when set, so existing projects serialize, hash and load as before; the tiles of `plan_tiles` inherit them (1e51bb2, this commit).
- `scripts/record_platform_g4.py` records a full G4 run on a platform other than the one of the gate evidence (every G4 task's command and the `gpu-nightly` suite) from its JUnit reports into `docs/validation/platforms/g4/<id>.json`, with the reports copied beside it and the gate file untouched; `tests/test_platform_matrix.py` re-parses the copies and fails on a failure, an error, a skip other than an optional platform check, or a G4 required test the record does not name. First platform: WSL2 Ubuntu 22.04 on the RTX 3060 (`rtx3060-wsl2-ubuntu2204` in PLATFORM_MATRIX.md, case `G4-01r2_platform_matrix`) (371341f).

### Changed

- The resident estimate of `backend="cuda"` with `cuda_kernel="fused"` uses a device model calibrated against measured peaks (`docs/validation/resident_memory_fused_3060.json`, which also states the estimate of the 4.33e8-cell RTX 5880 metalens tile) instead of the 200 bytes per cell (FP32) of the tensor-expression bound, so resident admission and the Auto policy accept fused grids that fit; a plane on the fused monitor kernel is counted by its own buffers instead of the Torch-kernel bound. Every estimate adds the source waveforms (`source_waveform_estimated_bytes`); `memory_model` names the model (1e51bb2, this commit).

### Fixed

- CUDA admission (resident, tensor and grouped batches, `BatchRunner`, the Auto policy, propagation, endpoint and oracle budgets) reads the smaller of the CUDA runtime free memory and the device-wide NVML free memory (`torchfdtd.cuda_memory.cuda_mem_info`). Under the Windows WDDM driver `cudaMemGetInfo` of one process ignores the allocations of another: with 2 GiB held by a second process on the RTX 3060 the runtime reading did not drop at all, so admission could accept work into memory another process held (f446a9a).
- On Linux the process I/O deltas of the memory report (`process_io_delta_bytes` of `scratch_disk_written_bytes` and `scratch_disk_read_bytes`) count the bytes passed through read and write calls, `/proc/self/io` `rchar` and `wchar`, as the Windows transfer counters do; they were `read_bytes` and `write_bytes`, storage traffic that counts a page rewritten while dirty once and a cached read not at all, so the written delta of a disk-bank run fell below the bytes the bank files received. Found by the G5-02 test in the WSL2 gpu-nightly run; Windows numbers are unchanged (this commit).
- `scripts/platform_report.py` writes the interpreter path with the home directory replaced by `<user home>`, as the evidence recorder does; a venv under the home directory, as on a Linux host, was written verbatim into the platform record (827acfd).

### Security

- The workbench server applies `SERVER_LIMITS` (8,000,000 resident cells, 1000 structures, 512 sources, 512 monitors, 100 materials, 64 mesh refinements, 12,000,000 samples per frequency plane, 100,000 steps, 2001 frequency points, 100,000 source-signal samples) inside `server_limits()` to every request, job thread and modal worker, whatever caps a submitted project carries, and GDS uploads keep the 1,000,000-vertex limit ([SECURITY.md](SECURITY.md), 1e51bb2, this commit).

## 0.15.0 (2026-09-23)

### Security

- `torchfdtd serve --host` accepts loopback addresses only; a chunked request body answers 411, a malformed `Content-Length` 400, a `NaN` or `Infinity` in a JSON body 422 instead of a server error, and the static file mount rejects drive-letter and UNC paths. Model in [SECURITY.md](SECURITY.md) (4c5a871).
- Third-party notices and an SBOM are generated by `scripts/provenance_inventory.py`, which also scans the tracked tree for credentials and private paths; the workstation account path was redacted from three beyond-VRAM records (5f80df3, 356a923).

### Results change

- Float32 quadrant intensity allocation at DFT field scales: fields and areas are scaled before the ratio, so ratios and gradients that underflowed to zero or non-finite values are now finite and match the FP64 closed form. Affects `quadrant_intensity_allocation` on float32 inputs of order 1e-14 and below; earlier numbers from that path should be re-run (f3efd34, case `G1-03_quadrant_allocation_scaling`).

### Added

- FSP native import: paired Bloch boundaries (saved `BCType` 5) map to native Bloch faces with the phase per period from the saved wavevector in bandstructure or SI units; scripted structure groups import the objects their script last generated as ordinary structures (translated by the group, clipped to the region, never written back); sampled-data materials (type 7) are fitted from their embedded samples over the FSP global source limits (else the union of the enabled source ranges) with the band and the fit residual reported; enabled analysis groups contribute their members as ordinary sources and monitors (stored global coordinates, scripts informational, an error naming the group above the 512-source/monitor limits, never written back) and specified-position point monitors are sampled at the nearest Yee cell with a warning; model scripts, unmapped object classes, disabled groups, disabled unmappable instruments and z-normal 2D frequency planes are listed as warnings instead of blocking the scene, and source limits fall back to the explicit global source range when no ranged source is imported ([FSP_NATIVE.md](FSP_NATIVE.md), this commit).
- Restart journal hardening: every record array carries its SHA-256, dtype, shape and byte count and is verified on every read; one earlier record per kind is kept and a damaged newest record is rolled back to it with the reason named in `report['restart_rollbacks']`; `owner.json` gives a run exclusive ownership with dead-owner takeover; `status.json` distinguishes completed, cancelled, failed and partial runs and `inspect_journal` reads them without owning the journal; renames are write-through (`MoveFileExW` on Windows, directory `fsync` elsewhere) with power-loss durability stated as a separate, unexercised level. `StreamedSimulation(..., cancel=event)` stops at block boundaries with `StreamCancelled` after recording the boundary. `torchfdtd.design_checkpoint.DesignCheckpoint` checkpoints an optimization loop (parameters, Adam state, projection and continuation, generator states, effective waveform, `restart_key` fingerprint) and refuses incomplete or foreign checkpoints by name. `benchmarks/restart_soak.py` and [RESTART_SOAK.md](RESTART_SOAK.md) record the 1e5-step, repeated-run and 100-update soak ([STREAMED_RESTART.md](STREAMED_RESTART.md), this commit).
- Internal validation report, rendered by `scripts/build_validation_report.py` from the gate file, the evidence runs, the platform, clean-install, G3, cross-solver and Meep records, the suite policy and the version strings, with a consistency section that reports version, README-number and support-table mismatches; the verification cells and the new stage-status table of RELEASE_SCOPE.md are rendered from the gate file by the same run, and [validation/known_limitations.json](validation/known_limitations.json) lists the known limitations it prints (this commit).
- Gate tooling hardening from the evidence review: the recorder refuses a JUnit report older than the source commit (`--allow-precommit-junit "<reason>"` stores the fact) and a dirty required test, code path or case file (`--allow-dirty "<reason>"`, failed by the judge); it enumerates file-level `required_tests` with `pytest --collect-only` so a partial run is NOT_RUN, allows `optional platform check:` skips inside them, hashes each task's `watch_paths` (data files the tests read) and records the `fdtd` and `torchfdtd` locations, the original JUnit path and whether the case was committed before the run. The judge re-parses the copied JUnit and its hash, marks changed or new watched files STALE, and warns on runs that predate their commit, unverified declaration order and scope changes (revised cases, limits looser than the program thresholds) without `scope_change_approval`; the validation report lists those warnings and pending approvals (this commit).
- `scripts/rerecord_gates.py` re-records every replayable gate task on one commit from its newest evidence (command, environment prefix, case file, scope) and, with `--wheel`, with the installed wheel from a fresh `.local/venvs/rc` environment; `scripts/record_gate_evidence.py --interpreter` records the environment of that interpreter and `--platform` the host's platform id, which the report uses to list the G4 evidence per platform record. The release-candidate run, including the regeneration of the notices and SBOM before the wheel is built, is written down in RELEASE_PROCEDURE.md (this commit).
- Validation warns when an enabled dispersive (Drude/Lorentz/multipole) structure reaches a PML layer while `pml_dispersion='ade'`: `/api/validate` and the run summary printed by `torchfdtd run` carry a warning that names the structures and the faces and suggests `pml_dispersion='frozen'` or ending the structure before the PML (`torchfdtd/stability_checks.py`, wired through the server and the CLI only; `Simulation.run` and `estimate()` are unchanged). Nothing is rejected (this commit).
- `benchmarks/stability_sweep.py`: a 20,000-step field-energy stability matrix (vacuum, n=3.5, Drude, two-pole Lorentz and Drude-metal slabs crossing the lateral PML with `ade` and `frozen`, the documented 20 nm SiN post array, admitted and rejected tensor media in CPML, PEC/PMC walls, Bloch at 30 degrees, graded mesh, subpixel, four CPML profiles, sheet/one-way/TFSF sources, the reversible, streamed and tensor-batch forwards, and CUDA float32 fused rows) declared in `docs/validation/cases/STABILITY_SWEEP.json`, recorded in `docs/validation/stability_sweep_3060.json` and rendered in [STABILITY_SWEEP.md](STABILITY_SWEEP.md); `tests/test_stability_sweep.py` re-derives every verdict from the samples (this commit).
- `benchmarks/adjoint_leak_soak.py`: 150 forward+backward+Adam iterations of the checkpointed (fused and torch backward), plane, reversible, dispersive, tensor-table, streamed host-bank and source-waveform adjoints, sampling device, CuPy, RSS, private, gc-object, live-tensor, CUDA-graph, cache and state-holder counts, declared in `docs/validation/cases/ADJOINT_LEAK_SOAK.json`, recorded in `docs/validation/adjoint_leak_soak_3060.json` and rendered in [ADJOINT_LEAK_SOAK.md](ADJOINT_LEAK_SOAK.md) with a statement of every module-level container of the package. No path retains device memory, tensors, cache entries or solver objects per iteration; three paths are recorded as failing the 2 MiB host allowance by a single one-time step (2.0 to 31.8 MiB) that is flat afterwards. `tests/test_adjoint_leak_soak.py` adds 30-iteration CPU regressions of all seven differentiable families (this commit).
- `DifferentiablePlaneSimulation` builds its observer table with vectorised NumPy unique/inverse maps instead of a Python loop over every interpolation index; a 1050x1050-point plane with six components previously took more than ten minutes of single-core setup while the GPU idled. Observer numbering (first occurrence per component) and results are unchanged (this commit).
- Chunked HDF5 result files: `Result.save(path, format='hdf5')` (or a `.h5` path) writes the NPZ members as chunked datasets, one frame, one field component per x plane and one frequency and component of a plane monitor per chunk, with complex arrays, mesh coordinates and units; `Result.open(path)` reads frames, plane slices, point spectra and plane-monitor components without loading the volume, and `Result.load` reads a `.h5` file whole. Optional extra `torchfdtd[hdf5]` (h5py); HDF5 was chosen over Zarr, see `torchfdtd/result_store.py`. Layout in [COMPATIBILITY.md](COMPATIBILITY.md) (this commit).
- Project JSON version fields `revision` (edit counter) and `content_sha256` (content hash), `Project.content_hash`, `stamped` and `content_matches`; `/api/validate` returns `revision`, `content_sha256` and `stored_content_sha256_matches`, and a job carries the `plan_hash` and `revision` of the project it ran (this commit).
- Workbench editing: Ctrl+click multi-selection with Duplicate all, Copy (Ctrl+C), Paste (Ctrl+V) and Delete all; numeric fields refuse non-finite and out-of-range values with a message under the field, a toast and a log line while the project keeps its value; the project title shows the revision; a reloaded page reports the recovered autosaved project and its revision; results of the last run stay listed after Layout and are marked stale, in the results tree and in the field visualizer, whenever the current project's plan hash from `/api/validate` differs from the run's (this commit).
- Workbench GDS export: the Export GDS dialog writes the enabled rectangles and polygons to one cell through `POST /api/gds/export` and downloads the layer-stack sidecar next to the file (this commit).
- Browser journeys `tests/ui/g8-journey.spec.js` (GDS import to exports on a CPU-only server) and `tests/ui/g8-editing.spec.js` (six editing behaviours), recorded by `scripts/run_workbench_journeys.py` into `docs/validation/workbench/` and checked by `tests/test_workbench_journeys.py` (this commit).
- Material import workflow `import_material_table`: a raw n/k or permittivity table is hashed into `MaterialProvenance` (source, licence, SHA-256, file, columns, unit, date) on the `Material`, fitted with the existing passive fitter over the declared band, and reported with its residual, the ADE n/k error at a timestep (`discretization_report`) and the extrapolation warning `MaterialBandWarning` shared with the estimate (`fit_band_extrapolation`); the workbench materials dialog gains source and licence inputs, `/api/materials/provenance`, and a provenance and fitted-band panel showing the discretization error and the validation's band warnings; the project JSON keeps the provenance (this commit).
- Source preview reports the polarization vector, the source cells with their amplitude and Bloch spatial phase per axis, the effective bandwidth (1 percent of the peak amplitude, declared) and the incidence definition: every oblique source is fixed k_parallel with the angle range across the band, and a fixed-angle request is refused with the registry message of the new `incidence` block of `torchfdtd.capabilities` (`preview_source(..., incidence=...)`, `?incidence=` on the preview route, an incidence selector and a spatial-phase tab in the source dialog) (this commit).
- `torchfdtd.results`: `ResultRecord` with units, calibration, validity and reasons; `reflection_transmission` (R, T, A from a closed box or `not measured`, `1 - R - T` as a balance), `s_parameters` (phase and group delay from a mode-port sweep), `mode_decomposition`, `diffraction_record`, `farfield_record`, `nearzone_record`; [RESULTS.md](RESULTS.md) (this commit).
- Numerical guards: `guarded_ratio` refuses or flags zero and weak references, reference backflow, backflow through a monitor and non-finite input with a reason; `normalize_flux` and `/api/jobs/{key}/normalize-flux` return `reasons`; evanescent orders, orders at cutoff, phases without magnitude support, unresolved phase steps and too few frequencies for a group delay are named in the records; the table of paths, thresholds and tests is [NUMERICAL_GUARDS.md](NUMERICAL_GUARDS.md) (this commit).
- Per-port mode diagnostics `torchfdtd.ports`: mode tracking across a wavelength band by overlap matching with a reported minimum overlap, the normalization convention as data, reference-plane shifts and S-matrix de-embedding with the mode's own propagation constant, forward/backward separation on a plane, degenerate clusters with the overlap matrix, confinement factors with a weak-mode warning, and `FixedPortSectionError` for a port section that carries a Torch graph. Document [PORTS.md](PORTS.md) (this commit).
- Minimal high-level design interface `DesignProblem` with `Continuation`: objective, parameterization, optimizer step, history, checkpoint and bitwise-reproducible resume, fabrication checks, binary export as structures and GDS, re-import and final evaluation at a finer mesh with the thresholding, smoothing and GDS differences recorded; `bounded_density_layer` for a design box inside a fixed epsilon; morphological `measure_feature_sizes`, `fabrication_perturbation` and `binary_structures` in `torchfdtd.fabrication`; the examples `design_metagrating.py` and `design_mode_coupler.py` with their three-start records in [DESIGN_WORKFLOW.md](DESIGN_WORKFLOW.md) (this commit).
- `Region.pml_dispersion = 'frozen'` removes the Drude/Lorentz pole (ADE) update from PML cells and gives them the real permittivity at the source centre frequency, for the resident CPU/CUDA solvers and `run_tensor_batch`. Pole cells in the outer, high-conductivity part of the CPML diverge after about 1500 steps on grids larger than a few micrometres, and neither a CFS `alpha` profile nor freezing the wall layer alone prevents it; the default `'ade'` is unchanged and the differentiable/streamed solvers reject `'frozen'`. Evidence and limits in [BOUNDARIES.md](BOUNDARIES.md#dispersive-materials-inside-pml) (this commit).
- Same-hardware comparison of TorchFDTD with Meep 1.34 and FDTDX 0.6.2 on one RTX 3060 workstation, with drivers, fixtures, records and [CROSS_SOLVER_COMPARISON.md](CROSS_SOLVER_COMPARISON.md) (fa57986), and its ratios in the README table, the manuscript and the FDTDX parity document (this commit).
- Three worked comparisons with Meep 1.34.0 (microring resonator, 2D ridge and 3D pillar metalens, metagrating with an RCWA oracle) under `examples/meep_comparison/`, each with a shared geometry file, pre-declared criteria, records, a figure rendered from the records and a test; `scripts/render_meep_comparison.py` renders [MEEP_COMPARISON.md](MEEP_COMPARISON.md) and the README "Compared with Meep" block from the records (this commit).
- Angular-spectrum propagation of a recorded output plane into sections, volumes and points with a shared transfer function and first-order gradients: `plane_spectrum`, `propagate_section`, `propagate_volume`, `propagate_points`; `propagate_plane` now delegates to it (8283506).
- Tiled approximate execution mode in the workbench and an execution-modes README section (f09ec94).
- Overlapping-tile decomposition with near-field stitching, angular-spectrum propagation and a tiled plane adjoint: `plan_tiles`, `run_tiled`, `stitch_planes`, `propagate_plane`, `TiledPlaneSimulation` (c10175b).
- Workbench execution modes with a GPU switch and automatic streaming selection (b93b2f6).
- Completion program adopted as the specification of record with a machine-readable gate file, release scope, pre-declared cases, an evidence recorder and a judge (14f02fd, 76c549e, 79597c5).
- Tensor pole strengths whose lowest eigenvalue is rounding noise are admitted (86bcec4).
- Tensor poles entering CPML require proportional axis-aligned dispersion (cfc1569).
- Full-tensor media streamed through X slabs with a doubled halo (c15fba1).
- Full-tensor trapezoidal ADE with an explicit transpose and material VJP (e98456d).
- Tensors admitted into CPML only under the geometric PML stability criterion (65cbb87).
- PEC wall closure and tensor media extending into CPML (f65815d).
- ADE polarization banks carried on stored PMC/symmetric faces (bee7d1d).
- PMC/symmetric faces admitted in the Yee adjoint, streamed and tensor-batch paths (2a7a3e5).
- N-port aperture mode networks, streamed modal injection and a full-autograd modal oracle (1951bbe, 580c03a).
- Differentiable polygon and spline solids with a recorded shape-gradient convergence (3cbebb4).
- Per-frequency exteriors and k-space observation directions for the far field (e59a726).
- Canonical polarization basis for degenerate waveguide modes (06d54eb).
- Lossy exterior and open-surface projection modes (2e6efd8).
- Polygon holes in the browser CAD and GDS etch pairs (6b072e7).
- Tapered GDS sidewalls staircased per native z slice (b750d3e).
- GDS polygons with holes, layer etch subtraction and one-call two-port networks (bf9978c).
- Finite-distance near-zone projection, observation grids and TFSF admission (ed87202).
- Durable restart journal for streamed adjoints with a contract check and per-phase pointer files (4dc3024).
- Measured file-bank and dense-parameter host memory reservations for streamed adjoints (98029a3).
- Metadata-only streamed work planner (815db6f).
- Checkpointed material and soft-source waveform adjoints (2bc2ada).
- Stored six-face radiation connected to Python NPZ and browser workflows (9ec5173).
- Native CAD mode networks in Python and browser workflows (8c11f05).
- Fixed open CPML mode ports and material adjoints (874c32b).
- Recorded CPML adjoints connected to the periodic design API and UI (ed7e8f5).
- Async Bloch CPML reconstruction and online spectral planes (23b71ab).
- Recorded-interface CPML reconstruction with bounded admission (ef1b158).
- Scoped periodic reversible adjoint with memory admission (282a13a).
- Native tensor materials in the GUI and in differentiable projects (d942f2f).
- Unequal fixed ports and native PMC CPML workflows (f355601).
- Mixed PMC CPML adjoints and stored-field diffraction workflows (b68bb0b).
- GDS mode ports (99c61c7).
- Native PMC workflows and tensor CPML with bounded gradients (6fa0c35).
- Opposing multimode networks, a PMC project adapter and a distributed launcher (ec3a28f).
- Checkpointed PMC and tensor APIs and a distributed slab foundation (887694a).
- Validated GDS, density, modal and radiation workflows (d2a4092).
- Streamed periodic density materials, vector ports and PMC foundations (d88c9a8).
- Streamed parameterized materials and exact PEC boundaries (5b2c35e).
- Bounded geometry VJP for tensor-valued analytic solids (dd1eb4b).
- Periodic inverse-design workbench with matched GPU measurements (d123966).
- Exact periodic responses reused with seeded density gradients; periodic memory tiers selected without calibration solves (71f8242, 398effd).
- Restartable full-schedule periodic density optimization (a708ab3).
- Periodic density design connected to budgeted hierarchical adjoints (dc5edd3).
- Bounded dense real adjoint observation kernels with indexed groups (f47cae9).
- Budgeted shared adjoint case replay (bf28a6a).
- Fixed-plane adjoint execution selection (642f972).
- Fused resident memory planning from array ownership; resident adjoints admitted by explicit byte budgets before field allocation (5e396ff, d16579f, 2a8d698).
- Resident and streamed adjoints selected with measured policies and bounded transfer budgets (780d0aa).
- One-cell Yee dependency cone for lossless streamed halos (d4dd7c2).
- Dispersive streaming selections and material-aware policy calibration (981b0c3, 7781699).
- Dispersive material states and adjoints streamed through bounded CUDA slabs; fused resident dispersive CUDA adjoints (d77e958, 3e06b66).
- Checkpointed dispersive material adjoints and spectral plane objectives (d94e784, b4a2059).
- Spectral memory planning in the geometry optimization example (cad8db0).
- Admitted DRAM or disk storage selected without domain allocation; allocation-free streamed memory admission (80f85a1, 37cd382).
- Complex streamed checkpoint and spectral gradients; fused complex CUDA slabs with asynchronous staging (722720d, 149ee26).
- Fused complex Bloch forward updates and complex adjoints (2b3e7ba, d9ad2b9).
- Fixed spectral references cached within a CPU budget (fd59931).
- Bounded spectral pupil FDTD replay connected to information objectives (31d17a5).
- Pixel-origin controls for periodic density seeds (aa591f9).
- Spectral electron conversion connected to exposure-weighted target information (4d0b32e).
- Coherent spectral polarization calibration (d6363ee).
- Differentiable detector intensity allocation with fixed midpoint quadrature (b0a92a1).
- Sequential recomputed case VJPs for coupled design objectives (fe5249f).
- Resident complex Bloch discrete adjoint (70e5cd7).
- Differentiable joint target information (315ac53).
- Differentiable spectral planes and reference-normalized power (961abc8).
- Bounded online spectral observations and a discrete transpose (954f357).
- Lossless file-backed spatial adjoint state banks (e12da1f).
- Compact streamed host initialization (894dfef).
- Streamed policies calibrated on whole temporal blocks; local adjoint replay bounded with budgeted tile checkpoints; streamed replay costs modelled (d6892a9, c61fea4, caec62f).
- Slab buffer reuse and asynchronous streaming policy tuning (d061561).
- Fused adjoint and DRAM space-time slab differentiation (7ea5cb4).
- Bounded Torch adjoint and hierarchical checkpoint prototype (3bfc8ce).
- Experimental dielectric subpixel interfaces (88d1de7).
- Passive optical-data fitting of Drude and Lorentz poles from pasted samples (b61af1b).
- Experimental Python and CUDA FDTD workbench: Yee/CPML solver on the fdtd grid, browser CAD, job API and NPZ results (3301e38).

### Changed

- Projects hold up to 512 sources and 512 monitors instead of 32; point traces and their spectra now enter the resident estimate (`point_trace_estimated_bytes` in `/api/validate`), so a run whose trace storage exceeds the device or host budget is refused by the admission check instead of the count ([MONITORS.md](MONITORS.md), this commit).
- Stored frames must resolve the carrier: `/api/validate` returns `snapshot` (stored frames per optical period of the shortest source wavelength, the effective interval under the 100-frame cap) with a warning below four frames per period, the region panel shows the number next to "snapshot every" and warns that the playback will look like backward motion, the field visualizer marks aliased frames, and the examples store a frame every 5 steps (3 for the PMC cavity) instead of 20 (this commit).
- The cylinder example launches a one-way sheet toward +x (periodic in y) instead of a soft sheet whose backward half ran into the left PML, and the waveguide example is excited by a soft sheet across the guide cross-section instead of a point source (the Project schema has no eigenmode source, so the launch stays bidirectional); the layout views draw a propagation arrow on every plane source, one way for one-way planes and both ways for soft sheets (this commit).
- Every object in the workbench can be deleted where it is shown: a Delete button next to Duplicate in the property panel of a structure, source or monitor, and a trash button on each tree row (visible on hover or keyboard focus); both run the same undoable action as the ribbon tool, so Ctrl+Z restores the object and results become stale (this commit).
- The workbench's automatic memory policy is resident, then DRAM banks, then the approximate tiles only when the new `Region.tiling.allow_approximate` consent is set for a planar device, then a refusal naming the options; disk streaming stays available as the explicit `streamed_disk` mode (1.9 to 2.4 times the DRAM time in the records) but Auto never selects it, and `/api/validate` reports the rungs it walked ([EXECUTION_MODES.md](EXECUTION_MODES.md), this commit).
- Restart journal layout: `meta.json` array descriptions gained `file` and `sha256`, pointers gained `previous`, and `owner.json` and `status.json` were added; journals written before this change are rejected by the runtime contract as before, and the previous record of a kind is now kept until the next one is published, within the unchanged reservation (this commit).
- The workbench's Layout button no longer clears the results of the last run; they stay visible and are marked stale as soon as the project plan differs from the run (this commit).
- Project JSON files written by the workbench or `Project.stamped` carry `revision` and `content_sha256`; builds before this commit refuse those keys (schema 1 keeps its number because a file without them loads unchanged) (this commit).
- Project and distribution renamed from PhotonWeave to TorchFDTD; `PHOTONWEAVE_*` environment names remain accepted during migration (377eb04).
- Dispatch-time PMC rejections are returned as 422 instead of a server fault; the PMC demo cavity keeps a short PML (f6aacf3).
- The plane solver stays on the planned auto mesh and planes are signed by realized nodes (832e6e1).
- Open-ended source slices count as the full axis in the tensor-batch face admission (a879e1b).
- The 2D PMC rejection is restored and four boundary tests align with the admission (232f4c6).
- README replaced with a concise overview; the measurement record moved to docs (37352e6).
- The quick start runs the measured 3D fused path and the two beyond-VRAM rows are separated (ca79616).
- Periodic inverse design defaults to a single FP32 path (355fa2a).
- Colour-router application runs are deferred behind simulator completion (d5b0fce).
- `psutil` is part of the `dev` extra (c0de6cf).
- The private research directory is ignored so evidence records see a clean tree (1be01cc).

### Fixed

- The validation report no longer depends on its own gate (G9-07): that task is shown without its run and judgement and is judged after the render, so recording it leaves the committed report consistent (this commit).
- Restore the metagrating resume test that an earlier edit had folded into the pickled-state refusal test; the release-candidate judge found it absent from the required tests (this commit).
- The test suite runs against an installed wheel as well as the checkout: the repository-only packages are appended to the path after the installed package is imported, and the SBOM check treats another interpreter environment on the same platform with the portable comparison (this commit).
- The evidence recorder no longer refuses a run whose own command writes a measurement record (a `TORCHFDTD_*_RECORD` prefix); those files are outputs of the run, are excluded from the dirty guard and are hashed with the evidence (this commit).
- The propagated beyond-VRAM driver runs its finite-difference forwards in child processes, because the parent keeps its heap high-water mark after the backward and the operating system counts it as used memory, which failed the in-process forwards' host admission on a tight host (`--fd-in-process` keeps the old behaviour) (this commit).
- The streamed backward counts the forward's retained host banks of the same run as available when it admits its reservation, so a run whose forward was admitted no longer fails at the backward on a host where those banks left less free memory than the reservation (this commit).
- `DesignCheckpoint.load` and `DesignProblem.load` read their files with `torch.load(..., weights_only=True)` instead of an unrestricted unpickle: the checkpoint stores the NumPy generator key as a tensor so both files hold tensors and plain containers only, and a file that carries any other pickled object is refused with `ValueError` before anything in it runs; a `checkpoint.pt` written before this change carries a NumPy array in its generator state and is refused the same way (remove it to start the loop over), while earlier `DesignProblem` state files load unchanged (this commit).
- `Region.pml_dispersion` enters the plan's `exterior` section, so the frozen and ADE absorber updates no longer share a plan hash, reference, cache or restart key (this commit).
- `pml_dispersion='frozen'` refuses a dispersive material inside the PML whose real permittivity at the reference frequency is not positive, naming the material, the frequency and the value, instead of clamping to 1e-3 and diverging (this commit).
- The capability registry checks the tensor material before complex fields for the tensor batch and lets tensor materials with Bloch faces reach `run_tensor` under the fused kernel choice, as the code does (this commit).
- `ReversibleSimulation`, `ReversibleCPMLSimulation`, `TensorDielectricSimulation`, `ModeNetwork` and `run_endpoint` apply the resident contract (byte budget or the eight-million-cell guard) at construction or dispatch, before any allocation, since Region validation applies it only to `execution_mode='resident'` (this commit).
- The streamed restart journal hashes the scene through the identity field selection of `torchfdtd.identity`, so a workbench save (revision, content hash, placement, labels) between an interruption and the resume no longer refuses the journal (this commit).
- `scripts/run_readme_examples.py` records a block timeout as a failed block with the captured output instead of dying on the text-mode output (this commit).
- `torchfdtd doctor` probes every installed `cupy*` distribution and reports its import failure as an error; the "not installed" notice is kept only when no CuPy distribution exists (this commit).
- The execution preflight reports `memory_mode='budgeted'` as the dispatch refusal it would be, `/api/validate` shows the error and `/api/jobs` refuses a scene the preflight rejects with 422 instead of queuing a job that fails at dispatch (this commit).
- The provenance scan decodes JSON `\uXXXX` and percent-encoded paths before matching and recognises drive-less, UNC administrative-share and macOS home forms of the private user paths (this commit).
- `/api/health` and `torchfdtd hardware` report CPU execution when torch says CUDA is available but no device is visible (`CUDA_VISIBLE_DEVICES=""`), instead of failing on the device query (this commit).
- The README "Compared with Meep" block renders the solver precisions and the Meep rank count from the records instead of fixed strings; the tests refuse a rank or precision token that is not a record value (this commit).
- The server's `Host` allowlist is the loopback names only; the test suite admits `testserver` through `TORCHFDTD_ALLOWED_HOSTS` from `tests/conftest.py` (this commit).
- The run-control settings the automatic shutoff reads enter the plan's `time` section, so `auto_shutoff` and its decay settings change the plan hash and every identity key; the divergence checks stay outside (this commit).
- `ResultFile` closes the HDF5 handle when a metadata attribute fails to parse after the format check (this commit).
- The metagrating and metalens comparison scripts import torchfdtd from the checkout that holds them, as the microring script does, and exit with the imported path named instead of a bare assertion (this commit).
- Plane fingerprints split; the solver time base and Yee positions are checked (c05d0ff).
- Pre-existing geometry gradients compared at round-off tolerance instead of bitwise (b12fb6d).
- Torch default dtype restored after the PEC boundary tests and after the CUDA subpixel lifetime test (da848f7, 50fa68b).
- Existing journal records count toward the reservation on a beyond-VRAM resume (c5e83c8).
- Streamed-density configuration snapshots restored (17fd8fa).
- Mixed tensor dtypes preserved in internal tile transport (0c72990).
- Complex disk states preserved and field storage accounted (9e57f0a).
- Fused Bloch CI contract and complex tuning reservation updated (db4b0f1).

### Performance

- Adjoint file reads reduced (dd61307).
- Lossless tile packets reused in bounded host and CUDA staging pools (2b1b99f).
- Mesh strides reused during dense adjoint observation preparation (b7fbf64).
- Only owned endpoint adjoints transferred to CUDA tiles (eba6010).
- Intermediate gathers avoided for contiguous slab packets (7807342).
- Identity Bloch transforms skipped on interior slabs (692a6e5).
- CUDA admission rechecked after releasing the unused allocator cache (45d9e5c).
