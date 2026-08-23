# Pulse samples (btc / eth) — captured 2026-08-23 for #17 DoD

```json
{
  "btc": {
    "symbol": "btc",
    "fetched_at": "2026-08-23T00:37:18.854Z",
    "market_favor": "against",
    "risk_pct": 41.4,
    "verdict": "caution",
    "confidence": 0.7,
    "why": {
      "market": "BTC 24h -1.70% → bias bearish",
      "news": "news_score 0.20 (neutral) (1/5 titulares positivos: rally)",
      "sentiment": "Fear&Greed=66 Greed",
      "alignment": "side=buy vs bias=bearish → market_favor=against"
    },
    "reasons": [
      "BTC 24h -1.70% → bias bearish (weak)",
      "Fear&Greed=66 Greed (source alternative.me)",
      "Risk casandra-risk-v1: 41.4/100 band=med action=caution",
      "News score 0.20 (neutral) from 5 headlines",
      "side=buy vs market bias=bearish → market_favor=against"
    ],
    "algorithm": "casandra-pulse-v1",
    "consume_only": true
  },
  "eth": {
    "symbol": "eth",
    "fetched_at": "2026-08-23T00:37:19.315Z",
    "market_favor": "neutral",
    "risk_pct": 31.1,
    "verdict": "proceed",
    "confidence": 0.7,
    "why": {
      "market": "ETH 24h -0.80% → bias sideways",
      "news": "news_score 0.40 (bullish) (2/5 titulares positivos: upgrade)",
      "sentiment": "Fear&Greed=66 Greed",
      "alignment": "side=buy vs bias=sideways → market_favor=neutral"
    },
    "reasons": [
      "ETH 24h -0.80% → bias sideways (none)",
      "Fear&Greed=66 Greed (source alternative.me)",
      "Risk casandra-risk-v1: 31.1/100 band=low action=proceed",
      "News score 0.40 (bullish) from 5 headlines",
      "side=buy aligns as market_favor=neutral with bias=sideways"
    ],
    "algorithm": "casandra-pulse-v1",
    "consume_only": true
  }
}
```
