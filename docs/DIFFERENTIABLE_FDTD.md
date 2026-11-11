# Experimental Torch differentiable FDTD

`DifferentiableSimulation` connects a Torch permittivity tensor to native
Yee/CPML point signals and back to a Torch optimizer. The long time integration
uses an explicit discrete adjoint and bounded physical checkpoints. Fixed
[complex Bloch phases](BLOCH_ADJOINT.md) are supported by the resident Torch path.
It does not
retain a Torch graph for each timestep. This is a limited first implementation,
not differentiability for every feature of the forward workbench.

```python
import torch
from torchfdtd import (
    Project, Region, Source, Monitor, AdjointOptions,
    DifferentiableSimulation, smooth_sphere_epsilon,
)

project = Project(
    region=Region(size=(1.6, 1.5, 1.4), mesh=.1, pml_cells=3,
                  steps=40, precision="float64"),
    sources=[Source(center=(-.2, 0, 0), pulse="continuous", wavelength=1.1)],
    monitors=[Monitor(center=(.1, 0, 0))],
)
radius = torch.nn.Parameter(torch.tensor(.25, device="cuda", dtype=torch.float64))
model = DifferentiableSimulation(
    project, AdjointOptions(checkpoints=4, storage="host",
                            host_budget_bytes=128 * 1024**2),
)
optimizer = torch.optim.Adam([radius], lr=.003)
optimizer.zero_grad()
epsilon = smooth_sphere_epsilon(project.region, radius, inside=3., width=.09)
result = model(epsilon)
loss = result.signals[:, 0].square().mean()
loss.backward()
optimizer.step()
print(radius.grad, result.report)
```

Native geometry and smoothing width use **micrometres**. Time uses seconds.
`epsilon` is relative permittivity with shape `(Nx, Ny, Nz)` or `(Nx, Ny, Nz, 3)`.
It replaces the scene's material field for this calculation. Its dtype must match
the region, and its device selects CPU or CUDA execution. CUDA forward and replay
use the existing fused update kernels for real fields. The default real CUDA backward uses native
fused transpose kernels. `AdjointOptions(backward_kernel="torch")` selects the
explicit Torch transpose for comparison. CPU execution uses that Torch path.
Complex Bloch fields use Torch forward and backward on both CPU and CUDA.

The sigmoid sphere helper differentiates radius, centre and tensor material
parameters through a regularized material field. It is not the CAD subpixel
operator and does not prove sharp-interface shape-gradient convergence. A
small radius/centre Taylor check and an Adam example verify the computational
chain. Independent physical-gradient convergence remains required.

The [bounded geometry replay API](DIFFERENTIABLE_GEOMETRY.md) extends this chain
to ordered boxes, ellipsoids and cylinders, including dimensions, positions,
rotations and scalar materials, and to extruded polygons and sampled closed
splines whose [vertex and control-point gradients](SHAPE_GRADIENTS.md) carry a
recorded mesh-refinement convergence check. It replays small geometry chunks in
backward instead of retaining a full-domain geometry graph. The dense epsilon
and its incoming material gradient remain part of caller-owned storage.

The point-field objective above is deliberately simple. It is **not normalized
transmission**. `result.spectrum(frequency_hz, window=...)` provides a Torch
time-integral DFT with the half-step H observation convention. A supplied window
has one weight per timestep. This method does not automatically apply the
workbench's monitor apodization configuration.

For long spectral objectives, use `model.spectrum(epsilon, frequency_hz,
window=window)` directly. It returns `DifferentiableSpectrum` with complex
`fields` of shape `(frequency, enabled point monitor)`, `frequency_hz`, component
names and an execution report. It accumulates the DFT during the solve, without
retaining the full point-signal history. It has the same time-integral units
and E/H half-step convention as `model(epsilon).spectrum(...)`.

```python
spectral = model.spectrum(epsilon, [2.5e14, 3.0e14])
loss = spectral.fields.abs().square().sum()
loss.backward()
```

This example is spectral point intensity, not power-normalized transmission.
Resident execution buffers at most `block_size=32` timesteps by default. Pass
another positive integer to `DifferentiableSimulation.spectrum` to trade
observation workspace for DFT launch overhead. `StreamedSimulation.spectrum`
uses the solver's `temporal_depth` instead. Its accumulated spectra live on CPU
while the CUDA tile executes the field updates.

Backward regenerates only the needed block of real observation derivatives
from the complex spectrum derivative. Frequency and optional window values
are fixed snapshots. Trainable frequencies/windows, higher derivatives and
mode-port objectives remain unsupported. Window weights must be finite
and have one entry per timestep. Automatic monitor apodization is not applied.
The observation storage scales with frequencies and monitors plus a bounded
time block. Prepared source histories and an explicitly supplied window still
scale with timestep count. See [validation and timings](validation/ONLINE_SPECTRUM_REPORT.md).

## Supported and pending scope

| Capability | Current state |
|---|---|
| Real FP32/FP64, 2D/3D, fixed uniform/rectilinear mesh | Implemented |
| Diagonal nondispersive epsilon gradient | Implemented |
| CPML physical state and its discrete transpose | Implemented |
| Real periodic wrapping | Implemented |
| Fixed complex Bloch phases | Resident Torch CPU/CUDA, complex checkpoint replay and spectral planes |
| Prepared soft point/plane sources | Implemented, source parameters are fixed |
| Normal-incidence prepared one-way plane | Fixed background near injection, both directions and vector polarization checked |
| Point signals and Torch DFT | Implemented, including online spectral output and its bounded transpose |
| Collocated frequency planes and normalized signed power | Experimental [plane API](DIFFERENTIABLE_PLANES.md), native parity and slab/index-gradient checks |
| Regularized sphere radius/centre chain | Implemented |
| Checkpoint replay on device, host or disk | Implemented, synchronous or optional asynchronous transfers |
| Mixed GPU/host/disk checkpoint slots | Implemented with explicit slot counts |
| Full-tensor subpixel geometry derivatives | Pending |
| ADE material adjoint | Separate [resident](DISPERSIVE_ADJOINT.md) and experimental [spatially streamed](STREAMED_DISPERSIVE.md) Torch/native CUDA paths. A ten-step 54 GiB capacity/VJP run is complete. Long-time optical and physical gradient convergence remain unverified |
| Live TFSF and mode-port adjoints | Pending, rejected by this API |
| Complex spatial streaming and fused complex kernels | Experimental fixed-Bloch [DRAM/file slabs](STREAMED_FDTD.md) and [ADE extension](STREAMED_DISPERSIVE.md), with first-order gradients. Moving phases and higher derivatives remain unsupported |
| Trainable sources, boundaries and adaptive meshes | Pending |
| Higher derivatives | Rejected explicitly |
| Batched CUDA backward and shared-budget microbatch execution | Pending |
| Spatial out-of-core / space-time tiling | Experimental DRAM/file-backed slab API with block adjoint and reusable buffers |
| Async checkpoint prefetch | Implemented with bounded event-owned staging slots |
| Async spatial tile pipeline | Optional bounded pinned slots, separate copy streams, FIFO halo reduction |
| Automatic tile policy | Two-duration replay-cost selection, full-duration optimality unproven |
| Resident/DRAM/file execution selection | Experimental [measured search](EXECUTION_SELECTION.md) with CPU design tensors and input/output transfer accounting. Full-duration policy quality remains unverified |
| GPUDirect Storage | Pending |
| Single-domain multi-GPU backward | Experimental [slab decomposition](DISTRIBUTED.md), bit-identical on CPU, Gloo and one-GPU thread ranks; NCCL multi-GPU unvalidated |

Multiple calls can share a design tensor and their losses can accumulate, but
each live result graph retains its own native state. This is not a global
microbatch memory scheduler. Fixed-duration execution is required. Workbench
automatic shutoff is rejected. The normal scene cell limit remains in force.

## Admission before field allocation

`estimate_adjoint_memory` checks resident execution without creating field
arrays or scratch directories. It shares the execution calculation, including
the exact restart state, conservative solver workspace, source and observation
history, device/host/disk checkpoint slots and asynchronous staging. ADE also
reserves packed material and normalization carriers before packing begins.

```python
from torchfdtd import estimate_adjoint_memory

reservation = estimate_adjoint_memory(
    project, model.options, device="cuda", frequency_hz=[2.5e14, 3.0e14],
)
print(reservation["gpu_reservation_bytes"])
print(reservation["host_reservation_bytes"])
print(reservation["disk_checkpoint_reservation_bytes"])
```

For ADE, supply `parameter_shapes=(epsilon_shape, strength_shape, omega_shape,
gamma_shape)` using the original unbroadcast shapes. Omit `frequency_hz` for
point histories. The public estimator supports point observations and rejects
field-plane projects instead of counting a plane as a single sample. Plane
execution uses the same internal admission with its own interpolation and
spectral workspace accounting.

`AdjointOptions.host_budget_bytes` retains its checkpoint-tier meaning. It is
not a limit on all host memory. The report's `host_reservation_bytes` also
includes CPU solver workspace when `device="cpu"`, and admission checks this
total against 80% of currently available RAM. CUDA and disk reservations are
checked against the explicit tier budgets and 80% of currently free capacity.
These are conservative checks, not exclusive operating-system reservations.
Execution repeats them and still validates actual parameter values. Caller
inputs, geometry/optimizer graphs, CUDA context and OS file cache are outside
the estimate. Large grids can opt into `Region(memory_mode="budgeted")` with
`AdjointOptions.resident_budget_bytes`. The legacy workbench guard remains the
default. [Byte-budget contract and large-index checks](BUDGETED_RESIDENT.md).
This API supplies admission metadata and does not automatically switch to
spatial streaming.

## Checkpoint algorithm and tiers

The state consists of E/H and every active CPML memory. Source samples and the
time index are deterministic. A replay starts from a saved physical state or
the initial zero state, repeats native updates and source injection, and does
not re-record observations. The reverse step transposes H, its CPML recurrence,
E, and its CPML recurrence in reverse composition order. Epsilon gradients use
the replayed primal H and CPML state. Coincident observations accumulate.

The scheduler splits intervals using binomial capacity. The right recursion
consumes one checkpoint slot and the left branch is a loop. A single evolving
adjoint state is shared across the schedule, rather than retained in each
recursive frame. The split includes the interval's already available restart
state, so even a single saved checkpoint can reduce replay. With zero slots,
replay is valid but can be very expensive.
This is an implementation of established checkpoint/recomputation ideas, not
a new optimality theorem.

```python
options = AdjointOptions(
    checkpoints=4,
    storage="hierarchical",
    device_checkpoints=1,
    host_checkpoints=1,
    checkpoint_directory="results/checkpoints",
    disk_budget_bytes=2 * 1024**3,
    host_budget_bytes=512 * 1024**2,
)
```

This example places two outer, longer-lived checkpoint slots on disk, one on
the host and the innermost one on the compute device. It is an explicit policy,
not a measured hardware optimum. Disk archives are uncompressed and lossless.
Only files in a new, owned scratch directory are removed after backward or a
failure. These ephemeral checkpoints are not persistent user restart files.

`host_budget_bytes` covers stored host checkpoints plus a full disk staging state.
It is **not a cap on process RSS**, geometry arrays or CPU template preparation.
`disk_budget_bytes` includes archive overhead. `gpu_budget_bytes` limits the
solver's conservative additional workspace/checkpoint reservation against free
device memory, including prepared source histories, signals and their incoming
adjoints. User objective/DFT matrices, geometry graphs and other live calls consume
memory and must be included in end-to-end measurements. Physical field state is
bounded by checkpoint slots, while source and requested point-signal arrays
still grow with duration. No unconditional constant-total-memory claim is made.

`result.report` records restart bytes, checkpoint high-water counts by tier,
replayed timesteps, logical payload reads/writes, and forward/backward wall time.
Checkpoint I/O timing includes Python overhead and device-copy submission and
is not a separate accurate CUDA transfer-bandwidth measurement.

## Transfer profiling and validation

`profile_memory_transfers()` measures bounded pinned CPU↔GPU transfers. Its
optional file probe reports fsynced writes and **warm-cache reads** separately.
It does not identify the physical drive as NVMe or establish sustained device
bandwidth, overlap efficiency or GDS support. No OS caches or settings change.

```console
python -m examples.differentiable_design --device cuda
python -m benchmarks.adjoint_memory --steps 1000 --storage device --output results/adjoint.json
python -m benchmarks.memory_transfers --output results/transfers.json
```

The [tests](../tests/test_differentiable.py) compare against a small independent
full-autograd evaluation, directional differences, Taylor convergence, the
existing forward solver, coincident monitors, multiple calls and a Torch Adam
update. Nonuniform metrics, magnetic sources and both one-way plane directions
also have native forward, full-autograd and central-difference checks. Device/host/disk checkpoint policies are compared, including mixed
three-tier CUDA execution and write-failure cleanup. Full-autograd reference
evaluation (`reference`, and the dispersive, tensor ADE, source-waveform and
modal oracles) is admitted by an estimate of its retained graph: the graph
tensors (per step the restart state, the reciprocal and scaled permittivity and,
for ADE, the oscillator coefficients at the parameters' own resolution) against
80% of free CUDA memory or of available host memory, the graph nodes (a base
per step plus a share per source term, and under Windows WDDM the device graph
as well) against available host memory. The
permittivity dtype must match the project precision. `graph_budget_bytes` sets
an explicit cap on the estimate. The estimate is calibrated against measured
CPU and CUDA peaks, with held-out cases, in
[oracle_graph_memory.json](validation/oracle_graph_memory.json).

See the [measured development results](validation/ADJOINT_REPORT.md) and
[next execution milestones](HIERARCHICAL_EXECUTION.md). Physical-gradient
convergence, full physics coverage, large-capacity streaming and fair external
performance comparisons remain open.
