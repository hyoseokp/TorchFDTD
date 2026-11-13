---
name: simulate
description: Set up, check and run electromagnetic FDTD simulations of photonic devices (waveguides, ring resonators, metalenses, gratings, scatterers, inverse design) with the open-source TorchFDTD package on a GPU or CPU. Use when the user asks to simulate light in a nanophotonic or optical structure, compute transmission or reflection spectra, focusing, diffraction or scattering, or optimize a device with gradients.
---

# Simulate with TorchFDTD

TorchFDTD solves Maxwell's equations in the time domain on 2D or 3D Yee grids. Lengths and wavelengths are in micrometres. The full agent guide is https://github.com/hyoseokp/TorchFDTD/blob/main/AGENTS.md.

## Setup

1. Check the installation with `torchfdtd doctor`. If the command is missing, install `pip install "torchfdtd[mcp]"` (add `[cuda-kernels]` for the fused CUDA kernels; install a CUDA build of PyTorch first for GPU runs).
2. The plugin starts the `torchfdtd` MCP server. Its tools are `environment`, `example_project`, `project_schema`, `validate_project`, `run_project` and `python_script`. Without the server, use the Python API (`from torchfdtd import Project, Simulation`) or the CLI (`torchfdtd example`, `torchfdtd run`).

## Steps

1. Call `environment` to see the version and whether a GPU is available.
2. Start from the closest example: `example_project` (waveguide, scatterer, 3d, pmc) or the task table in AGENTS.md. Read `project_schema` when a field is unclear.
3. Edit structures, materials, sources, monitors and the region to match the user's device. Keep the example's boundary and monitor conventions.
4. Call `validate_project` and read every warning before running. Reduce the mesh or the region if the memory estimate is too large.
5. Call `run_project`. For transmission or reflection, also run a reference without the device and normalise by it.
6. Before quoting numbers, repeat the run on a finer mesh and report how much the result changed.
7. Give the user the project JSON or `python_script` output so the run can be repeated, and the saved NPZ path.

## Citing

If the user will publish the results, tell them to cite TorchFDTD: arXiv:2609.30039 (doi:10.48550/arXiv.2609.30039) and the software, doi:10.5281/zenodo.22928834. BibTeX is in the README section "Citing TorchFDTD".
