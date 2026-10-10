# GPU runner policy and test suites

This document declares the three test suites, which hosts run them, and the
rule that keeps untrusted code away from the lab GPU hosts.
`tests/test_gpu_runner_policy.py` checks the workflow file and this document;
`tests/test_suite_policy.py` checks the suite runner and the marker rules.

## The three suites

| Suite | Selection | Host | Launch | Skips |
| --- | --- | --- | --- | --- |
| `cpu-pr` | `-m "not cuda and not long"`, CUDA hidden with `CUDA_VISIBLE_DEVICES=-1` | GitHub-hosted Ubuntu, every push and pull request (`.github/workflows/test.yml`) | automatic | CUDA tests are deselected, not skipped; remaining skips are optional platform checks |
| `gpu-nightly` | `-m "not long" --gpu-required` | a lab GPU host, trusted commits only (a commit on `main` or a branch a maintainer has reviewed) | by hand: `python scripts/run_suite.py gpu-nightly --junitxml=<path>` | a skip whose reason names CUDA, CuPy or a GPU, or any skip of a `cuda`-marked test, is a failure; only `optional`-marked tests may skip |
| `release-full` | everything, `--gpu-required`, with `TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST=1` and `TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST=1` so the opt-in `long` tests run | an idle lab GPU host, release candidates only | by hand: `python scripts/run_suite.py release-full --junitxml=<path>` | as gpu-nightly |

`scripts/run_suite.py <suite> --dry-run` prints the exact pytest command and
environment without running anything. The GPU suites refuse to start when
`torch.cuda.is_available()` is false: a GPU suite without a GPU is a failure,
never a run full of skips.

Markers (`pyproject.toml`, `tests/conftest.py`):

- `cuda`: needs a CUDA device, and CuPy for the fused kernels. Applied
  explicitly or, for the existing inline-gated tests, at collection from the
  skip reason, a CUDA parameter value plus a gate idiom, or an unconditional
  gate call at the top of the test body. `tests/test_suite_policy.py` fixes
  these rules on synthetic tests; on 2026-09-22 the whole `cuda` selection
  skipped with CUDA hidden (603 skipped, 0 passed), so no CPU test is marked.
- `long`: opt-in isolated or long tests that only `release-full` enables.
- `optional`: mixed-platform checks whose skip is permitted in every suite:
  the two-GPU NCCL case, the Gloo transport cases and the licensed Lumerical
  round trip. Their skip reasons are prefixed `optional platform check:` in
  the JUnit report so the evidence recorder can tell them from a missing GPU.

## Gate evidence and skips

`scripts/record_gate_evidence.py` classifies every skipped test of a recorded
run. A skip whose reason names CUDA, CuPy or a GPU and is not an optional
platform check sets the task to FAILED, whether or not the task's
`required_tests` names the test, and `scripts/check_release_gates.py` rejects
such evidence (it also classifies older evidence from its recorded skip
reasons). A skipped required test of any other kind leaves the task NOT_RUN,
as before. `tests/test_release_gates.py` injects both cases.

## Untrusted code never runs on a lab GPU host

The lab GPU hosts (the RTX 3060 workstation and the RTX 5880 Ada workstation
listed in [PLATFORM_MATRIX.md](PLATFORM_MATRIX.md)) are personal research
machines that hold user data and other running work. Therefore:

1. Fork pull requests never execute on them. The GitHub workflow uses only
   GitHub-hosted runners and the `push`, `pull_request` and
   `workflow_dispatch` triggers; it declares no self-hosted runner and no
   trigger that would give a fork the repository's secrets.
   `tests/test_gpu_runner_policy.py` fails if either appears in the
   workflow file.
2. A GPU suite runs on a lab host only for a commit a maintainer has read.
   Approving a workflow run in the GitHub interface is not a review and does
   not substitute for host isolation.
3. The maintainer runs the reviewed commit like this, on the lab host:

   ```
   git -C D:/TorchFDTD fetch origin
   git worktree add D:/TorchFDTD/.local/worktrees/review-<hash> <hash>
   python -m venv D:/TorchFDTD/.local/venvs/review-<hash>
   D:/TorchFDTD/.local/venvs/review-<hash>/Scripts/python.exe -m pip install torch --index-url https://download.pytorch.org/whl/cu126
   D:/TorchFDTD/.local/venvs/review-<hash>/Scripts/python.exe -m pip install -e "D:/TorchFDTD/.local/worktrees/review-<hash>[dev,gds,cuda-kernels]"
   cd D:/TorchFDTD/.local/worktrees/review-<hash>
   set TMP=D:/TorchFDTD/.local/tmp
   set TEMP=D:/TorchFDTD/.local/tmp
   D:/TorchFDTD/.local/venvs/review-<hash>/Scripts/python.exe scripts/run_suite.py gpu-nightly --junitxml=D:/TorchFDTD/.local/tmp/junit/gpu-nightly-<hash>.xml
   ```

   Checkout is by commit hash, never by branch name, so what runs is what
   was reviewed. The virtual environment and the worktree live under
   `.local`, which is ignored by git and separate from the maintainer's
   working checkout.
4. The environment of that shell carries no credentials: no `GITHUB_TOKEN`,
   no SSH agent socket, no package-index tokens, no cloud keys, and the
   repository remote is read-only for that checkout. The tests need none of
   these. The host firewall stays as it is; the suites make no network
   requests beyond the package installation above, which is done before the
   suite and can be done from a wheel cache.
5. After the run the maintainer records the JUnit report with
   `scripts/record_gate_evidence.py` if it serves a gate task, then removes
   the worktree and the virtual environment:

   ```
   git -C D:/TorchFDTD worktree remove --force D:/TorchFDTD/.local/worktrees/review-<hash>
   rmdir /s /q D:\TorchFDTD\.local\venvs\review-<hash>
   ```

   Scratch output under `D:/TorchFDTD/.local/tmp` from that run is deleted
   as well, except the JUnit file that was recorded as evidence.
6. Nothing in this policy makes the lab host a trusted execution boundary
   for code the maintainer has not read. A future isolated runner (a
   dedicated machine or a container with no access to user data, with its
   own credentials and network policy) would be recorded here before any
   automatic GPU execution is enabled.
