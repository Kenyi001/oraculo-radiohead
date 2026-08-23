# Judge one-pager — Casandra vs WWall (WDK Track 1)

**Casandra** = lie detector for AI agents that talk about money.  
**Your USDT stays in your WDK wallet.** Casandra never custodies — it only opens or closes the spend door after sealing claim truth.

## One-liner

They can speak. They cannot seal a lie — and they cannot spend USDT on one.

## Pain we attack

| Failure mode | What happens without Casandra |
|---|---|
| Hallucinated txs | Agent invents ETH $8,000 / “low risk” and still calls send |
| Unauthorized MCP sends | Tool-call path moves funds without a truth check |
| Prompt-injection drains | Injected text pushes spend tools while the claim is false |

## Core loop (WDK is not bolted on)

```
audit_claim → seal receipt (hash) → check_spend_guard → WDK dry-run
```

If sealed verdict is `FALSE` → **BLOCKED** (no broadcast).

## Why we beat WWall for Track 1 (complement, then win the angle)

| | **WWall** | **Casandra** |
|---|---|---|
| Question | *May this wallet spend?* (policy / limits / allowlists) | *Is the agent’s claim true?* (evidence seal) |
| Gate input | Wallet rules | Sealed contradiction receipt |
| Custody | Wallet-side policy | **Never custodies** — door on *your* WDK wallet |
| Demo proof | Policy MCP | Live: wallet 500 USDT → lie → **FALSE** → Send 200 → **BLOCKED** |

Judges: we are the missing **truth gate** in front of WDK. Policy MCPs still matter; they do not seal lies.

## Evidence pack for Tether judges

| Item | Link |
|---|---|
| Live demo | https://casandra-two.vercel.app |
| Logo | https://casandra-two.vercel.app/casandra-icon.jpg |
| Repo | https://github.com/Kenyi001/oraculo-radiohead |
| Spend gate | https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/src/wdkGuard.ts |
| MCP tools | https://github.com/Kenyi001/oraculo-radiohead/blob/master/packages/mcp-server/src/index.ts |
| HTTP loop | `POST /api/audit-claim` → `POST /api/check-spend-guard` (+ `receipt`) |
| Registry (Sepolia) | `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` |
| Explorer | https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975 |
| Packages | `@tetherto/wdk@1.0.0-beta.16` · `@tetherto/wdk-cli@1.0.0-beta.3` |
| BUIDL | https://hacki.crecimiento.build/h/aleph-hackathon-2026/buidls/96a0e616-5b7e-4577-84a0-6deb3d0d0a28 |

## Tracks

**General** + **WDK Track 1** (not QVAC). Not financial advice. Dry-run only.
