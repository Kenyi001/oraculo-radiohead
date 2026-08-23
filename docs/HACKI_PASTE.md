# Hacki BUIDL — paste checklist

Tracks: **General** + **WDK Track 1**

## One-liner

Casandra is a lie detector for AI agents that talk about money. They can speak. They cannot seal a lie — and they cannot spend USDT on one.

## About

Your USDT stays in your WDK wallet — Casandra never custodies. Agents invent prices and still call send tools (hallucinated txs, unauthorized MCP sends, prompt-injection drains). Casandra audits the claim against live market evidence, seals a contradiction receipt (hash), and blocks WDK USDT dry-run when the verdict is FALSE. Complements wallet-policy MCPs (e.g. WWall): we gate on claim truth, not just spend limits. Not predictions. Not financial advice.

## Links

- Demo: https://casandra-two.vercel.app
- Repo: https://github.com/Kenyi001/oraculo-radiohead
- Registry: `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975`
- Explorer: https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975
- API: `GET https://casandra-two.vercel.app/api/health` · `POST /api/audit-claim` · `POST /api/check-spend-guard`
- MCP (general + lite): `docs/MCP.md` · `packages/mcp-server` · `packages/mcp-lite`

## WDK packages

- `@tetherto/wdk@1.0.0-beta.16`
- `@tetherto/wdk-cli@1.0.0-beta.3`

## Permalinks (Tether judges)

- https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/src/wdkGuard.ts
- https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/src/index.ts

## Judge angle (optional Details blurb)

WWall asks “may this wallet spend?” Casandra asks “is the agent’s claim true?” — then seals the answer and blocks WDK dry-run on FALSE. Demo proof: wallet 500 USDT → lie → FALSE → Send 200 → BLOCKED. See docs/JUDGE_ONEPAGER.md.
