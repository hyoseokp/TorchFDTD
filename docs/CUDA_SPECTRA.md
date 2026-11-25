# Shared CUDA frequency-plane monitors

The default `Region(cuda_monitor_kernel="auto")` uses these kernels for real CUDA fields when CuPy works. Select `"fused"` or `"torch"` independently of the Yee kernel, or choose **FDTD → Frequency monitor kernel**. The optional CUDA extension requires `pip install -e ".[cuda-kernels]"`.

```python
from torchfdtd import Simulation, run_tensor_batch

project.region.backend = "cuda"
project.region.cuda_kernel = "fused"
project.region.cuda_monitor_kernel = "fused"
single = Simulation(project).run()

for case in cases:  # A list of independently constructed Project objects.
    case.region.cuda_monitor_kernel = "fused"
batch = run_tensor_batch(cases, cohort_size=4)
batch.raise_for_errors()
```

A [complete Python example](../examples/spectral_batch.py) constructs independent TFSF sphere projects and evaluates signed spectral flux without the browser.

An explicit setting is serialized in project JSON and Python exports. Each result records the kernel that ran as `cuda_monitor_kernel`. Changing this implementation choice does not invalidate an otherwise matching flux-normalization signature. CPU and complex Bloch field monitors reject `"fused"` explicitly. Their reference monitor path remains available.

## Algorithm and numerical scope

The same `plane_plan` and `interpolation_map` define quadrature positions, clipped physical cell widths, downsampling and staggered Yee interpolation. Three shared kernels replace the phase expression and each plane's gather, multiply, reduction, stack and frequency-broadcast operations:

1. Evaluate each distinct frequency/time-step group's phase with double-precision `sincos`, convert to the selected complex precision and apply the magnetic half-step factor. This uses absolute time, without a recurrence that can accumulate phase drift.
2. Interpolate only the E/H components required by the selected outputs at each plane point and multiply by the component family's apodization window and sampling interval. This uses four neighbors in 2D or eight in 3D.
3. Accumulate every complex frequency/point/component value from that sampled plane. Each thread owns its accumulator, with no atomics or inter-case reductions.

The second block-grid coordinate chooses a plane, including planes belonging to different independent simulations. A pointer table preserves separate E/H arrays, interpolation maps and complex accumulators. Planes may have different positions, dimensions, downsampling, frequency counts and apodization. Frequency/time-step matches share phase evaluation with one writer per frequency. The original Torch phase expression remains an internal ablation path. E and H windows retain their distinct sample times. Phase tests include two different frequency groups, 257 frequencies and absolute counters exceeding one billion, in both precisions.

Only a compact real plane buffer is added per monitor, with one channel per required field. There is no volume time history or time-by-frequency table. Accumulators remain part of the existing graph reset and diagnostic state. Scratch planes and phases are completely overwritten before each use. The CUDA module and Torch-owned allocations remain alive throughout graph replay. Compilation disables multiply-add contraction and subnormal flushing, as in the Yee kernel.

Supported fields are real float32/64, uniform or graded 2D/3D grids with CPML or periodic boundaries. Eager execution, CUDA Graphs, single solves, process jobs and shared tensor cohorts use the same monitor implementation. Fused and reference monitor selections may coexist in a cohort. Material updates and sources are unchanged. This adds no adjoint or multi-GPU domain decomposition.

Interpolation reduction order can change floating-point rounding relative to the Torch path. Tests compare the **complete complex DFT**, not only a point trace or real quadrature. Accuracy gates are declared before benchmarking. Fused single-case and fused batch DFT arrays must match bitwise. Final E/H and point traces must also match the previous monitor implementation bitwise because observation does not feed back into the field update. Flux is still evaluated in host complex128 to avoid float32 underflow.

## Reproduction

```bash
python -m pytest tests/test_cuda_monitors.py
python -m benchmarks.spectral_ensemble --sizes 32 64 --count 8 --cohort 4 --steps 800 --repeats 3
python -m benchmarks.report_spectral --input results/open-source/spectral-ensembles.json
```

The [initial spectral ensemble report](validation/SPECTRAL_ENSEMBLE_REPORT.md) retains the earlier implementation with Torch phase evaluation. Its historical measurements and source hashes are unchanged. The [phase and graph follow-up](validation/GRAPH_ENSEMBLE_REPORT.md) measures the next phase implementation before selective-output support and retains regressions. Both studies give the external flaport/fdtd baseline **the same fused plane-DFT observation adapter**. This does not claim that upstream provides this plane monitor or an optimized independent-case batch API. Native sequential and native batch ablations separate monitor fusion from cohort scheduling. FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.

## Selective outputs, precision and sampling

`FieldMonitor.record_fields`, `record_poynting` and `record_flux` independently select exported quantities. Their dependency union determines the online accumulator shape. A flux-only plane needs four tangential E/H components instead of six. Those internal fields are not exported when `record_fields=()`. Missing outputs are represented by named empty channel axes or `flux=None`, never fabricated zero fields. NPZ preserves the names. Flux ratios work with flux-only records. Incident-field subtraction requires explicitly storing all four tangential fields in both runs.

`dft_precision="float64"` uses complex128 accumulation even with float32 fields. Interpolation and the sampled window product still use field precision. This does not turn a float32 solver into a float64 solver. Mixed monitor precisions are grouped into separate CUDA launches. `downsample_xyz=(sx,sy,sz)` controls each transverse axis and overrides the legacy scalar stride. `spatial_interpolation="nearest"` snaps the plane's normal coordinate to a mesh node. Transverse quadrature continues to use merged, clipped bins. The default is the specified plane.

`time_downsample=s` records plane DFT samples at step indices 0, s, 2s, ... with weight `s*dt`. The E timestamp is `(q+1)*dt` and H is `(q+1.5)*dt`. Skipped steps omit CUDA gather and accumulation, while the solver, sources, snapshots and full point traces keep their original sampling. This decimation has no antialias filter. Requested frequencies must lie below `1/(2*s*dt)`, and users must also ensure the actual signal has negligible higher-frequency content. Use stride 1 for an unqualified full-band result. This option changes the quadrature and is not part of exact-output speed comparisons.

`SpectrumSettings.chebyshev_nodes` selects `"roots"` (legacy interior nodes) or `"lobatto"` (endpoints included). `use_source_limits=True` dynamically uses the union of enabled, explicitly ranged wavelength/frequency sources. Other pulse definitions require explicit monitor limits. Custom tables remain authoritative. Set `Monitor.inherit_apodization=False` to inherit global frequencies while retaining local apodization. All these controls are available in the property panel and Python API. See [the runnable example](../examples/selective_spectra.py).

## Optional multi-step graph replay

`Simulation(project).run(cuda_graph_steps=8)` and `run_tensor_batch(cases, cuda_graph_steps=8)` capture one-step and eight-step graphs. The accepted range is 1--64 and the default remains 1. Both graphs execute every original Yee update, source sample, point sample and plane DFT. This is graph unrolling, not a larger physical time step or shared-memory temporal blocking.

The host scheduler stops exactly at every snapshot, diagnostic and progress callback. A remainder smaller than the requested chunk uses one-step replays. Single-run auto shutoff therefore checks and stops on its original steps. Tensor batches still reject auto shutoff. Cancellation is polled between replays, with up to `cuda_graph_steps` steps per polling interval. A frequent callback can eliminate unrolling entirely.

Graphs use separate private memory pools, because their replay order can vary. Warmup and each capture reset all mutable fields, CPML/ADE/TFSF state, traces and DFT accumulators. `summary.cuda_graph_steps` and `summary.cuda_graph_replays` expose the actual execution. Larger graphs add preparation cost and can increase reserved memory. The memory admission estimate does not guarantee capacity for graph construction. CUDA OOM is reported rather than silently falling back. CPU and eager runs reject a requested chunk larger than one.

The external benchmark adapter receives the same unrolling option. Full-wall results include preparation of both graphs, so a shorter loop alone does not qualify as a speed advantage. The default is not changed on the basis of a timing pilot.
