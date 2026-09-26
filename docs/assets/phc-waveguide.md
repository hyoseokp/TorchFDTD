# Photonic-crystal waveguide preview

The README animation shows an actual 2D TorchFDTD calculation, recorded at commit
[`82c3924`](https://github.com/hyoseokp/TorchFDTD/commit/82c392401acd967c18978b261f79dd0f7bfd6ff3).
It is not an AI-generated field animation or a browser recording.

- [Full-resolution MP4](phc-waveguide.mp4): 1920 × 1050, 30 frames/s, 328 frames, no audio.
- [README GIF](phc-waveguide.gif): a 640-pixel-wide, 32-color preview of all 328 frames at 25 frames/s. The lower playback rate accommodates GIF timing without dropping physical snapshots.
- [Project JSON](phc-waveguide-project.json): geometry, materials, source and solver settings.

## Model

A square lattice of z-invariant dielectric rods in air has one row removed to form
a straight waveguide. The lattice constant is 0.55 µm, the rod radius is 0.11 µm,
and the rod relative permittivity is 12. A Gaussian point source excites Ez at a
vacuum wavelength of 1.55 µm. The 9.9 × 5.5 µm domain uses 28 cells per lattice
constant and 28-cell CPML. The calculation ran for 3,936 steps on the CPU in FP32.

The source emits in both directions. The displayed region is downstream of the
source and excludes the PML. Circles show the model's rod boundaries. The rod
parameters follow the standard [MPB square-lattice example](https://mpb.readthedocs.io/en/latest/Python_Tutorial/#our-first-band-structure).

## Recording

A read-only observer copied the instantaneous signed Ez field every 12 solver
steps after the unchanged field update. Adjacent snapshots are separated by
0.550408837 fs, giving 9.39346 distinct samples per optical period. The observer
matched all coincident public result snapshots exactly. No temporal interpolation
or synthesized motion was used. One fixed color scale is used throughout, with
Emax = 0.0451529771 in reduced field units.

Probe-envelope peaks arrived at increasing x positions in increasing time, and
the recorded downstream time-integrated flux had positive x direction. These are
qualitative checks of propagation direction, not transmission-efficiency tests.

This example illustrates pulse propagation in a 2D constant-permittivity model.
It is not a 3D slab calculation, a mode-purity or convergence study, or a GPU
performance benchmark. Use the MP4 rather than the color-reduced GIF for closer
visual inspection.
