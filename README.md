# Casandra (repo: oraculo-radiohead)

**Investment oracle MCP for AI agents — portfolio state, market context, and transparent risk. Not hallucinations.**

> Named after Cassandra, the prophetess. Built for [Aleph Hackathon 2026](https://hacki.crecimiento.build/h/aleph-hackathon-2026) — Santa Cruz (EMI / Ethereum Bolivia).  
> Spec-driven: [specs/constitution.md](specs/constitution.md) · [TASKS.md](TASKS.md)

## Problem / Solution

AI agents invent prices and “risk opinions.” **Casandra** exposes MCP tools that return live quotes, portfolio state, a documented **risk score (0–100)**, and short market-context bullets — with timestamps. Same core powers the **web demo** for judges.

## Team

| Role | Owner |
|---|---|
| MCP + core + risk algorithm | **Dax** ([Kenyi001](https://github.com/Kenyi001)) |
| Demo web + deploy + video support | **Partner** (name TBD) |

## Aleph 2026

| | |
|---|---|
| **Challenge track (1)** | **AI** ([docs/TRACK.md](docs/TRACK.md)) |
| **General judging** | Technicality · Originality · UI/UX/DX · Practicality · Presentation |
| Chapter | [Santa Cruz EMI](https://aleph-hackathon-2026-santa-cruz.vercel.app/#lugar) |
| Platform | [Hacki](https://hacki.crecimiento.build/h/aleph-hackathon-2026) · [alephhackathon.crecimiento.build](https://alephhackathon.crecimiento.build/) |
| Product flavor | USDT ballast in risk score |
| Framework | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) · [TASKS.md](TASKS.md) |

## MCP tools

| Tool | Purpose |
|---|---|
| `get_price` | USD price + 24h change |
| `get_portfolio_state` | Value, PnL %, weights, USDT share |
| `get_risk_level` | Score 0–100 + band + factors |
| `get_market_context` | Fast bias bullets (not advice) |
| `get_market_summary` | Multi-symbol bias |
| `health` | Version / last fetch |

## Risk algorithm v1 (`casandra-risk-v1`)

```
score = 0.45 * abs_change_component
      + 0.35 * relative_vol_vs_btc
      + 0.20 * (100 - usdt_share_pct)
```

- Bands: **0–33 low** · **34–66 med** · **67–100 high**
- More **USDT** in the portfolio → lower risk contribution
- Full factor breakdown returned in JSON

## Quick start

```bash
npm install
npm run build
npm run start:mcp    # MCP stdio
npm run dev:web      # http://localhost:5173
```

### Cursor MCP config

```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": ["D:/_Dev/Projects/Oraculo-radiohead/packages/mcp-server/dist/index.js"]
    }
  }
}
```

Ask: *“What’s my portfolio risk? Use Casandra tools.”*

**Live demo:** deploy with `npx vercel --prod` (needs `vercel login`) — paste URL here.  
**Repo:** https://github.com/Kenyi001/oraculo-radiohead

## Monorepo

```
packages/market-core   # prices, portfolio, risk, context
packages/mcp-server    # Casandra MCP
packages/demo-web      # judges UI
contracts/             # CasandraRegistry (Base Sepolia)
specs/                 # Speckit
TASKS.md               # human task board
docs/REQUIREMENTS.md   # Hacki + product checklist
```

## On-chain (CasandraRegistry)

Minimal risk-snapshot registry for Aleph (Hacki requires address if deployed).

```bash
npm run contracts:compile
# fund wallet in contracts/deployments/baseSepolia.json → deployWallet
npm run contracts:deploy:base
```

See [contracts/README.md](contracts/README.md). After deploy, set `VITE_CASANDRA_REGISTRY_*` in `packages/demo-web/.env` and paste address below.

**Contract address (Base Sepolia):** _pending faucet → `npm run contracts:deploy:base`_  
**Explorer:** _TBD_

## Disclaimer

**Not financial advice.** Casandra does not execute trades or predict returns.

## License

MIT
