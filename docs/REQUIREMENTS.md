# Casandra — Requirements checklist

Work framework: **Constitution** → **this file** → [TASKS.md](../TASKS.md) → [GitHub Issues](https://github.com/Kenyi001/oraculo-radiohead/issues) → DoD Sunday.

Track lock: [TRACK.md](TRACK.md) (General default + **WDK** sponsor) · WDK: [WDK.md](WDK.md) · Submit: [SUBMIT.md](SUBMIT.md)

---

## A. Mínimo Hacki

- [x] Open-source repo + README
- [ ] Demo video ≤3 min (EN or ES + English captions) — include Casandra→WDK
- [ ] DoraHacks/Hacki: **General** (default) + mark **WDK**
- [ ] Pitch / demo optimized for **General** criteria (5 below)
- [ ] Contract address provided **if** contract deployed
- [ ] Feature code committed in hackathon window (post-kickoff)
- [ ] Team 1–4; each member registered on Aleph / Luma SCZ

## B. Producto Casandra

- [x] R1 `get_price`
- [x] R2 `get_portfolio_state`
- [x] R3 `get_risk_level` (`casandra-risk-v1` + factors + `action`)
- [x] R4 `get_market_context`
- [x] R5 `health`
- [x] R-WDK `check_wdk_guardrail` + `@tetherto/wdk` / `@tetherto/wdk-cli` deps
- [x] Shared `@oraculo/market-core` for MCP + web
- [x] Demo UI: gauge + portfolio with USDT ballast + WDK action
- [x] Formula + disclaimer in README

## C. Entrega demo (General criteria)

| Criterion | Proof | Status |
|---|---|---|
| Technicality | MCP + core + risk + WDK guardrail (+ registry) | core+WDK done · registry pending faucet |
| Originality | Hallucinations + unsafe send → gated JSON | done in pitch |
| UI/UX/DX | Web gauge + dual MCP config | UI done · polish open |
| Practicality | Live CoinGecko / WDK test wallet | done / human unlock |
| Presentation | ≤3 min video with WDK loop | open (#6) |

- [ ] Live Vercel URL in README (#5)
- [ ] Video URL in README (#6)
- [ ] Demo shows MCP tool **or** JSON + gauge
- [ ] On-chain address visible in demo footer (#10)

## D. On-chain (alcance fijo)

- [x] `CasandraRegistry` — `publishRiskSnapshot(bytes32 portfolioHash, uint8 band, uint256 score, uint256 timestamp)`
- [x] Compile + local Hardhat smoke deploy
- [ ] Deploy **Base Sepolia** (needs faucet-funded `PRIVATE_KEY` — see `contracts/deployments/baseSepolia.json`)
- [ ] Address + explorer link in README
- [ ] Address shown in demo web (footer wired to `VITE_CASANDRA_*`)
- [x] Out of P0: trading, custody, real USDT transfer, multi-chain

## E. Submit DoD (dom ~11:00 BO)

- [ ] `npm run build` OK
- [ ] README: live URL + video URL + contract address
- [ ] Hacki/DoraHacks BUIDL submitted — **General + WDK**
- [ ] Issue #7 closed
- [ ] WDK packages + permalinks listed in README / [WDK.md](WDK.md)

## Optional / P1 (only if A–E green)

- [ ] Market Pulse (#17)
- [ ] UI polish (#11)
