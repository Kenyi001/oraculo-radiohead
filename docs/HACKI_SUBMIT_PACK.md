# Hacki Submit Pack — Casandra (copy-paste para Ronald)

**Owner submit:** **Ronald / Augusto** (@RonaldGaymer2002) — issues [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (video) + [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7) (BUIDL).  
**One-pager (empezá acá):** [RONALD.md](RONALD.md)  
**Deadline:** **Sun 23 Aug ~11:00 America/La_Paz** / **~12:00 ARG**  
**Hackathon:** [Aleph Hackathon 2026 (Hacki)](https://hacki.crecimiento.build/h/aleph-hackathon-2026)

Tras el video (#6), usa este archivo para el BUIDL. Dax **no** hace el click de Submit.

---

## 0) Video — subir aquí (YouTube Unlisted)

**Link de subida:** https://www.youtube.com/upload  
(o Studio: https://studio.youtube.com)

1. Graba ≤3 min con [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md) (70% Pulse / 20% WDK / 10% tracks).
2. Subí el archivo a YouTube → visibilidad **Unlisted**.
3. Copiá la URL `https://www.youtube.com/watch?v=...`
4. Pegala en **tres sitios**:
   - Issue [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6)
   - README (`Demo video:`)
   - Hacki campo **Demo link\***
5. Luego Submit del proyecto (General + WDK).

Mientras no haya video: **Save draft** (podés poner live demo temporalmente). **Submit** solo cuando Demo link sea YouTube.

---

## 1) Team (1–4) — registrar a todos en Hacki / Application Form / Telegram / Luma SCZ

| Nombre | GitHub | Rol |
|--------|--------|-----|
| Dax | [@Kenyi001](https://github.com/Kenyi001) | Core / MCP / WDK unlock (#8) |
| David | [@arnez69](https://github.com/arnez69) | Market Pulse |
| Victor | [@Vctor11180](https://github.com/Vctor11180) | On-chain registry |
| Augusto / Ronald | [@RonaldGaymer2002](https://github.com/RonaldGaymer2002) | Pitch, video, **Hacki submit** |

Checklist por miembro (Hacki oficial):

- [ ] Application Form Aleph
- [ ] Telegram del evento
- [ ] Luma Santa Cruz (si aplica presencial)

---

## 2) Hacki form — campos exactos (copy-paste)

| Campo Hacki | Valor |
|-------------|--------|
| **Project name\*** | `Casandra` |
| **One-line description\*** | `Casandra gives AI agents sourced, timestamped market evidence — price, risk, news, and why — so the agent can decide on its own. Not predictions. Not financial advice. WDK optional for execution under evidence.` |
| **Demo link\*** | URL YouTube Unlisted de #6 (mientras draft: `https://casandra-two.vercel.app`) |
| **Repository link\*** | `https://github.com/Kenyi001/oraculo-radiohead` |
| **Project logo** | (opcional) vacío OK |
| **Tracks\*** | **WDK Track** + **General Track** — **no** Pears, **no** QVAC |
| **Where did you build?\*** | Santa Cruz, Bolivia (o opción SCZ / Crecimiento del dropdown) |
| **Telegram\*** | tu `@` real del evento |
| **Contact email\*** | `daxkenyi001@gmail.com` |
| **Team members** | emails del equipo (hasta 4), si los tienen |

### Details\* (pegar en el editor)

```markdown
## What is Casandra?

Casandra is a **decision substrate** for AI agents: a consume-only **Evidence Pack** (live price, risk, Fear & Greed, headlines, structured why + numbered reasons + timestamps). The **agent decides**. We do **not** predict prices and we do **not** move money for the user.

## Problem

Agents invent prices and invent reasons. Without a sourced pack they scrape, guess, and mix news by eye — then act on hallucinations.

## How it works

1. Agent calls `get_market_pulse` (MCP) or opens the live demo.
2. Casandra returns one JSON Evidence Pack (`consume_only: true`, algorithms `casandra-pulse-v1` / `casandra-risk-v1`).
3. Agent reads `why`, `reasons[]`, meters, headlines — and decides.
4. **Optional (WDK sponsor):** only if the agent chooses to act → `check_wdk_guardrail` → WDK `send_token` with `dryRun: true` (never the product core).

## Demo

- Live web: https://casandra-two.vercel.app
- Pitch video: _(YouTube Unlisted — pegar URL de #6)_
- Same engine in Cursor via MCP (`get_market_pulse`)

## On-chain proof

- `CasandraRegistry` on **Ethereum Sepolia**
- Address: `0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`
- Explorer: https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF

## WDK packages used

- `@tetherto/wdk@1.0.0-beta.16`
- `@tetherto/wdk-cli@1.0.0-beta.3` (`wdk-mcp`)

## Tracks

Submitted under **General** + sponsor **WDK**. Not financial advice.
```

---

## 3) Links fijos

| Qué | URL / valor |
|-----|-------------|
| Repo | https://github.com/Kenyi001/oraculo-radiohead |
| Live demo (Details) | https://casandra-two.vercel.app |
| Contract (Ethereum Sepolia) | `0x27544Fe45b81C09fC91f99c0A7374970839eC4FF` |
| Explorer | https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF |
| **Video upload** | https://www.youtube.com/upload |
| Video ≤3 min (Demo link) | _pegar YouTube Unlisted de #6_ |
| Hacki home | https://hacki.crecimiento.build/h/aleph-hackathon-2026 |
| WDK track page | https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track |

### WDK packages (track must-use)

| Package | Version |
|---------|---------|
| `@tetherto/wdk` | `1.0.0-beta.16` |
| `@tetherto/wdk-cli` | `1.0.0-beta.3` |

Permalinks jueces WDK → [WDK.md](WDK.md)

---

## 4) Checklist Submit (antes del click)

- [ ] Tracks: solo **General** + **WDK**
- [ ] Repo abre
- [ ] Demo link = YouTube Unlisted (≤3 min)
- [ ] Details incluyen live demo + contract + WDK packages
- [ ] Telegram + email llenos
- [ ] **Submit** antes de **Sun 23 Aug ~11:00 BO / ~12:00 ARG**
- [ ] Comentar BUIDL URL en [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7) y cerrar #7

---

## 5) Orden del día

```
#8 Dax unlock wallet (tramo WDK del video)
    → #6 Ronald graba ≤3 min
    → sube https://www.youtube.com/upload (Unlisted)
    → pega watch URL en #6 + README + Hacki Demo link
    → #7 Submit General+WDK con ESTE pack
```

Guion: [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md) · [SUBMIT.md](SUBMIT.md)

## 6) Ya listo (no bloquea)

- [#5](https://github.com/Kenyi001/oraculo-radiohead/issues/5) Vercel live  
- [#10](https://github.com/Kenyi001/oraculo-radiohead/issues/10) Contract Sepolia **cerrado**  
- [#17](https://github.com/Kenyi001/oraculo-radiohead/issues/17) Pulse quality **cerrado**
