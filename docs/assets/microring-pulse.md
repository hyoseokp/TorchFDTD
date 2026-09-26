# A pulse circulating in a microring

[![Optical-cycle RMS electric field in a bus-coupled microring](microring-pulse.gif)](https://github.com/hyoseokp/TorchFDTD/raw/refs/heads/main/docs/assets/microring-pulse.mp4)

A pulse enters along the lower waveguide. Part couples into the ring, travels
counterclockwise and returns to the coupling region, where it leaks back into
the bus. The clip follows about two and a half round trips after initial coupling.

[Full-resolution MP4](https://github.com/hyoseokp/TorchFDTD/raw/refs/heads/main/docs/assets/microring-pulse.mp4)
· [Project JSON](microring-pulse-project.json)
· [Recording checks](microring-pulse-record.json)
· [Rendering record](microring-pulse-render.json)

## What is plotted

The movie shows **optical-cycle RMS Ez**, not instantaneous carrier phase.
The field is recorded every 8 FDTD steps, giving 11.53 samples per optical period.
We square the recorded field, average it in time with a symmetric Gaussian of
sigma 2.585 fs (half the 1.55 µm optical period), and take the square root.
The filtered field is displayed every fourth sample, at 1.793 fs intervals.
There is no temporal interpolation. This reveals the moving pulse without
undersampling the optical carrier and making it appear to travel backwards.

One global field maximum and one color scale are used throughout. Thin gray
lines show the ring and bus boundaries. The domain is cropped to exclude the
source and PML, and every second spatial node is displayed. The MP4 is
1296 × 1128 pixels. The 648 × 564 GIF has a reduced color palette. Both contain
488 frames at 25 frames/s, lasting 19.52 seconds, with no audio.

## Model and checks

The geometry, mesh, materials and Gaussian source are those of the existing
[TorchFDTD versus Meep microring example](../../examples/meep_comparison/microring).
This is a **2D constant-index effective-index model**, not a full 3D SOI device.
The ring outer radius is 5 µm, its width is 0.5 µm, and the bus-to-ring gap is
54 nm. Core and cladding indices are 2.83 and 1.444. The mesh is 24 nm.

This shorter visualization runs 16,000 steps (896.7 fs) on the RTX 3060 with
FP32 fused CUDA updates. Point probes replace the spectral monitors. A
process-local, read-only observer records fields after the normal Yee/CPML
update, with CUDA Graphs disabled. It changes neither the field update nor
the source. All 100 overlapping public snapshots match the dense recording
exactly. The first strong pulse reaches the ring bottom, right, top and left
at 156.5, 230.4, 304.0 and 377.4 fs, respectively. Subsequent bottom-probe peaks
are separated by approximately 294 fs.

This is a qualitative transient demonstration, not a new transmission, Q-factor
or performance measurement. The longer, independently compared spectral runs
remain in the original example.

## Reproduce

From a source checkout with TorchFDTD and its CUDA extra installed:

```sh
python -m pip install matplotlib pillow imageio imageio-ffmpeg
python examples/visualization/microring_pulse.py
```

Outputs, including the densely sampled raw field, appear under
`results/microring-video/`. Use `--stage render` to re-render saved results,
or `--backend cpu` to compute without a GPU. The source uses Arial when
installed, with Liberation Sans or DejaVu Sans as portable fallbacks.
