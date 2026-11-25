from __future__ import annotations

import math
import pprint
from contextlib import contextmanager
from contextvars import ContextVar
from pathlib import Path
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, PrivateAttr, field_validator, model_serializer, model_validator
from .optical_data import OpticalData


class Model(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)


# The Python API has no fixed size caps: resident execution is admitted by the memory
# estimate, and Region.resident_cell_limit and Project.limits are optional user caps
# ("Size limits" in docs/EXECUTION_MODES.md). The workbench server applies these
# request limits to everything it validates or runs, whatever a submitted project
# carries, unless it was started with memory admission (docs/SECURITY.md). sheet_cells (the cells of
# the complex Bloch sheet profiles) and plane_points (plane points x recorded components, over every
# plane) bound what planning builds beyond the other limits; solver.admit_planning counts them.
SERVER_LIMITS = dict(resident_cells=8_000_000, structures=1000, sources=512, monitors=512, materials=100,
                     mesh_refinements=64, monitor_samples=12_000_000, steps=100_000, frequency_points=2001,
                     signal_samples=100_000, sheet_cells=8_000_000, plane_points=12_000_000)
# The fused CUDA kernels and the subpixel operator address a field array with
# signed 32-bit integers, so every resident grid keeps 3 x lanes x cells below
# this bound, whatever its cell limit.
RESIDENT_INDEX_LIMIT = 2**31
# Under memory admission the size limits give way to the memory estimate, but every list keeps a ceiling,
# checked before its items are validated: a request of at most 32 MB (server.MAX_REQUEST_BYTES) then
# validates in at most about 3.3 GB of host memory, 3 KiB per list item and 80 bytes per request byte of
# numbers (docs/SECURITY.md, tests/test_server_memory_admission.py). frequency_points also caps a custom list.
MEMORY_ADMISSION_LIMITS = dict(structures=200_000, sources=10_000, monitors=10_000, materials=1000, mesh_refinements=10_000,
                               frequency_points=1_000_000, signal_samples=1_000_000)
# None outside the workbench server, 'fixed' under SERVER_LIMITS, 'memory' under memory admission.
_SERVER = ContextVar('torchfdtd_server_limits', default=None)


@contextmanager
def server_limits(memory_admission=False):
    """Apply SERVER_LIMITS to every model validated and every scene admitted inside the block.

    The workbench server runs each request, its job threads and its modal worker
    process inside this block. A cap a submitted project carries can lower a
    server limit but never raise it; the project itself is not changed. With
    memory_admission (torchfdtd serve --memory-admission) the block applies no
    SERVER_LIMITS, so scenes are admitted by the memory estimate as on the Python API.
    """
    token = _SERVER.set('memory' if memory_admission else 'fixed')
    try:
        yield
    finally:
        _SERVER.reset(token)


def server_admission():
    """'fixed' or 'memory' inside server_limits(), otherwise None."""
    return _SERVER.get()


def server_limit(name):
    """The server limit called name: SERVER_LIMITS under the fixed limits, the list ceiling of
    MEMORY_ADMISSION_LIMITS (None for a size the memory estimate admits) under memory admission,
    otherwise None."""
    admission = _SERVER.get()
    return SERVER_LIMITS[name] if admission == 'fixed' else MEMORY_ADMISSION_LIMITS.get(name) if admission == 'memory' else None


def effective_limit(cap, name):
    """The tighter of an optional user cap (None: no cap) and the active server limit."""
    server = server_limit(name)
    return cap if server is None else server if cap is None else min(cap, server)


def _check_count(value, cap, what):
    # Applied before the items are validated, so an oversized list costs no model construction.
    if cap is not None and isinstance(value, (list, tuple)) and len(value) > cap:
        raise ValueError(f'{len(value):,} {what} exceed the limit of {cap:,}.')
    return value


def _check_at_most(value, cap, what):
    if cap is not None and value > cap:
        raise ValueError(f'{value:,} {what} exceed the limit of {cap:,}.')
    return value


class LorentzPole(Model):
    """Passive oscillator A / (omega_0**2 - omega**2 - i*gamma*omega).

    A zero resonance gives a Drude pole. All rates are angular SI units.
    """
    resonance_rad_s: float = Field(default=2e15, ge=0, le=1e18)
    strength_rad_s_squared: float = Field(default=4e30, gt=0, le=1e40)
    damping_rad_s: float = Field(default=1e14, ge=0, le=1e18)

    @property
    def coefficients(self):
        return self.resonance_rad_s, self.strength_rad_s_squared, self.damping_rad_s


class MaterialProvenance(Model):
    """Origin of an imported optical table, kept with the fitted material and the project."""
    source: str = Field(min_length=1, max_length=200)      # publication, database entry or measurement
    licence: str = Field(default='', max_length=2000)      # licence or usage note of the table
    raw_sha256: str = Field(pattern=r'^[a-f0-9]{64}$')     # SHA-256 of the raw file or text as imported
    file_name: str = Field(default='', max_length=260)
    columns: Literal['nk', 'epsilon'] = 'nk'
    wavelength_unit: Literal['um', 'nm', 'm'] = 'um'
    imported: str = Field(default='', max_length=40)       # ISO 8601 date of the import


class Material(Model):
    name: str = Field(min_length=1, max_length=100)
    index: float = Field(default=1.5, ge=1, le=20)
    color: str = '#6ca8dd'
    model: Literal['dielectric', 'tensor', 'drude', 'lorentz', 'multipole'] = 'dielectric'
    epsilon_tensor: tuple[float,float,float,float,float,float] = (2.25,2.25,2.25,0.,0.,0.)
    epsilon_inf: float = Field(default=1, ge=1, le=400)
    plasma_rad_s: float = Field(default=2e15, gt=0, le=1e18)
    collision_rad_s: float = Field(default=1e14, ge=0, le=1e18)
    resonance_rad_s: float = Field(default=2e15, gt=0, le=1e18)
    linewidth_rad_s: float = Field(default=1e14, ge=0, le=1e18)
    delta_epsilon: float = Field(default=1, gt=0, le=10000)
    poles: list[LorentzPole] = Field(default_factory=list, max_length=16)
    samples: OpticalData | None = None
    fit_band_um: tuple[float,float] | None = None
    fit_dt_s: float | None = Field(default=None,gt=0)
    provenance: MaterialProvenance | None = None

    @model_validator(mode='after')
    def valid_poles(self):
        if self.model == 'tensor':
            import numpy as np
            xx,yy,zz,xy,xz,yz=self.epsilon_tensor
            matrix=np.array(((xx,xy,xz),(xy,yy,yz),(xz,yz,zz)))
            if not np.isfinite(matrix).all() or np.linalg.eigvalsh(matrix).min()<1:
                raise ValueError('Tensor permittivity must be finite symmetric with eigenvalues >= 1.')
        if self.model == 'multipole' and not self.poles:
            raise ValueError('A multipole material requires at least one passive pole.')
        if self.fit_band_um is not None:
            low,high=self.fit_band_um
            if self.samples is None or not 0<low<high or low<self.samples.wavelength_um[0] or high>self.samples.wavelength_um[-1]:
                raise ValueError('A fitted band must lie inside the retained optical data.')
            if sum(low<=w<=high for w in self.samples.wavelength_um)<3:
                raise ValueError('A fitted band must contain at least three optical samples.')
        if self.fit_dt_s is not None and self.fit_band_um is None:
            raise ValueError('An ADE-target fit timestep requires a fitted wavelength band.')
        return self

    @property
    def instantaneous_epsilon(self):
        if self.model == 'tensor':
            raise ValueError('Tensor material requires the node-tensor solver, not scalar permittivity.')
        return self.index**2 if self.model == 'dielectric' else self.epsilon_inf

    @property
    def oscillator(self):
        """Legacy single-pole accessor. Use oscillators for general materials."""
        if self.model == 'drude':
            return 0., self.plasma_rad_s**2, self.collision_rad_s
        if self.model == 'lorentz':
            return self.resonance_rad_s, self.delta_epsilon*self.resonance_rad_s**2, 2*self.linewidth_rad_s
        return None

    @property
    def oscillators(self):
        if self.model == 'multipole':
            return tuple(pole.coefficients for pole in self.poles)
        return (self.oscillator,) if self.oscillator else ()


class BoundaryFace(Model):
    kind: Literal['pml', 'periodic', 'bloch', 'pec', 'antisymmetric', 'pmc', 'symmetric'] = 'pml'
    layers: int | None = Field(default=None, ge=3, le=100)
    # Dimensionless native CPML coefficients, not Lumerical's normalized values.
    sigma_scale: float = Field(default=1, gt=0, le=20)
    kappa: float = Field(default=1, ge=1, le=50)
    alpha: float = Field(default=1e-8, ge=0, le=5)
    polynomial: float = Field(default=3, ge=1, le=10)
    alpha_polynomial: float = Field(default=0, ge=0, le=10)


class Boundaries(Model):
    x_min: BoundaryFace = Field(default_factory=BoundaryFace)
    x_max: BoundaryFace = Field(default_factory=BoundaryFace)
    y_min: BoundaryFace = Field(default_factory=BoundaryFace)
    y_max: BoundaryFace = Field(default_factory=BoundaryFace)
    z_min: BoundaryFace = Field(default_factory=BoundaryFace)
    z_max: BoundaryFace = Field(default_factory=BoundaryFace)

    def pair(self, axis):
        return tuple(getattr(self, 'xyz'[axis] + '_' + side) for side in ('min', 'max'))


class MeshRefinement(Model):
    name: str = Field(default='Refinement', min_length=1, max_length=100)
    center: tuple[float,float,float] = (0,0,0)
    size: tuple[float,float,float] = (1,1,1)
    enabled: bool = True

    @model_validator(mode='after')
    def positive_size(self):
        if any(v<=0 for v in self.size):raise ValueError('Refinement spans must be positive.')
        return self


class RunControl(Model):
    auto_shutoff: bool = False
    decay_threshold: float = Field(default=1e-6, gt=0, lt=1)
    check_interval: int = Field(default=50, ge=1, le=10000)
    consecutive_checks: int = Field(default=3, ge=2, le=100)
    min_steps: int = Field(default=100, ge=10, le=100000)
    source_tail_amplitude: float = Field(default=1e-8, gt=0, le=1e-3)
    after_source_s: float = Field(default=0, ge=0)
    divergence_check: bool = True
    growth_limit: float = Field(default=1e6, gt=1)
    field_limit: float | None = Field(default=None, gt=0)


class Tiling(Model):
    """Workbench settings for the approximate overlapping-tile mode (docs/TILED_STITCHING.md)."""
    size_um: float = Field(default=20, gt=0)
    overlap_um: float = Field(default=2, gt=0)
    max_angle_deg: float = Field(default=45, ge=0, lt=90)
    propagation_um: float | None = Field(default=None, ge=0)
    # Consent for the automatic policy to fall back to the approximate tiles when
    # neither resident nor DRAM-streamed execution fits.
    allow_approximate: bool = False


class Region(Model):
    def __eq__(self,other):
        if not isinstance(other,Region):return NotImplemented
        # Cached NumPy node arrays are derived state and have no scalar truth
        # value. Geometry-dependent refinement context remains part of equality.
        return (type(self) is type(other) and self.model_dump()==other.model_dump()
                and self._auto_boxes==other._auto_boxes and self._coarse_limit==other._coarse_limit)

    dimension: Literal['2d', '3d'] = '2d'
    size: tuple[float, float, float] = (8, 6, 2)
    mesh: float = Field(default=0.05, gt=0, le=10)
    mesh_steps: tuple[float,float,float] | None = None
    mesh_coordinates: tuple[tuple[float,...],tuple[float,...],tuple[float,...]] | None = None
    material_sampling: Literal['cell', 'yee'] = 'cell'
    interface_method: Literal['staircase','subpixel'] = 'staircase'
    subpixel_quadrature: int = Field(default=8,ge=2,le=32)
    mesh_type: Literal['uniform','graded','explicit'] = 'uniform'
    mesh_max: float = Field(default=.15, gt=0, le=10)
    mesh_grading: float = Field(default=1.25, ge=1.05, le=1.5)
    mesh_ppw: float = Field(default=24, ge=6, le=80)
    mesh_auto_refine: bool = True
    mesh_refinements: list[MeshRefinement] = Field(default_factory=list)
    _auto_boxes: tuple = PrivateAttr(default=())
    _coarse_limit: float | None = PrivateAttr(default=None)
    _mesh_cache: object = PrivateAttr(default=None)
    courant_factor: float = Field(default=0.99, gt=0, le=0.99)
    time_step_override: float | None = Field(default=None,gt=0)
    steps: int = Field(default=1000, ge=10)
    run_control: RunControl = Field(default_factory=RunControl)
    pml_cells: int = Field(default=10, ge=3, le=50)
    # Dispersive (ADE) material inside a PML layer. 'ade' keeps the pole update
    # there (unstable for poles whose negative-permittivity band lies inside the
    # grid band); 'frozen' replaces it by the real permittivity at the source
    # centre frequency; 'absorber' turns every PML face that a dispersive
    # structure reaches into a graded, matched electric and magnetic conductivity
    # layer of the same depth and keeps the ADE. Resident forward solvers only;
    # see docs/BOUNDARIES.md.
    pml_dispersion: Literal['ade', 'frozen', 'absorber'] = 'ade'
    boundaries: Boundaries = Field(default_factory=Boundaries)
    bloch_phase: tuple[float, float, float] = (0, 0, 0)  # radians per positive unit-cell translation
    background_index: float = Field(default=1, ge=1, le=20)
    backend: Literal['auto', 'cuda', 'cpu'] = 'auto'
    memory_mode: Literal['resident', 'streamed', 'budgeted'] = 'resident'
    # Browser execution selection. 'auto' lets the server choose resident or
    # streamed host/disk execution from the live resources; see docs/EXECUTION_MODES.md.
    execution_mode: Literal['auto', 'resident', 'streamed_host', 'streamed_disk', 'tiled'] = 'auto'
    tiling: Tiling = Field(default_factory=Tiling)
    # Optional cap on the grid the resident path admits. None, the default, leaves
    # admission to the memory estimate; written to JSON only when set.
    resident_cell_limit: int | None = Field(default=None, ge=1, strict=True)
    # 'auto' runs the fused CUDA kernels where they support the scene and CuPy works, else the Torch kernels.
    cuda_kernel: Literal['auto', 'torch', 'fused'] = 'auto'
    cuda_monitor_kernel: Literal['auto', 'torch', 'fused'] = 'auto'
    precision: Literal['float32', 'float64'] = 'float32'
    snapshot_interval: int = Field(default=20, ge=1, le=10000)
    field: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    slice_axis: Literal['x', 'y', 'z'] = 'z'
    slice_position: float = 0
    complex_display: Literal['real', 'imag', 'magnitude', 'phase'] = 'real'

    @field_validator('mesh_refinements', mode='before')
    @classmethod
    def _server_refinements(cls, value):
        return _check_count(value, server_limit('mesh_refinements'), 'mesh refinements')

    @field_validator('steps')
    @classmethod
    def _server_steps(cls, value):
        return _check_at_most(value, server_limit('steps'), 'time steps')

    @model_serializer(mode='wrap')
    def _omit_unset_fields(self, handler):
        # A region without a cap serializes, and therefore hashes and loads in
        # earlier versions, exactly as before the field existed. Earlier versions
        # read an absent kernel as their Torch default and refuse 'auto'.
        data = handler(self)
        if self.resident_cell_limit is None:
            data.pop('resident_cell_limit', None)
        for name in ('cuda_kernel', 'cuda_monitor_kernel'):
            if data.get(name) == 'auto':
                del data[name]
        return data

    def cell_cap_refusal(self):
        """Why the cell caps refuse this grid (a user cap, or the server limit while it applies), or None."""
        cells = math.prod(self.shape)
        limit = effective_limit(self.resident_cell_limit, 'resident_cells')
        if limit is not None and cells > limit:
            if limit == server_limit('resident_cells'):
                return f'The workbench server limits resident execution to {limit:,} cells, and the grid has {cells:,}'
            return f'Resident execution is limited to resident_cell_limit={limit:,} cells, and the grid has {cells:,}'
        return None

    def resident_refusal(self):
        """Why the resident path refuses this grid's size, or None when the size is admitted.

        Memory is admitted separately, by the estimate against the free memory."""
        refusal = self.cell_cap_refusal()
        if refusal:
            return refusal
        cells = math.prod(self.shape)
        if 3*(2 if self.complex_fields else 1)*cells >= RESIDENT_INDEX_LIMIT:
            # Applied to every resident path, although only the fused CUDA kernels and the subpixel operator need it.
            return (f'Resident execution is limited to 3 x cells below 2**31 (the signed 32-bit field index of the fused '
                    f'CUDA kernels), which {cells:,} {"complex " if self.complex_fields else ""}cells reach')
        return None

    def require_resident(self):
        if self.memory_mode == 'budgeted':
            raise ValueError('Budgeted scenes require the adjoint API and an explicit resident byte budget.')
        if self.memory_mode == 'streamed':
            raise ValueError('Streamed scenes require StreamedSimulation and explicit memory budgets.')
        refusal = self.resident_refusal()
        if refusal:
            raise ValueError(refusal+'. Use memory_mode="streamed" with StreamedSimulation.')

    @property
    def complex_fields(self):
        return any(self.boundaries.pair(i)[0].kind == 'bloch' for i in range(2 if self.dimension == '2d' else 3))

    def pml_layers(self, axis, side):
        face = self.boundaries.pair(axis)[side]
        return (face.layers or self.pml_cells) if face.kind == 'pml' else 0

    def interior_bounds(self, axis):
        if axis==2 and self.dimension=='2d':return (-self.size[2]/2,self.size[2]/2)
        nodes=self.mesh_nodes[axis];lo=self.pml_layers(axis,0);hi=self.pml_layers(axis,1)
        return (float(nodes[lo]) if lo else -self.actual_size[axis]/2,
                float(nodes[-hi-1]) if hi else self.actual_size[axis]/2)

    @property
    def axis_steps(self):
        if self.mesh_type=='explicit':
            if self.mesh_coordinates is None:raise ValueError('Explicit mesh requires all three coordinate arrays.')
            return tuple(min(b-a for a,b in zip(v,v[1:])) for v in self.mesh_coordinates)
        return self.mesh_steps or (self.mesh,)*3

    @property
    def reference_step(self):
        return min(self.axis_steps[:2 if self.dimension=='2d' else 3])

    @property
    def rectangular_courant(self):
        if self.mesh_steps is None and self.mesh_type!='explicit' and self.time_step_override is None:
            return self.courant_factor/math.sqrt(2 if self.dimension=='2d' else 3)
        return self.time_step*299792458.0/(self.reference_step*1e-6)

    @property
    def base_shape(self):
        # Decimal unit conversions can place an integer ratio a few ulps above
        # its mathematical value. Do not silently add a whole mesh cell.
        def cells(span,step):
            ratio = span / step
            nearest = round(ratio)
            if self.mesh_type=='explicit' and math.isclose(ratio,nearest,rel_tol=1e-10):return max(1,nearest)
            return max(1, nearest if abs(ratio-nearest) <= 8*math.ulp(ratio) else math.ceil(ratio))
        return tuple(cells(s,self.axis_steps[i]) if i < 2 or self.dimension == '3d' else 1 for i, s in enumerate(self.size))

    @property
    def mesh_nodes(self):
        from .mesh import mesh_nodes
        return mesh_nodes(self)

    @property
    def shape(self):
        return self.base_shape if self.mesh_type=='uniform' else tuple(len(a)-1 for a in self.mesh_nodes)

    @property
    def time_step(self):
        return self.time_step_override or self.cfl_time_step

    @property
    def cfl_time_step(self):
        if self.mesh_steps is None and self.mesh_type!='explicit':
            return self.courant_factor / math.sqrt(2 if self.dimension == '2d' else 3) * self.mesh*1e-6 / 299792458.0
        steps=self.axis_steps[:2 if self.dimension=='2d' else 3]
        return self.courant_factor*1e-6/(299792458.0*math.sqrt(sum(1/h**2 for h in steps)))

    @property
    def actual_size(self):
        if self.mesh_type=='explicit':return tuple(v[-1]-v[0] for v in self.mesh_coordinates)
        return tuple(n*self.axis_steps[i] if n>1 else self.size[i] for i,n in enumerate(self.base_shape))

    @model_validator(mode='after')
    def valid_grid(self):
        if any(s <= 0 for s in self.size):
            raise ValueError('Region spans must be positive.')
        if self.mesh_steps is not None and any(not 0<h<=10 for h in self.mesh_steps):
            raise ValueError('Axis mesh steps must be positive and no greater than 10 um.')
        if self.mesh_type=='explicit':
            if self.mesh_coordinates is None:raise ValueError('Explicit mesh requires all three coordinate arrays.')
            for a,nodes in enumerate(self.mesh_coordinates):
                if not 2<=len(nodes)<=1_000_001 or any(v>=w for v,w in zip(nodes,nodes[1:])):
                    raise ValueError('Explicit mesh coordinates must be strictly increasing with at least two nodes.')
                if not math.isclose(nodes[0],-self.size[a]/2,rel_tol=1e-10,abs_tol=1e-12) or not math.isclose(nodes[-1],self.size[a]/2,rel_tol=1e-10,abs_tol=1e-12):
                    raise ValueError('Explicit mesh endpoints must match the centered region spans.')
                if self.dimension=='2d' and a==2 and len(nodes)!=2:
                    raise ValueError('The invariant z axis needs exactly two bounding nodes.')
        if (self.mesh_type!='uniform' or self.mesh_steps is not None) and self.material_sampling=='cell':
            raise ValueError('Graded, explicit and axis-specific meshes require Yee material sampling.')
        if self.interface_method=='subpixel' and any(
                face.kind in ('pec','antisymmetric','pmc','symmetric') for axis in range(3) for face in self.boundaries.pair(axis)):
            raise ValueError('PEC/antisymmetric and PMC/symmetric boundaries currently require staircase interfaces.')
        if self.interface_method=='subpixel':
            if self.material_sampling!='yee':raise ValueError('Subpixel interfaces require Yee material sampling.')
            if any(any(not math.isclose(b-a,nodes[1]-nodes[0],rel_tol=1e-10,abs_tol=0) for a,b in zip(nodes,nodes[1:])) for nodes in self.mesh_nodes):
                raise ValueError('Subpixel interfaces currently require uniform spacing on each axis. Choose staircase for nonuniform nodes.')
        if self.time_step_override is not None and self.time_step_override>self.cfl_time_step*(1+1e-12):
            raise ValueError('The time-step override exceeds the configured conservative CFL limit.')
        active = self.shape[:2] if self.dimension == '2d' else self.shape
        for axis, n in enumerate(active):
            low, high = self.boundaries.pair(axis)
            if low.kind != high.kind and ({low.kind, high.kind} & {'periodic', 'bloch'}):
                raise ValueError('Periodic/Bloch boundaries must be paired on the same axis.')
            if low.kind != 'bloch' and self.bloch_phase[axis] != 0:
                raise ValueError('A nonzero Bloch phase requires Bloch boundaries on that axis.')
            if n <= self.pml_layers(axis, 0) + self.pml_layers(axis, 1) + 4:
                raise ValueError('Mesh must leave at least 5 cells between the PML boundaries.')
        if self.dimension == '2d' and (any(f.kind != 'pml' for f in self.boundaries.pair(2)) or self.bloch_phase[2] != 0):
            raise ValueError('The invariant z axis has no boundary condition in 2D; keep its defaults.')
        if max(self.shape) > 1_000_000:
            raise ValueError('A grid axis may contain at most one million cells.')
        # The resident size checks apply to explicitly resident regions at
        # construction. Resident entry points still call require_resident().
        if self.memory_mode == 'resident' and self.execution_mode == 'resident':self.require_resident()
        if self.dimension == '2d' and self.slice_axis != 'z':
            raise ValueError('2D simulations use the XY (z-normal) field plane.')
        if abs(self.slice_position) > self.size['xyz'.index(self.slice_axis)] / 2:
            raise ValueError('Field slice must lie inside the simulation region.')
        return self


class Item(Model):
    id: str = Field(default_factory=lambda: uuid4().hex[:12], min_length=1, max_length=100)
    name: str = Field(default='object', min_length=1, max_length=100)
    center: tuple[float, float, float] = (0, 0, 0)
    enabled: bool = True


class Structure(Item):
    kind: Literal['rectangle', 'circle', 'sphere', 'ring', 'polygon'] = 'rectangle'
    size: tuple[float, float, float] = (1, 1, 0.5)
    radius: float = Field(default=0.5, gt=0)
    inner_radius: float = Field(default=0.3, ge=0)
    rotation: float = 0
    rotation_axes: tuple[Literal['x','y','z','none'],Literal['x','y','z','none'],Literal['x','y','z','none']] = ('z','x','y')
    rotation_angles: tuple[float,float,float] = (0,0,0)
    make_ellipsoid: bool = False
    radius_2: float = Field(default=.5,gt=0)
    radius_3: float = Field(default=.5,gt=0)
    inner_radius_2: float = Field(default=.3,ge=0)
    theta_start: float = 0
    theta_stop: float = 360
    vertices: tuple[tuple[float,float],...] = ((-.5,-.5),(.5,-.5),(0,.5))
    holes: tuple[tuple[tuple[float,float],...],...] = ()
    material: str = 'SiN (constant n)'
    mesh_order: int = Field(default=2, ge=1, le=100)

    @model_validator(mode='after')
    def valid_shape(self):
        if any(s <= 0 for s in self.size):
            raise ValueError('Object spans must be positive.')
        if self.kind == 'ring' and self.inner_radius >= self.radius:
            raise ValueError('Ring inner radius must be less than its outer radius.')
        if self.kind=='ring':
            if self.make_ellipsoid and (self.inner_radius_2>=self.radius_2 or (self.inner_radius==0)!=(self.inner_radius_2==0)):
                raise ValueError('Inner ellipse radii must both be zero or positive and smaller than the corresponding outer radii.')
            if not 0<abs(self.theta_stop-self.theta_start)<=360:raise ValueError('Ring angles must define a nonzero arc of at most 360 degrees.')
        if self.kind=='polygon':
            from .geometry import validate_polygon,validate_polygon_holes
            validate_polygon(self.vertices)
            if self.holes:validate_polygon_holes(self.vertices,self.holes)
        elif self.holes:raise ValueError('Only polygons carry holes.')
        return self

    @property
    def angular_span(self):return (self.theta_stop-self.theta_start)%360 or 360.


class TimeSignal(Model):
    time_s: list[float] = Field(min_length=2)
    amplitude: list[float] = Field(min_length=2)
    phase_rad: list[float] = Field(min_length=2)

    @field_validator('time_s', 'amplitude', 'phase_rad', mode='before')
    @classmethod
    def _server_samples(cls, value):
        return _check_count(value, server_limit('signal_samples'), 'source signal samples')

    @model_validator(mode='after')
    def valid_samples(self):
        if len(self.time_s) != len(self.amplitude) or len(self.time_s) != len(self.phase_rad):
            raise ValueError('Time, amplitude and phase arrays must have equal lengths.')
        if self.time_s[0] < 0 or any(b <= a for a,b in zip(self.time_s, self.time_s[1:])):
            raise ValueError('Source sample times must be nonnegative and strictly increasing.')
        return self


class SourceTimeSettings(Model):
    wavelength: float = Field(default=1.55, gt=0)
    pulse: Literal['gaussian', 'continuous', 'sampled', 'broadband'] = 'gaussian'
    pulse_cycles: float = Field(default=3, ge=1, le=50)
    time_definition: Literal['cycles', 'standard', 'wavelength', 'frequency'] = 'cycles'
    pulse_length: float = Field(default=20e-15, gt=0)  # power FWHM, seconds
    pulse_offset: float = Field(default=50e-15, ge=0)  # envelope centre, seconds
    signal: TimeSignal | None = None
    wavelength_start: float = Field(default=1.3, gt=0)
    wavelength_stop: float = Field(default=1.8, gt=0)
    optimize_for_short_pulse: bool = True
    eliminate_discontinuities: bool = False
    chirp_bandwidth_hz: float = Field(default=100e12, gt=0)

    @model_validator(mode='after')
    def valid_waveform(self):
        if self.pulse == 'sampled' and self.signal is None:
            raise ValueError('A sampled source requires time, amplitude and phase data.')
        if self.wavelength_stop < self.wavelength_start:
            raise ValueError('Source stop wavelength must be at least its start wavelength.')
        if self.time_definition in ('wavelength','frequency') and self.pulse != 'broadband':
            raise ValueError('Automatic wavelength/frequency ranges require the broadband pulse generator.')
        if self.pulse == 'broadband' and self.time_definition == 'cycles':
            raise ValueError('Broadband pulses require a wavelength/frequency range or standard time-domain parameters.')
        if self.pulse == 'broadband' and self.time_definition == 'standard' and self.chirp_bandwidth_hz >= 2*299792458.0/(self.wavelength*1e-6):
            raise ValueError('Chirp bandwidth must leave its lowest frequency positive.')
        return self


class Source(Item, SourceTimeSettings):
    name: str = 'source'
    kind: Literal['point', 'plane', 'tfsf'] = 'point'
    injection: Literal['soft', 'oneway'] = 'soft'
    normal: Literal['x', 'y', 'z'] = 'x'
    direction: Literal['+', '-'] = '+'
    incident_pml_cells: int = Field(default=96, ge=32, le=512)
    size: tuple[float, float, float] = (0, 2, 0)
    component: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    # None preserves the legacy Cartesian component. Angles select a unit
    # vector in that component's E/H family. theta is measured from +z.
    theta: float | None = Field(default=None, ge=0, le=180)
    phi: float = 0
    amplitude: float = Field(default=1, gt=0, le=100)
    phase: float = 0  # degrees
    use_global_source: bool = False
    # A soft sheet may span the lateral CPML so that its edge wave is absorbed
    # instead of diffracting into the interior (a plane wave through the PML).
    extend_through_pml: bool = False

    @model_validator(mode='before')
    @classmethod
    def tfsf_defaults(cls, data):
        if isinstance(data,dict) and data.get('kind')=='tfsf':
            data=dict(data)
            data.setdefault('injection','oneway')
            data.setdefault('size',(2,2,2))
        return data

    @model_validator(mode='after')
    def valid_size(self):
        if any(v < 0 for v in self.size):
            raise ValueError('Source spans cannot be negative.')
        if self.kind=='tfsf' and self.injection!='oneway':
            raise ValueError('A TFSF box requires paired one-way E/H injection.')
        if self.extend_through_pml and (self.kind != 'plane' or self.injection != 'soft'):
            raise ValueError('extend_through_pml applies to soft plane sources only.')
        if self.injection == 'oneway':
            if self.kind not in ('plane','tfsf') or not self.component.startswith('E'):
                raise ValueError('One-way injection requires an electric polarization and kind="plane" or "tfsf".')
            if any(field[1].lower() == self.normal for field, _ in self.polarization_components):
                raise ValueError('One-way electric polarization must be transverse to the propagation axis.')
        return self

    @property
    def polarization_components(self):
        if self.theta is None:return ((self.component,1.),)
        def sincos(degrees):
            # Exact cardinal angles avoid spurious components without discarding
            # intentionally weak components at other angles.
            cardinal={0:(0.,1.),90:(1.,0.),180:(0.,-1.),270:(-1.,0.)}
            degrees%=360
            return cardinal[degrees] if degrees in cardinal else (math.sin(math.radians(degrees)),math.cos(math.radians(degrees)))
        st,ct=sincos(self.theta);sp,cp=sincos(self.phi)
        return tuple((self.component[0]+axis,value) for axis,value in zip('xyz',(st*cp,st*sp,ct)) if value!=0)

    @property
    def time_offset_steps(self):
        return .5 if self.component.startswith('H') else 0.


class SpectrumSettings(Model):
    sampling: Literal['fft', 'frequency', 'wavelength', 'chebyshev', 'custom'] = 'fft'
    chebyshev_wavelength: bool = False
    chebyshev_nodes: Literal['roots','lobatto'] = 'roots'
    use_source_limits: bool = False
    custom_frequencies_hz: list[float] = Field(default_factory=list)
    wavelength_start: float = Field(default=1.3, gt=0)
    wavelength_stop: float = Field(default=1.8, gt=0)
    frequency_points: int = Field(default=101, ge=1)
    # Preserve the legacy Hann FFT when opening existing native projects.
    apodization: Literal['hann', 'none', 'start', 'end', 'full'] = 'hann'
    apodization_center: float = Field(default=20e-15, ge=0)  # seconds
    apodization_time_width: float = Field(default=10e-15, gt=0)  # seconds

    @field_validator('custom_frequencies_hz', mode='before')
    @classmethod
    def _server_custom_frequencies(cls, value):
        return _check_count(value, server_limit('frequency_points'), 'custom frequencies')

    @field_validator('frequency_points')
    @classmethod
    def _server_frequency_points(cls, value):
        return _check_at_most(value, server_limit('frequency_points'), 'frequency points')

    @model_validator(mode='after')
    def valid_band(self):
        if self.sampling=='fft' and self.use_source_limits:
            raise ValueError('Source limits require explicit DFT samples, not FFT bins.')
        if self.sampling=='custom':
            if not self.custom_frequencies_hz or any(f<=0 for f in self.custom_frequencies_hz):
                raise ValueError('Custom frequencies must be a nonempty positive list in Hz.')
            if any(b<=a for a,b in zip(self.custom_frequencies_hz,self.custom_frequencies_hz[1:])):
                raise ValueError('Custom frequencies must be strictly increasing.')
            return self
        if self.wavelength_stop < self.wavelength_start:
            raise ValueError('Maximum wavelength must be at least the minimum wavelength.')
        if self.wavelength_start == self.wavelength_stop and self.frequency_points != 1:
            raise ValueError('A single wavelength requires one frequency point.')
        return self


class Monitor(Item):
    kind: Literal['point'] = 'point'
    name: str = 'monitor'
    component: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    spectrum: SpectrumSettings = Field(default_factory=SpectrumSettings)
    use_global_monitor: bool = False
    inherit_apodization: bool = True
    time_downsample: int = Field(default=1,ge=1,le=10000)


class FieldMonitor(Monitor):
    kind: Literal['field'] = 'field'
    name: str = 'frequency monitor'
    normal: Literal['x','y','z'] = 'x'
    size: tuple[float,float,float] = (0,1,1)
    downsample: int = Field(default=1,ge=1,le=32)
    downsample_xyz: tuple[int,int,int] | None = None
    record_fields: tuple[Literal['Ex','Ey','Ez','Hx','Hy','Hz'], ...] = ('Ex','Ey','Ez','Hx','Hy','Hz')
    record_poynting: tuple[Literal['x','y','z'], ...] = ('x','y','z')
    record_flux: bool = True
    dft_precision: Literal['field','float64'] = 'field'
    spatial_interpolation: Literal['specified','nearest'] = 'specified'
    spectrum: SpectrumSettings = Field(default_factory=lambda:SpectrumSettings(sampling='frequency',apodization='none'))

    @model_validator(mode='after')
    def valid_plane(self):
        if self.downsample_xyz is not None and any(not 1<=v<=32 for v in self.downsample_xyz):
            raise ValueError('Axis downsampling must be from 1 to 32.')
        if len(set(self.record_fields))!=len(self.record_fields) or len(set(self.record_poynting))!=len(self.record_poynting):
            raise ValueError('Recorded components must be unique.')
        if not self.record_fields and not self.record_poynting and not self.record_flux:
            raise ValueError('A frequency monitor needs at least one selected output.')
        axis='xyz'.index(self.normal)
        if self.size[axis]!=0 or any(v<=0 for i,v in enumerate(self.size) if i!=axis):
            raise ValueError('Frequency monitor normal span must be zero and transverse spans positive.')
        if not self.use_global_monitor and self.spectrum.sampling=='fft':
            raise ValueError('Distributed frequency monitors require explicit frequency samples, not FFT bins.')
        if not self.use_global_monitor and self.spectrum.apodization=='hann':
            raise ValueError('Distributed monitors support none/start/end/full apodization.')
        return self

    @property
    def required_fields(self):
        fields=set(self.record_fields)
        axes=set(self.record_poynting)|({self.normal} if self.record_flux else set())
        for axis in axes:
            for component in 'xyz':
                if component!=axis:fields.update(('E'+component,'H'+component))
        return tuple(c for c in ('Ex','Ey','Ez','Hx','Hy','Hz') if c in fields)


def default_materials():
    return [Material(name='Air', index=1, color='#b7c5d7'),
            Material(name='SiO2 (constant n)', index=1.444, color='#80c4d7'),
            Material(name='SiN (constant n)', index=2, color='#69a1e8'),
            Material(name='Si (constant n)', index=3.48, color='#cc8bdc')]


class ImportProvenance(Model):
    format: Literal['fsp-native'] = 'fsp-native'
    source_sha256: str = Field(pattern=r'^[a-f0-9]{64}$')
    origin_m: tuple[float, float, float] = (0, 0, 0)
    differences: list[str] = Field(default_factory=list, max_length=1000)


class ProjectLimits(Model):
    """Optional user caps on a project; None, the default, is no cap.

    Resident execution is admitted by the memory estimate, which counts the
    monitors, sources and materials. The workbench server applies SERVER_LIMITS
    whatever a submitted project carries, or under memory admission the list
    ceilings of MEMORY_ADMISSION_LIMITS and the memory estimate (docs/SECURITY.md)."""
    max_structures: int | None = Field(default=None, ge=1, strict=True)
    max_sources: int | None = Field(default=None, ge=1, strict=True)
    max_monitors: int | None = Field(default=None, ge=1, strict=True)
    max_materials: int | None = Field(default=None, ge=1, strict=True)
    max_mesh_refinements: int | None = Field(default=None, ge=1, strict=True)
    # Complex samples (points x frequencies x components) of one frequency-plane monitor.
    max_monitor_samples: int | None = Field(default=None, ge=1, strict=True)


SCHEMA_VERSION = 1


def migrate_project(payload):
    """Bring a saved project dictionary to the current schema.

    Schema 1 is the only version so far, so a version-1 or version-less file
    passes through unchanged. A newer version is refused with the version named,
    instead of failing on whichever field changed. Migrations for later schemas
    belong here, oldest first.
    """
    if not isinstance(payload, dict):
        return payload
    version = payload.get('schema_version', SCHEMA_VERSION)
    if version == SCHEMA_VERSION:
        return payload
    if isinstance(version, int) and version > SCHEMA_VERSION:
        raise ValueError(f'Project schema_version {version} is newer than schema {SCHEMA_VERSION}, the latest this '
                         'torchfdtd reads. Upgrade torchfdtd, or save the project from the newer version as schema 1.')
    raise ValueError(f'Unknown project schema_version {version!r}; this torchfdtd reads schema {SCHEMA_VERSION}.')


class Project(Model):
    schema_version: Literal[1] = 1
    name: str = Field(default='Untitled', min_length=1, max_length=120)
    region: Region = Field(default_factory=Region)
    # Declared before the lists it caps, which are checked against it before their
    # items are validated. Written to JSON only when a cap is set.
    limits: ProjectLimits = Field(default_factory=ProjectLimits)
    materials: list[Material] = Field(default_factory=default_materials, min_length=1)
    structures: list[Structure] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)
    global_source: SourceTimeSettings | None = Field(default_factory=SourceTimeSettings)
    monitors: list[Monitor | FieldMonitor] = Field(default_factory=list)  # trace storage is admitted by the resident estimate
    global_monitor: SpectrumSettings = Field(default_factory=lambda:SpectrumSettings(sampling='frequency',apodization='none'))
    import_provenance: ImportProvenance | None = None
    # Edit counter and content hash of the saved file (G8-04). The workbench
    # increments revision on every committed edit and stores the hash that
    # /api/validate computed; a file whose content no longer matches its hash
    # was changed outside the workbench, which content_matches() reports.
    revision: int = Field(default=0, ge=0)
    content_sha256: str | None = Field(default=None, pattern=r'^[a-f0-9]{64}$')

    @model_validator(mode='before')
    @classmethod
    def migrate(cls, data):
        return migrate_project(data)

    @field_validator('materials', 'structures', 'sources', 'monitors', mode='before')
    @classmethod
    def _count_limits(cls, value, info):
        limits = info.data.get('limits')
        cap = getattr(limits, 'max_'+info.field_name, None) if isinstance(limits, ProjectLimits) else None
        return _check_count(value, effective_limit(cap, info.field_name), info.field_name)

    @model_serializer(mode='wrap')
    def _omit_default_limits(self, handler):
        data = handler(self)
        if self.limits == ProjectLimits():
            data.pop('limits', None)
        return data

    def content_hash(self):
        """SHA-256 of the canonical JSON of every field except the two version fields."""
        import hashlib, json
        payload = self.model_dump(mode='json', exclude={'revision', 'content_sha256'})
        return hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(',', ':'), allow_nan=False).encode('utf-8')).hexdigest()

    def content_matches(self):
        """True when the stored content_sha256 equals the content, None when no hash is stored."""
        return None if self.content_sha256 is None else self.content_sha256 == self.content_hash()

    def stamped(self, revision=None):
        """A copy carrying the current content hash and, when given, a new revision."""
        return self.model_copy(update={'content_sha256': self.content_hash(), **({} if revision is None else {'revision': revision})})

    @model_validator(mode='after')
    def valid_scene(self):
        names = [m.name for m in self.materials]
        if len(set(names)) != len(names):
            raise ValueError('Material names must be unique.')
        items = self.structures + self.sources + self.monitors
        ids = [x.id for x in items]
        if len(set(ids)) != len(ids) or 'fdtd' in ids:
            raise ValueError('Object IDs must be unique and cannot be fdtd.')
        if any(s.material not in names for s in self.structures):
            raise ValueError('A structure references an unknown material.')
        if self.global_source is None and any(s.use_global_source for s in self.sources):
            raise ValueError('Global source settings are unavailable. Configure them before enabling inheritance.')
        r = self.region
        _check_count(r.mesh_refinements, self.limits.max_mesh_refinements, 'mesh refinements')
        from .tensor_project import uses_tensor, validate_tensor_project
        if uses_tensor(self):validate_tensor_project(self)
        from .mesh import configure_auto_mesh
        configure_auto_mesh(self)
        r.valid_grid()
        from .endpoint_native import uses_endpoint, validate_pmc_project
        endpoint = uses_endpoint(r)
        if endpoint:validate_pmc_project(self)
        if r.interface_method=='subpixel':
            active={s.material for s in self.structures if s.enabled}
            dispersive=[m for m in self.materials if m.oscillators and m.name in active]
            if dispersive and r.pml_dispersion=='frozen':
                raise ValueError('pml_dispersion="frozen" is not implemented for dispersive subpixel interfaces. Keep pml_dispersion="ade" or choose staircase.')
        dt = r.time_step
        from .waveforms import pulse_parameters
        for source in self.sources:
            resolved=self.resolved_source(source)
            if resolved.enabled and resolved.kind == 'tfsf':
                from .tfsf import tfsf_plan
                tfsf_plan(resolved,r)
            elif resolved.enabled and resolved.injection == 'oneway':
                from .injection import oneway_plan
                oneway_plan(resolved, r)
            if resolved.enabled and resolved.injection != 'oneway' and any(r.boundaries.pair(a)[0].kind in ('pec','antisymmetric') for a in range(3)):
                from .solver import source_slice
                for field, weight in resolved.polarization_components:
                    scalar=resolved.model_copy(update={'component':field, 'theta':None})
                    location=source_slice(scalar,r)
                    component='xyz'.index(field[1].lower())
                    for axis in range(2 if r.dimension=='2d' else 3):
                        constrained=(component != axis) if field[0]=='E' else (component == axis)
                        index=location[axis]
                        hits_zero=(index.start == 0) if isinstance(index,slice) else (index == 0)
                        if r.boundaries.pair(axis)[0].kind in ('pec','antisymmetric') and constrained and hits_zero:
                            raise ValueError(f'{source.name}: source writes a constrained PEC/antisymmetric wall component ({field}).')
            if resolved.enabled and resolved.pulse=='broadband':
                pulse=pulse_parameters(resolved)
                if pulse.frequency_hz+pulse.frequency_span_hz/2 >= .5/dt:
                    raise ValueError(f'{source.name}: source range exceeds the temporal Nyquist limit. Refine the mesh.')
        for monitor in self.monitors:
            monitor=self.resolved_monitor(monitor);spec = monitor.spectrum
            from .spectra import highest_frequency
            if monitor.enabled and spec.sampling != 'fft' and highest_frequency(spec) >= .5/(dt*monitor.time_downsample):
                raise ValueError(f'{monitor.name}: requested spectrum exceeds the temporal Nyquist limit. Refine the mesh or increase the minimum wavelength.')
            if monitor.kind=='field' and r.dimension=='2d' and monitor.normal=='z':
                raise ValueError('A 2D flux monitor must be x-normal or y-normal.')
        for obj in self.sources + self.monitors:
            if not obj.enabled:
                continue
            for axis in range(2 if r.dimension == '2d' else 3):
                half = obj.size[axis] / 2 if (isinstance(obj, Source) and obj.kind in ('plane','tfsf')) or isinstance(obj,FieldMonitor) else 0
                lower, upper = r.interior_bounds(axis)
                if isinstance(obj, Source) and obj.extend_through_pml and 'xyz'[axis] != obj.normal:
                    lower, upper = -r.actual_size[axis]/2, r.actual_size[axis]/2
                tolerance=16*math.ulp(max(abs(lower),abs(upper),r.size[axis]))
                if obj.center[axis]-half < lower-tolerance or obj.center[axis]+half > upper+tolerance or (half == 0 and obj.center[axis] >= upper and not endpoint):
                    raise ValueError(f'{obj.name} must lie entirely inside the non-PML region.')
            if r.dimension == '2d' and obj.center[2] != 0:
                raise ValueError(f'{obj.name}: z must be 0 in a 2D simulation.')
        return self

    def resolved_monitor(self, monitor):
        spec=(self.global_monitor if monitor.use_global_monitor else monitor.spectrum).model_dump()
        if monitor.use_global_monitor and not monitor.inherit_apodization:
            for key in ('apodization','apodization_center','apodization_time_width'):
                spec[key]=getattr(monitor.spectrum,key)
        if spec['use_source_limits'] and spec['sampling']!='custom':
            bands=[]
            for raw in self.sources:
                if not raw.enabled:continue
                source=self.resolved_source(raw)
                if source.time_definition not in ('wavelength','frequency'):
                    raise ValueError(f'{monitor.name}: source limits require explicitly ranged wavelength/frequency sources. Set an explicit monitor range for other pulse definitions.')
                bands.append((source.wavelength_start,source.wavelength_stop))
            if not bands:raise ValueError(f'{monitor.name}: source limits require an enabled ranged source.')
            spec.update(wavelength_start=min(a for a,b in bands),wavelength_stop=max(b for a,b in bands))
        spec['use_source_limits']=False
        return type(monitor).model_validate({**monitor.model_dump(),'spectrum':spec,'use_global_monitor':False})

    def resolved_source(self, source: Source):
        """Resolve pulse inheritance while retaining local geometry/amplitude/phase."""
        if not source.use_global_source:
            return source
        if self.global_source is None:
            raise ValueError('Global source settings are unavailable.')
        return Source.model_validate({**source.model_dump(), **self.global_source.model_dump(), 'use_global_source':False})

    def save(self, path):
        Path(path).write_text(self.model_dump_json(indent=2), encoding='utf-8')

    @classmethod
    def load(cls, path):
        return cls.model_validate_json(Path(path).read_text(encoding='utf-8'))

    def python_script(self):
        payload = pprint.pformat(self.model_dump(), sort_dicts=False, width=90)
        return ('from torchfdtd import Project, Simulation\n\n'
                '# Geometry and wavelength: micrometres. Time: seconds.\n'
                f'project = Project.model_validate({payload})\n'
                'result = Simulation(project).run()\n'
                'result.save("results/simulation.npz")\n'
                'print(result.summary)\n')


def demo_project(name='waveguide'):
    if name == 'pmc':
        return Project(name='Closed PMC cavity | exact endpoints',
            region=Region(dimension='3d',size=(3.2,3.2,3.2),mesh=.2,steps=160,pml_cells=3,
                backend='cpu',material_sampling='yee',snapshot_interval=3,
                boundaries={a+'_'+side:BoundaryFace(kind='pmc') for a in 'xyz' for side in ('min','max')}),
            sources=[Source(id='source',name='electric pulse',component='Ez',center=(0,0,0),pulse_cycles=1)],
            monitors=[Monitor(id='electric',name='electric probe',component='Ez',center=(.4,0,0)),
                      Monitor(id='magnetic',name='magnetic probe',component='Hy',center=(.4,0,0))])

    # The Project schema has no eigenmode source, so the waveguide is excited by a
    # soft sheet spanning its cross-section: a bidirectional launch of the guided
    # wave, drawn with a double arrow. Stored frames must resolve the carrier: at
    # 1.55 um and 0.05 um mesh one period is 44 steps.
    p = Project(name='SiN waveguide | 2D TMz', region=Region(snapshot_interval=5),
                structures=[Structure(id='waveguide', name='waveguide', size=(8, 0.65, 0.4))],
                sources=[Source(id='source', kind='plane', center=(-2.5, 0, 0), size=(0, 1.0, 0))],
                monitors=[Monitor(id='input', name='input', center=(-1.8, 0, 0)),
                          Monitor(id='output', name='output', center=(2, 0, 0))])
    if name == 'scatterer':
        # A one-way sheet toward +x over the whole transverse cell (periodic in y),
        # so nothing radiates into the left PML.
        p.name = 'Dielectric cylinder | 2D TMz'
        p.region = Region(boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'), y_max=BoundaryFace(kind='periodic')), snapshot_interval=5)
        p.structures = [Structure(id='cylinder', name='cylinder', kind='circle', radius=0.65)]
        p.sources = [Source(id='source', kind='plane', injection='oneway', normal='x', direction='+', center=(-2.5, 0, 0), size=(0, 6, 0))]
    elif name == '3d':
        p.name = 'Dielectric sphere | 3D'
        p.region = Region(dimension='3d', size=(4, 4, 4), mesh=0.1, steps=300, pml_cells=6, snapshot_interval=5)
        p.structures = [Structure(id='sphere', name='sphere', kind='sphere', radius=0.6)]
        p.sources = [Source(id='source', center=(-1, 0, 0))]
        p.monitors = [Monitor(id='output', name='output', center=(1, 0, 0))]
    return Project.model_validate(p.model_dump())
