# Current acceptance record

## FDTDX parity round and public repository, 21 September 2026

Seven feature branches were merged on one day to bring every row of the
FDTDX comparison except single-problem multi-GPU to equal
or ahead: GDS polygons with holes, layer etching, staircased sidewalls, browser
hole rendering and one-call two-port networks (bf9978c, b750d3e, 6b072e7),
finite-distance near-zone projection, observation grids, TFSF admission, lossy
and per-frequency exteriors and open surfaces (ed87202, 2e6efd8, e59a726),
N-port aperture mode networks with streamed injection and a full-autograd modal
oracle (1951bbe to 28e8bda), differentiable polygon and spline solids with a
recorded shape-gradient convergence (3cbebb4), PMC/symmetric faces in the
adjoint, streamed and tensor-batch paths with per-face CPML profiles and face
ADE banks (2a7a3e5 to 232f4c6, 35414f3), and tensor media inside CPML under the
geometric stability admission with PEC walls, tensor ADE, streaming and a
birefringent slab acceptance (c753bdd to 1ad9166). Each branch was rerun by the
integrator before merging, and five regressions found by the full suites were
fixed the same day: a bitwise geometry regression check made tolerant of BLAS
round-off (b12fb6d), four boundary tests aligned with the widened PMC admission
and a restored two-dimensional PMC rejection (232f4c6), open-ended source slices
in the tensor-batch face admission (a879e1b), a singular tensor pole strength
rejected by one LAPACK build (86bcec4), and two browser tests whose server
route returned 500 for a dispatch-time rejection (f6aacf3).

Two solver defects surfaced by the RTX 5880 suite were fixed: the waveguide
eigensolver returned an arbitrary basis of a degenerate polarization pair, which
depends on the BLAS build and left the two ports of a uniform interface network
with orthogonal polarizations on the workstation, so degenerate clusters now
rotate onto a canonical basis ordered by transverse power (06d54eb), and the
recorded benchmarks no longer require a Git checkout (128a5ff).

The full suite passed on the local RTX 3060 at a879e1b with 2,141 passes and 7
skips and at 1ad9166 with 2,181 passes and 7 skips, and on the RTX 5880 at
a879e1b with 2,141 passes and 7 skips (JUnit SHA-256
`894a231e12bcf466b7e38c344fd6df941b63d1d55788151ffceae9d60e62e629`) and at
1ad9166 with 2,178 passes, 7 skips and the three singular-strength failures that
86bcec4 removes, after which the five anisotropy files passed there with 59
tests. The skips are the two-GPU NCCL case, three Gloo cases unsupported on
Windows, the licensed Lumerical round trip and two opt-in CUDA gates.

The repository became public on this day at the author's decision, with the
README reduced to an overview and the measurement record moved to
[MEASUREMENTS.md](MEASUREMENTS.md). The manuscript was rewritten as a software
paper with a full bibliography (034bd98).

## Beyond-VRAM crash and resume on the RTX 5880, 21 September 2026

A real FP32 streamed adjoint on a 1152 x 1024 x 1920 grid (2.26 billion
cells, 54.4 GB of E/H against 51.5 GB of physical VRAM, ten steps, slab width
4, temporal depth 4, no interior checkpoints, disk banks, one journal record
per block) was run as two processes. The first exited right after publishing
its first backward record, 1137.4 s after start, with a 559.1 s forward and
96.6 s of forward journal writes. The second restored the completed forward in
7.7 s, resumed the backward below the recorded block and finished in 957.5 s
with a peak Torch CUDA allocation of 3.03 GB and a peak RSS of 30.0 GB. Its
gradient matches the causal-cone oracle with a crop relative L2 of 9.08e-8
and a norm error of 8.23e-8, the restored signals are equal bitwise, and no
gradient appears outside the causal cone. Whole-machine counters over both
processes peak at 38.9 GB in use of 137.1 GB, 46.2 GB committed and 0.27 GB
of file cache, with a mean disk write rate of 0.59 GB/s, a 2.68 GB/s peak and
1.52 TB written in total. Journal records already on disk now count toward
the journal reservation, so a resume does not need space for a second full
journal. [Record and scope](BEYOND_VRAM_RESTART.md).
No competitor comparison or sustained-throughput claim follows from this record.

## Durable restart journal for streamed adjoints, 21 September 2026

`StreamedAdjointOptions(restart_directory=...)` records forward state and
partial signals, the completed forward signals, and the adjoint state with the
partial material gradient at block boundaries. Records are written to a
temporary directory, synced, renamed and then published through per-phase
pointer files, and the previous record of the same phase is removed afterwards.
The reservation charges two states plus two parameter gradients on the journal
volume. A resumed backward replays only the blocks below the recorded one from
the all-zero initial state, so no restart bank has to survive the crash.

Sixteen tests on CPU and CUDA tiles with host and file banks interrupt the
forward pass after one or three blocks, interrupt a retained backward pass
after one or three transposes, and kill a real child process during backward
and resume it from a new process. Resumed signals and gradients equal the
uninterrupted run bitwise on CPU and within 1e-6 relative on CUDA. Changed
inputs and a different signal adjoint are rejected with the differing contract
keys named, `restart_every_blocks=2` writes the expected record counts, and an
insufficient journal volume is rejected before any directory is created.
Spectral observations, ADE, tensor, geometry and asynchronous tile paths are
not covered, and the recovery cost of a large file-backed run is unmeasured.
[API and limits](STREAMED_RESTART.md).
Linux CI [35564752901](https://github.com/hyoseokp/TorchFDTD/actions/runs/35564752901) at `4dc3024` passed with
1,590 Python passes and 457 skips, 42 browser passes and
8 skips. Frontend and wheel builds passed. The JUnit SHA-256 is
`5af0c761bcb8314d2da6377aa1bfea9f93df4ae957da6f64c91c5771b5ca251e`. No numerical experiment was rerun.

## Streamed file-bank lifetime and reservation, 21 September 2026

Distinct live file-bank identities of the streamed adjoint were counted through
weak references at every allocation with cyclic garbage collection disabled.
Sixty nondispersive CPU cases over checkpoints 0/1/2/4, local checkpoints
0/1/2 and five block layouts, plus ADE cases, hold at most two forward banks
and `checkpoints + 3` backward banks. The bound is reached for every checkpoint
count when the block count allows full nesting, and local checkpoints create
no file banks. Injected allocation, slab write, transfer-wait, slab read and
reduction failures in the forward phase and in a retained backward pass leave
no scratch files while the exception traceback still references banks, and a
later backward pass on the same graph reproduces the first gradient exactly.
Asynchronous CUDA tiles drain after forward and backward failures, device
allocation returns to its baseline, and a retry succeeds.

On this evidence the disk bank reservation is `checkpoints + 3` states instead
of `checkpoints + 5`. For the recorded 54.26 GiB FP32 state this lowers the
checkpoint-one reservation from 325.6 to 217.1 GiB by calculation only. No
large run was executed, the host dense-parameter reservation is unchanged, and
concurrent backward passes of one graph remain outside a single budget.
[Record](validation/streamed_bank_lifetime.json), [limits](STREAMED_FDTD.md).

A host allocation ledger then counted every Python-level CPU tensor of at
least half the parameter size by identity and sampled process RSS on two RTX
3060 runs with the same tile size, 384 x 192 x 192 and 768 x 192 x 192 real
FP32 cells, twenty steps, one checkpoint, file-backed banks and synchronous
reusable CUDA tiles. Forward allocated no full-size host tensor. Backward held
exactly two, the accumulated gradient and one block contribution. The RSS peak
grew by 2.00 parameter bytes per parameter byte between the runs, and the
tile-scaled remainder stayed below the separate tile and I/O reservations. The
CUDA peak was 35% of the device reservation. In that measured scope the
dense-parameter host reservation is four copies instead of eight; every other
path keeps eight and the metadata estimate reports the multiplier it applied.
[Records](validation/streamed_host_ledger_3060.json),
[larger grid](validation/streamed_host_ledger_3060_768.json).
Linux CI [35563523607](https://github.com/hyoseokp/TorchFDTD/actions/runs/35563523607) at `98029a3` passed with
1,578 Python passes and 453 skips, 42 browser passes and
8 skips. Frontend and wheel builds passed. The JUnit SHA-256 is
`d4f21b8fdc529fb582c91677f590292ee4eab9a8b410930febdbc474240231e4`. No numerical experiment was rerun.

## Real FP32 state larger than physical VRAM, 21 September 2026

Frozen revision `61326d2` completed 1152 x 1024 x 2048 cells, ten real-FP32
forward steps and a full dense epsilon VJP on RTX 5880. E/H alone is 54 GiB,
above 47.9878 GiB reported physical VRAM. Peak Torch CUDA allocation is
2,225,672,704 bytes and sampled process RSS is 31,949,930,496 bytes. Total
timed wall cost is 3,504.525 seconds. Signal error is zero, gradient crop
relative L2 error is 9.12e-8, norm error is 7.90e-8 and the gradient outside
the causal cone is zero. All gates pass the declared 2e-4 threshold.

Both file stores closed. All 80 runtime source hashes match the frozen Git
revision, and original evidence bytes are preserved. This is short-run capacity
with buffered disk backing, not sustained speed, physical application convergence
or total-system memory proof. [Measurement and timing scope](BEYOND_VRAM_FP32.md).

## Metadata-only streamed work planning, 21 September 2026

The structural planner counts actual slab halo coverage, partial final blocks,
binomial replay and CPML state-file reduction traffic. It uses metadata and
existing live reservations, including explicit planning-time RAM headroom and
disk free-space floors. Candidates include larger temporal depths and narrower
slabs. Selection is opt-in by logical I/O or cell-work, with no timing prediction.

Five independent CPU file-bank cases exactly match observed per-phase bytes,
replay counts, tile visits and cell-work, including asymmetric CPML, repeated
Bloch/periodic winds and a one-block 2D PEC/PML case. Six planner tests cover
admission, immutable reports and no field allocation. The actual CUDA check
uses 64 x 32 x 32 FP32 cells for ten steps. Selected depth four reduces logical
file bytes from 117,833,728 to 64,618,496 (45.16%) while increasing counted cell
work. Histories are identical and the material VJP differs by 7.30e-9 relative
L2. Every predicted file counter matches execution.

A separate 1152 x 1024 x 2048 metadata-only estimate creates no field banks and
performs no device/storage admission. Its hypothetical traffic reduction is
not a measured improvement of the independent frozen RTX 5880 capacity run.
[API and exclusions](STREAMED_WORK_PLANNING.md),
[machine evidence](validation/streamed_work_planning.json). All 130 wheel package files
matched source and installed bytes, and the installed planner API smoke
check passed. Linux CI [35562094767](https://github.com/hyoseokp/TorchFDTD/actions/runs/35562094767) at `815db6f` passed with
1,529 Python passes and 451 skips, 42 browser passes and
8 skips. Frontend and wheel builds passed. The JUnit SHA-256 is
`18bff47adff869b3d083e4de7abf61a06312844372dce8cd7a3ce51016247e71`. No numerical experiment was rerun.

## Resident soft-source waveform adjoints, 21 September 2026

Multiple electric/magnetic temporal terms now share the material checkpoint
adjoint. Actual additive waveform columns retain Torch parameter graphs, including
complex inputs and Gaussian amplitude/phase/frequency/delay/width. Source spatial
profiles and positions remain fixed. Carrier packing owns replay values, odd
complex alignment is admitted, source reductions touch one time row, and plane
reference identity includes actual waveforms with bounded host hash blocks.

Nine FP32/complex64 CUDA integration cases cover point, online spectrum and
six-field plane outputs. Maximum relative L2 errors against full-state CPU
autograd are 4.98e-7 for fields, 8.51e-7 for epsilon VJPs and 8.55e-7 for waveform
VJPs, against the predeclared 8e-5 gate. Native default waveforms and legacy
dielectric forward histories agree exactly. Three separate nondefault-stream
CUDA tests check full random state, CPML, material and waveform cotangents.
The public example executed three joint source/material Adam updates on CUDA.
This is API/discrete-transpose evidence, not a device optimization, physical
convergence, speed or capacity result. CR application work is excluded.

See [API limits](DIFFERENTIABLE_SOURCES.md) and the
[machine record](validation/source_waveform_adjoint.json). All 128 wheel package files matched source and installed bytes. Installed public
imports and a parameter-gradient smoke check passed. Linux CI [35557874803](https://github.com/hyoseokp/TorchFDTD/actions/runs/35557874803)
at `2bc2ada` passed with 1,518 Python passes and 451 skips,
42 browser passes and 8 skips. Frontend and wheel builds passed.
The JUnit SHA-256 is `255b15ce0bf4c56aaa0ac28686d07530556ccb9c64d338d65616b05b83eb4ed3`.
The completed CI evidence was collected without another numerical sweep.


## Stored closed-box far-field workflow, 21 September 2026

Six native spectral faces now connect to Python, bounded NPZ loading and the
browser's Closed-box far field dialog. Matched incident fields are subtracted
coherently on every face. Angular plots and JSON/CSV exports use explicit raw
spectral units. Saved arrays have no autograd graph and no new FDTD job is
started for projection. Source, geometry, exact raw quadrature and aggregate
metadata/field/axis/workspace budgets are checked before their admitted work.

The final CPU FP32 native fixture uses 24^3 cells, 525 steps, 864 face points
and 684 directions. Its normalized dipole-pattern relative L2 error is 2.073%
against the predeclared 5% integration gate. The coarse-mesh warning remains.
NPZ/Python and browser complex amplitudes agree exactly, including from the
installed wheel. The native fields remain FP32 and existing spectral archive
storage remains complex128. This small check is not a convergence or speed
claim and does not add material gradients to saved data.

Forty-three focused Python cases and four distinct browser cases passed.
All 125 wheel/installed package files match source bytes. The wheel SHA-256 is
`adc96e49683fc7256af0ae06322a334393454579bcb90f6d8e3458238b750e69`.
See [usage and limits](FARFIELD_WORKFLOW.md) and the
[machine-readable record](validation/native_farfield_workflow.json).
Linux CI [35556166662](https://github.com/hyoseokp/TorchFDTD/actions/runs/35556166662)
at `9ec5173` passed with 1,486 Python passes and 448 skips,
42 browser passes and 8 skips. Frontend and wheel builds passed.
The JUnit SHA-256 is `dd05d2b4d30d63402b13532265e858d48b013cbd9020fcc1ab7789158883046d`.
The completed CI evidence was collected without another numerical sweep.
General substrate/lattice radiation and complete FDTDX parity remain unfinished.
Public release remains NOT_CLEARED_FOR_PUBLICATION.


## Native CAD mode-network API and browser, 21 September 2026

The versioned native Project adapter and browser editor now share two opposing
fixed dielectric ports, complex S objectives and selected interior material
permittivity derivatives. Metadata and live capacity admission precede expensive
allocation. Modal jobs share the native queue and own a spawned, interruptible
worker. Atomic publication and generic/modal cancellation are synchronized.

Thirty-three focused CPU contract/integration cases and five browser cases pass
across targeted runs. The actual browser case imports an open-guide CAD setup,
computes complex S and a nonzero material derivative, and downloads NPZ, CSV
and Python. The same Project on CUDA differs from the CPU result by at most
1.43e-7 in complex S, with the selected material derivative identical in these
runs. Runtime fingerprints before and after the CUDA check are unchanged.
This small fixture is a workflow check, not optical convergence or performance.

All 122 installed package files match the audited source and isolated wheel.
The wheel SHA-256 is
`2941fdddd98794ac04bb49a0fd620be64dda945ffef464add4df51bfcb1bd3dd`.
The source scan contains 878 allowlisted files and zero pattern findings.
The 39-page manuscript preserves prior source bytes and adds the native CAD
modal workflow. Its changed pages and references were rendered and inspected.

See [usage and limits](MODE_NETWORK_WORKFLOW.md) and the
[workflow record](validation/mode_network_project_workflow.json). Linux CI [35554303419](https://github.com/hyoseokp/TorchFDTD/actions/runs/35554303419)
at `8c11f05` passed with 1,443 Python passes and 448 skips,
38 browser passes and 8 skips. Frontend and wheel builds passed.
The JUnit SHA-256 is `1fab6969c54a370a860e30baf8dd677ac7efa256971b7d16111233ce92369713`.
The completed CI evidence was collected without another numerical sweep. General routing, streamed modes and complete
FDTDX parity remain unfinished. Public release remains NOT_CLEARED_FOR_PUBLICATION.


## Open transverse CPML mode ports, 21 September 2026

The fixed bound-mode workflow now includes native CPML eigenoperators,
complete modal source tails, physical-aperture signed detectors and
opposing-port complex S matrices with interior material adjoints. Degenerate
polarizations are orthogonalized only inside their eigenspace and must pass
fresh residuals. Both signed Gram blocks are checked before volume allocation.

Forty-seven new focused CPU cases passed. Native FP32 CUDA fiber checks
cover both launch directions, two plane separations, a longer pulse, an
interior perturbation VJP and an actual four-channel network. Maximum
four-channel complex S error is 4.15e-6. The material VJP differs from a
step-halving finite-difference pair by at most 2.06e-5 relatively, with exact
zero fixed-region gradient. Independent slab/fiber and fixed-mesh padding
checks remain distinct from physical geometry-gradient convergence.
See [scope and usage](OPEN_MODE_PORTS.md) and the
[measurement/provenance record](validation/open_mode_workflow.json).

An isolated wheel and installed public API match all 119 package files
byte-for-byte. The wheel SHA-256 is
`965f0d3f2fd2c364ecd519974119e2c8fe15314fb00870ebedec29ab6616e64b`.
The 38-page manuscript builds without reference or overfull-box failures,
and its changed pages have been visually inspected. Linux CI [35552716219](https://github.com/hyoseokp/TorchFDTD/actions/runs/35552716219)
at `874c32b` passed with 1,410 Python passes and 448 skips,
33 browser passes and 8 skips. Frontend and wheel builds passed.
The JUnit SHA-256 is `e8e8da319886d49d6cdbe850d9f95c8468c32d9239483092c6783f7b58f68f14`.
The final source audit checked 864 allowlisted files with zero pattern findings.
This evidence collection did not repeat numerical tests. General routing, browser mode-network
editing, streamed modal injection and complete FDTDX parity remain open.
Public release remains NOT_CLEARED_FOR_PUBLICATION.


## Recorded periodic policy and browser integration, 21 September 2026

The explicit recorded CPML policy now supports the common CPU-design interface,
shared sequential case replay, calibrated two-polarization periodic density
responses and the browser's single-frequency optimizer. Admission includes
the fixed-background allocation and transfer copies. Component-specific layer
support must lie inside the reconstruction interval. Recorded cache keys are
separate, while existing checkpointed/streamed reference identities are preserved.

Seventeen focused CPU cases passed. The actual 160-step oblique CUDA response
matches checkpointed execution exactly. Full density VJP relative L2 error is
3.00e-7, and two retained noncontiguous seeds remain below 4.05e-7. Ten recorded
solver/transport/archive ownership instances release without cycle collection.
One browser check completes memory planning, Python export and an actual Adam
update. See the [source-fingerprinted evidence](validation/recorded_periodic_workflow.json).

These checks do not establish physical CR convergence, spatial out-of-core
execution of this recorded policy, or comparative performance. The private
release status and remaining FDTDX parity gates are unchanged.


The first full CI run at `ed7e8f5` found ten existing streamed-density
failures caused by a missing subclass configuration snapshot. The subclass
initialization is repaired, with the configuration guard preserved. All ten
affected CPU cases and a new nested-mutation regression pass. The
[failure and repair record](validation/recorded_policy_streamed_repair.json)
retains the failed CI evidence rather than treating it as a successful gate.

Linux repair CI [35551466707](https://github.com/hyoseokp/TorchFDTD/actions/runs/35551466707)
at `17fd8fa` completed successfully with **1,363 Python passes**,
446 environment-dependent skips, **33 browser passes**, and 8 browser skips.
Frontend and wheel builds passed. The Python JUnit SHA-256 is
`c85a46e1301fd7be0e3fdc4fb19967bdd2beabad5238c0172a2afd8320c8749d`.

The local runtime source audit checked 847 allowlisted files without pattern
findings. A separate isolated wheel and install matched all 116 package files
byte-for-byte. That local wheel's SHA-256 is
`f827d61f89e5b5d644bfaf160b2869adb4d2882a3bf4f45915ea19ec637e4b3b`.
The failed run remains in the repair record. This acceptance update collected
completed CI evidence without rerunning numerical tests.

## Async Bloch and online-plane CPML extension, 21 September 2026

The [recorded CPML API](REVERSIBLE_CPML.md) now accepts real FP32 scalar or
diagonal maps, complex64 fixed Bloch fields and fixed soft electric z-plane
sources. Asynchronous CPU boundary traces use two device chunks, two pinned
chunks and eight reusable events. The public plane wrapper accumulates compact
six-field spectra and regenerates bounded seed blocks during backward.

Five new native CUDA tests passed. The 48-step point-observation cases match
synchronous archives and histories exactly, with material VJP and retained-seed
relative errors below 5.9e-7. The 32-step real and Bloch-diagonal online plane
spectra match checkpointed results exactly. Their material-gradient relative
errors are 3.10e-7 and 2.48e-7. Forward failure cleanup, backward retry, owner
release and conservative allocation admission are also checked. CPU focused
groups cover 51 unique helper, transport, metadata and public workflow cases,
including existing admission cases. Their fixture corrections are retained in
the [new evidence record](validation/reversible_cpml_extended_workflow.json).

These are discrete correctness and ownership gates. They are not a throughput,
physical convergence, beyond-VRAM or final CR acceptance result. Full CPML fields
and adjoints remain resident. Public release is not cleared.


Linux CI [35548429393](https://github.com/hyoseokp/TorchFDTD/actions/runs/35548429393)
at `23b71ab` completed successfully with **1,345 Python passes**,
446 environment-dependent skips, **32 browser passes**, and 8 browser skips.
Frontend and wheel builds passed. The Python JUnit SHA-256 is
`dd88a4d8cc23d733d0906c9ae1b8717eabe11f6c0ed04a5c13daa5587e88b5f2`.

The runtime source audit checked 837 allowlisted files without pattern
findings. A clean isolated wheel and install matched all 115 package files
byte-for-byte. The wheel SHA-256 is
`7111e293bb524a7606630793c182d4937b8910a99578504312fecfca8af6bb52`.
No unchanged numerical suite was rerun for this acceptance-record update.

## Recorded-interface CPML integration, 21 September 2026

The separate [CPML reversible API](REVERSIBLE_CPML.md) admits a scalar interior
design surrounded by fixed material and z CPML. It records four tangential
planes per timestep and retains the full field/CPML transpose. Absorbing
primal auxiliary states are never inverted. Source-cell material derivatives
remain active inside the design interval.

Eleven targeted CPU tests passed, including a 2,048-step checkpoint comparison,
collar observations, retained seeds, source-cell finite differences and owned
snapshots. Two native CUDA cases passed with device and synchronous CPU trace
storage. Their full admitted gradient relative L2 error is 5.34e-7 and both
histories match their checkpoint reference exactly. Eleven metadata-only
admission cases also passed. The [source-fingerprinted record](validation/reversible_cpml_workflow.json)
keeps scope, corrections and conservative memory allowances. This is not a
general CPML physical-convergence, large-capacity or throughput result.
Linux CI [35546493019](https://github.com/hyoseokp/TorchFDTD/actions/runs/35546493019)
at `ef1b158` completed successfully with **1,305 Python passes**, 441
environment-dependent skips, **32 browser passes**, and 8 browser skips.
Frontend and wheel builds passed. The Python JUnit SHA-256 is
`7c65b969828d327b9f0aa0fc17f2ed9ffbd5b70f6d7f64e211777efc855a6414`.

The runtime source audit checked 828 allowlisted files without pattern
findings. A clean isolated wheel and install matched all 113 package files
byte-for-byte. Its SHA-256 is
`e8c3b336c4c26cd2df41545057804c3e107a6cfab4f8d6ef1b22c13ebea40e4a`.
The first local build attempt rejected the environment's older setuptools
before building a wheel. The successful build used the declared isolated
build environment and a fresh copy of the audited source. No unchanged
numerical suite was rerun for this acceptance-record update.

## 21 September 2026 integration

The integration following `3bc7898` adds ordinary native Project/CLI/browser
closed-PMC execution and complete endpoint NPZ storage, a fixed-isotropic-collar
CPML path for full interior tensors, and a separate 25 nm slab-gradient
acceptance record. Focused native PMC CPU, CUDA and browser checks passed.
Tensor CPML checks cover independent tiny assembly, nonzero auxiliary-state
transpose, material VJP and real/complex FP32 CUDA parity. A discovered CUDA
eigenvalue-validation workspace excess was corrected with bounded matrix
batches. These checks do not establish general anisotropic PML reflection,
long-time stability, streamed PMC or a large-grid memory measurement.
The fixed-slab material derivative meets its predeclared 2% continuum criterion
and its actual descent step improves both native and continuum objectives.
See [the physical record](MODE_NETWORK_GRADIENT_ACCEPTANCE.md).
The follow-up at `99c61c7` connects explicit full-cell GDS ports to native
mode-network S parameters and material gradients. Its independently checked
rotated-tensor slab reduces complex transmission error from 1.0088% to
0.2421% on mesh refinement. The rotation VJP differs from the continuum
derivative by 1.5077%. See [GDS mode ports](GDS_MODE_PORTS.md) and
[the tensor slab record](TENSOR_CPML_SLAB_ACCEPTANCE.md).

Linux CI [35537265913](https://github.com/hyoseokp/TorchFDTD/actions/runs/35537265913)
at `99c61c7` passed **1,218 Python tests**, with 432 environment-dependent skips
and no Python failures. Three actual two/three-process Gloo cases passed.
The JUnit SHA-256 is
`ad92bbc29a544da0d7533cb24adfa7acc92f24004a283e4946e2f67bbbdfb4ea`.
Its browser step passed 28 cases and skipped 8, but failed one obsolete
assertion requiring the PMC option to be absent. The complete CI run therefore
failed. Revision `11ec24d` corrects that test expectation. The affected browser
workflow then passed locally. The unchanged Python suite was not repeated
for this test-only correction. The earlier `6fa0c3` run also failed, on a stale
PEC rejection-message expectation, and is not counted as an all-pass run.

The `99c61c7` staged-source audit checked 771 allowlisted files with no pattern
findings. A wheel built from those exact bytes was installed and all 101
package files matched the audited source and wheel. Its SHA-256 is
`e200e4e06225f872e1472bc7295c94aef18d5f85ca48cab28f32e21016ed382a`.
The UI-test follow-up changes no package bytes.
These records do not establish full feature parity, multi-GPU performance
or public-release clearance.

The next integration adds a separate uniform PMC+CPML endpoint API with compact
direct CUDA gathers and a complete auxiliary-state transpose. Four focused CPU
tests and one CUDA test passed. Full/half-domain CPU fields and gradients agree,
and complete checkpoint payload halves in the recorded geometry. The final
CUDA case exercises both electric and magnetic auxiliary families. Its peak
Torch allocation was 107,520 bytes within a 297,428-byte plan. The initial
allocation undercount and corrected fixture remain documented in
[PMC_NATIVE_CPML.md](PMC_NATIVE_CPML.md).

Stored native six-field planes also connect to browser diffraction and bounded
NPZ/Python postprocessing. Two actual CPU API/adapter tests and one actual-run
browser test passed, including matched references, cutoff errors and stale
response rejection. The production frontend was built and its computed table
visually reviewed. See [the workflow](RADIATION_WORKFLOW.md). The manuscript was
rebuilt to 34 pages and changed pages were rendered and reviewed.

A separate frozen-wheel [FDTDX correctness fixture](FDTDX_MATCHED_CORRECTNESS.md)
passes in the same Linux RTX 3060 environment. The two histories, scalar loss
and scalar material derivative agree exactly for this periodic 16³/64-step
case. It is not a comparative timing or large-capacity result.

Linux CI [35539439385](https://github.com/hyoseokp/TorchFDTD/actions/runs/35539439385)
at `b68bb0b8776c7bc3ccf993038ba0ba659e097fbd` passed **1,224 Python tests** with
433 environment-dependent skips, and **30 browser tests** with 8 skips.
Frontend and wheel builds passed. The Python suite took 341.85 seconds.
Its JUnit SHA-256 is
`ad2158b9a0c3e5165c9e484584c5756e0581c8b7d4c2d2a8ab77b956d5b99764`.
The artifact confirms all four mixed PMC/CPML CPU cases, both radiation workflow
cases and three actual two/three-process Gloo cases passed. CUDA-specific and
two-GPU NCCL cases were skipped in this CPU environment. The separate local
mixed PMC/CPML CUDA evidence above remains distinct from CI.

The `b68bb0b` staged-source audit checked 784 allowlisted files without pattern
findings. All 105 package files in a fresh wheel and separate installation
matched the audited source exactly. The wheel SHA-256 is
`edab666706af59673a3236d1de5efababbae036debf11eec79606275cf6b2cb0`.
This successful integration supersedes the earlier failing CI runs for its
covered paths while retaining their failure history. It does not establish
full feature parity, comparative throughput or public-release clearance.

The next scoped integration connects unequal fixed opposing port sections and
restricted native PMC/CPML execution. The port extension retains one calibration
volume and one recomputed case graph at a time, with zero exterior cotangents.
Its original five-cell-PML fixture failed an independently predeclared complex
S criterion. A separate frequency-domain calculation reproduced that finite
problem within 6.25e-7, isolating finite-PML error. A single thicker-PML follow-up
reduced maximum complex S error to 1.29e-5 under the unchanged 0.004 criterion.
The original failure remains in [the port record](MODE_NETWORK.md). These are
CPU unequal-interface results, separate from prior shared-section CUDA checks.

The [native PMC/CPML workflow](PMC_NATIVE_CPML.md) passed ten targeted CPU cases,
one closed-PMC trace/NPZ regression and an actual browser CPU job. Five additional
affected rejection cases passed after updating obsolete closed-wall assertions.
The explicit profile button preserves atomic scene validation. Unsupported
profile settings are rejected rather than silently replaced. These additions
were not present in the `b68bb0b` CI run above, and its counts are not evidence
for the follow-up implementation.

Linux CI [35541201040](https://github.com/hyoseokp/TorchFDTD/actions/runs/35541201040)
at `f355601860c563cbae5a4a57bb6aa1b5dadd6b6c` passed **1,240 Python tests**
with 434 skips and **31 browser tests** with 8 skips. Frontend and wheel builds
passed. The Python suite took 683.70 seconds. JUnit SHA-256:
`4f95826afd7aeaa53494effea29e1009cb2cf9c8cd88f5b210ae8d57210b282f`.
This includes unequal opposing fixed ports and native PMC/CPML. It predates
the following tensor-native workflow and does not validate its new files.
The f355 source audit covered 796 files without pattern findings. All 105
package files matched its audited source, wheel and isolated installation.
Wheel SHA-256: `cf3af7936337e17ed9bbb2789f6249967fd4ef4a779fe4afbbd395f55b1c1bab`.

The tensor-native follow-up adds six Cartesian material coefficients, bounded
fixed-node geometry rasterization, differentiable material tables and ordinary
Project/CLI/browser execution. Sixteen focused CPU cases cover schema, material
VJPs, independent periodic/Bloch Fourier-symbol oracles, snapshots, NPZ,
cancellation, memory admission and scalar/export guards. The actual browser
CPU workflow passed, including invalid-material rejection without changing the
saved scene. Two initial UI fixture/locator failures remain in local logs.
A separate CUDA integration case covers periodic, Bloch and fixed-collar CPML,
with maximum trace error 9.31e-10 and table-VJP error 1.00e-11 versus CPU.
These small correctness tests do not measure large-grid capacity or throughput.
See [the native tensor workflow](TENSOR_NATIVE.md) for source hashes and scope.

The separate restricted native PMC/CPML CUDA integration also passed,
including waveform/material VJP, exact zero exterior gradients and NPZ fields.
Its maximum trace error is 2.79e-9 and peak Torch allocation delta 214,016 bytes
is below the 491,620-byte planned tensor payload. An initial test-only tuple/list
JSON comparison failure was corrected before the targeted test passed.

Linux CI [35542219514](https://github.com/hyoseokp/TorchFDTD/actions/runs/35542219514)
at `d942f2f4818b0d9845ec22d3b91c41c01e875854` passed **1,256 Python tests**
with 435 environment-dependent skips and **32 browser tests** with 8 skips.
Frontend and wheel builds passed. The Python suite took 685.96 seconds.
JUnit SHA-256:
`42e66e49746be605914f6cb9e0c2fb26653bb24e1b65a2dc99e543458d60345a`.
The new tensor-native tests and browser scene passed in this CPU environment.
CUDA evidence remains the separate targeted RTX 3060 result above.

The d942 source audit checked 807 allowlisted files without pattern findings.
All 107 package files matched its audited source, wheel and isolated install.
Wheel SHA-256:
`ea98c882091361d7ad8b837ec25e5f7a42dc476ec20e2b8211b5d3337c25258a`.
This is private development delivery, not public-release clearance.

A subsequent [endpoint absorption gate](PMC_CPML_ABSORPTION.md) uses a
homogeneous normal-incidence pulse and native-translated coefficients in the
direct endpoint API. Reflected field ratios are 0.199152% and 0.184126% at
six and twelve CPML layers, below the predeclared 1% limit. The first oracle
sign error is preserved and documented. This is a separate physical check,
not a native Project or general anisotropic/PML acceptance claim.
The TeX manuscript was rebuilt to 35 pages with tensor-native and reversible
cross-framework correctness records. Changed pages were rendered and visually
reviewed. No new throughput ranking is added to the manuscript.

Linux CI [35544633868](https://github.com/hyoseokp/TorchFDTD/actions/runs/35544633868)
at `282a13a5f856f226c6bdb0093af7ef6d5dcd1845` passed **1,281 Python tests**
with 438 environment-dependent skips and **32 browser tests** with 8 skips.
Frontend and wheel builds passed. The Python suite took 445.90 seconds.
JUnit SHA-256:
`5498df4dab7ecc5a6e7ee0057dca7a19de6c70b3534074879d08cb8d3877db39`.

The [scoped periodic reversible API](REVERSIBLE_ADJOINT.md) includes CPU/CUDA
material gradients, retained backward, drift rejection, schema revalidation,
terminal-storage admission and cold dependency-import lifetime checks.
Targeted RTX 3060 CUDA checks remain distinct from the CPU CI run.
The separate CPML reconstruction and chunk-storage prototypes are private
development work and are not advertised as an implemented public API.

The final source audit checked 819 allowlisted files without pattern findings.
A clean build eliminated stale UI assets found in an earlier local build.
All 110 package files matched the reviewed snapshot, final wheel and isolated
install. Final wheel SHA-256:
`0690b10b732502703beb7fceedfec81d7390b187e0bb699d241d74acb70de428`.
The manuscript remains 35 pages, with its new reconstruction subsection
rendered and reviewed. This remains private development delivery, not public
release clearance or a performance-leadership claim.

The current feature-by-feature status is in [RELEASE_SCOPE.md](RELEASE_SCOPE.md).
The earlier acceptance snapshot below is retained as historical evidence.
Linux CI [35533483790](https://github.com/hyoseokp/TorchFDTD/actions/runs/35533483790)
passed 1,180 Python tests and 28 browser tests at revision `ec3a28f`, with
429 and 8 environment-dependent skips. The frontend and wheel builds also
passed. That run includes the bulk tensor, PMC endpoint, distributed-domain
foundations, opposing mode network, native endpoint Project adapter and
distributed launcher. Its JUnit artifact confirms three actual Linux
two/three-process Gloo tests passed. The two-GPU NCCL test was skipped.
Their targeted checks and physical evidence are documented in
[mode networks](MODE_NETWORK.md), [PMC](PMC_NATIVE_CPML.md) and
[domain decomposition](DOMAIN_DECOMPOSITION.md). A clean wheel from `ec3a28f`
was built and installed with exact package-source verification. The source
audit checked 748 allowlisted files without pattern findings. Neither these
checks nor CI counts establish full parity or public-release clearance.
The later slab-oracle and gradient diagnostics add independent physical
evidence without changing the solver code covered by that CI run.
Two new scalar-oracle algebra tests passed separately. Two bounded native
fine-mesh forward/backward measurements confirm the continuum derivative
sign for the fixed slab parameter, with a remaining 6.50% magnitude error
at the finest mesh. They do not repeat the unchanged suite or establish
general physical-gradient convergence. See the [slab oracle record](MODE_NETWORK_SLAB_ORACLE.md).

## Historical 19 September snapshot

Development snapshot: 0.14.0.dev0, 19 September 2026. The required-workflow checklist objective is **not complete**. Conditional
features are developed only for concrete use cases and excluded replication
items are not implementation targets.

Active numerical validation uses analytic solutions and independently authored
native CPU/CUDA projects. Earlier vendor field/spectrum comparison artifacts
remain outside source release directories and are not release validation.

## Implemented native workflows

- Shared validated Python/JSON scene model and browser editor.
- 2D/3D Yee updates, CPU/CUDA, float32/float64 and CUDA Graph.
- Optional fused real-field CUDA updates with CPML and graded metrics.
- Independently selectable shared CUDA interpolation and six-component plane DFT,
  exposed in Python, the browser, single solves and tensor cohorts.
- CPML, Periodic/Bloch, isotropic dielectric and coupled multipole Drude/Lorentz materials.
- Uniform/graded rectilinear mesh, Yee sampling, refinement controls and matched-reference Python convergence studies.
- Optional automatic decay termination, full-domain divergence checks and fused CUDA diagnostics.
- Point spectra, planar six-component DFT, signed flux, matching-reference
  normalization, global/custom/Chebyshev monitor sampling.
- Electric/magnetic Cartesian and theta/phi point/sheet sources, staggered
  magnetic injection, Python/UI editing and independent electric-vector FSP import.
- Normal-incidence one-way E/H planes on full transverse periodic cells, paired
  previews, adjustable incident-line absorption and staggered geometry metadata.
- Independent process batches with memory admission, Python objectives,
  errors/cancellation, saved NPZ and checksum/fingerprint resume.
- Real-field fixed-duration CUDA tensor cohorts, explicit splitting, measured
  cohort selection with visible cost, native result/objective APIs and bitwise
  independence checks. No graphical batch control yet.
- Seeded parallel differential evolution with generation history and examples.
  Process and shared CUDA population execution are selectable.

## Current evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Closed TFSF follow-up full Python suite, RTX 3060 and RTX 5880 | 207 passed, 1 optional skip on each | tests/ |
| Browser suite on RTX 5880, 0.14 UI and server | 14 passed, 4 optional interoperability cases skipped. Includes TFSF creation, direction editing, preview and GPU exterior-leakage check. Startup edit race fixed | tests/ui/ |
| Closed TFSF independent discrete reference, 20 cases | Max full-field relative L2 4.28e-7, exterior peak ratio 5.04e-13. Long incident-line error reported separately | [TFSF report](validation/TFSF_REPORT.md) |
| RTX 5880 TFSF sphere, four physical meshes | Max Mie cross-section error 8.8963%, 0.3086%, 1.0474%, 0.5514%. Non-monotonic. A 240 fs control isolates the duration effect | [TFSF report](validation/TFSF_REPORT.md) |
| Full Python suite before the ensemble follow-up, both GPUs | 191 passed, 1 optional skip on each | tests/ |
| Ensemble follow-up full Python suite, RTX 3060 and RTX 5880 | 195 passed, 1 optional skip on each | tests/ |
| Observation scheduling, cohort selection and design regression, both GPUs | 15 passed on each | tests/test_tensor_batch.py, tests/test_tuning.py, tests/test_batch.py |
| Four 16-case workloads at 32³/64³ on RTX 5880 | Native E/H/trace bitwise agreement, external trace L2 at most 0.3893%. Native batch 1.07–2.39x vs native sequential, excluding explicit tuning | [Ensemble report](validation/ENSEMBLE_REPORT.md) |
| Complete 64-evaluation DE loops on RTX 5880 | Identical complete design histories. 2.05x at 32³ and 1.12x at 64³ vs independent native evaluation, fixed cohorts | [Design record](validation/design-throughput.json) |
| Final one-way/source-termination/facade regression, both GPUs | 28 passed on each after the delayed-drive and coupled-keyword fixes | tests/test_oneway_sources.py, tests/test_run_control.py, tests/test_session.py |
| Electric/magnetic vectors in periodic 2D/3D | Four independent Fourier recurrence checks, maximum full-field relative L2 2.94e-15 | [Source measurements](validation/vector-sources.json) |
| Normal-incidence one-way planes, 20 independent early propagation cases | Max full-field relative L2 4.46e-9. Long-time incident-line errors reported separately | [Source measurements](validation/oneway-sources.json) |
| RTX 5880 one-way slab, both directions | Max absolute R/T error 0.001536, energy residual 5.09e-6, scattered-side reflection difference 2.91e-6 | [Slab measurements](validation/oneway-slab.json) |
| Tensor batch and cohort splitting regression | 8 passed on each GPU | tests/test_tensor_batch.py |
| flaport/fdtd 0.2.2 graph-adapted comparison, eight fixtures | Full wall 9.64–17.09x, point-trace L2 0.012–0.037%, full-field differences disclosed | [External comparison](validation/OPEN_SOURCE_REPORT.md) |
| Native CUDA batch axis | B=1/2/4/8/16 at 32³/64³, bitwise E/H/traces. 32³ B=16 full-wall throughput 2.40x vs native sequential. Large-cohort regressions retained | [Batch data](validation/tensor-batch.json) |
| 64³, 16-case cohort splitting | Four-by-four 1.10x vs sequential, 1.43x vs one cohort. Bitwise E/H/traces | [Cohort data](validation/cohorts.json) |
| Fused kernel regression | 13 passed | tests/test_cuda_kernels.py |
| Browser suite on RTX 5880, 0.13 UI and server | 13 passed, 4 interoperability cases skipped, including one-way editing, preview and backward GPU propagation | tests/ui/ |
| Automatic termination, 64³ native sphere with zero-area pulse | 4000 to 1000 steps, full wall 2.09x vs unchecked fixed duration, DFT relative L2 1.8267e-8 | [Termination report](validation/RUN_CONTROL_REPORT.md) |
| Slab mesh convergence, 0.05/0.025/0.0125 µm | maximum T error 0.0062361/0.0015344/0.0003822 | [Convergence measurements](validation/mesh-convergence.json) |
| Fused CUDA vs native tensor CUDA, 64³/96³/128³ | loop 6.06–13.08x, full wall 3.67–5.76x, E/H/trace identical | [Kernel measurements](validation/cuda-kernels.json) |
| Slab transmission absolute error | max 0.00153444 | [Native slab](validation/flux.json) |
| Slab reflection absolute error | max 0.00153535 | [Native slab](validation/flux.json) |
| Slab energy residual | max 4.43991e-6 | [Native slab](validation/flux.json) |
| Four 64³ cases, CPU wall time | 47.0377 s | [Batch report](validation/BATCH_REPORT.md) |
| Same native cases, CUDA 1 worker | 1.1749 s, 40.03x vs NumPy CPU | [Batch report](validation/BATCH_REPORT.md) |
| CUDA 2/4 workers | 1.1819/1.2040 s, no gain for this case | [Batch report](validation/BATCH_REPORT.md) |

These establish their stated cases only. They do not establish all-feature
accuracy or compatibility. The CPU performance baseline is NumPy.

## Spectral ensemble follow-up

The local RTX 3060 suite passed 252 tests with one optional skip, followed by one
additional external-observer equivalence test. The complete RTX 5880 suite passed
253 tests with one optional skip. The 5880 browser suite passed 15 tests with four
optional interoperability skips, including selection and execution of the shared
DFT monitor path. Production frontend build and screenshot review passed.

Eight workloads cover vacuum, sphere, slab and waveguide at 32³/64³, with eight
independent cases each. Every case records three spatial planes, six components
and nine frequencies for 800 float32 steps. The matched cohort size is four.
The external flaport 0.2.2 sequence also receives the same fused observation
adapter, and the older Torch adapter remains in the record. Full-wall median
ratios are 9.75–21.23 against that upstream sequence, 3.63–8.12 for monitor fusion
at fixed native cohort size, and 1.07–1.73 for batching with the new observer.

All native final E/H and point traces are bitwise equal. New fused independent
and batch complex spectra are also bitwise equal. Maximum complete complex DFT
relative L2 differences are 5.28e-8 against native Torch DFT and 0.3875% against
the external adapter. Gates are 3e-6 and 1%, respectively. Full-field external
differences and weak-field scales are retained. These are fixed-work forward
ensemble comparisons, without a mesh-convergence or adjoint performance claim.
[Full tables and raw measurements](validation/SPECTRAL_ENSEMBLE_REPORT.md),
[implementation and Python/UI selection](CUDA_SPECTRA.md).

The TeX manuscript includes the two monitor kernels, numerical conventions and
this ablation. The 21-page PDF was rendered and visually reviewed. Its source
bundle contains 16 entries and the provenance record verifies 17 measurement
inputs. FDTDX, fdtdz and fdtd3d remain unmeasured on this host.

## Phase and graph follow-up

The final local RTX 3060 suite passed 263 tests with one optional skip. The RTX
5880 full suite passed 262 tests with one optional skip, followed by the added
complex-field/one-way graph regression passing separately. The Python spectral
batch example ran on both GPUs with two different spheres and eight-step graphs.

The new experiment records eight workloads, seven modes and three measured
repetitions after warmup, for 168 timed ensembles. The external flaport sequence
receives the identical current DFT observer and both graph options. Using its
lower measured median, the native one-step cohort workflow ratio is 9.87–21.44.
The isolated phase-kernel loop ratio is 1.06–1.19, while full wall is 0.94–1.06
and regresses in three rows. Graph unrolling also retains regressions and remains
optional with default one. No general end-to-end improvement is asserted.

Native single/cohort/unrolled fields, traces, snapshots, permittivity and complex
spectra match bitwise with the current phase kernel. Previous-versus-current
phase DFT relative L2 is at most 3.42e-8 (gate 3e-6). External complete complex
DFT relative L2 is at most 0.3875% (gate 1%). Both libraries preserve their own
one-step results under unrolling. Exact host barriers, auto-decay stop,
cancellation, multipole and auxiliary-source state are tested. The absolute
phase law is checked in both precisions through counters above one billion.
[All measurements](validation/GRAPH_ENSEMBLE_REPORT.md).

The 22-page TeX manuscript adds the phase kernel, observation-barrier algorithm
and the new ablation table. All pages were rendered and visually reviewed.
It contains three vector figures and nine measurement tables with provenance for
18 input records. No new GUI controls were introduced in this follow-up.

## Selective spectra and native monitor import follow-up

Plane monitors select E/H/P channels and signed flux independently. Online
accumulators contain only the dependency union. Mixed complex64/128 DFT,
per-axis quadrature strides, DFT temporal stride, nearest normal-node sampling,
Chebyshev roots/Lobatto, source-bound frequency intervals and independent local
apodization are available through Python and the property panel. Point time
traces retain all steps. Decimation does not include antialias filtering.

Synthetic FSP tests cover plane normals, XY lines, frequency tables, all four
apodization modes, local/global inheritance, output selection, strides and
precision. Unsupported averages, uncollocated fields, shapes and invalid settings
block the entire runnable projection. Original bytes remain unchanged.
Native sample phase, quadrature and normalization differences remain explicit.

The RTX 3060 full suite passed 321 tests and one optional skip before three
additional FSP tests were added. After a NumPy-version-dependent CPU rejection
guard was corrected, all 76 monitor-related tests passed locally. The guard now
checks the backend before accessing a tensor device. It does not change CUDA
arithmetic. The RTX 5880 full suite had 323 passing tests, one failure on that
CPU rejection path and one optional skip. After correction, all 76 affected
monitor tests passed on the RTX 5880. Four browser tests on the remote GPU
passed, covering selected outputs, precision/stride controls, local apodization,
missing-component API errors, synthetic FSP byte preservation and native GPU
execution. The new selective-spectrum Python example also ran successfully on
both GPUs with nonzero flux for its two distinct sphere cases.

Eight workloads, five modes and three measured repetitions yield 120 timed
ensembles, with all accuracy gates passing. Native final E/H, point traces and
signed flux agree bitwise with independent full-output runs. The selective
full-wall improvement is 1.14–1.69, with Torch peak allocation reduced by
6.70–19.63 percent. The upstream comparison uses the same selective observer
and the lower median of its one/eight-step graphs. Its workflow ratio is
7.74–19.32. The memory metric excludes non-Torch context/driver allocations.
The retained source hashes identify the measured revision before the CPU-only
backend guard correction. [Complete results](validation/SELECTIVE_MONITOR_REPORT.md).

The TeX manuscript now has 24 pages, three vector figures and ten measurement
tables. Its 19 input measurement records are fingerprinted. The portable source
bundle compiles with no unresolved references or overfull boxes. All pages were
rendered and visually reviewed. The author remains Hyoseok Park, with no em
dashes or semicolons in manuscript sources.

## Rectilinear mesh follow-up, 19 September 2026

Independent axis spacings, explicit node arrays, conservative rectangular CFL
and an optional smaller actual time step are available in Python and UI. Curl
metrics, physical CPML depth, paired-source coefficients, result coordinates and
tensor-cohort compatibility use the new grid representation. Synthetic FSP tests
map saved auto/custom nonuniform and anisotropic uniform staircase nodes, keeping
the original input bytes unchanged. This imports a frozen mesh, not the source
mesh generator or conformal interfaces.

The RTX 5880 full Python suite passes **353 tests, with 1 optional skip**.
The local full run found two cached-node equality failures after 350 passes and
1 skip. The model comparison now excludes the derived NumPy cache. All 98
affected solver/source/rectilinear/FSP/monitor/batch/convergence checks pass after
the correction on RTX 3060. A variable-depth PML pulse test also passes its
1e-3 late-return amplitude gate. Independent rectangular Fourier waves, irregular
periodic/Bloch curl adjointness and 240-step discrete energy conservation are
tested separately from CPU/CUDA agreement.

Four current GPU UI workflows pass: graded mesh editing, selective DFT controls,
independent-axis/explicit-node editing with Python export, and a newly generated
synthetic nonuniform FSP import through native GPU execution. Invalid node edits
leave the scene unchanged, and the downloaded FSP bytes match the synthetic
input exactly. Two older optional fixture-dependent UI cases were skipped in
the broader invocation. The current server was reloaded before these checks.

Eight matched-dt layer ensembles, four cases per row and 800 float32 steps,
yield 72 timed solves after warmup. Reducing only transverse spacing removes
93.75% of cells and improves native batch full wall by 4.33–13.39 times.
Rectangular-mesh batch scheduling contributes a separate 1.41–1.80 times gain.
Final centerline E/H and full point traces agree bitwise, and flux relative L2
is at most 5.95e-15. The entire final fields are transverse-invariant for these
fixtures. This native ablation does not establish a cross-library advantage or
curved-geometry accuracy. [Raw record and method](validation/RECTILINEAR_ENSEMBLE_REPORT.md).

The raw source hashes identify the measured revision. Subsequent model changes
correct cache equality, explicit uniform-reference rounding and boundary-roundoff
validation, without changing the measured field-update arithmetic. Source and
result hashes for older experiments remain unchanged.

The manuscript now contains 25 pages, three vector figures and eleven measurement
tables. Twenty raw input records are fingerprinted. The 19-entry portable TeX
bundle builds without unresolved references or overfull boxes, and every PDF page
has been rendered and visually reviewed. Author: Hyoseok Park. The source still
contains no em dashes or semicolons.

## Analytic CAD and material-preparation follow-up

Native solids now include extruded simple polygons, elliptical cylinders,
ellipsoids and partial elliptical rings with ordered three-axis rotations.
Python/SI facade, local vertex editing, orthographic/perspective display and
CPU/CUDA/tensor material preparation share their declared geometry convention.
Material membership uses analytic equations independent of display triangles.
The preparer restricts membership work to conservative solid support while
retaining complete Yee updates and exact overlap/material ownership.

Independent checks cover concave contours, edge rejection, rotation composition,
six rotated analytic-volume refinements, full-domain versus bounded material
arrays, and bitwise optical agreement of equivalent rotated boxes and polygons.
Mixed solids agree across CPU/fused CUDA and independent tensor cohorts.
Unrotated synthetic circle/sphere ellipse FSP records convert without a vendor
runtime, and original bytes remain unchanged. Other FSP rotations, polygon
pivots and ring sectors remain explicitly unsupported.

RTX 5880 measurements include four scene families at two grid sizes, four cases
per cohort, eight solids per case and 800 steps. All 48 timed-ensemble gates
pass bitwise across epsilon, final E/H, traces, snapshots, complex plane fields
and flux. Bounded preparation improves native full batch wall time by
1.44–21.19 times. The baseline evaluates the same analytic solids across the
whole domain. This is a host-preparation ablation, not an external-library or
CUDA stepping-kernel speed ranking. Loop fluctuations and all individual
timings are retained. [Inputs and table](validation/GEOMETRY_ENSEMBLE_REPORT.md).
The measured source revision precedes a large-legacy-angle support-rounding
fix. That fix retains identical arithmetic for the zero legacy angle used in
this experiment. Earlier raw measurement records remain unchanged.

The RTX 5880 full Python suite passed 386 tests with one optional skip. The
local full Python suite passed 385 tests with one optional skip. A subsequent
large-legacy-angle regression and affected geometry/FSP suite passed all 33
tests. The complete Python example ran on CPU and an RTX 5880 four-case CUDA
cohort, producing the same four nonzero peak-trace objectives. Three independent
frontend geometry checks passed. Four RTX 5880 UI workflows passed: polygon and
rotation editing/execution, synthetic ellipse FSP conversion, explicit mesh
editing/export, and synthetic nonuniform FSP conversion. A new-dialog selector
collision and missing initial polygon persistence were fixed before acceptance.
CAD tick spacing was corrected after inspecting the rendered interface.

The updated manuscript has 26 pages, three vector figures and twelve measured
tables derived from 21 fingerprinted JSON inputs. All pages were rendered and
visually reviewed, with full-page inspection of the new equations and table.
The portable TeX bundle has 20 entries. LaTeX compilation found no unresolved references, overfull boxes, em dashes or
semicolons. The author remains Hyoseok Park. Its numerical and distribution
limits remain explicit.

## Independent primitive geometry writeback

Recognized layout records now import boxes, rotated ellipsoids/cylinders,
partial elliptical rings and simple polygon extrusions with separate stored
pivots. The new `write_fsp_geometry` Python function, CLI and workbench export
update existing geometry while preserving unedited byte segments. Unicode
names and variable-length vertex matrices may move later records. Reports
retain original/output offsets and hashes. No-op exports preserve every byte.
Candidate outputs must reparse and match geometry and material response before
they are returned. Saved mesh nodes remain fixed. Unsupported object-list,
nongeometry and new dispersive-material changes fail explicitly.

Author-generated fixtures cover five primitives, nonzero pivots, ordered and
composed legacy rotations, closed polygon contours, changed vertex counts,
missing ellipse extensions, untouched unknown properties, malformed metadata
and rejection paths. Five edited/imported shape pairs produce identical native
material grids and CPU optical outputs. Native CPU/CUDA and tensor-cohort
comparisons also pass. No commercial field results or raw commercial layout
fixtures are included in this release validation.

The local RTX 3060 and remote RTX 5880 full Python suites each passed 414 tests
with one optional skip. Five RTX 5880 UI workflows passed, including polygon
edit, verified FSP download, reimport and native GPU execution. A subsequent
malformed-ellipse-switch guard and regression passed the 56-test focused FSP
suite on both machines. This record establishes the supported subset, not universal FSP
compatibility or a speed comparison with a commercial solver.

The updated TeX manuscript compiled into 27 pages. All pages were rendered
and inspected, including full-page review of the new interoperability prose
and the retained preparation-ablation table. Three figures, twelve measurement
tables and their 21 input hashes remain unchanged. The portable bundle retains
20 entries, Hyoseok Park authorship and the no-em-dash/no-semicolon rule.

## Mixed-topology CUDA scheduler and scene settings follow-up

`plan_grouped_batch` and `run_grouped_batch` accept mixed real-field meshes,
durations, boundary parameters and precisions. Exact topology groups include
resolved default PML layers. Each group is partitioned by a case cap and native
memory estimate, with original result order restored. Tests compare complete
E/H, permittivity, traces, times, snapshots, complex plane fields, flux, saved
results and objective values against independent native runs. Cancellation,
unsupported inputs, memory admission, output protection and objective failure
are covered. The combined grouped/tensor suite passed 23 tests on both RTX 3060
and RTX 5880. The final full local suite passed 480 tests with one optional skip.

Four RTX 5880 mixed-workload ensembles each interleave 16 cases from vacuum,
sphere, slab and waveguide families. Native independent and grouped execution
are compared with two graph-adapted flaport modes using the same fused DFT
observer. Three repetitions follow warmup. All 48 timed-ensemble output gates
pass. The [measurement report](validation/GROUPED_ENSEMBLE_REPORT.md) records
full-wall time, grouping cost, increased allocated GPU memory and the complete
accuracy limits. Source hashes and every input/repetition accompany the table.
FDTDX, fdtdz and fdtd3d are still unmeasured on this GPU.

The independent scene writer adds supported source timing/phase, monitor
frequency/window and region duration/CFL/PML/Periodic edits. Controlling input
properties and resolved values are updated together. Local sampled signals,
global temporal inheritance and effective local apodization are tested.
Automatic external sampling and PML-profile constraints remain explicit limits.
All 51 author-generated settings tests passed locally. The earlier complete
RTX 5880 Python suite passed 466 tests with one optional skip before the grouped
addition. The settings browser workflow passed on RTX 5880, including edit,
export, reimport and native GPU execution. Its asynchronous import assertion
now waits for the actual import to finish. No commercial field outputs or raw
commercial layout fixtures are included in these release checks.

The updated manuscript builds to 28 pages with three vector figures, thirteen
measurement tables and 22 input-file hashes. All pages were rendered and
visually inspected, including full-size reviews of the edited interoperability,
grouping and mixed-workload result pages. The source preserves Hyoseok Park
authorship and the existing no-em-dash/no-semicolon writing rule.

## Independent uniform FSP mesh writeback

The scene writer now updates recognized uniform target meshes in Python, CLI
and the workbench. It writes axis spacing, actual total-domain spans, CAD/PML
bounds, periodic duplicate intervals and time settings together. A smaller
fixed native dt is encoded through its effective CFL fraction. The original
coordinate origin and unedited bytes are retained. The export report records
old/new shapes, requested/actual spans and native-only representations.

Isotropic uniform records currently require legacy cell sampling, and
anisotropic uniform records require Yee sampling. Unsupported sampling changes
are rejected rather than silently changing the dielectric discretization.
Anisotropic records reimport as explicit uniform nodes. Edited nonuniform mesh
generators and external reopening/remeshing remain unverified. The geometry-only
writer retains its fixed-grid contract. See [mesh conventions and the Python
example](FSP_MESH_WRITE.md).

The full local Python suite passed 501 tests with one optional skip before
adding a final 2D point-monitor case. The final focused mesh suite passed all
23 tests. The final complete RTX 5880 suite passed 502 tests with one optional
skip in 173.19 seconds. Checks include independent serialized-grid/PML/CFL formulas, translated
origins, field/DFT roundtrips, CPU/CUDA and shared CUDA cohorts. An additional
18-case material-assignment probe found no changed Yee dielectric entries
after anisotropic remeshing and reimport. This is a tested input set, not a
general equivalence proof.

The [machine-readable validation record](validation/fsp-uniform-mesh.json)
retains the tested scope, counts and final implementation/test source hashes.

All three RTX 5880 browser workflows passed: primitive geometry export, source
and monitor settings export, and the new axis-mesh export. The last edits a
48×48×48 grid to 40×30×24, downloads and reimports the file, exports Python and
completes a native GPU run with nonzero flux. An initial server-lifetime failure
was resolved by retaining the SSH execution channel before the successful
runs. The final display-only correction also passed its mesh browser rerun,
and its rendered export dialog was inspected.

## Independent FSP primitive-list writeback

The scene writer supports addition, deletion, duplication and reordering of
the five mapped primitive families. Existing records retain their opaque
bytes, while new records use authored defaults for reserved drawing metadata.
External-reader acceptance of those new defaults remains unverified. This is
native roundtrip support, not general FSP serialization or commercial solver
equivalence. [Definitions, Python and UI workflow](FSP_OBJECTS_WRITE.md).

The writer preserves the relative order of nonstructure records, reconstructs
the root child count and checks every retained byte range at its new offset.
Reports distinguish the structural replacement envelope, individual field
edits and preserved ranges. Object/component IDs are remapped after reparsing.
Material priority, supported source pulses and monitor settings are verified
alongside geometry. The fixed-topology geometry API retains its earlier
contract. New structures can reuse unchanged supported database materials,
while new dispersive coefficients, source/monitor list changes and groups
remain outside the export subset.

The local full Python suite passed 518 tests with one optional skip before the
final range-indexing change and five additional 2D cases. The final focused
primitive-list suite passed 21 tests. Its coverage includes 2D/3D additions,
duplicate names, delete-all/add-again, repeated edits, interleaved records,
point-channel ID changes, database material reuse, exact material assignment,
combined mesh/list edits, CPU/CUDA fields, shared CUDA spectra and CLI output
preservation. The preceding RTX 5880 FSP regression suite passed 130 tests.
The final complete RTX 5880 Python suite passed 523 tests with one optional
licensed-integration skip in 180.69 seconds. The [validation record and source
hashes](validation/fsp-object-list.json) distinguish the final run from the
earlier focused checks.

All three RTX 5880 UI flows passed for object-list editing, uniform mesh
editing and source/monitor settings. The new flow duplicates a sphere, deletes
its original, adds a box, exercises both tree-order controls, exports and
reimports the edited file, exports Python and completes a GPU run with nonzero
flux. The final code and dialog rerun also passed, and its rendered export
dialog was inspected. Native-only settings are disclosed with readable object
names in a collapsible section.

## Source and monitor list follow-up, 20 September 2026

Mapped electric dipoles, 3D normal-incidence plane/TFSF sources, point TIME/DFT
monitors and frequency planes can now be added, deleted, duplicated and
reordered through Python, CLI and the workbench. Shared point-monitor channels
can be removed individually or split when their positions, names or order
diverge. Split templates preserve unknown property encodings. New records use
authored recognized defaults. Native reimport verifies waveform, geometry,
spectral settings and ID mapping. External reader acceptance remains unverified.
See the [scope and example](FSP_INSTRUMENTS_WRITE.md).

The complete Python suite passed **556 tests with 1 optional skip** on both the
RTX 3060 (231.23 seconds) and RTX 5880 (195.21 seconds). The full RTX 5880 browser
suite passed **25 tests with 5 optional fixture-dependent skips**. It includes
the new source/monitor add, duplicate, delete, export, reimport, Python export
and GPU execution flow. Its rendered export dialog was inspected. The
[validation record](validation/fsp-instrument-list.json) retains source hashes
and machine-independent test summaries.

## Private GitHub development preview

The [private development repository](https://github.com/hyoseokp/TorchFDTD)
holds the experimental 0.14.0.dev0 delivery.
A wheel built from fresh staging contains exactly the 42 current package files,
including the current browser assets. A separate virtual environment installed
that wheel and verified package import outside the source checkout, nonzero
finite CPU fields/traces, HTTP browser assets and the capabilities endpoint.
The [package record](validation/private-preview.json) includes its SHA-256.

GitHub Actions also passed the Linux CPU pipeline on numerical-source revision
`3301e38ad27a75cc1c956471756d3ebf10c7e5d1`: **429 Python tests passed, 128 skipped**
in that CPU-only environment, and **22 browser tests passed, 8 skipped**.
Frontend and wheel builds passed. Later preview commits update documentation,
archive byte preservation and this evidence only. The
[workflow result](https://github.com/hyoseokp/TorchFDTD/actions/runs/35450742135)
and the package record distinguish this CPU coverage from workstation CUDA
validation. Uploaded wheel bytes were downloaded and matched their recorded
SHA-256.

## Remaining gates

The [feature checklist](FEATURE_CHECKLIST.md) has 1658 rows: 160 implemented within
their stated scope, 225 partial and 1273 missing or unverified. Counts are not
completion percentages. Major gaps include oblique/finite-aperture injection, mode sources,
S-parameters, subpixel interfaces, further materials and
boundaries, near-to-far fields, adjoint differentiation, complete graphical
sweeps and general format compatibility.

Native magnetic source support does not verify the FSP magnetic type encoding.
That encoding remains rejected. Source power calibration and general native-to-FSP
writeback also remain open. FSP plane/TFSF conversion now covers a checked 3D normal-incidence subset with explicit auxiliary-line and amplitude differences.
[Vector sources](DIPOLE_SOURCES.md), [one-way definitions and limits](ONEWAY_SOURCES.md), [TFSF scope](TFSF_SOURCES.md).

The paper and README are development artifacts in the private delivery. No public repository,
paper submission or vendor contact has been made. Final source/package bytes
and licences require review after product scope and provenance issues are resolved.


## Required-workflow priorities and optical-data fitting, 20 September 2026

The revised priorities implement required
linear-photonics capabilities before conditional format expansion and excludes
product-specific replication. The remaining order is interface accuracy,
mode ports and S-parameters, adjoint design, then measured accuracy-matched
throughput improvements. Existing Python/UI capabilities and FSP subsets are
retained. New conditional work needs a concrete use case.

The [optical-data workflow](MATERIAL_FITTING.md) imports user n/k or complex
permittivity samples and fits passive isotropic Drude/Lorentz coefficients.
It exposes continuous and fixed-timestep ADE targets, explicit tolerance
failure, data-band/error reports and retained sample provenance. Python,
HTTP and Materials use the same implementation. The UI reads the actual
validated timestep, including independent axis spacing and overrides.
Unsuccessful or stale candidates cannot replace the material through the UI
or facade. Fitting is CPU preparation, while fitted coefficients use existing
native CPU/CUDA and tensor-cohort stepping.

Both complete Python suites passed **582 tests with 1 optional skip**:
208.58 seconds on RTX 3060 and 197.10 seconds on RTX 5880. The complete RTX 5880
browser suite passed **27 tests with 5 optional skips** in 158.28 seconds.
The new flow imports CSV, demonstrates an unmet tolerance, fits and applies
three poles, verifies the overridden timestep, saves/reloads data, exports
Python and executes on GPU. An additional race test discards a stale fit.
The rendered editor and measured/fitted response plot were inspected.

The [validation record](validation/material-fitting.json) lists independent
checks and implementation/test hashes. Authored analytic samples establish
those cases, not all measured substances. No commercial solver calculation
or measured material database is used. Subpixel interface accuracy and the
remaining required checklist still need implementation and validation.

The independent GitHub Linux CPU [pipeline](https://github.com/hyoseokp/TorchFDTD/actions/runs/35461296962)
also passed on source revision `b61af1bffddc6920109b3b3b0a0dd8b29ea6a9ea`:
**454 Python tests passed, 129 skipped**, and **24 browser tests passed,
8 skipped**. Frontend and wheel builds passed. These CPU checks complement
the workstation CUDA checks above. Subsequent evidence-only commits do not
change numerical or browser code. The private repository has been updated,
while the earlier tagged preview release assets remain unchanged.

## Experimental subpixel checkpoint, 20 September 2026

The [selectable dielectric interface method](SUBPIXEL_INTERFACES.md) now runs
through Python, the workbench, CPU, Torch CUDA and real-field fused tensor
cohorts. It remains a partial capability. Active dispersion and nonuniform
subpixel spacing are rejected. The permittivity image and result metadata
disclose the reciprocal-diagonal interpretation of the coupled operator.

The initial full local Python suite passed 603 tests with one optional skip.
After expanded geometry, precision and facade checks, the full RTX 5880 suite
passed 614 tests with one optional skip in 202.99 seconds. The final targeted
suite passed 35 tests on each GPU, including additional heterogeneous-cohort,
complex-Bloch and immediate grid-release lifetime checks.
The complete local browser suite passed 28 tests with five optional skips in
3.1 minutes. The new UI test selects the method, changes quadrature, exports
Python, retains settings and executes a CPU simulation. This browser evidence
does not claim a new RTX 5880 browser run.

The [complete sphere study](validation/SUBPIXEL_REPORT.md) retains 52 sample
solves in 26 paired comparisons, plus homogeneous references, across mesh,
index, translation, time and quadrature. It includes regressions. Timers are
diagnostic only because part of the exploratory work overlapped. No equal-error
speed advantage, universal interface convergence or full replacement is claimed.

Adjoint remains unimplemented. The [memory design](ADJOINT_MEMORY_PLAN.md)
requires a discrete custom backward and bounded checkpoint/recomputation,
including physical restart state and measured gradient/memory acceptance gates.


## Experimental Torch adjoint checkpoint, 20 September 2026

The [new Python API](DIFFERENTIABLE_FDTD.md) connects real nondispersive
permittivity and a regularized sphere to point signals, a differentiable DFT
and a Torch optimizer. CUDA forward/replay uses native fused Yee/CPML kernels.
Backward explicitly transposes the discrete operators and complete CPML state.
Bounded checkpoints support device, host, disk and explicit mixed-tier storage.
The final binomial split counts the already available restart state, reducing
unnecessary replay without retaining old adjoints in recursive frames.

The full RTX 5880 Python suite passed 654 tests with one optional skip in
213.21 seconds before the final schedule refinement. After that refinement,
38 targeted tests passed on both RTX 3060 and RTX 5880, in 17.82 and 14.20
seconds respectively. They check full-autograd and native-forward parity,
Taylor and central differences, nonuniform metrics, magnetic/vector sources,
periodic wrapping, both one-way directions, all checkpoint tiers, budget
rejection, failure cleanup and optimizer updates. Two local browser tests
passed in 7.3 seconds for priority/material controls. No new adjoint GUI is
claimed. A fresh wheel verifies all 49 package files against current source.

The [raw measurements and scope](validation/ADJOINT_REPORT.md) record a tiny
1,000/10,000-step memory baseline, a 128-cubed 3D run, a three-tier restart run,
an Adam example and bounded transfer profiling. Allocator memory is not total
GPU usage. The cold diagnostic timers do not establish competitive speedups.
This API does not yet provide all forward physics, normalized device objectives,
spatial out-of-core, asynchronous streaming or single-domain multi-GPU.

The [hierarchy plan](HIERARCHICAL_EXECUTION.md) adopts capacity-constrained
placement and asynchronous block movement from verified FlexGen/vLLM sources,
with FDTD-specific causal halos and transposed dependencies. Lossy storage and
sparse field skipping are not implemented. The manuscript predates this
prototype and needs a later validated TeX update. Public publication remains
separate from the private development delivery.
