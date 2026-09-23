# Cointegration Statistical Arbitrage

2025년 KRW 암호자산 데이터를 이용해 **공적분(Cointegration) 기반 통계적 차익거래 전략**의 가능성을 검증한 프로젝트입니다.

Johansen 공적분 검정을 이용해 평균회귀 가능성이 있는 자산 바스켓을 선별하고, 이후 **1분봉·15분봉 Rolling Out-of-Sample 백테스트**를 통해 공적분 관계의 지속성과 거래비용 이후의 실제 수익성을 확인했습니다.

---

## Project Overview

공적분 관계가 존재하는 자산들은 단기적으로 가격이 서로 이탈하더라도 장기적으로 일정한 균형관계로 복귀할 가능성이 있습니다.

본 프로젝트에서는 다음 질문을 검증했습니다.

- 어떤 암호자산 조합에서 통계적으로 유의한 공적분 관계가 나타나는가?
- 전체 표본에서 발견된 공적분 관계가 이후 OOS 구간에서도 유지되는가?
- 평균회귀 신호를 실제 거래전략으로 구현했을 때 거래비용 이후에도 수익성이 존재하는가?
- 1분봉과 15분봉에서 결과가 어떻게 달라지는가?

> **공적분성은 통계적 차익거래 전략의 필요조건이 될 수 있지만, 수익성을 보장하는 충분조건은 아니었습니다.**

---

## Analysis Pipeline

```text
Price Data
   ↓
I(1) 확인
Level / First Difference ADF Test
   ↓
VAR Lag Selection
   ↓
Johansen Cointegration Test
   ↓
Cointegrating Vector 추정
   ↓
Spread 생성
   ↓
Spread ADF Test
   ↓
AR(1) / OU Half-Life 추정
   ↓
Candidate Basket Screening
   ↓
Rolling Out-of-Sample Backtest
   ↓
Transaction Cost / Slippage Sensitivity
```

### 1. Cointegration Screening

BTC를 포함한 3~4개 자산 바스켓을 구성한 뒤 다음 조건을 순차적으로 확인했습니다.

- 개별 가격 시계열의 I(1) 여부
- VAR lag selection
- Johansen test에서 `rank ≥ 1`
- 추정한 spread의 정상성
- AR(1) 계수의 평균회귀 조건
- OU 기반 half-life 범위

이를 통해 실제 백테스트에 사용할 후보 바스켓을 선별했습니다.

### 2. Rolling Out-of-Sample Backtest

백테스트에서는 미래 정보를 직접 사용하지 않도록 rolling 방식으로 공적분 벡터를 다시 추정했습니다.

```text
Train Window : 90 days
Test Window  : 7 days
Step         : 7 days
```

각 Train window에서 Johansen vector를 추정한 뒤 바로 다음 Test window에 적용했습니다.

```text
Entry : |z-score| ≥ 2.0
Exit  : |z-score| ≤ 0.5
```

거래비용과 추가 slippage를 반영해 전략의 비용 민감도도 함께 확인했습니다.

---

## Main Results

### 1-Minute Data

1분봉 screening에서는 **6개 바스켓**이 최종 후보로 선정되었습니다.

가장 좋은 OOS 결과를 보인 바스켓은 다음과 같습니다.

```text
BTC · DOGE · DOT · ETH
```

0 bps 추가 slippage 기준:

| Metric | Result |
|---|---:|
| Cumulative Return | **+8.13%** |
| Sharpe Ratio | **1.47** |
| Maximum Drawdown | **-12.55%** |
| Win Rate | **71.4%** |

추가 slippage가 10 bps로 증가한 경우에도 누적수익률은 약 **+3.68%**로 플러스를 유지했습니다.

다만 나머지 후보들은 공적분 screening을 통과했음에도 OOS 수익률이 음수로 나타났습니다.

### 15-Minute Data

15분봉에서는 다음 2개 바스켓을 백테스트했습니다.

```text
BTC · ADA · DOT · TRX
BTC · LINK · SOL · TRX
```

두 바스켓 모두 0 bps 추가 slippage 조건에서도 누적수익률이 약 **-5% 수준**으로 나타나 수익성을 확인하지 못했습니다.

---

## Key Findings

### In-sample Cointegration ≠ OOS Profitability

전체 데이터에서 공적분 관계가 확인되더라도 그 관계가 이후 구간에서 계속 유지된다는 보장은 없습니다.

1분봉 후보의 Rolling OOS 공적분 유지 비율은 약 **25.6%~61.5%**,  
15분봉 후보는 약 **20.5%~28.2%** 수준이었습니다.

### Transaction Cost Matters

공적분 전략은 하나의 바스켓에 여러 자산을 동시에 매수·매도하기 때문에 거래 한 번에 여러 체결이 발생합니다.

따라서 전략 성과는 다음에 민감합니다.

- 거래빈도
- 수수료
- slippage
- 체결지연

가장 성과가 좋았던 1분봉 바스켓도 slippage가 증가할수록 누적수익률과 Sharpe Ratio가 빠르게 감소했습니다.

### Cointegration Is a Necessary Condition, Not a Sufficient Condition

```text
Cointegration
      ↓
Mean Reversion 가능성
      ↓
하지만
      ↓
관계의 지속성
거래비용
진입·청산 규칙
시장구조 변화
      ↓
까지 충족되어야 실제 수익성으로 연결
```

---

## Repository Structure

```text
.
├── assets/
├── source/
├── 15m_backtest.ipynb
├── 15m_backtest_summary.csv
├── 1m_backtest.ipynb
├── 1m_backtest_summary.csv
├── ALL_1m.parquet
├── Johansen_test_15m.ipynb
├── Johansen_test_1m.ipynb
├── index.html
├── script.js
└── style.css
```

### Main Files

| File | Description |
|---|---|
| `Johansen_test_1m.ipynb` | 1분봉 데이터 기반 공적분 screening |
| `Johansen_test_15m.ipynb` | 15분봉 데이터 기반 공적분 screening |
| `1m_backtest.ipynb` | 1분봉 Rolling OOS 백테스트 |
| `15m_backtest.ipynb` | 15분봉 Rolling OOS 백테스트 |
| `1m_backtest_summary.csv` | 1분봉 백테스트 결과 요약 |
| `15m_backtest_summary.csv` | 15분봉 백테스트 결과 요약 |
| `ALL_1m.parquet` | 분석에 사용한 1분봉 데이터 |
| `index.html` | 프로젝트 결과를 정리한 웹 포트폴리오 |
| `assets/` | 웹페이지 차트 및 결과 이미지 |
| `source/` | 웹페이지에서 다운로드할 수 있는 분석 원본 파일 |

---

## Web Portfolio

`index.html`을 통해 분석 과정과 결과를 스크롤형 웹 포트폴리오로 구성했습니다.

```text
Overview
   ↓
Cointegration Screening
   ↓
1-Minute Rolling OOS
   ↓
15-Minute Rolling OOS
   ↓
Result Interpretation
   ↓
Code Explorer
```

GitHub Pages를 활성화하면 별도의 서버 없이 프로젝트를 웹에서 확인할 수 있습니다.

---

## Limitations

현재 구조에서는 **후보 바스켓 선정 단계와 OOS 백테스트 단계가 완전히 분리된 nested 구조는 아닙니다.**

Rolling OOS 구간에서는 각 Train window마다 Johansen vector를 다시 추정하지만, 백테스트 대상 후보 바스켓은 2025년 전체 표본을 이용해 먼저 선별되었습니다.

따라서 현재 결과는:

> **고정된 후보 바스켓의 OOS 안정성과 수익성 검증**

으로 해석하는 것이 적절합니다.

향후에는 다음 검증을 추가할 수 있습니다.

- 각 Train window 내부에서 후보 바스켓을 다시 선정하는 Nested Rolling OOS
- 거래비용 및 slippage stress test
- Entry / Exit z-score sensitivity analysis
- 체결 지연 반영
- regime별 공적분 안정성 비교

---

## Tech Stack

- Python
- Pandas
- NumPy
- Statsmodels
- Johansen Cointegration Test
- ADF Test
- Jupyter Notebook
- HTML / CSS / JavaScript
- GitHub Pages

---

## Disclaimer

본 프로젝트는 **통계적 관계와 백테스트 방법론을 검증하기 위한 연구·학습 목적의 프로젝트**입니다.

백테스트 결과는 실제 투자 성과를 보장하지 않으며, 실제 거래에서는 수수료, slippage, 시장충격, 유동성, 체결지연 등 추가적인 요소가 성과에 영향을 줄 수 있습니다.
