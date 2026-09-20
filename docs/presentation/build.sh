#!/usr/bin/env bash
# Build the PhotonWeave lab-meeting slides.
#
#   bash docs/presentation/build.sh            # figures + slides
#   bash docs/presentation/build.sh --slides   # slides only, reuse figures
#
# Requirements: XeLaTeX with beamer, metropolis, kotex and a Korean font
# (NanumBarunGothic or NanumGothic). Figures additionally need the Python
# environment that runs PhotonWeave on the CPU.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"

if [ "${1:-}" != "--slides" ]; then
  echo "== building figures (charts + real CPU simulations) =="
  (cd "$root" && python docs/presentation/make_figures.py)
fi

echo "== building slides =="
cd "$here"
xelatex -interaction=nonstopmode -halt-on-error photonweave-lab-meeting.tex >/dev/null
xelatex -interaction=nonstopmode -halt-on-error photonweave-lab-meeting.tex >/dev/null
echo "wrote $here/photonweave-lab-meeting.pdf"
