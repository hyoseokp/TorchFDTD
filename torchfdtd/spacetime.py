"""Lossless host/file-backed slab blocks and their discrete transpose.

Each tile reads the same immutable block-start state with a K-cell halo for
K complete Yee steps. Oppositely oriented E/H differences have a combined
radius of one along x, not two. CPML ownership follows its derivative target,
and pointwise ADE does not widen this support. Only owned cells are committed.
The transpose accumulates all replicated halo inputs on the host.
"""
from types import SimpleNamespace
import weakref

import torch

from .boundaries import face_index
from .differentiable import _Grid, _System, _split
from .tensor_packet import pack_tensors


def _host_copies(tensors):
    """One payload transfer rather than a synchronization per CPML slab."""
    packed,layout = pack_tensors(tensors)
    return layout.unpack(packed.cpu())


class SlabBlockOperator:
    def __init__(self, host_system, width, device='cuda', *, cuda_binding='direct', reuse_buffers=True,
                 tile_transfers='sync', tile_buffers=2, local_checkpoints=0, state_factory=None):
        if host_system.device.type != 'cpu':
            raise ValueError('Slab metadata and epsilon must reside on CPU.')
        if isinstance(width, bool) or not isinstance(width, int) or width < 1:
            raise ValueError('Slab width must be a positive integer.')
        self.host = host_system
        self.state_factory = state_factory
        self.width = width
        if isinstance(local_checkpoints,bool) or not isinstance(local_checkpoints,int) or not 0 <= local_checkpoints <= 32:
            raise ValueError('local_checkpoints must be an integer between zero and 32.')
        self.local_checkpoints = local_checkpoints
        self.local_replayed_steps = 0
        self.peak_local_checkpoints = 0
        if cuda_binding not in ('direct', 'dlpack'):raise ValueError('cuda_binding must be direct or dlpack.')
        self.direct_views = cuda_binding == 'direct'
        self.device = torch.device(device)
        if self.device.type == 'cuda' and self.device.index is None:
            self.device = torch.device('cuda', torch.cuda.current_device())
        from .tile_workspace import TileWorkspace
        if tile_transfers not in ('sync', 'async'):raise ValueError('tile_transfers must be sync or async.')
        if isinstance(tile_buffers,bool) or not isinstance(tile_buffers,int) or not 1 <= tile_buffers <= 3:
            raise ValueError('tile_buffers must be between one and three.')
        if tile_transfers == 'async' and (not reuse_buffers or self.device.type != 'cuda'):
            raise ValueError('Asynchronous tiles require reusable CUDA buffers.')
        self.workspaces = [TileWorkspace(self.device, asynchronous=tile_transfers == 'async')
                           for _ in range(tile_buffers if tile_transfers == 'async' else 1)] if reuse_buffers else []
        self.workspace = self.workspaces[0] if self.workspaces else None
        self.bank_bytes_live = self.bank_bytes_peak = self.bank_bytes_created = self.banks_created = 0
        self._observers = {}

    def bank_ledger(self):
        """Host field banks this operator created: live, peak and total bytes; zero for disk banks."""
        return dict(storage='disk' if self.state_factory is not None else 'host', live_bytes=self.bank_bytes_live,
                    peak_bytes=self.bank_bytes_peak, created_bytes=self.bank_bytes_created, banks_created=self.banks_created)

    def workspace_report(self):
        def sizes(pool):
            result = {}
            for workspace in self.workspaces:
                for name, value in getattr(workspace, pool).items():
                    result[name] = result.get(name, 0) + value.numel()*value.element_size()
            return result
        return dict(local_replayed_steps=self.local_replayed_steps,
                    peak_local_checkpoints=self.peak_local_checkpoints,
                    allocations=sum(w.allocations for w in self.workspaces),
                    buffer_bytes=sum(w.allocated_bytes for w in self.workspaces),
                    pinned_bytes=sum(w.pinned_bytes for w in self.workspaces),
                    host_staging_bytes=sum(w.host_staging_bytes for w in self.workspaces),
                    host_allocations=sum(w.host_allocations for w in self.workspaces),
                    pinned_allocations=sum(w.pinned_allocations for w in self.workspaces),
                    buffers_by_name=sizes('buffers'),
                    pinned_by_name=sizes('pinned'),
                    host_staging_by_name=sizes('host_staging'),
                    binding_hits=sum(w.binding_hits for w in self.workspaces),
                    binding_misses=sum(w.binding_misses for w in self.workspaces),
                    h2d_bytes=sum(w.h2d_bytes for w in self.workspaces),
                    d2h_bytes=sum(w.d2h_bytes for w in self.workspaces),
                    transfer_scope='Logical workspace payload bytes, not measured PCIe transactions.')

    def _pipeline(self, depth, prepare, commit):
        pending = []
        count = len(self.workspaces) or 1
        completed = False
        try:
            for index, descriptor in enumerate(self.tiles(depth)):
                if len(pending) == count:
                    transfer, metadata = pending.pop(0)
                    commit(transfer.wait(), metadata)
                self.workspace = self.workspaces[index % count] if self.workspaces else None
                if self.workspace is not None:self.workspace.drain()
                transfer, metadata = prepare(descriptor)
                pending.append((transfer, metadata))
            for transfer, metadata in pending:commit(transfer.wait(), metadata)
            completed = True
        finally:
            # Also drain in-flight copies when preparation or reduction fails.
            # An exception before output staging may leave compute with no D2H
            # completion event. Finish it before a caller retries this workspace.
            if not completed and self.device.type == 'cuda':torch.cuda.current_stream(self.device).synchronize()
            for workspace in self.workspaces:workspace.drain()

    def _return(self, tensors):
        if self.workspace is not None:return self.workspace.to_host(tensors)
        from .tile_workspace import HostTransfer
        return HostTransfer(_host_copies(tensors))

    def new_state(self):
        templates = self.host.state()
        if self.state_factory is not None:return self.state_factory(templates)
        bank = tuple(torch.zeros_like(s) for s in templates)
        # The ledger counts a host bank until its E tensor is collected; the
        # callback holds no reference to the operator, so a retained bank
        # cannot keep tile workspaces alive.
        size = sum(s.numel()*s.element_size() for s in bank)
        self.banks_created += 1
        self.bank_bytes_created += size
        self.bank_bytes_live += size
        self.bank_bytes_peak = max(self.bank_bytes_peak, self.bank_bytes_live)
        owner = weakref.ref(self)
        def released(owner=owner, size=size):
            operator = owner()
            if operator is not None:operator.bank_bytes_live -= size
        weakref.finalize(bank[0], released)
        return bank

    def tiles(self, depth):
        n = self.host.region.shape[0]
        for lo in range(0, n, self.width):
            hi = min(lo + self.width, n)
            begin, end = lo - depth, hi + depth
            if 0 not in self.host.grid.wrap:
                begin, end = max(0, begin), min(n, end)
            coordinates = torch.arange(begin, end, dtype=torch.int64)
            yield lo, hi, coordinates.remainder(n), slice(lo-begin, hi-begin)

    def _halo_phase(self, descriptor):
        """Bloch extension on the unwrapped slab, including repeated windings."""
        if 0 not in self.host.grid.wrap or not self.host.grid.E.is_complex():return None
        lo, _, indices, core = descriptor
        begin, end = lo-core.start, lo-core.start+len(indices)
        # Interior slabs have no Bloch image. Avoid multiplying every E/H and
        # CPML element by one and allocating a second host tile for that no-op.
        if begin >= 0 and end <= self.host.region.shape[0]:return None
        coordinates = torch.arange(begin, end)
        winding = torch.div(coordinates, self.host.region.shape[0], rounding_mode='floor')
        return torch.as_tensor(self.host.grid.wrap[0], dtype=self.host.field_dtype).pow(winding)

    @staticmethod
    def _phase_value(value, phase):
        return value if phase is None else value*phase.reshape((-1,)+(1,)*(value.ndim-1))

    def _new_local(self):
        return object.__new__(_System)

    def _material_epsilon(self, material):
        return material

    def _extra_payload(self, local, material, state, rows, phase, mapping, descriptor):
        return ()

    def _restore_payload(self, local, views):
        pass

    def _prepare_kernel(self, local):
        if self.device.type == 'cuda':
            from .cuda_kernels import FusedYeeCUDA
            from .cuda_complex import FusedComplexYeeCUDA
            kernel_type = FusedComplexYeeCUDA if local.grid.E.is_complex() else FusedYeeCUDA
            local.kernel = kernel_type(local.grid, direct_views=self.direct_views, bindings_cache=self.workspace)

    def _prepare_permittivity(self, local):
        # Volume inverse permittivity plus one bank per stored upper PMC E face/edge.
        local.configure_material(self.workspace)

    def _local_material(self, local):
        return local.epsilon

    def _backward(self, local, gradient, samples):
        # The fused CUDA transposes do not implement stored PMC faces; those
        # tiles use the explicit Torch transpose on the device instead.
        if self.device.type != 'cuda' or local.pmc:return None
        from .cuda_adjoint import FusedAdjointCUDA
        from .cuda_complex_adjoint import FusedComplexAdjointCUDA
        backward_type = FusedComplexAdjointCUDA if local.grid.E.is_complex() else FusedAdjointCUDA
        return backward_type(local, gradient, samples, direct_views=self.direct_views, buffers=self.workspace)

    def _adjoint_state(self, backward):
        return (backward.e_bar, backward.h_bar, *backward.psi_bars[backward.phase])

    def _accumulate_gradient(self, gradient, contribution, indices):
        gradient.index_add_(0, indices, contribution)

    def _tile(self, epsilon, state, descriptor, start, depth):
        host = self.host
        material = epsilon
        epsilon = self._material_epsilon(material)
        lo, hi, indices, core = descriptor
        local = self._new_local()
        local.device, local.dtype = self.device, epsilon.dtype
        local.field_dtype = host.field_dtype
        phase = self._halo_phase(descriptor)
        begin, end = lo-core.start, lo-core.start+len(indices)
        n_x = host.region.shape[0]
        contiguous = begin >= 0 and end <= n_x
        first, last = int(indices[0]) == 0, int(indices[-1]) == n_x-1
        # A tile reaching the last row carries the stored x-upper PMC row as
        # halo input: its faces, edges, epsilon row and the transverse CPML
        # rows on that plane. Only the tile whose core ends there commits it.
        extra = last and 0 in host.grid.pmc_upper
        owns_extra = extra and hi == n_x
        rows_take = torch.cat((indices, torch.tensor([n_x], dtype=torch.int64))) if extra else indices
        def rows(value):
            # The final packet owns a copy. Until then, a primary-domain slice
            # can remain a read-only view instead of a redundant gather buffer.
            if value.shape[0] == n_x+1 and extra:
                return value[begin:end+1] if contiguous else value.index_select(0, rows_take)
            return value[begin:end] if contiguous else value.index_select(0, indices)
        local.pmc = host.pmc
        local.epsilon = rows(epsilon)
        local.region = SimpleNamespace(shape=(len(indices), *host.region.shape[1:]))
        local.shape, local.decomposition = local.region.shape, None
        local.current_step = 0
        grid = local.grid = _Grid()
        grid.E, grid.H = [self._phase_value(rows(s), phase) for s in state[:2]]
        grid.inverse_permeability = torch.ones(1, dtype=epsilon.dtype)
        grid.courant_number = host.grid.courant_number
        grid.time_step = host.grid.time_step
        grid.is_torch = True
        grid.material_states = []
        grid.wrap = {axis: value for axis, value in host.grid.wrap.items() if axis != 0}
        grid.pec_upper = {axis: value for axis, value in host.grid.pec_upper.items() if axis != 0 or last}
        grid.pmc_lower = {axis: value for axis, value in host.grid.pmc_lower.items() if axis != 0 or first}
        grid.pmc_upper = {axis: value for axis, value in host.grid.pmc_upper.items() if axis != 0 or last}
        grid.pmc_blocks = {}
        for family, blocks in host.grid.pmc_blocks.items():
            kept = []
            for comp, upper, shape in blocks:
                if 0 in upper and not last:continue
                kept.append((comp, upper, (1 if 0 in upper else len(indices), *shape[1:])))
            grid.pmc_blocks[family] = tuple(kept)
        local.face_slices = [tuple(slice(n, n+1) if a in upper else slice(0, n) for a, n in enumerate(local.region.shape))
                             for _, upper, _ in grid.pmc_blocks['E']]
        volume = local._volume(local.epsilon)
        local.eps4 = volume[..., None] if epsilon.ndim == 3 else volume
        grid.metric = {}
        for (forward, axis), (values, edge) in host.grid.metric.items():
            if axis == 0:
                # A periodic seam becomes an ordinary internal derivative.
                all_values = torch.cat((values.flatten(), values.new_tensor([edge])))
                values = all_values[indices[:-1]].reshape(-1, 1, 1)
            grid.metric[forward, axis] = (values.contiguous(), edge)
        grid.cpml = {}
        local.segments, local.keys = [], {}
        mapping = []
        for key, global_ids in host.keys.items():
            forward, axis, _ = key
            local.keys[key] = []
            grid.cpml[key] = []
            for global_id in global_ids:
                segment = host.segments[global_id]
                if axis == 0:
                    a, b = segment['slice'][0].start, segment['slice'][0].stop
                    selected = torch.nonzero((indices[:-1] >= a) & (indices[:-1] < b)).flatten()
                    if selected.numel() == 0:continue
                    # X CPML cannot coexist with periodic X in the admitted contract.
                    if selected.numel() > 1 and not bool((selected[1:]-selected[:-1] == 1).all()):
                        raise ValueError('Noncontiguous X CPML segment.')
                    row_lo, row_hi = int(selected[0]), int(selected[-1])+1
                    take = indices[selected] - a
                    target = indices[selected] + (0 if forward else 1)
                    owned = torch.nonzero((target >= lo) & (target < hi)).flatten()
                    destination = take[owned]
                    sl = (slice(row_lo, row_hi), slice(None), slice(None))
                    coefficients = {name: segment[name].index_select(0, take)
                                    for name in ('b', 'c', 'inv_k')}
                else:
                    # Transverse CPML rows on the x-upper PMC plane travel with
                    # the last tile, like the stored face arrays themselves.
                    extended = state[global_id+2].shape[0] == n_x+1 and extra
                    take = rows_take if extended else indices
                    owned = torch.arange(core.start, core.stop)
                    if extended and owns_extra:owned = torch.cat((owned, torch.tensor([len(indices)], dtype=torch.int64)))
                    destination = take[owned]
                    sl = segment['slice']
                    coefficients = {name: segment[name] for name in ('b', 'c', 'inv_k')}
                item = dict(slice=sl, psi=rows(state[global_id+2]) if axis != 0 else state[global_id+2].index_select(0, take),
                            **coefficients)
                if axis != 0:item['psi'] = self._phase_value(item['psi'], phase)
                local.keys[key].append(len(local.segments))
                local.segments.append(item)
                grid.cpml[key].append(item)
                mapping.append((global_id+2, take, owned, destination))
        grid.faces = {'E': [], 'H': []}
        offset = 2+len(host.segments)
        for family in ('E', 'H'):
            for position, (comp, upper, shape) in enumerate(host.grid.pmc_blocks[family]):
                global_id = offset+(position if family == 'E' else len(host.grid.pmc_blocks['E'])+position)
                if 0 in upper:
                    if not last:continue
                    take = torch.zeros(1, dtype=torch.int64)
                    owned = destination = take if owns_extra else take[:0]
                    value = state[global_id].index_select(0, take)
                else:
                    take = indices
                    owned = torch.arange(core.start, core.stop)
                    destination = indices[owned]
                    value = rows(state[global_id])
                grid.faces[family].append(value)
                mapping.append((global_id, take, owned, destination))
        local.sources = {'E': [], 'H': []}
        local.face_sources = {'E': [], 'H': []}
        for family, terms in host.face_sources.items():
            for block, loc, _, wave in terms:
                comp, upper, _ = host.grid.pmc_blocks[family][block]
                if 0 in upper:
                    if not last:continue
                    position = len(indices)
                else:
                    found = torch.nonzero(indices == loc[0]).flatten()
                    if not found.numel():continue
                    position = int(found[0])
                local_block, index = face_index(grid.pmc_blocks, local.region.shape, family, comp, (position, *loc[1:]))
                local.face_sources[family].append((local_block, (position, *loc[1:]), index, wave[start:start+depth]))
        for family, terms in host.sources.items():
            for loc, component, wave, profile in terms:
                if isinstance(loc[0], int):
                    positions = torch.nonzero(indices == loc[0]).flatten()
                else:
                    a, b, stride = loc[0].indices(host.region.shape[0])
                    positions = torch.nonzero((indices >= a) & (indices < b) & ((indices-a) % stride == 0)).flatten()
                if not positions.numel():continue
                wave = wave[start:start+depth]
                groups = []
                for position in positions.tolist():
                    if groups and isinstance(loc[0], slice) and position == groups[-1][-1]+1 and indices[position] == indices[position-1]+1:
                        groups[-1].append(position)
                    else:groups.append([position])
                for group in groups:
                    position = group[0]
                    value = profile
                    if value is not None and isinstance(loc[0], slice):
                        offset = (int(indices[position])-a)//stride
                        value = value[offset:offset+len(group)]
                    selection = position if isinstance(loc[0], int) else slice(position, group[-1]+1)
                    image_wave = wave if phase is None else wave*phase[position]
                    local.sources[family].append(((selection, *loc[1:]), component, image_wave, value))
        # A tile's observers depend only on its row range, so they are selected
        # and prepared once per operator: a large plane holds millions of point
        # observations and every tile visit used to scan all of them.
        observer_key = (lo, hi, core.start, owns_extra)
        observers = self._observers.get(observer_key)
        if observers is None:
            local.monitors, observer_ids = [], []
            for m, (name, loc, component) in enumerate(host.monitors):
                if lo <= loc[0] < hi or (loc[0] == n_x and owns_extra):
                    local.monitors.append((name, (loc[0]-lo+core.start, *loc[1:]), component))
                    observer_ids.append(m)
        else:
            local.monitors, observer_ids = observers[:2]
        payload = self._extra_payload(local, material, state, rows, phase, mapping, descriptor)
        # Pack small CPML/metric/source arrays with the fields to avoid one
        # blocking PCIe transaction for every individual boundary coefficient.
        tensors = [local.epsilon, grid.E, grid.H, grid.inverse_permeability]
        for values, _ in grid.metric.values():tensors.append(values)
        for segment in local.segments:
            tensors.extend(segment[name] for name in ('psi', 'b', 'c', 'inv_k'))
        for terms in local.sources.values():
            for _, _, wave, profile in terms:
                tensors.append(wave)
                if profile is not None:tensors.append(profile)
        for family in ('E', 'H'):
            tensors.extend(grid.faces[family])
            tensors.extend(wave for _, _, _, wave in local.face_sources[family])
        tensors.extend(payload)
        if self.workspace is not None:
            packed,layout = self.workspace.copy_packet('payload', tensors)
        else:
            packed,layout = pack_tensors(tensors)
            packed = packed.to(self.device)
        views = iter(layout.unpack(packed))
        local.epsilon, grid.E, grid.H, grid.inverse_permeability = [next(views) for _ in range(4)]
        volume = local._volume(local.epsilon)
        local.eps4 = volume[..., None] if epsilon.ndim == 3 else volume
        self._prepare_permittivity(local)
        grid.metric = {key:(next(views), edge) for key, (_, edge) in grid.metric.items()}
        for segment in local.segments:
            for name in ('psi', 'b', 'c', 'inv_k'):segment[name] = next(views)
        for family, terms in local.sources.items():
            local.sources[family] = [(loc, component, next(views), next(views) if profile is not None else None)
                                     for loc, component, _, profile in terms]
        for family in ('E', 'H'):
            grid.faces[family] = [next(views) for _ in grid.faces[family]]
            local.face_sources[family] = [(block, loc, index, next(views)) for block, loc, index, _ in local.face_sources[family]]
        self._restore_payload(local, views)
        local.kernel = None
        local.gradient_rows = rows_take
        if observers is None:
            local.prepare_observations()
            self._observers[observer_key] = (local.monitors, observer_ids, local.observation_maps, local.face_observation_maps)
        else:
            local.observation_maps, local.face_observation_maps = observers[2:]
        self._prepare_kernel(local)
        return local, mapping, observer_ids

    def _validate(self, epsilon, state, start, depth):
        epsilon = self._material_epsilon(epsilon)
        if isinstance(depth, bool) or not isinstance(depth, int) or depth < 1:
            raise ValueError('Temporal depth must be a positive integer.')
        if start < 0 or start + depth > self.host.region.steps:
            raise ValueError('Block exceeds the prepared source history.')
        expected = self.host.state()
        if len(state) != len(expected):raise ValueError('Incomplete restart state.')
        for value, template in zip(state, expected):
            if value.device.type != 'cpu' or value.shape != template.shape or value.dtype != template.dtype:
                raise ValueError('Restart state must match the host shapes and dtype.')
        if epsilon.device.type != 'cpu' or epsilon.shape != self.host.epsilon.shape or epsilon.dtype != self.host.dtype:
            raise ValueError('Epsilon must match the host shape and dtype.')

    @torch.no_grad()
    def forward(self, epsilon, state, start, depth):
        self._validate(epsilon, state, start, depth)
        output = self.new_state()
        signals = torch.zeros((depth, len(self.host.monitors)), dtype=self.host.field_dtype)
        def prepare(descriptor):
            lo, hi, _, core = descriptor
            local, mapping, observers = self._tile(epsilon, state, descriptor, start, depth)
            observations = torch.empty((depth, len(observers)), device=self.device, dtype=self.host.field_dtype)
            for j in range(depth):
                local.advance(j, j+1)
                if observers:observations[j] = local.observe(local.state())
            owned_values = [value[core] for value in local.state()[:2]]
            for value, (_, _, owned, _) in zip(local.state()[2:], mapping):
                owned_slice = slice(int(owned[0]), int(owned[-1])+1) if owned.numel() else slice(0,0)
                owned_values.append(value[owned_slice])
            return self._return((*owned_values, observations)), (lo, hi, mapping, observers)

        def commit(returned, metadata):
            lo, hi, mapping, observers = metadata
            if observers:signals[:, observers] = returned[-1]
            for target, value in zip(output[:2], returned[:2]):
                if isinstance(target,torch.Tensor):target[lo:hi].copy_(value)
                else:target.index_copy_(0,torch.arange(lo,hi,dtype=torch.int64,device='cpu'),value)
            for value, (global_id, _, _, destination) in zip(returned[2:-1], mapping):
                output[global_id].index_copy_(0, destination, value)
        self._pipeline(depth, prepare, commit)
        return output, signals

    @torch.no_grad()
    def transpose(self, epsilon, state, start, depth, endpoint_bar, signal_bar):
        self._validate(epsilon, state, start, depth)
        self._validate(epsilon, endpoint_bar, start, depth)
        if signal_bar.shape != (depth, len(self.host.monitors)) or signal_bar.device.type != 'cpu' or signal_bar.dtype != self.host.field_dtype:
            raise ValueError('Signal adjoint must have the host block observation shape.')
        initial_bar = self.new_state()
        gradient = torch.zeros_like(epsilon)
        def prepare(descriptor):
            lo, hi, indices, core = descriptor
            local, mapping, observers = self._tile(epsilon, state, descriptor, start, depth)
            restart = tuple(self.workspace.copy(f'restart:{i}', s) if self.workspace is not None else s.clone()
                            for i,s in enumerate(local.state()))
            adjoint = None
            samples = self.workspace.copy('signal', signal_bar[:, observers]) if self.workspace is not None else signal_bar[:, observers].to(self.device).contiguous()
            material = self._local_material(local)
            local_gradient = self.workspace.zeros('gradient', material) if self.workspace is not None else torch.zeros_like(material)
            backward = self._backward(local, local_gradient, samples)
            if backward is not None:
                # The CUDA adjoint allocator zeros the complete tile. Transfer
                # only owned endpoint values, rather than sending zero halos.
                owned_values = [value[lo:hi] for value in endpoint_bar[:2]]
                owned_values.extend(endpoint_bar[global_id].index_select(0, destination)
                                    for global_id, _, _, destination in mapping)
                if self.workspace is not None:
                    seed, layout = self.workspace.copy_packet('adjoint_seed_owned', owned_values)
                else:
                    seed, layout = pack_tensors(owned_values)
                    seed = seed.to(self.device)
                values = layout.unpack(seed)
                seed_state = self._adjoint_state(backward)
                seed_state[0][core].copy_(values[0]);seed_state[1][core].copy_(values[1])
                for target, value, (_, _, owned, _) in zip(seed_state[2:], values[2:], mapping):
                    if owned.numel():target[int(owned[0]):int(owned[-1])+1].copy_(value)
            else:
                adjoint = tuple(torch.zeros_like(s) for s in local.state())
                for target, value in zip(adjoint[:2], endpoint_bar[:2]):target[core].copy_(value[lo:hi])
                for target, (global_id, _, owned, destination) in zip(adjoint[2:], mapping):
                    # Torch transposes may run on CUDA tiles; the index maps live on the host.
                    target.index_copy_(0, owned.to(target.device), endpoint_bar[global_id].index_select(0, destination).to(target.device))
            def restore(saved, begin, end):
                for target, value in zip(local.state(), saved):target.copy_(value)
                local.advance(begin, end)
                self.local_replayed_steps += end-begin

            def step(j):
                nonlocal adjoint
                if backward is not None:backward.step(j)
                else:
                    adjoint, contribution = local.transpose_step(local.state(), adjoint, samples[j])
                    local_gradient.add_(contribution)

            def reverse(begin, end, saved, slots, level):
                while end > begin:
                    if end-begin == 1 or slots == 0:
                        for j in reversed(range(begin,end)):
                            restore(saved,begin,j)
                            step(j)
                        return
                    middle = begin+_split(end-begin,slots)
                    restore(saved,begin,middle)
                    checkpoint = tuple(self.workspace.copy(f'local_checkpoint:{level}:{i}',s)
                                       if self.workspace is not None else s.clone()
                                       for i,s in enumerate(local.state()))
                    self.peak_local_checkpoints = max(self.peak_local_checkpoints,level+1)
                    reverse(middle,end,checkpoint,slots-1,level+1)
                    del checkpoint
                    end = middle

            try:reverse(0,depth,restart,self.local_checkpoints,0)
            finally:reverse=None  # Do not retain a tile through its recursive closure.
            if backward is not None:
                if hasattr(backward, 'finalize'):backward.finalize({})
                adjoint = self._adjoint_state(backward)
            return self._return((*adjoint, local_gradient)), (indices, mapping, self._halo_phase(descriptor), local.gradient_rows)

        def commit(returned, metadata):
            indices, mapping, phase, gradient_rows = metadata
            conjugate = None if phase is None else phase.conj()
            for target, value in zip(initial_bar[:2], returned[:2]):
                target.index_add_(0, indices, self._phase_value(value, conjugate))
            for value, (global_id, take, _, _) in zip(returned[2:-1], mapping):
                # Periodic X excludes X CPML, so every remaining psi slab
                # shares the field's X winding and Hermitian extension.
                initial_bar[global_id].index_add_(0, take, self._phase_value(value, conjugate))
            self._accumulate_gradient(gradient, returned[-1], gradient_rows)
        self._pipeline(depth, prepare, commit)
        return initial_bar, gradient
