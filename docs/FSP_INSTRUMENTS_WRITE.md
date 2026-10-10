# FSP source and monitor list editing

The independent `write_fsp_scene` API supports adding, deleting, duplicating and
reordering mapped top-level sources and monitors. It preserves the original
file, rebuilds the scene list and verifies the candidate with the native reader.
The Python, CLI and browser paths use the same writer.

**External reader acceptance of new and split records remains unverified.**
Native waveform and field agreement tests do not establish general FSP
compatibility or agreement with a commercial solver.

| Record | Supported new objects | Limits |
|---|---|---|
| Electric dipole | 2D/3D, Cartesian or theta/phi orientation, phase and amplitude | Magnetic FSP type is unmapped |
| One-way plane / TFSF | 3D, normal incidence, both directions and all three axes | Plane covers the transverse periodic cell. TFSF requires the existing homogeneous-shell constraints |
| Point time monitor | One E/H component, full time trace, native FFT | No apodization, stride 1, no global inheritance |
| Point DFT monitor | One E/H component, mapped local/global frequency samples and windows | No point power or Poynting recording |
| Frequency plane | 2D line or 3D plane, mapped fields/Poynting/flux, strides, precision and windows | No volume, spectral-average or uncollocated monitor |

New sources use explicit standard pulses, frequency/wavelength ranges or local
sampled time/amplitude/phase arrays. Native cycle-based pulses, continuous waves,
soft sheet sources and Hann postprocessing have no mapping and are rejected.
Automatic ranged-source conventions retain a provenance caveat. Use explicit pulse settings when their
definition is the desired native input.

## Python and CLI

```python
from uuid import uuid4
from torchfdtd import Source, Monitor, SpectrumSettings, write_fsp_scene
from torchfdtd.fsp_binary import FspDocument
from torchfdtd.fsp_native import convert_fsp

original = FspDocument.load('input.fsp')
conversion = convert_fsp(original, backend='cuda')
if conversion.project is None:
    raise ValueError(conversion.issues)
p = conversion.project

p.sources.append(Source(
    name='Extra dipole', center=(0, 0, 0), component='Ez',
    time_definition='standard', pulse_length=20e-15, pulse_offset=50e-15,
))
p.monitors.append(Monitor(
    name='Extra trace', center=(0.2, 0, 0), component='Ez',
    spectrum=SpectrumSettings(apodization='none'),
))
duplicate = p.monitors[-1].model_copy(deep=True)
duplicate.id = uuid4().hex
duplicate.name = 'Second trace'
duplicate.center = (0.4, 0, 0)
p.monitors.append(duplicate)
p.monitors.reverse()

edited, report = write_fsp_scene(original, p)
edited.save('edited-instruments.fsp')
p.save('edited-native.json')
reimported = convert_fsp(edited, backend='cuda').project
assert reimported is not None
```

Coordinates must fit the imported simulation. The source waveform must be
adequately sampled by its time step. Change the example positions or region
as needed. List removal uses normal Python `del` or `remove` operations.

```sh
torchfdtd fsp-write-scene input.fsp edited-native.json --output edited.fsp --report edits.json
```

Reimport the edited file before saving it again. Record offsets, object IDs and
the source fingerprint can change. `report['id_mapping']` connects every native
input ID to its reimported ID. `source_list` and `monitor_list` report additions,
removals, order and monitor groups. `preserved_segments` identifies the exact
original and output ranges of retained bytes.

## Shared monitor outputs

One FSP point-monitor record can produce several native component traces.
Deleting an individual component changes that record's output switches. If
the remaining components have different positions, names, timing or output
order, the writer separates them into compatible records. Interleaving a new
monitor between those components also separates the original record.

Split records reuse the original record template. Unknown property encodings
are preserved as bytes, including values the generic serializer cannot create.
Their reference semantics are not interpreted or externally verified. Newly
added records use independently authored recognized property defaults. No
commercial executable is called by this writer.

## Workbench and numerical limits

After **FSP → GPU → Open converted scene**, use the normal source/monitor,
**Duplicate** and **Delete** controls. New imported-project dipoles default to
explicit standard pulses and new point monitors default to FFT without
apodization. **Export current scene** reports source and monitor list changes.
Download and reimport the edited file before another FSP editing transaction.

Effective apodization can be flattened from native global inheritance. DFT
temporal stride remains subject to an external reader's source Nyquist rule.
Enabled sampled sources require stride 1. A 2D frequency plane's inactive z
display span reimports as 1 micrometre and is reported as native-only metadata.
Native JSON retains execution, display and unmapped options.

Tests use authored layouts and check source waveforms, component ordering,
frequency sampling, repeated editing, original-byte preservation and native
CPU/CUDA/tensor-cohort fields. Browser coverage creates, duplicates, deletes,
exports, reimports and executes a scene. Unsupported class conversions,
groups, result-bearing files and general version compatibility remain open.
