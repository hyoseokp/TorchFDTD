# Cross-solver comparison on one RTX 3060 workstation

Same-hardware accuracy and speed comparison of TorchFDTD against Meep (CPU) and FDTDX (GPU) on 2026-09-21, and of forward throughput against BeamZ (GPU) on a second GPU in section C2, from the machine-readable [combined record](validation/cross_solver_3060.json) and the per-solver records in `docs/validation/cross_solver/`. The drivers, fixtures and environment scripts live in `benchmarks/cross_solver/`. The document reports numbers and their conditions only.

## Environment

All runs used one workstation: 12th Gen Intel(R) Core(TM) i7-12700 (12 physical cores, 20 logical CPUs visible to WSL2), NVIDIA GeForce RTX 3060 with 12288 MiB, Windows driver 591.86, Linux side Linux-5.15.167.4-microsoft-standard-WSL2-x86_64-with-glibc2.35 in the WSL2 distribution `torchfdtd-bench`.

Linux side: a WSL2 Ubuntu 22.04 distribution. GPU shared with the Windows desktop compositor; every timing block waited for the idle criterion recorded in gpu_idle.

| Component | TorchFDTD and FDTDX (venv) | Meep (micromamba) |
|---|---|---|
| Python | 3.12.14 | 3.13.15 |
| Solver | torchfdtd 0.14.0.dev0 (worktree HEAD `fa57986a3c11` when the drivers ran), fdtdx 0.6.2 | meep 1.34.0 (MPI build, mpich 4.3.2 h23078de_105) |
| Frameworks | torch 2.11.0+cu128 (CUDA 12.8), cupy-cuda12x 14.2.0, jax 0.11.2, jaxlib 0.11.2, jax-cuda12-plugin 0.11.2, equinox 0.13.8, optax 0.2.8 | numpy 2.5.3, scipy 1.18.1 |
| numpy, scipy | 2.4.6, 1.18.1 | 2.5.3, 1.18.1 |
| Field precision | float32 | float64 (the conda-forge build is double precision) |
| Execution | GPU, one process | CPU, 12 MPI ranks (OMP_NUM_THREADS=1) |

Environment build: `benchmarks/cross_solver/setup_env.sh`; verification: `benchmarks/cross_solver/verify_env.sh`. The per-solver records under `docs/validation/cross_solver/` carry the full package lists, the SHA-256 of every driver script and fixture file, the raw timing samples and the GPU idle checks; `docs/validation/cross_solver_3060.json` combines them. The recorded driver hashes refer to the driver versions that ran; the environment root and the repository path were moved from constants into `TORCHFDTD_BENCH_ROOT` and the script location afterwards, which changed no computation.

## Fixtures

Each fixture is defined once in `benchmarks/cross_solver/fixtures/*.json` and instantiated by one driver per solver (`torchfdtd_driver.py`, `fdtdx_driver.py`, `meep_driver.py`; `beamz_driver.py` for fixture C in section C2). The drivers assert the cell counts, the time step, the source and monitor cell indices and, where a solver accepts a sampled permittivity array, the shared staircase array itself.

**A. Analytic slab.** Index 1.5 slab, 0.2 um thick, in a periodic 2D TMz cell of 8.0 x 0.5 um, 0.025 um mesh (320 x 20 cells), Courant number 0.700036 (dt = 5.837669e-17 s), 1600 steps, 16 absorbing cells on each x end, periodic in y. Soft Ez sheet at x = -1.5 um with a 1.0-cycle Gaussian pulse at 1.55 um; reflection and transmission planes at x = -0.8 and 0.8 um; 31 frequencies equally spaced between c/1.8 and c/1.3 um; air reference run for normalisation and incident subtraction. The slab covers Ez cells 157..164 in every solver. FDTDX has no 2D mode and uses a 3D grid with one periodic z cell and courant_factor scaled so that dt is identical. Reference: T = [1 + ((n^2-1)/2n)^2 sin^2(2 pi n d / lambda)]^-1, R = 1 - T.

**B. Mie sphere.** Index 2.0 sphere of radius 0.6 um in air, 3.2 um cube, 0.05 um mesh (64^3 cells), Courant number 0.571577 (dt = 9.532874e-17 s), 2518 steps (240.0 fs; 120 fs changes the TorchFDTD cross-sections by up to 2.5 percent, 360 fs by less than 1e-4, so 240 fs is used), 8 absorbing cells on every face. Gaussian pulse at 1.55 um with 8 fs power FWHM and 30 fs offset. Six flux planes at +-1.1 um (2.2 um square), incident intensity from a 0.4 um square plane at the centre of the empty run, 9 wavelengths equally spaced from 1.3 to 1.8 um, scattered flux from the field-wise difference between the sphere run and the empty run. TorchFDTD uses its closed TFSF box (1.6 um cube). FDTDX 0.6.2 and Meep have no closed TFSF box, so they use their native plane-wave-plus-flux-box scattering setups (a one-way UniformPlaneSource at x = -1.2 um spanning the whole transverse domain in FDTDX; an Ez current sheet at x = -1.2 um spanning the whole cell with is_integrated=True in Meep). The staircase sphere is the same per-component Yee sampling in TorchFDTD and FDTDX (shared array); Meep rasterises the sphere itself with eps_averaging=False. Reference: Mie series (examples/tfsf_sphere.py).

**C. Forward throughput.** The vacuum and sphere scenes of `benchmarks/open_source.py`: 4.8 um cube, 64^3 and 96^3 cells, 800 steps, Courant number 0.571577, 8 absorbing cells, point Ez source at [-1.2, 0, 0] um with a 2.0-cycle Gaussian pulse, point Ez monitor at [1.2, 0, 0] um, sphere of radius 0.5 um and index 1.5. One warm-up solve per case, then 3 timed solves; the tables report medians and the records keep every sample.

**D. Adjoint.** The periodic dielectric fixture of docs/FDTDX_MATCHED_FULL_GRADIENT.md at 64^3 cells and 128 steps: 0.1 um mesh, Courant factor 0.9 (dt = 1.733250e-16 s), all faces periodic, slab of permittivity 2.25 on z cells 32..39, additive Ex kick at cell [32, 32, 12] (5 fs FWHM Gaussian, 8 fs offset), Ex probes at [32, 32, 24] and [32, 32, 48], loss mean(probe0**2) + 0.3*mean(probe1**2) over all steps. The gradient is taken with respect to the full scalar-per-cell permittivity array. TorchFDTD: checkpointed discrete adjoint with 2 device checkpoints. FDTDX: checkpointed (num_checkpoints=2) and reversible (Recorder(modules=[])) methods. Meep is excluded: its adjoint is a frequency-domain method with different semantics.

## A. Analytic slab

| Solver | Max abs. T error | Max abs. R error | Max abs. R+T-1 | Field precision |
|---|---:|---:|---:|---|
| TorchFDTD | 1.533e-03 | 1.535e-03 | 5.356e-06 | float32 |
| FDTDX | 1.538e-03 | 1.534e-03 | 6.358e-06 | float32 |
| Meep | 1.549e-03 | 1.534e-03 | 1.492e-05 | float64 |

Pairwise differences of the 31 recorded samples:

| Pair | Max abs. T difference | Max abs. R difference |
|---|---:|---:|
| TorchFDTD vs FDTDX | 5.911e-06 | 2.283e-06 |
| TorchFDTD vs Meep | 1.579e-05 | 6.717e-06 |
| FDTDX vs Meep | 1.599e-05 | 7.110e-06 |

## B. Mie sphere

| Solver | Source and monitor method | Max relative cross-section error | Steps |
|---|---|---:|---:|
| TorchFDTD | closed TFSF box, scattered-field planes | 1.352 % | 2518 |
| FDTDX | one-way plane source, total-field planes minus empty run | 1.150 % | 2518 |
| Meep | current sheet spanning the cell, total-field planes minus empty run | 1.149 % | 2518 |

Relative error per wavelength (percent):

| Wavelength (um) | TorchFDTD | FDTDX | Meep |
|---:|---:|---:|---:|
| 1.3000 | +1.352 | +1.150 | +1.149 |
| 1.3625 | +1.179 | +0.980 | +0.948 |
| 1.4250 | -0.299 | -0.442 | -0.478 |
| 1.4875 | -0.771 | -1.072 | -0.885 |
| 1.5500 | -0.341 | -0.771 | -0.443 |
| 1.6125 | +0.174 | -0.367 | +0.073 |
| 1.6750 | +0.588 | -0.036 | +0.485 |
| 1.7375 | +0.787 | +0.123 | +0.683 |
| 1.8000 | +0.521 | -0.158 | +0.430 |

Pairwise maximum relative difference of the cross-sections:

| Pair | Max relative difference |
|---|---:|
| TorchFDTD vs FDTDX | 0.681 % |
| TorchFDTD vs Meep | 0.229 % |
| FDTDX vs Meep | 0.586 % |

## C. Forward throughput

Full solve = setup + stepping + final field transfer (medians of three timed solves after one warm-up; setup excludes interpreter start-up and compilation, which the warm-up absorbs). Stepping = the solver's own time-stepping loop. Peak device memory is torch.cuda.max_memory_allocated for TorchFDTD and the XLA peak_bytes_in_use for FDTDX; Meep runs on the CPU.

| Case | Solver | Full solve (s) | Stepping (s) | Cell-steps/s, full | Cell-steps/s, stepping | Peak device MiB |
|---|---|---:|---:|---:|---:|---:|
| vacuum-64 | TorchFDTD | 0.117 | 0.095 | 1.79e+09 | 2.20e+09 | 18 |
| vacuum-64 | FDTDX | 0.849 | 0.417 | 2.47e+08 | 5.03e+08 | 89 |
| vacuum-64 | Meep (12 MPI ranks) | 4.395 | 4.323 | 4.78e+07 | 4.86e+07 | CPU |
| sphere-64 | TorchFDTD | 0.114 | 0.094 | 1.84e+09 | 2.22e+09 | 18 |
| sphere-64 | FDTDX | 0.780 | 0.418 | 2.69e+08 | 5.02e+08 | 89 |
| sphere-64 | Meep (12 MPI ranks) | 4.373 | 4.298 | 4.80e+07 | 4.89e+07 | CPU |
| vacuum-96 | TorchFDTD | 0.302 | 0.265 | 2.34e+09 | 2.67e+09 | 57 |
| vacuum-96 | FDTDX | 2.022 | 1.509 | 3.50e+08 | 4.69e+08 | 288 |
| vacuum-96 | Meep (12 MPI ranks) | 13.242 | 13.005 | 5.35e+07 | 5.44e+07 | CPU |
| sphere-96 | TorchFDTD | 0.310 | 0.270 | 2.28e+09 | 2.63e+09 | 57 |
| sphere-96 | FDTDX | 1.998 | 1.507 | 3.54e+08 | 4.70e+08 | 288 |
| sphere-96 | Meep (12 MPI ranks) | 13.602 | 13.356 | 5.20e+07 | 5.30e+07 | CPU |

The Meep rows come from the 12-rank member of the rank sweep (`meep_throughput_ranks12.json`, one warm-up and three timed solves per case, taken between the other sweep members). A later attempt to retake the Meep block behind a Windows host-CPU idle gate did not complete because other processes kept the host busy; that gate, the block-repeat rule and the host-load sampling remain in the driver for reruns, and the host load during the sweep was not measured.

Individual stepping samples (s), the max/min spread of the accepted block wall times, and the Windows host CPU load sampled before and after the block (Meep only; GPU blocks record the GPU idle check instead):

| Case | Solver | Samples | Spread | Host CPU before / after (%) |
|---|---|---|---:|---:|
| vacuum-64 | TorchFDTD | 0.094, 0.098, 0.095 | 1.023 | n/a |
| vacuum-64 | FDTDX | 0.417, 0.414, 0.417 | 1.040 | n/a |
| vacuum-64 | Meep | 4.366, 4.323, 4.216 | 1.037 (not gated) | n/a / n/a |
| sphere-64 | TorchFDTD | 0.095, 0.094, 0.094 | 1.019 | n/a |
| sphere-64 | FDTDX | 0.418, 0.415, 0.418 | 1.034 | n/a |
| sphere-64 | Meep | 4.298, 4.260, 4.364 | 1.024 (not gated) | n/a / n/a |
| vacuum-96 | TorchFDTD | 0.267, 0.265, 0.260 | 1.049 | n/a |
| vacuum-96 | FDTDX | 1.511, 1.509, 1.509 | 1.016 | n/a |
| vacuum-96 | Meep | 13.005, 12.966, 13.095 | 1.011 (not gated) | n/a / n/a |
| sphere-96 | TorchFDTD | 0.270, 0.270, 0.268 | 1.017 | n/a |
| sphere-96 | FDTDX | 1.511, 1.507, 1.507 | 1.002 | n/a |
| sphere-96 | Meep | 13.129, 13.356, 13.372 | 1.019 (not gated) | n/a / n/a |

Point-monitor traces of the timed solves: relative L2 over the common samples, then after a least-squares amplitude fit, then after additionally shifting the second trace by the integer number of steps that minimises the residual (Meep normalises its current source differently, flips its sign, records one extra sample and offsets its source timing, so only the shifted, fitted column compares waveform shapes):

| Case | Pair | Raw relative L2 | Fitted relative L2 | Best shift (steps) | Amplitude ratio at best shift | Shifted, fitted relative L2 | pi dt/T |
|---|---|---:|---:|---:|---:|---:|---:|
| vacuum-64 | TorchFDTD vs FDTDX | 6.355e-05 | 6.266e-05 | 0 | 1.0000e+00 | 6.266e-05 | 0.087 |
| vacuum-64 | TorchFDTD vs Meep | 1.010 | 0.271 | -2 | -9.8141e-03 | 0.086 | 0.087 |
| vacuum-64 | FDTDX vs Meep | 1.010 | 0.271 | -2 | -9.8140e-03 | 0.086 | 0.087 |
| sphere-64 | TorchFDTD vs FDTDX | 5.791e-05 | 5.072e-05 | 0 | 1.0000e+00 | 5.072e-05 | 0.087 |
| sphere-64 | TorchFDTD vs Meep | 1.009 | 0.272 | -2 | -9.8011e-03 | 0.086 | 0.087 |
| sphere-64 | FDTDX vs Meep | 1.009 | 0.272 | -2 | -9.8008e-03 | 0.086 | 0.087 |
| vacuum-96 | TorchFDTD vs FDTDX | 4.074e-05 | 3.585e-05 | 0 | 1.0000e+00 | 3.585e-05 | 0.058 |
| vacuum-96 | TorchFDTD vs Meep | 1.004 | 0.178 | -2 | -4.3678e-03 | 0.058 | 0.058 |
| vacuum-96 | FDTDX vs Meep | 1.004 | 0.178 | -2 | -4.3678e-03 | 0.058 | 0.058 |
| sphere-96 | TorchFDTD vs FDTDX | 5.814e-05 | 3.786e-05 | 0 | 1.0000e+00 | 3.786e-05 | 0.058 |
| sphere-96 | TorchFDTD vs Meep | 1.004 | 0.178 | -2 | -4.3652e-03 | 0.058 | 0.058 |
| sphere-96 | FDTDX vs Meep | 1.004 | 0.178 | -2 | -4.3650e-03 | 0.058 | 0.058 |

The last column is the residual that a remaining half-step timing offset of the 1.55 um carrier alone would leave (pi dt / T), for comparison with the Meep rows.

FDTDX XLA compilation per case (excluded from the timed solves): vacuum-64 0.70 s, sphere-64 0.63 s, vacuum-96 0.63 s, sphere-96 0.60 s.

Meep stepping time versus MPI rank count on the same CPU (supplementary; the table above uses 12 ranks):

| Ranks | vacuum-64 stepping (s) | sphere-64 stepping (s) | vacuum-96 stepping (s) | sphere-96 stepping (s) |
|---:|---:|---:|---:|---:|
| 4 | 3.435 | 3.488 | 10.791 | 11.079 |
| 8 | 3.550 | 3.662 | 11.632 | 12.198 |
| 12 | 4.323 | 4.298 | 13.005 | 13.356 |
| 16 | 5.070 | 4.895 | 14.256 | 14.114 |

## C2. Forward throughput against BeamZ on an RTX 5090

Fixture C, retaken for TorchFDTD and run for BeamZ on one rented NVIDIA GeForce RTX 5090 (32607 MiB, driver 595.91.07, AMD EPYC 7543 32-Core Processor) on 2026-11-12: the two drivers ran back to back in one container, each in its own venv, with the same definitions as section C. TorchFDTD: the repository source of the commit that adds these records (package version 1.1.7), torch 2.8.0+cu128 (CUDA 12.8), cupy-cuda12x 14.2.0. BeamZ: beamz 0.6.2 installed from PyPI, backend='auto', which runs its JAX backend (jax 0.12.0.1, jax-cuda12-plugin 0.12.0.1); its optional native CUDA component is built from source and was not used. For BeamZ, stepping is SimulationPerformance.runtime_s, its own timing of the compiled executable from dispatch to completion, and peak device memory is the XLA peak_bytes_in_use. Records: `docs/validation/cross_solver/rtx5090/`.

| Case | Solver | Full solve (s) | Stepping (s) | Cell-steps/s, full | Cell-steps/s, stepping | Peak device MiB |
|---|---|---:|---:|---:|---:|---:|
| vacuum-64 | TorchFDTD | 0.050 | 0.012 | 4.24e+09 | 1.81e+10 | 18 |
| vacuum-64 | BeamZ | 0.079 | 0.040 | 2.66e+09 | 5.28e+09 | 30 |
| sphere-64 | TorchFDTD | 0.048 | 0.012 | 4.33e+09 | 1.81e+10 | 18 |
| sphere-64 | BeamZ | 0.100 | 0.042 | 2.11e+09 | 5.04e+09 | 43 |
| vacuum-96 | TorchFDTD | 0.082 | 0.020 | 8.61e+09 | 3.57e+10 | 57 |
| vacuum-96 | BeamZ | 0.154 | 0.051 | 4.60e+09 | 1.38e+10 | 126 |
| sphere-96 | TorchFDTD | 0.084 | 0.020 | 8.45e+09 | 3.57e+10 | 57 |
| sphere-96 | BeamZ | 0.132 | 0.059 | 5.36e+09 | 1.19e+10 | 162 |

BeamZ first solve per case, including its JAX compilation (excluded from the timed solves): vacuum-64 1.45 s, sphere-64 1.01 s, vacuum-96 1.20 s, sphere-96 1.00 s.

Point-monitor traces, defined as in section C. The BeamZ trace comes from one additional untimed solve with a per-step FieldRecorder at the monitor node; its timed solves record one frequency there with a point FieldMonitor.

| Case | Pair | Raw relative L2 | Fitted relative L2 | Best shift (steps) | Amplitude ratio at best shift | Shifted, fitted relative L2 | pi dt/T |
|---|---|---:|---:|---:|---:|---:|---:|
| vacuum-64 | TorchFDTD vs BeamZ | 1.076e-04 | 1.076e-04 | 0 | 1.0000e+00 | 1.076e-04 | 0.087 |
| sphere-64 | TorchFDTD vs BeamZ | 1.230e-04 | 1.225e-04 | 0 | 1.0000e+00 | 1.225e-04 | 0.087 |
| vacuum-96 | TorchFDTD vs BeamZ | 6.979e-05 | 4.892e-05 | 0 | 1.0000e+00 | 4.892e-05 | 0.058 |
| sphere-96 | TorchFDTD vs BeamZ | 1.111e-04 | 5.641e-05 | 0 | 1.0001e+00 | 5.641e-05 | 0.058 |

Rerun on a CUDA host with the two GPU venvs of `setup_env.sh`: `run_gpu.sh torchfdtd_driver.py --fixture throughput` and `run_gpu.sh beamz_driver.py --fixture throughput` from a fresh copy of the repository, then move the two records into `docs/validation/cross_solver/rtx5090/` and the trace artifacts into `$TORCHFDTD_BENCH_ROOT/artifacts_rtx5090` before `combine.py`.

## D. Adjoint

Time to gradient is the median wall time of three warmed repetitions of upload + forward + backward + synchronise. Peak device memory is torch.cuda.max_memory_allocated (TorchFDTD) and the XLA peak_bytes_in_use of the process (FDTDX, one process per method). Meep is excluded: its adjoint is a frequency-domain method with different semantics.

| Solver, method | Time to gradient (s) | Peak device MiB | Loss | Gradient L2 norm | Source-cell gradient |
|---|---:|---:|---:|---:|---:|
| TorchFDTD, checkpointed (2 device checkpoints) | 0.102 | 40 | 3.318336e-06 | 5.507867e-06 | 4.7e-06 |
| FDTDX, checkpointed (num_checkpoints=2) | 5.268 | 303 | 3.318336e-06 | 5.507867e-06 | 4.7e-06 |
| FDTDX, reversible (Recorder(modules=[])) | 0.209 | 111 | 3.318336e-06 | 5.507868e-06 | 4.7e-06 |
| FDTDX, checkpointed (num_checkpoints=16, supplementary) | 0.675 | 1174 | 3.318336e-06 | 5.507867e-06 | 4.7e-06 |

TorchFDTD replayed 765 forward steps during the backward sweep (forward 0.016 s, backward 0.081 s of the median). FDTDX checkpointed uses equinox's checkpointed while-loop with the requested number of checkpoint slots; the 16-checkpoint row shows how strongly its cost depends on that setting. The reversible method stores no interior checkpoints and reconstructs the fields backwards.

Wall-time samples (s): TorchFDTD, checkpointed (2 device checkpoints): 0.102, 0.105, 0.101; FDTDX, checkpointed (num_checkpoints=2): 5.296, 5.268, 5.251; FDTDX, reversible (Recorder(modules=[])): 0.209, 0.208, 0.210; FDTDX, checkpointed (num_checkpoints=16, supplementary): 0.681, 0.675, 0.671.

FDTDX compilation (excluded): FDTDX, checkpointed (num_checkpoints=2) 1.7 s, FDTDX, reversible (Recorder(modules=[])) 0.5 s, FDTDX, checkpointed (num_checkpoints=16, supplementary) 1.7 s.

| Pair | Gradient relative L2 difference | Gradient max abs. difference | Probe-history relative L2 difference | Loss relative difference |
|---|---:|---:|---:|---:|
| TorchFDTD, checkpointed (2 device checkpoints) vs FDTDX, checkpointed (num_checkpoints=2) | 7.055e-08 | 2.274e-13 | 8.483e-07 | 0.000e+00 |
| TorchFDTD, checkpointed (2 device checkpoints) vs FDTDX, reversible (Recorder(modules=[])) | 1.032e-07 | 4.547e-13 | 8.483e-07 | 0.000e+00 |
| TorchFDTD, checkpointed (2 device checkpoints) vs FDTDX, checkpointed (num_checkpoints=16, supplementary) | 7.055e-08 | 2.274e-13 | 8.483e-07 | 0.000e+00 |
| FDTDX, checkpointed (num_checkpoints=2) vs FDTDX, reversible (Recorder(modules=[])) | 1.072e-07 | 4.547e-13 | 0.000e+00 | 0.000e+00 |
| FDTDX, checkpointed (num_checkpoints=2) vs FDTDX, checkpointed (num_checkpoints=16, supplementary) | 0.000e+00 | 0.000e+00 | 0.000e+00 | 0.000e+00 |
| FDTDX, reversible (Recorder(modules=[])) vs FDTDX, checkpointed (num_checkpoints=16, supplementary) | 1.072e-07 | 4.547e-13 | 0.000e+00 | 0.000e+00 |

## Rerunning the Meep timing block

The Meep throughput rows and the rank sweep are retaken, and the combined record and this document regenerated, by one command from a Windows shell (the GPU records are left untouched):

```
bash benchmarks/cross_solver/run_meep_timing.sh   # from the repository root inside the Linux environment
```

The script runs `run_meep.sh 12 --fixture throughput` (the primary 12-rank block), `meep_rank_sweep.sh` (4, 8, 12 and 16 ranks), `combine.py` and `report.py`. Idle criterion of a block: the master rank polls the Windows host CPU load through `powershell.exe (Get-CimInstance Win32_Processor).LoadPercentage` every 5 s and starts the block after two consecutive samples at or below 50 percent (`--cpu-idle-limit`, 30 min limit per block); the other ranks sleep on a token file meanwhile. The block (one warm-up plus three timed solves) is accepted when its wall times spread by at most a factor 1.25, otherwise it is retaken after the gate, up to four times; every attempt and the host load before and after each block are stored in the record. `combine.py` prefers `meep_throughput.json` when it exists and otherwise falls back to `meep_throughput_ranks12.json` (currently used: `meep_throughput_ranks12.json`). A quiet GPU is not required for this block.

## Differences between the solvers that the reader must know

- **Absorbing boundaries.** TorchFDTD and FDTDX use convolutional PML with a cubic conductivity profile; the FDTDX faces were given sigma_end = 40/(L+1) in Courant units (the TorchFDTD maximum), kappa = 1 and the same negligible alpha, but FDTDX grades on d/L with its own E/H half-cell offsets while TorchFDTD grades on depth/(L+1). Meep uses its stretched-coordinate PML with the default quadratic profile and R_asymptotic = 1e-15. Only the thickness (16 cells for A, 8 cells for B and C) is identical.
- **Sources.** The slab and throughput sources are additive (soft) field kicks with one shared sampled waveform: TorchFDTD adds the sample after its E update, FDTDX reproduces the same kick through PointDipoleSource with a sampled profile scaled by -1/C over the sheet or cell, and Meep injects the waveform as a current density (is_integrated=False), so the Meep field amplitude differs by a solver-specific factor that cancels in every reported ratio. For the sphere, TorchFDTD drives a closed TFSF box from a live one-dimensional Yee line (numerical dispersion matched), FDTDX 0.6.2 offers only single-plane (one-way) TFSF sources, and Meep uses a current sheet spanning the whole cell with is_integrated=True because the sheet extends into the PML.
- **TFSF availability.** Only TorchFDTD ran fixture B with a closed TFSF box, so only its empty-box figure measures leakage; the FDTDX and Meep flux planes sit in the total-field region and the incident field is removed by subtracting the empty-run frequency-domain fields.
- **Frequency-domain monitors.** TorchFDTD interpolates E and H trilinearly to its plane quadrature points and applies the half-step H phase; FDTDX PhasorDetector co-locates all components at the Ez Yee node and time-centres H by averaging consecutive half steps (exact_interpolation), with the phasors post-processed in float64 here; Meep's DFT flux objects use its own Yee interpolation. These conventions change the flux normalisation, not the reported ratios.
- **Precision.** TorchFDTD and FDTDX propagate float32 fields (complex64 accumulators); the conda-forge Meep build is double precision.
- **Grid and time step.** All solvers use dx = 0.025 um (A) and the fixture values above; dt is identical to 1e-12 relative (FDTDX derives dt from courant_factor/sqrt(3), so the 2D slab passes courant_factor = 0.99 sqrt(3/2)). Meep's run(until=...) stepped 801 times instead of 800 for the 64^3 throughput cases; its rates use the steps it ran.
- **Material sampling.** TorchFDTD and FDTDX receive the same per-component staircase permittivity arrays (SHA-256 recorded). Meep rasterises the geometry itself at its Yee positions with eps_averaging=False; its epsilon array is not identical cell by cell.
- **Execution model.** TorchFDTD runs fused CUDA kernels (NVRTC-compiled once, cached on disk) captured in a CUDA graph with a Python setup of about 15 ms; FDTDX runs one jitted XLA executable per case (compilation excluded and reported with JAX persistent compilation cache enabled, place_objects/apply_params of about 0.5 s included in the full solve); Meep runs 12 MPI ranks on the CPU with a per-step field probe; the rank-sweep table gives its stepping time for 4 to 16 ranks. The Meep driver can gate its timing blocks on the Windows host CPU load because other processes on the workstation share the cores; the Meep rows reported here come from the ungated sweep run described in section C.
- **BeamZ (section C2 only).** BeamZ receives the shared staircase permittivity as a MaterialGrid with Yee-support arrays (its own rasteriser smooths interfaces by default), the same additive Ez kick through CustomSource(timing='e') and a CPML of the same 8-cell thickness with its own profile. Its timed solves record one frequency at the monitor node instead of the per-step trace of the other solvers.
- **Adjoint semantics.** TorchFDTD differentiates its discrete Yee/CPML step with a checkpointed transpose; FDTDX differentiates the same forward model through JAX with either equinox checkpointing or time reversal. Meep's adjoint solver is frequency-domain and was not run.
- **Shared GPU.** The RTX 3060 also drives the Windows desktop (about 2.6 GiB resident); every timing block waited until the reported memory and utilisation stayed below the idle criterion recorded in the records.
