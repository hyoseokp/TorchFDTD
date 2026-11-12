#!/usr/bin/env bash
# Verify the two comparison environments and print every relevant version.
set -eu
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
export MAMBA_ROOT_PREFIX=$ROOT/micromamba
export XLA_PYTHON_CLIENT_PREALLOCATE=false
"$ROOT/venv/bin/python" - <<'PY'
import importlib.metadata as m, torch, jax, fdtdx, cupy, sys
print('python', sys.version.split()[0])
for k in ('torch','cupy-cuda12x','jax','jaxlib','jax-cuda12-plugin','jax-cuda12-pjrt','fdtdx','equinox','optax','numpy','scipy','psutil','torchfdtd','fdtd'):
    try: print(k, m.version(k))
    except m.PackageNotFoundError: print(k, 'MISSING')
print('torch.cuda.is_available', torch.cuda.is_available(), torch.cuda.get_device_name(0), 'cuda build', torch.version.cuda)
print('jax.devices', jax.devices())
print('cupy runtime', cupy.cuda.runtime.runtimeGetVersion())
PY
"$ROOT/venv-beamz/bin/python" - <<'PY'
import importlib.metadata as m, jax, beamz
for k in ('beamz', 'jax', 'jaxlib', 'jax-cuda12-plugin', 'jax-cuda12-pjrt', 'numpy', 'scipy'):
    print(k, m.version(k))
print('beamz jax.devices', jax.devices())
PY
"$ROOT/bin/micromamba" run -n meep python - <<'PY'
import meep as mp, numpy, scipy, sys
print('meep python', sys.version.split()[0], 'meep', mp.__version__, 'numpy', numpy.__version__, 'scipy', scipy.__version__)
print('meep mpi', mp.with_mpi(), 'count_processors', mp.count_processors())
PY
"$ROOT/bin/micromamba" run -n meep mpirun --version | head -2
