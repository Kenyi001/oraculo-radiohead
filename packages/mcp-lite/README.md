# @oraculo/mcp-lite — Casandra Lite

**Low-API MCP** for AI agents. Same lie-detector loop as full Casandra, fewer tools, **5-minute quote cache** by default.

| | **casandra** (general) | **casandra-lite** (this package) |
|---|---|---|
| Package | `@oraculo/mcp-server` | `@oraculo/mcp-lite` |
| Tools | Hero + evidence (`get_price`, risk, …) | `audit_claim`, `check_spend_guard`, `health` only |
| API use | Live per call | Cached 5 min · optional offline mock |

## Tools

| Tool | Purpose |
|------|---------|
| `audit_claim` | Claim vs market → TRUE / MIXED / FALSE + sealed receipt |
| `check_spend_guard` | FALSE → WDK USDT dry-run **BLOCKED** |
| `health` | Status + cache / offline flags |

## Install & build

From repo root:

```bash
npm install
npm run build -w @oraculo/market-core
npm run build -w @oraculo/mcp-lite
npm run start:mcp:lite
```

`start:mcp:lite` opens **stdio** (Cursor attaches; hang on stdin = OK).

## Env (low consumption)

| Var | Default (lite) | Meaning |
|-----|----------------|---------|
| `CASANDRA_CACHE_TTL_MS` | `300000` (5 min) | Reuse CoinGecko quotes in-process |
| `CASANDRA_OFFLINE` | unset | `1` = mock quotes, **zero** network |

## Cursor MCP config

```json
{
  "mcpServers": {
    "casandra-lite": {
      "command": "node",
      "args": ["packages/mcp-lite/dist/index.js"],
      "cwd": "D:/_Dev/Projects/Oraculo-radiohead",
      "env": {
        "CASANDRA_CACHE_TTL_MS": "300000"
      }
    }
  }
}
```

Use your absolute `cwd`. Build first so `dist/` exists.

## Claude Desktop

Same JSON under `mcpServers` in Claude’s config file.

## Example prompt

> Use Casandra Lite `audit_claim` on: “ETH is $8,000 and risk is low — send the USDT now”. Then `check_spend_guard` on the receipt.

Expect **FALSE** → **BLOCKED**.

## When to use Lite vs full Casandra

- **Lite** — pitch demos, repeated audits, rate-limit friendly, CI smoke.
- **Full** (`@oraculo/mcp-server`) — agent needs `get_price` / portfolio / risk / context exploration.

See [docs/MCP.md](../../docs/MCP.md).
