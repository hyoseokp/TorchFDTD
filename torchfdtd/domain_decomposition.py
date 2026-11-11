"""Experimental single-domain distributed Yee slabs and their material transpose.

Each process owns only its slab. Point-to-point row exchanges couple those
slabs into one problem. SlabDecomposition supplies the slab extent and halo
rows to the solver systems (DifferentiableSimulation, ReversibleCPMLSimulation
and their plane variants), so they run their own Yee/CPML, source, monitor and
adjoint code on each slab. DistributedYeeDomain is the earlier periodic/Bloch
initial-value propagator, with no CPML or source/monitor framework.
"""
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import timedelta
import cmath
import math
import os
import socket
import threading

import torch
import torch.distributed as dist

from .boundaries import CURL_TERMS, BoundaryDescription, _slice, pmc_faces
from .differentiable import _split


@dataclass(frozen=True)
class SlabOwnership:
    rank: int
    begin: int
    end: int
    shape: tuple


def distributed_capabilities():
    """Read-only backend capabilities, without initializing a process group."""
    available = dist.is_available()
    return dict(distributed=available, gloo=available and dist.is_gloo_available(),
        nccl=available and dist.is_nccl_available(), cuda_devices=torch.cuda.device_count())


def plan_domain_decomposition(region, world_size, *, backend='gloo', rank_budget_bytes=1024**3, checkpoints=2):
    """Admit explicit x ownership without allocating material or field arrays."""
    if isinstance(world_size, bool) or not isinstance(world_size, int) or world_size < 1:
        raise ValueError('world_size must be a positive integer.')
    if isinstance(rank_budget_bytes, bool) or not isinstance(rank_budget_bytes, int) or rank_budget_bytes < 1:
        raise ValueError('rank_budget_bytes must be a positive integer.')
    if isinstance(checkpoints, bool) or not isinstance(checkpoints, int) or not 0 <= checkpoints <= 32:
        raise ValueError('checkpoints must be an integer between zero and 32.')
    if (region.dimension != '3d' or region.mesh_type != 'uniform' or region.mesh_steps is not None
            or region.interface_method != 'staircase'):
        raise ValueError('Distributed Yee requires uniform cubic 3D staircase dielectric coefficients.')
    if any(face.kind not in ('periodic', 'bloch') for axis in range(3) for face in region.boundaries.pair(axis)):
        raise ValueError('This distributed milestone requires periodic/Bloch boundaries on all axes; CPML and mirrors are unsupported.')
    if region.run_control.auto_shutoff:
        raise ValueError('Distributed propagation requires an explicit fixed step count.')
    shape = tuple(region.shape)
    if min(shape) < 2 or world_size > shape[0]:
        raise ValueError('Use at least two cells per global axis and at least one x cell per rank.')
    capability = distributed_capabilities()
    if backend not in ('gloo', 'nccl') or not capability.get(backend, False):
        raise ValueError(f'Requested distributed backend {backend!r} is unavailable or unsupported.')
    if backend == 'nccl' and capability['cuda_devices'] < 1:
        raise ValueError('NCCL requires a visible CUDA device on each participating node.')
    real_item = 8 if region.precision == 'float64' else 4
    field_item = real_item*(2 if region.complex_fields else 1)
    ownership, reservations = [], []
    for rank in range(world_size):
        begin, end = shape[0]*rank//world_size, shape[0]*(rank+1)//world_size
        local = (end-begin, *shape[1:])
        ownership.append(SlabOwnership(rank, begin, end, local))
        # Fixed replay banks, field/curl temporaries, three-component material
        # gradients and row send/receive buffers. No factor of time steps.
        cells, row = math.prod(local), shape[1]*shape[2]
        reservations.append(((96+2*checkpoints)*3*cells+16*3*row)*field_item+24*cells*real_item+4096)
    if max(reservations) > rank_budget_bytes:
        raise ValueError(f'Distributed rank workspace exceeds budget: required={max(reservations)}, budget={rank_budget_bytes}.')
    return dict(ownership=tuple(ownership), rank_reservation_bytes=tuple(reservations),
        max_rank_reservation_bytes=max(reservations), global_shape=shape,
        backend=backend, replicated_global_state=False, halo_rows=1,
        checkpoint_capacity=checkpoints,
        storage_scaling='Owned rank volume plus row halos; independent of propagation step count.',
        exclusions='Caller objectives, optimizer state, process/runtime and communication-backend allocations.')


def _replay_cost(length, slots):
    cost = 0
    while length > 1:
        if slots == 0:
            return cost+length*(length-1)//2
        middle = _split(length, slots)
        cost += middle+_replay_cost(length-middle, slots-1)
        length = middle
    return cost


class _GlobalSum(torch.autograd.Function):
    @staticmethod
    def forward(ctx, value, group):
        result = value.detach().clone()
        dist.all_reduce(result, op=dist.ReduceOp.SUM, group=group)
        return result

    @staticmethod
    def backward(ctx, seed):
        # Each rank backpropagates the same replicated scalar exactly once.
        # Its owned local objective has seed one, not world_size copies of one.
        return seed, None


class _DistributedPropagation(torch.autograd.Function):
    @staticmethod
    def forward(ctx, electric, magnetic, epsilon, domain, steps):
        ctx.save_for_backward(electric, magnetic, epsilon)
        ctx.domain, ctx.steps = domain, steps
        e, h = electric, magnetic
        for _ in range(steps):
            e, h = domain._advance(e, h, epsilon)
        return e, h

    @staticmethod
    def backward(ctx, e_bar, h_bar):
        domain, steps = ctx.domain, ctx.steps
        error = 'Distributed propagation supports first-order derivatives only.' if torch.is_grad_enabled() else None
        try:
            initial_e, initial_h, epsilon = ctx.saved_tensors
        except RuntimeError as failure:
            error = str(failure)
        # Propagate saved-input version failures to peers before their first
        # halo exchange, so one mutated rank cannot strand the other ranks.
        domain._collective_errors(error)
        e_bar = torch.zeros_like(initial_e) if e_bar is None else e_bar
        h_bar = torch.zeros_like(initial_h) if h_bar is None else h_bar
        gradient = torch.zeros_like(epsilon)
        eps = epsilon[..., None] if epsilon.ndim == 3 else epsilon
        replayed = live = peak = 0

        def replay(state, begin, end):
            nonlocal replayed
            e, h = state
            for _ in range(begin, end):
                e, h = domain._advance(e, h, epsilon)
                replayed += 1
            return e, h

        def transpose(state):
            nonlocal e_bar, h_bar
            curl_h = domain._curl(state[1], forward=False)
            # C_forward^H = C_backward for unit-modulus Bloch extensions.
            e_bar = e_bar-domain.courant*domain._curl(h_bar, forward=False)
            contribution = -domain.courant*(e_bar.conj()*curl_h).real/eps.square()
            gradient.add_(contribution.sum(-1) if epsilon.ndim == 3 else contribution)
            h_bar = h_bar+domain.courant*domain._curl(e_bar/eps, forward=True)

        def reverse(begin, end, restart, slots):
            nonlocal live, peak
            while end > begin:
                if end-begin == 1 or slots == 0:
                    for step in reversed(range(begin, end)):
                        state = replay(restart, begin, step)
                        transpose(state)
                    return
                middle = begin+_split(end-begin, slots)
                checkpoint = replay(restart, begin, middle)
                live += 1
                peak = max(peak, live)
                try:
                    reverse(middle, end, checkpoint, slots-1)
                finally:
                    del checkpoint
                    live -= 1
                end = middle
        try:
            reverse(0, steps, (initial_e, initial_h), domain.checkpoints)
        finally:
            reverse = None
        domain.last_report.update(replayed_steps=replayed, backward_steps=steps, peak_checkpoints=peak)
        return e_bar, h_bar, gradient, None, None


class DistributedYeeDomain:
    """One owned slab of a single distributed electromagnetic initial-value problem.

    Initialize torch.distributed externally, bind a distinct CUDA device per
    rank for NCCL, then construct this object on every rank. CPU uses Gloo.
    All ranks must call propagate, global_sum and backward in the same order.
    Each rank backpropagates a replicated global_sum objective exactly once.

    Inputs are local E/H tensors and real scalar/diagonal epsilon >= 1. This
    API neither distributes nor gathers a full-domain tensor. It admits no
    source histories, CPML, mirrors, ADE, nonuniform metrics or early stopping.
    Backward uses a fixed number of rank-local checkpoints and bounded binomial
    replay. An explicit replay-step ceiling rejects pathological schedules.
    Zero checkpoints has quadratic replay work. No speed claim is made.
    """
    def __setattr__(self, name, value):
        if getattr(self, '_sealed', False) and name != 'last_report':
            raise AttributeError('Distributed domain configuration is immutable; construct a new domain.')
        object.__setattr__(self, name, value)

    def __init__(self, region, *, group=None, device='cpu', rank_budget_bytes=1024**3,
                 checkpoints=2, max_replayed_steps=100000):
        if not dist.is_available() or not dist.is_initialized():
            raise RuntimeError('Initialize a torch.distributed process group before creating a distributed domain.')
        self.group = group
        self.rank, self.world_size = dist.get_rank(group), dist.get_world_size(group)
        self.backend = str(dist.get_backend(group))
        local_error = None
        try:
            self.device = torch.device(device)
            if isinstance(max_replayed_steps, bool) or not isinstance(max_replayed_steps, int) or max_replayed_steps < 1:
                raise ValueError('max_replayed_steps must be a positive integer.')
            if self.backend == 'nccl':
                if self.device.type != 'cuda' or self.device.index is None:
                    raise ValueError('NCCL domains require an explicit rank-local CUDA device index.')
                if self.device.index != torch.cuda.current_device():
                    raise ValueError('Bind torch.cuda.set_device to the rank device before construction.')
            elif self.device.type != 'cpu':
                raise ValueError('The Gloo domain contract supports CPU tensors only.')
            self.plan = plan_domain_decomposition(region, self.world_size,
                backend=self.backend, rank_budget_bytes=rank_budget_bytes, checkpoints=checkpoints)
        except (ValueError, RuntimeError, TypeError) as error:
            local_error = str(error)
        self._collective_errors(local_error)
        configuration = (tuple(region.shape), region.precision, region.complex_fields,
            tuple(region.bloch_phase), float(region.rectangular_courant), float(region.time_step),
            region.steps, checkpoints, max_replayed_steps)
        configurations = [None]*self.world_size
        dist.all_gather_object(configurations, configuration, group=self.group)
        if any(item != configurations[0] for item in configurations):
            raise ValueError('All ranks must agree on global shape, precision, phases and time step.')
        self.ownership = self.plan['ownership'][self.rank]
        self.shape = self.ownership.shape
        self.dtype = getattr(torch, region.precision)
        self.field_dtype = ((torch.complex128 if self.dtype == torch.float64 else torch.complex64)
                            if region.complex_fields else self.dtype)
        self.phases = tuple(cmath.exp(1j*angle) if region.complex_fields else 1.
                            for angle in region.bloch_phase)
        self.courant = float(region.rectangular_courant)
        self.time_step = float(region.time_step)
        self.max_steps = region.steps
        self.checkpoints = checkpoints
        self.max_replayed_steps = max_replayed_steps
        self.rank_budget_bytes = rank_budget_bytes
        self.last_report = dict(rank=self.rank, world_size=self.world_size,
            ownership=(self.ownership.begin, self.ownership.end),
            rank_reservation_bytes=self.plan['rank_reservation_bytes'][self.rank],
            backend=self.backend, replicated_global_state=False, hardware_scaling_verified=False,
            replay_policy='bounded binomial checkpoints', checkpoint_capacity=checkpoints,
            max_replayed_steps=max_replayed_steps, communicated_bytes=0)
        self._sealed = True

    def _collective_errors(self, local_error):
        errors = [None]*self.world_size
        dist.all_gather_object(errors, local_error, group=self.group)
        failures = [f'rank {rank}: {error}' for rank, error in enumerate(errors) if error is not None]
        if failures:
            raise ValueError('Distributed admission failed: '+'; '.join(failures))

    def zero_state(self):
        """Allocate only this rank's owned electric and magnetic field arrays."""
        return tuple(torch.zeros((*self.shape, 3), dtype=self.field_dtype, device=self.device) for _ in range(2))

    def _peer(self, rank):
        return rank if self.group is None else dist.get_global_rank(self.group, rank)

    def _transfer(self, send, destination, source, tag):
        send = send.contiguous()
        receive = torch.empty_like(send)
        send_wire = torch.view_as_real(send) if send.is_complex() else send
        receive_wire = torch.view_as_real(receive) if receive.is_complex() else receive
        operations = [dist.P2POp(dist.irecv, receive_wire, self._peer(source), self.group, tag),
                      dist.P2POp(dist.isend, send_wire, self._peer(destination), self.group, tag)]
        for work in dist.batch_isend_irecv(operations):
            work.wait()
        self.last_report['communicated_bytes'] += 2*send.numel()*send.element_size()
        return receive

    def exchange_halo(self, field, *, side):
        """Fetch one adjacent owned row, including the global Bloch winding."""
        if side not in ('left', 'right'):
            raise ValueError('Halo side must be left or right.')
        left, right = (self.rank-1)%self.world_size, (self.rank+1)%self.world_size
        if side == 'left':
            value = field[-1:].clone() if self.world_size == 1 else self._transfer(field[-1:], right, left, 0)
            return value/self.phases[0] if self.rank == 0 else value
        value = field[:1].clone() if self.world_size == 1 else self._transfer(field[:1], left, right, 1)
        return value*self.phases[0] if self.rank == self.world_size-1 else value

    def transpose_halo(self, seed, *, side):
        """Return the owned-row contribution of the Hermitian halo transpose.

        Left-halo seeds accumulate at the returned rank's final owned row.
        Right-halo seeds accumulate at its first row. The caller owns addition.
        """
        if side not in ('left', 'right'):
            raise ValueError('Halo side must be left or right.')
        left, right = (self.rank-1)%self.world_size, (self.rank+1)%self.world_size
        if side == 'left':
            value = seed*complex(1/self.phases[0]).conjugate() if self.rank == 0 and seed.is_complex() else seed
            return value.clone() if self.world_size == 1 else self._transfer(value, left, right, 2)
        value = seed*complex(self.phases[0]).conjugate() if self.rank == self.world_size-1 and seed.is_complex() else seed
        return value.clone() if self.world_size == 1 else self._transfer(value, right, left, 3)

    def _difference(self, field, axis, forward):
        if axis == 0:
            neighbor = self.exchange_halo(field, side='right' if forward else 'left')
            shifted = torch.cat((field[1:], neighbor), 0) if forward else torch.cat((neighbor, field[:-1]), 0)
        else:
            shifted = torch.roll(field, -1 if forward else 1, axis)
            edge = [slice(None)]*4
            edge[axis] = -1 if forward else 0
            shifted[tuple(edge)] *= self.phases[axis] if forward else 1/self.phases[axis]
        return shifted-field if forward else field-shifted

    def _curl(self, field, *, forward):
        result = torch.zeros_like(field)
        for axis in range(3):
            derivative = self._difference(field, axis, forward)
            for a, component, out, sign in CURL_TERMS:
                if a == axis:
                    result[..., out].add_(derivative[..., component], alpha=sign)
        return result

    def _advance(self, electric, magnetic, epsilon):
        eps = epsilon[..., None] if epsilon.ndim == 3 else epsilon
        electric = electric+self.courant*self._curl(magnetic, forward=False)/eps
        magnetic = magnetic-self.courant*self._curl(electric, forward=True)
        return electric, magnetic

    def propagate(self, electric, magnetic, epsilon, *, steps):
        """Collective rank-local final fields with a bounded first-order VJP."""
        error = None
        if isinstance(steps, bool) or not isinstance(steps, int) or not 1 <= steps <= self.max_steps:
            error = 'steps must be a positive integer no larger than the prepared region step count.'
        elif any(not isinstance(v, torch.Tensor) or v.device != self.device or v.dtype != self.field_dtype
                 or tuple(v.shape) != self.shape+(3,) for v in (electric, magnetic)):
            error = 'Initial fields must match the owned rank shape, field dtype and device.'
        elif (not isinstance(epsilon, torch.Tensor) or epsilon.device != self.device or epsilon.dtype != self.dtype
                or tuple(epsilon.shape) not in (self.shape, self.shape+(3,))):
            error = 'Epsilon must be a rank-local real scalar or diagonal tensor.'
        elif any(v.layout != torch.strided for v in (electric, magnetic, epsilon)):
            error = 'Inputs must use dense strided local tensor storage.'
        elif (torch.is_grad_enabled() and any(v.requires_grad for v in (electric, magnetic, epsilon))
                and any(torch.is_inference(v) for v in (electric, magnetic, epsilon))):
            error = 'Differentiated inputs cannot be inference tensors.'
        elif (not all(bool(torch.isfinite(v).all()) for v in (electric, magnetic, epsilon))
                or bool((epsilon < 1).any())):
            error = 'Inputs must be finite and epsilon at least one.'
        self._collective_errors(error)
        settings = [None]*self.world_size
        differentiating = torch.is_grad_enabled() and any(v.requires_grad for v in (electric, magnetic, epsilon))
        dist.all_gather_object(settings, (steps, epsilon.ndim, differentiating), group=self.group)
        if any(value != settings[0] for value in settings):
            raise ValueError('All ranks must agree on steps, material layout and participation in backward.')
        expected_replay = _replay_cost(steps, self.checkpoints) if differentiating else 0
        if expected_replay > self.max_replayed_steps:
            raise ValueError(f'Replay schedule exceeds max_replayed_steps: planned={expected_replay}, limit={self.max_replayed_steps}.')
        self.last_report.update(forward_steps=steps, backward_steps=0, replayed_steps=0,
                               planned_replayed_steps=expected_replay, peak_checkpoints=0)
        return _DistributedPropagation.apply(electric, magnetic, epsilon, self, steps)

    def global_sum(self, local_scalar):
        """Replicate a summed real objective; every rank then calls backward once."""
        error = None
        if (not isinstance(local_scalar, torch.Tensor) or local_scalar.numel() != 1
                or local_scalar.device != self.device or local_scalar.dtype != self.dtype):
            error = 'The local objective must be a real scalar on the rank device.'
        self._collective_errors(error)
        participation = [None]*self.world_size
        dist.all_gather_object(participation, local_scalar.requires_grad and torch.is_grad_enabled(), group=self.group)
        if any(value != participation[0] for value in participation):
            raise ValueError('Every rank must participate in the objective graph; use a zero-weight field objective on unobserved ranks.')
        return _GlobalSum.apply(local_scalar, self.group)


class ProcessGroupTransport:
    """Halo rows and small collectives over a torch.distributed group (Gloo or NCCL)."""

    def __init__(self, group=None):
        if not dist.is_available() or not dist.is_initialized():
            raise RuntimeError('Initialize a torch.distributed process group before creating a slab decomposition.')
        self.group = group
        self.rank, self.world_size = dist.get_rank(group), dist.get_world_size(group)

    def _peer(self, rank):
        return rank if self.group is None else dist.get_global_rank(self.group, rank)

    def exchange(self, send, destination, receive, source):
        """Send one contiguous row to ``destination`` while receiving one from ``source``."""
        if destination is not None and destination == self.rank:
            receive.copy_(send)
            return
        operations = []
        if receive is not None:
            operations.append(dist.P2POp(dist.irecv, receive, self._peer(source), self.group))
        if send is not None:
            operations.append(dist.P2POp(dist.isend, send, self._peer(destination), self.group))
        if operations:
            for work in dist.batch_isend_irecv(operations):
                work.wait()

    def all_reduce(self, tensor, op):
        dist.all_reduce(tensor, op=dist.ReduceOp.SUM if op == 'sum' else dist.ReduceOp.MAX, group=self.group)
        return tensor

    def all_gather_object(self, value):
        values = [None]*self.world_size
        dist.all_gather_object(values, value, group=self.group)
        return values


class _Mailbox:
    def __init__(self, world_size, timeout):
        self.barrier = threading.Barrier(world_size, timeout=timeout)
        self.lock = threading.Lock()
        self.items = {}


class ThreadTransport:
    """In-process ranks on threads that share one mailbox.

    ``ThreadTransport.group(n)`` returns one transport per rank; run each
    rank's calls on its own thread. A failing rank calls ``abort()`` so its
    peers raise instead of waiting. Every rank applies reductions in rank
    order, so all ranks hold identical results. CPU autograd runs backward on
    the calling thread. CUDA autograd runs backward on one engine thread per
    device, so several ranks on one CUDA device can only run forward this way.
    """

    def __init__(self, mailbox, rank, world_size):
        self.mailbox, self.rank, self.world_size = mailbox, rank, world_size
        self.calls = 0

    @classmethod
    def group(cls, world_size, *, timeout=300.):
        mailbox = _Mailbox(world_size, timeout)
        return [cls(mailbox, rank, world_size) for rank in range(world_size)]

    def abort(self):
        self.mailbox.barrier.abort()

    def _round(self, value):
        """Post a value, wait for every rank, and return the posted values of this round."""
        box, call = self.mailbox, self.calls
        self.calls += 1
        with box.lock:
            box.items[call, self.rank] = value
        box.barrier.wait()
        with box.lock:
            values = [box.items[call, rank] for rank in range(self.world_size)]
        box.barrier.wait()
        with box.lock:
            del box.items[call, self.rank]
        return values

    def exchange(self, send, destination, receive, source):
        values = self._round(None if send is None else (destination, send.clone()))
        if receive is not None:
            target, value = values[source]
            if target != self.rank:
                raise RuntimeError('Halo exchange calls are out of step between ranks.')
            receive.copy_(value)

    def all_reduce(self, tensor, op):
        values = self._round(tensor.clone())
        result = values[0].to(tensor.device)
        for value in values[1:]:
            value = value.to(tensor.device)
            result = result+value if op == 'sum' else torch.maximum(result, value)
        tensor.copy_(result)
        return tensor

    def all_gather_object(self, value):
        return self._round(value)


class _GatherColumns(torch.autograd.Function):
    @staticmethod
    def forward(ctx, local, transport, columns, total):
        ctx.columns = columns
        full = local.new_zeros((*local.shape[:-1], total))
        # Each column has one owner; the other ranks add exact zeros.
        full.index_copy_(-1, columns, local)
        return transport.all_reduce(full, 'sum')

    @staticmethod
    def backward(ctx, seed):
        # Every rank computes the same replicated objective, so each rank
        # seeds only the observations it owns.
        return seed.index_select(-1, ctx.columns), None, None, None


@contextmanager
def collective_errors(decomposition):
    """Raise on every rank when the block raised on any rank; inert without a decomposition."""
    if decomposition is None:
        yield
        return
    error = None
    try:
        yield
    except Exception as exc:
        error = exc
    messages = decomposition.transport.all_gather_object(None if error is None else str(error))
    if error is not None:
        raise error
    failures = [f'rank {rank}: {message}' for rank, message in enumerate(messages) if message is not None]
    if failures:
        raise ValueError('Distributed admission failed: '+'; '.join(failures))


class SlabDecomposition:
    """One rank's slab of a single Region split along ``axis``, with one-row halos.

    The rank owns global rows [begin, end) of the split axis and every row of
    the other axes. Its local arrays add one halo row on each side that has a
    neighbour; a periodic split axis is a ring. The solver fills a halo row
    just before each difference that reads it, so every owned row sees the
    values and the operation order of the single-device grid. Halo rows of
    fields, derivatives and adjoints are scratch and are never observed.

    Construct it with the same Region and axis on every rank after the
    process group exists. The transport defaults to the default group.
    """

    def __init__(self, region, *, axis=0, transport=None):
        self.transport = ProcessGroupTransport() if transport is None else transport
        self.rank, self.world_size = self.transport.rank, self.transport.world_size
        self.axis = axis
        configuration = (tuple(region.shape), axis, region.steps, float(region.time_step), self.world_size)
        error = None
        try:
            self._admit(region)
        except ValueError as exc:
            error = str(exc)
        values = self.transport.all_gather_object((error, configuration))
        failures = [f'rank {rank}: {message}' for rank, (message, _) in enumerate(values) if message is not None]
        if failures:
            raise ValueError('Slab decomposition rejected: '+'; '.join(failures))
        if any(value != configuration for _, value in values):
            raise ValueError('All ranks must decompose the same region shape, time step and axis.')
        rows = region.shape[axis]
        self.global_rows = rows
        self.periodic = region.boundaries.pair(axis)[0].kind in ('periodic', 'bloch')
        self.begin, self.end = rows*self.rank//self.world_size, rows*(self.rank+1)//self.world_size
        self.low = int(self.periodic or self.rank > 0)
        self.high = int(self.periodic or self.rank < self.world_size-1)
        self.offset = self.begin-self.low
        owned = list(region.shape)
        owned[axis] = self.end-self.begin
        self.owned_shape = tuple(owned)
        owned[axis] += self.low+self.high
        self.shape = tuple(owned)
        self.ownership = SlabOwnership(self.rank, self.begin, self.end, self.owned_shape)
        self.halo_bytes = 0
        self._components = {}

    def _admit(self, region):
        axis = self.axis
        if isinstance(axis, bool) or axis not in (0, 1, 2):
            raise ValueError('The split axis must be 0, 1 or 2.')
        if region.shape[axis] < self.world_size:
            raise ValueError('Every rank needs at least one row of the split axis.')
        if region.complex_fields:
            raise ValueError('Slab decomposition supports real fields; Bloch phase seams are not implemented.')
        if pmc_faces(region)[1]:
            raise ValueError('Slab decomposition does not split stored upper PMC/symmetric faces; use a lower wall.')
        if axis != 0 and region.boundaries.pair(axis)[0].kind in ('periodic', 'bloch'):
            # Transposed halo derivatives of a wrapped axis accumulate in the
            # single-device seam order only along x, the first CURL_TERMS axis.
            raise ValueError('A periodic split axis must be x.')
        if any(key[1] == axis for key in BoundaryDescription(region).metric):
            raise ValueError('The split axis must have uniform mesh spacing.')

    @property
    def owned(self):
        """Local indices of the owned rows along the split axis."""
        return slice(self.low, self.low+self.end-self.begin)

    def localize(self, description):
        """Restrict YeeGrid/BoundaryDescription boundary data to this slab, in place.

        CPML rows on the split axis are clipped to the owned derivative
        targets; the other CPML memories span the local rows. Wrap and wall
        terms of the split axis stay only on the rank that owns that face.
        """
        a = self.axis
        description.wrap.pop(a, None)
        if self.begin:
            description.pmc_lower.pop(a, None)
        if self.end < self.global_rows:
            description.pec_upper.pop(a, None)
        for (forward, axis, component), segments in description.cpml.items():
            local = []
            for segment in segments:
                shape = list(segment['shape'])
                if axis != a:
                    shape[a] = self.shape[a]
                    local.append(dict(segment, shape=tuple(shape)))
                    continue
                # Derivative row k updates field row k (H) or k+1 (E).
                start = 0 if forward else 1
                lo, hi = segment['slice'][a].start, segment['slice'][a].stop
                first, stop = max(lo, self.begin-start), min(hi, self.end-start)
                if first >= stop:
                    continue
                shape[a] = stop-first
                rows = _slice(a, slice(first-lo, stop-lo))
                local.append(dict(segment, slice=_slice(a, slice(first-self.offset, stop-self.offset)),
                                  shape=tuple(shape), **{key: segment[key][rows] for key in ('b', 'c', 'inv_k')},
                                  **{key: segment[key][first-lo:stop-lo] for key in ('kappa', 'sigma', 'alpha')}))
            description.cpml[forward, axis, component] = local

    def localize_source(self, loc):
        """Local support of one source term on this slab, or None when it has no owned row."""
        part = loc[self.axis]
        if isinstance(part, slice):
            first, stop, _ = part.indices(self.global_rows)
            first, stop = max(first, self.begin), min(stop, self.end)
            if first >= stop:
                return None
            part = slice(first-self.offset, stop-self.offset)
        elif self.begin <= part < self.end:
            part -= self.offset
        else:
            return None
        return tuple(loc[:self.axis])+(part,)+tuple(loc[self.axis+1:])

    def localize_monitors(self, monitors):
        """(global columns, local observations) of the samples whose split-axis row this rank owns."""
        columns, local = [], []
        for column, (name, loc, component) in enumerate(monitors):
            if self.begin <= loc[self.axis] < self.end:
                columns.append(column)
                local.append((name, self.localize_source(loc), component))
        return columns, local

    def _neighbours(self, upward):
        """(destination, source) ranks of a shift toward higher (or lower) rows."""
        up, down = self.rank+1, self.rank-1
        if self.periodic:
            up, down = up % self.world_size, down % self.world_size
        up = up if up < self.world_size else None
        down = down if down >= 0 else None
        return (up, down) if upward else (down, up)

    def _shift(self, tensor, upward, send, receive, components=None):
        """Every rank sends local row ``send`` to its neighbour, which stores it in its row ``receive``."""
        destination, source = self._neighbours(upward)
        def row(index):
            value = tensor.narrow(self.axis, index, 1)
            return value if components is None else value.index_select(-1, components)
        outgoing = None if destination is None else row(send).contiguous()
        incoming = None
        if source is not None:
            shape = list(tensor.shape)
            shape[self.axis] = 1
            if components is not None:
                shape[-1] = components.numel()
            incoming = tensor.new_empty(shape)
        self.transport.exchange(outgoing, destination, incoming, source)
        if incoming is not None:
            target = tensor.narrow(self.axis, receive, 1)
            if components is None:
                target.copy_(incoming)
            else:
                target.index_copy_(-1, components, incoming)
            self.halo_bytes += incoming.numel()*incoming.element_size()

    def _tangential(self, device):
        components = self._components.get(device)
        if components is None:
            components = self._components[device] = torch.tensor(
                [c for c in range(3) if c != self.axis], dtype=torch.long, device=device)
        return components

    def fill_halo(self, field, forward):
        """Fill the halo row of an (..., 3) field read by the next E->H (forward) or H->E difference."""
        last = self.low+self.end-self.begin-1
        components = self._tangential(field.device)
        if forward:
            self._shift(field, False, self.low, self.shape[self.axis]-1, components)
        else:
            self._shift(field, True, last, 0, components)

    def fill_derivative_halo(self, derivative, forward):
        """Fill the halo entry of one transposed split-axis derivative with the neighbour's value.

        Forward (E->H) derivative row k belongs to H row k; the low halo entry
        is the lower neighbour's last owned row. Backward derivative row k
        belongs to E row k+1; the high halo entry is the upper neighbour's first.
        """
        if forward:
            self._shift(derivative, True, self.low+self.end-self.begin-1, 0)
        else:
            self._shift(derivative, False, self.low-1, self.shape[self.axis]-2)

    def extend(self, tensor):
        """Owned rows plus the neighbours' halo rows along the split axis; halos carry no gradient."""
        if not self.low and not self.high:
            return tensor
        rows = self.end-self.begin
        full = tensor.new_empty(self.shape+tuple(tensor.shape[3:]))
        full.narrow(self.axis, self.low, rows).copy_(tensor.detach())
        self._shift(full, True, self.low+rows-1, 0)
        self._shift(full, False, self.low, self.shape[self.axis]-1)
        parts = ([full.narrow(self.axis, 0, 1)]*self.low+[tensor]
                 +[full.narrow(self.axis, self.shape[self.axis]-1, 1)]*self.high)
        return torch.cat(parts, self.axis)

    def gather(self, local, columns, total):
        """Replicate the owned observation columns into the full (..., total) result on every rank."""
        index = torch.tensor(columns, dtype=torch.long, device=local.device)
        return _GatherColumns.apply(local, self.transport, index, total)

    def all_reduce(self, tensor, op='sum'):
        return self.transport.all_reduce(tensor, op)

    def report(self):
        return dict(rank=self.rank, world_size=self.world_size, axis=self.axis,
                    owned_rows=(self.begin, self.end), halo_rows=(self.low, self.high),
                    periodic_axis=self.periodic, local_shape=self.shape, halo_bytes_received=self.halo_bytes)


def _free_port():
    with socket.socket() as probe:
        probe.bind(('127.0.0.1', 0))
        return probe.getsockname()[1]


def init_process_group_from_env(backend=None, *, timeout_seconds=600):
    """Initialize the default group from torchrun variables and return this rank's device.

    NCCL (the default when CUDA is visible) binds ``cuda:LOCAL_RANK``. Gloo
    runs CPU slabs; Windows Gloo cannot create its TCP device, use Linux/WSL.
    """
    backend = backend or ('nccl' if torch.cuda.is_available() else 'gloo')
    device = torch.device('cpu')
    if backend == 'nccl':
        device = torch.device('cuda', int(os.environ.get('LOCAL_RANK', 0)))
        torch.cuda.set_device(device)
    if not dist.is_initialized():
        dist.init_process_group(backend, timeout=timedelta(seconds=timeout_seconds))
    return device


def _spawned(rank, world_size, port, backend, timeout_seconds, function, arguments):
    os.environ.update(RANK=str(rank), LOCAL_RANK=str(rank), WORLD_SIZE=str(world_size),
                      MASTER_ADDR='127.0.0.1', MASTER_PORT=str(port))
    init_process_group_from_env(backend, timeout_seconds=timeout_seconds)
    try:
        function(rank, world_size, *arguments)
    finally:
        dist.destroy_process_group()


def spawn_local(function, world_size, *arguments, backend='gloo', timeout_seconds=600):
    """Run ``function(rank, world_size, *arguments)`` in local processes sharing one group.

    A torchrun-free launcher for one node. ``function`` must be importable
    (module level). NCCL places rank r on cuda:r.
    """
    torch.multiprocessing.spawn(_spawned, args=(world_size, _free_port(), backend, timeout_seconds, function, arguments),
                                nprocs=world_size, join=True)
