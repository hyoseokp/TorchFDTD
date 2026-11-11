"""Recorded-interface reconstruction with fixed, absorbing exterior material.

Only a lossless interior is reversed. The full CPML field/auxiliary adjoint is
propagated normally. The boundary history occupies O(steps * transverse area),
not O(steps * volume). This is a scoped alternative to checkpoint replay.
"""
from __future__ import annotations

from dataclasses import dataclass
from contextlib import nullcontext
import math
import threading
import time

import torch

from .boundaries import BoundaryDescription
from .differentiable import DifferentiableResult, _System
from .models import Project
from .recorded_observations import recorder
from .reversible import ReversibleOptions
from .solver import source_slice


@dataclass(frozen=True)
class ReversibleCPMLOptions(ReversibleOptions):
    """Resident state budgets and lossless boundary-history storage.

    Optional asynchronous CPU traces use a bounded pinned two-slot ring.
    trace_storage='auto' prefers a complete device reservation, then an
    asynchronous CPU archive on CUDA. An explicit total host budget is
    required. CPU execution resolves to synchronous CPU storage. Selection
    happens before allocation and is reported per solve, never mid-trajectory.
    No files are created by this API. Fields and CPML remain resident.
    forward_only='auto' runs a call that cannot request a gradient without
    the trace, terminal copies and drift diagnostics; 'never' records anyway.
    diagnostic_chunk_elements bounds the real lanes of one drift-diagnostic
    and validity-check chunk. Above the default, the fp64 summation order of
    the drift L2 changes; signals and gradients do not.
    """

    trace_storage: str = 'device'
    collar_cells: int = 1
    trace_transfers: str = 'sync'
    trace_chunk_steps: int = 32
    forward_only: str = 'auto'
    diagnostic_chunk_elements: int = 65536
    interior_z: tuple[int, int] | None = None
    block_size: int | str | None = None
    forward_kernel: str = 'split'
    adjoint_kernel: str = 'split'
    cells_per_thread: int | str = 1

    def __post_init__(self):
        super().__post_init__()
        from .reversible_cuda_tuning import validate_cells_per_thread
        validate_cells_per_thread(self.cells_per_thread)
        if self.cells_per_thread != 1 and (self.forward_kernel != 'split' or self.adjoint_kernel != 'split'):
            raise ValueError('Multi-cell tuning requires split E/H and split field-adjoint launches.')
        if self.block_size is not None and self.block_size != 'auto' and (
                type(self.block_size) is not int or self.block_size not in (128, 256, 512, 1024)):
            raise ValueError('block_size must be None, auto, 128, 256, 512 or 1024.')
        if self.forward_kernel not in ('split', 'fused_eh'):
            raise ValueError('forward_kernel must be split or fused_eh.')
        if self.adjoint_kernel not in ('split', 'one_pass'):
            raise ValueError('adjoint_kernel must be split or one_pass.')
        if self.forward_only not in ('auto', 'never'):
            raise ValueError('forward_only must be auto or never.')
        if (type(self.diagnostic_chunk_elements) is not int
                or not 65536 <= self.diagnostic_chunk_elements <= 1 << 26):
            raise ValueError('diagnostic_chunk_elements must be an integer in [65536, 2**26].')
        if self.trace_storage not in ('device', 'cpu', 'auto'):
            raise ValueError('trace_storage must be device, cpu or auto.')
        if self.trace_storage == 'auto' and self.host_budget_bytes is None:
            raise ValueError('Automatic trace storage requires an explicit host_budget_bytes total budget.')
        if self.trace_transfers not in ('sync', 'async'):
            raise ValueError('trace_transfers must be sync or async.')
        if self.trace_transfers == 'async' and self.trace_storage not in ('cpu', 'auto'):
            raise ValueError('Asynchronous traces require trace_storage=cpu.')
        if type(self.trace_chunk_steps) is not int or not 1 <= self.trace_chunk_steps <= 1024:
            raise ValueError('trace_chunk_steps must be an integer in [1, 1024].')
        if (isinstance(self.collar_cells, bool) or not isinstance(self.collar_cells, int)
                or self.collar_cells < 1):
            raise ValueError('collar_cells must be a positive integer.')
        if self.interior_z is not None and (
                type(self.interior_z) is not tuple or len(self.interior_z) != 2
                or any(type(v) is not int for v in self.interior_z)
                or self.interior_z[0] >= self.interior_z[1]):
            raise ValueError('interior_z must be None or two integer inclusive indices with lo < hi.')


def _interior_interval(region, collar):
    """Derive free rows from the actual staggered CPML descriptors."""
    description = BoundaryDescription(region)
    active = []
    for (forward, axis, _), segments in description.cpml.items():
        for segment in segments:
            if axis != 2:
                raise ValueError('Recorded-interface reconstruction supports z CPML only.')
            part = segment['slice'][axis]
            offset = 0 if forward else 1
            active.append((part.start + offset, part.stop + offset))
    merged = []
    for lo, hi in sorted(active):
        if merged and lo <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], hi))
        else:
            merged.append((lo, hi))
    nz = region.shape[2]
    if len(merged) != 2 or merged[0][0] != 0 or merged[-1][1] != nz:
        raise ValueError('CPML descriptors must leave one contiguous lossless interior.')
    a, b = merged[0][1] + collar, merged[1][0] - collar - 1
    if b - a < 1:
        raise ValueError('CPML and collar leave fewer than two reconstruction planes.')
    return a, b


def _resolve_interval(region, options):
    lower, upper = _interior_interval(region, options.collar_cells)
    if options.interior_z is None:
        return lower, upper
    a, b = options.interior_z
    if not lower <= a < b <= upper:
        raise ValueError(f'interior_z must lie inside the CPML-free reconstruction interval [{lower}, {upper}].')
    return a, b


def _validate_project(project, options):
    r = project.region
    recommendation = ' Use checkpointed DifferentiableSimulation for other supported physics.'
    if (r.dimension != '3d' or r.precision != 'float32' or r.mesh_type != 'uniform'
            or r.mesh_steps is not None or r.material_sampling != 'yee'
            or r.interface_method != 'staircase' or r.run_control.auto_shutoff
            or r.memory_mode == 'streamed'):
        raise ValueError('ReversibleCPMLSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps.' + recommendation)
    if (any(f.kind not in ('periodic', 'bloch') for axis in (0, 1) for f in r.boundaries.pair(axis))
            or any(f.kind != 'pml' for f in r.boundaries.pair(2))):
        raise ValueError('ReversibleCPMLSimulation requires periodic or Bloch x/y and CPML on both z faces.' + recommendation)
    if any(m.model != 'dielectric' or m.oscillators for m in project.materials):
        raise ValueError('ReversibleCPMLSimulation supports only nondispersive dielectric declarations.' + recommendation)
    a, b = _resolve_interval(r, options)
    for raw in project.sources:
        source = project.resolved_source(raw)
        if not source.enabled:
            continue
        if (source.kind not in ('point', 'plane') or source.injection != 'soft'
                or (source.kind == 'plane' and source.normal != 'z')
                or any(not name.startswith('E') for name, _ in source.polarization_components)):
            raise ValueError('ReversibleCPMLSimulation supports fixed soft electric point or z-normal plane sources only.' + recommendation)
        for component, _ in source.polarization_components:
            resolved = source.model_copy(update={'component': component, 'theta': None})
            z = source_slice(resolved, r)[2]
            lo, hi = (z.start, z.stop - 1) if isinstance(z, slice) else (z, z)
            if not (a <= lo <= hi <= b or hi < a or lo > b):
                raise ValueError('Every electric source component must lie wholly inside or outside the reconstruction interval.')
    monitors = [m for m in project.monitors if m.enabled]
    if not monitors or any(m.kind != 'point' or m.time_downsample != 1 for m in monitors):
        raise ValueError('ReversibleCPMLSimulation requires point E/H monitors sampled every timestep.' + recommendation)
    return a, b


def _interior_blocks(field, a, b, chunk=65536):
    # Reshape only the complete contiguous native field. Each copied rectangle
    # contains at most `chunk` real lanes, even for a very long z axis.
    capacity = chunk // 2 if field.is_complex() else chunk
    rows = field.view(-1, field.shape[2], 3)
    for z in range(a, b + 1, capacity // 3):
        end = min(b + 1, z + capacity // 3)
        row_count = max(1, capacity // (3 * (end - z)))
        for row in range(0, rows.shape[0], row_count):
            yield rows[row:row + row_count, z:end].reshape(-1)


def _interior_scale(system, a, b, chunk=65536):
    """Peak and L2 of the interior E/H; x slabs reduce their owned rows over all ranks."""
    square = torch.zeros((), dtype=torch.float64, device=system.device)
    peak = torch.zeros((), dtype=torch.float32, device=system.device)
    slab = system.decomposition
    for field in system.state()[:2]:
        for block in _interior_blocks(field if slab is None else field[slab.owned], a, b, chunk):
            peak = torch.maximum(peak, block.abs().amax())
            lanes = torch.view_as_real(block) if block.is_complex() else block
            converted = lanes.to(torch.float64)
            square.add_(converted.square().sum())
            del converted
    if slab is not None:
        slab.all_reduce(peak, 'max')
        slab.all_reduce(square, 'sum')
    maximum, norm = float(peak), math.sqrt(float(square))
    if not math.isfinite(maximum) or not math.isfinite(norm):
        raise RuntimeError('Reversible interior fields became nonfinite.')
    return maximum, norm


def _require_finite(value, message, chunk):
    # Chunks bound the scratch. The verdict stays on the device and is read
    # once, instead of one host synchronization per chunk.
    flat = value.reshape(-1)
    chunk = max(1, chunk // 2) if value.is_complex() else chunk
    finite = torch.ones((), dtype=torch.bool, device=value.device)
    for start in range(0, flat.numel(), chunk):
        finite &= torch.isfinite(flat[start:start + chunk]).all()
    if not bool(finite):
        raise RuntimeError(message)


def _require_material(value, chunk):
    flat = value.reshape(-1)
    valid = torch.ones((), dtype=torch.bool, device=value.device)
    for start in range(0, flat.numel(), chunk):
        block = flat[start:start + chunk]
        valid &= torch.isfinite(block).all() & ~(block < 1).any()
    if not bool(valid):
        raise ValueError('The recorded CPML CFL contract requires finite epsilon >= 1 in both maps.')


@torch.no_grad()
def _require_fixed_exterior(value, fixed, interval, chunk):
    """Check both cuts with bounded scratch and one device-to-host verdict."""
    a, b = interval
    nz = value.shape[2]
    components = 3 if value.ndim == 4 else 1
    rows = value.view(-1, nz, components)
    background = fixed.view_as(rows)
    valid = torch.ones((), dtype=torch.bool, device=value.device)
    for first, stop in ((0, a), (b+1, nz)):
        for z in range(first, stop, max(1, chunk // components)):
            end = min(stop, z + max(1, chunk // components))
            count = max(1, chunk // ((end-z)*components))
            for row in range(0, rows.shape[0], count):
                valid &= torch.eq(rows[row:row+count, z:end],
                                  background[row:row+count, z:end]).all()
    if not bool(valid):
        raise ValueError('With explicit interior_z, epsilon must equal fixed_epsilon outside the reconstruction interval.')


def _recorded_system(epsilon, project, spectral, options=None, report=None, decomposition=None):
    system = _System(project, epsilon.detach(), prepare_kernels=False,
                     observation_monitors=None if spectral is None else spectral.observers,
                     observation_cache=getattr(spectral, 'observation_cache', None),
                     decomposition=decomposition)
    if epsilon.is_cuda:
        from .cuda_kernels import FusedYeeCUDA
        from .cuda_complex import FusedComplexYeeCUDA
        kernel = FusedComplexYeeCUDA if system.field_dtype == torch.complex64 else FusedYeeCUDA
        system.kernel = kernel(system.grid, direct_views=True)
    if options is not None:
        if report is None:
            report = {}
        report.update(forward_kernel_used='split', adjoint_kernel_used='split',
                      forward_kernel_requested=options.forward_kernel,
                      adjoint_kernel_requested=options.adjoint_kernel,
                      block_size_requested=options.block_size,
                      cells_per_thread_requested=options.cells_per_thread,
                      fallback_reason={}, cuda_launches={})
        if options.forward_kernel == 'fused_eh':
            from .reversible_cuda_fused import make_forward
            system.fused_eh = make_forward(system, options.block_size, report)
            if system.fused_eh is not None:
                # The fused engine owns both parity bindings. Release the
                # unused split bindings before entering the time loop.
                system.kernel = None
        if options.block_size is not None or options.cells_per_thread != 1:
            from .reversible_cuda_fused import eligibility_reason
            # The per-entry split bodies also support Bloch fields. Preserve
            # the historical block-only fallback when no multi-cell option
            # was requested; other fused-physics restrictions remain separate.
            reason = (None if epsilon.is_cuda and options.cells_per_thread != 1
                      else eligibility_reason(system))
            if reason:
                report['fallback_reason']['block_size' if options.cells_per_thread == 1 else 'cells_per_thread'] = reason
            elif system.kernel is not None:
                from .reversible_cuda_tuning import tune_yee
                tune_yee(system.kernel, options.block_size, report,
                         cells_per_thread=options.cells_per_thread)
        if options.adjoint_kernel == 'one_pass':
            from .reversible_cuda_fused import eligibility_reason
            reason = eligibility_reason(system)
            if reason:
                report['fallback_reason']['adjoint'] = reason
    return system


def _advance_recorded(system, step, frame, a, b):
    """The native E-then-H update, with a trace between the two updates.

    Without a frame (forward only) the same updates run with no trace copy.
    """
    engine = getattr(system, 'fused_eh', None)
    if engine is not None:
        engine.step(step)
        if frame is not None:
            frame[0].copy_(engine.E[1-engine.parity][:, :, b+1, :2])
            frame[1].copy_(engine.H[engine.parity][:, :, a-1, :2])
        engine.swap()
        system.current_step = step + 1
        return
    e, h, *psis = system.state()
    if system.kernel is not None:
        system.update('E', step)
        if frame is not None:
            frame[0].copy_(e[:, :, b + 1, :2])
            frame[1].copy_(h[:, :, a - 1, :2])
        system.update('H', step)
    else:
        curl, psis = system.curl(h, psis, False)
        next_e = system.inject(e + system.grid.courant_number / system.eps4 * curl,
                               'E', step, functional=True)
        del curl
        if frame is not None:
            frame[0].copy_(next_e[:, :, b + 1, :2])
            frame[1].copy_(h[:, :, a - 1, :2])
        curl, psis = system.curl(next_e, psis, True)
        next_h = system.inject(h - system.grid.courant_number * curl,
                               'H', step, functional=True)
        for target, value in zip(system.state(), (next_e, next_h, *psis)):
            target.copy_(value)
    system.current_step = step + 1


@torch.no_grad()
def _forward_only(system, interval, report, spectral):
    """The recorded forward's steps, observations and DFT blocks, with no tape.

    Signals and spectra equal the recorded path's bit for bit. No boundary
    trace, terminal copy or reconstruction scale is kept, so no adjoint exists.
    """
    a, b = interval
    steps = system.region.steps
    block_size = steps if spectral is None else spectral.block_size
    samples = system.grid.E.new_empty((block_size, len(system.monitors)))
    record = recorder(system, samples)
    signals = samples if spectral is None else spectral.zeros()
    started = time.perf_counter()
    for step in range(steps):
        _advance_recorded(system, step, None, a, b)
        row = step % block_size
        record(row)
        if spectral is not None and (row + 1 == block_size or step + 1 == steps):
            spectral.accumulate(signals, samples[:row + 1], step - row)
    chunk = report['diagnostic_chunk_elements']
    _require_finite(signals, 'Recorded CPML observations became nonfinite.', chunk)
    for field in system.state()[:2]:
        _require_finite(field, 'CPML fields became nonfinite.', chunk)
    if system.device.type == 'cuda':
        torch.cuda.synchronize(system.device)
    report.update(forward_seconds=time.perf_counter() - started,
                  sampled_forward_peak=None, sampled_forward_l2=None,
                  diagnostic_cadence_steps=0, terminal_copies=0,
                  observation_block_shape=list(samples.shape),
                  observation_history_retained=spectral is None,
                  checkpoint_replays=0, backward_calls=0)
    return signals


class _RecordedCPML(torch.autograd.Function):
    @staticmethod
    def forward(ctx, epsilon, system, options, interval, report, spectral):
        a, b = interval
        steps = system.region.steps
        # Admission has resolved automatic placement before effective material
        # or fields are allocated. Use that exact decision for this graph's
        # lifetime; later solves may choose differently as live memory changes.
        trace_device = epsilon.device if report['trace_storage'] == 'device' else torch.device('cpu')
        shape = (steps, 2, *epsilon.shape[:2], 2)
        transport = None
        if report['trace_transfers'] == 'async':
            from .reversible_trace import AsyncBoundaryTrace
            transport = AsyncBoundaryTrace(shape, epsilon.device,
                chunk_steps=report['trace_chunk_steps'], dtype=system.field_dtype)
            archive = transport.archive
        else:
            archive = torch.empty(shape, dtype=system.field_dtype, device=trace_device)
        block_size = steps if spectral is None else spectral.block_size
        samples = system.grid.E.new_empty((block_size, len(system.monitors)))
        record = recorder(system, samples)
        signals = samples if spectral is None else spectral.zeros()
        maximum = norm = 0.
        started = time.perf_counter()
        try:
            for step in range(steps):
                frame = transport.frame(step) if transport is not None else archive[step]
                _advance_recorded(system, step, frame, a, b)
                if transport is not None:
                    transport.commit(step)
                row = step % block_size
                record(row)
                if spectral is not None and (row + 1 == block_size or step + 1 == steps):
                    spectral.accumulate(signals, samples[:row + 1], step - row)
                if (step + 1) % 64 == 0 or step + 1 == steps:
                    current_maximum, current_norm = _interior_scale(system, a, b, options.diagnostic_chunk_elements)
                    maximum = max(maximum, current_maximum)
                    norm = max(norm, current_norm)
            if transport is not None:
                transport.finish()
            chunk = report['diagnostic_chunk_elements']
            _require_finite(signals, 'Recorded CPML observations became nonfinite.', chunk)
            _require_finite(archive, 'Recorded CPML boundary trace became nonfinite.', chunk)
            terminal = tuple(value[:, :, a:b + 1].clone() for value in system.state()[:2])
        except BaseException as error:
            if transport is not None:
                transport.__exit__(type(error), error, error.__traceback__)
            raise
        ctx.save_for_backward(epsilon, archive, *terminal)
        ctx.system, ctx.options, ctx.report = system, options, report
        ctx.transport = transport
        ctx.spectral = spectral
        ctx.interval, ctx.scale = interval, (maximum, norm)
        ctx.lock = threading.Lock()
        if epsilon.is_cuda:
            torch.cuda.synchronize(epsilon.device)
        report.update(forward_seconds=time.perf_counter() - started,
                      sampled_forward_peak=maximum, sampled_forward_l2=norm,
                      diagnostic_cadence_steps=64, terminal_copies=1,
                      observation_block_shape=list(samples.shape),
                      observation_history_retained=spectral is None,
                      checkpoint_replays=0, backward_calls=0)
        return signals

    @staticmethod
    def backward(ctx, signal_bar):
        if torch.is_grad_enabled():
            raise RuntimeError('ReversibleCPMLSimulation supports first derivatives only.')
        if not ctx.lock.acquire(blocking=False):
            raise RuntimeError('Concurrent backward calls on one recorded CPML result are not supported.')
        try:
            epsilon, archive, *terminal = ctx.saved_tensors
            system, report = ctx.system, ctx.report
            a, b = ctx.interval
            started = time.perf_counter()
            for target, value in zip(system.state()[:2], terminal):
                # Poison unneeded exterior primal values. No CPML primal
                # inversion or exterior material derivative may consume them.
                target.fill_(float('nan'))
                target[:, :, a:b + 1].copy_(value)
            gradient = torch.zeros_like(epsilon)
            from .reversible_cpml_kernels import InteriorReconstruction
            spectral = ctx.spectral
            seed_buffer = signal_bar if spectral is None else system.grid.E.new_empty(
                (spectral.block_size, len(system.monitors)))
            inverse = InteriorReconstruction(system, a, b, gradient, seed_buffer,
                                             options=ctx.options, report=report)
            staging = (system.grid.E.new_empty(archive.shape[1:])
                       if ctx.transport is None and archive.device != epsilon.device else None)
            reader = ctx.transport.reverse() if ctx.transport is not None else nullcontext(archive)
            current_block, regenerated_blocks = -1, 0
            with reader as frames:
                for step in range(system.region.steps - 1, -1, -1):
                    frame = frames[step]
                    if staging is not None:
                        staging.copy_(frame)
                        frame = staging
                    if spectral is None:
                        inverse.step(step, frame)
                    else:
                        begin = step // spectral.block_size * spectral.block_size
                        if begin != current_block:
                            values = spectral.transpose(signal_bar, begin,
                                min(begin + spectral.block_size, system.region.steps))
                            seed_buffer[:len(values)].copy_(values)
                            del values
                            current_block = begin
                            regenerated_blocks += 1
                        inverse.step(step, frame, observation_index=step - begin)
            absolute, l2 = _interior_scale(system, a, b, ctx.options.diagnostic_chunk_elements)
            forward_peak, forward_l2 = ctx.scale
            relative_peak = absolute / forward_peak if forward_peak else (0. if absolute == 0 else math.inf)
            relative_l2 = l2 / forward_l2 if forward_l2 else (0. if l2 == 0 else math.inf)
            diagnostics = dict(initial_max_abs=absolute, initial_l2=l2,
                               initial_relative_peak=relative_peak,
                               initial_relative_l2=relative_l2,
                               regenerated_seed_blocks=regenerated_blocks,
                               seed_buffer_shape=list(inverse.signal_bar.shape),
                               inverse_steps=system.region.steps,
                               transpose_steps=system.region.steps)
            report['last_backward'] = diagnostics
            if max(relative_peak, relative_l2) > ctx.options.reconstruction_tolerance:
                raise RuntimeError('Recorded CPML reconstruction drift exceeds the declared tolerance. Rerun with checkpointed DifferentiableSimulation.')
            _require_finite(gradient, 'Recorded CPML material gradient is nonfinite.',
                            report['diagnostic_chunk_elements'])
            if epsilon.is_cuda:
                torch.cuda.synchronize(epsilon.device)
            report['backward_calls'] += 1
            diagnostics['seconds'] = time.perf_counter() - started
            return gradient, None, None, None, None, None
        finally:
            ctx.lock.release()


class ReversibleCPMLSimulation(torch.nn.Module):
    """Scalar or diagonal material differentiation in a fixed absorbing exterior.

    ``model(epsilon, fixed_epsilon=background)`` uses epsilon only on
    ``interior_z`` (inclusive indices). All other material values come from
    background, which must not require gradients. Consequently epsilon's
    exterior gradient is exactly zero by the actual forward definition.

    Both FP32 maps have the grid shape or grid shape plus three components.
    Point or z-plane sources are fixed impressed electric increments and may
    lie outside the reconstructed interval. Bloch fields use complex64. The full resident
    CPML forward and adjoint are retained, while only four boundary planes
    per timestep and one interior terminal state replace checkpoint replay.
    With an isotropic oscillator ``material``, the input is FP32 density rho
    in [0,1]. The fixed background is scalar, per-z or laterally uniform.
    Packed pole states participate in terminal reconstruction and its VJP.
    An x ``decomposition`` (SlabDecomposition) gives every rank its owned
    rows of both maps; each slab records its own boundary trace and
    reconstructs its own interior, and every rank receives all signals.
    """

    _explicit_dispersive_parameters = True

    def __init__(self, project: Project, options: ReversibleCPMLOptions | None = None, *, material=None,
                 decomposition=None):
        super().__init__()
        self.project = Project.model_validate(project.model_dump())
        self.options = options or ReversibleCPMLOptions()
        self.decomposition = decomposition
        from .reversible_lorentz import resolve_material, proxy_project
        if not isinstance(self.options, ReversibleCPMLOptions):
            raise ValueError('ReversibleCPMLSimulation requires ReversibleCPMLOptions.')
        from .boundaries import reject_pmc_faces
        reject_pmc_faces(self.project.region, 'ReversibleCPMLSimulation')
        _validate_project(proxy_project(self.project) if any(m.oscillators for m in self.project.materials) else self.project, self.options)
        self.material = resolve_material(self.project, material)
        if self.material is None and self.options.offload_terminal:
            raise ValueError('Terminal offload is currently available for reversible Lorentz density mixtures only.')
        if decomposition is not None and (self.material is not None or decomposition.axis != 0
                                          or self.options.forward_kernel != 'split' or self.options.adjoint_kernel != 'split'
                                          or self.options.cells_per_thread != 1):
            raise ValueError('Slab reconstruction splits x for dielectric maps with split, single-cell E/H and adjoint launches.')
        from .adjoint_memory import _resident_contract
        _resident_contract(self.project.region, self.options)

    def _snapshot(self):
        if not isinstance(self.options, ReversibleCPMLOptions):
            raise ValueError('ReversibleCPMLSimulation requires ReversibleCPMLOptions.')
        project = Project.model_validate(self.project.model_dump())
        from .reversible_lorentz import resolve_material, proxy_project
        interval = _validate_project(proxy_project(project) if any(m.oscillators for m in project.materials) else project, self.options)
        material = resolve_material(project, self.material)
        return project, interval

    @property
    def interior_z(self):
        return self._snapshot()[1]

    def plan(self, *, device='cpu', material_components=1, density_layers=None):
        project, interval = self._snapshot()
        if self.material is not None:
            if material_components != 1:
                raise ValueError('Lorentz density mixtures require scalar isotropic material input.')
            from .reversible_lorentz import resolve_material, reservation
            material = resolve_material(project, self.material)
            shape = (*project.region.shape[:2], project.region.shape[2] if density_layers is None else density_layers)
            return reservation(project, self.options, torch.device(device), interval,
                               material, density_shape=shape)[0]
        from .reversible_cpml_memory import _cpml_reversible_reservation
        return _cpml_reversible_reservation(project, self.options, torch.device(device), interval,
                                           material_components=material_components,
                                           decomposition=self.decomposition)

    def forward(self, epsilon, *, fixed_epsilon):
        return self._run(epsilon, None, fixed_epsilon=fixed_epsilon)

    def _run(self, epsilon, spectral, *, fixed_epsilon):
        project, interval = self._snapshot()
        if self.material is not None:
            from .reversible_lorentz import resolve_material, execute_density
            material = resolve_material(project, self.material)
            return execute_density(epsilon, fixed_epsilon, project, self.options, interval, material, spectral)
        d = self.decomposition
        grid = project.region.shape if d is None else d.owned_shape
        from .domain_decomposition import collective_errors
        with collective_errors(d):
            for name, value in (('epsilon', epsilon), ('fixed_epsilon', fixed_epsilon)):
                if (not isinstance(value, torch.Tensor) or value.dtype != torch.float32
                        or value.device.type not in ('cpu', 'cuda') or value.layout != torch.strided
                        or not value.is_contiguous() or value.is_conj() or value.is_neg()
                        or tuple(value.shape) not in (grid, (*grid, 3))):
                    raise ValueError(f'{name} must be a contiguous resolved scalar FP32 or diagonal FP32 CPU/CUDA tensor matching the region shape (the owned slab rows with a decomposition).')
            if fixed_epsilon.requires_grad:
                raise ValueError('fixed_epsilon must not require gradients. Only the explicit reconstruction interior is differentiable.')
            if fixed_epsilon.device != epsilon.device:
                raise ValueError('epsilon and fixed_epsilon must use the same device.')
            if fixed_epsilon.shape != epsilon.shape:
                raise ValueError('epsilon and fixed_epsilon must have the same scalar or diagonal shape.')
            from .reversible_cpml_memory import _cpml_reversible_reservation
            reservation = _cpml_reversible_reservation(project, self.options, epsilon.device, interval,
                                                       material_components=3 if epsilon.ndim == 4 else 1,
                                                       spectral=spectral, decomposition=d)
            chunk = reservation['diagnostic_chunk_elements']
            for value in (epsilon, fixed_epsilon):
                _require_material(value, chunk)
            if self.options.interior_z is not None:
                _require_fixed_exterior(epsilon, fixed_epsilon, interval, chunk)
        if epsilon.is_cuda:
            from .cuda_bootstrap import prepare_cuda_kernels
            prepare_cuda_kernels()
        a, b = interval
        effective = fixed_epsilon.clone()
        effective[:, :, a:b + 1] = epsilon[:, :, a:b + 1]
        # effective requires a gradient exactly when one can be requested.
        forward_only = self.options.forward_only == 'auto' and not effective.requires_grad
        report = dict(experimental=True, adjoint='recorded-interface CPML reconstruction',
                      higher_order=False, full_time_autograd=False, spatial_streaming=False,
                      checkpoint_capacity=0, reconstruction_interval_z=[a, b],
                      reconstruction_tolerance=self.options.reconstruction_tolerance,
                      material_gradient_scope='interior only, exterior fixed by explicit background',
                      source_material_gradient='unrestricted interior, fixed impressed increments',
                      cpml_primal_inverted=False,
                      backend='fused CUDA' if epsilon.is_cuda else 'torch CPU',
                      forward_only=forward_only, **reservation)
        if d is not None:
            report['decomposition'] = d.report()
            # The halo rows are the neighbouring material and carry no gradient.
            effective = d.extend(effective)
        system = _recorded_system(effective, project, spectral, self.options, report, d)
        observation = spectral if spectral is None or d is None else spectral.restricted(system.monitor_columns)
        if forward_only:
            signals = _forward_only(system, interval, report, observation)
        else:
            signals = _RecordedCPML.apply(effective, system, self.options, interval, report, observation)
        if d is not None:
            signals = d.gather(signals, system.monitor_columns,
                               sum(m.enabled for m in project.monitors) if spectral is None else len(spectral.components))
        if spectral is not None:
            return spectral.result(signals, report)
        return DifferentiableResult(signals, project.region.time_step,
                                    tuple(m.component for m in project.monitors if m.enabled), report)
