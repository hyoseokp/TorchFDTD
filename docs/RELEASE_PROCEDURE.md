# Release-candidate procedure (G9-06)

## Version changes and publication checks

These checks apply to every version change, including a patch release that
uses an approved changed-code validation scope.

1. Commit the version change, then run `scripts/clean_install_check.py`
   from that clean tree as described in step 3 below. The newest successful
   record must describe the current packaging inputs and the wheel for the
   new version. Keep older records as history. Do not rename an older wheel
   or edit an older record to claim that it tested the new version.
2. Commit the successful record, then run
   `python scripts/build_validation_report.py` followed by
   `python scripts/build_validation_report.py --check`. Both commands must
   exit 0 and report zero consistency mismatches. Include the rendered
   report and scope changes in the final repair commit, and check that
   final tree with `tests/test_clean_install.py`,
   `tests/test_validation_report.py` and `scripts/run_suite.py cpu-pr`.
3. Obtain the owner's publication approval before pushing when the task
   requires it. After the push, require a successful Verify run on main
   whose `head_sha` equals the exact final commit. Create the release tag
   at that commit only after this check passes. A green run from before
   the version change does not satisfy this requirement.
4. If the version already has a public tag or Release, ask the owner to
   choose between explicitly replacing it and issuing a new version.
   Never move a published tag as part of routine record repair.

For v1.1.7, patch validation covers reversible Lorentz density mixtures and
the related regressions. The [1.1.7 validation scope](RELEASE117_VALIDATION.md)
defines the completed local checks and the required large regression,
installation and exact-commit CI checks. It does not claim a full RC pass.

For v1.1.3, patch validation covers fixed observation-table reuse and its
related regressions. The [1.1.3 validation scope](RELEASE113_VALIDATION.md)
records completed checks and omitted full-suite work. It does not claim
a new complete WORKSTATION or G9-06 pass.

For v1.1.2, the owner selected patch validation covering the changed code.
The [1.1.2 validation scope](RELEASE112_VALIDATION.md) records completed
checks and omitted full-suite work. It does not claim a new complete
WORKSTATION or G9-06 pass.

Task G9-06 requires every
required gate to be run on the exact source tree and wheel of the release
candidate. A pass recorded at an earlier commit, combined with partial checks
after it, is not a pass of the candidate; long-run evidence is reused only when
the hashes it was tied to are unchanged and the judge accepts it. This page is
the ordered list of commands that produces that record. Each step names the
tool, what it writes and what must be true before the next step starts.

Preconditions on the RTX 3060 host: a clean checkout of the candidate commit at
`D:/TorchFDTD` (or a worktree checked out by hash as
[GPU_RUNNER_POLICY.md](GPU_RUNNER_POLICY.md) describes), the development
interpreter `D:/TorchFDTD/.venv/Scripts/python.exe`, `TMP` and `TEMP` set to
`D:/TorchFDTD/.local/tmp`, a local wheel cache under `D:/TorchFDTD/.local/wheels`,
and no other GPU work on the host. Every command below runs from the checkout root in PowerShell.

## 1. Fix the candidate

```powershell
git status --porcelain            # must print nothing
git rev-parse HEAD                # the candidate commit; every record below cites it
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py    # the state before the run, for the handoff entry
```

Any change to code, tests, fixtures or documents after this point starts the
procedure again from step 1. The only commits allowed during the procedure add
files under `docs/validation/` (records, evidence runs, the gate file), the
notices and SBOM of step 2, `docs/PHYSICS_VALIDATION.md` re-rendered in step 4
and the two rendered documents of step 6. A fix found during the procedure,
even to a test alone, is committed and the procedure restarts here; re-recording
only the tasks that watch the fixed file is not a release-candidate run.

## 2. Regenerate the third-party notices and the SBOM

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --check   # must exit 0 with problems: []
```

The write mode rewrites `docs/THIRD_PARTY_NOTICES.md` and
`docs/validation/sbom.json` from the interpreter's package metadata and the
tracked tree; `--check` is stale whenever the tracked tree changed since the
last write (it compares the committed outputs with a fresh build), so the
candidate must carry outputs written from its own tree. Commit both files
("Regenerate the third-party notices and the SBOM for the release candidate")
before the wheel is built, so the wheel and the notices describe the same tree.
The report of step 6 runs the same check and prints its result.

## 3. Build the wheel and check the clean install

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/clean_install_check.py --local-root D:/torchfdtd-clean `
    --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"
```

The local root lies outside the checkout, because the probes assert that the
installed package does not resolve under it; the script refuses a root inside
the checkout. This builds the wheel from a fresh staging copy of the package sources into
`D:/torchfdtd-clean/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl`,
verifies that its payload equals the tree byte for byte, installs it into fresh
CPU and CUDA environments, runs the probes, the server, `torchfdtd doctor` and
the README blocks, and writes `docs/validation/clean_install/<time>-<commit8>.json`.
The record must say `all_passed: true` and `dirty_paths: []`. Commit the record
("Record the clean install of the release candidate"). Note the wheel path and
its SHA-256 from the record; the wheel is the release artifact and is not
rebuilt afterwards.

Check before step 4 that the candidate commit and the wheel's commit differ only
under `docs/validation/`:

```powershell
git diff --stat <wheel source_commit> HEAD -- torchfdtd pyproject.toml README.md LICENSE THIRD_PARTY_NOTICES.txt   # must print nothing
```

## 4. Re-record every gate with the wheel

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/rerecord_gates.py --all --exclude G9-06 G9-07 --platform rtx3060-win11-lab `
    --wheel D:/torchfdtd-clean/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl `
    --torch "torch==2.10.0+cu126" --find-links D:/TorchFDTD/.local/wheels --extras dev,cuda-kernels,gds,hdf5
```

`rerecord_gates.py` refuses a dirty tree (the gate file and the runs directory
excepted), installs the wheel with the `dev`, `cuda-kernels`, `gds` and `hdf5`
extras (without `hdf5` the result-store tests skip for want of `h5py`)
into a fresh `D:/TorchFDTD/.local/venvs/rc`, checks that this interpreter imports
`torchfdtd` from its own site-packages and not from the checkout, and then, for
every task whose newest evidence exists, reruns the recorded command with that
interpreter from a working directory under `.local/tmp/rc-work`, with the
recorded environment variables, a fresh JUnit report and absolute test paths.
Each run is recorded with the same case file, the wheel's SHA-256 (`--dist`),
the interpreter's environment (`--interpreter`), the host's platform id
(`--platform`, a record under `docs/validation/platforms/`), a note naming the
replayed run and a scope ending in `re-recorded on <commit> for the release
candidate`. The
table it prints lists task, previous run id, new run id and the state written
to the gate file; the exit status is 0 only when every task is VERIFIED.
G9-06 is excluded here because step 5 runs and records the full suite.
G9-07 is excluded because its tests compare the committed report with a fresh
render; step 6 records it after the report is rebuilt from this batch.

Before creating the wheel environment or running any task, the re-recorder
prepares every selected command and checks explicit test paths. Recorded test
source paths identify the old checkout even if its worktree has since been
removed. A recorded `gpu_lock.py` launcher needs an outer lock: run the whole
batch inside the host's `gpu_lock.py --exclusive` and add
`--external-gpu-lock` to `rerecord_gates.py`. That option replaces only the
recognized lock launcher with its unchanged `python -m pytest` child, using
the wheel interpreter. It must not be used without an outer lock. Unknown
launcher options are rejected, so a nested lock cannot silently deadlock the
batch or run the development interpreter instead of the wheel interpreter.

Tasks whose recorded command writes records into the tree (the G3 fixtures with
`TORCHFDTD_G3_RECORD=docs/validation/g3`) leave those files modified; the
recorder lists them in `dirty_source_manifest` and the judge reports the
warning. This warning remains separate from the test verdict and exit code;
guarded source changes are still rejected. Re-render `docs/PHYSICS_VALIDATION.md` with
`scripts/render_physics_validation.py` and commit the regenerated records with
the evidence.

Every recording of this round runs after the candidate commit, so none needs
`--allow-precommit-junit`, and every guarded file is committed, so none needs
`--allow-dirty`; a run that would need either is not a release-candidate run.
The recorder enumerates every file-level required test with
`pytest --collect-only` under the wheel interpreter and hashes the task's
`watch_paths`, so a partial run or a changed data file cannot pass as VERIFIED.

Tasks that fail here are findings of the candidate. A FAILED task is not
re-run until the defect is fixed, and a fix restarts the procedure at step 1.
Commit the gate file and the new run directories ("Record the release-candidate
gate runs at <commit12>").

## 5. Run the release-full suite on both hosts

On the RTX 3060 host, with the wheel interpreter of step 4 so that the suite
sees the installed package's dependencies and the `--gpu-required` policy:

```powershell
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full --ignore=tests/test_validation_report.py `
    --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G9-06 `
    --command "D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full --ignore=tests/test_validation_report.py --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml" `
    --junit D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml --exit-code $LASTEXITCODE `
    --dist D:/torchfdtd-clean/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl `
    --interpreter D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe --platform rtx3060-win11-lab `
    --scope "G9-06: release-full suite with --gpu-required on rtx3060-win11-lab at commit <commit12> against wheel <sha256 head>"
```

`tests/test_validation_report.py` is the G9-07 module: it compares the
committed report with a fresh render of the gate file, and the report of this
round is rendered in step 6 from the records of steps 4 and 5, so before step 6
it cannot match. Step 6 runs it. Commit the gate file and the new run directory
("Record the release-full suite on rtx3060-win11-lab at <commit12>").

`run_suite.py` launches pytest from the checkout root, so this suite exercises
the source tree of the candidate; its identity with the wheel is the byte
comparison of step 3, and the installed-package import of step 4 covers the
package as installed. The suite includes the opt-in `long` tests and sets
`TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST` and `TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST`;
a CUDA test that skips is a failure. Under `--gpu-required` the only permitted
skips are `optional platform check:` ones (the two-GPU NCCL case, Gloo,
licensed tools).

For the 0.15.0 candidate the owner accepted the RTX 3060 run alone
(2026-09-23), because the RTX 5880 Ada host was committed to other work; the
G9-06 scope line of that candidate says so. The 0.16.0 candidate was recorded
the same way, the RTX 5880 Ada host remaining committed to other work by the
owner's instruction. For the 1.0.0 round the RTX 5880 remains reserved for
other work under the owner's 2026-09-26 handoff, including the 1.1.1 round.
For 1.1.2, the owner explicitly waived the RTX 5880 run on 2026-09-30 and
authorized release after the RTX 3060 RC and exact-commit CI pass. The full RTX 3060 round is
therefore the recorded workstation scope. The two-host run below remains the
procedure when both hosts are available. This does not remove the separate
two-GPU HPC acceptance requirement.

On the RTX 5880 Ada host (platform record
`docs/validation/platforms/rtx5880-ada-win11-remote.json`; rewrite it with
`python scripts/platform_report.py --id rtx5880-ada-win11-remote` when the
driver, torch or CuPy there changed), check out the same commit by hash,
install the same wheel into a fresh environment, run the same suite and record
it against G9-06 with that checkout's recorder (its hardware and environment
are then the ones written into the evidence):

```powershell
git worktree add D:/TorchFDTD/.local/worktrees/rc-<commit12> <commit>
cd D:/TorchFDTD/.local/worktrees/rc-<commit12>
python -m venv D:/TorchFDTD/.local/venvs/rc
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe -m pip install "torch==2.10.0+cu126" --index-url https://download.pytorch.org/whl/cu126
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe -m pip install "<wheel path on this host>[dev,cuda-kernels,gds]"
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full `
    --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx5880-<commit12>.xml
python scripts/record_gate_evidence.py --task G9-06 --command "..." `
    --junit D:/TorchFDTD/.local/tmp/junit/release-full-rtx5880-<commit12>.xml --exit-code $LASTEXITCODE `
    --dist <wheel path on this host> --interpreter D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe --platform rtx5880-ada-win11-remote `
    --scope "G9-06: release-full suite with --gpu-required on rtx5880-ada-win11-remote at commit <commit12> against wheel <sha256 head>"
git add docs/validation && git commit -m "Record the release-full suite on rtx5880-ada-win11-remote at <commit12>"
```

Transfer that commit to the local repository (fetch from the remote checkout or
a `git bundle`) and merge it; the gate file then lists both runs under G9-06
and the newest one is the judged one, so verify with
`scripts/check_release_gates.py --task G9-06` that both evidence files are
VERIFIED. The remote wheel must have the same SHA-256 as the local one; copy
the file, do not rebuild it.

## 6. Render the report and judge

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_validation_report.py     # must print 0 mismatches
git add docs/VALIDATION_REPORT.md docs/RELEASE_SCOPE.md
git commit -m "Render the validation report of the release candidate at <commit12>"
D:/TorchFDTD/.venv/Scripts/python.exe scripts/rerecord_gates.py --all --tasks G9-07 --platform rtx3060-win11-lab `
    --wheel D:/torchfdtd-clean/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl `
    --torch "torch==2.10.0+cu126" --find-links D:/TorchFDTD/.local/wheels --extras dev,cuda-kernels,gds,hdf5
git add docs/validation
git commit -m "Record the G9-07 report run at <commit12>"
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_validation_report.py --check     # the committed report still matches
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --profile HPC
```

The order is fixed by what each step reads. G9-07's tests compare the committed
report with a fresh render, so the report is committed before G9-07 is
recorded, and the recorder refuses the uncommitted documents otherwise. The
report shows G9-07 as its own gate (`SELF`) without a run or a judgement, so
recording G9-07 does not change the report it has just checked; the judge,
not the report, gives G9-07's verdict.

`build_validation_report.py` writes `docs/VALIDATION_REPORT.md` and the
verification cells and stage-status block of `docs/RELEASE_SCOPE.md` from the
gate file, the evidence runs and the records, and prints its consistency
checks (version strings, README numbers, the notices and SBOM check of step 2,
the scope cells); a MISMATCH is a finding to fix at its source, never in the
report. The platform section lists, per platform record, the G4 evidence runs
recorded there.

The judge's exit status is the technical answer for the WORKSTATION profile:
`RESULT: all judged tasks pass` with exit 0 means every required task is
VERIFIED by evidence tied to this commit, no required test skipped, no
GPU-required skip, no stale hash and no external blocker. HPC stays
`NOT RELEASABLE` while the two-GPU blocker stands. Any other result names the
first failing reason per task. The judge's warnings (runs that predate their
commit, cases declared with their evidence, scope changes pending approval)
do not change the exit status; the report lists them, and the pending scope
changes need the owner's `scope_change_approval` in the gate file before the
candidate is called RC_READY.

## 7. What the result means

- Exit 0 of step 6 is `RC_READY` in the sense of section 11 of the program:
  the technical gates hold on this tree and this wheel. It is recorded in the
  handoff entry with the commit, the wheel hash and the run ids.
- `PUBLIC_RELEASE_AUTHORIZED` is a separate decision of the owner that no file
  in this repository grants; the open distribution questions (G9-03) are not
  closed by a passing judge.
- The validation report is an internal record of what was run. It is not an
  attestation by a third party and does not state that the solver is correct
  for problems outside the recorded fixtures.

## 8. Interim releases before 1.0.0

By the owner's decision of 2026-09-26, a release before 1.0.0 (0.17.0 and
later interim versions) follows a shorter procedure; the full
release-candidate round of steps 1 to 6 is run for 1.0.0. An interim release:

1. starts from a commit whose CI run is green, and sets the version of record
   as in step 1;
2. regenerates the notices and the SBOM (step 2) and builds and checks the
   wheel with `scripts/clean_install_check.py` (step 3);
3. runs the `gpu-nightly` suite on the RTX 3060 host from the checkout, with
   the GPU held exclusively, and requires no failure and no error;
4. renders the validation report and records G9-07 (step 6), without
   re-recording the other gates against the wheel.

Its gate evidence is therefore the evidence recorded at earlier commits, and
the judge may list tasks as STALE. The release notes say so, and give the
wheel's SHA-256, the `gpu-nightly` counts and the CI run.
