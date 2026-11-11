# Distributed slab execution

`torchfdtd.domain_decomposition.SlabDecomposition` splits one `Region` into
contiguous slabs along one axis, one slab per rank (process or GPU). Each rank
stores its owned rows plus one halo row toward every neighbour. The solvers run
their own code on the slab: the fused CUDA Yee kernels or the torch reference
step, CPML, soft sources, observations, the checkpointed adjoint and the
recorded-interface reversible adjoint. A halo row is filled immediately before
each difference that reads across a slab boundary, so every owned row sees the
same values in the same operation order as the single-device grid.

Supported entry points take a `decomposition=` keyword:

| Model | Forward | Derivative |
|---|---|---|
| `DifferentiableSimulation` | fused CUDA or torch CPU, point histories and online spectra | checkpointed adjoint, torch transpose on every slab |
| `DifferentiablePlaneSimulation` | collocated field planes | checkpointed adjoint |
| `ReversibleCPMLSimulation` | fused CUDA or torch CPU, x slabs | recorded-interface reconstruction per slab, fused CUDA adjoint |
| `ReversibleCPMLPlaneSimulation` | collocated field planes, x slabs | recorded-interface reconstruction |

## Usage

Every rank constructs the same project and decomposition, passes only its owned
material rows, and receives the complete signals or spectra. Every rank must
evaluate the same objective; `backward()` then leaves the gradient of the owned
rows in that rank's input.

```python
import torch
from torchfdtd import AdjointOptions, DifferentiableSimulation
from torchfdtd.domain_decomposition import SlabDecomposition, init_process_group_from_env

device = init_process_group_from_env()            # NCCL on cuda:LOCAL_RANK, Gloo on CPU
decomposition = SlabDecomposition(project.region, axis=0)
owned = slice(decomposition.begin, decomposition.end)
epsilon = full_epsilon[owned].to(device).requires_grad_()   # or build the owned rows directly
model = DifferentiableSimulation(project, AdjointOptions(checkpoints=4), decomposition=decomposition)
result = model(epsilon)                           # result.signals: all monitors, on every rank
loss = objective(result.signals)
loss.backward()                                   # epsilon.grad: this rank's rows
```

Launch with `torchrun --standalone --nproc_per_node=4 script.py`. Without
torchrun, `spawn_local(function, world_size, *arguments, backend='nccl')` starts
one process per local GPU and calls `function(rank, world_size, *arguments)`
after the group exists. For a reversible solve pass both maps sliced the same
way: `ReversibleCPMLSimulation(project, decomposition=d)(epsilon[owned],
fixed_epsilon=fixed[owned])`.

`ThreadTransport.group(n)` provides in-process thread ranks that share one
mailbox. It serves tests and single-process emulation. CPU autograd runs on the
calling thread. CUDA autograd runs every backward of one device on one engine
thread, so thread ranks that share a GPU can run the forward but not
concurrent `backward()` calls; the tests call the backward nodes directly.

## Exactness

The fields, point histories, recorded boundary traces and gradients computed
from time-domain objectives equal the single-device run bit for bit for any
rank count. Each owned row executes the single-device arithmetic. The epsilon
gradient is accumulated per cell, so no cross-rank reduction enters it. The
gathered observations are exact copies (one owner plus zeros).

Online spectra are not bit-identical. Each rank multiplies its own sample
columns by the DFT kernel, and BLAS/cuBLAS choose the summation blocking from
the column count. The time samples are identical. On the test fixtures the
spectra agree to 2.3e-8 of the peak (point spectra, 2 and 4 ranks). The plane
fixture matched exactly. Gradients of spectral objectives inherit this
rounding-level difference.

Verified configurations:

| Check | Ranks | Result |
|---|---|---|
| CPU thread ranks: signals and checkpointed gradient, x CPML spanning two slabs, plane and point sources across slabs, coincident monitors | 1, 2, 4 | `torch.equal` |
| CPU thread ranks: lower PMC on x, PEC y walls | 1, 2, 4 | `torch.equal` |
| CPU thread ranks: y split (PEC), z split (CPML) | 2, 3 | `torch.equal` |
| CPU thread ranks: periodic x ring, checkpointed and reversible signals and gradients, reconstruction drift | 1, 2, 4 | `torch.equal` |
| Gloo processes (Linux/WSL): checkpointed and reversible signals and gradients | 2, 4 | `torch.equal` |
| RTX 3060 thread ranks, fused CUDA forward and torch transpose against single-device `backward_kernel='torch'` | 1, 2, 4 | `torch.equal` |
| RTX 3060 thread ranks, reversible fused CUDA forward, interior kernels and fused adjoint | 1, 2, 4 | `torch.equal` |
| Online point spectra and collocated planes | 2, 4 | within 1e-6 relative |

Multiple GPUs with NCCL have not been run in this repository.

## Contract and limits

- Real fields. Bloch phase seams are not implemented.
- The split axis has uniform spacing. A periodic split axis must be x: the
  transposed halo derivative then reaches the seam cell first, in the
  single-device order. Nonperiodic splits may use x, y or z.
- Lower PMC/symmetric and PEC walls, upper PEC walls and CPML on any face are
  supported. Upper PMC/symmetric walls (stored face blocks) are rejected.
- Soft point and plane sources. One-way sources are rejected. TFSF and
  dispersive, tensor or source-waveform models remain single-device.
- The checkpointed adjoint uses the torch transpose on every slab
  (`backward_kernel='auto'` or `'torch'`). The fused CUDA transpose would read
  CPML adjoint memories of the neighbouring slab.
- The reversible path splits x (periodic), uses split E/H and split adjoint
  launches with one cell per thread, and excludes Lorentz density mixtures.
- Each rank checks inputs and admission collectively, so a rejected input or
  reservation raises on every rank. A failure after admission (for example an
  out-of-memory error inside a step) stops one rank; the others wait until the
  process-group timeout.
- Windows Gloo cannot create its TCP device. Run CPU process groups on Linux or
  WSL. NCCL needs one GPU per rank.

## Memory and communication

Admission runs on every rank for its own device before allocating fields.
`estimate_adjoint_memory(project, options, device=..., decomposition=d)` and
`ReversibleCPMLSimulation(..., decomposition=d).plan(device=...)` report the
rank's reservation: slab fields, CPML memories of the slab, checkpoints or
traces of the slab, the halo-extended material and halo rows. Observation
histories and gathered spectra keep their full size on every rank.

Each half step sends one row of the two tangential components to one
neighbour, `2*row_cells*4` bytes for FP32, where `row_cells` is the product of
the two other axes, so a forward step receives `16*row_cells` bytes per
neighbour. A checkpointed adjoint step adds two single-component derivative
rows per transposed curl and one H halo for its curl recomputation, and its
replays repeat the forward exchanges. A reversible step exchanges one E and
one H row for the reconstruction and two adjoint rows. The exchange is
synchronous: it does not overlap the kernels. `d.halo_bytes` counts the bytes
a rank received.

On one RTX 3060 (192x160x128 cells, fused forward, 200 steps) a single slab
costs the same as the undecomposed solve (1.28 ms/step). A periodic single
slab, which copies its own ring halos, costs 1.26 against 1.20 ms/step.
Thread ranks on one GPU run their slabs one after another, so they measure
correctness, not speed.

## Check and timing script

`examples/distributed_slabs.py` builds only the owned rows of a metalens-like
slab on every rank and writes per-rank timings, peak memory and SHA-256 digests
of the signals and owned gradient. Run it once on one rank with
`--digest-ranks 2 4 8` to digest the same row blocks of the single-device
gradient, then on several ranks:

```bash
torchrun --standalone --nproc-per-node=1 -m examples.distributed_slabs --mode reversible \
    --cells 512 512 256 --steps 400 --digest-ranks 2 4 --output scratch/r1.json
torchrun --standalone --nproc-per-node=4 -m examples.distributed_slabs --mode reversible \
    --cells 512 512 256 --steps 400 --output scratch/r4.json
```

With Gloo on WSL (64x48x64 cells, 20 steps, 2 ranks) the checkpointed and
reversible signal and gradient digests matched the single-rank run.
