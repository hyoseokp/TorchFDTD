# How TorchFDTD works: animated overview

[![Animated overview of TorchFDTD: tiles, stitched near field and angular-spectrum propagation of a 1 mm metalens](https://github.com/hyoseokp/TorchFDTD/releases/download/v1.1.7/torchfdtd-explainer.gif)](https://github.com/hyoseokp/TorchFDTD/releases/download/v1.1.7/torchfdtd-explainer.mp4)

A 1 min 55 s animation (1920 × 1080, 60 frames/s, no audio) of the ideas behind the package:

1. **Yee grid.** Staggered E and H updates, written as one linear map per step, u<sup>n+1</sup> = F<sub>n</sub>(u<sup>n</sup>, p).
2. **Fused CUDA kernels.** The separate curl, update, absorber and source stages of a step become two fused kernels, captured once as a CUDA graph.
3. **Discrete adjoint.** Checkpoints are kept during the forward sweep, and the transposed sweep replays each segment and runs backward to the parameter gradient.
4. **Host memory streaming.** The domain lives in host DRAM and one slab with its halos advances K steps on the GPU at a time. Wider slabs use more of the GPU and do less halo work.
5. **Lateral tiles.** A 1 mm × 1 mm metalens (25 × 25 tiles of 40 µm) is solved one quadrant at a time, mirrored, and the tile cores are stitched into one exit plane that is propagated along z with the angular spectrum.

The Yee, kernel, adjoint and streaming scenes are schematic. The tile scene shows computed fields of the
tiled 1 mm lens: the exit-plane E<sub>x</sub> at 510 nm of the central 5 × 5 tiles (200 µm), taken from the
stitched output of the tiled run, and the y = 0 intensity section from
[`lens1mm-tiled-5880.npz`](../validation/paper_review/lens1mm-tiled-5880.npz). The full aperture is drawn as
a tile grid because its outer wavefronts, about 1 µm apart, cannot be shown at video resolution.

Rendered with [manim](https://www.manim.community/) Community Edition 0.21.
