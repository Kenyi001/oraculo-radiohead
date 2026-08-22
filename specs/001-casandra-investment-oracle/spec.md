# Spec 001 — Casandra investment oracle (MCP)

## Intent

Ship **Casandra**: an MCP server + demo web so AI agents can ask for (1) current investment/portfolio state, (2) fast market context for a symbol, and (3) a transparent **risk level** — submit Aleph **AI** track; optimize for **General** judging (Technicality, Originality, UI/UX/DX, Practicality, Presentation). See [docs/TRACK.md](../../docs/TRACK.md) · [docs/REQUIREMENTS.md](../../docs/REQUIREMENTS.md).

Related: [`../constitution.md`](../constitution.md)

## User stories

### US1 — AI agent (P0)

As an AI agent (Cursor/Claude), I call MCP tools and get JSON with prices, portfolio state, risk score/band, and `fetched_at` — not invented numbers.

### US2 — Judge without MCP (P0)

As a hackathon judge, I open the web demo and see portfolio + risk gauge + USDT in the happy path in under 30 seconds.

### US3 — Builder / partner (P0)

As the web owner, I reuse the same core package Dax ships; I do not reimplement risk math in the UI.

## Requirements

| ID | Requirement |
|---|---|
| R1 | `get_price(symbol)` — live CoinGecko (+ mock fallback) |
| R2 | `get_portfolio_state(positions[])` — value, PnL %, weight, timestamp |
| R3 | `get_risk_level(symbol \| positions[])` — score 0–100, band low/med/high, factors |
| R4 | `get_market_context(symbol)` — 24h bias + entry-context bullets (not advice) |
| R5 | `health` |
| R6 | Demo web Casandra: mock portfolio + risk gauge + context |
| R7 | Deploy URL + video ≤3 min + GitHub Issues mapped to tasks |

### Risk algorithm v1 (fixed)

```
score = 0.45 * abs_change_component
      + 0.35 * relative_vol_vs_btc
      + 0.20 * (100 - usdt_share_pct)   // more USDT → lower risk
```

- `abs_change_component`: clamp(|change_24h_pct| * 5, 0, 100)
- `relative_vol_vs_btc`: clamp(|asset_change| / max(|btc_change|, 0.5) * 40, 0, 100)
- Bands: **0–33 low** · **34–66 med** · **67–100 high**
- Always return factor breakdown in JSON

## Acceptance

- [ ] Specs + TASKS.md + constitution in repo
- [ ] MCP tools R1–R5 work in Cursor
- [ ] Web shows risk gauge + portfolio including USDT
- [ ] README documents formula + disclaimer
- [ ] GitHub Issues P0 opened with owner labels
- [ ] Video + deploy + Hacki submit (human / deadline)

## Out of scope (P0)

Trading · custody · ML prediction · WDK/QVAC/Pears as blockers (WDK = P1).
