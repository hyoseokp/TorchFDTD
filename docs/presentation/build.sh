#!/usr/bin/env bash
# Build the PhotonWeave lab-meeting slides.
#
#   bash docs/presentation/build.sh            # figures + both decks
#   bash docs/presentation/build.sh --slides   # decks only, reuse figures
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

cd "$here"
for deck in photonweave-lab-meeting-20min photonweave-lab-meeting; do
  echo "== building $deck =="
  xelatex -interaction=nonstopmode -halt-on-error "$deck.tex" >/dev/null
  xelatex -interaction=nonstopmode -halt-on-error "$deck.tex" >/dev/null
  echo "wrote $here/$deck.pdf"
done
