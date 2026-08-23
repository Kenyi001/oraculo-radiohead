# Casandra (repo: oraculo-radiohead)

**Decision substrate for AI agents — sourced, timestamped market evidence so the agent decides on its own.**  
Not predictions. Not a money-mover. Not financial advice.

> Named after Cassandra, the prophetess. Built for [Aleph Hackathon 2026](https://hacki.crecimiento.build/h/aleph-hackathon-2026) — Santa Cruz (EMI / Ethereum Bolivia).  
> **General (default)** + sponsor **[WDK](https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track)** (optional execution under evidence).  
> Specs: [specs/constitution.md](specs/constitution.md) · Direction: [docs/DIRECTION.md](docs/DIRECTION.md)

## Problem / Solution

AI agents invent prices and invent reasons. **Casandra** returns a consume-only **Evidence Pack** — live price, risk, Fear&Greed, news headlines, and a structured `why` / `reasons[]` — so the **agent can decide on its own**. Same engine powers the **web demo** for judges. **WDK** (`wdk-mcp`) is an optional second layer: only if the agent chooses to act, a guardrail can gate a USD₮ dry-run (sponsor track proof — not the product).

### What it simplifies

Without Casandra, the agent scrapes prices, invents “whys”, and may move a wallet on hallucinations.  
**With Casandra:** one call (`get_market_pulse`) → ready Evidence Pack → the agent **reads and decides** (`consume_only: true`).

### What others don’t offer

| Typical hackathon agent | Casandra |
|-------------------------|----------|
| Chat opinion / black-box advice | Versioned, deterministic JSON |
| Price-only **or** send-token demo | Price + risk + F&G + news + **why** in one pack |
| Product = move USD₮ | Product = **inform**; execution optional |

Full thesis: [docs/DIRECTION.md](docs/DIRECTION.md).

## Team

| Role | Owner |
|---|---|
| MCP + core + Pulse + submit | **Dax** ([Kenyi001](https://github.com/Kenyi001)) |
| Market Pulse quality | **David** ([arnez69](https://github.com/arnez69)) |
| Contrato + Web3 (Ethereum Sepolia) | **Vctor11180** ([Vctor11180](https://github.com/Vctor11180)) |
| Vercel live demo | **Dax** — [docs/VERCEL.md](docs/VERCEL.md) |
| Pitch + video | **Augusto** ([RonaldGaymer2002](https://github.com/RonaldGaymer2002)) — [docs/PITCH_AUGUSTO.md](docs/PITCH_AUGUSTO.md) |

## Aleph 2026

| | |
|---|---|
| **General (default)** | Evidence Pack / Decision Substrate — [docs/TRACK.md](docs/TRACK.md) |
| **Sponsor** | **WDK** — optional execution under evidence — [docs/WDK.md](docs/WDK.md) |
| **Direction** | [docs/DIRECTION.md](docs/DIRECTION.md) |
| Chapter | [Santa Cruz EMI](https://aleph-hackathon-2026-santa-cruz.vercel.app/#lugar) |
| Platform | [Hacki](https://hacki.crecimiento.build/h/aleph-hackathon-2026) |
| Framework | [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) · [TASKS.md](TASKS.md) · [docs/BOARD.md](docs/BOARD.md) |

## MCP tools (Casandra)

| Tool | Purpose |
|---|---|
| **`get_market_pulse`** | **Primary:** consume-only Evidence Pack — favor + why + news + F&G + context hint |
| `get_price` | USD price + 24h change |
| `get_portfolio_state` | Value, PnL %, weights, USDT share |
| `get_risk_level` | Score 0–100 + band + context hint `action` |
| `get_market_context` | Fast bias bullets (not advice) |
| `get_market_summary` | Multi-symbol bias |
| `check_wdk_guardrail` | **Optional WDK:** allow/deny before `send_token` |
| `health` | Version / last fetch |

Agent policy: [docs/AGENT_WDK_POLICY.md](docs/AGENT_WDK_POLICY.md) — **agent decides**; Pulse first; WDK only after.

## Market Pulse — consume-only Evidence Pack

Agents **must not** reinvent the formula. Call `get_market_pulse` and read JSON:

| Field | Use |
|-------|-----|
| `why` | Structured **por qué** (market, news, sentiment, alignment) |
| `reasons[]` | ≥3 concrete reasons with numbers |
| `meters` | price changes, Fear&Greed, news_score |
| `headlines[]` | News titles (RSS or mock fallback) |
| `verdict` | Context hint: `proceed` / `caution` / `avoid` (not a trade order) |
| `market_favor` | `for` / `against` / `neutral` |
| `confidence` | 0–1 |
| `consume_only` | always `true` |
| `algorithm` | `casandra-pulse-v1` |
| `fetched_at` | ISO timestamp |

Product requirements: [docs/david/REQUISITOS_PULSE.md](docs/david/REQUISITOS_PULSE.md).

**Live demo:** https://casandra-two.vercel.app  
**Repo:** https://github.com/Kenyi001/oraculo-radiohead

### Sponsor track proof (WDK) — secondary

- Guardrail: [`packages/market-core/src/index.ts`](packages/market-core/src/index.ts) (`checkWdkGuardrail`)
- MCP: [`packages/mcp-server/src/index.ts`](packages/mcp-server/src/index.ts) (`check_wdk_guardrail`)
- Dual MCP: [`docs/mcp-casandra-wdk.example.json`](docs/mcp-casandra-wdk.example.json)
- Packages: `@tetherto/wdk@1.0.0-beta.16`, `@tetherto/wdk-cli@1.0.0-beta.3`
- Full guide: [docs/WDK.md](docs/WDK.md)

Ask: *“Run get_market_pulse for eth side=buy. Summarize why and reasons. Only if you would act, check_wdk_guardrail and dry-run — never invent numbers.”*

## Risk algorithm v1 (`casandra-risk-v1`)

```
score = 0.45 * abs_change_component
      + 0.35 * relative_vol_vs_btc
      + 0.20 * (100 - usdt_share_pct)
```

- Bands: **0–33 low** · **34–66 med** · **67–100 high**
- Context hint: low → proceed · med → caution · high → avoid
- Full factor breakdown returned in JSON

## Quick start

```bash
npm install
npm run build
npm run start:mcp    # MCP stdio
npm run dev:web      # http://localhost:5173
```

### Cursor MCP config (Casandra + optional WDK)

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

## Monorepo

```
packages/market-core   # prices, portfolio, risk, Pulse, optional WDK guardrail
packages/mcp-server    # Casandra MCP (get_market_pulse primary)
packages/wdk-bridge    # WDK package manifest (sponsor track)
packages/demo-web      # judges UI — Pulse-first
contracts/             # CasandraRegistry (Ethereum Sepolia)
docs/                  # DIRECTION, TRACK, WDK, pitch
```

## On-chain (CasandraRegistry)

Minimal risk-snapshot registry for Aleph. **Official network: Ethereum Sepolia** (team SepoliaETH; Base optional later).

```bash
npm run contracts:compile
npm run contracts:deploy:sepolia
```

See [contracts/README.md](contracts/README.md).

**Contract address (Ethereum Sepolia):** [`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)  
**Explorer:** https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF

## Code graph ([graphify](https://github.com/graphify-project))

[graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md) · [graphify-out/graph.html](graphify-out/graph.html) · [graphify-out/oraculo-radiohead-callflow.html](graphify-out/oraculo-radiohead-callflow.html).

## Disclaimer

**Not financial advice.** Casandra does not execute trades or predict returns. The agent decides.

## License

MIT
