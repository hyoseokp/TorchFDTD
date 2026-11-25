"""Workbench execution modes: GPU or CPU placement and resident or streamed memory.

`resolve_execution` turns `Region.execution_mode` into a concrete plan from the
resources the server reports. Resident scenes keep running through
`Simulation`. Scenes resolved to a streamed mode run the `StreamedSimulation`
slab operator forward only, with DRAM or file-backed field banks, point and
plane monitors as tile observations and one field snapshot at the final step.
The explicit tiled mode runs the approximate overlapping-tile decomposition of
`torchfdtd.tiled` forward only. Thresholds are documented in
docs/EXECUTION_MODES.md.
"""
from __future__ import annotations

from dataclasses import asdict, replace
import math
import os
from pathlib import Path
import time
from types import SimpleNamespace
import warnings

import numpy as np
import torch

from .models import Project, Monitor, effective_limit
from .memory_profile import host_memory

# The resident CUDA solver refuses estimates above 75% of free device memory.
RESIDENT_DEVICE_FRACTION = .75
# Host admission everywhere in the streamed engine uses 80% of available RAM.
RESIDENT_HOST_FRACTION = .8
STREAMED_HOST_FRACTION = .8
STREAMED_DEVICE_FRACTION = .8
STREAMED_DISK_FRACTION = .8
DEFAULT_SLAB_WIDTH = 32
DEFAULT_TEMPORAL_DEPTH = 4
OBSERVER_WARNING = 50_000


def execution_resources():
    """Live resource record: the /api/health fields the resolver reads."""
    # With CUDA_VISIBLE_DEVICES="" this torch build reports is_available() but no device.
    cuda = torch.cuda.is_available() and torch.cuda.device_count() > 0
    record = dict(cuda=cuda, cupy=False, gpu=None, gpu_free_bytes=0, gpu_total_bytes=0)
    if cuda:
        from .cuda_memory import cuda_mem_info
        free, total = cuda_mem_info()
        record.update(gpu=torch.cuda.get_device_name(0), gpu_free_bytes=int(free), gpu_total_bytes=int(total))
        try:
            from .cuda_bootstrap import prepare_cuda_kernels
            prepare_cuda_kernels()
            record['cupy'] = True
        except RuntimeError:
            record['cupy'] = False
    host = host_memory()
    record.update(host_total_bytes=host['total_bytes'], host_available_bytes=host['available_bytes'])
    return record


def scratch_directory(root):
    """Scratch for file-backed banks: TORCHFDTD_SCRATCH or <results>/scratch."""
    return Path(os.environ.get('TORCHFDTD_SCRATCH') or Path(root)/'scratch').resolve()


def _gib(value):
    if value is None:
        return 'unknown'
    return f'{value/2**30:.2f} GiB' if value >= 2**30 else f'{value/2**20:.1f} MiB'


class _Cancelled(Exception):
    pass


class BrowserObservations:
    """Tile observations for point time histories and plane DFT accumulators.

    Conventions follow the resident solver: a sample is taken after the
    completed step, E at (n+1) dt and H half a step later; planes accumulate
    exp(+2 pi i f t) with the monitor's apodization window and time stride and
    are interpolated from the observed Yee cells after accumulation.
    """
    def __init__(self, project):
        from .field_monitors import plane_plan, interpolation_map
        from .solver import index_at
        from .spectra import frequency_samples, apodization_window
        self.project = project
        r = self.region = project.region
        self.dt, self.steps = r.time_step, r.steps
        points, specs = [], []
        for raw in project.monitors:
            if not raw.enabled:
                continue
            m = project.resolved_monitor(raw)
            if m.kind == 'point':
                points.append((m, m.component, int(np.ravel_multi_index(index_at(m.center, r, m.component), r.shape))))
                continue
            plan = plane_plan(r, m)
            maps = [(component,)+tuple(interpolation_map(r, component, plan['points_um'])) for component in m.required_fields]
            specs.append((m, plan, maps))
        # One observer per distinct (component, Yee cell), grouped by component.
        cells = {c: [] for c in ('Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz')}
        for _, component, cell in points:
            cells[component].append(np.array([cell], dtype=np.int64))
        for _, _, maps in specs:
            for component, indices, _ in maps:
                cells[component].append(indices.ravel()//3)
        observers, offsets, unique = [], {}, {}
        for component, arrays in cells.items():
            if not arrays:
                continue
            offsets[component], unique[component] = len(observers), np.unique(np.concatenate(arrays))
            axis = 'xyz'.index(component[1])
            observers.extend((component, (int(i), int(j), int(k)), axis) for i, j, k in zip(*np.unravel_index(unique[component], r.shape)))
        def column(component, index):
            return offsets[component]+np.searchsorted(unique[component], index)
        self.points = [m for m, _, _ in points]
        self.point_columns = [int(column(component, cell)) for _, component, cell in points]
        self.planes = []
        for m, plan, spec in specs:
            maps = [(column(component, indices//3), weights) for component, indices, weights in spec]
            times = np.arange(1, r.steps+1)*self.dt
            mask = (np.arange(r.steps) % m.time_downsample == 0)*m.time_downsample
            windows = {family: apodization_window(times+shift, m.spectrum)*self.dt*mask
                       for family, shift in (('E', 0.), ('H', self.dt/2))}
            columns = np.array(sorted({int(c) for cols, _ in maps for c in cols.ravel()}), dtype=np.int64)
            position = {int(c): i for i, c in enumerate(columns)}
            families = {family: np.array([i for i, c in enumerate(columns) if observers[c][0][0] == family], dtype=np.int64)
                        for family in 'EH'}
            frequency = frequency_samples(m.spectrum)
            self.planes.append(SimpleNamespace(monitor=m, plan=plan, maps=maps, frequency=frequency, windows=windows,
                                               columns=columns, position=position, families=families,
                                               accumulator=np.zeros((len(frequency), len(columns)), dtype=np.complex128)))
        self.observers = tuple(observers)
        self.components = tuple(o[0] for o in observers)
        self.signals = None

    def reservation(self, depth):
        """Host bytes for retained histories, accumulators and one block of samples."""
        item = 8 if self.region.precision == 'float64' else 4
        item *= 2 if self.region.complex_fields else 1
        histories = 2*self.steps*len(self.points)*item
        accumulators = 2*sum(p.accumulator.nbytes for p in self.planes)
        block = 4*depth*len(self.observers)*max(item, 16)
        maps = sum(c.nbytes+w.nbytes for p in self.planes for c, w in p.maps)+sum(p.columns.nbytes*2 for p in self.planes)
        return dict(spectral_reservation_bytes=histories+accumulators+block+maps,
                    point_history_bytes=histories, plane_accumulator_bytes=accumulators, block_sample_bytes=block)

    def start(self, field_dtype):
        dtype = {torch.float32: np.float32, torch.float64: np.float64, torch.complex64: np.complex64, torch.complex128: np.complex128}[field_dtype]
        self.signals = np.zeros((self.steps, len(self.points)), dtype=dtype)

    def accumulate(self, values, start):
        v = values.numpy() if isinstance(values, torch.Tensor) else np.asarray(values)
        if not np.isfinite(v).all():
            raise FloatingPointError('Fields diverged. Check mesh, sources and precision.')
        depth = v.shape[0]
        if self.point_columns:
            self.signals[start:start+depth] = v[:, self.point_columns]
        for plane in self.planes:
            block = v[:, plane.columns]
            for family, local in plane.families.items():
                if not len(local):
                    continue
                t = (np.arange(start, start+depth)+1)*self.dt+(self.dt/2 if family == 'H' else 0.)
                kernel = np.exp(2j*np.pi*plane.frequency[:, None]*t[None, :])*plane.windows[family][None, start:start+depth]
                plane.accumulator[:, local] += kernel@block[:, local]

    def plane_results(self):
        from .field_monitors import plane_result
        results = []
        for plane in self.planes:
            fields = []
            for columns, weights in plane.maps:
                local = np.vectorize(plane.position.__getitem__)(columns)
                fields.append((plane.accumulator[:, local]*weights[None]).sum(axis=1))
            values = np.stack(fields, axis=-1)
            results.append(plane_result(plane.monitor, plane.plan, plane.frequency, plane.monitor.required_fields,
                                        values, self.region.dimension))
        return results


def _browser_scene(project):
    """Internal streamed project (dummy point monitor) and the real observations."""
    p = Project.model_validate(project.model_dump())
    from .tensor_project import uses_tensor
    if uses_tensor(p):
        raise ValueError('Anisotropic tensor materials stream only through the Python StreamedTensorSimulation API. Run this scene resident.')
    from .endpoint_native import uses_endpoint
    if uses_endpoint(p.region):
        raise ValueError('PMC/symmetric faces run resident only in the workbench.')
    observations = BrowserObservations(p)
    internal = p.model_copy(deep=True)
    internal.region.memory_mode = 'streamed'
    internal.monitors = [Monitor()]
    return Project.model_validate(internal.model_dump()), observations


def _base_options(storage, backend, health, scratch):
    from .streamed import StreamedAdjointOptions
    device = 'cuda' if backend == 'cuda' and health.get('cupy') else 'cpu'
    available = health.get('host_available_bytes')
    host_budget = max(1, int(available*STREAMED_HOST_FRACTION)) if available is not None else 1 << 62
    gpu_budget = max(1, int((health.get('gpu_free_bytes') or 0)*STREAMED_DEVICE_FRACTION)) if device == 'cuda' else 1
    options = StreamedAdjointOptions(slab_width=DEFAULT_SLAB_WIDTH, temporal_depth=DEFAULT_TEMPORAL_DEPTH, checkpoints=0,
                                     device=device, host_budget_bytes=host_budget, gpu_budget_bytes=gpu_budget)
    if storage == 'disk':
        from .state_store import disk_free
        free = disk_free(scratch)
        options = replace(options, state_storage='disk', state_directory=str(scratch),
                          disk_budget_bytes=max(1, int(free*STREAMED_DISK_FRACTION)))
    return options


def _select_policy(internal, base, observations):
    """Default slab 32 x depth 4, else the nearest admitted planner candidate."""
    from .streamed_planning import plan_streamed_work
    from .streamed import _reservation
    from .boundaries import material_shape
    diagonal = internal.region.material_sampling == 'yee'
    plan = plan_streamed_work(internal, base, diagonal=diagonal)
    report = plan.report
    admitted = [report['candidates'][i] for i in report['admitted_indices']]
    if not admitted:
        reasons = sorted({c.get('reason', '') for c in report['candidates']})
        raise ValueError('No streamed tile policy is admitted. '+' | '.join(reasons))
    def distance(candidate):
        o = candidate['options']
        return (abs(math.log2(o['temporal_depth']/base.temporal_depth)), abs(math.log2(o['slab_width']/base.slab_width)), -o['slab_width'])
    admitted.sort(key=distance)
    epsilon = torch.empty(material_shape(internal.region, diagonal), dtype=getattr(torch, internal.region.precision), device='meta')
    rejected = []
    for candidate in admitted:
        options = replace(base, slab_width=candidate['options']['slab_width'], temporal_depth=candidate['options']['temporal_depth'])
        try:
            reservation = _reservation(internal, epsilon, options, observations)
        except ValueError as exc:
            rejected.append(str(exc))
            continue
        policy = dict(slab_width=options.slab_width, temporal_depth=options.temporal_depth, checkpoints=0,
                      state_storage=options.state_storage, tile_device=options.device, tile_transfers=options.tile_transfers,
                      selection='default slab 32 x depth 4, else the nearest admitted candidate from the planner set',
                      planner_candidates=len(report['candidates']), planner_admitted=len(report['admitted_indices']),
                      observers=len(observations.observers))
        return options, reservation, policy
    raise ValueError('No admitted tile policy also fits the scene observations. '+rejected[0])


def _streamed_candidate(project, storage, backend, health, scratch):
    result = dict(storage=storage, admitted=False, reason=None, policy=None, reservation=None, options=None)
    try:
        internal, observations = _browser_scene(project)
        base = _base_options(storage, backend, health, scratch)
        options, reservation, policy = _select_policy(internal, base, observations)
    except (ValueError, RuntimeError, OSError) as exc:
        result['reason'] = str(exc)
        return result
    result.update(admitted=True, options=asdict(options), policy=policy,
                  reservation={k: v for k, v in reservation.items() if isinstance(v, (int, float))})
    result['reason'] = _describe(storage, options, reservation, health)
    return result


def _describe(storage, options, reservation, health):
    parts = [f'host reservation {_gib(reservation["host_reservation_bytes"])} of {_gib(health.get("host_available_bytes"))} available']
    if storage == 'disk':
        parts.append(f'disk banks {_gib(reservation["disk_reservation_bytes"])} (budget {_gib(options.disk_budget_bytes)})')
    if options.device == 'cuda':
        parts.append(f'GPU tiles {_gib(reservation["gpu_reservation_bytes"])} of {_gib(health.get("gpu_free_bytes"))} free')
    parts.append(f'slab {options.slab_width} x depth {options.temporal_depth}')
    return ' · '.join(parts)


def _resident_fit(project, summary, backend, health, cells):
    from .solver import estimate
    summary = summary or estimate(project)
    required = int(summary['estimated_memory_mb']*2**20)
    if backend == 'cuda':
        free, fraction, pool = health.get('gpu_free_bytes'), RESIDENT_DEVICE_FRACTION, 'free device memory'
    else:
        free, fraction, pool = health.get('host_available_bytes'), RESIDENT_HOST_FRACTION, 'available host memory'
    limit = int(free*fraction) if free is not None else None
    fits, reason = True, f'resident estimate {_gib(required)} within {fraction:.0%} of {pool} ({_gib(free)})'
    cell_limit, refusal = effective_limit(project.region.resident_cell_limit, 'resident_cells'), project.region.resident_refusal()
    if project.region.memory_mode == 'streamed':
        fits, reason = False, 'memory_mode is streamed'
    elif cell_limit is not None and cells > cell_limit:
        fits, reason = False, f'{cells:,} cells exceed the resident limit of {cell_limit:,}'
    elif refusal:
        fits, reason = False, refusal
    elif limit is not None and required > limit:
        fits, reason = False, f'resident estimate {_gib(required)} exceeds {fraction:.0%} of {pool} ({_gib(free)})'
    # A CUDA run also keeps its plan, the E/H copies and the plane post-processing in host memory.
    host = summary.get('host_estimated_mb') if backend == 'cuda' else None
    host_required = None if host is None else int(host*2**20)
    available = health.get('host_available_bytes')
    if fits and host_required is not None and available is not None and host_required > int(available*RESIDENT_HOST_FRACTION):
        fits, reason = False, (f'resident host estimate {_gib(host_required)} exceeds {RESIDENT_HOST_FRACTION:.0%} of '
                               f'available host memory ({_gib(available)})')
    return dict(fits=fits, reason=reason, estimated_bytes=required, free_bytes=free, limit_bytes=limit,
                fraction=fraction, cell_limit=cell_limit, host_estimated_bytes=host_required)


def resolve_execution(project, *, health, scratch, summary=None):
    """Resolve Region.execution_mode against a resource record.

    Auto picks resident when the estimate fits the documented margin, then a
    streamed DRAM policy, then the approximate tiles when the project allows
    them, and otherwise refuses with the options named. The record is
    JSON-compatible and carries the reasons; it never raises for a scene that
    fits nothing.
    """
    r = project.region
    requested = r.execution_mode
    backend = 'cuda' if r.backend == 'cuda' or (r.backend == 'auto' and health.get('cuda')) else 'cpu'
    cells = math.prod(r.shape)
    record = dict(requested=requested, mode=None, backend=backend, gpu=health.get('gpu') if backend == 'cuda' else None,
                  cells=cells, reason=None, error=None, warnings=[], scratch_directory=str(scratch),
                  policy=None, reservation=None, options=None)
    record['resident'] = resident = _resident_fit(project, summary, backend, health, cells)
    if requested == 'tiled':
        candidate = record['tiled'] = _tiled_candidate(project, backend, health)
        if candidate['admitted']:
            record.update(mode='tiled', reason=candidate['reason'])
            record['warnings'].extend(candidate['notes'])
        else:
            record['error'] = 'Tiling rejected the scene. '+candidate['reason']
        return record
    if r.memory_mode == 'budgeted':
        # The same refusal Region.require_resident raises at dispatch, reported before the job is accepted.
        record['error'] = 'Budgeted scenes require the adjoint API and an explicit resident byte budget.'
        return record
    if requested == 'resident' or (requested == 'auto' and resident['fits']):
        record.update(mode='resident', reason=resident['reason'])
        if requested == 'resident' and not resident['fits']:
            record['warnings'].append('Resident execution was requested but '+resident['reason']+'.')
        return record
    if requested == 'auto':
        return _resolve_auto(project, record, resident, backend, health, scratch)
    storage = {'streamed_host': 'host', 'streamed_disk': 'disk'}[requested]
    candidate = record['streamed_'+storage] = _streamed_candidate(project, storage, backend, health, scratch)
    if candidate['admitted']:
        _choose_streamed(record, storage, candidate, backend)
    else:
        record['error'] = 'No execution mode fits. '+f'{storage}: {candidate["reason"]}'
    return record


def _choose_streamed(record, storage, candidate, backend):
    record.update(mode='streamed_'+storage, reason=candidate['reason'], policy=candidate['policy'],
                  reservation=candidate['reservation'], options=candidate['options'])
    if backend == 'cuda' and candidate['policy']['tile_device'] == 'cpu':
        record['warnings'].append('CuPy is unavailable, so streamed tiles run on the CPU. Install the cuda-kernels extra for GPU tiles.')
    if candidate['policy']['observers'] > OBSERVER_WARNING:
        record['warnings'].append(f'{candidate["policy"]["observers"]:,} plane observation cells slow every streamed tile. Increase the monitor downsample.')


DISK_SLOWDOWN = 'measured 1.9 to 2.4 times the DRAM time'


def _resolve_auto(project, record, resident, backend, health, scratch):
    """Auto after resident was rejected: DRAM banks, then consented tiles, then refuse.

    Disk streaming is never selected automatically; it stays an explicit
    execution_mode='streamed_disk' choice (docs/EXECUTION_MODES.md).
    """
    r = project.region
    rungs = [dict(tier='resident', chosen=False, reason=resident['reason'])]
    candidate = record['streamed_host'] = _streamed_candidate(project, 'host', backend, health, scratch)
    if candidate['admitted']:
        _choose_streamed(record, 'host', candidate, backend)
        rungs.append(dict(tier='streamed_host', chosen=True, reason=candidate['reason']))
        record['auto'] = dict(rungs=rungs, chosen='streamed_host')
        record['reason'] = f'resident: {resident["reason"]} -> DRAM banks: {candidate["reason"]}'
        return record
    rungs.append(dict(tier='streamed_host', chosen=False, reason=candidate['reason']))
    if r.tiling.allow_approximate:
        tiled = record['tiled'] = _tiled_candidate(project, backend, health)
        if tiled['admitted']:
            free = health.get('gpu_free_bytes') if backend == 'cuda' else health.get('host_available_bytes')
            fraction = RESIDENT_DEVICE_FRACTION if backend == 'cuda' else RESIDENT_HOST_FRACTION
            largest = tiled['plan']['largest_tile_estimate_bytes']
            if free is not None and largest > int(free*fraction):
                tiled['admitted'] = False
                tiled['reason'] = f'the largest tile ({_gib(largest)}) exceeds {fraction:.0%} of the free memory ({_gib(free)}); reduce the tile size'
        if tiled['admitted']:
            record.update(mode='tiled', reason=f'resident: {resident["reason"]} -> DRAM banks: {candidate["reason"]} -> approximate tiles (allowed): {tiled["reason"]}')
            record['warnings'].extend(tiled['notes'])
            record['warnings'].append('Auto chose the approximate tiles: read the mismatch indicator of the finished run and compare overlaps before trusting the result.')
            rungs.append(dict(tier='tiled', chosen=True, reason=tiled['reason']))
            record['auto'] = dict(rungs=rungs, chosen='tiled')
            return record
        rungs.append(dict(tier='tiled', chosen=False, reason=tiled['reason']))
    else:
        rungs.append(dict(tier='tiled', chosen=False, reason='approximate tiling not allowed (tick "Allow approximate tiling" for a planar device)'))
    record['auto'] = dict(rungs=rungs, chosen=None)
    skipped = ' | '.join(f'{rung["tier"]}: {rung["reason"]}' for rung in rungs)
    record['error'] = ('No automatic tier fits this scene. Options: allow approximate tiling for a planar device '
                       '(one sheet source, one output plane, read the mismatch indicator), select Streamed through disk '
                       f'explicitly ({DISK_SLOWDOWN} on the records), or coarsen the mesh. '+skipped)
    return record


class _BrowserOperator:
    """Mixed into the slab operator: tile start callback for progress and cancellation."""
    observer = None

    def tiles(self, depth):
        count = math.ceil(self.host.region.shape[0]/self.width)
        for index, descriptor in enumerate(super().tiles(depth)):
            if self.observer is not None:
                self.observer(index, count)
            yield descriptor


def _display_plane(data, r, axis):
    """Downsample a transverse slice exactly as the resident snapshot does."""
    from .solver import field_axes
    if r.mesh_type != 'uniform':
        indices = []
        for i, coords in enumerate(field_axes(r, r.field)):
            if i == axis:
                continue
            count = min(256, r.base_shape[i])
            pixels = (np.arange(count)+.5)*r.actual_size[i]/count-r.actual_size[i]/2
            indices.append(np.abs(coords[:, None]-pixels).argmin(axis=0))
        return data[indices[0][:, None], indices[1][None, :]]
    return data[::max(1, math.ceil(data.shape[0]/256)), ::max(1, math.ceil(data.shape[1]/256))]


def _final_snapshot(state, r, width):
    """Assemble the configured slice from x slabs of the final bank; returns (slice, index, peak)."""
    from .solver import index_at
    axis = 'xyz'.index(r.slice_axis)
    plane_index = index_at(tuple(r.slice_position if i == axis else 0 for i in range(3)), r, r.field)[axis]
    component = 'xyz'.index(r.field[1].lower())
    bank = state[0] if r.field[0] == 'E' else state[1]
    peak = 0.
    def rows(lo, hi):
        nonlocal peak
        block = bank[lo:hi]
        peak = max(peak, float(torch.linalg.vector_norm(block, float('inf'))))
        return block.numpy()
    if axis == 0:
        data = rows(plane_index, plane_index+1)[0, :, :, component]
    else:
        pieces = []
        for lo in range(0, r.shape[0], width):
            block = rows(lo, min(r.shape[0], lo+width))
            pieces.append(block[:, plane_index, :, component] if axis == 1 else block[:, :, plane_index, component])
        data = np.concatenate(pieces)
    return np.array(data), plane_index, peak


def run_streamed_job(project, resolution, *, progress=None, cancel=None):
    """Forward-only streamed execution of a browser job; returns a solver Result."""
    from .streamed import StreamedAdjointOptions, StreamedSimulation, _reservation, _backing, _StreamedExecution
    from .spacetime import SlabBlockOperator
    from .solver import Result, estimate, voxelize, field_axes, run_signature
    started = time.perf_counter()
    p = Project.model_validate(project.model_dump())
    r = p.region
    options = StreamedAdjointOptions(**resolution['options'])
    internal, observations = _browser_scene(p)
    StreamedSimulation(internal, options)  # the streamed API's scene contract
    stats = estimate(p)
    eps, counts, _ = voxelize(p, with_ownership=True)
    for obj in p.structures:
        if obj.enabled and counts.get(obj.id) == 0:
            stats['warnings'].append(f'{obj.name}: no cells intersect this object. Refine mesh or reposition it.')
    epsilon = torch.from_numpy(np.ascontiguousarray(eps))
    reservation = _reservation(internal, epsilon, options, observations)

    class Operator(_BrowserOperator, SlabBlockOperator):
        pass

    class Execution(_StreamedExecution):
        @property
        def operator_type(self):
            return Operator
    execution = Execution()
    host = execution.host(internal, epsilon, observations)
    observations.start(host.field_dtype)
    report = dict(state_storage=options.state_storage, slab_width=options.slab_width, temporal_depth=options.temporal_depth,
                  checkpoints=0, execution_device=options.device, **reservation)
    starts = list(range(0, r.steps, options.temporal_depth))+[r.steps]
    blocks = len(starts)-1
    completed, termination = 0, 'max_steps'
    setup_seconds = time.perf_counter()-started
    compute_start = time.perf_counter()
    def report_progress(block, tile, tiles):
        if progress:
            progress(dict(step=completed, total=r.steps, frame=None, elapsed=time.perf_counter()-compute_start,
                          block=block, blocks=blocks, tile=tile, tiles=tiles, mode=resolution['mode']))
    def tile_started(block, tile, tiles):
        if cancel is not None and cancel.is_set():
            raise _Cancelled()
        report_progress(block, tile, tiles)
    with torch.no_grad(), _backing(options, report, 'forward') as store:
        operator = execution.operator(host, options, store)
        tiles = math.ceil(r.shape[0]/operator.width)
        state = host.state()
        try:
            for index in range(blocks):
                operator.observer = lambda tile, count, block=index+1: tile_started(block, tile+1, count)
                state, values = operator.forward(epsilon, state, starts[index], starts[index+1]-starts[index])
                observations.accumulate(values, starts[index])
                completed = starts[index+1]
        except _Cancelled:
            termination = 'cancelled'
        operator.observer = None
        report_progress(min(blocks, completed//options.temporal_depth), tiles, tiles)
        snapshot, plane_index, peak = _final_snapshot(state, r, operator.width)
        if operator.workspace is not None:
            report['forward_workspace'] = operator.workspace_report()
    seconds = time.perf_counter()-compute_start
    report.update(forward_seconds=seconds, blocks=blocks, completed_blocks=completed//options.temporal_depth+(completed % options.temporal_depth > 0), tiles_per_block=tiles)
    if not np.isfinite(snapshot).all():
        raise FloatingPointError('Fields diverged. Check mesh, sources and precision.')
    axis = 'xyz'.index(r.slice_axis)
    component = 'xyz'.index(r.field[1].lower())
    field = {'real': np.real, 'imag': np.imag, 'magnitude': np.abs, 'phase': np.angle}[r.complex_display](_display_plane(snapshot, r, axis))
    volume = eps[..., component] if eps.ndim == 4 else eps
    eps_plane = _display_plane(np.take(volume, plane_index, axis=axis), r, axis)
    tile_cuda = options.device == 'cuda'
    stats.update(backend=resolution['backend'], precision=r.precision, gpu=resolution.get('gpu') if tile_cuda else None,
                 cuda_graph=False, cuda_graph_steps=0, cuda_graph_replays=0,
                 cuda_kernel='fused' if tile_cuda else None, cuda_monitor_kernel=None,
                 steps=completed, requested_steps=r.steps, cancelled=termination == 'cancelled',
                 termination_reason=termination, auto_shutoff=False, diagnostics=[], diagnostic_seconds=0.,
                 diagnostic_backend=None, source_end_s=None, seconds=seconds, setup_seconds=setup_seconds,
                 mcells_per_second=math.prod(r.shape)*completed/max(seconds, 1e-9)/1e6,
                 field_peak=peak, field_peak_scope='final-step rows read for the snapshot', slice_index=plane_index,
                 slice_position=float(field_axes(r, r.field)[axis][plane_index]) if r.material_sampling == 'yee' else (0 if r.dimension == '2d' else (plane_index+.5)*r.mesh-r.actual_size[axis]/2),
                 complex_fields=r.complex_fields, complex_display=r.complex_display,
                 material_update='nondispersive', dispersive_samples=0, material_sampling=r.material_sampling,
                 epsilon_definition='instantaneous relative permittivity',
                 boundaries=r.boundaries.model_dump(), bloch_phase=r.bloch_phase,
                 units='geometry: um; time: s; E/H: reduced fields; Bloch phase: rad',
                 engine='TorchFDTD streamed Yee/CPML slabs (forward only)',
                 execution=dict(mode=resolution['mode'], policy=resolution['policy'], scratch_directory=resolution['scratch_directory'],
                                reservation={k: v for k, v in reservation.items() if isinstance(v, (int, float))},
                                report=report, blocks=blocks, tiles_per_block=tiles,
                                snapshot='final step only', full_fields_saved=False))
    frequency_results = observations.plane_results()
    signature = run_signature(p, completed)
    for m in frequency_results:
        m['run_signature'] = signature
    empty = np.zeros((0, 0, 0, 3), dtype=eps.dtype)
    return Result(p, stats, np.array([field]), np.array([completed]), eps_plane,
                  observations.signals[:completed], np.arange(1, completed+1)*r.time_step, empty, empty, frequency_results)


def _tiled_plan(project):
    """Plan the tiles from Region.tiling; returns the plan and the planner's warnings."""
    from .tiled import plan_tiles
    t = project.region.tiling
    monitors = [m for m in project.monitors if m.enabled and m.kind == 'field']
    normal = monitors[0].normal if len(monitors) == 1 else None
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter('always')
        plan = plan_tiles(project, t.size_um, t.overlap_um, normal=normal, max_angle_deg=t.max_angle_deg)
    return plan, [str(w.message) for w in caught]


def _propagation_pad(plan, distance_um):
    """Zero padding so that rays at the planned angle stay inside the padded window."""
    angle = plan.project.region.tiling.max_angle_deg
    span = min((hi-lo) for lo, hi in plan.interior)*plan.spacing_um
    return int(min(8, max(2, math.ceil(2*distance_um*math.tan(math.radians(angle))/span)+1)))


def _tiled_candidate(project, backend, health):
    from .solver import estimate
    result = dict(admitted=False, reason=None, notes=[], plan=None)
    try:
        plan, notes = _tiled_plan(project)
        # Tiles inherit pml_dispersion: a tile face that a dispersive structure crosses becomes an absorber, and a
        # sheet extended through such a face is refused here (boundaries.absorber_faces), as run_tiled does before any tile runs.
        from .boundaries import absorber_faces
        faces = [absorber_faces(tile.project) for tile in plan.tiles]
        absorbed = sum(map(bool, faces))
        if absorbed:
            notes.append(f'pml_dispersion="absorber": {absorbed} of {len(plan.tiles)} tiles have absorber faces where dispersive '
                         'structures cross the tile boundary; they reflect about 1e-2 to 1 at oblique incidence and across '
                         'transverse interfaces (docs/BOUNDARIES.md).')
        # The largest tile by estimate: every tile of the largest shape, and every tile whose absorber faces add memory.
        cells = [math.prod(tile.project.region.shape) for tile in plan.tiles]
        largest_bytes = max(int(estimate(tile.project)['estimated_memory_mb']*2**20)
                            for tile, n, f in zip(plan.tiles, cells, faces) if n == max(cells) or f)
    except (ValueError, RuntimeError) as exc:
        result['reason'] = str(exc)
        return result
    report = plan.report
    t = project.region.tiling
    suggestion = report['suggestion']
    free = health.get('gpu_free_bytes') if backend == 'cuda' else health.get('host_available_bytes')
    fraction = RESIDENT_DEVICE_FRACTION if backend == 'cuda' else RESIDENT_HOST_FRACTION
    if free is not None and largest_bytes > int(free*fraction):
        notes.append(f'The largest tile ({_gib(largest_bytes)}) exceeds {fraction:.0%} of the free memory ({_gib(free)}). Reduce the tile size.')
    propagation = None
    if t.propagation_um is not None:
        propagation = dict(distance_um=t.propagation_um, index=project.region.background_index, pad=_propagation_pad(plan, t.propagation_um))
    result.update(admitted=True, notes=notes,
                  plan=dict(tiles=report['tiles'], counts=report['counts'], tile_um=report['tile_um'], overlap_um=report['overlap_um'],
                            tile_cells=report['tile_cells'], overlap_cells=report['overlap_cells'], normal=plan.normal,
                            lateral_axes=list(plan.lateral_axes), global_cells=report['global_cells'],
                            largest_tile_cells=report['largest_tile_cells'], total_tile_cells=report['total_tile_cells'],
                            largest_tile_estimate_bytes=largest_bytes, suggestion=suggestion,
                            below_suggestion=bool(suggestion and report['overlap_um'] < suggestion['overlap_um']),
                            propagation=propagation, monitor_id=plan.monitor_id))
    counts = ' x '.join(str(c) for c in report['counts'])
    parts = [f'{report["tiles"]} tiles ({counts}) of {report["tile_um"]:g} um with {report["overlap_um"]:g} um overlap',
             f'largest tile {report["largest_tile_cells"]:,} cells, {_gib(largest_bytes)} resident',
             f'{report["total_tile_cells"]/max(1, report["global_cells"]):.2f} x the device cells']
    if suggestion:
        parts.append(f'suggested overlap {suggestion["overlap_um"]:.3g} um')
    if propagation:
        parts.append(f'focal plane at {propagation["distance_um"]:g} um (pad {propagation["pad"]})')
    result['reason'] = ' · '.join(parts)
    return result


def _stitched_record(stitched, monitor, dimension, **extra):
    """Native plane record (as FrequencyPlane.result) of a stitched or propagated plane."""
    from .adjoint_planes import COMPONENTS
    from .field_monitors import plane_result
    plane = stitched.as_plane()
    plan = dict(points_um=plane.points_um.numpy(), weights=plane.weights.numpy(), shape=tuple(plane.shape),
                normal='xyz'.index(stitched.normal))
    record = plane_result(monitor, plan, stitched.frequency_hz.numpy(), COMPONENTS, plane.fields.numpy(), dimension)
    record.update(run_signature=stitched.run_signature, **extra)
    return record


def _finite(value):
    return value if isinstance(value, (int, float)) and math.isfinite(value) else None


def _relative(values):
    peak = float(np.max(values)) if values.size else 0.
    return values/peak if peak > 0 else values


def run_tiled_job(project, resolution, *, progress=None, cancel=None):
    """Forward-only overlapping-tile execution of a browser job; returns a solver Result."""
    from .tiled import propagate_plane, run_tiled
    from .solver import Result, estimate
    started = time.perf_counter()
    p = Project.model_validate(project.model_dump())
    r = p.region
    plan, notes = _tiled_plan(p)
    stats = estimate(p)
    stats['warnings'].extend(notes)
    monitor = p.resolved_monitor(next(m for m in p.monitors if m.id == plan.monitor_id))
    tiles, steps = len(plan.tiles), r.steps
    done, last_step = 0, None
    compute_start = time.perf_counter()

    def tile_progress(data):
        # Simulation.run reports increasing steps within one tile; a step that
        # does not increase means the next tile has started.
        nonlocal done, last_step
        if last_step is not None and data['step'] <= last_step:
            done += 1
        last_step = data['step']
        if progress:
            progress(dict(step=done*steps+data['step'], total=tiles*steps, frame=None, elapsed=time.perf_counter()-compute_start,
                          tile=done+1, tiles=tiles, mode='tiled'))
    stitched = run_tiled(p, plan, backend=resolution['backend'], executor='sequential',
                         options=dict(progress=tile_progress, cancel=cancel))
    cancelled = cancel is not None and cancel.is_set()
    seconds = time.perf_counter()-compute_start
    records, frames, labels = [], [], []
    propagation = resolution['tiled']['plan']['propagation']
    if not cancelled:
        records.append(_stitched_record(stitched, monitor, r.dimension, tiled=dict(plane='stitched output plane', blend=stitched.blend)))
        # DFT values are reduced field x seconds, far below the viewer's floor: show each map relative to its peak.
        frames.append(_relative(stitched.intensity()[0].numpy()))
        labels.append(dict(label=f'stitched |E|^2 / peak at {float(stitched.frequency_hz[0])*1e-12:.4g} THz', plane='stitched'))
        if propagation:
            focal = propagate_plane(stitched, propagation['distance_um'], propagation['index'], pad=propagation['pad'])
            focal_monitor = monitor.model_copy(update=dict(id=monitor.id+'-focal', name=f'{monitor.name} focal plane +{propagation["distance_um"]:g} um'))
            records.append(_stitched_record(focal, focal_monitor, r.dimension,
                                            tiled=dict(plane='angular-spectrum focal plane', **propagation)))
            frames.append(_relative(focal.intensity()[0].numpy()))
            labels.append(dict(label=f'focal plane |E|^2 / peak at {propagation["distance_um"]:g} um', plane='focal'))
    u_span = float(stitched.u_um[-1]-stitched.u_um[0])+stitched.spacing_um[0]
    v_span = float(stitched.v_um[-1]-stitched.v_um[0])+stitched.spacing_um[1] if len(stitched.v_um) > 1 else float(r.size[2])
    for label in labels:
        label['span_um'] = [u_span, v_span]
        label['axes'] = list(stitched.axes)
    report = dict(stitched.report)
    # The executor record echoes Simulation.run's keyword arguments; keep the JSON-compatible ones.
    report['execution'] = {**report['execution'], 'options': {k: v for k, v in report['execution'].get('options', {}).items()
                                                              if isinstance(v, (int, float, str, bool)) or v is None}}
    report['pairs'] = [dict(q, mismatch=_finite(q['mismatch']), mismatch_center=_finite(q['mismatch_center'])) for q in report['pairs']]
    for key in ('max_mismatch', 'mean_mismatch', 'max_mismatch_center', 'mean_mismatch_center'):
        report[key] = _finite(report.get(key))
    peak = math.sqrt(float(stitched.intensity()[0].max())) if frames else 0.
    tile_cells = plan.report['total_tile_cells']
    from .cuda_kernels import resolve_cuda_kernel
    stats.update(backend=resolution['backend'], precision=r.precision, gpu=resolution.get('gpu'),
                 cuda_graph=False, cuda_graph_steps=0, cuda_graph_replays=0,
                 cuda_kernel=resolve_cuda_kernel(plan.tiles[0].project.region) if resolution['backend'] == 'cuda' else None, cuda_monitor_kernel=None,
                 steps=steps if not cancelled else 0, requested_steps=steps, cancelled=cancelled,
                 termination_reason='cancelled' if cancelled else 'max_steps', auto_shutoff=False, diagnostics=[],
                 diagnostic_seconds=0., diagnostic_backend=None, source_end_s=None, seconds=seconds,
                 setup_seconds=compute_start-started, mcells_per_second=tile_cells*steps/max(seconds, 1e-9)/1e6,
                 field_peak=peak, field_peak_scope='stitched and focal plane |E|', slice_index=None, slice_position=None,
                 complex_fields=False, complex_display=r.complex_display, material_update='resident tiles',
                 dispersive_samples=0, material_sampling=r.material_sampling,
                 epsilon_definition='instantaneous relative permittivity', boundaries=r.boundaries.model_dump(),
                 bloch_phase=r.bloch_phase, units='geometry: um; time: s; E/H: reduced fields',
                 engine='TorchFDTD resident tiles with near-field stitching (approximate)',
                 execution=dict(mode='tiled', plan=resolution['tiled']['plan'], report=report, frames=labels,
                                indicator=dict(max_mismatch=report['max_mismatch'], max_mismatch_center=report['max_mismatch_center'],
                                               mean_mismatch=report['mean_mismatch'], mean_mismatch_center=report['mean_mismatch_center'],
                                               explanation='Relative L2 disagreement of neighbouring tiles inside their shared overlap: the error indicator of an approximate method, not the error against the whole device.'),
                                propagation=propagation, full_fields_saved=False))
    empty = np.zeros((0, 0, 0, 3), dtype=np.float32)
    frame_array = np.array(frames) if frames and len({f.shape for f in frames}) == 1 else np.zeros((0, 0, 0))
    return Result(p, stats, frame_array, np.full(len(frames), steps), np.zeros((0, 0)), np.zeros((0, 0)), np.zeros(0), empty, empty, records)
