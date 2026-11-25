# Execution modes in the workbench

The FDTD region panel has two execution controls above the general settings:
a **GPU** switch and a **Memory** selector. Both are stored in the project, so a
saved JSON scene keeps the choice (`Region.backend`, `Region.cuda_kernel`,
`Region.cuda_monitor_kernel` and `Region.execution_mode`). The status line under
the Memory selector shows what the server will do with the scene as it is
configured now, and the results panel of a finished run shows what was done.

## GPU switch

| Switch | Region settings | Kernels |
| --- | --- | --- |
| On, CuPy installed | `backend="cuda"`, `cuda_kernel="fused"`, `cuda_monitor_kernel="fused"` | Fused Yee/CPML update and shared plane DFT |
| On, CuPy missing | `backend="cuda"`, both kernels `"torch"` | PyTorch reference updates on the GPU |
| Off | `backend="cpu"`, both kernels `"torch"` | NumPy/PyTorch CPU |

A project that sets no kernel has `"auto"` for both. A resident run then uses
the fused kernels when CuPy imports and compiles a kernel for the device, the
fields are real and the grid is within the fused index range (3 x cells below
2^31), and the PyTorch kernels otherwise. The result summary names the kernels
that ran. `"auto"` is not written to project JSON.

The switch is disabled, with a tooltip, when `/api/health` reports no CUDA
device. `/api/health` also reports `cupy`, the GPU name, `gpu_free_bytes`,
`gpu_total_bytes`, `host_total_bytes` and `host_available_bytes`.

The fused kernels come from the optional `cuda-kernels` extra:

```console
.venv/Scripts/python.exe -m pip install -e ".[cuda-kernels]"
```

Without it the resident GPU path runs the PyTorch reference kernels, and
streamed GPU tiles are not available: streamed jobs then run their tiles on the
CPU and the status line says so. The **Advanced execution** section keeps the
individual `resource`, `precision`, `CUDA kernel` and `Frequency monitor
kernel` controls. Changing them updates the switch: it shows on for `cuda`, or
for `auto` on a CUDA host, and off for `cpu`.

## Memory modes

| Memory | Meaning |
| --- | --- |
| Auto (recommended) | The server picks resident, then streamed host, then streamed disk, from the live resources. |
| Resident (GPU or CPU memory) | The whole grid lives in device memory (GPU) or RAM (CPU), admitted by the memory estimate. The workbench server limits it to 8,000,000 cells unless it runs with `--memory-admission`; the Python API has no cell cap ([size limits](#size-limits)). |
| Streamed through host memory (DRAM) | Global E/H/CPML banks stay in RAM; extended x slabs move to the compute device one temporal block at a time. |
| Streamed through disk (slow, opt-in) | Same slabs, but the global banks are scratch files. Needs a scratch disk. An explicit choice that Auto never makes. |
| Tiled (approximate, large devices) | Overlapping resident tiles of a planar device with near-field stitching. Auto chooses it only with the **Allow approximate tiling in Auto** consent; see below. |

`Region.memory_mode="streamed"` (the Python opt-in) is treated as a streamed
request in the workbench. A `Resident` request with more than 8,000,000 cells is
rejected when the workbench validates the project, whatever cap the project
carries, unless the server runs with [memory admission](#size-limits).

### How Auto decides

Every `/api/validate` call and every job submission resolves the mode again
from the resources at that moment. The policy is resident, then DRAM banks,
then the approximate tiles with the user's consent, then a refusal; disk
streaming is never chosen automatically.

1. **Resident** when all of the following hold:
   - `memory_mode` is `resident`, and the grid has at most 8,000,000 cells on
     the workbench server with its fixed limits (on the Python API and on a
     server with `--memory-admission`, at most `Region.resident_cell_limit`
     cells when that optional cap is set);
   - the resident estimate (`estimated_memory_mb` from `/api/validate`, the
     [calibrated fused model](#resident-memory-of-the-fused-cuda-path) for
     `backend="cuda"` with the fused kernel) is at
     most **75% of free device memory** on the GPU (the same check the resident
     CUDA solver applies before allocating) or at most **80% of available host
     memory** on the CPU.
2. Otherwise **streamed through host memory** when a streamed policy is admitted
   with DRAM banks: its host reservation must fit **80% of available host
   memory**, and on the GPU its tile workspace must fit **80% of free device
   memory**.
3. Otherwise **tiled (approximate)**, only when the project's **Allow
   approximate tiling in Auto** box (`Region.tiling.allow_approximate`, default
   off) is ticked, the device passes the [tiled admission](#tiled-approximate-large-devices)
   (a planar device with sheet sources and one output plane) and the largest
   tile's resident estimate fits the resident margin of step 1. The run then
   carries the warning to read the mismatch indicator.
4. Otherwise Auto **refuses**: the status line and the Run button name the
   three options, allowing approximate tiling for a planar device, selecting
   **Streamed through disk** explicitly (its file banks ran 1.9 to 2.4 times
   slower than DRAM banks in the records, so it is an opt-in, never an automatic
   tier), or coarsening the mesh, and list the reason each tier was rejected.

`/api/validate` returns the rungs Auto walked (`execution.auto.rungs`, each with
its tier, whether it was chosen and why); the status line prints them under
the chosen tier. An explicit `execution_mode` (`resident`, `streamed_host`,
`streamed_disk`, `tiled`) bypasses the policy and runs that mode or reports its
own rejection.

The streamed reservation is the same conservative
`estimate_streamed_memory` accounting the Python API uses: `checkpoints + 3`
complete state banks (three for a forward-only job), eight copies of the
material array (four in the measured disk scope), tile workspace, source and
observation histories and the plane DFT accumulators. It is an allocation bound,
not a measured process peak. Free memory is read live, so a second GPU process
or a browser tab holding results can change the decision between validation and
the run.

### Tile policy

The default streamed policy is a slab of **32 x rows** with a temporal depth of
**4 steps** and no global checkpoints. When that policy is not admitted, the
generated candidate set of `plan_streamed_work` (slab widths 1, 16, 32, 64, 128
and the full grid; depths 1, 4, 8, 16) is searched and the admitted candidate
closest to the default is used, preferring the default depth before the default
width. Each candidate is checked again with the actual point and plane
observations of the scene. The chosen slab, depth, bank storage and tile device
appear in the status line, in the job record (`execution.policy`) and in the
results panel.

## Size limits

The Python API has no fixed size caps. Resident execution is admitted by the
memory estimate: `Simulation.run` refuses a device estimate above 75% of the
free device memory on CUDA, together with a host estimate above 80% of the
available host memory (below), and an estimate above 80% of the available host
memory on the CPU; the adjoint entry points admit their own reservation against
80% of the free device and host memory; the tensor batch admits its cohort
against `memory_fraction` (0.6 by default, at most 0.9) of the free device
memory; `BatchRunner` divides 80% of the available host memory (or
`memory_limit_mb`) among its CPU workers; and Auto applies the margins of step
1 above. Monitors, sources, materials and the step count enter the estimate
through their traces, DFT buffers, waveforms and ADE states; structures cost
host rasterization time, not device memory. The only fixed bound is the 32-bit
field index: resident execution refuses a grid whose 3 x cells (6 x cells for
complex Bloch fields) reach 2^31, so at most 715,827,882 real cells, because
the fused CUDA kernels and the subpixel operator address a field array with
signed 32-bit integers; the rule applies to every resident path, including the
Torch and NumPy updates that would not need it. Under the fixed limits of the
workbench server a byte budget (`resident_budget_bytes` of the adjoint,
mode-network and design paths) does not lift the 8,000,000-cell limit; under
`--memory-admission` the budget admits the grid, as on the Python API.

A caller may set optional caps; each is `None` (no cap) by default and accepts
a positive integer:

| Cap | Field | Checked by |
| --- | --- | --- |
| Resident cells | `Region.resident_cell_limit` | `Region.require_resident()` in every resident entry point, the construction of an `execution_mode="resident"` region, and the resident rung of Auto |
| Structures, sources, monitors, materials | `Project.limits.max_structures`, `max_sources`, `max_monitors`, `max_materials` | project validation, before the items are validated |
| Mesh refinement boxes | `Project.limits.max_mesh_refinements` | project validation |
| Frequency-plane samples (points x frequencies x components per plane) | `Project.limits.max_monitor_samples` | `estimate()`, and therefore `resolve_plan`, `Simulation` and `/api/validate` |

```python
from torchfdtd import Project, Region, Simulation

project = Project(
    region=Region(dimension='3d', size=(40., 40., 2.2), mesh=.02, pml_cells=12, steps=4000,
                  backend='cuda', cuda_kernel='fused', cuda_monitor_kernel='fused'),
    structures=pillars, sources=[sheet], monitors=[output_plane])
result = Simulation(project).run()        # admitted when the estimate fits 75% of the free VRAM

# Optional caps, for example to keep generated scenes of a sweep small:
Region(..., resident_cell_limit=50_000_000)
Project(..., limits=dict(max_structures=20_000, max_monitor_samples=50_000_000))
```

- The caps are written to the project JSON only when set, so a project without
  caps saves, hashes and loads exactly as before
  ([COMPATIBILITY.md](COMPATIBILITY.md)). A saved project keeps its caps, and
  the tiles of `plan_tiles` and `TiledPlaneSimulation` inherit them.
- The caps change admission, not physics: the plan hash, the reference, cache
  and restart keys (`torchfdtd.identity`) and the frequency-plane
  `run_signature` ignore them.
- By default the workbench server keeps its request limits whatever a
  submitted project carries (see the next item for `--memory-admission`):
  8,000,000 resident cells, 1000 structures, 512 sources, 512
  monitors, 100 materials, 64 mesh refinements, 12,000,000 samples per plane,
  100,000 steps, 2001 frequency points, 100,000 samples of a sampled source,
  8,000,000 cells of Bloch source sheets and 12,000,000 plane points x
  recorded components over every plane
  (`torchfdtd.models.SERVER_LIMITS`, [SECURITY.md](SECURITY.md)). A cap a
  project carries can lower them, never raise them.
- `torchfdtd serve --memory-admission` starts the server without these limits:
  the workbench then admits scenes like the Python API, by the memory estimate
  and the caps the project carries, in its requests, job threads and modal
  worker. The host arrays of a resident run, among them the E and H copies and
  the snapshot frames (`host_estimated_mb`,
  [below](#resident-memory-of-the-fused-cuda-path)), are then what bounds a
  large GPU grid on the host, against 80% of the available host memory. Every
  list keeps a ceiling (200,000 structures, 10,000 sources, 10,000 monitors,
  1000 materials, 10,000 refinement boxes, 1,000,000 frequency points and
  source-signal samples), and before anything is planned the server compares
  the host memory planning takes, counted from the steps, source terms,
  frequencies and plane points, with 80% of the available host memory
  ([SECURITY.md](SECURITY.md#memory-admission)). The input
  limits of the server stay, and the mode is meant for a single user on their
  own machine ([SECURITY.md](SECURITY.md#memory-admission)). The execution
  panel shows the admission ("admission memory estimate" or "admission fixed
  server limits (8,000,000 resident cells)") and states the cell limit in its
  help text only when the server applies it; `/api/health` reports it as
  `admission` and `server_limits`.

```powershell
torchfdtd serve --memory-admission
```

### Resident memory of the fused CUDA path

For `backend="cuda"` with `cuda_kernel="fused"` and real fields, `estimate()`
reports `memory_model: "fused_cuda"` and bounds the device memory of one
resident run by

    r x ((10 + s) N + C) + A + monitors + sources + TFSF + subpixel + FIXED

with r = 4 bytes (FP32) or 8 (FP64), N cells, s = 1 (3 with Yee sampling) and C
CPML memory elements (counted from the boundary layout). The 10 reals per cell
are E and H (6), the inverse permittivity (3) and one for the blocks the
allocator caches; s is the sampled permittivity copied to the device, which sets
the peak of a dielectric run. A dispersive scene adds A: on every cell, whatever its
structures, one int64 index per sample (three with Yee sampling) and 8 + 42 x
poles reals: the P and Q states, the diagnostics weights and the step
temporaries held by the pools of up to two captured CUDA graphs (a run with
`cuda_graph_steps` above 1 captures a second graph with its own pool). A plane
monitor on the fused monitor kernel costs its accumulator, the eight-corner
interpolation tables (an int64 index and a real weight per corner, point and
component), one sample buffer and two windows of one real per step; the Torch
monitor kernel keeps the bound of four accumulators and 192 bytes of tables per
point and component. Every soft or one-way source term adds its waveform, one
real per step. FIXED is 64 MiB for the graph pools, the diagnostics tables and
allocator rounding.

A CUDA run also holds host memory, which `estimate()` reports as
`host_estimated_mb` and `Simulation` and Auto admit against 80% of the
available host memory: the plan's sampled material (per cell 10 bytes kept and
18 at the planning peak with cell sampling, 27 and 53 with Yee sampling, 87 and
161 with subpixel interfaces), the E and H copies and one field-sized temporary
after the loop (9 field values per cell), or the plane post-processing (the
accumulator's host copy plus 44 bytes per sample) when that is larger, the
plan's interpolation maps (150 bytes per plane point and component), the
waveforms and sample times (20 bytes per step and source term), the point
traces, the snapshot frames and 512 MiB for the CUDA, CuPy and Python runtime.
The factors are tracemalloc measurements with about 10% added: 8.1/16.1,
24.0/48.0 and 78.5/146.0 bytes per cell for the material, 40.0 bytes per sample
for `plane_result`, 136 bytes per point and component for the maps and 17.6
bytes per step and term for the waveforms. On the CPU the same maps, waveforms,
frames and the post-processing beyond the three accumulator temporaries enter
`estimated_memory_mb`. Every other resident path (`backend="auto"` or `"cpu"`, the
Torch kernel, complex fields) keeps the tensor-expression bound of 200 bytes per
cell in FP32 and 400 in FP64 plus 80 or 160 per pole (`memory_model:
"tensor_expression"`). The tensor batch and the grouped batch sum the per-case
estimate; their cases hold the same arrays.

`benchmarks/resident_memory_fused.py` measures the model: each case runs
`Simulation(project).run()` (two cases: one `run_tensor_batch` cohort) in a fresh
process, and the record keeps the Torch allocator's peak allocated and reserved
bytes next to `estimate(project)`. The estimate is compared with the reserved
peak, the memory the allocator took from the device, which exceeds the
allocated peak where cached blocks fragment. The CUDA context, CuPy's module
images and other processes are outside those counters and inside the 25% the
solver keeps free. `tests/test_resident_guards.py` checks that the estimate of
every recorded case is at least its peak and equals the recorded estimate, so a
changed model has to be measured again.

The record,
[resident_memory_fused_3060.json](validation/resident_memory_fused_3060.json)
(RTX 3060 12 GB, driver 610.88, torch 2.10.0+cu126 with CUDA 12.6, CuPy 13.6.0,
revision 1c4d02b), holds 48 cases: FP32 and FP64 cubes from 1 to 64 million
cells, a 1000 x 1000 x 64 slab, CPML or periodic faces, a frequency plane with
the fused or the Torch monitor kernel, cell and Yee sampling (with CPML,
periodic and FP64), one to three Lorentz poles filling the grid,
`cuda_graph_steps` 1 and 8, three lateral tiles of the RTX 5880 metalens
configuration below (17 to 62 million cells, 1600 steps), two tensor-batch
cohorts and the Torch kernel. Every estimate is at least its reserved peak. The
fused estimates are 1.06 to 1.86 times the peak and at least 40 MiB above it;
for the dielectric grids of 16 million cells and more they are 1.06 to 1.18
times the peak. With cell sampling the peak is 40.2 to
46.2 allocated bytes per cell in FP32 from 4 to 64 million cells and 85.9 to
92.2 in FP64 from 4 to 33 million. The unchanged Torch-kernel estimate is 1.45
to 2.19 times its peak. The host estimate (`host_estimated_mb`) is 1.07 to 2.57
times the peak working set the run added to the process (read with psutil;
under WDDM the private bytes also count the device allocations, so they are not
used). The per-cell terms do not depend on the grid size; the ladder stops at
64 million cells, what a 12 GB card holds.

| Case | Cells | Peak allocated, MiB | Peak reserved, MiB | Estimate, MiB | Estimate / reserved | Host peak, MiB | Host estimate, MiB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `fused-f32-cpml-1m` | 1,000,000 | 49 | 70 | 115 | 1.64 | 282 | 556 |
| `fused-f32-cpml-16m` | 16,003,008 | 674 | 700 | 791 | 1.13 | 918 | 1,216 |
| `fused-f32-cpml-64m` | 64,000,000 | 2,596 | 2,634 | 2,889 | 1.10 | 2,978 | 3,322 |
| `fused-f32-periodic-64m` | 64,000,000 | 2,456 | 2,474 | 2,750 | 1.11 | 2,976 | 3,322 |
| `fused-f32-cpml-slab-64m` | 64,000,000 | 2,786 | 2,818 | 3,077 | 1.09 | 2,980 | 3,322 |
| `fused-f32-cpml-slab-plane-64m` | 64,000,000 | 3,557 | 3,600 | 3,843 | 1.07 | 4,289 | 4,833 |
| `fused-f32-yee-16m` | 16,003,008 | 791 | 802 | 913 | 1.14 | 1,146 | 1,475 |
| `fused-f32-yee-periodic-64m` | 64,000,000 | 2,930 | 2,942 | 3,238 | 1.10 | 3,891 | 4,359 |
| `fused-f64-yee-16m` | 16,003,008 | 1,576 | 1,598 | 1,762 | 1.10 | 1,880 | 2,027 |
| `fused-f64-cpml-32m` | 32,768,000 | 2,687 | 2,746 | 2,992 | 1.09 | 2,855 | 3,078 |
| `fused-f32-lorentz-16m` | 16,003,008 | 2,455 | 2,480 | 3,965 | 1.60 | 951 | 1,216 |
| `fused-f32-multipole3-4m` | 4,096,000 | 1,152 | 1,284 | 2,383 | 1.86 | 510 | 692 |
| `fused-f32-lorentz-graph8-4m` | 4,096,000 | 635 | 964 | 1,071 | 1.11 | 484 | 692 |
| `fused-f32-yee-multipole2-graph8-4m` | 4,096,000 | 980 | 1,688 | 1,821 | 1.08 | 570 | 759 |
| `fused-f64-lorentz-graph8-4m` | 4,096,000 | 1,239 | 1,824 | 2,046 | 1.12 | 594 | 834 |
| `fused-f32-metalens-17m` | 17,314,300 | 882 | 906 | 1,064 | 1.17 | 1,314 | 1,657 |
| `fused-f32-metalens-39m` | 38,957,175 | 1,965 | 1,972 | 2,297 | 1.16 | 2,649 | 3,043 |
| `fused-f32-metalens-62m` | 61,864,375 | 3,104 | 3,134 | 3,599 | 1.15 | 4,079 | 4,512 |
| `tensor-batch-f32-2x16m` | 32,006,016 | 1,347 | 1,372 | 1,581 | 1.15 | 1,284 | 2,432 |
| `torch-f32-cpml-16m` | 16,003,008 | 1,225 | 1,396 | 3,052 | 2.19 | 933 | 1,216 |
| `torch-f64-cpml-4m` | 4,096,000 | 642 | 746 | 1,562 | 2.09 | 570 | 834 |

**RTX 5880 cross-check.** The 41 um metalens tile measured on an RTX 5880 Ada
(48 GB; 2050 x 2050 x 103 = 432,857,500 cells, graded z, 12 CPML cells on six
faces, Yee sampling, 19,881 constant-n pillars on a substrate, one broadband Ex
sheet, one nearest-interpolation Ex/Ey/Ez plane of 4,104,676 points at three
frequencies, fused FP32 kernels with the CUDA graph, 1600 steps) peaked at 25.6
GB for the process in nvidia-smi, CUDA context included, on a version that still
held a full unit permeability array (12 bytes per cell, 5.2 GB here). `estimate()`
gives 25,804,616,499 bytes (24.0 GiB) of device memory for that tile, recorded as
`reference_5880` and rebuilt by `metalens_tile(41)`. Resident admission accepts it
when at least 32.0 GiB of the card is free and, for its host arrays (27.7 GiB),
at least 34.6 GiB of host memory is available. The scaled tiles on the RTX 3060
reserve 53.0 to 54.9 bytes per cell and allocate 52.6 to 53.4; at 432,857,500 cells
that is at most 22.1 GiB reserved, below the estimate. The tile has not been run on an
RTX 5880 since the array was removed.

## What streaming costs

Streaming replaces one resident field update per step by a host-to-device
copy of every extended slab, its update for one temporal block and a copy back.
The halo of `depth` cells on both sides of every slab is recomputed, so narrow
slabs and deep blocks do more update work; shallow blocks move the global state
more often.

- **Host traffic** (DRAM banks): every temporal block reads the complete
  E/H/CPML state plus halos and writes it back, roughly `2 x state bytes x
  steps / depth`. The state is 6 field values per cell plus CPML memories.
- **Disk traffic** (file banks): the same logical traffic goes through buffered
  file I/O. The `execution.report.forward_backing_store` record of a finished
  job lists the logical read and written bytes; the OS page cache and the
  physical SSD traffic are not measured.
- **Speed.** The recorded measurements in [MEASUREMENTS.md](MEASUREMENTS.md) and
  [STREAMED_FDTD.md](STREAMED_FDTD.md) are complete forward-plus-backward
  iterations of the differentiable API, not browser forward runs, but they set
  the expectation for the slab engine. On the i7-12700 / RTX 3060 workstation a
  complex-FP64 128 x 64 x 64 grid for 32 steps with two checkpoints took
  0.381 s resident on the GPU and 2.104 s streamed through DRAM (5.5x). On the
  RTX 5880 workstation the real-FP32 128 x 64 x 64, 32-step case took 0.0419 s
  resident, 0.461 s streamed with synchronous tiles (11.0x) and 0.390 s with
  asynchronous tiles (9.3x); the complex-FP64 256 x 96 x 96 case with width 32
  / depth 8 took 0.277 s resident and 2.538 s streamed synchronously (9.2x).
  File banks were 2.4x slower than DRAM banks on the 128 x 128 x 64, 32-step
  case on the RTX 3060 (9.06 s versus 3.79 s) and 1.9x slower in the
  interleaved small-grid record (2.883 s versus 1.526 s). The 54 GiB real-FP32
  beyond-VRAM gate ran ten steps in 58.4 minutes with 2.23 GB of peak CUDA
  allocation. Expect a browser streamed job to run several times slower than
  the same scene resident, and file banks to be slower again when the OS cache
  cannot hold the banks. No browser forward-only timing has been recorded yet.
- **Setup.** The material array is voxelized on the host and the whole scene is
  validated by the streamed API before the first block; large scenes spend
  seconds here before the progress bar moves.

## Choosing a scratch disk

Disk streaming is an explicit choice: select **Streamed through disk (slow,
opt-in)** in the Memory selector, or `execution_mode='streamed_disk'` in the
project. Auto never falls back to it, because the file banks ran 1.9 to 2.4
times slower than DRAM banks in the records (2.4x on the 128 x 128 x 64,
32-step case on the RTX 3060, 1.9x in the interleaved small-grid record) and
the OS page cache, not the solver, decides how much of that traffic reaches
the disk. When a scene fits no automatic tier, the refusal names this option
next to approximate tiling and a coarser mesh.

File banks are written under `<results>/scratch` by default, where `<results>`
is the server's results directory (`TORCHFDTD_RESULTS`, default `results` under
the directory the server was started from). Set `TORCHFDTD_SCRATCH` to move the
banks to another volume before starting `python -m torchfdtd.cli serve`:

```console
set TORCHFDTD_SCRATCH=D:\fdtd-scratch
python -m torchfdtd.cli serve
```

Pick a local NVMe volume with free space of at least a few times the state size
(`execution.reservation.disk_reservation_bytes` in the job record; three banks
of 6 x 4 bytes per cell for a real FP32 scene, twice that for FP64 or complex
Bloch fields, plus CPML memories). Do not use a nearly full system drive: the
server admits banks only up to 80% of the free space at validation time, and
other programs can consume that space later. Each job creates one private
`torchfdtd-state-*` directory and removes it when the job finishes, fails or is
cancelled. The banks are scratch, not a restart journal.

## Tiled (approximate, large devices)

The fifth Memory entry runs the [overlapping-tile decomposition](TILED_STITCHING.md)
forward only. It is not an exact method and Auto never selects it: use it for a
planar device that fits no memory tier, and read the indicator.

The panel that appears holds `Region.tiling`:

| Control | Field | Meaning |
| --- | --- | --- |
| tile size | `tiling.size_um` | Core of each tile along every lateral axis; `round(size / mesh)` cells |
| tile overlap | `tiling.overlap_um` | Margin on every lateral side; `ceil(overlap / mesh)` cells |
| max diffraction angle | `tiling.max_angle_deg` | Steepest ray leaving the device, default 45 degrees, for the suggestion |
| suggested overlap | read-only | `suggest_overlap`: output-plane distance x tan(angle) plus the tile absorber, from the farthest device point, the first source's wavelength and the CPML thickness |
| propagate to a focal plane / distance | `tiling.propagation_um` | Optional angular-spectrum propagation of the stitched plane by that distance in the background medium |

The scene contract is the planner's: a uniform mesh, CPML on the lateral and
normal faces, soft `plane` sheet sources normal to the output plane that span
the whole non-PML lateral extent (tick **Extend sheet through PML** on the
sheet, which makes the empty region stitch exactly) and exactly one enabled
frequency-plane monitor, the output plane, with no enabled point monitors.
Point, one-way and TFSF sources, Bloch phases and graded meshes are rejected
with the planner's message in the status line before anything runs. Dispersive
materials are not rejected by the planner; the resident tiles run them.

The status line shows the tile count and layout, the largest tile's cells and
resident estimate, the total tile cells relative to the device, the
suggestion, the focal-plane settings and a warning when the overlap is below
the suggestion or the largest tile exceeds the resident margin.

The job runs `run_tiled(project, plan, executor='sequential')`: one resident
`Simulation.run` per tile, CPU or GPU as the switch says, with progress and
Stop per tile. Its outputs are

- the stitched output plane as a frequency-plane record under the monitor's id
  (all six components, Poynting density and flux, `flux.csv`, the
  field-monitor endpoint, normalization against another tiled run of the same
  plan), the same outputs a plane monitor of the whole device gives;
- the per-pair mismatch table (`mismatch` over the full shared band,
  `mismatch_center` over its central half) with `max_mismatch_center` in the
  results panel, the error indicator of an approximate method: it bounds the
  stitched error, at two to three times that error in the record, but does not
  calibrate it;
- with a distance, the propagated plane as a second record under
  `<monitor id>-focal`, zero padded so that rays at the entered angle stay in
  the window (`pad` between 2 and 8);
- the field visualizer shows |E|^2 of the stitched plane and, when present,
  the focal plane at the first frequency, each relative to its own peak (the
  DFT values themselves are reduced field x seconds).

Costs from the record: with 1.5 um overlaps the tiles of the 3D pillar array
simulate about 2.5 times the cells of the whole device and take longer than the
whole device would; the near-field error falls from 12% at 0.25 um overlap to
5.7% at 2 um with a floor of about 5% away from the cuts, and the focal
intensity error from 4.8% to 1 to 2%. The tiled adjoint is Python only
(`TiledPlaneSimulation`); the browser runs no gradients.

## Angular-spectrum post-processing

Any finished forward run, resident, streamed or tiled, that stored a DFT plane
can be propagated through the homogeneous exterior beyond that plane without
another FDTD run: the **Angular spectrum** button in the results panel and in
the flux dialog opens the panel. It calls the same implementation as the tiled
focal plane ([ANGULAR_SPECTRUM.md](ANGULAR_SPECTRUM.md)): `propagate_section`
for a section through the normal at one fixed transverse coordinate and
`propagate_volume` at one distance for a plane parallel to the monitor. The
computation runs on the run's device (CUDA for a GPU run) and the fields stay
on the server; the panel receives an intensity image decimated to at most 512
samples per axis.

| Control | Meaning |
| --- | --- |
| Monitor, frequency | One stored plane and one of its recorded frequencies |
| Direction | Auto infers the propagation side from the enabled sources (all behind the plane or all in front); +normal or −normal override it |
| Exterior index | Real index of the homogeneous exterior, defaulting to the background index |
| Zero padding factor | The plane is padded this many times before the FFT; light beyond `(pad - 1) x span / 2` wraps around |
| Kind | A section `xz` or `yz` (the transverse axis with the normal; a 2D device offers one) or a plane parallel to the monitor |
| Section offset, distance start/stop, planes | The fixed transverse coordinate and the uniform distance grid of a section |
| Plane distance | The distance of the parallel plane |

The report below the image gives the **focus** (peak intensity, its distance
from the plane and absolute coordinate along the normal, its transverse
position and the FWHM along the section through it by linear interpolation
of the half-maximum crossings; on a parallel plane the peak position on both
axes and the FWHM along the first) and the **spectrum** (largest angle the
plane spacing can represent, `sin(theta) = wavelength / (2 spacing)`, the
evanescent fraction of the padded spectrum, spacing, wavelength in the
exterior, pad and padded shape). When the monitor spacing exceeds half the
wavelength in the exterior the panel shows the aliasing warning: angles above
the representable one alias instead of failing.

The route refuses with the library's message (HTTP 422) when the selected id
is not a stored DFT plane, when the plane holds no electric component or is
not a uniform tensor-product grid, when the section axis is not transverse to
the plane, and when the section or volume needs more than the budget: half of
the free device memory on CUDA, a quarter of the available host memory on the
CPU. The contract of the method applies: a homogeneous, lossless, source-free
exterior with outgoing waves only, and a recorded window outside which the
field is taken as zero; the focus report names the global intensity maximum
of what was computed, hot spots included. The API is
`GET /api/jobs/{id}/propagation-monitors` and `POST /api/jobs/{id}/propagate`.

## Limits of the browser streamed path

- **Forward only.** No gradients, no inverse design; the Python
  `StreamedSimulation` API remains the differentiable entry point.
- **Scene contract** of the streamed API: staircase interfaces, nondispersive
  materials, no TFSF boxes, no PMC/symmetric faces, no anisotropic tensor
  materials, a fixed number of steps (automatic decay shutoff off). Bloch
  boundaries, one-way sheet sources, graded meshes and both precisions work.
- **Monitors.** Point time monitors record their full time history, so their
  time traces, spectra and `monitors.csv` / `spectra.csv` match the resident
  job. Frequency-plane monitors accumulate their DFT on the host from the
  observed Yee cells and produce the same plane record (fields, Poynting
  density, flux, `flux.csv`, normalization against a resident reference of the
  same scene). Every distinct Yee cell a plane touches is one tile observation,
  so keep the quadrature point count per plane modest with the monitor
  downsample; above 50,000 observation cells the status line warns.
- **Field snapshot.** One frame, the configured slice assembled from the x
  slabs of the final completed block, downsampled like the resident snapshot.
  There are no live frames while the job runs and no snapshot series.
- **Divergence.** Non-finite samples or a non-finite final slice fail the job;
  the growth-ratio diagnostics of the resident run control are not evaluated.
- **NPZ download** contains the snapshot, point signals and plane spectra but
  not the full final E/H arrays; `field_peak` is taken over the rows read for
  the snapshot.
- **Progress and cancellation** work at tile granularity: the footer shows
  `block i / n · tile j / m`, and Stop ends the job after the current tile with
  the results of the last completed block.
- **Reservation, not measurement.** Admission uses the conservative streamed
  accounting. A job can still fail if another process takes memory or disk
  after validation, and passing admission is not a statement about speed.
