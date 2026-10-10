# Passive optical-data fitting

User-supplied wavelength/n/k or complex-permittivity tables can be converted
to native isotropic Drude/Lorentz materials. Python and the material editor
use the same fitter. No measured optical-constant database is bundled.
Fitting is a CPU preparation step. The resulting oscillator coefficients use
the existing CPU/CUDA solvers and independent CUDA tensor cohorts directly.

## Python workflow

```python
from torchfdtd import OpticalData, FitOptions, fit_material, FDTD

data = OpticalData.from_csv("my_measurement.csv", unit="nm", kind="nk",
                            reference="Measurement description or citation")
fit = fit_material(data, name="Measured film", options=FitOptions(
    max_poles=6, tolerance=1e-3,
    wavelength_range_um=(1.3, 1.8),
))
print(fit.report["analytic"], fit.report["converged"])
material = fit.require_tolerance()
fit.save("material-fit.json")

fd = FDTD()
fd.project.materials.append(material)
fd.addrect(material=material.name, x_span=1e-6, y_span=1e-6, z_span=0.2e-6)
# Simulation(fd.project), process batches and CUDA tensor cohorts use the
# same fitted oscillator coefficients without a runtime fitting step.
```

`OpticalData.from_nk(wavelength, n, k, unit="um")` accepts arrays.
`from_text` accepts CSV, semicolon or whitespace columns with an optional
header such as `wavelength_nm,n,k`. For `kind="epsilon"`, use
`wavelength_nm,epsilon_real,epsilon_imag`. Header units must match the explicit
unit. Each table needs 3–8192 distinct positive wavelengths. Data are sorted
together, and duplicate, nonfinite or active samples are rejected. Resolve
measurement noise and duplicate observations explicitly before fitting.

`fd.fitmaterial(name, data, options=...)` fits and adds or replaces a material
with that name, preserving structure assignments. It changes nothing if the
requested tolerance is not met. Use `fit_material` directly to inspect and
adjust an unsuccessful candidate. The standalone result always includes its
actual errors and a `converged` flag.

Run `python examples/material_fitting.py` for a complete authored-data example,
or pass `--csv` and `--unit` for your own file. Authored analytic samples are
verification inputs, not measurements of a named physical substance.

## Import workflow with provenance

`import_material_table` runs the whole preparation in one call and records where
the table came from:

```python
from torchfdtd import import_material_table, FitOptions

result = import_material_table("sio2_sellmeier_malitson1965.csv", kind="nk", unit="um",
                               source="Malitson, J. Opt. Soc. Am. 55, 1205 (1965)",
                               licence="formula-generated table; see the file header",
                               name="SiO2", options=FitOptions(max_poles=3, tolerance=1e-4),
                               dt_s=5e-17, simulation_band_um=(0.5, 1.6))
material = result.require_tolerance()   # the fitted Material with .provenance, .fit_band_um, .fit_dt_s
result.report["analytic"]               # fit residual on the fitted band (normalized RMS and n/k errors)
result.discretization                   # max |dn|, |dk| of the trapezoidal ADE at dt_s against the fitted continuum
result.warnings                         # the extrapolation warning when simulation_band_um leaves the fitted band
```

Exactly one of a file path or `text=` is read; the raw bytes are hashed before
parsing into `MaterialProvenance.raw_sha256`, next to the source name, the
licence or usage note, the file name, the column kind, the wavelength unit and
the import date. The provenance is a field of `Material`, so the project JSON,
the generated Python script and the result NPZ keep it together with the
samples, the fitted band and the ADE-target timestep. A band outside the fitted
band raises `MaterialBandWarning` (a `warnings.warn`) with the same message the
solver's estimate and the workbench validation report for each enabled source
(`fit_band_extrapolation(material, wavelength_range_um)` is that check).
`discretization_report(material, dt_s, band_um=None)` evaluates the n/k error of
the discrete constitutive response (`omega -> (2/dt) tan(omega dt/2)`, the path
verified in G3-03 against an independent bilinear evaluation and a driven cell)
against the fitted continuum over the fitted band; it is second order in `dt`.
Neither report covers the Yee spatial dispersion or interface error.

`tests/fixtures/materials/sio2_sellmeier_malitson1965.csv` is a public table
generated from the Sellmeier formula stated in its header; a two-pole fit reaches
a normalized RMS of 2e-7 on 0.4 to 2.0 um (`tests/test_material_workflow.py`).

## Model and fitting algorithm

With fields proportional to exp(−iωt), the model is

\[
\epsilon(\omega)=\epsilon_\infty+
\sum_j\frac{A_j}{\omega_j^2-\omega^2-i\gamma_j\omega}.
\]

The implemented constraints are ε∞ ≥ 1, positive strength A and positive
damping γ. An optional zero-resonance pole represents Drude response. They
make the fitted model passive for positive frequency. Up to 16 poles are
allowed, subject to the sample count and supported parameter bounds.
`epsilon_inf` optionally fixes the high-frequency constant.

The independent fitting procedure scales the frequencies, seeds strengths
with nonnegative least squares, and refines strengths and logarithmic rates
with bounded nonlinear least squares and an analytic Jacobian. It adds poles
until the tolerance is reached or the limit is exhausted. Drude and Lorentz
seed families are refined separately because a bounded nonzero resonance
cannot become an exact Drude pole. `starts`, `max_nfev` and `seed` control the
deterministic multistart refinement. It is a local optimization procedure,
not a guarantee of a globally optimal or unique fit.

The reported target error is

\[
E=\sqrt{\sum_i w_i\left(
\frac{|\epsilon_{\mathrm{fit},i}-\epsilon_{\mathrm{data},i}|}
{\max(1,|\epsilon_{\mathrm{data},i}|)}\right)^2},
\qquad \sum_iw_i=1.
\]

Weights integrate over the input frequencies with trapezoidal quadrature.
The default objective uses equal real/imaginary error weights. `loss_weight`
can emphasize the imaginary part in optimization, while the reported
tolerance continues to use the expression above. Reports also include
relative L2, maximum normalized error and maximum absolute n/k errors.
Pole count, optimizer history, total nonlinear evaluations per stage, data
SHA-256, band, options, fitted curves and elapsed fit time remain inspectable.

The standard Lorentz model and sign convention are described in
[Meep's material documentation](https://meep.readthedocs.io/en/latest/Materials/).
Optimization uses the public
[SciPy NNLS](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.nnls.html)
and [bounded least-squares APIs](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.least_squares.html).
No implementation or material catalogue from a commercial solver is used here.

## Continuous and discrete responses

The native coupled trapezoidal ADE has the constitutive response obtained by
replacing ω with `(2 / dt) tan(ω dt / 2)`. `target="analytic"` fits the continuous
material. `target="ade", dt_s=...` fits the numerical constitutive response at
exactly that timestep. Both errors are reported when `dt_s` is supplied.
All comparison frequencies must lie below the timestep's Nyquist limit.

ADE compensation does not remove spatial dispersion, interface error, source
error or finite-time error. Changing the mesh or timestep changes its validity.
The project retains `fit_dt_s` and warns when an active material is used at a
different timestep. `material_fit_report(material, dt_s=...)` recomputes errors
from current coefficients, including after manual edits.

## Workbench workflow and persistence

Open **Materials → Measured optical data · import and fit**. Select columns
and wavelength units, load or paste a table, name its source and licence, and
choose **Import data**. The server hashes the submitted text into the
provenance (`/api/materials/provenance`); without a source name no provenance
is recorded and the panel says so. Set the fit band, pole limit, tolerance and
continuous/FDTD response target. **Fit optical data** shows measured/fitted n/k
and both response errors. Only a candidate meeting its requested tolerance
enables **Use fitted material**. **Apply materials** commits the edited database
to the project.

The **Provenance and fitted band** panel of the dialog lists the source, the
licence, the raw SHA-256, the file and columns, the fitted band with its
ADE-target timestep, the discretization n/k error at the current timestep
(filled by **Plot n / k** from `/api/materials/preview`) and the simulation-band
check: the extrapolation warnings of `/api/validate` for this material, or the
statement that every enabled source band lies inside the fitted band.

The FDTD preview and fit use the validated project's actual timestep, including
independent axis spacing, nonuniform nodes and explicit timestep overrides.
Editing inputs or closing/switching the editor invalidates pending results.
Original samples, reference, coefficients and fit metadata survive native
JSON, Python export and saved simulation project metadata. Unfitted imported
samples are distinguished from fitted coefficients in validation warnings.
Native FSP exports disclose that samples and fitting metadata remain in JSON.
New dispersive-material FSP writeback remains unsupported.

## Limits and verification

The fitted band contains the selected input samples. Accuracy outside it is
unverified. Source-band validation reports obvious extrapolation, but a pulse
can also have spectral tails outside its configured wavelength range. Check
the spectrum required by the device. Passive finite-band data do not prove
global causality, consistency, uniqueness or sufficient measurement resolution.
Anisotropic, gain, magnetic, nonlinear and sheet materials are outside this fit.

Tests use independently authored constant, Lorentz, Drude, mixed and narrow
resonance data. They evaluate held-out frequencies, dense-frequency passivity,
noisy samples, units, band selection, explicit failure, fixed ε∞, ADE response
and a directly driven discrete D/E measurement. Fitted materials also run on
CPU/CUDA and independent/tensor-cohort paths. This establishes those cases,
not a general measured-material accuracy guarantee. The next replacement gate
is interface accuracy with subpixel mesh convergence, followed by modes and
port observables.
