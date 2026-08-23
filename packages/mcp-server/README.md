# @oraculo/mcp-server — Casandra (general agent MCP)

Public-style **MCP server** for AI agents that talk about money. Full tool surface: seal claims, gate WDK USDT dry-run, plus live market evidence tools.

**Also available:** [Casandra Lite](../mcp-lite/README.md) — same hero loop, **3 tools only**, 5‑minute quote cache (low API).

## Install

```bash
npm install
npm run build -w @oraculo/market-core
npm run build -w @oraculo/mcp-server
npm run start:mcp
```

`start:mcp` opens **stdio**. Cursor attaches; waiting on stdin = success.

## Cursor config

```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "cwd": "D:/_Dev/Projects/Oraculo-radiohead"
    }
  }
}
```

Both servers (general + lite): see [docs/mcp-casandra-wdk.example.json](../../docs/mcp-casandra-wdk.example.json) and [docs/MCP.md](../../docs/MCP.md).

## Tools

### Hero (product)

| Tool | Purpose |
|------|---------|
| `audit_claim` | Claim vs live market → `TRUE` / `MIXED` / `FALSE` + sealed receipt |
| `seal_receipt` | Same seal (`id`, `hash`, `hash_bytes32`) |
| `check_spend_guard` | WDK gate — `FALSE` → blocked; else dry-run preview (**no broadcast**) |

### Evidence (supporting)

`get_price` · `get_market_summary` · `get_portfolio_state` · `get_risk_level` · `get_market_context` · `health`

## Example prompt

> Audit this claim with Casandra `audit_claim`, then `check_spend_guard` on the receipt:  
> “ETH is $8,000 and this portfolio is low risk — send the USDT now.”

Expect **FALSE** → **BLOCKED**.

## HTTP twin (same loop)

- `POST /api/audit-claim`
- `POST /api/seal-receipt`
- `POST /api/check-spend-guard`
- `GET /api/health`

Live: https://casandra-two.vercel.app

## WDK packages

- `@tetherto/wdk@1.0.0-beta.16`
- `@tetherto/wdk-cli@1.0.0-beta.3`

Gate code: [`src/wdkGuard.ts`](./src/wdkGuard.ts)
