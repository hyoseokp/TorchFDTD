# Tensor materials in native projects

Native projects accept a nondispersive real symmetric relative-permittivity
tensor. The six `epsilon_tensor` entries are `xx, yy, zz, xy, xz, yz` in the
Cartesian coordinate basis. All eigenvalues must be at least one. This connects
the existing discrete tensor operator to the material editor, JSON/Python
projects, CLI, point-monitor results, field snapshots and NPZ output.

```python
import torch
from torchfdtd import (Material, Project, Region, Structure, Source, Monitor,
                       Simulation, tensor_from_project)

project = Project(
    region=Region(dimension="3d", size=(1.2, 1.2, 1.2), mesh=0.2,
                  steps=20, backend="cpu", material_sampling="yee",
                  boundaries={a + "_" + s: {"kind": "periodic"}
                              for a in "xyz" for s in ("min", "max")}),
    materials=[Material(name="Tensor", model="tensor",
                        epsilon_tensor=(2.2, 2.6, 3.0, 0.12, 0.08, -0.1))],
    structures=[Structure(name="Inclusion", material="Tensor", kind="sphere",
                          radius=0.35)],
    sources=[Source(component="Ez", center=(-0.2, 0, 0), pulse="continuous")],
    monitors=[Monitor(component="Ez", center=(0.2, 0, 0))],
)
result = Simulation(project).run()
result.save("tensor.npz")

# Fixed geometry, differentiable material table. Choose device="cuda" on a GPU.
adapter = tensor_from_project(project, device="cpu", checkpoints=4)
parameters = torch.tensor([project.materials[0].epsilon_tensor],
                          dtype=torch.float32, requires_grad=True)
loss = adapter(parameters).signals.abs().square().mean()
loss.backward()
print(parameters.grad)  # One row per material, six Cartesian derivatives.
```

The material table is FP32 with shape `(len(project.materials), 6)`. Scalar
dielectrics default to a diagonal tensor. Geometry membership is fixed, sampled
at the common nodes `mesh_nodes[:-1]`, with the existing mesh-order precedence.
Rasterization retains the table's PyTorch graph. The FDTD backward uses bounded
checkpoint replay, and does not retain a graph for every timestep. This API
does not differentiate geometry membership or source parameters.

In the browser, select **Materials → Symmetric dielectric tensor**, enter six
coefficients, then apply and run a supported 3D scene. The explicit
**Use supported tensor sampling** button stages staircase geometry and Yee
field sampling in the draft before applying it. Invalid tensors leave
the current project unchanged. Scalar n/k preview and isotropic optical-data
fitting are disabled for tensor materials. The material slice displays the
selected field component's diagonal permittivity, labeled in result metadata.

Supported scope is resident FP32 on CPU/CUDA, uniform 3D grids, staircase
geometry, point electric soft sources and point E/H monitors at every step.
Periodic/Bloch fields may be complex64. In this native workflow CPML requires
a fixed isotropic background through the PML and one additional node row, and
material gradients in that collar are zero; the explicit
`TensorDielectricSimulation(..., cpml_material='tensor')` API admits tensors
inside CPML under the geometric criterion documented in the plan. Tensor computation uses Torch operations, with no fused
tensor-kernel or throughput claim.

Dispersive tensors, PEC/PMC mixing, spatial streaming, nonuniform grids,
subpixel homogenization and automatic shutoff remain outside this native
workflow. A common-node tensor interface is not the scalar solver's independent
Yee-component material sampling, so discontinuous geometry is not claimed to
match the scalar rasterizer.

## Measured native workflow checks

The [sanitized validation record](validation/tensor_native_workflow.json)
contains exact test/runtime SHA256 hashes, tolerances and raw per-case errors.
The base checkout was `f355601860c563cbae5a4a57bb6aa1b5dadd6b6c` plus the
working-tree implementation identified by those hashes. This is not evidence
that the base commit alone implemented the workflow.

Three focused CPU native integration cases passed, covering periodic/CPML
adapter agreement, final fields, NPZ, progress/cancellation and preallocation
admission. Two additional CPU cases compare native point-drive histories and
final E/H against independently constructed NumPy Fourier constitutive/curl
symbols for uniform rotated tensors with periodic and nonzero Bloch boundaries.
They use relative tolerance 5e-5 and absolute tolerance 2e-7. A subsequent
snapshot-storage change only made displayed FP32 planes own their memory;
the recorded CUDA run validates the final runtime hashes.

One CUDA integration test passed on an RTX 3060 with Torch 2.10.0+cu126,
CUDA 12.6 and driver 591.86. Periodic, Bloch and CPML native outputs and
six-component material-table VJPs matched CPU references. The largest trace
error was 9.3133e-10 and the largest table-VJP error was 1.0005e-11.
Native Torch peak deltas were at most 8,627,712 bytes, against admitted
reservations of at least 68,155,440 bytes. The plans include a conservative
64 MiB CUDA library allowance. These are allocator deltas, not total-device
or process memory measurements. All captured runtime hashes matched after
the CUDA run.

The tests use small synthetic 16 by 6 by 6 grids and 12 steps. They establish
native workflow correctness within the admitted scope, not performance,
large-domain capacity, arbitrary interface accuracy or physical convergence.
