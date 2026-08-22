# Casandra — Constitution

Non-negotiable rules for the Aleph Hackathon 2026 build.

## Product

**Casandra** (Greek prophetess): MCP + UI that gives AI investment agents *current position state*, *fast market context*, and a *transparent risk level* — with timestamps, not hallucinations.

Repo codename: `oraculo-radiohead` · GitHub: https://github.com/Kenyi001/oraculo-radiohead

## Team

| Role | Owner | Scope |
|---|---|---|
| MCP + `market-core` + risk algorithm | **Dax** (Kenyi001) | Tools, formula, data |
| Demo web + UI polish + video support | **Partner** (name TBD) | Casandra UI, deploy, recording help |

## Rules

1. **Hackathon code window** — feature work after official kickoff; disclose reused libraries only.
2. **Explainable risk** — formula documented in README; never claim prediction or financial advice.
3. **Single source of truth** — web and MCP call the same `@oraculo/market-core` APIs.
4. **Demo** — ≤3 min video (EN preferred) + live deploy URL for judges without MCP.
5. **USDT in product** — happy path includes **USDT** as ballast in risk math (flavor for LATAM stables). Optional bounty only if form allows *with* AI track — never blocks P0.
6. **One challenge track + General judging** — submit **AI** track; optimize demo/video for Hacki **General** criteria. See [docs/TRACK.md](../docs/TRACK.md). No multi-challenge-track.
7. **Deadline** — Sun 23 Aug ~11:00 America/La_Paz.
8. **Work framework** — Constitution → [docs/REQUIREMENTS.md](../docs/REQUIREMENTS.md) → [TASKS.md](../TASKS.md) → GitHub Issues.

## Out of constitution (forbidden as P0)

Trading execution · real custody · black-box ML · full multi-chain · QVAC/Pears as blockers.
