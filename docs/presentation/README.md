# 랩미팅 발표자료

PhotonWeave를 "Lumerical FDTD를 대체하는 GPU 가속 FDTD 워크벤치"로 소개하는 한국어
Beamer 슬라이드입니다. 시각 자료 중심이며, 숫자가 들어간 모든 슬라이드는 측정 조건과
남은 검증 항목을 같은 화면에 적습니다.

| 파일 | 분량 | 용도 |
| --- | --- | --- |
| `photonweave-lab-meeting-20min.tex` | 본문 15장 + 부록 7장 | **20분 발표용**. 요약 → 동기 → 구조 → UI → 엔진 → 정확도 → PhC 실계산 → 속도 3장 → adjoint → 메모리 → 한계 → 요약 |
| `photonweave-lab-meeting.tex` | 본문 37장 | 40분 전체 버전. 경계/소스/메시, 배치 스케일링, 분산재료 adjoint, FSP, 오픈소스 비교를 개별 슬라이드로 다룸 |

두 덱은 `preamble.tex`(테마·색·글꼴·매크로)와 `figures/`를 공유하므로 스타일이 항상
같이 움직입니다. 20분 버전에서 뺀 내용은 대부분 그 덱의 부록이나 전체 버전에 있습니다.

## 빌드

```sh
bash docs/presentation/build.sh            # 그림 + 두 덱
bash docs/presentation/build.sh --slides   # 덱만 (기존 그림 재사용)
```

`build.sh`는 덱마다 XeLaTeX를 두 번 호출합니다. 직접 실행하려면:

```sh
python docs/presentation/make_figures.py
cd docs/presentation && xelatex -interaction=nonstopmode photonweave-lab-meeting-20min.tex
```

필요 패키지: `beamer`, `metropolis`, `kotex`, `tikz`, `pgf`, `listings`, `booktabs`.
한글 글꼴은 NanumBarunGothic 또는 NanumGothic을 사용하며, 둘 다 없으면 kotex 기본
글꼴로 넘어갑니다 (Overleaf는 XeLaTeX 컴파일러를 선택하면 그대로 동작합니다).

## 그림의 출처

`make_figures.py`가 두 종류의 그림을 만듭니다.

**1. 여기서 실제로 계산하는 필드 그림** (CPU, 합쳐서 1분 남짓)

| 파일 | 내용 |
| --- | --- |
| `figures/field-waveguide.pdf` | SiN 도파로 다이폴 여기, $E_z$ 스냅샷 3장 |
| `figures/field-scatterer.pdf` | 유전체 원기둥 평면파 산란 |
| `figures/field-phc-gap.pdf` | 정사각 rod 격자의 TM 밴드갭 투과/반사 스펙트럼 |
| `figures/field-phc-w1.pdf` | 같은 결정의 W1 선결함 도파로 전파 |
| `figures/field-slab-validation.pdf` | 유전체 박막 $R$, $T$ 대 해석해 |

두 검증 그림은 실행할 때마다 수치 요약을 `figures/slab-validation.json`,
`figures/phc-gap.json`에 남깁니다.

**2. 이미 기록된 측정값의 차트** — 각 함수 위의 주석과 `SOURCES` 딕셔너리가
`README.md` 또는 `docs/validation`의 해당 표를 가리킵니다. 차트는 시뮬레이션을
새로 돌리지 않습니다.

**3. UI 화면** — `figures/ui-*.png`는 로컬 워크벤치 서버
(`python -m photonweave.cli serve`)를 띄우고 Playwright로 캡처한 실제 화면입니다.
다시 캡처하려면 서버를 실행한 뒤 브라우저에서 직접 저장하거나, `tests/ui`의
Playwright 설정을 사용하세요.

## 발표에서 조심할 점

- Lumerical 대비 타이밍 표는 **과거 빌드의 기록**이며 동일 정확도 비교가 아닙니다.
  슬라이드에도 같은 단서를 적어 두었고, 다시 해야 하는 비교 목록을 별도 슬라이드로
  두었습니다 (`docs/RELEASE_REVIEW.md` 참고).
- 해당 표는 공개 배포 전 라이선스 검토 대상입니다. 외부 공개용으로 슬라이드를
  재사용할 때는 그 슬라이드를 먼저 확인하세요.
- 측정 3회 반복은 신뢰구간을 주지 않습니다. 회귀(느려진 경우)도 슬라이드에 그대로
  남겨 두었습니다.
