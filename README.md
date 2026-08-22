# Oraculo (radiohead)

**Market Oracle MCP — real market state for AI agents, not hallucinations.**

> ES: Oráculo de mercado vía MCP para agentes (Cursor/Claude). Datos reales (CoinGecko) + UI demo para jueces.

Built for **[Aleph Hackathon 2026](https://hacki.crecimiento.build/h/aleph-hackathon-2026)** — Santa Cruz chapter (EMI / Ethereum Bolivia).

## Problem / Solution

AI agents invent prices when asked “how is the market?”. Oraculo exposes **MCP tools** that fetch live quotes and a simple 24h bias (`bullish` / `bearish` / `sideways`). Same logic powers a **web demo** so judges can try it without an MCP client.

## Aleph 2026

| | |
|---|---|
| Track | **AI / vibe coding** (MCP as agent↔data interface) |
| Chapter | Santa Cruz · EMI · [chapter site](https://aleph-hackathon-2026-santa-cruz.vercel.app/#lugar) |
| Team | Solo — [Kenyi001](https://github.com/Kenyi001) (Dax Kenji Tellez Duran) |
| Platform | [Hacki](https://hacki.crecimiento.build/h/aleph-hackathon-2026) · DoraHacks submit |

Optional DeFi angle: include **USDT** in summaries (Tether ecosystem relevance).

## MCP tools

| Tool | Input | Output |
|---|---|---|
| `get_price` | `symbol` (btc, eth, usdt…) | price_usd, change_24h_pct, source, fetched_at |
| `get_market_summary` | `symbols[]` | bias + bullets + quotes |
| `health` | — | ok, version, last_fetch |

Data source: **CoinGecko** public API. Mock fallback if rate-limited / offline.

## Quick start

```bash
npm install
npm run build:core
npm run build -w @oraculo/mcp-server
```

### Run MCP (stdio)

```bash
npm run start:mcp
```

### Cursor MCP config

Add to Cursor MCP settings (path adjusted to your clone):

```json
{
  "mcpServers": {
    "oraculo-market": {
      "command": "node",
      "args": ["D:/_Dev/Projects/Oraculo-radiohead/packages/mcp-server/dist/index.js"]
    }
  }
}
```

Then ask: *“How is BTC today? Use the oraculo tools.”*

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "oraculo-market": {
      "command": "node",
      "args": ["D:/_Dev/Projects/Oraculo-radiohead/packages/mcp-server/dist/index.js"]
    }
  }
}
```

### Demo web (judges)

```bash
npm run dev:web
```

Open http://localhost:5173

**Live demo:** _(deploy URL — fill after Vercel)_

```bash
# Deploy from repo root (Vercel CLI or dashboard)
# vercel.json points output to packages/demo-web/dist
```

## Monorepo

```
packages/
  market-core/   # fetch + normalize + bias (shared)
  mcp-server/    # @modelcontextprotocol/sdk stdio server
  demo-web/      # Vite + React UI for judges
docs/HACKATHON.md
```

## Hackathon rules

- Code for this project was written **during** Aleph Hackathon (kickoff onwards).
- Reused only public libraries (MCP SDK, Vite, React, TypeScript) — not a pre-built product.
- See [docs/HACKATHON.md](docs/HACKATHON.md) for submission checklist.

## Links

- Hacki: https://hacki.crecimiento.build/h/aleph-hackathon-2026
- Chapter SCZ: https://aleph-hackathon-2026-santa-cruz.vercel.app/
- Official Aleph: https://alephhackathon.crecimiento.build/
- Demo video: _(YouTube / Drive — add before submit)_

## Disclaimer

**Not financial advice.** Prices and bias are informational demos only. Do not trade based on this tool.

## License

MIT
