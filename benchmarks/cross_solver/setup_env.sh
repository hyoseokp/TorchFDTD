#!/usr/bin/env bash
# Build the isolated comparison environments under $TORCHFDTD_BENCH_ROOT (default ~/torchfdtd-bench).
# GPU venv: Python 3.12 (from micromamba), torch cu128, cupy, jax[cuda12], fdtdx, torchfdtd.
# BeamZ venv: the PyPI release of BeamZ with its own jax[cuda12] (it needs a newer jax than fdtdx).
# CPU env: micromamba environment "meep" with conda-forge pymeep (MPI build preferred).
set -euo pipefail
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
WORKTREE=$(cd "$(dirname "$0")/../.." && pwd)
export PIP_CACHE_DIR=$ROOT/pip-cache
export MAMBA_ROOT_PREFIX=$ROOT/micromamba
export TMPDIR=$ROOT/tmp
mkdir -p "$ROOT" "$PIP_CACHE_DIR" "$MAMBA_ROOT_PREFIX" "$ROOT/logs" "$TMPDIR"
cd "$ROOT"
if [ ! -x "$ROOT/bin/micromamba" ]; then
  mkdir -p "$ROOT/bin"
  curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xj -C "$ROOT" bin/micromamba
fi
MM="$ROOT/bin/micromamba"
"$MM" --version
if [ ! -x "$MAMBA_ROOT_PREFIX/envs/py312/bin/python" ]; then
  "$MM" create -y -n py312 -c conda-forge python=3.12 pip
fi
PY312="$MAMBA_ROOT_PREFIX/envs/py312/bin/python"
"$PY312" --version
if [ ! -x "$ROOT/venv/bin/python" ]; then
  "$PY312" -m venv "$ROOT/venv"
fi
VPY="$ROOT/venv/bin/python"
"$VPY" -m pip install --upgrade pip wheel setuptools
"$VPY" -m pip install torch --index-url https://download.pytorch.org/whl/cu128
"$VPY" -m pip install "cupy-cuda12x" "jax[cuda12]" fdtdx equinox optax numpy scipy psutil
"$VPY" -m pip install --no-build-isolation "$WORKTREE"
"$VPY" -m pip freeze > "$ROOT/venv-freeze.txt"
if [ ! -x "$ROOT/venv-beamz/bin/python" ]; then
  "$PY312" -m venv "$ROOT/venv-beamz"
fi
"$ROOT/venv-beamz/bin/python" -m pip install --upgrade pip
"$ROOT/venv-beamz/bin/python" -m pip install "beamz==0.6.2" "jax[cuda12]" numpy scipy
"$ROOT/venv-beamz/bin/python" -m pip freeze > "$ROOT/venv-beamz-freeze.txt"
if [ ! -x "$MAMBA_ROOT_PREFIX/envs/meep/bin/python" ]; then
  "$MM" create -y -n meep -c conda-forge 'pymeep=*=mpi_mpich_*' numpy scipy \
    || "$MM" create -y -n meep -c conda-forge pymeep numpy scipy
fi
"$MM" list -n meep > "$ROOT/meep-list.txt"
echo SETUP_DONE
