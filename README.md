# Cointegration Statistical Arbitrage Web

2025년 KRW 암호자산 1분봉/15분봉 데이터를 이용한 공적분 스크리닝 및 Rolling Johansen OOS 백테스트를 웹 포트폴리오 형태로 정리한 프로젝트입니다.

## 파일 구조

```text
index.html
style.css
script.js
assets/
  charts/
  results/
source/
  Johansen_test_1m.ipynb
  Johansen_test_15m.ipynb
  1m_backtest.ipynb
  15m_backtest.ipynb
  cointegration_screen_1m_2025.csv
  1m_backtest_summary.csv
  15m_backtest_summary.csv
README.md
```

## GitHub Pages

저장소 최상단에 모든 파일을 그대로 업로드한 뒤:

1. Settings
2. Pages
3. Deploy from a branch
4. `main`
5. `/(root)`

를 선택하면 됩니다.

## 분석 흐름

I(1) ADF → VAR lag → Johansen rank → cointegrating vector → spread ADF → AR(1)/OU half-life → rolling OOS backtest

## 중요 해석

Rolling OOS에서 각 Train window마다 공적분 벡터를 다시 추정하지만, 후보 바스켓 자체는 2025년 전체 표본을 이용해 먼저 선별되어 있습니다. 따라서 현재 결과는 고정 후보의 OOS 안정성/수익성 검증이며, 후보 선택 단계까지 완전한 nested OOS는 아닙니다.
