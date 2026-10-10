> Legacy compatibility-derived implementation. Publication review remains open. No vendor waveform measurements are included or used as current validation evidence.

# Automatic wavelength/frequency sources and chirped pulses

Version 0.6 independently implements the observed v241 automatic pulse generator, its sinusoidal frequency sweep and optional Gaussian endpoint taper. It uses source settings, not saved source waveform samples or a Lumerical runtime. This extends source compatibility but does not complete FSP or solver replacement.

## Controls

Select a source, choose **Broadband / automatic range**, then choose **Wavelength range**, **Frequency range**, or **Time domain**. Wavelength endpoints use µm. Frequency endpoints and manual chirp bandwidth use THz in the UI and Hz in JSON/Python. Start and stop wavelengths may be equal for a single-frequency target.

Range modes calculate the carrier centre, power FWHM and offset automatically. The centre wavelength is the harmonic mean of the endpoints. **Optimize for short pulse** selects a pulse one-quarter as long. A sufficiently narrow target range automatically selects an unchirped standard Gaussian, as observed in Lumerical. The property panel displays the resulting type and temporal parameters. The generated spectrum extends outside the requested range, including for a single-frequency target.

Time-domain mode allows direct centre wavelength, power FWHM, offset and chirp bandwidth. Switching from an automatic range retains its effective temporal values. **Eliminate discontinuities** applies the measured C1 endpoint taper. It is separate from DC removal, which remains unsupported. For manual offsets shorter than the envelope support, a nonzero field at simulation time zero is possible; the taper does not silently move a manually placed pulse.

The same controls are available in Global source settings. Inheritance keeps local position, amplitude and phase. Preview evaluates the actual mesh-time samples used on CPU/CUDA, with an unwindowed spectrum. The declared target range must be below temporal Nyquist. Resolving that range does not prove adequate spatial resolution of all pulse spectral tails.

## Independent mathematical definition

Provenance: these legacy timing and chirp rules were inferred in earlier compatibility work. Removing the old measurement files does not erase that provenance. They must be reviewed or replaced with an independently specified native policy before a cleared public release.

Let `fl = c/lambda_stop`, `fh = c/lambda_start`, `fc = (fl+fh)/2` and `df = fh-fl`. For automatic ranges:

- Power FWHM `T = K/(fh + 0.01*fl)`, with `K = 2` for short pulses and `K = 8` otherwise.
- Gaussian width `sigma = T/(2*sqrt(ln(2)))`.
- Offset `t0 = 1.1*sqrt(2*ln(10000))*sigma`.
- Use chirp when `df > sqrt(ln(2))/(pi*sigma)`; otherwise use a standard Gaussian.

For manual chirped mode, `fc`, `T`, `t0` and `df` come from the explicit source settings. With `x=t-t0` and `u=x/sigma`, the carrier phase in radians is

`theta = -2*pi*fc*x + chirp(x) + radians(source_phase)`

where

| Interval | chirp(x) |
| --- | --- |
| `abs(u) <= 2` | `df*sigma*(4*cos(pi*u/4) - 2*pi)` |
| Outside | `-pi*df*abs(x)` |

Thus the instantaneous carrier frequency sweeps sinusoidally from `fc-df/2` to `fc+df/2` over `x = -2*sigma ... +2*sigma`, with continuous phase and frequency at both joins. An unchirped pulse sets `chirp(x)=0`.

The envelope is `exp(-u*u/2)` without smoothing. For the endpoint taper, let `a=sqrt(2*ln(10000))`, `b=1.1*a`, `h=b-a`, and `q=b-abs(u)`. Between `a` and `b`, replace the Gaussian by `A*q²+B*q³`, with `A=(3e-4-a*1e-4*h)/h²` and `B=(a*1e-4*h-2e-4)/h³`. Beyond `b`, it is zero. Value and first derivative are continuous. The source amplitude multiplies `envelope*sin(theta)`.

## Python and FSP

```python
from torchfdtd import FDTD

f = FDTD()
f.adddipole(name='source')
f.setglobalsource('set wavelength', True)
f.setglobalsource('wavelength start', 1.2e-6)
f.setglobalsource('wavelength stop', 1.8e-6)
f.setglobalsource('optimize for short pulse', False)
f.setglobalsource('eliminate discontinuities', True)
f.setnamed('source', 'override global source settings', False)
print(f.getglobalsource('pulselength'))  # seconds
f.save('broadband.json')
```

The facade also supports `set frequency`, `frequency start`, `frequency stop`, `set time domain`, `pulse type` (`standard` / `broadband` in time-domain mode), and native `chirp bandwidth` in Hz. Native projects use `pulse='broadband'` with `time_definition='wavelength'`, `'frequency'` or `'standard'`. Both automatic range views store wavelength endpoints canonically; the frequency controls convert reciprocally.

The FSP importer reads the current source definition and frequency endpoints, maps the saved smoothing flag, and independently recomputes automatic duration, offset, centre and standard/chirped selection. Inconsistent stored values block conversion. Cached `local::pulse::*` coefficients are not used as the authority. Global definitions and retained local overrides follow the same rules. This covers tested standard/broadband Cartesian electric dipoles in the existing uniform-mesh dielectric FSP subset, not arbitrary sources, beam profiles, BFAST or mode ports.

## Evidence and remaining work

The DC-removal fixtures remain explicitly blocked. Native vector dipoles are available since 0.12, and normal-incidence one-way planes since 0.13. General spatial distributions, physical normalization, oblique/finite-aperture beams, closed TFSF boxes, mode sources, frequency-dependent spatial injection and their FSP mappings still require implementation. Other Lumerical versions need their own compatibility fixtures.
