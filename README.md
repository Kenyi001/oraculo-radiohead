# Casandra (repo: oraculo-radiohead)

**Investment oracle MCP + WDK-guarded USD₮ wallet for AI agents — not hallucinations.**

> Named after Cassandra, the prophetess. Built for [Aleph Hackathon 2026](https://hacki.crecimiento.build/h/aleph-hackathon-2026) — Santa Cruz (EMI / Ethereum Bolivia).  
> **General (default) + sponsor [WDK](https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track).** Specs: [specs/constitution.md](specs/constitution.md) · [docs/WDK.md](docs/WDK.md)

## Problem / Solution

AI agents invent prices/risk and may send tokens unsafely. **Casandra** returns live portfolio state, a transparent **risk score (0–100)** with `action` (`proceed` / `caution` / `avoid`), and gates **Tether WDK** (`wdk-mcp`) so `send_token` is blocked when risk is `avoid`. Same core powers the **web demo** for judges.

## Team

| Role | Owner |
|---|---|
| MCP + core + risk + submit | **Dax** ([Kenyi001](https://github.com/Kenyi001)) |
| Market Pulse (mercado a favor / medidores para agentes) | **David** ([arnez69](https://github.com/arnez69)) |
| Contrato + Web3 (Base Sepolia) | **Vctor11180** ([Vctor11180](https://github.com/Vctor11180)) |
| Demo web + Vercel + video support | Partner / equipo |
| Pitch + video (exposición) | **Augusto** ([RonaldGaymer2002](https://github.com/RonaldGaymer2002)) — [docs/PITCH_AUGUSTO.md](docs/PITCH_AUGUSTO.md) |

## Aleph 2026

| | |
|---|---|
| **General (default)** | [docs/TRACK.md](docs/TRACK.md) — best overall |
| **Sponsor track** | **WDK** ([docs/WDK.md](docs/WDK.md)) — `wdk-mcp` + Casandra guardrails |
| **Direction** | [docs/DIRECTION.md](docs/DIRECTION.md) |
| Chapter | [Santa Cruz EMI](https://aleph-hackathon-2026-santa-cruz.vercel.app/#lugar) |
| Platform | [Hacki](https://hacki.crecimiento.build/h/aleph-hackathon-2026) · [WDK track](https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track) |
| Product flavor | USDT ballast + WDK-guarded agent wallet |
| Framework | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) · [TASKS.md](TASKS.md) · [docs/BOARD.md](docs/BOARD.md) |

## MCP tools (Casandra)

| Tool | Purpose |
|---|---|
| `get_price` | USD price + 24h change |
| `get_portfolio_state` | Value, PnL %, weights, USDT share |
| `get_risk_level` | Score 0–100 + band + `action` + verdict |
| `get_market_pulse` | **Consume-only pulse:** favor + why + news + F&G + verdict |
| `check_wdk_guardrail` | **WDK:** allow/deny `send_token` before wdk-mcp |
| `get_market_context` | Fast bias bullets (not advice) |
| `get_market_summary` | Multi-symbol bias |
| `health` | Version / last fetch |

Pair with **`wdk-mcp`** tools (`get_balance`, `send_token`, …) — see [docs/WDK.md](docs/WDK.md) · [docs/AGENT_WDK_POLICY.md](docs/AGENT_WDK_POLICY.md).

### WDK permalinks (for judges)

- Guardrail: [`packages/market-core/src/index.ts`](packages/market-core/src/index.ts) (`checkWdkGuardrail`)
- MCP tool: [`packages/mcp-server/src/index.ts`](packages/mcp-server/src/index.ts) (`check_wdk_guardrail`)
- Dual MCP config: [`docs/mcp-casandra-wdk.example.json`](docs/mcp-casandra-wdk.example.json)
- Packages: `@tetherto/wdk@1.0.0-beta.16`, `@tetherto/wdk-cli@1.0.0-beta.3`

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

### Cursor MCP config (Casandra + WDK)

```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": ["D:/_Dev/Projects/oraculo-radiohead/packages/mcp-server/dist/index.js"]
    },
    "wdk-wallet": {
      "command": "wdk-mcp"
    }
  }
}
```

Full guide: [docs/WDK.md](docs/WDK.md). Ask: *“Run get_market_pulse for eth side=buy, then check_wdk_guardrail. If avoid, do not send.”*

## Market Pulse — consume-only API for agents

Agents **must not** reinvent the formula. Call `get_market_pulse` and read JSON:

| Field | Use |
|-------|-----|
| `verdict` | `proceed` / `caution` / `avoid` |
| `market_favor` | `for` / `against` / `neutral` |
| `why` | Human/agent-readable **por qué** (market, news, sentiment, alignment) |
| `reasons[]` | ≥3 concrete reasons with numbers |
| `meters` | price changes, Fear&Greed, news_score |
| `headlines[]` | News titles (RSS or mock fallback) |
| `consume_only` | always `true` |
| `algorithm` | `casandra-pulse-v1` |

David’s product requirements: [docs/david/REQUISITOS_PULSE.md](docs/david/REQUISITOS_PULSE.md).

**Live demo:** deploy with `npx vercel --prod` (needs `vercel login`) — paste URL here.  
**Repo:** https://github.com/Kenyi001/oraculo-radiohead
## Monorepo

```
packages/market-core   # prices, portfolio, risk, WDK guardrail
packages/mcp-server    # Casandra MCP (+ check_wdk_guardrail)
packages/wdk-bridge    # WDK package manifest (Aleph WDK track)
packages/demo-web      # judges UI
contracts/             # CasandraRegistry (Base Sepolia)
docs/WDK.md            # WDK setup + permalinks for judges
specs/                 # Speckit
TASKS.md               # human task board
```

## On-chain (CasandraRegistry)

Minimal risk-snapshot registry for Aleph (Hacki requires address if deployed).

```bash
npm run contracts:compile
# fund wallet in contracts/deployments/baseSepolia.json → deployWallet
npm run contracts:deploy:base
```

See [contracts/README.md](contracts/README.md). After deploy, set `VITE_CASANDRA_REGISTRY_*` in `packages/demo-web/.env` and paste address below.

**Contract address (Sepolia Testnet):** [`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)  
**Explorer:** https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF

## Code graph ([graphify](https://github.com/graphify-project))

AST map of the monorepo (no LLM): [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md) · interactive [graphify-out/graph.html](graphify-out/graph.html) · call-flow [graphify-out/oraculo-radiohead-callflow.html](graphify-out/oraculo-radiohead-callflow.html).

```bash
graphify extract . --code-only --no-cluster
graphify cluster-only . --no-label
```

## Disclaimer

**Not financial advice.** Casandra does not execute trades or predict returns.

## License

MIT
