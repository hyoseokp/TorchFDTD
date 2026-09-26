# TorchFDTD manuscript

`manuscript.tex` is the canonical editable source. Hyoseok Park is the sole
author. The manuscript has no acknowledgments. Preserve its academic style
and do not add em dashes or semicolons.

## Scientific scope

The manuscript is written as a software
paper: abstract, program summary, numerical method, discrete adjoint,
execution modes, software structure with two usage listings, validation,
performance and conclusion. It evaluates GPU-resident and host-DRAM-streamed
discrete-adjoint execution with matched memory/time comparisons and a
completed propagated optical-objective evaluation. No SSD tier, file-backed
capacity test or durable-restart result is included. Independent lateral
tiles are approximate, unlike causal slab streaming. The colour-router
cross-check against TORCWA (docs/validation/color-router-rcwa-3060.json)
cites the related arXiv preprint and reports summary numbers only, without
the design pattern. Its drivers are in benchmarks/color_router_rcwa and run
against the published mask and model of that preprint.

## Timing platform

The performance section reports an NVIDIA A100 80GB PCIe in a four-core
container (records `docs/validation/*-a100.json`, produced by
`benchmarks/a100_paper`). The build scripts read an `-a100` record when it
exists and fall back to the original record otherwise, and every generated
caption names the GPU of the record it was built from. The earlier RTX 5880
records stay in place and are cited once, for the eight-core workstation
cost of host streaming. The cross-solver comparison and the pillar-array
example remain on the RTX 3060.

## Standalone compilation

With TeX Live or MiKTeX, run in this directory:

```sh
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
bibtex manuscript
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
pdflatex -interaction=nonstopmode -halt-on-error -no-shell-escape manuscript.tex
```

The figure PDFs and table sources are sufficient for typesetting. CUDA
and the simulator are not needed. Select manuscript.tex as the main
document in Overleaf. pdfLaTeX, XeLaTeX and LuaLaTeX all compile it.

## Repository build

From the repository root, with NumPy and Matplotlib available:

```sh
python scripts/build_paper.py
```

This regenerates the original measured assets and four added story figures,
then compiles the manuscript. No simulation runs. Use `--keep-assets` to
compile the existing figures and tables unchanged. Do not hand-edit generated
tables or fabricate replacement measurement records.

Outputs are docs/paper/torchfdtd-manuscript.pdf,
output/pdf/torchfdtd-manuscript.pdf, output/torchfdtd-latex-source.zip and
output/torchfdtd-arxiv.zip. Temporary TeX files remain in tmp/latex.

## arXiv submission

output/torchfdtd-arxiv.zip is the submission bundle: manuscript.tex,
references.bib, the compiled manuscript.bbl (arXiv does not run BibTeX),
the figure PDFs, the table sources and an anc/ directory with the validation records behind every
figure and table, the provenance manifests and the story-figure generator.
The bundle compiles standalone with pdfLaTeX, the arXiv default, and the
Latin Modern fonts of TeX Live. manuscript.tex is the only file with a
documentclass, so arXiv detects it as the top-level file. Upload the ZIP as is.

## Figure provenance

`asset-provenance.json` covers the original tables and figures.
`story-figure-provenance.json` records inputs and hashes for:

- execution-overview.pdf, a method schematic
- memory-cost.pdf, matched GPU-resident and host-DRAM-streamed adjoints (two panels)
- exterior-propagation.pdf, angular-spectrum propagation against a long FDTD domain
- tiling-overlap.pdf, error and cell overhead of independent lateral tiles (appendix)
- dispersive-slabs.pdf, Drude and Lorentz slabs against the transfer matrix
- microring-meep.pdf, a microring against Meep with recorded field maps
- metalens-meep.pdf, a three-dimensional pillar lens against Meep
- grid-scaling.pdf, forward and adjoint time and memory against grid size
- metagrating-design.pdf, a complete metagrating design with recorded field maps
- propagated-adjoint.pdf, a completed fixed-array optical derivative

`scripts/build_paper_story_figures.py` generates these figures.
The script runs no solver. It reads recorded JSON data and, for the field
maps, NPZ arrays that the drivers under `.local/paper_review` and
`examples/meep_comparison` saved beside their records.
Its copy in the curated arXiv archive also runs against the included records.

## Checks before public release

The build rejects unresolved references, overfull boxes and forbidden
punctuation. Rendered pages must also be inspected. The author must approve
the numerical claims, attribution and final text, choose the manuscript
licence and inspect the submission server's PDF. Compilation is not
scientific certification or a journal acceptance decision.

Typography
The manuscript is set in Latin Modern (the Computer Modern family of a
default LaTeX article) for text and mathematics. pdfLaTeX uses the Type 1
fonts of the lmodern package, and XeLaTeX or LuaLaTeX the OpenType fonts
through fontspec and unicode-math, all shipped with TeX Live and MiKTeX. Figure labels use Arial, and the vector figure PDFs embed their
font subsets, so no system font is needed to compile. Regenerating the
figures does require an Arial installation.
See https://info.arxiv.org/help/faq/texlive.html for engine/font requirements.
