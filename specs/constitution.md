# Casandra — Constitution

Non-negotiable rules for the Aleph Hackathon 2026 build.

## Product

**Casandra** (Greek prophetess): MCP + UI that gives AI investment agents *current position state*, *fast market context*, and a *transparent risk level* — with timestamps, not hallucinations.

Repo codename: `oraculo-radiohead` · GitHub: https://github.com/Kenyi001/oraculo-radiohead

## Team

| Role | Owner | Scope |
|---|---|---|
| MCP + `market-core` + risk + submit | **Dax** (Kenyi001) | Tools, formula, data, Hacki |
| Market Pulse (favor de mercado + medidores agentes) | **David** (arnez69) | Investigación + aplicación pulse (#17) |
| Contrato + Web3 deploy | **Vctor11180** | CasandraRegistry Base Sepolia (#10) |
| Demo web + UI polish + video support | **Partner** / equipo | Casandra UI, Vercel, recording help |

## Direction

**General (default) + sponsor WDK.** Pitch, maintenance, guardrails: [docs/DIRECTION.md](../docs/DIRECTION.md) · [docs/TRACK.md](../docs/TRACK.md) · [docs/WDK.md](../docs/WDK.md).

## Rules

1. **Hackathon code window** — feature work after official kickoff; disclose reused libraries only.
2. **Explainable risk** — formula documented in README; never claim prediction or financial advice.
3. **Single source of truth** — web and MCP call the same `@oraculo/market-core` APIs.
4. **Demo** — ≤3 min video (EN preferred) + live deploy URL for judges without MCP; video must show Casandra→WDK loop.
5. **USDT in product** — happy path includes **USDT** as ballast; WDK is the sponsor execution path.
6. **Tracks** — General by default + mark **WDK** on DoraHacks/Hacki. Do not mark QVAC/Pears. See [docs/TRACK.md](../docs/TRACK.md).
7. **Deadline** — Sun 23 Aug ~11:00 America/La_Paz.
8. **Work framework** — Constitution → [docs/REQUIREMENTS.md](../docs/REQUIREMENTS.md) → [TASKS.md](../TASKS.md) → GitHub Issues.
9. **WDK safety** — agent must call Casandra guardrail before `send_token`; `avoid` blocks send. Dedicated test wallet only.

## Out of constitution (forbidden as P0)

Trading execution · real custody · black-box ML · full multi-chain · QVAC/Pears as blockers.
