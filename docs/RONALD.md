# Ronald — HACÉ ESTO AHORA (checklist)

> **NO uses** `PITCH_AUGUSTO.md`, Market Pulse, Evidence Pack, ni contrato `0x27544…`.  
> **Único guion:** [RONALD_PITCH.md](RONALD_PITCH.md) · **Único paste Hacki:** [HACKI_PASTE.md](HACKI_PASTE.md)

**Vos:** @RonaldGaymer2002 · Issues [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (video) + [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7) (Hacki)  
**Deadline:** Dom 23 Ago ~**11:00 America/La_Paz**  
**Live:** https://casandra-two.vercel.app  
**Logo Hacki:** https://casandra-two.vercel.app/casandra-icon.jpg  
**Tiempo total estimado:** ~40–50 min (grabar 15–20 · subir 10 · pegar 10–15)

---

## P0 HOY (orden — no saltees)

1. **Grabá** ≤3 min en https://casandra-two.vercel.app siguiendo [RONALD_PITCH.md](RONALD_PITCH.md) (click path abajo).
2. **Quemá** [captions.en.srt](captions.en.srt) → YouTube **Unlisted** → comentá la URL real en [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (+ avisá a Dax). **No inventes** URL de YouTube.
3. **Hacki:** pegá one-liner + Detalles de [HACKI_PASTE.md](HACKI_PASTE.md), logo `https://casandra-two.vercel.app/casandra-icon.jpg`, tracks General + WDK → comentá BUIDL en [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7).

---

## Checklist (marcá al terminar)

### A) Grabar (~15–20 min)

- [ ] 1. Abrí https://casandra-two.vercel.app con zoom **125%**. Cerrá notificaciones.
- [ ] 2. **No abras Cursor** en el video (opcional 10s al final solo si sobra tiempo).
- [ ] 3. Grabá ≤**3 min** siguiendo [RONALD_PITCH.md](RONALD_PITCH.md) verbatim.
- [ ] 4. Click path obligatorio en cámara:
  1. Header **CAS** icon + **Casandra** brand + tagline (custody)
  2. Badge / pill **Live API** (Agent path o status) — demo habla con `/api`
  3. **Your WDK wallet** → **500.00 USDT** · Self-custody · Agent wants **200 USDT**
  4. Claim / **Demo lie** si hace falta → sello **FALSE** (DevTools Network: `POST /api/audit-claim`)
  5. **Send 200 USDT** → **BLOCKED — money stays** (Network: `POST /api/check-spend-guard`)
  6. (Opcional 5–10s) **Agent path** — curl HTTP + MCP snippets
  7. Footer registry `0xc9fcDEC1…`

### B) Subir (~10 min)

- [ ] 5. Quemá captions EN: [captions.en.srt](captions.en.srt) (CapCut o YouTube Studio).
- [ ] 6. Subí a YouTube → **Unlisted**: https://www.youtube.com/upload  
  *(pegá solo la URL real que te dé YouTube — nunca inventes un link)*

### C) Pegar URL (~10 min) — 4 sitios

- [ ] 7. Comentario en issue [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) con `https://www.youtube.com/watch?v=...` (la tuya)
- [ ] 8. README del repo → línea `**Video:**` (reemplazá el placeholder)
- [ ] 9. Hacki → campo **Enlace de demostración\*** = URL YouTube Unlisted  
  *(mientras no haya video: dejá `https://casandra-two.vercel.app/` — la live también va en Detalles)*
- [x] 10. **Embed live:** `VITE_DEMO_VIDEO_URL=https://youtu.be/qXajugSdLak` → `#pitch-video` on https://casandra-two.vercel.app *(Dax redeployed)*

### D) Hacki BUIDL (~10–15 min) — OBLIGATORIO actualizar copy

El formulario viejo todavía puede decir “Evidence Pack / market evidence”. **Borrá eso.**

- [ ] 11. **Descripción de una línea\*** — pegá exactamente:

```
CAS (Casandra) is a lie detector for AI agents that talk about money — they can speak, but cannot seal a lie or spend USDT on one.
```

- [ ] 12. **Detalles\*** — pegá el bloque completo de [HACKI_PASTE.md](HACKI_PASTE.md) (sección Detalles*).  
  Aclara: **CAS** = isotype / icono · **Casandra** = producto.  
  Contrato: `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` (**no** `0x27544…`).
- [ ] 12b. **Logotipo** (si hay campo): `https://casandra-two.vercel.app/casandra-icon.jpg`
- [ ] 13. **Tracks:** solo **General** + **WDK** (no Pears, no QVAC).
- [ ] 14. **Repo:** `https://github.com/Kenyi001/oraculo-radiohead`
- [ ] 15. Guardá / actualizá el submit (ya está “Presentado” — podés editar hasta el cierre).
- [ ] 16. Comentá la URL del BUIDL en issue [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7)

---

## Detalles Hacki (backup — mismo texto que HACKI_PASTE)

```
## What is CAS / Casandra?

**CAS** is the app isotype; **Casandra** is the product — a lie detector for AI agents that talk about money. Your USDT stays in your WDK wallet — Casandra never custodies. Agents can speak. They cannot seal a lie — and they cannot spend USDT on one.

## Problem

Agents invent prices and still call send tools (hallucinated txs, unauthorized MCP sends, prompt-injection drains).

## How it works

1. Agent states a money claim (demo lie: ETH is $8,000 — send USDT).
2. Casandra audits vs live market evidence and seals a receipt (TRUE / MIXED / FALSE + hash).
3. Before WDK send: check_spend_guard(receipt) — pass receipt_id + full receipt on HTTP.
4. If FALSE → USDT dry-run BLOCKED. Money never moves.

## Demo

- Live: https://casandra-two.vercel.app
- Story: wallet 500 USDT → lie → FALSE → Send 200 USDT → BLOCKED
- Network: POST /api/audit-claim · POST /api/check-spend-guard
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

## Ya listo (no te bloquea)

| Item | Link |
|------|------|
| Demo live | https://casandra-two.vercel.app |
| Logo / isotype | https://casandra-two.vercel.app/casandra-icon.jpg |
| API health | https://casandra-two.vercel.app/api/health |
| Repo | https://github.com/Kenyi001/oraculo-radiohead |
| Contract | https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975 |
| Guion | [RONALD_PITCH.md](RONALD_PITCH.md) |
| Captions | [captions.en.srt](captions.en.srt) |
| Vs WWall | [JUDGE_ONEPAGER.md](JUDGE_ONEPAGER.md) |
| BUIDL | https://hacki.crecimiento.build/h/aleph-hackathon-2026/buidls/96a0e616-5b7e-4577-84a0-6deb3d0d0a28 |

**No esperés a Dax para grabar:** la demo ya muestra custody + FALSE + BLOCKED + Live API.  
Cuando pegues la URL en #6, Dax setea el embed en la plataforma en minutos.
