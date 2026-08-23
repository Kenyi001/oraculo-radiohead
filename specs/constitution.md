# Casandra — Constitution

Non-negotiable rules for the Aleph Hackathon 2026 build.

## Product

**Casandra** (Greek prophetess): a **lie detector** for AI agents that talk about money — audits claims vs live market evidence, seals a contradiction receipt, and **blocks USDT spend** via WDK when the verdict is `FALSE`.

Repo codename: `oraculo-radiohead` · GitHub: https://github.com/Kenyi001/oraculo-radiohead

## Team

| Role | Owner | Scope |
|---|---|---|
| MCP + `market-core` + audit + WDK gate | **Dax** (Kenyi001) | Tools, formula, guardrail |
| Demo web + UI polish + video support | **Partner** (name TBD) | Casandra UI, deploy, recording help |

## Rules

1. **Hackathon code window** — feature work after official kickoff; disclose reused libraries only.
2. **Explainable audit** — contradictions + formula documented; never claim prediction or financial advice.
3. **Single source of truth** — web and MCP call the same `@oraculo/market-core` APIs.
4. **Demo** — ≤3 min video (EN or ES + English captions) + live deploy URL.
5. **USDT** — asset protected by the spend gate (not decorative ballast).
6. **Tracks** — **General** + **WDK Track 1**. WDK is core to the product loop, not optional. See [docs/TRACK.md](../docs/TRACK.md).
7. **Deadline** — Sun 23 Aug ~11:00 America/La_Paz.
8. **Work framework** — Constitution → [docs/REQUIREMENTS.md](../docs/REQUIREMENTS.md) → [TASKS.md](../TASKS.md) → GitHub Issues.

## Out of constitution (forbidden as P0)

Trading execution · real custody · black-box ML · full multi-chain · QVAC/Pears as blockers · pitching as a generic price oracle.
