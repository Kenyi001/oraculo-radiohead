# Aleph Hackathon 2026 — submission checklist

## Event constraints

- Deadline: **Sun 23 Aug ~11:00 Bolivia** (Hacki: 12:00 Argentina)
- Repo: public + README
- Demo video ≤ **3 minutes** (EN preferred for async judging)
- Deployed app URL for judges without MCP
- **General** by default + select sponsor track **WDK** on DoraHacks / Hacki → [TRACK.md](TRACK.md) · [WDK.md](WDK.md)
- Optimize pitch for **General** judging criteria
- If contract deployed → provide address
- Team size 1–4; each member applied individually

## Oraculo / Casandra deliverables

- [ ] `npm run build` succeeds
- [ ] MCP tools work in Cursor (incl. `check_wdk_guardrail`)
- [ ] Dual MCP: Casandra + `wdk-mcp` documented
- [ ] Demo web live on Vercel (URL in README)
- [x] CasandraRegistry address (Ethereum Sepolia) in README + demo

- [ ] Repo public: `Kenyi001/oraculo-radiohead`
- [ ] Video ≤3 min uploaded (YouTube or Drive) — Casandra→WDK loop
- [ ] Hacki / DoraHacks submit with **General + WDK**
- [ ] Apply Aleph + Luma chapter SCZ completed

Full checklist: [REQUIREMENTS.md](REQUIREMENTS.md)

## Pitch outline (video)

1. Problem — agents hallucinate prices / may send unsafely  
2. Solution — Casandra MCP + risk `action`  
3. WDK — guardrail → balance / dry-run send  
4. Live demo — web UI + Cursor  
5. On-chain registry address (optional proof)  
6. “Not financial advice” + repo URL

## Out of scope (v1)

Trading bots · custody · ML prediction · QVAC · Pears · WDK gasless Track 2
