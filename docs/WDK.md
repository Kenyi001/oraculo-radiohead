# Casandra + WDK (Aleph sponsor track)

**Tracks:** General (default) + **[WDK Track 1](https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track)** (CLI / `wdk-mcp`).

Official docs: [Use the MCP Server](https://docs.wdk.tether.io/cli/guides/use-mcp-server/) · [WDK home](https://docs.wdk.tether.io)

---

## Packages (versions pinned in root `package.json`)

| Package | Version | Role |
|---------|---------|------|
| `@tetherto/wdk` | `1.0.0-beta.16` | WDK core dependency (track must-use) |
| `@tetherto/wdk-cli` | `1.0.0-beta.3` | CLI + **`wdk-mcp`** + `wdk-daemon` |

After `npm install`, binaries: `npx wdk`, `npx wdk-mcp`.

---

## Permalinks (jueces WDK — miran esto primero)

| What | Link |
|------|------|
| Guardrail algorithm | [`packages/market-core/src/index.ts`](../packages/market-core/src/index.ts) — `checkWdkGuardrail`, `actionFromBand` |
| MCP tool for agents | [`packages/mcp-server/src/index.ts`](../packages/mcp-server/src/index.ts) — `check_wdk_guardrail` |
| Demo shows action | [`packages/demo-web/src/App.tsx`](../packages/demo-web/src/App.tsx) |
| Dual MCP config sample | [`docs/mcp-casandra-wdk.example.json`](mcp-casandra-wdk.example.json) |
| Agent policy | [`docs/AGENT_WDK_POLICY.md`](AGENT_WDK_POLICY.md) |

---

## Safety model (what we built)

```
1. unlock WDK wallet (human) — short TTL
2. agent: Casandra check_wdk_guardrail
3. if allow_wdk_send == false → NEVER send_token
4. if true → wdk-mcp get_balance / send_token dryRun:true → user confirm → dryRun:false
5. wdk wallet lock
```

| Casandra `action` | WDK |
|-------------------|-----|
| `proceed` | balance + send after confirm |
| `caution` | balance; send only dryRun / smaller size |
| `avoid` | **block** `send_token` |

---

## Setup (clean clone)

```bash
npm install
# Node >= 20 (WDK track recommends >= 22.18 when possible)

# Create a DEDICATED test wallet (never personal funds)
npx wdk wallet create --name casandra-dev --words 12
npx wdk wallet unlock --name casandra-dev --ttl 5
npx wdk wallet default --name casandra-dev
```

Copy env template: [`.env.wdk.example`](../.env.wdk.example)

### Cursor / MCP dual config

See [`mcp-casandra-wdk.example.json`](mcp-casandra-wdk.example.json):

- `casandra` → `npm run start:mcp` (oracle + guardrail)
- `wdk-wallet` → `wdk-mcp` (wallet tools)

Ask the agent:

> Check Casandra WDK guardrail for the demo portfolio. If allow_wdk_send, preview a Sepolia USDT send with dryRun true. If avoid, do not send.

---

## Demo video checklist (WDK judges)

1. Casandra web gauge shows `action` (proceed/caution/avoid)
2. Cursor: `check_wdk_guardrail` JSON
3. Cursor: `wdk-mcp` `get_balance` (wallet unlocked)
4. If allowed: `send_token` dryRun true — **not** mainnet with real money
5. Disclaimer

---

## Out of scope this weekend

- WDK gasless Track 2 (paymaster)
- QVAC / Pears
- Custody / production keys
