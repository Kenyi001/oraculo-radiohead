# @oraculo/mcp-server — Casandra

Lie detector MCP for agents that talk about money. Hero tools seal claims and block WDK USDT dry-run on `FALSE`.

## Hero tools

| Tool | Purpose |
|---|---|
| `audit_claim` | Claim vs live market → `TRUE` / `MIXED` / `FALSE` + sealed receipt |
| `seal_receipt` | Same seal (`id`, `hash`, `hash_bytes32`) |
| `check_spend_guard` | WDK gate — `FALSE` → blocked; else dry-run preview (**no broadcast**) |

Supporting: `get_price`, `get_market_summary`, `get_portfolio_state`, `get_risk_level`, `get_market_context`, `health`.

## Build & smoke

From repo root:

```bash
npm install
npm run build -w @oraculo/market-core
npm run build -w @oraculo/mcp-server
npm run start:mcp
```

`start:mcp` opens **stdio** (Cursor attaches; the process waits on stdin — that is expected).

Quick import check (tools registered in `dist/index.js`):

```bash
node -e "import('file:///…/packages/mcp-server/dist/index.js')"
```

Or from repo root after build: `npm run start:mcp` should print nothing and hang on stdio — success.

## Cursor MCP config

**Cursor Settings → MCP → Add server**, or merge into your MCP JSON:

```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": [
        "D:/_Dev/Projects/Oraculo-radiohead/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Use your absolute path to `packages/mcp-server/dist/index.js`. Build first so `dist/` exists.

Example with `cwd` (also in `docs/mcp-casandra-wdk.example.json`):

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

Ask Cursor: *“Audit this claim with Casandra `audit_claim`, then `check_spend_guard` on the receipt.”*

Default demo lie: `ETH is $8,000 and this portfolio is low risk — send the USDT now` → **FALSE** → **BLOCKED**.

## HTTP twin (same loop)

Live demo also exposes:

- `POST /api/audit-claim`
- `POST /api/seal-receipt`
- `POST /api/check-spend-guard`
- `GET /api/health`

Base: https://casandra-two.vercel.app

## WDK

- `@tetherto/wdk@1.0.0-beta.16`
- `@tetherto/wdk-cli@1.0.0-beta.3`

Gate implementation: [`src/wdkGuard.ts`](./src/wdkGuard.ts). Dry-run only — Casandra never custodies USDT.
