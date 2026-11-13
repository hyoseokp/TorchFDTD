"""TorchFDTD: micrometre geometry, SI time, open-source Yee FDTD.

GPU FDTD simulation of photonic devices with PyTorch gradients. Start with
`torchfdtd example waveguide`, `Project.load(...)` and `Simulation(project).run()`.
Guide for AI agents (starting example per task, checks, MCP tools, citation):
https://github.com/hyoseokp/TorchFDTD/blob/main/AGENTS.md
"""
# The upstream grid package changes process-wide Torch defaults on first import.
# A forward simulator must not disable gradients in its caller's training code.
import torch as _torch
_previous_dtype, _previous_grad = _torch.get_default_dtype(), _torch.is_grad_enabled()
try:
    import fdtd as _fdtd
finally:
    _torch.set_default_dtype(_previous_dtype)
    _torch.set_grad_enabled(_previous_grad)
del _torch, _fdtd, _previous_dtype, _previous_grad

from importlib.metadata import PackageNotFoundError as _NotFound, version as _version
try:
    __version__ = _version('torchfdtd')
except _NotFound:  # a source tree that is not installed
    __version__ = '0+unknown'
del _NotFound, _version

from .models import Project, Region, MeshRefinement, Structure, Source, SourceTimeSettings, TimeSignal, Monitor, Material, BoundaryFace, Boundaries, SpectrumSettings
from .solver import Simulation, Result
from .session import FDTD
from .mesh import freeze_refinements
from .models import FieldMonitor
from .field_monitors import normalize_flux
from .batch import BatchCase, BatchItem, BatchReport, BatchRunner, run_batch, parameter_case, parameter_sweep
from .design import DesignResult, optimize
from .models import LorentzPole, RunControl
from .convergence import ConvergenceReport, mesh_refinement_projects, mesh_convergence

__all__ = ['Project', 'Region', 'MeshRefinement', 'freeze_refinements', 'Structure', 'Source', 'SourceTimeSettings', 'TimeSignal', 'Monitor', 'FieldMonitor', 'normalize_flux', 'Material', 'BoundaryFace', 'Boundaries', 'SpectrumSettings', 'Simulation', 'Result', 'FDTD']
__all__ += ['BatchCase','BatchItem','BatchReport','BatchRunner','run_batch','parameter_case','parameter_sweep','DesignResult','optimize']
__all__ += ['LorentzPole', 'RunControl']
__all__ += ['ConvergenceReport', 'mesh_refinement_projects', 'mesh_convergence']
from .tensor_batch import run_tensor_batch
__all__ += ['run_tensor_batch']
from .grouped_batch import plan_grouped_batch, run_grouped_batch
__all__ += ['plan_grouped_batch', 'run_grouped_batch']
from .tuning import TensorBatchTuning, tune_tensor_batch
__all__ += ['TensorBatchTuning', 'tune_tensor_batch']
from .fsp_geometry import write_fsp_geometry, write_fsp_scene
__all__ += ['write_fsp_geometry', 'write_fsp_scene']
from .optical_data import OpticalData
from .material_fit import FitOptions, MaterialFitResult, fit_material, material_fit_report
__all__ += ['OpticalData', 'FitOptions', 'MaterialFitResult', 'fit_material', 'material_fit_report']
from .differentiable import AdjointOptions, DifferentiableSimulation, DifferentiableResult, smooth_sphere_epsilon
__all__ += ['AdjointOptions', 'DifferentiableSimulation', 'DifferentiableResult', 'smooth_sphere_epsilon']
from .adjoint_memory import estimate_adjoint_memory
__all__ += ['estimate_adjoint_memory']
from .adjoint_spectrum import DifferentiableSpectrum
__all__ += ['DifferentiableSpectrum']
from .memory_profile import profile_memory_transfers
__all__ += ['profile_memory_transfers']
from .streamed import (StreamedAdjointOptions, StreamedSimulation, estimate_streamed_memory,
                       StreamedStoragePlan, select_streamed_storage)
__all__ += ['StreamedAdjointOptions', 'StreamedSimulation', 'estimate_streamed_memory',
            'StreamedStoragePlan', 'select_streamed_storage']
from .streamed_tuning import StreamedTuning, tune_streamed, tune_streamed_dispersive
__all__ += ['StreamedTuning', 'tune_streamed', 'tune_streamed_dispersive']
from .adjoint_planes import DifferentiablePlaneSimulation, DifferentiablePlaneResult
__all__ += ['DifferentiablePlaneSimulation', 'DifferentiablePlaneResult']
from .information import GaussianTargetResult, gaussian_target_information, shot_read_covariance
__all__ += ['GaussianTargetResult', 'gaussian_target_information', 'shot_read_covariance']
from .recomputed_batch import recompute_cases
__all__ += ['recompute_cases']
from .detector_allocation import quadrant_intensity_allocation
__all__ += ['quadrant_intensity_allocation']
from .polarization import calibrate_plane_polarization, mix_plane_fields
__all__ += ['calibrate_plane_polarization', 'mix_plane_fields']
from .electron_model import spectral_interpolate, spectral_electron_model, exposure_target_information, SpectralElectronModel, ExposureInformation
__all__ += ['spectral_interpolate', 'spectral_electron_model', 'exposure_target_information', 'SpectralElectronModel', 'ExposureInformation']
from .density_layer import periodic_density_layer
__all__ += ['periodic_density_layer']
from .pupil_response import spectral_pupil_response
__all__ += ['spectral_pupil_response']
from .periodic_response import periodic_layer_response
__all__ += ['periodic_layer_response']
from .reference_cache import PlaneReferenceCache
__all__ += ['PlaneReferenceCache']
from .dispersive_adjoint import DispersiveSimulation, DispersivePlaneSimulation
__all__ += ['DispersiveSimulation', 'DispersivePlaneSimulation']
from .streamed_dispersive import StreamedDispersiveSimulation, estimate_streamed_dispersive_memory
__all__ += ['StreamedDispersiveSimulation', 'estimate_streamed_dispersive_memory']
from .execution_tuning import AdjointExecutionPolicy, AdjointExecutionSelection, tune_adjoint_execution
__all__ += ['AdjointExecutionPolicy', 'AdjointExecutionSelection', 'tune_adjoint_execution']
from .adjoint_batch import AdjointCase, AdjointBatchOptions, AdjointBatchResult, RecomputedAdjointBatch
__all__ += ['AdjointCase', 'AdjointBatchOptions', 'AdjointBatchResult', 'RecomputedAdjointBatch']

from .periodic_adjoint import PeriodicLayerResponse
__all__ += ['PeriodicLayerResponse']

from .response_cache import PeriodicResponseCache
__all__ += ['PeriodicResponseCache']

from .periodic_design import PeriodicDesignConfig, periodic_design_plan, run_periodic_design
__all__ += ['PeriodicDesignConfig', 'periodic_design_plan', 'run_periodic_design']

from .differentiable_geometry import DifferentiableSolid, smooth_geometry_epsilon, spline_outline
__all__ += ['DifferentiableSolid', 'smooth_geometry_epsilon', 'spline_outline']
from .streamed_geometry import (StreamedGeometry, streamed_geometry, StreamedGeometrySimulation,
                               StreamedGeometryPlaneSimulation)
__all__ += ['StreamedGeometry', 'streamed_geometry', 'StreamedGeometrySimulation',
            'StreamedGeometryPlaneSimulation']
from .streamed_density import (StreamedDensityLayer, streamed_density_layer, StreamedDensitySimulation,
                              StreamedDensityPlaneSimulation)
__all__ += ['StreamedDensityLayer', 'streamed_density_layer', 'StreamedDensitySimulation',
            'StreamedDensityPlaneSimulation']
from .design_parameterization import DensityParameterization
from .gds import GDSLayer, GDSPortLayer, GDSPort, GDSLimits, GDSImport, import_gds, export_gds
from .mode_ports import WaveguideMode, solve_waveguide_modes, mode_power_overlap, normalized_mode_power
from .mode_injection import (ModalLaunch, prepare_modal_launch, ModeInjectedPlaneSimulation,
                             modal_plane_amplitudes, modal_s_parameters)
from .radiation import (DiffractionResult, diffraction_orders, diffraction_efficiency,
                        FarFieldResult, project_farfield, normalized_farfield_intensity,
                        NearZoneResult, project_nearzone, farfield_at_points,
                        spherical_directions, spherical_points, cartesian_plane_points, kspace_directions)
__all__ += ['DensityParameterization', 'GDSLayer', 'GDSPortLayer', 'GDSPort', 'GDSLimits',
            'GDSImport', 'import_gds', 'export_gds', 'WaveguideMode', 'solve_waveguide_modes',
            'mode_power_overlap', 'normalized_mode_power', 'ModalLaunch', 'prepare_modal_launch',
            'ModeInjectedPlaneSimulation', 'modal_plane_amplitudes', 'modal_s_parameters',
            'DiffractionResult', 'diffraction_orders', 'diffraction_efficiency', 'FarFieldResult',
            'project_farfield', 'normalized_farfield_intensity', 'NearZoneResult', 'project_nearzone',
            'farfield_at_points', 'spherical_directions', 'spherical_points', 'cartesian_plane_points',
            'kspace_directions']

from .anisotropy import TensorDielectricSimulation
from .tensor_project import TensorProject, tensor_from_project
from .pmc_simulation import EndpointSimulation
__all__ += ["TensorDielectricSimulation", "EndpointSimulation"]
__all__ += ["TensorProject", "tensor_from_project"]

from .domain_decomposition import (DistributedYeeDomain, SlabOwnership,
    distributed_capabilities, plan_domain_decomposition, SlabDecomposition, ProcessGroupTransport,
    ThreadTransport, init_process_group_from_env, spawn_local)
__all__ += ["DistributedYeeDomain", "SlabOwnership", "distributed_capabilities",
            "plan_domain_decomposition", "SlabDecomposition", "ProcessGroupTransport",
            "ThreadTransport", "init_process_group_from_env", "spawn_local"]

from .endpoint_project import EndpointProject, endpoint_from_project
from .mode_network import FixedModePort, ModeNetwork, ModeNetworkResult
__all__ += ["EndpointProject", "endpoint_from_project", "FixedModePort",
            "ModeNetwork", "ModeNetworkResult"]

from .pmc_cpml import EndpointCPMLSimulation
from .radiation_io import native_radiation_plane, load_native_radiation_plane
__all__ += ["EndpointCPMLSimulation", "native_radiation_plane", "load_native_radiation_plane"]

from .reversible import ReversibleOptions, ReversibleSimulation
__all__ += ["ReversibleOptions", "ReversibleSimulation"]

from .reversible_cpml import ReversibleCPMLOptions, ReversibleCPMLSimulation
__all__ += ["ReversibleCPMLOptions", "ReversibleCPMLSimulation"]
from .reversible_cpml_planes import ReversibleCPMLPlaneSimulation
__all__ += ["ReversibleCPMLPlaneSimulation"]

from .open_mode_ports import OpenWaveguideMode, solve_open_waveguide_modes
from .open_mode_injection import OpenPortOptions, OpenModalLaunch, prepare_open_modal_launch
__all__ += ["OpenWaveguideMode", "solve_open_waveguide_modes", "OpenPortOptions",
            "OpenModalLaunch", "prepare_open_modal_launch"]

from .mode_network_project import ModeNetworkConfig, mode_network_plan, run_mode_network
__all__ += ["ModeNetworkConfig", "mode_network_plan", "run_mode_network"]

from .mode_branches import ModePort, ModeBranchNetwork, prepare_aperture_modal_launch, branch_network_from_ports
__all__ += ["ModePort", "ModeBranchNetwork", "prepare_aperture_modal_launch", "branch_network_from_ports"]

from .radiation_box import StoredRadiationBox, native_radiation_box
from .radiation_box_io import load_native_radiation_box
__all__ += ["StoredRadiationBox", "native_radiation_box", "load_native_radiation_box"]

from .source_adjoint import SourceWaveformSimulation, SourceWaveformPlaneSimulation
from .source_parameters import gaussian_waveform
__all__ += ["SourceWaveformSimulation", "SourceWaveformPlaneSimulation", "gaussian_waveform"]

from .streamed_work import estimate_streamed_work
from .streamed_planning import StreamedWorkPlan, plan_streamed_work
__all__ += ["estimate_streamed_work", "StreamedWorkPlan", "plan_streamed_work"]

from .tiled import (TilePlan, TileSpec, StitchedPlane, plan_tiles, run_tiled, stitch_planes, propagate_plane,
                    farfield_from_stitched, suggest_overlap, TiledPlaneSimulation)
__all__ += ["TilePlan", "TileSpec", "StitchedPlane", "plan_tiles", "run_tiled", "stitch_planes", "propagate_plane",
            "farfield_from_stitched", "suggest_overlap", "TiledPlaneSimulation"]

from .angular_spectrum import (PlaneSpectrum, SectionResult, VolumeResult, PointsResult, plane_spectrum, propagate_section,
                               propagate_volume, propagate_points, volume_bytes)
__all__ += ["PlaneSpectrum", "SectionResult", "VolumeResult", "PointsResult", "plane_spectrum", "propagate_section",
            "propagate_volume", "propagate_points", "volume_bytes"]

from .models import MaterialProvenance
from .material_fit import (MaterialImportResult, MaterialBandWarning, import_material_table, discretization_report,
                           fit_band_extrapolation)
__all__ += ["MaterialProvenance", "MaterialImportResult", "MaterialBandWarning", "import_material_table",
            "discretization_report", "fit_band_extrapolation"]
from .source_preview import preview_source, effective_bandwidth
__all__ += ["preview_source", "effective_bandwidth"]

from .material_fit import fit_discrete_lorentz
__all__ += ["fit_discrete_lorentz"]
from .results import (ResultRecord, guarded_ratio, reflection_transmission, s_parameters, mode_decomposition,
                      diffraction_record, farfield_record, nearzone_record)
__all__ += ["ResultRecord", "guarded_ratio", "reflection_transmission", "s_parameters", "mode_decomposition",
            "diffraction_record", "farfield_record", "nearzone_record"]
from .ports import (FixedPortSectionError, ModeTrackingWarning, WeakModeWarning, TrackedPortModes, PortDiagnostics,
                    track_port_modes, port_diagnostics, degenerate_clusters, overlap_matrix, confinement_factor,
                    shift_reference_plane, deembed_s_matrix, separate_directions, port_normalization, fixed_port_section)
__all__ += ["FixedPortSectionError", "ModeTrackingWarning", "WeakModeWarning", "TrackedPortModes", "PortDiagnostics",
            "track_port_modes", "port_diagnostics", "degenerate_clusters", "overlap_matrix", "confinement_factor",
            "shift_reference_plane", "deembed_s_matrix", "separate_directions", "port_normalization", "fixed_port_section"]

from .density_layer import bounded_density_layer
from .fabrication import (FeatureSizes, measure_feature_sizes, fabrication_perturbation, binary_structures,
                          morphological_open, square_offsets)
from .design_problem import Continuation, DesignProblem
__all__ += ["bounded_density_layer", "FeatureSizes", "measure_feature_sizes", "fabrication_perturbation",
            "binary_structures", "morphological_open", "square_offsets", "Continuation", "DesignProblem"]
