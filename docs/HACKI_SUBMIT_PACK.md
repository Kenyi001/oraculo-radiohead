# Hacki Submit Pack — Casandra (copy-paste para Ronald)

**Owner submit:** **Ronald / Augusto** (@RonaldGaymer2002) — issues [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (video) + [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7) (BUIDL).  
**Grabar:** [RONALD_PITCH.md](RONALD_PITCH.md) · **One-pager:** [RONALD.md](RONALD.md) · **Paste corto:** [HACKI_PASTE.md](HACKI_PASTE.md)  
**Deadline:** **Sun 23 Aug ~11:00 America/La_Paz** / **~12:00 ARG**  
**Hackathon:** [Aleph Hackathon 2026 (Hacki)](https://hacki.crecimiento.build/h/aleph-hackathon-2026)

Dax **no** hace el click de Submit.

---

## 0) Video — subir aquí (YouTube Unlisted)

**Link de subida:** https://www.youtube.com/upload

1. Grabá ≤3 min con [RONALD_PITCH.md](RONALD_PITCH.md) (wallet → FALSE → BLOCKED).
2. Quemá [captions.en.srt](captions.en.srt).
3. Subí → visibilidad **Unlisted**.
4. Pegá `https://www.youtube.com/watch?v=...` en [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6), README, Hacki **Demo link\***. También setiá `VITE_DEMO_VIDEO_URL` en Vercel (`casandra-two`) y redeploy para el embed en https://casandra-two.vercel.app/#pitch-video.
5. Submit General + WDK.

---

## 1) Team (1–4)

| Nombre | GitHub | Rol |
|--------|--------|-----|
| Dax | [@Kenyi001](https://github.com/Kenyi001) | Core / MCP / WDK gate |
| David | [@arnez69](https://github.com/arnez69) | Market evidence |
| Victor | [@Vctor11180](https://github.com/Vctor11180) | On-chain registry |
| Augusto / Ronald | [@RonaldGaymer2002](https://github.com/RonaldGaymer2002) | Pitch, video, **Hacki submit** |

---

## 2) Hacki form — campos exactos (copy-paste)

| Campo Hacki | Valor |
|-------------|--------|
| **Project name\*** | `Casandra` |
| **One-line description\*** | `Casandra is a lie detector for AI agents that talk about money. They can speak. They cannot seal a lie — and they cannot spend USDT on one.` |
| **Demo link\*** | URL YouTube Unlisted de #6 (mientras draft: `https://casandra-two.vercel.app`) |
| **Repository link\*** | `https://github.com/Kenyi001/oraculo-radiohead` |
| **Tracks\*** | **WDK Track** + **General Track** — **no** Pears, **no** QVAC |
| **Where did you build?\*** | Santa Cruz, Bolivia |
| **Telegram\*** | tu `@` real del evento |
| **Contact email\*** | `daxkenyi001@gmail.com` |

### Details\* (pegar en el editor)

```markdown
## What is Casandra?

Casandra is a **lie detector** for AI agents that talk about money. Your USDT stays in **your** WDK wallet — Casandra never custodies. Agents invent prices and still call send tools; we audit the claim against live market evidence, seal a contradiction receipt (hash), and **block** WDK USDT dry-run when the verdict is FALSE.

## Problem

Hallucinated txs, unauthorized MCP sends, prompt-injection drains — the agent lies about the market and still wants to move USDT.

## How it works

1. Agent claim (or demo lie: ETH $8,000 + low risk + send now).
2. `audit_claim` → claim vs live world → verdict TRUE / MIXED / FALSE + contradictions.
3. Seal receipt (`id`, `hash`).
4. `check_spend_guard` → if FALSE, WDK dry-run is **BLOCKED** (no broadcast).

## Why not just WWall?

WWall asks “may this wallet spend?” (policy). Casandra asks “is the agent’s claim true?” then seals the answer. Complementary — we win Track 1 on the **truth gate**.

## Demo

- Live: https://casandra-two.vercel.app
- Pitch video: _(YouTube Unlisted — pegar URL de #6)_
- Story: wallet 500 USDT → lie → FALSE → Send 200 → BLOCKED

## On-chain proof

- Registry on **Ethereum Sepolia**
- Address: `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975`
- Explorer: https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975

## WDK packages used

- `@tetherto/wdk@1.0.0-beta.16`
- `@tetherto/wdk-cli@1.0.0-beta.3`

Permalinks: `packages/mcp-server/src/wdkGuard.ts` · `packages/mcp-server/src/index.ts`

## Tracks

**General** + **WDK Track 1**. Not financial advice. Dry-run only.
```

---

## 3) Links fijos

| Qué | URL / valor |
|-----|-------------|
| Repo | https://github.com/Kenyi001/oraculo-radiohead |
| Live demo | https://casandra-two.vercel.app |
| Contract (Ethereum Sepolia) | `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` |
| Explorer | https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975 |
| Video upload | https://www.youtube.com/upload |
| BUIDL | https://hacki.crecimiento.build/h/aleph-hackathon-2026/buidls/96a0e616-5b7e-4577-84a0-6deb3d0d0a28 |
| Judge one-pager | [JUDGE_ONEPAGER.md](JUDGE_ONEPAGER.md) |

### WDK packages

| Package | Version |
|---------|---------|
| `@tetherto/wdk` | `1.0.0-beta.16` |
| `@tetherto/wdk-cli` | `1.0.0-beta.3` |

---

## 4) Checklist Submit

- [ ] Tracks: solo **General** + **WDK**
- [ ] One-liner + About = custody story ([HACKI_PASTE.md](HACKI_PASTE.md))
- [ ] Demo link = YouTube Unlisted (≤3 min) with EN captions
- [ ] Details incluyen live + contract `0xc9fcDEC1…` + WDK packages
- [ ] **Submit** antes de **Sun 23 Aug ~11:00 BO**
- [ ] Comentar BUIDL URL en [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7)

## 5) Orden del día

```
RONALD_PITCH.md → grabar ≤3 min → YouTube Unlisted + captions
→ pegar watch URL en #6 + README + Hacki
→ Submit General+WDK con este pack / HACKI_PASTE.md
```

Guion: [RONALD_PITCH.md](RONALD_PITCH.md) · [SUBMIT.md](SUBMIT.md)
