# Raw evidence runs

Every verification that is meant to count toward a gate task is recorded here
by `scripts/record_gate_evidence.py`, after the run and without rerunning
anything. The tool derives the run id, hashes the source tree and the test
files, captures the environment and hardware, parses the JUnit report and
writes the task's state into `docs/validation/completion_gates.json`.
`scripts/check_release_gates.py` reads these directories when judging.

## Layout

```
docs/validation/runs/
  README.md
  <run_id>/
    evidence.json     every required evidence field; null fields carry a reason in null_reasons
    junit.xml         byte-for-byte copy of the JUnit report that was passed in
```

`run_id` is `<UTC timestamp>-<task id>-<8 hex>`, for example
`20260921T135356Z-g1-03-45b82b2c`; the hex is the head of a SHA-256 over the
task, command, source commit and execution timestamp. Directories are never
reused or rewritten: a rerun is a new run id appended to the task's `evidence`
list, and the last entry is the one the judge reads. Large artifacts stay where
the run wrote them and are referenced by path, size and SHA-256 in
`artifact_paths_and_sha256`; the JUnit copy is the only file duplicated here.
The copied JUnit keeps pytest's `hostname` attribute; strip it from the report
before recording if the machine name must not be published, since the recorder
hashes the file it is given.

## Recording

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_detector_allocation.py --junitxml=D:/TorchFDTD/.local/tmp/junit_g1-03.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G1-03 `
  --command "D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_detector_allocation.py --junitxml=D:/TorchFDTD/.local/tmp/junit_g1-03.xml" `
  --junit D:/TorchFDTD/.local/tmp/junit_g1-03.xml --exit-code $LASTEXITCODE `
  --fixture docs/validation/cases/G1-03_quadrant_allocation_scaling.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G1-03
```

Pass `--exit-code` with the real exit status; without it the recorder derives
one from the report and says so in `exit_code_source`. `--dist` hashes the wheel
or source archive the run installed, `--artifact` references raw result files,
`--observed` attaches measured metrics, `--note` and `--scope` add text,
`--interpreter` records the environment of the interpreter that ran the command
(its Python, torch, CuPy and `fdtd` versions and where `fdtd` and `torchfdtd`
resolve for a process started in the checkout), and `--platform` writes the
host's platform id (a record under `../platforms/`).

## What the recorder refuses

The recorder ties a run to one commit, so it refuses two situations unless
told to record them with a stored reason:

- A JUnit report whose suite timestamp is earlier than the committer time of
  HEAD: the tests ran before the commit, on a tree that is not this commit.
  `--allow-precommit-junit "<reason>"` records it with
  `junit_started_before_commit: true` and the reason; the judge prints
  "run predates its commit" as a warning (and derives the same warning for
  older evidence from `execution_timestamp`). The release-candidate round of
  `scripts/rerecord_gates.py` runs after the commit by construction.
- A required test file, a `code_paths` entry, the fixture or the criteria file
  that is modified or untracked in git: the hashed source would not be the
  committed one. `--allow-dirty "<reason>"` records it with `dirty_allowed:
  true`, `dirty_guarded_paths` and the reason; the judge fails such evidence
  for the release judgement. Dirty paths outside those files (for example a
  scratch file) are still only listed in `dirty_source_manifest` and warned.

Two more facts are stored for the judge: `declared_before_run_verified`, true
when the case file's first commit (`git log --diff-filter=A`) is an ancestor of
the source commit and earlier than the suite timestamp (false is a warning,
not a failure, because the first cases were committed together with their
evidence), and `enumerated_required_tests`, the ids pytest collects for every
file-level `required_tests` entry, gathered with `pytest --collect-only` under
the command's interpreter and environment prefix, so a partial run
(`-k one_test`) of a required file is NOT_RUN and not VERIFIED.

## What the recorder decides

| Report | Task state written | Judge |
| --- | --- | --- |
| No failures or errors, exit code 0, no test named in the task's `required_tests` skipped or absent (an `optional platform check:` skip is allowed inside a file-level entry), every test collected for a file-level entry present, every test source resolved | VERIFIED | passes while the source commit is an ancestor of HEAD and the test, fixture, criteria and watched files are unchanged, the junit copy still matches its stored hash and restates evidence.json, and the run was not recorded with `--allow-dirty` |
| Any failure or error | FAILED | fails |
| A skip whose reason names CUDA, CuPy or a GPU and does not start with `optional platform check:` (G4-05: a GPU-required test that did not run), whether or not `required_tests` names it | FAILED, listed in `gpu_required_skips` | fails; evidence recorded before the field existed is classified from its skip reasons |
| A required test skipped or absent, a collected test of a required file skipped or absent (partial run), a nonzero exit code, an empty report or an unresolved test source | NOT_RUN, with the reason printed | fails |

`required_tests` entries are `tests/<file>.py`, `tests/<file>.py::<function>` or
one parametrized id; a function entry matches all of its parametrized
instances, so a CUDA instance that skips keeps the task NOT_RUN. The recorder
never touches the `blocker` field: an external blocker is cleared by hand when
the resource exists, and the judge fails while it is set.

The evidence of a run recorded on a dirty tree lists the modified and untracked
paths in `dirty_source_manifest` (the gate file and this directory excluded);
the judge reports it as a warning because such a run is not tied to one commit.
Evidence recorded before a later commit stays valid only while its test sources
are byte-identical and its commit is an ancestor of HEAD; `--allow-stale`
overrides that with a loud banner and is not a release judgement.

## Watched data files

A task whose required tests read files other than their own sources lists them
in the gate file as `watch_paths` (files or globs relative to the root, `**`
allowed). The recorder hashes every matched file into `watch_sha256`; the judge
marks the evidence STALE when a watched file changed or disappeared, when a
file now matches a pattern but was absent at recording, or when the task has
`watch_paths` and the evidence predates them. Outputs of the recording and
rendering cycle are never watched (the gate file, this directory, the G3
records the fixtures write, `RELEASE_SCOPE.md`,
`VALIDATION_REPORT.md`); watching them would make evidence stale by
construction.

## Judge checks beyond the recorder

The judge re-parses `<run_id>/junit.xml` and verifies its stored SHA-256, so an
evidence.json edited by hand (a failure removed, a test added) fails with
"evidence does not match its junit". It re-checks the enumerated tests of
file-level entries against that junit. It warns, without deciding, on: a run
that predates its commit, a case declared with or after its evidence, a dirty
tree at recording, a file-level entry recorded before enumeration existed, and
a scope change pending the owner's approval (a case declaring `supersedes`,
`superseded_by`, `revision_of`, `revises` or `replaces`, a
`difference_from_common_criterion` or `looser_than_program_thresholds` entry,
an `rtol`/`atol` above the loosest program threshold, or a threshold "declared
not applicable") while the task's `scope_change_approval` is null. The
validation report lists these warnings and approvals; the approval itself is
the owner's, recorded in the gate file, never set by a tool.
