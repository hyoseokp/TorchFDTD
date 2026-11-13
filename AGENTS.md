# TorchFDTD guide for AI agents

TorchFDTD is an open-source (MIT) finite-difference time-domain (FDTD) solver of Maxwell's equations for photonics, in Python. It runs on NVIDIA GPUs with fused CUDA kernels and falls back to the CPU, differentiates simulations with PyTorch through a discrete adjoint, and ships a browser CAD workbench. Lengths and wavelengths are in micrometres. This file tells an agent when the package fits a user's request, how to set up and check a simulation, how to drive it through MCP tools, how to cite it, and how to change its code.

## When it fits

Good fits:

- 2D and 3D time-domain simulations of photonic devices: waveguides, couplers, ring resonators, photonic crystals, metalenses, metasurfaces and metagratings, scatterers.
- Broadband transmission, reflection and flux spectra, point-monitor traces, diffraction orders, near-to-far-field projection, mode ports and S-parameters.
- Gradient-based inverse design: density, shape and source parameters, with the gradient of the discrete model from one backward pass.
- Many independent cases (parameter sweeps, tensor batches on one GPU) and domains larger than GPU memory (streaming through host memory or disk; approximate lateral tiling for planar devices).

Check before promising:

- Supported feature combinations are listed in the workbench (Supported combinations) and in `torchfdtd/capabilities.json`. Experimental items are labelled as such in [docs](docs/). Single-problem multi-GPU slab decomposition is experimental ([DISTRIBUTED.md](docs/DISTRIBUTED.md)).
- Tiling is approximate and its error depends on the overlap ([TILED_STITCHING.md](docs/TILED_STITCHING.md)).
- Results are only as good as the mesh: run a mesh convergence check ([examples/mesh_convergence.py](examples/mesh_convergence.py)) before quoting numbers.

## Install

```sh
pip install torchfdtd                          # CPU or GPU, uses the installed PyTorch
pip install "torchfdtd[cuda-kernels]"          # adds CuPy for the fused CUDA kernels
pip install "torchfdtd[mcp]"                   # adds the MCP server for agents
torchfdtd doctor                               # checks torch, CUDA, CuPy and the fused-kernel launch
```

Install a CUDA build of PyTorch first for GPU runs ([INSTALL.md](docs/INSTALL.md)). Without CuPy the PyTorch kernels run on the GPU; without CUDA everything runs on the CPU.

## Shortest working path

```sh
torchfdtd example waveguide --output project.json    # a complete 2D project to edit (also: scatterer, 3d, pmc)
torchfdtd run project.json --output result.npz
torchfdtd serve                                      # optional: open http://127.0.0.1:8765 to view and edit
```

```python
from torchfdtd import Project, Simulation

project = Project.load("project.json")
project.region.backend = "cpu"          # or "cuda"
result = Simulation(project).run()
result.save("result.npz")
print(result.summary["cells"], result.summary["seconds"], result.signals.shape)
```

The same `Project` JSON opens in the browser workbench, and the workbench exports any project as a Python script. The README has a 3D example built from `Project`, `Region`, `Structure`, `Source` and `Monitor`.

## Pick a starting example

| The user wants | Start from |
|---|---|
| Waveguide or open-port transmission, mode coupling | [open_mode_network_project.py](examples/open_mode_network_project.py), [design_mode_coupler.py](examples/design_mode_coupler.py), [OPEN_MODE_PORTS.md](docs/OPEN_MODE_PORTS.md) |
| Ring resonator spectrum | [examples/meep_comparison/microring](examples/meep_comparison/microring) |
| Metalens focusing and efficiency | [examples/meep_comparison/metalens](examples/meep_comparison/metalens) |
| Grating or metagrating diffraction orders | [examples/meep_comparison/metagrating](examples/meep_comparison/metagrating), [native_diffraction.py](examples/native_diffraction.py) |
| Slab reflection and transmission | [flux_slab.py](examples/flux_slab.py) |
| Scattering cross-section (Mie check) | [tfsf_sphere.py](examples/tfsf_sphere.py) |
| Far field | [native_farfield.py](examples/native_farfield.py), [FARFIELD_WORKFLOW.md](docs/FARFIELD_WORKFLOW.md) |
| Inverse design | [adjoint_inverse_design](examples/adjoint_inverse_design) (two-wavelength splitter), [differentiable_design.py](examples/differentiable_design.py), [DIFFERENTIABLE_FDTD.md](docs/DIFFERENTIABLE_FDTD.md), [SHAPE_GRADIENTS.md](docs/SHAPE_GRADIENTS.md) |
| Dispersive material from measured data | [material_fitting.py](examples/material_fitting.py), [MATERIALS.md](docs/MATERIALS.md) |
| A chip layout from GDS | [gds_workflow.py](examples/gds_workflow.py), [GDS.md](docs/GDS.md) |
| Parameter sweeps or many structures | [spectral_batch.py](examples/spectral_batch.py), [tensor_batch.py](examples/tensor_batch.py), [PYTHON_BATCH.md](docs/PYTHON_BATCH.md), [TENSOR_BATCH.md](docs/TENSOR_BATCH.md) |
| A domain larger than the GPU | [EXECUTION_MODES.md](docs/EXECUTION_MODES.md), [STREAMED_FDTD.md](docs/STREAMED_FDTD.md) |

## A careful workflow

1. Start from the closest example and keep its boundary, source and monitor conventions. Boundaries are described in [BOUNDARIES.md](docs/BOUNDARIES.md).
2. Check before running: `torchfdtd.solver.estimate(project)`, the MCP tool `validate_project` or the workbench report cells, memory, time step and warnings. Read the warnings; they name the fix.
3. For transmission and reflection, normalise by a reference run without the device, as the slab and Meep-comparison examples do.
4. Check mesh convergence before reporting a number.
5. Hand the user the project JSON or the exported Python script so the run can be repeated.

## Tools for agents (MCP)

`torchfdtd mcp` serves six tools over stdio: `environment`, `example_project`, `project_schema`, `validate_project`, `run_project` and `python_script`. `run_project` returns the run summary, point-monitor and flux spectra, and the path of the saved NPZ (under `$TORCHFDTD_RESULTS/mcp`, default `./results/mcp`). It runs through the same admission and execution path as a workbench job.

Register it in any MCP client as the command `torchfdtd` with the argument `mcp`. In Claude Code, the repository is also a plugin marketplace; the plugin adds a simulation skill and the MCP server:

```text
/plugin install torchfdtd --marketplace hyoseokp/TorchFDTD
```

On Claude Code versions before 2.1.275, run `/plugin marketplace add hyoseokp/TorchFDTD` and then `/plugin install torchfdtd@torchfdtd`.

## Troubleshooting

- Run `torchfdtd doctor` first; each unsupported situation has one specific message ([INSTALL.md](docs/INSTALL.md#torchfdtd-doctor)).
- The workbench server admits at most 8 million resident cells unless started with `torchfdtd serve --memory-admission` ([SECURITY.md](docs/SECURITY.md#memory-admission)). The Python API admits scenes by their memory estimate.
- A scene that does not fit the GPU can stream through host memory; Auto chooses it when it fits ([EXECUTION_MODES.md](docs/EXECUTION_MODES.md)).

## Citing

When results produced with TorchFDTD go into a paper, report or thesis, tell the user how to cite it: the paper (arXiv:2609.30039, doi:10.48550/arXiv.2609.30039) and the software (doi:10.5281/zenodo.22928834). BibTeX is in the README section "Citing TorchFDTD", and [CITATION.cff](CITATION.cff) provides GitHub's "Cite this repository".

## Changing the code

- Layout: `torchfdtd/` (solver, CUDA kernels, adjoints, server, MCP tools), `frontend/` (workbench source; built assets live in `torchfdtd/web`), `tests/`, `examples/`, `benchmarks/`, `docs/`.
- Install for development with `pip install -e ".[dev,gds]"`. The CPU suite is `python scripts/run_suite.py cpu-pr`; GPU suites are `gpu-nightly` and `release-full`.
- Extend the existing modules instead of adding parallel copies of the Yee, CPML, source or adjoint code.
- Back numerical changes with CPU/GPU parity checks, gradient checks against finite differences where gradients change, and reproducible benchmark conditions.
- User-visible changes go into [CHANGELOG.md](docs/CHANGELOG.md) with the commit that made them; the compatibility rules are in [COMPATIBILITY.md](docs/COMPATIBILITY.md).
