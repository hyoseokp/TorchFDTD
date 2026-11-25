"""Yee derivatives with true unit-cell wrapping and stretched-coordinate CPML.

Periodic axes contain N independent cells, with period N*dx, not two copied
end planes. Bloch fields obey F(r+L) = exp(+i*phase) F(r). CPML applies
D/kappa + psi and psi <- b*psi + c*D to each transverse derivative.
"""
from __future__ import annotations

import cmath
from itertools import combinations
import math

import fdtd
import numpy as np
import torch

from .models import BoundaryFace


# (derivative axis, input component, output component, curl sign)
CURL_TERMS = ((0, 2, 1, -1), (0, 1, 2, 1),
              (1, 2, 0, 1), (1, 0, 2, -1),
              (2, 1, 0, -1), (2, 0, 1, 1))


def _slice(axis, value, component=None):
    parts = [slice(None)] * 3
    parts[axis] = value
    if component is not None:
        parts.append(component)
    return tuple(parts)


def is_nodal(family, component, axis):
    """E_c has integer nodes on its two transverse axes, H_c on its own axis."""
    return component != axis if family == 'E' else component == axis


def reject_pmc_faces(region, path):
    """Explicit refusal for numerical paths without the stored-face topology."""
    if any(f.kind in ('pmc', 'symmetric') for a in range(3) for f in region.boundaries.pair(a)):
        raise ValueError(f'PMC/symmetric faces are not implemented by {path}. '
                         'Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch.')


def reject_pml_dispersion(project, path, explicit=False):
    """Explicit refusal for paths that run the plain CPML and ADE on every PML face.

    Only a mode that changes the run is refused: 'absorber' with absorber faces,
    'frozen' with a sample of an enabled dispersive structure in a PML layer. Paths whose
    oscillators come from parameter tensors (explicit) refuse every mode but 'ade':
    the structures do not say where the poles are.
    """
    mode = project.region.pml_dispersion
    if mode == 'ade':
        return
    if explicit:
        raise ValueError(f'pml_dispersion="{mode}" is implemented by the resident Yee Simulation and run_tensor_batch only, '
                         f'not by {path}, whose oscillators are parameter tensors; use pml_dispersion="ade".')
    from .stability_checks import dispersive_structures_in_pml
    if absorber_faces(project) if mode == 'absorber' else dispersive_structures_in_pml(project):
        raise ValueError(f'pml_dispersion="{mode}" is implemented by the resident Yee Simulation and run_tensor_batch only, '
                         f'not by {path}; this project has dispersive structures in its PML layers.')


def absorber_faces(project):
    """(axis, side) of the PML faces that become the adiabatic absorber.

    With region.pml_dispersion == 'absorber' these are the faces whose layer rows
    hold a material sample of an enabled dispersive structure, by its bounding box
    (the rows 'frozen' freezes, and the test of the validation warning); every other
    PML face keeps the CPML, so no pole sample lies in a stretched row. A soft sheet extended through the PML across an absorber face
    is refused: the absorber damps its wave inside the layer (docs/BOUNDARIES.md).
    Every other source lies in the interior, where the absorber has no loss.
    """
    if project.region.pml_dispersion != 'absorber':
        return ()
    from .stability_checks import dispersive_structures_in_pml
    r = project.region
    names = {face for _, faces in dispersive_structures_in_pml(project) for face in faces}
    faces = tuple(sorted(('xyz'.index(name[0]), int(name.endswith('max'))) for name in names))
    tolerance = 1e-6*r.reference_step
    for source in project.sources:
        if not source.enabled or not source.extend_through_pml:
            continue
        for axis, side in faces:
            if 'xyz'[axis] == source.normal:
                continue
            low, high = r.interior_bounds(axis)
            edge = source.center[axis]+(source.size[axis]/2 if side else -source.size[axis]/2)
            if (edge > high+tolerance) if side else (edge < low-tolerance):
                raise ValueError(f'{source.name}: a soft sheet with extend_through_pml crosses the absorber face '
                                 f'{"xyz"[axis]}_{"max" if side else "min"}; the absorber damps the sheet inside the layer '
                                 '(a 27 to 37 percent power error in the interior, docs/BOUNDARIES.md). End the sheet at the '
                                 'interior or use pml_dispersion="ade".')
    return faces


def absorber_profiles(region, courant, faces):
    """Half-step loss s = sigma*courant/2 of the adiabatic absorber, per active axis at its (integer, half) Yee nodes.

    Each absorber face is a graded conductivity of its PML depth: sigma =
    sigma_scale*40/(L+1)*rho**polynomial in units of c/reference_step, rho the
    physical depth into the layer over its thickness. Corner cells add the losses
    of their faces.
    """
    profiles = {}
    for axis, nodes in enumerate(region.mesh_nodes):
        n = region.shape[axis]
        if n == 1:
            continue
        nodes = np.asarray(nodes, dtype=np.float64)
        points = (nodes[:-1], (nodes[:-1]+nodes[1:])/2)
        loss = [np.zeros(n), np.zeros(n)]
        for side, face in enumerate(region.boundaries.pair(axis)):
            layers = region.pml_layers(axis, side)
            if not layers or (axis, side) not in faces:
                continue
            inner, outer = (nodes[layers], nodes[0]) if side == 0 else (nodes[n-layers], nodes[n])
            for k, point in enumerate(points):
                rho = np.clip((point-inner)/(outer-inner), 0, 1)
                loss[k] += face.sigma_scale*40/(layers+1)*rho**face.polynomial*courant/2
        profiles[axis] = tuple(loss)
    return profiles


def absorber_loss(profiles, shape, family, indices=None, components=True, box=None):
    """Absorber loss per (x, y, z, component) sample, the sum over axes in axis order.

    Without indices the shape+(3,) array, or the box (a slice per axis) of it; with
    flat indices into the field (components) or its cells (not components, three
    columns) only those samples.
    """
    if indices is None:
        box = box or tuple(slice(0, n) for n in shape)
        loss = np.zeros(tuple(len(range(n)[b]) for n, b in zip(shape, box))+(3,))
        for c in range(3):
            for axis, pair in profiles.items():
                view = [1, 1, 1]
                view[axis] = loss.shape[axis]
                loss[..., c] += pair[0 if is_nodal(family, c, axis) else 1][box[axis]].reshape(view)
        return loss
    indices = np.asarray(indices, dtype=np.int64)
    cells, comp = np.divmod(indices, 3) if components else (indices, None)
    coords = np.unravel_index(cells, tuple(shape))
    loss = np.zeros(len(indices)) if components else np.zeros((len(indices), 3))
    for axis, pair in profiles.items():
        for c in range(3):
            value = pair[0 if is_nodal(family, c, axis) else 1][coords[axis]]
            if components:
                loss[comp == c] += value[comp == c]
            else:
                loss[:, c] += value
    return loss


def absorber_slabs(region, faces):
    """Disjoint boxes (a slice per axis) covering the layers of the absorber faces: an earlier axis keeps its corners."""
    boxes, bounds = [], [slice(0, n) for n in region.shape]
    for axis in range(3):
        n = region.shape[axis]
        sides = [side for a, side in faces if a == axis]
        for side in sides:
            layers = region.pml_layers(axis, side)
            box = list(bounds)
            box[axis] = slice(0, layers) if side == 0 else slice(n-layers, n)
            boxes.append(tuple(box))
        if sides:
            bounds[axis] = slice(region.pml_layers(axis, 0) if 0 in sides else 0, n-region.pml_layers(axis, 1) if 1 in sides else n)
    return boxes


def pmc_faces(region):
    """Active axes with a PMC/symmetric wall at the lower and upper mesh endpoints."""
    active = 2 if region.dimension == '2d' else 3
    def walls(side):
        return tuple(a for a in range(active) if region.shape[a] > 1
                     and region.boundaries.pair(a)[side].kind in ('pmc', 'symmetric'))
    return walls(0), walls(1)


def pmc_blocks(shape, upper):
    """Disjoint stored upper PMC faces and E edges, in the packed endpoint order.

    Each entry is (component, upper axes, block shape). A block has one entry on
    each of its upper axes and the full cell count elsewhere, so faces exclude
    the separately stored edges. Upper PEC nodes stay omitted zeros.
    """
    blocks = {}
    for family in ('E', 'H'):
        entries = []
        for comp in range(3):
            axes = [a for a in upper if is_nodal(family, comp, a)]
            for length in range(1, len(axes)+1):
                for selected in combinations(axes, length):
                    entries.append((comp, selected, tuple(1 if a in selected else n for a, n in enumerate(shape))))
        blocks[family] = tuple(entries)
    return blocks


def extended_shape(shape, upper, family=None, component=None):
    """Cell counts plus one stored node on every upper PMC axis of a component."""
    return tuple(n+(1 if a in upper and (family is None or is_nodal(family, component, a)) else 0)
                 for a, n in enumerate(shape))


def material_shape(region, diagonal=False):
    """Sampled epsilon shape: the grid plus every stored upper PMC node row."""
    shape = extended_shape(region.shape, pmc_faces(region)[1])
    return shape+((3,) if diagonal else ())


def face_index(blocks, shape, family, component, loc):
    """Resolve an extended Yee index to (stored block position or None, flat index)."""
    upper = tuple(a for a in range(3) if loc[a] == shape[a])
    if not upper:
        return None, ((loc[0]*shape[1]+loc[1])*shape[2]+loc[2])*3+component
    for position, (comp, selected, block_shape) in enumerate(blocks[family]):
        if comp == component and selected == upper:
            local = tuple(0 if a in upper else i for a, i in enumerate(loc))
            return position, int(np.ravel_multi_index(local, block_shape))
    raise ValueError('The requested Yee sample is not a stored PMC/symmetric upper face or edge.')


class YeeGrid(fdtd.Grid):
    """Extend the open-source fdtd grid with complex fields and native CPML.

    PMC/symmetric faces allocate the stored upper face/edge arrays. Only the
    fused CUDA kernel updates them; the Torch/NumPy curl below rejects them.
    """
    def __init__(self, region, absorber_faces=()):
        region.require_resident()
        # The upstream constructor runs on the smallest grid of this dimension: it would allocate a full-size unit
        # permeability and one full-size temporary per material array. Every material here is non-magnetic.
        super().__init__(shape=(2, 2, 1 if region.dimension == '2d' else 2), grid_spacing=region.reference_step * 1e-6,
                         courant_number=region.courant_factor/math.sqrt(2 if region.dimension == '2d' else 3))
        self.Nx, self.Ny, self.Nz = region.shape
        self.E, self.H = fdtd.backend.zeros((*region.shape, 3)), fdtd.backend.zeros((*region.shape, 3))
        self.inverse_permittivity = fdtd.backend.ones((*region.shape, 3))
        self.inverse_permeability = fdtd.backend.ones((1,))
        # fdtd validates a cubic-grid Courant number in its constructor. The
        # native metric curls below use the independently validated rectangular CFL.
        self.courant_number=region.rectangular_courant
        self.time_step=region.time_step
        self.region = region
        self.is_torch = isinstance(self.E, torch.Tensor)
        if region.complex_fields:
            if self.is_torch:
                kind = torch.complex128 if region.precision == 'float64' else torch.complex64
                self.E, self.H = self.E.to(kind), self.H.to(kind)
            else:
                kind = np.complex128 if region.precision == 'float64' else np.complex64
                self.E, self.H = self.E.astype(kind), self.H.astype(kind)
        self._prepare_boundaries(region, absorber_faces)
        self.faces = {family: [self._zeros(shape) for _, _, shape in blocks] for family, blocks in self.pmc_blocks.items()}
        self.face_inverse_permittivity = [self._zeros(shape)+1 for _, _, shape in self.pmc_blocks['E']]

    def _prepare_boundaries(self,region,absorber_faces=()):
        self.wrap = {}
        # PEC planes are exactly mesh endpoints. Upper tangential E is a
        # zero ghost node. Lower tangential E / normal H are zero states.
        self.pec_upper = {
            axis: float(region.reference_step / (nodes[-1]-nodes[-2]))
            for axis, nodes in enumerate(region.mesh_nodes)
            if region.shape[axis] > 1 and region.boundaries.pair(axis)[1].kind in ('pec', 'antisymmetric')
        }
        # PMC planes are also exact mesh endpoints. The mirrored outer half
        # cell equals the wall cell, so the wall derivative is +-2 H / dx_wall.
        # Upper walls keep their tangential E and normal H in stored blocks.
        lower, upper = pmc_faces(region)
        nodes = region.mesh_nodes
        self.pmc_lower = {axis: float(region.reference_step/(nodes[axis][1]-nodes[axis][0])) for axis in lower}
        self.pmc_upper = {axis: float(region.reference_step/(nodes[axis][-1]-nodes[axis][-2])) for axis in upper}
        self.pmc_blocks = pmc_blocks(region.shape, upper)
        self.metric = {}
        if region.mesh_type != 'uniform' or region.mesh_steps is not None:
            for axis, nodes in enumerate(region.mesh_nodes):
                if region.shape[axis] == 1: continue
                widths = np.diff(nodes)
                if np.allclose(widths,region.reference_step,rtol=1e-10,atol=0): continue
                shape = [1, 1, 1]; shape[axis] = len(widths)-1
                self.metric[True, axis] = (self._coefficient((region.reference_step/widths[:-1]).reshape(shape)), float(region.reference_step/widths[-1]))
                dual = (widths[1:]+widths[:-1])/2
                self.metric[False, axis] = (self._coefficient((region.reference_step/dual).reshape(shape)), float(2*region.reference_step/(widths[0]+widths[-1])))
        for axis, n in enumerate(region.shape):
            if n > 1 and region.boundaries.pair(axis)[0].kind in ('periodic', 'bloch'):
                self.wrap[axis] = cmath.exp(1j*region.bloch_phase[axis]) if region.complex_fields else 1.0
        self.cpml = {}
        self.memory_states = []
        self.material_states = []
        self.incident_states = []
        # The adiabatic absorber replaces the stretched coordinates on the faces of absorber_faces(project).
        absorber_faces = {(a, s) for a, s in absorber_faces if region.pml_layers(a, s)}
        self.absorber = None
        if absorber_faces:
            if region.pml_dispersion != 'absorber':
                raise ValueError('Absorber faces require pml_dispersion="absorber".')
            if lower or upper:
                raise ValueError('pml_dispersion="absorber" does not implement PMC/symmetric faces.')
            if region.interface_method == 'subpixel':
                raise ValueError('pml_dispersion="absorber" requires staircase interfaces.')
            if any(f.kappa != 1 or f.alpha > BoundaryFace().alpha for f in (region.boundaries.pair(a)[s] for a, s in absorber_faces)):
                raise ValueError('pml_dispersion="absorber" grades a conductivity from layers, sigma_scale and polynomial; '
                                 'the stretched-coordinate kappa and alpha of its faces must stay at 1 and at most the default alpha.')
            self.absorber = absorber_profiles(region, self.courant_number, absorber_faces)
            self.absorber_faces = tuple(sorted(absorber_faces))
        for forward in (False, True):
            for axis, component, output, _ in CURL_TERMS:
                n = region.shape[axis]
                if n == 1:
                    continue
                # Auxiliary rows follow the derivative target, including its
                # stored upper PMC nodes on the transverse axes.
                target_shape = extended_shape(region.shape, upper, 'H' if forward else 'E', output)
                segments = []
                for side, face in enumerate(region.boundaries.pair(axis)):
                    if face.kind != 'pml' or (axis, side) in absorber_faces:
                        continue
                    layers = region.pml_layers(axis, side)
                    base = 0 if side == 0 else n - layers
                    # E derivatives are backward and H derivatives forward.
                    active_start, active_stop = (0, n-1) if forward else (1, n)
                    lo, hi = max(base, active_start), min(base+layers, active_stop)
                    if lo >= hi:
                        continue
                    target = np.arange(lo, hi) - base
                    depth = layers - target - (1 if forward else .5) if side == 0 else target + (1 if forward else .5)
                    rho = depth / (layers + 1)
                    sigma = face.sigma_scale * 40 * rho**face.polynomial / (layers + 1)
                    if region.mesh_type=='explicit' or region.mesh_steps is not None:
                        nodes=region.mesh_nodes[axis];widths=np.diff(nodes)
                        location=nodes[lo+1:hi+1] if forward else (nodes[lo:hi]+nodes[lo+1:hi+1])/2
                        interface=nodes[layers] if side==0 else nodes[base]
                        length=(nodes[layers]-nodes[0]+widths[layers]) if side==0 else (nodes[-1]-nodes[base]+widths[base-1])
                        rho=((interface-location) if side==0 else (location-interface))/length
                        sigma=face.sigma_scale*40*region.reference_step/length*rho**face.polynomial
                    kappa = 1 + (face.kappa-1) * rho**face.polynomial
                    alpha = face.alpha * (1-rho)**face.alpha_polynomial
                    decay = np.exp(-(sigma/kappa + alpha) * self.courant_number)
                    denominator = sigma*kappa + alpha*kappa*kappa
                    coupling = np.divide((decay-1)*sigma, denominator, out=np.zeros_like(sigma), where=denominator != 0)
                    coeff_shape = [1, 1, 1]
                    coeff_shape[axis] = hi-lo
                    shape = list(target_shape)
                    shape[axis] = hi-lo
                    psi = self._zeros(tuple(shape))
                    self.memory_states.append(psi)
                    segments.append({'slice': _slice(axis, slice(lo-active_start, hi-active_start)),
                                     'shape':tuple(shape),
                                     'psi': psi, 'b': self._coefficient(decay.reshape(coeff_shape)),
                                     'c': self._coefficient(coupling.reshape(coeff_shape)),
                                     'inv_k': self._coefficient((1/kappa).reshape(coeff_shape)),
                                     # Host-side profile kept for the resolved plan (torchfdtd.plan).
                                     'side': side, 'kappa': kappa, 'sigma': sigma, 'alpha': alpha})
                self.cpml[forward, axis, component] = segments

    def _zeros(self, shape):
        return torch.zeros(shape, device=self.E.device, dtype=self.E.dtype) if self.is_torch else np.zeros(shape, dtype=self.E.dtype)

    def _coefficient(self, array):
        return torch.as_tensor(array, device=self.E.device, dtype=self.E.real.dtype) if self.is_torch else array.astype(self.E.real.dtype)

    def curl(self, field, forward):
        if self.pmc_lower or self.pmc_upper:
            raise ValueError('PMC/symmetric faces are not implemented by the Torch/NumPy grid curl. Use the fused CUDA kernel, DifferentiableSimulation, StreamedSimulation or the endpoint Simulation dispatch.')
        result = self._zeros(field.shape)
        for axis, component, output, sign in CURL_TERMS:
            if field.shape[axis] == 1:
                continue
            low = _slice(axis, slice(None, -1), component)
            high = _slice(axis, slice(1, None), component)
            derivative = field[high] - field[low]
            if (forward, axis) in self.metric:
                derivative *= self.metric[forward, axis][0]
            for segment in self.cpml[forward, axis, component]:
                data = derivative[segment['slice']]
                psi = segment['psi']
                psi *= segment['b']
                psi += segment['c'] * data
                data *= segment['inv_k']
                data += psi
            target = _slice(axis, slice(None, -1) if forward else slice(1, None), output)
            result[target] += sign * derivative
            if axis in self.wrap:
                phase = self.wrap[axis]
                first, last = _slice(axis, 0, component), _slice(axis, -1, component)
                edge = phase*field[first] - field[last] if forward else field[first] - field[last]/phase
                if (forward, axis) in self.metric:
                    edge *= self.metric[forward, axis][1]
                result[_slice(axis, -1 if forward else 0, output)] += sign*edge
            elif forward and axis in self.pec_upper:
                edge = -self.pec_upper[axis] * field[_slice(axis, -1, component)]
                result[_slice(axis, -1, output)] += sign * edge
        return result

    def absorber_update(self, family):
        """[(box, decay, gain)] of the trapezoidal absorber loss, F <- decay*F + gain*dF on the absorber slabs only."""
        cached = self.__dict__.setdefault('_absorber_update', {})
        if family not in cached:
            cached[family] = []
            for box in absorber_slabs(self.region, self.absorber_faces):
                loss = absorber_loss(self.absorber, self.region.shape, family, box=box)
                cached[family].append((box, self._coefficient((1-loss)/(1+loss)), self._coefficient(1/(1+loss))))
        return cached[family]

    def absorber_axes(self):
        """Per-axis (integer, half) node losses on the field device for the fused kernels."""
        cached = self.__dict__.get('_absorber_axes')
        if cached is None:
            cached = self._absorber_axes = {axis: tuple(self._coefficient(v) for v in pair) for axis, pair in self.absorber.items()}
        return cached

    def update_E(self):
        prepared = [state.prepare(self.E) for state in self.material_states]
        curl=self.curl(self.H,False)
        if self.absorber is None:
            self.E += self.courant_number * self.inverse_permittivity * curl
        else:
            # Slab values first, with the operation order of the lossless update outside them.
            slabs = [(box, self.E[box]*decay+self.courant_number*gain*self.inverse_permittivity[box]*curl[box])
                     for box, decay, gain in self.absorber_update('E')]
            self.E += self.courant_number * self.inverse_permittivity * curl
            for box, value in slabs:
                self.E[box] = value
        if getattr(self,'subpixel',None) is not None:self.subpixel.add(curl)
        for state, (old, response) in zip(self.material_states, prepared):
            state.correct(self.E, old, response)

    def update_H(self):
        if self.absorber is None:
            self.H -= self.courant_number * self.inverse_permeability * self.curl(self.E, True)
        else:
            curl = self.curl(self.E, True)
            slabs = [(box, self.H[box]*decay-self.courant_number*gain*self.inverse_permeability*curl[box])
                     for box, decay, gain in self.absorber_update('H')]
            self.H -= self.courant_number * self.inverse_permeability * curl
            for box, value in slabs:
                self.H[box] = value


class BoundaryDescription:
    """Boundary coefficients and state shapes without allocating volume fields."""
    def __init__(self,region,absorber_faces=()):
        self.courant_number=region.rectangular_courant
        YeeGrid._prepare_boundaries(self,region,absorber_faces)

    def _zeros(self,shape):return None

    def _coefficient(self,array):return np.asarray(array,dtype=np.float64)
