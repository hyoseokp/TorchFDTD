# Release scope by profile

For v1.1.3, patch validation covers fixed observation-table reuse and its
related regressions. The [1.1.3 validation scope](RELEASE113_VALIDATION.md)
records completed checks and omitted full-suite work. It does not claim
a new complete WORKSTATION or G9-06 pass.

For v1.1.2, the owner selected patch validation covering the changed code.
The [1.1.2 validation scope](RELEASE112_VALIDATION.md) records completed
checks and omitted full-suite work. It does not claim a new complete
WORKSTATION or G9-06 pass.

Adopted 21 September 2026 at commit f3efd34 as part of stage G0. This document states what each
release profile claims to support, and separates two columns that earlier
documents mixed: **implemented** means the code path exists and has its own
development record, **verified for release** means a gate task in
[validation/completion_gates.json](validation/completion_gates.json) holds
evidence recorded by `scripts/record_gate_evidence.py` and accepted by
`scripts/check_release_gates.py`. At adoption every verification cell was
NOT_RUN; the cells that start with a state name and the stage-status table
below are rendered from the gate file by `scripts/build_validation_report.py`
(a cell lists its task ids; `tests/test_validation_report.py` fails when a cell
or the table drifts from the gate file). An implemented row is not a released
row.

The rows are derived from
[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md),
[STREAMED_FDTD.md](STREAMED_FDTD.md), [BOUNDARIES.md](BOUNDARIES.md) and
[ACCEPTANCE.md](ACCEPTANCE.md). Where those documents record a rejection, the
rejection is part of the supported contract, not a defect. Nothing here is a
claim of vendor equivalence or a legal clearance.

## Profiles

| Profile | Definition | Required stages | Status at adoption |
| --- | --- | --- | --- |
| WORKSTATION | One declared CPU/NVIDIA GPU host: forward, Torch inverse design, verified VRAM/DRAM/disk execution, browser and Python workflows, save/restart, packaged wheel | G0 to G9 | NOT_RUN: no gate task verified yet |
| HPC | WORKSTATION plus single-problem multi-GPU forward, adjoint and scaling on two or more real GPUs | G0 to G9 and H1 | **BLOCKED_EXTERNAL**: no host with two NVIDIA GPUs is available to this program. The local machine has one RTX 3060 and the remote workstation one RTX 5880 Ada; the NCCL two-rank case skips on both. CPU Gloo ranks do not count. H1-02 to H1-06 carry this blocker in the gate file |

Passing WORKSTATION is never reported as HPC completion or as a replacement of
every function of another solver. Batches of independent cases across GPUs are
not domain decomposition.

## Physics (WORKSTATION)

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Grids | 3D and 2D Yee grids; uniform, graded and rectilinear meshes with independent dx/dy/dz and explicit node API ([MESH.md](MESH.md), [RECTILINEAR_MESH.md](RECTILINEAR_MESH.md)). The invariant 2D axis has no boundary | VERIFIED (G2-01, G3-01, G3-13) |
| Materials | Constant-index dielectrics; multi-pole Drude/Lorentz ADE with passive fitting ([MATERIALS.md](MATERIALS.md), [MATERIAL_FITTING.md](MATERIAL_FITTING.md)); node-sampled SPD anisotropic tensors in bulk, inside CPML under the geometric stability admission, with PEC walls and trapezoidal tensor ADE; subpixel interfaces for lossless curved dielectrics and, with the dispersive node averaging tensor, for curved Drude, Lorentz and multipole surfaces ([SUBPIXEL_INTERFACES.md](SUBPIXEL_INTERFACES.md), [dispersive interfaces](SUBPIXEL_INTERFACES.md#dispersive-interfaces)). Rejected: rotated or mid-axis tensors inside PML, subpixel interfaces next to PEC/PMC walls, fused tensor kernels; for dispersive subpixel interfaces, a dispersive surface within one averaging window (two cells) of a nonperiodic grid boundary (a metal film or waveguide that runs into the PML needs staircase interfaces), two dispersive materials within one window, `pml_dispersion="frozen"`, and soft E sources, TFSF faces or one-way planes on the D-driven samples. Known limitation (G3-05, [PHYSICS_VALIDATION.md](PHYSICS_VALIDATION.md)): a staircased Drude sphere at 4 to 10 cells per radius misses its scattering and absorption budgets at every recorded mesh. The dispersive subpixel interfaces were developed on that fixture and are judged on the held-out revision G3-05r5 | VERIFIED (G3-02, G3-03, G3-04, G3-05, G3-12, G3-13, G6-01) |
| Boundaries | Per-face CPML with independent profiles; periodic and fixed-phase Bloch pairs (not BFAST); PEC/antisymmetric faces; PMC/symmetric faces as a closed cavity in the ordinary forward solver and next to CPML in the differentiable, dispersive, streamed and tensor-batch paths ([BOUNDARIES.md](BOUNDARIES.md)). Rejected: 2D PMC, PMC with periodic/Bloch mixing, PMC in the fused CUDA backward/ADE kernels | VERIFIED (G3-06, G3-07, G3-08) |
| Sources | Point, sheet/plane, one-way, TFSF, dipole and fixed-eigenmode sources; soft E/H waveform parameters differentiable ([SOURCES.md](SOURCES.md), [TFSF_SOURCES.md](TFSF_SOURCES.md), [MODE_INJECTION.md](MODE_INJECTION.md), [DIFFERENTIABLE_SOURCES.md](DIFFERENTIABLE_SOURCES.md)). The Bloch phase is fixed across the spectrum | VERIFIED (G2-05, G6-02) |
| Monitors and analysis | Point time traces, selective plane DFT spectra, two-port and N-port mode networks with complex S, closed-box far field, finite-distance near zone, Bloch diffraction orders ([MONITORS.md](MONITORS.md), [OPEN_MODE_PORTS.md](OPEN_MODE_PORTS.md), [RADIATION.md](RADIATION.md), [FARFIELD_WORKFLOW.md](FARFIELD_WORKFLOW.md)). Remaining: trapezoidal quadrature, layered exteriors, off-axis port normals | VERIFIED (G3-09, G3-10, G3-11, G6-03, G6-04) |

## Platforms (WORKSTATION)

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Operating systems | Windows 11 (local development host and the RTX 5880 workstation); Linux for the CPU CI job and the FDTDX matched fixture ([FDTDX_MATCHED_CORRECTNESS.md](FDTDX_MATCHED_CORRECTNESS.md)). macOS is documented for CPU install only and has no test record | VERIFIED (G4-01, G8-06, G8-07) |
| Python and dependencies | Python 3.10 or newer (3.10.2 local, 3.11 CI, 3.12.7 trial); torch 2.4 or newer (2.4.1+cpu, 2.14.0+cpu and 2.10.0+cu126 installed and run; 2.2 and 2.3 fail with NumPy 2, see [INSTALL.md](INSTALL.md)); numpy, scipy, fastapi, uvicorn, pydantic per `pyproject.toml`; CuPy `cupy-cuda12x` 13.6 for the fused kernels and the real-field CUDA adjoint; gdstk for GDS. The tried versions and the untried ones are listed in [INSTALL.md](INSTALL.md) | VERIFIED (G8-06) |
| GPUs actually exercised | RTX 3060 12 GB (local) and RTX 5880 Ada 48 GB (remote), CUDA 12.6 runtime. Full suites passed on the RTX 3060 at 1ad9166 with 2,181 passes and 7 skips and on the RTX 5880 at a879e1b with 2,141 passes and 7 skips ([ACCEPTANCE.md](ACCEPTANCE.md)); those runs predate the gate file and are not gate evidence | VERIFIED (G4-01, G4-02, G4-03, G4-04, G4-05) |
| Execution backends | CPU/Torch; CUDA Torch kernel; fused CUDA kernels with CUDA Graphs; FP32/FP64; real and complex fields; nondefault streams ([COMPLEX_CUDA.md](COMPLEX_CUDA.md), [CUDA_SPECTRA.md](CUDA_SPECTRA.md)). CPU fallback when CuPy is absent is printed, not hidden (G1-06) | VERIFIED (G4-02, G4-03, G4-04) |
| Continuous integration | Linux CPU PR suite plus browser tests and a wheel build (`.github/workflows/test.yml`). No GPU runner; public-fork code is never run on a personal GPU host | VERIFIED (G4-05, G4-06) |

## Inputs and outputs (WORKSTATION)

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Project model | One `Project` JSON shared by the browser CAD and Python; CLI `torchfdtd serve` on loopback only | VERIFIED (G8-01, G8-03, G9-01) |
| Results | NPZ fields and monitors, JSON/CSV monitor export, browser field viewer; complex fields kept in NPZ ([BOUNDARIES.md](BOUNDARIES.md)). No chunked/lazy large-result format has been chosen yet | VERIFIED (G8-01, G8-02) |
| GDS | Import and export with layers/datatypes, units, hierarchy, arrays, PATH, even-odd holes, layer etch, z-node sidewall staircase, port markers and N-port builders ([GDS.md](GDS.md), [GDS_MODE_PORTS.md](GDS_MODE_PORTS.md)). Rejected: holes touching the outline at a vertex, nested holes | VERIFIED (G6-07, G7-03) |
| FSP | Independent read and writeback of a documented layout subset ([FSP.md](FSP.md)); general FSP compatibility is not claimed and the provenance question stays open | Not a gate row; distribution decision pending (G9-03) |
| Packaging | Wheel built from a fresh staging directory with the browser assets included (`scripts/build_preview.py`); `cuda-kernels`, `gds`, `dev` extras | VERIFIED (G8-05, G8-07, G9-06) |

## Differentiation (WORKSTATION)

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Parameters | Dielectric epsilon, fixed-Bloch, CPML, ADE, PEC/PMC faces including face ADE banks, density with filter/projection/beta continuation/symmetry/mask, box/ellipsoid/cylinder and polygon/spline shape parameters, tensor media, resident soft E/H source waveforms ([DIFFERENTIABLE_FDTD.md](DIFFERENTIABLE_FDTD.md), [DESIGN_PARAMETERIZATION.md](DESIGN_PARAMETERIZATION.md), [SHAPE_GRADIENTS.md](SHAPE_GRADIENTS.md)) | VERIFIED (G3-14, G3-15, G3-16, G6-05, G6-06) |
| Objectives | Point signals, plane spectra, N-port \|S_ij\|², far field, near zone, target information ([TARGET_INFORMATION.md](TARGET_INFORMATION.md)) | VERIFIED (G3-15, G6-03) |
| Adjoint modes | Checkpointed adjoints; reversible adjoints for lossless periodic and fixed-exterior CPML APIs ([REVERSIBLE_ADJOINT.md](REVERSIBLE_ADJOINT.md), [REVERSIBLE_CPML.md](REVERSIBLE_CPML.md)); streamed and tensor-batch adjoints | VERIFIED (G3-14, G5-01) |
| Excluded from both profiles | Eigenmode and source-position derivatives, hole-vertex derivatives, second derivatives, fused CUDA adjoint kernels for PMC faces and tensors (the Torch transpose path runs instead), differentiation through geometry-dependent mesh regeneration (G1-01) | Not claimed |

## Capacity (WORKSTATION)

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Resident | Whole problem in VRAM with measured allocation planning ([RESIDENT_ALLOCATION_MODEL.md](RESIDENT_ALLOCATION_MODEL.md), [CUDA_CACHE_ADMISSION.md](CUDA_CACHE_ADMISSION.md)) | VERIFIED (G5-02, G5-03) |
| Streamed | DRAM and NVMe space-time tiles with a causal halo, async staging, direct geometry/density slab generation without a global epsilon or VJP ([STREAMED_FDTD.md](STREAMED_FDTD.md), [STREAMED_WORK_PLANNING.md](STREAMED_WORK_PLANNING.md), [streamed_geometry.md](streamed_geometry.md)). Memory tiers of the workbench policy: resident, then DRAM banks, then the approximate tiles only with the project's consent, then a refusal that names the options; NVMe banks are an explicit opt-in that Auto never selects because they ran 1.9 to 2.4 times slower than DRAM banks ([EXECUTION_MODES.md](EXECUTION_MODES.md)) | VERIFIED (G5-01, G5-04) |
| Beyond VRAM | Ten-step capacity gates only: 2.42 billion cells with 54 GiB of FP32 E/H and a full material gradient, and a 2.26 billion cell crash-and-resume run, both on the RTX 5880 ([BEYOND_VRAM_FP32.md](BEYOND_VRAM_FP32.md), [BEYOND_VRAM_RESTART.md](BEYOND_VRAM_RESTART.md)). A meaningful physical-duration case is still required and is not replaced by these gates; the pillar-lens case is declared ([cases/G5-05.json](validation/cases/G5-05.json), [G5-06.json](validation/cases/G5-06.json)), rehearsed at 14 um on the RTX 3060 ([BEYOND_VRAM_PROPAGATED.md](BEYOND_VRAM_PROPAGATED.md)) and awaits its judged 64 um run on the same RTX 3060 (the 120 um RTX 5880 run is optional); its E/H state is below physical VRAM and only its live adjoint state above it | VERIFIED (G5-05, G5-06) |
| Restart | Block-level durable journal with per-phase pointer files, per-file checksum, dtype, shape and byte checks, one fallback record per kind with named rollback, per-run ownership lock, distinct terminal states, cancellation at block boundaries, a design checkpoint for optimizer loops, forward/backward interruption, fault-injection and child-process kill tests ([STREAMED_RESTART.md](STREAMED_RESTART.md)). Process-kill consistency is tested; power-loss durability is not claimed | see the gate file (G1-04, G1-05, G5-07 to G5-09) |
| Batches | `BatchRunner` process jobs with resume; `run_tensor_batch` shared CUDA cohorts ([TENSOR_BATCH.md](TENSOR_BATCH.md), [PYTHON_BATCH.md](PYTHON_BATCH.md)). These are independent cases, not one decomposed problem | VERIFIED (G7-05) |
| Long runs | 1e5 journaled steps, eight repeated runs and 100 optimizer updates on one light 2D CPU fixture with memory-growth and post-source energy bounds ([RESTART_SOAK.md](RESTART_SOAK.md)); larger domains and multi-hour runs are not soaked | see the gate file (G5-10) |

## HPC additions

| Row | Implemented scope and record | Verified for release |
| --- | --- | --- |
| Single-problem domain decomposition | Rank-owned x slabs with halo transpose and material VJP for uniform cubic staircase dielectric grids with periodic/Bloch faces on every axis ([DOMAIN_DECOMPOSITION.md](DOMAIN_DECOMPOSITION.md)). PML, mirror walls, sources, monitors, ADE and nonuniform metrics are rejected. Verified with two and three Linux CPU Gloo ranks only | MIXED: NOT_RUN H1-01; BLOCKED_EXTERNAL H1-02, H1-03, H1-04, H1-05, H1-06 |
| Multi-GPU with out-of-core execution | Not implemented | Not claimed |

## Stage status

<!-- stage-status:begin -->
Rendered from [validation/completion_gates.json](validation/completion_gates.json) and its evidence runs by `scripts/build_validation_report.py`; the judge column applies the rules of `scripts/check_release_gates.py` without accepting stale evidence. BLOCKED_EXTERNAL counts tasks whose `blocker` field is set.

| Stage | Title | Profile | Tasks | VERIFIED | FAILED | NOT_RUN | BLOCKED_EXTERNAL | Judge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G0 | 기준선·범위·증거 체계 | WORKSTATION | 5 | 5 | 0 | 0 | 0 | 0 pass, 5 fail |
| G1 | 과거 리뷰 회귀 및 수정 | WORKSTATION | 6 | 6 | 0 | 0 | 0 | 5 pass, 1 fail |
| G2 | 물리·격자·실행 계약 | WORKSTATION | 6 | 6 | 0 | 0 | 0 | 4 pass, 2 fail |
| G3 | 독립 물리·gradient 검증 | WORKSTATION | 17 | 17 | 0 | 0 | 0 | 16 pass, 1 fail |
| G4 | CUDA·CI·환경 검증 | WORKSTATION | 6 | 6 | 0 | 0 | 0 | 3 pass, 3 fail |
| G5 | 메모리·재시작·장기 안정성 | WORKSTATION | 10 | 10 | 0 | 0 | 0 | 10 pass, 0 fail |
| G6 | 사용자 물리·역설계 API | WORKSTATION | 8 | 8 | 0 | 0 | 0 | 8 pass, 0 fail |
| G7 | 대표 응용·동일 정확도 비용 | WORKSTATION | 5 | 5 | 0 | 0 | 0 | 5 pass, 0 fail |
| G8 | 저장·GUI·clean 설치 | WORKSTATION | 7 | 7 | 0 | 0 | 0 | 4 pass, 3 fail |
| G9 | 보안·운영·출고 판정 | WORKSTATION | 7 | 6 | 0 | 0 | 0 | 2 pass, 4 fail |
| H1 | 실제 단일 문제 multi-GPU | HPC | 6 | 0 | 0 | 1 | 5 | 0 pass, 6 fail |

- WORKSTATION (stages G0, G1, G2, G3, G4, G5, G6, G7, G8, G9): 57 of 76 required tasks pass the judge, 19 fail, and G9-07 (this report) is judged after the render; NOT RELEASABLE.
- HPC (stages G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, H1): 57 of 82 required tasks pass the judge, 25 fail, and G9-07 (this report) is judged after the render; NOT RELEASABLE.
<!-- stage-status:end -->

## Scope changes

Removing or demoting a row that the existing plan calls required needs the
owner's approval recorded in the task's `scope_change_approval` field. A row
that is hard or that lacks hardware is BLOCKED_EXTERNAL, not removed.
