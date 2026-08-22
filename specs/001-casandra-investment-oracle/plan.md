# Plan 001 — Casandra

## Architecture

```
packages/market-core   → prices, portfolio, risk, context
packages/mcp-server    → MCP stdio tools → core
packages/demo-web      → Casandra UI → core
```

Data: CoinGecko public API. Mock fallback on failure.

## Sequence (EMI)

1. Speckit + README rebrand + GitHub Issues (now)
2. Expand `market-core` (portfolio, risk, context)
3. Wire MCP tools
4. Casandra UI (partner) + Vercel
5. Video + Hacki submit (Sun morning)

## USDT (product flavor inside AI track + General judging)

- P0: USDT always in demo portfolio + risk factors mention stablecoin share
- P1: WDK / address stub if time
- Submit: **AI** challenge track only — optimize for General criteria — see `docs/TRACK.md` · `docs/SHIP.md`

## Risks

| Risk | Mitigation |
|---|---|
| CoinGecko rate limit | Mock fallback |
| Partner UI delayed | Dax ships minimal Casandra UI if needed |
| Vercel auth | Partner/`vercel login`; Netlify backup |
| Scope creep | Constitution forbids P0 extras |
