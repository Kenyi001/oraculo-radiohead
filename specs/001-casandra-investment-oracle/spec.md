# Spec 001 — Casandra lie detector (MCP)

## Intent

Ship **Casandra**: a **lie detector** MCP + demo web so AI agents’ money claims are audited against live market evidence, sealed as a contradiction receipt, and blocked from USDT spend (WDK dry-run) when the verdict is `FALSE`. Submit Aleph **General** + **WDK Track 1**; optimize for General judging criteria. See [docs/TRACK.md](../../docs/TRACK.md) · [docs/REQUIREMENTS.md](../../docs/REQUIREMENTS.md).

Related: [`../constitution.md`](../constitution.md)

## User stories

### US1 — AI agent (P0)

As an AI agent, I call `audit_claim` / `seal_receipt` / `check_spend_guard` and get a verdict + receipt — not invented numbers — and cannot dry-run USDT send on `FALSE`.

### US2 — Judge without MCP (P0)

As a hackathon judge, I open the web demo, see THE CLAIM vs THE WORLD, a FALSE seal on the demo lie, and a blocked USDT send in under 30 seconds.

### US3 — Builder / partner (P0)

As the web owner, I reuse the same `@oraculo/market-core` APIs; I do not reimplement audit math in the UI.

## Requirements

| ID | Requirement |
|---|---|
| R1 | `audit_claim(text)` — verdict TRUE/MIXED/FALSE + contradictions + sealed receipt |
| R2 | `seal_receipt` — hash + id for on-chain / WDK gate |
| R3 | `check_spend_guard(receipt_id)` — WDK dry-run gate; FALSE blocks USDT |
| R4 | Evidence sources: price, portfolio, risk, context (supporting) |
| R5 | `health` |
| R6 | Demo web: claim vs world + seal + spend gate |
| R7 | Deploy URL + video ≤3 min with EN captions + Hacki General+WDK |

### Risk algorithm v1 (evidence inside audit)

```
score = 0.45 * abs_change_component
      + 0.35 * relative_vol_vs_btc
      + 0.20 * (100 - usdt_share_pct)
```

## Acceptance

- [x] Specs + TASKS.md + constitution in repo
- [x] MCP hero tools work
- [x] Web shows seal + blocked send on demo lie
- [x] README documents lie detector + WDK permalinks
- [ ] Video + EN captions + Hacki copy update

## Out of scope (P0)

Trading · custody · ML prediction · generic “oracle dashboard” as the pitch.
