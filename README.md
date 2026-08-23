# Casandra (repo: oraculo-radiohead)

**A lie detector for AI agents that talk about money.**  
They can speak. They cannot seal a lie — and they cannot spend USDT on one.

> Named after Cassandra, the prophetess. Built for [Aleph Hackathon 2026](https://hacki.crecimiento.build/h/aleph-hackathon-2026) — Santa Cruz (EMI / Ethereum Bolivia).  
> Spec-driven: [specs/constitution.md](specs/constitution.md) · [TASKS.md](TASKS.md)

## One-liner

Agents invent prices and risk takes, then ask to move USDT. **Your USDT stays in your WDK wallet** — Casandra never custodies. It audits the claim against live market evidence, seals a contradiction receipt (hash), and **blocks WDK USDT dry-run** when the verdict is `FALSE`.

## Problem / Solution

Community precedent (MCP + agent wallets):

1. Agents **hallucinate** prices/amounts and still execute ([esso.dev MCP risks](https://esso.dev/faq/security-risks-blockchain-mcp-servers)).
2. Crypto MCP tools can enable **unauthorized sends** without a strong gate ([thirdweb MCP advisory](https://mcpsec.dev/advisories/2025-09-03-thirdweb-mcp-unauthorized-transactions/)).
3. Prompt-injection chains in Web3 agents can push **tool calls that drain wallets** ([ZealyNX](https://www.zealynx.io/research/adversarial-security/indirect-prompt-injection)).

Casandra attacks the link *“the agent lied about the market and still wants to move USDT”*: seal the contradiction, then **block** WDK dry-run send on `FALSE`. Complements WWall (wallet policy) — we gate on **claim truth**.

| Generic MCP oracles | Casandra |
|---|---|
| Return prices / “risk scores” | Compare **what the agent said** vs **the world** |
| Agent still decides alone | Sealed receipt + spend gate |
| WDK bolted on (Tether rejects) | WDK dry-run is the **core loop** after the seal |

## Aleph 2026 tracks

| | |
|---|---|
| **General** | Technicality · Originality · UI/UX/DX · Practicality · Presentation |
| **WDK Track 1** | CLI / MCP — agent wallet flows with guardrails ([docs/TRACK.md](docs/TRACK.md)) |
| Chapter | [Santa Cruz EMI](https://aleph-hackathon-2026-santa-cruz.vercel.app/#lugar) |
| Platform | [Hacki](https://hacki.crecimiento.build/h/aleph-hackathon-2026) |

## Demo (judges)

**Live:** https://casandra-two.vercel.app  
**Repo:** https://github.com/Kenyi001/oraculo-radiohead  
**Video:** _Ronald: paste YouTube Unlisted URL here after upload_ (then tell Dax → `VITE_DEMO_VIDEO_URL` + redeploy for `#pitch-video`)  
**BUIDL:** https://hacki.crecimiento.build/h/aleph-hackathon-2026/buidls/96a0e616-5b7e-4577-84a0-6deb3d0d0a28

Open the demo → default claim is a lie (`ETH is $8,000…`) → seal shows **FALSE** → **Send 200 USDT** → **BLOCKED**.  
Pitch checklist for Ronald: [docs/RONALD.md](docs/RONALD.md)

## MCP tools (hero)

| Tool | Purpose |
|---|---|
| `audit_claim` | Parse claim → live quotes + risk → `TRUE` / `MIXED` / `FALSE` + contradictions |
| `seal_receipt` | Persist sealed receipt (`id`, `hash`, `hash_bytes32`) |
| `check_spend_guard` | **WDK gate** — `FALSE` → blocked; else dry-run preview (no broadcast) |

### Evidence sources (supporting)

`get_price` · `get_portfolio_state` · `get_risk_level` · `get_market_context` · `get_market_summary` · `health`

Package docs: [packages/mcp-server/README.md](packages/mcp-server/README.md)

## HTTP API (same loop)

Live base: https://casandra-two.vercel.app

| Method | Path | Body |
|---|---|---|
| `POST` | `/api/audit-claim` | `{ "text"?: string }` |
| `POST` | `/api/seal-receipt` | `{ "text"?: string }` |
| `POST` | `/api/check-spend-guard` | `{ "receipt_id": string, "receipt"?: SealedReceipt }` |
| `GET` | `/api/health` | — |

Pass the full `receipt` from audit when calling spend-guard across serverless instances. Dry-run only.

## WDK integration (permalinks for Tether)

Judges: start here.

| What | Where |
|---|---|
| Spend gate (core) | [`packages/mcp-server/src/wdkGuard.ts`](packages/mcp-server/src/wdkGuard.ts) |
| MCP tool `check_spend_guard` | [`packages/mcp-server/src/index.ts`](packages/mcp-server/src/index.ts) (search `check_spend_guard`) |
| Verdict → block logic | [`packages/market-core/src/index.ts`](packages/market-core/src/index.ts) — `checkSpendGuard` |
| Packages | `@tetherto/wdk@1.0.0-beta.16` · `@tetherto/wdk-cli@1.0.0-beta.3` |

Flow: `audit_claim` → `seal_receipt` → `check_spend_guard(receipt_id)`. If sealed `FALSE`, USDT does not move.

## Risk algorithm (evidence)

```
score = 0.45 * abs_change_component
      + 0.35 * relative_vol_vs_btc
      + 0.20 * (100 - usdt_share_pct)
```

Used inside `audit_claim` when the agent claims a risk band. USDT share lowers portfolio risk — and USDT is what the WDK gate protects.

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

Replace the path with your clone. Build: `npm run build -w @oraculo/mcp-server`.  
See [packages/mcp-server/README.md](packages/mcp-server/README.md) and [docs/mcp-casandra-wdk.example.json](docs/mcp-casandra-wdk.example.json).

Ask: *“Audit this claim with Casandra, then check_spend_guard on the receipt.”*

## On-chain (CasandraRegistry)

Receipt hash can be anchored via `publishRiskSnapshot(bytes32 hash, …)` on Sepolia.

**Contract address (Ethereum Sepolia):** `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975`  
**Explorer:** https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975

Base Sepolia deploy is pending faucet for `0x4f30B06F8884F8632532A8fdDAd5C8CEc34f71f4` — see [contracts/deployments/baseSepolia.json](contracts/deployments/baseSepolia.json).

See [contracts/README.md](contracts/README.md).

## Video / captions

Pitch script + English SRT: [docs/SUBMIT.md](docs/SUBMIT.md) · [docs/VIDEO.md](docs/VIDEO.md) · [docs/captions.en.srt](docs/captions.en.srt)

Judging is async in **English or Spanish with English captions**. Burn `captions.en.srt` into the video.

## Disclaimer

**Not financial advice.** Casandra does not execute trades, predict returns, or move funds. WDK path is dry-run only in this demo.

## License

MIT
