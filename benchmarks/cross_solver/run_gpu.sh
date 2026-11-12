#!/usr/bin/env bash
# Run one GPU-side driver inside its comparison venv from the repository root (BeamZ has its own venv).
# Usage: run_gpu.sh <driver.py> [args...]
set -eu
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
WORKTREE=$(cd "$(dirname "$0")/../.." && pwd)
export XLA_PYTHON_CLIENT_PREALLOCATE=false
export JAX_PLATFORMS=cuda
export CUPY_CACHE_DIR=$ROOT/cupy-cache
export JAX_COMPILATION_CACHE_DIR=$ROOT/jax-cache
export PYTHONUNBUFFERED=1
mkdir -p "$ROOT/artifacts" "$ROOT/logs" "$CUPY_CACHE_DIR"
cd "$WORKTREE"
driver=$1; shift
VENV=$ROOT/venv
[ "$driver" = beamz_driver.py ] && VENV=$ROOT/venv-beamz
exec "$VENV/bin/python" "benchmarks/cross_solver/$driver" "$@"
