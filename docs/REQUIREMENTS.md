# Casandra — Requirements checklist

Work framework: **Constitution** → **this file** → [TASKS.md](../TASKS.md) → [GitHub Issues](https://github.com/Kenyi001/oraculo-radiohead/issues) → DoD Sunday.

Track lock: [TRACK.md](TRACK.md) · Submit script: [SUBMIT.md](SUBMIT.md)

---

## A. Mínimo Hacki

- [x] Open-source repo + README
- [ ] Demo video ≤3 min (EN or ES + English captions)
- [ ] DoraHacks/Hacki: **General** + **WDK Track 1**
- [ ] Pitch / demo optimized for **General** criteria
- [x] Contract address provided (Sepolia registry)
- [ ] Feature code committed in hackathon window (post-kickoff)
- [ ] Team 1–4; each member registered on Aleph / Luma SCZ

## B. Producto Casandra (lie detector)

- [x] `audit_claim` — verdict + contradictions + receipt
- [x] `seal_receipt`
- [x] `check_spend_guard` — WDK dry-run gate (FALSE blocks USDT)
- [x] Evidence sources: price / portfolio / risk / context
- [x] Shared `@oraculo/market-core` for MCP + web
- [x] Demo UI: THE CLAIM vs THE WORLD + seal
- [x] Formula + disclaimer + WDK permalinks in README

## C. Entrega demo (General criteria)

| Criterion | Proof | Status |
|---|---|---|
| Technicality | Audit + hash + WDK gate | done |
| Originality | Lie detector (not price MCP) | done in pitch |
| UI/UX/DX | Split seal UI + MCP config | done |
| Practicality | FALSE blocks USDT send | done |
| Presentation | ≤3 min video + EN captions | open |

- [x] Live Vercel URL in README
- [ ] Video URL in README
- [x] Demo shows seal + spend gate
- [x] On-chain address visible in demo footer

## D. WDK (Track 1)

- [x] `@tetherto/wdk` + `@tetherto/wdk-cli` in package.json
- [x] Permalinks to `wdkGuard.ts` + `check_spend_guard`
- [x] Dry-run only — no live custody
- [ ] Video shows BLOCKED send

## E. Submit DoD (dom ~11:00 BO)

- [ ] `npm run build` OK
- [ ] README: live URL + video URL + contract + WDK versions
- [ ] Hacki BUIDL updated (one-liner + About)
- [ ] Captions burned into video
