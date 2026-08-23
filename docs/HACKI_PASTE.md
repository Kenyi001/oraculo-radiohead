# Hacki BUIDL — paste checklist (CAS · Casandra)

Tracks: **General** + **WDK Track 1**  
Logo / isotype: **CAS** (app icon) = product **Casandra**

---

## Nombre del proyecto*

```
casandra
```

---

## Descripción de una línea*  ← PEGÁ ESTO

```
CAS (Casandra) is a lie detector for AI agents that talk about money — they can speak, but cannot seal a lie or spend USDT on one.
```

---

## Detalles*  ← PEGÁ ESTO (borrá Evidence Pack / Market Pulse viejo)

```
## What is CAS / Casandra?

**CAS** is the app isotype; **Casandra** is the product — a lie detector for AI agents that talk about money. Your USDT stays in your WDK wallet — Casandra never custodies. Agents can speak. They cannot seal a lie — and they cannot spend USDT on one.

## Problem

Agents invent prices and still call send tools (hallucinated txs, unauthorized MCP sends, prompt-injection drains).

## How it works

1. Agent states a money claim (demo lie: ETH is $8,000 — send USDT).
2. Casandra audits vs live market evidence and seals a receipt (TRUE / MIXED / FALSE + hash).
3. Before WDK send: check_spend_guard(receipt).
4. If FALSE → USDT dry-run BLOCKED. Money never moves.

## Demo

- Live: https://casandra-two.vercel.app
- Story: wallet 500 USDT → lie → FALSE → Send 200 USDT → BLOCKED
- MCP general: packages/mcp-server (casandra)
- MCP lite (low API): packages/mcp-lite (casandra-lite)
- API: GET /api/health · POST /api/audit-claim · POST /api/check-spend-guard

## Vs WWall (WDK Track)

WWall asks “may this wallet spend?” Casandra asks “is the agent’s claim true?” — then seals and blocks on FALSE.

## On-chain

- CasandraRegistry · Ethereum Sepolia
- 0xc9fcDEC150C8903b51F299dcBa308F453C4AB975
- https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975

## WDK packages

- @tetherto/wdk@1.0.0-beta.16
- @tetherto/wdk-cli@1.0.0-beta.3

## Tracks

General + WDK. Not financial advice.
```

---

## Enlace de demostración*

Mientras no haya video: `https://casandra-two.vercel.app/`  
Con video Unlisted: URL de YouTube (y dejá la live en Detalles).

## Logotipo del proyecto (opcional)

Si Hacki pide URL de imagen: subí `casandra-icon.jpg` a un host o usá el de la demo:

```
https://casandra-two.vercel.app/casandra-icon.jpg
```

## Links

- Demo: https://casandra-two.vercel.app
- Repo: https://github.com/Kenyi001/oraculo-radiohead
- MCP guide: docs/MCP.md
