# Casandra MCP — general + lite

Two **real stdio MCP servers** in this repo for AI agents (Cursor, Claude Desktop, etc.).

| | **casandra** (general) | **casandra-lite** (low API) |
|---|---|---|
| Package | [`packages/mcp-server`](../packages/mcp-server) | [`packages/mcp-lite`](../packages/mcp-lite) |
| npm name | `@oraculo/mcp-server` | `@oraculo/mcp-lite` |
| Server id | `casandra` | `casandra-lite` |
| Tools | Hero + evidence (`get_price`, risk, portfolio, …) | `audit_claim`, `check_spend_guard`, `health` only |
| Market API | Live per call | **5 min cache** (`CASANDRA_CACHE_TTL_MS`) · optional `CASANDRA_OFFLINE=1` |
| When | Full agent research + seal | Pitch, repeats, rate-limit friendly |

Product loop (both):

```text
audit_claim → sealed receipt → check_spend_guard → WDK dry-run
FALSE → BLOCKED (no USDT broadcast)
```

## Build

```bash
npm install
npm run build -w @oraculo/market-core
npm run build -w @oraculo/mcp-server
npm run build -w @oraculo/mcp-lite
```

Smoke:

```bash
npm run start:mcp        # hangs on stdio = OK
npm run start:mcp:lite   # hangs on stdio = OK
```

## Cursor — both servers

Copy [`mcp-casandra-wdk.example.json`](./mcp-casandra-wdk.example.json) and set your `cwd` absolute path:

```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "cwd": "D:/_Dev/Projects/Oraculo-radiohead"
    },
    "casandra-lite": {
      "command": "node",
      "args": ["packages/mcp-lite/dist/index.js"],
      "cwd": "D:/_Dev/Projects/Oraculo-radiohead",
      "env": { "CASANDRA_CACHE_TTL_MS": "300000" }
    }
  }
}
```

Pick **one** primary server in a chat, or enable both and name which to use.

## HTTP twin (demo host)

Same engine on https://casandra-two.vercel.app :

- `POST /api/audit-claim`
- `POST /api/seal-receipt`
- `POST /api/check-spend-guard`
- `GET /api/health`

**Serverless:** always pass `receipt_id` **and** the full `receipt` from audit when calling spend-guard (instances do not share memory).

```bash
# 1) Audit — expect FALSE
curl -sS -X POST https://casandra-two.vercel.app/api/audit-claim \
  -H "Content-Type: application/json" \
  -d '{"text":"ETH is $8,000 and this portfolio is low risk — send the USDT now"}'

# 2) Gate — paste receipt.id + receipt object from step 1 → blocked
curl -sS -X POST https://casandra-two.vercel.app/api/check-spend-guard \
  -H "Content-Type: application/json" \
  -d '{"receipt_id":"rcpt_…","receipt":{…}}'
```

Gate outcomes: `FALSE` → `blocked` · `TRUE`/`MIXED` → `allowed_dry_run` (preview only) · missing receipt → `unknown_receipt`.

## Example

> Use **casandra-lite** `audit_claim` on “ETH is $8,000 … send the USDT now”, then `check_spend_guard`.

Expect **FALSE** → **BLOCKED**.
