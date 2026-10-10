# Python-only simulation, batches and inverse design

All implemented solver settings are native `Project` fields. The UI serializes
this same model. No browser, server or commercial solver is required to create,
validate, run or analyze a native simulation. The feature checklist has separate
engine, Python, UI and independent FSP columns. Python coverage means the native
scope in that row. It does not mean every Lumerical scripting command exists.

## Units and the complete schema

Geometry, mesh steps and wavelengths in `Project` use micrometres. Time uses
seconds, frequency Hz, oscillator parameters radians/s, Bloch phase radians and
source carrier phase degrees. `FDTD`, the optional familiar editing facade, uses
SI metres for geometry and wavelength. Do not mix these two interfaces' lengths.

```python
from torchfdtd import Project, Simulation, Result

schema = Project.model_json_schema()  # Every accepted field, bound and enum.
project = Project.load('project.json')
settings = project.model_dump()
settings['region']['backend'] = 'cuda'
settings['region']['mesh_type'] = 'graded'
settings['region']['material_sampling'] = 'yee'
project = Project.model_validate(settings)  # Cross-field and geometry validation.
result = Simulation(project).run()
result.save('results/design.npz')
restored = Result.load('results/design.npz')  # allow_pickle=False internally.
```

`Project.model_json_schema()` covers materials, geometry, sources, all boundary
faces, mesh refinements, spectral settings and monitor inheritance. Optional
`Simulation.run(progress=callback, cancel=event, cuda_graph=True)` controls execution.
`result.signals` and `result.times` retain full point traces. `result.spectra`
contains complex DFT values. `result.electric` and `result.magnetic` retain final
Yee arrays. `result.field_monitor(name_or_id)` returns complex plane E/H fields,
coordinates, quadrature weights, frequencies and signed flux. UI plots can be
decimated, whereas these Python arrays retain their recorded resolution.

Use `torchfdtd.mesh.freeze_refinements` before removing geometry for a matching
reference. Use `torchfdtd.solver.estimate(project)` for mesh/memory estimates,
`torchfdtd.materials.permittivity(material, frequencies)` for analytic material
response, and `torchfdtd.spectra.frequency_samples(settings)` for actual nodes.

## Frequency fields and reflection/transmission

The optional fused real-field CUDA implementation is selected with
`project.region.cuda_kernel = 'fused'` and `backend = 'cuda'`. Install
`torchfdtd[cuda-kernels]` with a compatible CUDA 12 / NVRTC runtime first.
It supports CPML, periodic boundaries, uniform/graded meshes and existing ADE
materials. Complex Bloch configurations require `cuda_kernel = 'torch'`.
The default remains `torch`. `result.summary['cuda_kernel']` records the choice.
Every case in `BatchRunner` can select its own kernel through the same field.
This is a forward-only accelerator. A separate [`run_tensor_batch`](TENSOR_BATCH.md)
API shares E/H/source/point-trace launches across compatible real-field cases.
Neither path supplies adjoint gradients.


[`examples/flux_slab.py`](../examples/flux_slab.py) is a complete executable example.

```python
from torchfdtd import normalize_flux

R_signed = normalize_flux(sample.field_monitor('reflection'),
                          air.field_monitor('reflection'), subtract_incident=True)
T = normalize_flux(sample.field_monitor('transmission'),
                   air.field_monitor('transmission'))
valid = R_signed['valid'] & T['valid']
R = -R_signed['ratio'][valid]  # Reflected wave travels opposite the +x normal.
transmission = T['ratio'][valid]
```

Normalization rejects mismatched mesh, sources, duration, geometry of monitors,
frequencies and apodization. For reflection it subtracts complex incident E and H
before forming the cross product. It does not subtract two power spectra. A 1%
reference-power threshold masks weakly illuminated frequencies by default. Raw
fields and flux use reduced units, not volts/metre, amperes/metre or watts. A
point-field ratio is not a modal transmission or a collection efficiency.

## Actual independent-case concurrency

```python
from torchfdtd import Project, BatchRunner, parameter_sweep

def objective(result):
    return {'peak': result.summary['field_peak']}

if __name__ == '__main__':  # Required for process spawning, especially Windows.
    base = Project.load('sphere.json')
    cases = parameter_sweep(base, {
        'structures.0.radius': [0.4, 0.5, 0.6],
        'sources.0.wavelength': [1.45, 1.55],
    })
    with BatchRunner(backend='cuda', devices=[0], max_workers=2) as runner:
        report = runner.run(cases, objective=objective, objective_key='peak-v1',
                            output_dir='results/sweep', resume=True)
        report.raise_for_errors()
        for item in report.items:
            print(item.id, item.parameters, item.metrics, item.output)
            fields = item.load()
```

`parameter_sweep` creates the Cartesian product. `parameter_case` applies coupled
parameters atomically and validates the full scene. `BatchCase(id, project,
parameters)` accepts completely different structures, material models, sources,
boundaries and meshes. IDs are safe file basenames. Geometry remains in native µm.

The runner uses spawned processes because the underlying grid/backend library
has process-global state. Each worker owns its simulation and CUDA context.
Workers persist between calls if the admission plan does not change. Jobs on
multiple `devices` are independent cases. Single-grid MPI decomposition and
adjoint gradients are not implemented. The separate tensor API is documented
in the [cohort guide](TENSOR_BATCH.md). Multiple GPU contexts
do not guarantee simultaneous kernels or higher throughput on one GPU. Benchmark
one, two and four workers for the actual problem and select the best measured
setting. Small cases can be slower because setup and IPC dominate.

GPU admission caps each device to a fraction of currently free VRAM, by default
60%, and reserves 1.5 times the largest solver estimate plus 768 MiB per worker.
`memory_limit_mb` can add a stricter per-device cap. It is a conservative estimate,
not a guarantee against allocations by other applications. CPU concurrency uses
`max_workers`, `cpu_threads` and an optional aggregate memory cap.

Objectives must be module-level pickleable functions/callables returning a finite
scalar or dictionary of finite scalars. The objective executes in the worker on
the full `Result`. This avoids transferring large fields to the parent. Set
`keep_results=True` to retain results in parent RAM, or `output_dir` to save them.
Without either, only summaries and metrics are returned. No server-side code
evaluation or arbitrary expression language is involved.

Each saved case has NPZ data, status, parameters and metrics. Resume checks the
full validated project, package source fingerprint, objective key and result
checksum. Change `objective_key` whenever the objective or its external data
changes. A mismatch raises instead of reusing stale values. Errors are explicit
per-case records. `fail_fast=True` requests cancellation of other work. A supplied
`threading.Event` or `runner.cancel()` stops admission and running solves.

The equivalent CLI accepts a JSON list of `{id, project, parameters}`. `project`
is a project dictionary or a path relative to the manifest. For custom objectives,
use Python.

```shell
python -m torchfdtd.cli batch cases.json --backend cuda --workers 2 --output results/sweep --resume
```

## Inverse design

[`examples/inverse_design.py`](../examples/inverse_design.py) provides bounded
parallel differential evolution with an optical field objective. The optimizer
uses DE/rand/1/bin with clipped bounds and a forced crossover dimension. A fixed
seed makes candidate generation reproducible. Generation directories and JSON
history retain all evaluations. Resume rebuilds the same sequence and checks the
saved cases. It minimizes by default, or maximizes with `maximize=True`.

This is a black-box forward-solve method. It has no analytic/adjoint derivative,
no automatic fabrication constraints and no guarantee of a global optimum. The
example optimizes unnormalized local intensity, not a validated device figure of
merit. Supply a physically appropriate objective and an independent finer-mesh
validation for the final design.

Use `optimize(..., execution='tensor', cohort_size=4)` for shared CUDA population
launches on compatible real, fixed-duration grids. This path accepts local
objective functions and records the same deterministic proposal history. It
does not support resume. `tune_tensor_batch` can measure cohort candidates before
a long sequence of similar generations, with its full preparation cost reported
separately. See the [cohort guide](TENSOR_BATCH.md) and the runnable
[tuned design example](../examples/tuned_inverse_design.py).

```shell
python -m examples.flux_slab --backend cuda
python -m examples.inverse_design --backend cuda --workers 2
python -m benchmarks.batch_validation
```

## Coupled differentiable cases

Use [recompute_cases](RECOMPUTED_CASES.md) for compact outputs from independent
simulations feeding one coupled objective. Backward recomputes one case at a
time. This API trades an additional forward pass for lower graph residency
and is separate from the forward parallel batch runner.
