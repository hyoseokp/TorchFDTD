# Experimental single-problem domain decomposition

`torchfdtd.domain_decomposition.DistributedYeeDomain` is an initial-value Yee
propagator for one electromagnetic problem split into nonoverlapping x slabs.
Each process supplies only its owned E, H and scalar or diagonal epsilon.
There is no replicated global field/material allocation and no gather API.
This is an experimental foundation, not a complete distributed `Simulation`
or `PeriodicLayerResponse` execution route. Slabs with CPML, walls, sources,
observations and the differentiable and reversible solvers use
`SlabDecomposition` instead; see [DISTRIBUTED.md](DISTRIBUTED.md).

## Supported contract

Uniform cubic 3D staircase dielectric grids, epsilon >= 1, fixed time steps,
and periodic or unit-modulus Bloch boundaries on every axis are admitted.
Default Region precision remains FP32. FP64 is available for diagnostics.
PML, physical mirror boundaries, sources, monitor histories, ADE dispersion,
nonuniform metrics and early stopping are rejected or absent from this API.
First-order derivatives include local initial E/H and local scalar/diagonal
epsilon. No optical geometry tensor is constructed by the propagator.

Initialize a torch.distributed group externally. Use CPU/Gloo or CUDA/NCCL,
with one explicitly bound CUDA device per rank. Every rank must participate in
the same ordered calls, with the same propagation count and gradient mode.
The library validates common configuration and input errors collectively.
It cannot recover missing/crashed ranks or inconsistent calls by application
code. Configure an appropriate process-group timeout at initialization.

```python
import torch
import torch.distributed as dist
from torchfdtd.domain_decomposition import DistributedYeeDomain

# Launcher initializes the process group and binds the device first.
# region is an identical supported Region on every rank.
domain = DistributedYeeDomain(region, device="cpu", checkpoints=2,
    rank_budget_bytes=512 * 1024**2, max_replayed_steps=100_000)
e, h = domain.zero_state()
# Populate local initial fields using domain.ownership global x offsets.
epsilon = torch.full(domain.shape, 2.25, dtype=domain.dtype,
                     device=domain.device, requires_grad=True)
e_final, h_final = domain.propagate(e, h, epsilon, steps=region.steps)
local_loss = e_final.abs().square().sum()
loss = domain.global_sum(local_loss)
loss.backward()  # Exactly once on every rank, with the same objective seed.
```

`global_sum` replicates the scalar objective while its backward supplies one
local seed, avoiding a world-size multiplier. A rank without observations must
still supply a zero-weight field objective connected to its propagation.
Arbitrarily weighted, different rank seeds do not define this contract.

## Halos and replay

Each H-to-E curl reads the previous x row. Each updated E-to-H curl reads the
next x row. Only global wrap rows receive the Bloch phase. Transverse periodic
and Bloch differences remain local. Halo transposes reverse communication and
conjugate the wrap factor. Complex messages use paired real storage on the wire.
Low-level `exchange_halo` and `transpose_halo` assume correctly shaped local
fields/one-row seeds and the same side on every rank. They are protocol helpers,
not independently differentiable operations. `propagate` supplies the complete
custom transpose, including material accumulation.

Backward uses a fixed number of local E/H checkpoints and binomial replay.
The planned number of recomputed steps is checked before propagation against
`max_replayed_steps`. Zero checkpoints has quadratic recomputation cost and is
intended for small diagnostic cases. Domain configuration cannot be reassigned.
Saved input version errors are shared collectively before backward halo traffic.
The original Region can subsequently change without changing this domain.

Admission reserves local fields, halo buffers, checkpoint banks, transpose and
material-gradient workspace before field allocation. The conservative formula
is `(96 + 2*checkpoints)*3*local_cells*field_itemsize +
16*3*row_cells*field_itemsize + 24*local_cells*real_itemsize + 4096` bytes per rank.
It is a tensor-workspace reservation, not an observed process peak. Caller
objectives, optimizer state, backend allocations and process/runtime memory are
excluded and require a separate reserve. Noncontiguous input copies and complex
row wire storage are covered by the workspace allowance. Neither global state
nor a time-history factor enters the reservation. `last_report` exposes owned
range, reservation, communication bytes, replay work and peak checkpoints.

## Validation and limits

Focused CPU protocol tests compare 2 and 3 ranks, unequal slabs including a
one-cell slab, real/complex FP64 and complex FP32, scalar/diagonal epsilon,
nonzero transverse Bloch phases, fields and all material/initial-state VJPs to
the resident solver. Independent halo Hermitian identities and local material
central differences check the seams. This local protocol emulator substitutes
only transport/collectives and is explicitly not distributed-runtime evidence.

On the current Windows PyTorch 2.10.0+cu126 host, Gloo reports compiled support
but `ProcessGroupGloo.create_device(hostname="127.0.0.1")` raises
`makeDeviceForHostname(): unsupported gloo device`. Actual spawned group
initialization also failed. The real Gloo tests therefore skip on this runtime.
A process-local UV transport override did not fix it and no global environment
was changed. Real Gloo tests remain enabled where device creation succeeds.
The real two-CUDA test requires at least two visible GPUs and NCCL and skips on
this single-GPU, non-NCCL host. No multi-GPU speed, scaling, >48 GB capacity or
complete source-to-observable distributed simulation has been demonstrated.

## Executable measurement harness

`examples/distributed_pulse.py` initializes only rank-local coordinates, a
uniform dielectric slab, and a divergence-free Ez standing wave with H=0.
It supports real torchrun Gloo/NCCL groups and compares the global objective
and summed material derivative with an independent scalar discrete-Fourier
recurrence. The oracle allocates no global spatial tensor.

```sh
python -m torch.distributed.run --standalone --nproc-per-node=2 \
  -m examples.distributed_pulse --backend gloo --shape 48 24 24 \
  --steps 40 --checkpoints 2 --rank-budget-mib 512 --output scratch/dd-cpu.json

python -m torch.distributed.run --standalone --nproc-per-node=2 \
  -m examples.distributed_pulse --backend nccl --shape 96 48 48 \
  --steps 100 --warmup 1 --repetitions 3 --output scratch/dd-cuda.json
```

CUDA requires a readable distinct GPU UUID for every rank and explicit local
rank/device binding. UUIDs must match the physical-GPU list reported by
`nvidia-smi`; missing identity evidence and MIG instance UUIDs are rejected.
Launch only on available devices. Backend/group failures
are surfaced, never replaced by case batching. No real group was run
successfully on the current host. The launcher tests emulate a single-rank
protocol and verify compact multi-rank aggregation, not hardware performance.

Rank zero atomically writes JSON containing compact rank records and aggregate
metrics. Fields/material tensors are never collected. Timing includes halo
communication and synchronization, and objective reduction in forward timing.
Reported forward GCUPS is global cells times forward steps divided by the
maximum rank mean forward duration and 1e9. Backward includes checkpoint replay
and is reported separately. Warmup is optional and excluded from mean timings.
CUDA peaks include PyTorch allocated/reserved memory after warmup; CPU tensor
peak is explicitly unmeasured. Workspace reservation is reported separately
from measured peaks. Caller objective temporary arrays and communication/runtime
memory still require headroom beyond the core workspace budget. These outputs
are future measurement evidence, not an existing multi-GPU speed claim.

Every measured repetition retains raw forward/backward durations. JSON includes
PyTorch/CUDA versions and SHA256 hashes of the launcher and domain core. The
Fourier oracle uses constant-memory Python complex amplitudes plus an analytic
uniform-permittivity tangent recurrence, without an autograd time-history graph.
Objective and uniform-epsilon VJP accuracy gates run on every rank. With machine
epsilon `eps`, their tolerance is `atol + rtol*abs(reference)`, where
`rtol=min(1e-3,32*eps*steps)` and
`atol=global_cells*min(1e-4,16*eps*steps)`. This accounts for the extensive
objective and accumulated arithmetic while capping permissiveness on long runs.
Both actual/reference values must be finite. Failed gates retain compact JSON,
set forward GCUPS to null, and produce a nonzero exit on all ranks. Nonfinite
values in failed records are represented by strings to keep valid JSON.

The launcher always initializes a CPU Gloo control group first, including for
NCCL runs. Device binding errors and physical GPU identities are collected there
before NCCL is created, so duplicate or invalid CUDA assignments do not enter
NCCL collectives during admission. NCCL therefore requires working Gloo as well.
The explicit NCCL data group carries the domain, tensor reductions and timed
barriers; compact configuration/results use the CPU control group. Teardown
destroys the data group before the control group. Backend crashes or absent
ranks remain subject to the configured 120-second process-group timeout.

## Verified Linux Gloo CPU execution

Linux CI run [35533483790](https://github.com/hyoseokp/TorchFDTD/actions/runs/35533483790)
for revision `ec3a28f85b412866389781ffe5d6c2ace922ebf3` provides explicit
per-test evidence in the `pytest-junit` artifact `10612028089`. The three real
Gloo multi-process cases passed without skip/failure/error elements:

| Actual Gloo case | JUnit duration |
| --- | ---: |
| 2 ranks, real FP64, scalar epsilon, zero checkpoints | 4.150 s |
| 3 ranks, complex FP64, diagonal epsilon, two checkpoints | 5.797 s |
| 2 ranks, complex FP32, scalar epsilon, one checkpoint | 3.568 s |

These cases exercise rank-local propagation, E/H/material VJPs, halo transpose
identities and independent material finite differences against the resident
oracle. The [machine-readable extraction](validation/distributed_gloo_ci_ec3a28f.json)
records exact names, statuses, durations, skip reason, suite aggregates and the
raw XML SHA256. The full suite contains 1609 cases: 1180 passed, 429 skipped,
zero failures and zero errors. Individual Gloo success comes from its JUnit
case records, not aggregate counts or progress symbols.

The two-CUDA/NCCL case was explicitly skipped because it requires at least two
visible CUDA GPUs and NCCL. This evidence validates real CPU Gloo execution;
it supplies no CUDA/NCCL, multi-GPU scaling or throughput evidence. JUnit case
durations include test setup and checks and are not simulation benchmarks.
The local Windows Gloo initialization limitation described above remains.
