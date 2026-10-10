# Compatibility and support policy

Version of record: **1.1.7** (`pyproject.toml`, `torchfdtd.server` and `/api/health`
carry the same string). This document fixes what the public API is, how it may change,
which persisted formats exist and which reader accepts which version, how a numerical
bug is graded, and how a fix that changes results is announced. The rules are checked by
[tests/test_compatibility_policy.py](../tests/test_compatibility_policy.py) and recorded
against gate task G9-04. User-visible changes are listed in [CHANGELOG.md](CHANGELOG.md).

## Public API surface

The public API is exactly the set of names exported by `torchfdtd/__init__.py` through
`__all__`: 236 names at this version, listed below by area and defining module.
Anything else, including every `torchfdtd.<module>` not named here, the `torchfdtd.server`
routes, the CLI flags and the browser workbench, is an internal interface that may change
without a deprecation period. The HTTP routes are stable only for the bundled workbench of
the same version; a client that targets `/api/...` pins the package version.

| Area | Module | Exported names |
| --- | --- | --- |
| Project model | `torchfdtd.models` | `Project`, `Region`, `MeshRefinement`, `Structure`, `Source`, `SourceTimeSettings`, `TimeSignal`, `Monitor`, `FieldMonitor`, `Material`, `BoundaryFace`, `Boundaries`, `SpectrumSettings`, `LorentzPole`, `RunControl`, `MaterialProvenance` |
| Mesh | `torchfdtd.mesh` | `freeze_refinements` |
| Monitors | `torchfdtd.field_monitors` | `normalize_flux` |
| Forward solver | `torchfdtd.solver` | `Simulation`, `Result` |
| Session helper | `torchfdtd.session` | `FDTD` |
| Batches | `torchfdtd.batch` | `BatchCase`, `BatchItem`, `BatchReport`, `BatchRunner`, `run_batch`, `parameter_case`, `parameter_sweep` |
| Design | `torchfdtd.design` | `DesignResult`, `optimize` |
| Convergence | `torchfdtd.convergence` | `ConvergenceReport`, `mesh_refinement_projects`, `mesh_convergence` |
| Batches | `torchfdtd.tensor_batch` | `run_tensor_batch` |
| Batches | `torchfdtd.grouped_batch` | `plan_grouped_batch`, `run_grouped_batch` |
| Batches | `torchfdtd.tuning` | `TensorBatchTuning`, `tune_tensor_batch` |
| FSP writeback | `torchfdtd.fsp_geometry` | `write_fsp_geometry`, `write_fsp_scene` |
| Materials | `torchfdtd.optical_data` | `OpticalData` |
| Materials | `torchfdtd.material_fit` | `FitOptions`, `MaterialFitResult`, `fit_material`, `material_fit_report`, `MaterialImportResult`, `MaterialBandWarning`, `import_material_table`, `discretization_report`, `fit_band_extrapolation`, `fit_discrete_lorentz` |
| Sources | `torchfdtd.source_preview` | `preview_source`, `effective_bandwidth` |
| Results | `torchfdtd.results` | `ResultRecord`, `guarded_ratio`, `reflection_transmission`, `s_parameters`, `mode_decomposition`, `diffraction_record`, `farfield_record`, `nearzone_record` |
| Differentiation | `torchfdtd.differentiable` | `AdjointOptions`, `DifferentiableSimulation`, `DifferentiableResult`, `smooth_sphere_epsilon` |
| Differentiation | `torchfdtd.adjoint_memory` | `estimate_adjoint_memory` |
| Differentiation | `torchfdtd.adjoint_spectrum` | `DifferentiableSpectrum` |
| Capacity | `torchfdtd.memory_profile` | `profile_memory_transfers` |
| Streamed execution | `torchfdtd.streamed` | `StreamedAdjointOptions`, `StreamedSimulation`, `estimate_streamed_memory`, `StreamedStoragePlan`, `select_streamed_storage` |
| Streamed execution | `torchfdtd.streamed_tuning` | `StreamedTuning`, `tune_streamed`, `tune_streamed_dispersive` |
| Differentiation | `torchfdtd.adjoint_planes` | `DifferentiablePlaneSimulation`, `DifferentiablePlaneResult` |
| Objectives | `torchfdtd.information` | `GaussianTargetResult`, `gaussian_target_information`, `shot_read_covariance` |
| Batches | `torchfdtd.recomputed_batch` | `recompute_cases` |
| Objectives | `torchfdtd.detector_allocation` | `quadrant_intensity_allocation` |
| Objectives | `torchfdtd.polarization` | `calibrate_plane_polarization`, `mix_plane_fields` |
| Objectives | `torchfdtd.electron_model` | `spectral_interpolate`, `spectral_electron_model`, `exposure_target_information`, `SpectralElectronModel`, `ExposureInformation` |
| Periodic design | `torchfdtd.density_layer` | `periodic_density_layer`, `bounded_density_layer` |
| Objectives | `torchfdtd.pupil_response` | `spectral_pupil_response` |
| Periodic design | `torchfdtd.periodic_response` | `periodic_layer_response` |
| Periodic design | `torchfdtd.reference_cache` | `PlaneReferenceCache` |
| Differentiation | `torchfdtd.dispersive_adjoint` | `DispersiveSimulation`, `DispersivePlaneSimulation` |
| Streamed execution | `torchfdtd.streamed_dispersive` | `StreamedDispersiveSimulation`, `estimate_streamed_dispersive_memory` |
| Differentiation | `torchfdtd.execution_tuning` | `AdjointExecutionPolicy`, `AdjointExecutionSelection`, `tune_adjoint_execution` |
| Batches | `torchfdtd.adjoint_batch` | `AdjointCase`, `AdjointBatchOptions`, `AdjointBatchResult`, `RecomputedAdjointBatch` |
| Periodic design | `torchfdtd.periodic_adjoint` | `PeriodicLayerResponse` |
| Periodic design | `torchfdtd.response_cache` | `PeriodicResponseCache` |
| Periodic design | `torchfdtd.periodic_design` | `PeriodicDesignConfig`, `periodic_design_plan`, `run_periodic_design` |
| Differentiation | `torchfdtd.differentiable_geometry` | `DifferentiableSolid`, `smooth_geometry_epsilon`, `spline_outline` |
| Streamed execution | `torchfdtd.streamed_geometry` | `StreamedGeometry`, `streamed_geometry`, `StreamedGeometrySimulation`, `StreamedGeometryPlaneSimulation` |
| Streamed execution | `torchfdtd.streamed_density` | `StreamedDensityLayer`, `streamed_density_layer`, `StreamedDensitySimulation`, `StreamedDensityPlaneSimulation` |
| Design | `torchfdtd.design_parameterization` | `DensityParameterization` |
| GDS | `torchfdtd.gds` | `GDSLayer`, `GDSPortLayer`, `GDSPort`, `GDSLimits`, `GDSImport`, `import_gds`, `export_gds` |
| Mode ports | `torchfdtd.mode_ports` | `WaveguideMode`, `solve_waveguide_modes`, `mode_power_overlap`, `normalized_mode_power` |
| Mode ports | `torchfdtd.mode_injection` | `ModalLaunch`, `prepare_modal_launch`, `ModeInjectedPlaneSimulation`, `modal_plane_amplitudes`, `modal_s_parameters` |
| Radiation | `torchfdtd.radiation` | `DiffractionResult`, `diffraction_orders`, `diffraction_efficiency`, `FarFieldResult`, `project_farfield`, `normalized_farfield_intensity`, `NearZoneResult`, `project_nearzone`, `farfield_at_points`, `spherical_directions`, `spherical_points`, `cartesian_plane_points`, `kspace_directions` |
| Tensor media | `torchfdtd.anisotropy` | `TensorDielectricSimulation` |
| PMC faces | `torchfdtd.pmc_simulation` | `EndpointSimulation` |
| Tensor media | `torchfdtd.tensor_project` | `TensorProject`, `tensor_from_project` |
| Domain decomposition (HPC, blocked) | `torchfdtd.domain_decomposition` | `DistributedYeeDomain`, `SlabOwnership`, `distributed_capabilities`, `plan_domain_decomposition` |
| PMC faces | `torchfdtd.endpoint_project` | `EndpointProject`, `endpoint_from_project` |
| Mode networks | `torchfdtd.mode_network` | `FixedModePort`, `ModeNetwork`, `ModeNetworkResult` |
| PMC faces | `torchfdtd.pmc_cpml` | `EndpointCPMLSimulation` |
| Radiation | `torchfdtd.radiation_io` | `native_radiation_plane`, `load_native_radiation_plane` |
| Reversible adjoints | `torchfdtd.reversible` | `ReversibleOptions`, `ReversibleSimulation` |
| Reversible adjoints | `torchfdtd.reversible_cpml` | `ReversibleCPMLOptions`, `ReversibleCPMLSimulation` |
| Reversible adjoints | `torchfdtd.reversible_cpml_planes` | `ReversibleCPMLPlaneSimulation` |
| Mode ports | `torchfdtd.open_mode_ports` | `OpenWaveguideMode`, `solve_open_waveguide_modes` |
| Mode ports | `torchfdtd.open_mode_injection` | `OpenPortOptions`, `OpenModalLaunch`, `prepare_open_modal_launch` |
| Mode networks | `torchfdtd.mode_network_project` | `ModeNetworkConfig`, `mode_network_plan`, `run_mode_network` |
| Mode networks | `torchfdtd.mode_branches` | `ModePort`, `ModeBranchNetwork`, `prepare_aperture_modal_launch`, `branch_network_from_ports` |
| Radiation | `torchfdtd.radiation_box` | `StoredRadiationBox`, `native_radiation_box` |
| Radiation | `torchfdtd.radiation_box_io` | `load_native_radiation_box` |
| Differentiation | `torchfdtd.source_adjoint` | `SourceWaveformSimulation`, `SourceWaveformPlaneSimulation` |
| Differentiation | `torchfdtd.source_parameters` | `gaussian_waveform` |
| Streamed execution | `torchfdtd.streamed_work` | `estimate_streamed_work` |
| Streamed execution | `torchfdtd.streamed_planning` | `StreamedWorkPlan`, `plan_streamed_work` |
| Tiled execution | `torchfdtd.tiled` | `TilePlan`, `TileSpec`, `StitchedPlane`, `plan_tiles`, `run_tiled`, `stitch_planes`, `propagate_plane`, `farfield_from_stitched`, `suggest_overlap`, `TiledPlaneSimulation` |
| Angular-spectrum propagation | `torchfdtd.angular_spectrum` | `PlaneSpectrum`, `SectionResult`, `VolumeResult`, `PointsResult`, `plane_spectrum`, `propagate_section`, `propagate_volume`, `propagate_points`, `volume_bytes` |
| Mode ports | `torchfdtd.ports` | `FixedPortSectionError`, `ModeTrackingWarning`, `WeakModeWarning`, `TrackedPortModes`, `PortDiagnostics`, `track_port_modes`, `port_diagnostics`, `degenerate_clusters`, `overlap_matrix`, `confinement_factor`, `shift_reference_plane`, `deembed_s_matrix`, `separate_directions`, `port_normalization`, `fixed_port_section` |
| Design | `torchfdtd.fabrication` | `FeatureSizes`, `measure_feature_sizes`, `fabrication_perturbation`, `binary_structures`, `morphological_open`, `square_offsets` |
| Design | `torchfdtd.design_problem` | `Continuation`, `DesignProblem` |

## Versioning and deprecation rule

- The package follows `MAJOR.MINOR.PATCH` with a `.devN` suffix on unreleased builds. While
  `MAJOR` is 0, a breaking change of a public name or of a persisted format is allowed only
  with a `MINOR` increment, a changelog entry under **Changed** or **Removed**, and the
  migration stated in that entry.
- A public name that is going away keeps working for at least one released `MINOR` version
  after the change is announced, emits `DeprecationWarning` naming its replacement, and is
  listed under **Deprecated** in the changelog of the version that announced it. Removal is
  a **Removed** entry in a later `MINOR` version.
- A `PATCH` version changes no public signature, no persisted format and no default that
  alters a result; it may fix a numerical bug, in which case the result-impact rule below
  applies.
- New keyword arguments get defaults that reproduce the previous behaviour. A default that
  changes a result is a `MINOR` change with a result-impact notice.
- Optional dependencies (`gds`, `cuda-kernels`, `dev`, `benchmark`) are extras; a feature that
  needs one raises `ImportError` naming the extra rather than failing later.

## Persisted formats and their readers

| Format | Version marker | Value at this version | Writer | Reader and its rule |
| --- | --- | --- | --- | --- |
| Project JSON | `schema_version` field of `Project` | `1` | `Project.save`, `/api/validate`, the workbench save | `Project.load` and `Project.model_validate_json` accept exactly the versions listed here; an unknown key, a missing required key or a non-finite number is a validation error, never a silent default. A future version `n+1` keeps a reader for every earlier version and migrates in memory; writers write the current version only. Schema 1 gained the optional keys `revision` (edit counter, default 0) and `content_sha256` (SHA-256 of the canonical JSON of every other field, default null) in 0.14.0.dev0; a file without them loads with the defaults, a file with them is refused by builds older than that change. The optional keys `limits` (`max_structures`, `max_sources`, `max_monitors`, `max_materials`, `max_mesh_refinements`, `max_monitor_samples`) and `region.resident_cell_limit` (after 0.15.0, all `null` by default) are written only when a cap is set, so a project without caps serializes, hashes and loads in earlier builds exactly as before; a file that carries them is refused by builds older than that change. After 0.15.0 the Python API also reads and writes projects above the 0.15.0 field bounds (more than 1000 structures, 512 sources or monitors, 100 materials, 64 mesh refinements, 100,000 steps, 2001 frequencies or 100,000 source-signal samples); 0.15.0 and the workbench server refuse such a file. `Project.content_matches()` and `/api/validate` (`stored_content_sha256_matches`) report whether the stored hash still describes the content |
| Result HDF5 | `format` and `layout` root attributes | `torchfdtd-result`, layout `1` | `Result.save(path, format='hdf5')` or a `.h5`/`.hdf5` path (optional extra `hdf5`, h5py) | `Result.open` returns `torchfdtd.result_store.ResultFile`, which reads frames, field plane slices, point spectra and one frequency and component of a plane monitor by chunk, and `load()` or `Result.load` reads the whole file; a layout newer than the reader's and a file without the `format` attribute are refused by name. Datasets: `mesh/{x,y,z}_um`, `frames`, `frame_steps`, `epsilon`, `signals`, `times`, `E`, `H`, `monitors/<k>/{frequency_hz,spectrum}`, `field_monitors/<k>/<array>`, `endpoint/<name>`; root attributes `project`, `summary`, `units`, `field_monitors`, `monitor_spectra`. A dataset added later is optional for older readers; a renamed or retyped dataset is a new layout number recorded here |
| Result NPZ | none; identified by its member names | layout 1: `project` (the embedded project JSON with its schema version), `summary`, `field_monitors`, `mesh_x_um`, `mesh_y_um`, `mesh_z_um`, `frames`, `frame_steps`, `epsilon`, `signals`, `times`, `E`, `H`, `monitor_spectra`, and per monitor `monitor_<k>_frequency_hz`, `monitor_<k>_spectrum`, `field_monitor_<k>_<array>`, plus `endpoint_<name>` when PMC endpoint fields exist | `Result.save`, `/api/jobs/{key}/download`, batch outputs | `Result.load` reads every member with `allow_pickle=False`; `load_native_radiation_plane` and `load_native_radiation_box` read only the selected `field_monitor_<k>_*` members and the metadata, with bounded NPY v1/v2 headers. A member added later is optional for older readers; a renamed or retyped member is a new layout number recorded here |
| Streamed restart journal | `marker` in every record and in `complete.json` | `torchfdtd-streamed-restart` | `RestartJournal` of `torchfdtd.streamed_restart` | `RestartJournal` resumes only when `contract.json` equals the contract of the new run (`project_sha256`, `epsilon_sha256`, `epsilon_shape`, `epsilon_dtype`, `options`, `starts`, `runtime_sha256`, `torch`); any difference is refused with the differing keys named, so a journal never resumes across a solver or Torch change. `project_sha256` digests the restart-contract field selection of `torchfdtd.identity` (the resolved plan's cache sections and the kernel scheme), so labels, placement, display settings, `revision` and `content_sha256` of a workbench save do not refuse a resume |
| Batch case metadata | fingerprint of project, parameters, solver sources, objective key and library versions in `<output>/<case>.json` | sha256 hex | `run_batch` and `BatchRunner` | `run_batch(..., resume=True)` reuses a case only when its fingerprint matches; `BatchItem.load` reads the case NPZ through `Result.load` |
| Mode-network configuration | `version` field of `ModeNetworkConfig` | `1` | `mode_network_plan`, `/api/mode-networks/validate` | `ModeNetworkConfig` rejects any other version |
| Periodic design result | none | JSON object returned by `run_periodic_design` | `run_periodic_design`, `/api/design/jobs/{key}/download` | read as data by the user; no reader in the package depends on it |
| GDS | GDSII stream, no project marker | native `unit`/`precision` of the file | `export_gds` | `import_gds` under `GDSLimits` and the record audit described in [SECURITY.md](SECURITY.md) |
| Design-problem state | `marker` key | `torchfdtd-design-problem` | `DesignProblem.save` (`torch.save`) | `DesignProblem.load` accepts a state only when its fingerprint (parameterization configuration, optimizer type and defaults, continuation) equals the problem's; the parameterization refuses a differing configuration on its own |

## Known limitations at this version

- `WORKSTATION` is the only profile with a technical path to release; `HPC` is
  `BLOCKED_EXTERNAL` for lack of a two-GPU host ([RELEASE_SCOPE.md](RELEASE_SCOPE.md)).
- Excluded from differentiation: eigenmode and source-position derivatives, hole-vertex
  derivatives, second derivatives, fused CUDA adjoint kernels for PMC faces and tensors,
  differentiation through geometry-dependent mesh regeneration.
- The chunked result format is HDF5 only (`Result.save(format='hdf5')`, `Result.open`); a
  result NPZ is still read whole except through the radiation loaders, streamed, tensor-batch
  and mode-network results keep their own loaders, and the workbench downloads NPZ only.
- The workbench server is loopback-only and unauthenticated ([SECURITY.md](SECURITY.md)).
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) lists the open distribution questions as `BLOCKED_EXTERNAL` items.

## Numerical bug severity

A numerical bug is graded by the largest effect it can have on a result that a user would
act on, not by how hard it was to find. The grade sets the response: `S0` and `S1` block a
release and get a result-impact notice; `S2` gets a fix in the next `MINOR` or `PATCH` and a
changelog line; `S3` is documented.

| Grade | Definition | Examples |
| --- | --- | --- |
| S0 | A result is wrong by more than the declared tolerance of its gate (`proposed_thresholds` in `validation/completion_gates.json`) on a supported path, or a gradient has the wrong sign or a non-finite value, or a run reports success after silently dropping physics | wrong CPML sign, a monitor that ignores a component, an adjoint that is finite-difference inconsistent, a resumed journal that replays the wrong block |
| S1 | A result is wrong only outside the declared support (a rejected configuration that is not rejected), or a convergence, normalization or unit is off by a constant factor that a user could carry into a downstream calculation | flux without the area factor, a mesh preview that does not match the realized mesh, a FP32 path that loses the small-signal ratio the FP64 path keeps |
| S2 | A result is within tolerance but a diagnostic, an estimate or a warning is wrong or missing, or an unsupported case fails late instead of at validation | a memory estimate off by more than its stated margin, a warning that names the wrong axis |
| S3 | Cosmetic: labels, ordering, formatting of numbers, documentation that lags the code | a CSV column label, a rounded value in a report |

## Result-impact notices and rollback

- A fix that changes a computed result on a supported path (any `S0` or `S1` fix, and any
  changed default) is announced in the changelog under **Results change** with: the affected
  paths and versions, the largest observed difference on the gate fixtures, which
  `docs/validation/runs/` evidence was re-recorded, and whether earlier result files remain
  readable. Users who published numbers from an affected version are expected to re-run
  the affected cases; the notice says which ones.
- Rolling back is `pip install torchfdtd==<previous version>` in a fresh environment. Project
  JSON and result NPZ written by a newer `PATCH` or `MINOR` version stay readable by the
  previous version unless the changelog entry says otherwise; a restart journal never
  crosses versions (its contract hashes the solver sources).
- Gate evidence is tied to a commit and to the hashes of the test, fixture and criteria
  files; a rollback makes the evidence recorded after the rollback point stale, and the
  judge (`scripts/check_release_gates.py`) reports that rather than reusing it.

## Support matrix

Python 3.10 or newer; torch 2.2 or newer (2.10.0+cu126 exercised); CuPy `cupy-cuda12x`
13.6 for the fused CUDA kernels; gdstk 0.9.62 to 1.0.x for GDS; Windows 11 and Linux
exercised, macOS CPU-only and untested. Minimum and maximum versions become fixed by the
installation tests of gate task G8-06, and this section is updated from that evidence, not
from intent.

## Reporting a bug

Use [.github/ISSUE_TEMPLATE/bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md): it
asks for the platform report (`torchfdtd hardware` and `/api/health`), the package version,
a minimal project JSON or script that reproduces the problem, the expected and observed
numbers with the reference they were compared against, and the grade the reporter proposes
from the table above.
