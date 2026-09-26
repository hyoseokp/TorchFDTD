# TorchFDTD internal validation report

Internal validation report of the completion program ([COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md)), rendered by `scripts/build_validation_report.py` from the machine outputs named in each section: the gate file and its evidence runs, the platform, clean-install, physics, cross-solver and Meep comparison records, the suite policy in `scripts/run_suite.py`, the version strings, and the known-limitations list (a hand-maintained JSON whose entries cite their records). No number here is typed into this file; `tests/test_validation_report.py` renders it again and compares. It records what was run and what those runs produced. It is not an attestation by a third party, and a passing gate is evidence for that gate only, never a general statement that the solver is correct for every problem.

Package version `0.17.1` (pyproject.toml). Gate file adopted at commit `f3efd3409aaa` with 83 tasks in 11 stages; newest evidence run `20260926T195655Z-g4-06-bc7aad7f` recorded 2026-09-26T19:56:55+00:00 at commit `675bcde226d2`.

Release rule of the gate file: `all_required_tasks_verified=True`, `required_skips_allowed=False`, `missing_or_stale_evidence_allowed=False`, `unresolved_required_external_blockers_allowed=False`, `unresolved_P0_P1_defects_allowed=False`, `source_and_release_artifact_identity_required=True`, `public_release_separately_authorized=True`, `machine_gate_does_not_replace_independent_review=True`.
Technical readiness of a release candidate (every required task VERIFIED with evidence that matches the candidate) and authorization of a public release are separate decisions; this report can only inform the first, and the second is not given by any file in this repository.

## Release judgement by profile

| Profile | Required stages | Scope status | Pass | Fail | Optional | FAILED outside the profile | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WORKSTATION | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 59 | 17 | 0 | none | NOT RELEASABLE |
| HPC | G0, G1, G2, G3, G4, G5, G6, G7, G8, G9, H1 | DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS | 59 | 23 | 0 | none | NOT RELEASABLE |

A task passes when it is VERIFIED by an evidence run whose source commit is an ancestor of the current commit and whose test sources, fixture and criteria files are unchanged, with no failed, errored, skipped or absent required test and no external blocker; stale evidence is a failure here, as in `scripts/check_release_gates.py` without `--allow-stale`.

## Gate tasks by stage

One row per task of [validation/completion_gates.json](validation/completion_gates.json): the recorded implementation and verification states, the newest evidence run and its source commit, and the judgement of that evidence against the current tree.

### G0 기준선·범위·증거 체계 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G0-01 | 실제 HEAD/dirty tree/기존 계획/자원·권한 확인 | IMPLEMENTED | VERIFIED | `20260925T152831Z-g0-01-32e611df` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G0-02 | RELEASE_SCOPE와 기능·검증 상태 분리 | IMPLEMENTED | VERIFIED | `20260925T152840Z-g0-02-fc8c6833` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G0-03 | 기존 완료 계획·gate·fixture·raw evidence 단일 추적 | IMPLEMENTED | VERIFIED | `20260925T152847Z-g0-03-b285b07c` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G0-04 | 필수 누락/실패/skip/source 불일치에서 출고 실패 판정기 | IMPLEMENTED | VERIFIED | `20260925T152947Z-g0-04-ff462c40` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G0-05 | 판정기 자체 failure injection과 세션 인계 구조 | IMPLEMENTED | VERIFIED | `20260925T153048Z-g0-05-d3d746e0` | `2c5f3754c047` | PASS | evidence matches the current checkout |

### G1 과거 리뷰 회귀 및 수정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1-01 | 자동 graded mesh와 미분 평면 모델의 격자 불일치. | IMPLEMENTED | VERIFIED | `20260925T153120Z-g1-01-46c3d71c` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G1-02 | reference signature의 실제 격자 누락. | IMPLEMENTED | VERIFIED | `20260925T153149Z-g1-02-3955ab3e` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G1-03 | quadrant_intensity_allocation의 FP32 불안정. | IMPLEMENTED | VERIFIED | `20260925T153209Z-g1-03-979fa1dc` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G1-04 | restart 코드 호환성 검사 누락. | IMPLEMENTED | VERIFIED | `20260925T153623Z-g1-04-913aac0b` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G1-05 | journal 저장공간 산정. | IMPLEMENTED | VERIFIED | `20260925T154054Z-g1-05-db0ca6c4` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G1-06 | 문서/실행 경로 일치. | IMPLEMENTED | VERIFIED | `20260925T214433Z-g1-06-0559a2e3` | `70c7bd788fa6` | FAIL | STALE: watched file changed since the run: README.md |

### G2 물리·격자·실행 계약 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G2-01 | 기존 구조를 활용하여 immutable resolved/compiled simulation plan을 만든다 | IMPLEMENTED | VERIFIED | `20260925T154120Z-g2-01-2c0e1af8` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G2-02 | forward/adjoint/streamed/tensor batch/GUI가 서로 다른 규칙으로 물리 입력을 다시 해석하지 않도록 한다 | IMPLEMENTED | VERIFIED | `20260925T154132Z-g2-02-d83b965e` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G2-03 | capability registry를 만들고 dimensions × mesh × materials × boundaries × sources × monitors × forward/backward × resident/streamed × precision/backend의 유효 조합을 명시한다 | IMPLEMENTED | VERIFIED | `20260925T154234Z-g2-03-86639748` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G2-04 | 전수 조합 대신 위험 기반 pairwise 검사와 고위험 3~4개 기능 조합을 설계한다 | IMPLEMENTED | VERIFIED | `20260925T154351Z-g2-04-3df6ab34` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G2-05 | "+/- DFT", Bloch spatial phase, E/H half-step, normal/outward direction, reduced units vs SI calibration, lossy exterior, 2D 단위길이 전력을 공개 specification과 테스트로 고정한다. | IMPLEMENTED | VERIFIED | `20260925T154402Z-g2-05-40c9ac1b` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G2-06 | cache/reference/restart마다 필요한 동일성 조건을 분리한다 | IMPLEMENTED | VERIFIED | `20260925T154434Z-g2-06-febe46ed` | `2c5f3754c047` | PASS | evidence matches the current checkout |

### G3 독립 물리·gradient 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G3-01 | 균일 매질 2D/3D 전파·위상·분산 | IMPLEMENTED | VERIFIED | `20260925T155003Z-g3-01-0e4faa11` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G3-02 | 유전체 slab normal/oblique TE/TM과 TMM | IMPLEMENTED | VERIFIED | `20260925T155453Z-g3-02-348033c1` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G3-03 | Drude/Lorentz slab fit/ADE 오차 분리 | IMPLEMENTED | VERIFIED | `20260925T155556Z-g3-03-2d6718f7` | `2c5f3754c047` | PASS | evidence matches the current checkout |
| G3-04 | dielectric cylinder/sphere Mie 산란 | IMPLEMENTED | VERIFIED | `20260925T161237Z-g3-04-e349627f` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-05 | 금속/분산 곡면 산란·흡수 수렴 | IMPLEMENTED | VERIFIED | `20260926T125324Z-g3-05-5008244d` | `a8124a771d9e` | PASS | evidence was recorded on a dirty tree (1 paths); it is not tied to commit a8124a771d9e alone |
| G3-06 | PEC/PMC cavity·symmetry와 gradient mapping | IMPLEMENTED | VERIFIED | `20260925T172508Z-g3-06-4f792935` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-07 | PML normal/oblique 반사·장시간 안정성 | IMPLEMENTED | VERIFIED | `20260925T172613Z-g3-07-f4fdc0c6` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-08 | Bloch grating·회절과 독립 RCWA | IMPLEMENTED | VERIFIED | `20260925T175618Z-g3-08-ad1182cd` | `2c5f3754c047` | FAIL | STALE: test source changed since the run: tests/test_physics_g3_b_r2.py |
| G3-09 | mode neff·field·confinement·power oracle | IMPLEMENTED | VERIFIED | `20260925T175629Z-g3-09-b83f2635` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-10 | PIC S·수동성·상반성과 누락 방사 채널 | IMPLEMENTED | VERIFIED | `20260925T180000Z-g3-10-7adda5e8` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-11 | dipole far/near field와 표면/격자 수렴 | IMPLEMENTED | VERIFIED | `20260925T180016Z-g3-11-753e7ab7` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-12 | tensor slab 및 tensor gradient | IMPLEMENTED | VERIFIED | `20260925T180304Z-g3-12-01ae90bc` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-13 | 곡면 grid offset/mesh/smoothing 폭 물리 수렴 | IMPLEMENTED | VERIFIED | `20260925T180712Z-g3-13-f2220d44` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-14 | 무차원 small discrete CPU/Torch/CUDA/VJP 수치 비교 | IMPLEMENTED | VERIFIED | `20260925T180814Z-g3-14-4e944236` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-15 | full-autograd·directional VJP·FD sweep·Taylor 검사 | IMPLEMENTED | VERIFIED | `20260925T180857Z-g3-15-38db1a43` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-16 | 실제 shape/material 파라미터의 물리 gradient 수렴 | IMPLEMENTED | VERIFIED | `20260925T180940Z-g3-16-7595c18d` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-17 | oracle 독립성·정밀도·시간·PML 오차 budget 확인 | IMPLEMENTED | VERIFIED | `20260925T180946Z-g3-17-339f39b7` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: docs/ORACLE_BUDGET.md |

### G4 CUDA·CI·환경 검증 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G4-01 | 보유한 실제 GPU와 OS·driver·runtime부터 확인한다 | IMPLEMENTED | VERIFIED | `20260925T181003Z-g4-01-34391cbe` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-02 | torch/fused, CUDA graph on/off, fused/reference monitor, FP32/FP64, real/complex, standard/nondefault stream의 valid 경로를 비교한다. | IMPLEMENTED | VERIFIED | `20260925T181033Z-g4-02-2a8fcb7a` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-03 | noncontiguous tensors, duplicate observers, multiple calls/backward, input lifetime, stream synchronization, cancellation, allocator cleanup을 검사한다 | IMPLEMENTED | VERIFIED | `20260925T181052Z-g4-03-bcf97791` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-04 | 최소 격자·홀수 크기·부분 slab·비정렬 tile·index boundary·강한 material contrast·ADE/CPML memory를 무작위/경계 fixture에 포함한다 | IMPLEMENTED | VERIFIED | `20260925T181122Z-g4-04-63d67c63` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-05 | CPU PR suite, 신뢰한 코드의 GPU 정기 suite, 실제 release의 전체 GPU suite를 분리한다 | IMPLEMENTED | VERIFIED | `20260925T181227Z-g4-05-b38e7dd0` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: pyproject.toml |
| G4-06 | public fork PR의 untrusted code를 개인/연구실 GPU host에서 자동 실행하지 않는다 | IMPLEMENTED | VERIFIED | `20260926T195655Z-g4-06-bc7aad7f` | `675bcde226d2` | PASS | evidence matches the current checkout |

### G5 메모리·재시작·장기 안정성 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G5-01 | resident/host/disk/async 경로를 같은 물리 문제·관측자·목적함수에서 비교한다 | IMPLEMENTED | VERIFIED | `20260925T181430Z-g5-01-b18d9585` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-02 | peak Torch allocated/reserved, CUDA 전체 process memory(가용한 계측 사용), RSS/PSS 또는 플랫폼 동등량, committed memory, OS cache, 디스크 사용량·총 읽기/쓰기·실효 대역폭을 구분한다 | IMPLEMENTED | VERIFIED | `20260925T181444Z-g5-02-bf6b6450` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-03 | planner의 byte admission과 실제 peak를 맞추고 원자적 동시 reservation 또는 동등 admission으로 여러 작업이 각각 free memory를 보고 동시에 초과하는 문제를 다룬다 | IMPLEMENTED | VERIFIED | `20260925T181502Z-g5-03-68e4ef53` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-04 | 전체 3D epsilon/VJP를 만들지 않는 geometry/density slab 생성·gradient 축약 경로를 공개 합성 구조로 시험한다 | IMPLEMENTED | VERIFIED | `20260925T181537Z-g5-04-c77ecb32` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-05 | meaningful beyond-VRAM 사례 하나를 추가한다 | IMPLEMENTED | VERIFIED | `20260925T181543Z-g5-05-83821e73` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-06 | 위 대규모 사례는 승인된 실행/디스크 쓰기 예산 안에서 수행한다 | IMPLEMENTED | VERIFIED | `20260925T181550Z-g5-06-f4068853` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-07 | forward 중단, backward 중단, process kill, simulated ENOSPC/OOM, read/write fault, truncate/checksum 오류, CUDA transfer failure, cancellation을 주입한다 | IMPLEMENTED | VERIFIED | `20260925T182026Z-g5-07-df4bcf0d` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-08 | checkpoint에 solver와 필요한 auxiliary states, optimizer state, scheduler/projection state, RNG, effective source, configuration fingerprint를 보존한다 | IMPLEMENTED | VERIFIED | `20260925T182219Z-g5-08-bcc4fbbd` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-09 | journal은 run별 소유권과 동시 writer 잠금을 갖는다 | IMPLEMENTED | VERIFIED | `20260925T182433Z-g5-09-f060976e` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-10 | 경량 fixture에서 1e5 steps, 반복 실행, 최소 100 optimizer updates 및 승인된 장시간 soak를 수행한다 | IMPLEMENTED | VERIFIED | `20260925T182439Z-g5-10-9758e548` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |

### G6 사용자 물리·역설계 API (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G6-01 | 재료 CSV/nk/epsilon import, passive fitting, 원자료 출처·사용권·해시, fit band, 시간 이산화에 따른 n/k 오차, extrapolation 경고를 하나의 workflow로 묶는다 | IMPLEMENTED | VERIFIED | `20260925T182450Z-g6-01-282c19ac` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-02 | source의 실제 공간 분포·위상·편광·시간 파형·유효 bandwidth를 preview한다 | IMPLEMENTED | VERIFIED | `20260925T182500Z-g6-02-23218c0b` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-03 | reference를 포함한 R/T/A, 복소 S, phase/group delay, mode decomposition, diffraction, far-field/near-zone을 기존 결과와 통합한다 | IMPLEMENTED | VERIFIED | `20260925T182532Z-g6-03-68af24a9` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-04 | 포트별 mode tracking, normalization, reference plane, forward/backward separation과 퇴화/약한 모드 진단을 제공한다 | IMPLEMENTED | VERIFIED | `20260925T182538Z-g6-04-87af450e` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-05 | 기존 design/periodic/mode-network API를 재사용해 objective→parameterization→optimizer→history→resume→final evaluation의 최소 고수준 인터페이스를 통합한다 | IMPLEMENTED | VERIFIED | `20260925T182701Z-g6-05-7ef3e1df` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-06 | density filter, projection, beta continuation, symmetry, mask, min linewidth/gap, fabrication perturbation, binary export를 실제 검사와 연결한다 | IMPLEMENTED | VERIFIED | `20260925T182824Z-g6-06-c85a9f8a` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-07 | export된 binary/GDS 구조를 다시 import하여 독립 finer forward로 평가한다 | IMPLEMENTED | VERIFIED | `20260925T184831Z-g6-07-041c7db3` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-08 | low-intensity/near-zero reference/frequency cutoff/evanescent/backflow에서 NaN·음의 국소 flux·invalid phase를 임의 clipping으로 숨기지 않는다 | IMPLEMENTED | VERIFIED | `20260925T184840Z-g6-08-4bc4d0b5` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |

### G7 대표 응용·동일 정확도 비용 (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G7-01 | 공개 metagrating/meta-atom 전체 workflow | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G7-02 | 소형 유한 metalens의 실제 propagation·PSF·최종 재평가 | IMPLEMENTED | VERIFIED | `20260926T044250Z-g7-02-f08ed130` | `4e8a03ed8079` | PASS | evidence matches the current checkout |
| G7-03 | 수동 PIC 역설계·복수 초기화·제작 제약·GDS 재평가 | IMPLEMENTED | VERIFIED | `20260925T185002Z-g7-03-353beb5b` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G7-04 | 동일 정확도 독립 solver 교차 검증 및 공정 비교 | IMPLEMENTED | VERIFIED | `20260925T185015Z-g7-04-0621a753` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G7-05 | cold/warm·전체 iteration·streaming·tuning 비용과 반복 변동 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |

### G8 저장·GUI·clean 설치 (WORKSTATION, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G8-01 | 기존 Project JSON/NPZ compatibility와 schema migration을 시험한다 | IMPLEMENTED | VERIFIED | `20260925T185027Z-g8-01-cfa5ea5b` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-02 | 큰 결과의 chunked/lazy read가 필요하면 HDF5 또는 Zarr 중 요구에 맞는 한 구현을 우선 채택한다 | IMPLEMENTED | VERIFIED | `20260925T185039Z-g8-02-5f7ca728` | `2c5f3754c047` | PASS | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-03 | GUI의 CAD/GDS → material/source/boundary → 실제 mesh preview → resource preflight → job queue → cancel/resume → 결과 overlay → 데이터/GDS export 경로를 E2E로 시험한다. | IMPLEMENTED | VERIFIED | `20260925T185045Z-g8-03-8a90df49` | `2c5f3754c047` | FAIL | STALE: watched file missing: torchfdtd/web/assets/index-BMhgsHC5.js |
| G8-04 | geometry 편집의 undo/redo, copy/multiselect, autosave/recovery, versioned project, 구조/parameter 단위 검증과 결과 stale 표시를 구현/확인한다 | IMPLEMENTED | VERIFIED | `20260925T185055Z-g8-04-a14fd673` | `2c5f3754c047` | FAIL | STALE: watched file missing: torchfdtd/web/assets/index-BMhgsHC5.js |
| G8-05 | 최종 wheel에 frontend 정적 자산을 포함하고 최종 사용자가 Node/npm이나 저장소 checkout 없이 UI를 실행하도록 한다 | IMPLEMENTED | VERIFIED | `20260925T185103Z-g8-05-0ad59cae` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: README.md |
| G8-06 | 지원 Python/Torch/CuPy/runtime 최소·최대 버전을 실제 설치 시험으로 확정한다 | IMPLEMENTED | VERIFIED | `20260925T185114Z-g8-06-b9837806` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: README.md |
| G8-07 | README의 모든 기본 예제를 installed wheel에서 실행한다 | IMPLEMENTED | VERIFIED | `20260925T185122Z-g8-07-9666971b` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: README.md |

### G9 보안·운영·출고 판정 (WORKSTATION, P0)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G9-01 | local server의 loopback 기본값, origin/host 검증, 허용된 파일 경로, 업로드 크기, path traversal, 악성/손상 JSON/NPZ/GDS, 압축 폭탄과 unsafe pickle을 검사한다 | IMPLEMENTED | VERIFIED | `20260925T185140Z-g9-01-f668e584` | `2c5f3754c047` | FAIL | STALE: test source changed since the run: tests/test_server_security.py |
| G9-02 | 코드와 번들 데이터의 출처·license·third-party notices·SBOM·dependency/security scan을 수행한다 | IMPLEMENTED | VERIFIED | `20260925T185202Z-g9-02-c3f5ecdd` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: docs/THIRD_PARTY_NOTICES.md |
| G9-03 | RELEASE_REVIEW의 미해결 계약/배포 질문을 실제 문서에 따라 추적한다 | IMPLEMENTED | VERIFIED | `20260925T214448Z-g9-03-cc9b3082` | `70c7bd788fa6` | FAIL | STALE: watched file changed since the run: README.md |
| G9-04 | API stability/deprecation, project/result/checkpoint version compatibility, changelog, 알려진 한계, bug template, minimal repro, numerical bug severity, release rollback/결과 영향 공지를 준비한다. | IMPLEMENTED | VERIFIED | `20260925T185220Z-g9-04-6cd780b0` | `2c5f3754c047` | FAIL | STALE: watched file changed since the run: docs/CHANGELOG.md |
| G9-05 | 독립 사용자 또는 독립 설치 환경에서 세 대표 workflow를 실행하고, 실제 발견 이슈를 정리한다 | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| G9-06 | 최종 release candidate의 정확한 source tree와 wheel에서 전체 필수 gate를 실행한다 | IN_PROGRESS | VERIFIED | `20260925T195834Z-g9-06-621431b7` | `2d7cc517b07c` | FAIL | STALE: test source changed since the run: tests/test_gpu_runner_policy.py |
| G9-07 | validation report를 기계 산출물에서 생성한다 | IMPLEMENTED | SELF | none | none | self | this report's own gate, recorded after the render; judge it with scripts/check_release_gates.py |

### H1 실제 단일 문제 multi-GPU (HPC, P1)

| Task | Title | Implementation | Verification | Newest run | Source commit | Judgement | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H1-01 | rank-owned domain decomposition과 source/monitor/CPML/Bloch/ADE 지원 범위를 명시하고 global/local indexing과 halo ownership을 고정한다. | NOT_ASSESSED | NOT_RUN | none | none | FAIL | verification_state is NOT_RUN |
| H1-02 | 실제 2-GPU 이상에서 forward와 재료 VJP를 single-GPU 기준과 대조한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-03 | unequal slabs, partial tiles, rank 경계의 source/monitor/material, duplicate observations, halo transpose, complex fields와 checkpoint replay를 검사한다. | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-04 | strong/weak scaling의 문제 크기·GPU·interconnect·호스트 topology·통신/계산 overlap과 peak memory를 보고한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-05 | timeout/rank failure/cancellation의 collective 정리와 재시작 정책을 시험한다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |
| H1-06 | 예컨대 특정 큰 fixture의 2~4 GPU 효율 70%는 사전 합의한 성능 목표로 둘 수 있지만 하드웨어와 문제에 독립적인 보편 합격 기준으로 강요하지 않는다 | NOT_ASSESSED | BLOCKED_EXTERNAL | none | none | FAIL | external blocker unresolved: BLOCKED_EXTERNAL: no host with two or more NVIDIA GPUs is available to this program (local RTX 3060 x1, remote RTX 5880 Ada x1). The NCCL two-rank case in tests/test_domain_decomposition.py skips on both. CPU Gloo ranks do not count as multi-GPU verification. |

## Platform records

Every record written by `scripts/platform_report.py` under `docs/validation/platforms/`; a platform without a record is not listed, as in [PLATFORM_MATRIX.md](PLATFORM_MATRIX.md). The evidence rows name, per platform, the newest G4 evidence run of each task that was recorded there (by the `platform_id` the recorder writes with `--platform`, or, for older evidence, by the GPU names of the run equalling those of exactly one record) and count the other tasks whose newest run was recorded there.

| Platform id | GPU | Driver | CUDA runtime | torch | CuPy | Python | OS | Recorded |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rtx3060-win11-lab | NVIDIA GeForce RTX 3060 (cc 8.6, 12287 MiB) | 591.86 | 12.6 | 2.10.0+cu126 | 13.6.0 | 3.10.2 | Windows-10-10.0.26200-SP0 | 2026-09-21T15:53:07+00:00 |
| rtx3060-wsl2-ubuntu2204 | NVIDIA GeForce RTX 3060 (cc 8.6, 12287 MiB) | 591.86 | 12.8 | 2.11.0+cu128 | 13.6.0 | 3.12.14 | Linux-5.15.167.4-microsoft-standard-WSL2-x86_64-with-glibc2.35 | 2026-09-25T06:23:47+00:00 |
| rtx5880-ada-win11-remote | NVIDIA RTX 5880 Ada Generation (cc 8.9, 49139 MiB) | 581.80 | 12.8 | 2.10.0 | 13.6.0 | 3.11.14 | Windows-10-10.0.26100-SP0 | 2026-09-21T19:27:38+00:00 |

| Platform id | G4 evidence runs recorded on this platform | Other tasks whose newest run was recorded here |
| --- | --- | --- |
| rtx3060-win11-lab | G4-01 `20260925T181003Z-g4-01-34391cbe` (platform_id); G4-02 `20260925T181033Z-g4-02-2a8fcb7a` (platform_id); G4-03 `20260925T181052Z-g4-03-bcf97791` (platform_id); G4-04 `20260925T181122Z-g4-04-63d67c63` (platform_id); G4-05 `20260925T181227Z-g4-05-b38e7dd0` (platform_id); G4-06 `20260926T195655Z-g4-06-bc7aad7f` (platform_id) | 67 |
| rtx3060-wsl2-ubuntu2204 | none | 0 |
| rtx5880-ada-win11-remote | none | 0 |

Newest runs that match no platform record: none.

## Clean-install record

Newest record `20260926T071740Z-316b25ef.json` (kind `clean_install_record`), taken at commit `316b25ef5d93` on 2026-09-26T07:17:40+00:00 with 0 dirty packaging paths; all steps passed: yes.

Wheel `torchfdtd-0.17.1-py3-none-any.whl`, SHA-256 `5b1c7180fc1c48397e0d85872a35e389a655d4f974a65c6e505953a9f92e1ea3`, 994,824 bytes, 160 entries, 153 package files; browser assets match the committed ones: yes; frontend assets current: yes.

| Environment | Python | torch | cupy-cuda12x | numpy | torchfdtd | Packages |
| --- | --- | --- | --- | --- | --- | --- |
| g8-cpu | 3.10.2 | 2.14.0+cpu | absent | 2.2.6 | 0.17.1 | 40 |
| g8-cuda | 3.10.2 | 2.10.0+cu126 | 13.6.0 | 2.2.6 | 0.17.1 | 42 |

| Step | Status | Seconds |
| --- | --- | --- |
| build_wheel | passed | 7.93 |
| cpu_venv_create | passed | 10.68 |
| cpu_pip_install_torch | passed | 88.38 |
| cpu_pip_install_wheel | passed | 47.19 |
| cpu_package_list | passed | 0.81 |
| cpu_import_run_save_load | passed | 9.28 |
| cpu_server_index_assets_api | passed | 3.4 |
| cpu_doctor | passed | 2.8 |
| cuda_venv_create | passed | 11.32 |
| cuda_pip_install_torch | passed | 136.28 |
| cuda_pip_install_wheel_extras | passed | 55.12 |
| cuda_package_list | passed | 0.89 |
| cuda_fused_forward_run | passed | 16.6 |
| cuda_doctor | passed | 3.44 |
| readme_examples | passed | 12.55 |

## Suite policy

The three suites declared in `scripts/run_suite.py` and applied by `tests/conftest.py` (a skip whose reason names CUDA, CuPy or a GPU fails under `--gpu-required` unless the test carries the `optional` marker).

| Suite | Marker expression | `--gpu-required` | Needs CUDA | CUDA hidden | Environment |
| --- | --- | --- | --- | --- | --- |
| `cpu-pr` | `-m "not cuda and not long"` | no | no | yes | inherited |
| `gpu-nightly` | `-m "not long"` | yes | yes | no | inherited |
| `release-full` | none (every test) | yes | yes | no | `TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST=1`, `TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST=1` |

## Physics validation (stage G3)

One line per G3 task. Where `docs/validation/g3/<task>.json` exists, the criterion and the measured value are read from that record (limits from the record or from the pre-declared case under `docs/validation/cases/`) and the verdict is the comparison of the two; the full tables are in [PHYSICS_VALIDATION.md](PHYSICS_VALIDATION.md). Otherwise the newest evidence run supplies the test counts. A **FAIL** is a finding against a pre-declared limit and stays in the report.

| Task | Case | Record | Headline criterion | Measured | Verdict |
| --- | --- | --- | --- | --- | --- |
| G3-01 | Plane-wave propagation in vacuum and in a uniform n=1.5 dielectric, 2D and 3D, against the exact Yee dispersion relation and the continuum | `G3-01.json` | abs cos residual at most 1e-12 (part A, 32 eigenmode entries); abs(k - k_Yee) D at most 0.001 rad (part B, 24 runs) | 3.33e-16; 3.77e-07 rad | pass |
| G3-02 | Lossless dielectric slab, normal and oblique TE/TM, complex r and t against the in-test transfer matrix at 40 cells per material wavelength (revision 2 of G3-02_dielectric_slab_tmm) | `G3-02r2.json` | abs dR, abs dT at most 0.01, 0.01 and t phase at most 0.02 rad at 40 cells per material wavelength (24 instances); 20-cell over 40-cell error ratio between 3 and 5 (24 pairs) | 0.00928, 0.00927, 0.0133 rad; 24 of 24 within limits | pass |
| G3-03 | Drude and two-pole Lorentz slabs: complex R, T and absorption against TMM with the same analytic permittivity; fitting error and ADE time-discretization error separated | `G3-03.json` | abs dR, dT, dA at most 0.01 and t phase at most 0.02 rad for 8 analytic and 2 fitted slabs; ADE constitutive n, k error at most 0.001 | 0.00204, 0.0027, 0.000659, 0.00508 rad; ADE 0.000761 | pass |
| G3-04 | Closed-box TFSF scattering of a dielectric cylinder (2D, TM and TE) and a dielectric sphere (3D) against the Mie series | `G3-04.json` | integrated cross-section relative error at most 0.02 at the judged meshes (cylinder h = 0.0125 um TM and TE, sphere h = 0.05 um), CPU FP64 | cylinder TM 0.0174; cylinder TE 0.00373; sphere 0.00309; CUDA FP32 layer A max relative difference 2.08e-06 | pass |
| G3-05 | Drude metal sphere at three sizes below and near the plasmon resonance: scattering and absorption against Mie with a complex index, mesh sequence h, h/2, h/4 | `G3-05.json` | scattering and absorption relative error at h = 0.005 um, CPU FP64, within the case's per-radius budgets | r = 0.02 um: scattering 1.38 (budget 0.5), absorption 6.73 (budget 1); r = 0.035 um: scattering 0.458 (budget 0.3), absorption 4.99 (budget 0.6); r = 0.05 um: scattering 0.445 (budget 0.2), absorption 3.45 (budget 0.4) | **FAIL** |
| G3-06 | PEC/PMC cavity eigenfrequency, symmetry-reduced versus full domain, and gradient mapping | none (the test assertions are the record) | the pass/fail assertions of the required tests | 93 passed, 0 failed, 0 skipped in `20260925T172508Z-g3-06-4f792935` | VERIFIED |
| G3-07 | Default CPML reflection at normal and oblique incidence in vacuum and in n=2, next to a dielectric interface, and 20,000-step stability | `G3-07.json` | reflected/incident power at most 1e-06 at normal incidence, 0.0001 at the declared oblique angles and 0.0001 next to an n=2 interface; energy after 20,000 steps at most 1e-06 of the peak | 2.14e-09, 8.64e-10, 1.2e-05; 3.56e-16 | pass |
| G3-08 | Bloch-periodic binary dielectric grating: forward and backward diffraction efficiencies and phases against TORCWA at normal and 20-degree incidence, TE and TM, three wavelengths | `G3-08.json` | diffraction efficiency error at most 0.01 and dominant-order phase error at most 0.02 rad against TORCWA at 640 harmonics (12 judged configurations); CUDA FP32 layer A relative difference at most 0.0001 | 0.00306; 0.0143 rad; layer A 0.000115 (12 rows) | **FAIL** |
| G3-09 | Mode solver effective index, field, confinement and power against analytic slab and fiber oracles | none (the test assertions are the record) | the pass/fail assertions of the required tests | 32 passed, 0 failed, 0 skipped in `20260925T175629Z-g3-09-b83f2635` | VERIFIED |
| G3-10 | PIC mode-port networks: straight guide, discontinuity, Y branch and crossing S, reciprocity, passivity with the radiation defect measured | none (the test assertions are the record) | the pass/fail assertions of the required tests | 23 passed, 0 failed, 0 skipped in `20260925T180000Z-g3-10-7adda5e8` | VERIFIED |
| G3-11 | Dipole radiation: near-to-far and near-zone projection against analytic Hertzian fields, native far-field pattern convergence | none (the test assertions are the record) | the pass/fail assertions of the required tests | 56 passed, 0 failed, 0 skipped in `20260925T180016Z-g3-11-753e7ab7` | VERIFIED |
| G3-12 | Tensor dielectrics: eigenpolarization dispersion, birefringent slab transmission and tensor gradients | none (the test assertions are the record) | the pass/fail assertions of the required tests | 45 passed, 0 failed, 0 skipped in `20260925T180304Z-g3-12-01ae90bc` | VERIFIED |
| G3-13 | Curved-interface convergence on the G3-04 dielectric cylinder: mesh sequence with staircase and subpixel interfaces, sub-cell centre shifts and the differentiable-solid smoothing width | `G3-13.json` | subpixel max relative error below the staircase error at h = 0.05 um for TM and TE (the mesh sequence, shifts and smoothing widths are reported only) | TM: staircase 0.0383, subpixel 0.00997; TE: staircase 0.112, subpixel 0.0197 | pass |
| G3-14 | Small discrete problems: CPU torch, CUDA torch, fused CUDA, streamed and reversible forward and VJP agreement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 75 passed, 0 failed, 0 skipped in `20260925T180814Z-g3-14-4e944236` | VERIFIED |
| G3-15 | Full-autograd oracle, explicit adjoint, central-difference step sweep, Taylor remainder and directional VJP checks | none (the test assertions are the record) | the pass/fail assertions of the required tests | 34 passed, 0 failed, 0 skipped in `20260925T180857Z-g3-15-38db1a43` | VERIFIED |
| G3-16 | Physical shape and material parameter gradients: slab thickness and permittivity against the Airy derivative, polygon vertices under mesh refinement | none (the test assertions are the record) | the pass/fail assertions of the required tests | 19 passed, 0 failed, 0 skipped in `20260925T180940Z-g3-16-7595c18d` | VERIFIED |
| G3-17 | Oracle independence, precision floor, time-window and PML error budgets of every G3 fixture | none (the test assertions are the record) | the pass/fail assertions of the required tests | 4 passed, 0 failed, 0 skipped in `20260925T180946Z-g3-17-339f39b7` | VERIFIED |

## Cross-solver and Meep comparison headlines

Same-hardware comparison of 2026-09-22 on NVIDIA GeForce RTX 3060 12 GB (WSL2, driver from Windows) / 12th Gen Intel(R) Core(TM) i7-12700 ([CROSS_SOLVER_COMPARISON.md](CROSS_SOLVER_COMPARISON.md), record `cross_solver_3060.json`, drivers at worktree `fa57986a3c11`).

| Solver | Slab max abs T error | Slab max abs R error | Slab max abs R+T-1 | Mie sphere max relative error |
| --- | --- | --- | --- | --- |
| torchfdtd | 0.00153 | 0.00154 | 5.36e-06 | 0.0135 |
| fdtdx | 0.00154 | 0.00153 | 6.36e-06 | 0.0115 |
| meep | 0.00155 | 0.00153 | 1.49e-05 | 0.0115 |

| Throughput case | TorchFDTD median wall (s) | FDTDX (ratio) | Meep 12 ranks (ratio) |
| --- | --- | --- | --- |
| sphere-64 | 0.114 | 0.78 (6.8x) | 4.37 (38.3x) |
| sphere-96 | 0.31 | 2 (6.4x) | 13.6 (43.9x) |

| Adjoint solver | Median wall (s) | Ratio to TorchFDTD checkpointed | Gradient relative L2 vs TorchFDTD | Loss relative difference |
| --- | --- | --- | --- | --- |
| fdtdx_checkpointed | 5.27 | 51.5x | 7.06e-08 | 0 |
| fdtdx_reversible | 0.209 | 2.0x | 1.03e-07 | 0 |

Worked comparisons with Meep from the records under `docs/validation/meep_comparison/` ([MEEP_COMPARISON.md](MEEP_COMPARISON.md)):

| Device | Cells x steps | Agreement | Criteria passed | TorchFDTD stepping (s) | Meep stepping (s) | Ratio |
| --- | --- | --- | --- | --- | --- | --- |
| 2D microring resonator with a bus waveguide (Ez) | 469,500 x 89,219 | resonance wavelengths, max difference 5.6e-05 nm (limit 0.2 nm) | 5/5 | 31.4 | 217 (4 ranks, development) | 6.9 |
| 2D silicon ridge metalens (Ez) | 825,600 x 5,200 | focusing efficiency, difference 4.0e-06 (limit 0.01) | 4/4 | 1.57 | 13.3 (4 ranks, development) | 8.5 |
| 3D silicon pillar metalens (Ex) | 3,430,400 x 2,500 | focusing efficiency, difference 2.1e-06 (limit 0.01) | 5/5 | 6.06 | 129 (4 ranks, development) | 21.2 |
| 2D silicon metagrating on silica, with an RCWA oracle (Ez) | 18,200 x 12,000 | order efficiencies, max difference 2.0e-04 (limit 0.01) | 5/5 | 0.26 | 1.49 (4 ranks, development) | 5.7 |

## Known limitations

From [validation/known_limitations.json](validation/known_limitations.json); each entry names the record or document it comes from.

| Id | Limitation | Status | Gate tasks | Sources |
| --- | --- | --- | --- | --- |
| plasmonic-nanoparticle-staircase | Scattering and absorption of a staircased Drude metal sphere resolved by 4 to 10 cells per radius fail the case's own loose budgets at h = 0.005 um (scattering 1.376, 0.458 and 0.445 against budgets 0.5, 0.3 and 0.2; absorption 6.733, 4.985 and 3.446 against 1.0, 0.6 and 0.4 for radii 0.02, 0.035 and 0.05 um). Plasmonic nanoparticle cross sections are not a supported accuracy claim of the staircase material sampling. | FAILED gate, kept as a finding | G3-05 | `docs/validation/g3/G3-05.json`, `docs/validation/cases/G3-05_drude_sphere.json`, `docs/validation/runs/20260921T181951Z-g3-05-8fafa59e/evidence.json` |
| high-index-slab-resolution | At about 20 cells per material wavelength the n = 3.5 slabs exceed the 0.01 R/T and 0.02 rad phase limits (max abs dR 0.0128 to 0.0373, phase 0.0315 to 0.0539 rad) because of the second-order Yee phase error; the limits are met at about 40 cells per material wavelength (revision 2 of the case). Users of high-index structures need that resolution for 1 percent transmission accuracy. | resolution requirement of the staircase Yee scheme; first case FAILED and kept, revision-2 case VERIFIED | G3-02, G3-01 | `docs/validation/g3/G3-02.json`, `docs/validation/g3/G3-02r2.json`, `docs/PHYSICS_VALIDATION.md` |
| dispersive-media-in-pml | Drude/Lorentz pole cells inside a stretched CPML layer can diverge: a SiN or Drude post filling the outer five cells of a CPML corner grows by e^0.057 per step, in float64 and float32 alike, at a frequency in the pole's negative-permittivity band; a post entering the corner layers from the interior grows by e^0.10 per step, and a Drude bar crossing a layer by e^0.0011. This is an instability of the stretched-coordinate PML around negative-permittivity inclusions. Region.pml_dispersion = 'absorber' turns the faces that dispersive structures reach into an adiabatic absorber, which stays stable for 20,000 steps on those fixtures but reflects far more than the CPML: 0.17 at 60 deg through 40 layers, 0.016 to 1.2 per monitor where a transverse interface crosses it (G3-07 half space) and 5e-5 in a strongly dispersive fill. 'frozen' keeps the CPML, at the price of a permittivity step away from the source centre and no meaning for negative permittivity. The differentiable, plane-adjoint and streamed solvers reject both where they would change the run, the paths whose oscillators are parameter tensors reject both outright, and a soft sheet extended through an absorber face is refused. | documented limit of the 'ade' CPML and of the 'absorber' and 'frozen' remedies | none | `docs/BOUNDARIES.md`, `docs/validation/dispersive_pml_absorber.json`, `docs/validation/cases/DISPERSIVE_PML_ABSORBER.json` |
| grating-cuda-fp32-layer-a | One Bloch grating configuration (TM, 20 degrees, 0.92 um) exceeds the CUDA FP32 layer-A tolerance against CPU FP64 by 15 percent (relative difference 1.15e-4 against rtol 1e-4); the efficiency and phase agreement with TORCWA is within its limits. | FAILED gate, kept as a finding | G3-08 | `docs/validation/g3/G3-08.json`, `docs/validation/runs/20260921T181948Z-g3-08-6ccad85a/evidence.json` |
| multi-gpu | Single-problem multi-GPU forward, adjoint and scaling (the HPC profile, stage H1) cannot be verified: no host with two or more NVIDIA GPUs is available to the program. The domain decomposition is verified with two and three Linux CPU Gloo ranks only, which do not count as CUDA verification. | BLOCKED_EXTERNAL | H1-02, H1-03, H1-04, H1-05, H1-06 | `docs/validation/completion_gates.json`, `docs/RELEASE_SCOPE.md`, `docs/DOMAIN_DECOMPOSITION.md` |

## Evidence warnings

Every warning the judge attaches to a task; a warning never passes or fails a task by itself. The kinds: a run that started before its source commit was made (the tests ran on a tree that is not that commit), a case file first committed with or after its evidence (declaration order not verified), evidence recorded on a dirty tree, a file-level required test recorded before the recorder enumerated such files, and a scope change awaiting the owner (listed again below).

| Task | Warning |
| --- | --- |
| G3-04 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-05 | evidence was recorded on a dirty tree (1 paths); it is not tied to commit a8124a771d9e alone |
| G3-06 | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-07 | evidence was recorded on a dirty tree (2 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-08 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-09 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-10 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-11 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-12 | evidence was recorded on a dirty tree (4 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-13 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-14 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-15 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-16 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G3-17 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-01 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-02 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-03 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-04 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G4-05 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-01 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-02 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-03 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-04 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-05 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-06 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-07 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-08 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-09 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G5-10 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-01 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-02 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-03 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-04 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-05 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-06 | evidence was recorded on a dirty tree (5 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-07 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G6-08 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G7-03 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G7-04 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-01 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-02 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-03 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-04 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-05 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-06 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G8-07 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G9-01 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G9-02 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |
| G9-04 | evidence was recorded on a dirty tree (11 paths); it is not tied to commit 2c5f3754c047 alone |

## Pending owner approvals

Tasks whose case files declare a scope change (a revised case, or a limit looser than the program thresholds of the gate file) while `scope_change_approval` is still null. Section 0 of the program requires the owner's recorded approval for such changes; nothing here grants it, and the tasks keep their recorded states until it is given.

None: every declared scope change carries an approval.

### Approved scope changes

Declared scope changes with the owner's recorded approval (`scope_change_approval` in the gate file). An approval accepts the declared limits of that task; it does not change the program thresholds.

| Task | Declared change | Approval |
| --- | --- | --- |
| G3-02 | docs/validation/cases/G3-02_dielectric_slab_tmm.oracles.json declares superseded_by (a revised case); docs/validation/cases/G3-02r2_slab_tmm_40_cells.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G3-05 | docs/validation/cases/G3-05_drude_sphere.json acceptance/justification declares a program threshold not applicable; docs/validation/cases/G3-05r5_drude_sphere_subpixel.json declares supersedes (a revised case); docs/validation/cases/G3-05r5_drude_sphere_subpixel.json acceptance/justification declares a program threshold not applicable; docs/validation/cases/G3-05r5_drude_sphere_subpixel.json acceptance/source_of_limits declares a program threshold not applicable | approved by owner on 2026-09-22 |
| G3-06 | docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/float32/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/eigenmode_phase_advance/pmc_reference/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/signals/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/symmetry_reduction/reduced_versus_doubled_fields/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-06_pec_pmc_cavity.json acceptance/independent_endpoint_solver/atol = 2e-06 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-08 | docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json declares revision_of (a revised case) | approved by owner on 2026-09-24 |
| G3-09 | docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/fiber_beta_relative_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/homogeneous_neff/atol = 2e-05 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-09_mode_solver_oracles.json acceptance/modal_power/gram/atol = 0.0002 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-10 | docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/rtol = 0.001 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-10_pic_networks.json acceptance/material_vjp/y_branch/atol = 1e-05 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-11 | docs/validation/cases/G3-11_dipole_radiation.json acceptance/near_flux_versus_far_power/rtol = 0.0005 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G3-12 | docs/validation/cases/G3-12_tensor_slab.json acceptance/slab/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/gradient/rtol = 0.0005 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-12_tensor_slab.json acceptance/cuda_parity_float32/difference_from_common_criterion states a limit looser than the program threshold | approved by owner on 2026-09-24 |
| G3-14 | docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_solver.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_spacetime.py/float32/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/signals/atol = 2e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_pec_boundaries.py/gradient/atol = 3e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/within_program_thresholds/tests/test_streamed_density.py response/atol = 4e-06 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_tensor_native_cuda.py table VJP float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_endpoint_native_cpml_cuda.py VJPs float32/rtol = 0.0002 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-14_discrete_backend_agreement.json acceptance/looser_than_program_thresholds/tests/test_streamed_density.py gradient float32/atol = 7e-06 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G3-15 | docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/rtol = 0.003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-15_gradient_checks.json acceptance/waveform/float32/atol = 0.0003 is looser than the loosest program atol 1e-06; docs/validation/cases/G3-15_gradient_checks.json acceptance/shape/cuda_float32_versus_autograd/rtol = 0.0003 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G3-16 | docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/fp32_chain/rtol = 0.0003 is looser than the loosest program rtol 0.0001; docs/validation/cases/G3-16_physical_parameter_gradients.json acceptance/geometry_maps/streamed/rtol = 0.0004 is looser than the loosest program rtol 0.0001 | approved by owner on 2026-09-24 |
| G4-01 | docs/validation/cases/G4-01r2_platform_matrix.json declares supersedes (a revised case) | approved by owner on 2026-09-25 |
| G6-04 | docs/validation/cases/G6-04.json acceptance/tracked_neff_error_max/difference_from_common_criterion states a limit looser than the program threshold; docs/validation/cases/G6-04.json acceptance/separated_amplitudes/atol = 1e-05 is looser than the loosest program atol 1e-06 | approved by owner on 2026-09-24 |
| G7-01 | docs/validation/cases/G7-01.json declares superseded_by (a revised case); docs/validation/cases/G7-01r2.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G7-02 | docs/validation/cases/G7-02.json declares superseded_by (a revised case); docs/validation/cases/G7-02r2.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G7-03 | docs/validation/cases/G7-03.json declares superseded_by (a revised case); docs/validation/cases/G7-03r2.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G7-04 | docs/validation/cases/G7-04.json declares superseded_by (a revised case); docs/validation/cases/G7-04r2.json declares supersedes (a revised case) | approved by owner on 2026-09-24 |
| G9-05 | docs/validation/cases/G9-05.json acceptance/independent_user declares a program threshold not applicable | approved by owner on 2026-09-24 |

## Consistency

Each check compares two sources of the same fact; a MISMATCH is reported here and makes the build exit nonzero.

| Check | Result | Detail |
| --- | --- | --- |
| package version | ok | pyproject.toml 0.17.1, COMPATIBILITY.md 0.17.1, CHANGELOG.md 0.17.1, clean-install wheel 0.17.1 |
| README row check `test_quick_start_selects_the_measured_path_explicitly` | ok | reproduced from its record |
| README row check `test_readme_a100_row_matches_the_double_precision_record` | ok | reproduced from its record |
| README row check `test_readme_capacity_row_matches_the_fp32_record` | ok | reproduced from its record |
| README row check `test_readme_fdtdx_adjoint_row_matches_the_cross_solver_record` | ok | reproduced from its record |
| README row check `test_readme_fdtdx_row_matches_the_cross_solver_record` | ok | reproduced from its record |
| README row check `test_readme_meep_row_uses_the_fastest_rank_count_of_the_sweep` | ok | reproduced from its record |
| README row check `test_readme_restart_row_matches_the_restart_record` | ok | reproduced from its record |
| README "Compared with Meep" block | ok | equals the renderer output for the committed records |
| MEEP_COMPARISON.md | ok | equals the renderer output for the committed records |
| third-party notices and SBOM | ok | committed SBOM taken on win32, Python 3.10.2, Windows-10-10.0.26200-SP0: 52 components (52 installed there), 3 open items, 0 scan findings; check: passed against the tracked tree |
| RELEASE_SCOPE.md support claims | ok | 22 verification cells and the stage-status block rendered from the gate file |
| attestation wording | ok | no line uses the words that tests/test_validation_report.py forbids |

13 checks, 0 mismatch(es).
