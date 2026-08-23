# Ronald — HACÉ ESTO AHORA (checklist)

> **NO uses** `PITCH_AUGUSTO.md`, Market Pulse, Evidence Pack, ni contrato `0x27544…`.  
> **Único guion:** [RONALD_PITCH.md](RONALD_PITCH.md) · **Único paste Hacki:** [HACKI_PASTE.md](HACKI_PASTE.md)

**Vos:** @RonaldGaymer2002 · Issues [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (video) + [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7) (Hacki)  
**Deadline:** Dom 23 Ago ~**11:00 America/La_Paz**  
**Live:** https://casandra-two.vercel.app  
**Tiempo total estimado:** ~40–50 min (grabar 15–20 · subir 10 · pegar 10–15)

---

## Checklist (marcá al terminar)

### A) Grabar (~15–20 min)

- [ ] 1. Abrí https://casandra-two.vercel.app con zoom **125%**. Cerrá notificaciones.
- [ ] 2. **No abras Cursor** en el video (opcional 10s al final solo si sobra tiempo).
- [ ] 3. Grabá ≤**3 min** siguiendo [RONALD_PITCH.md](RONALD_PITCH.md) verbatim.
- [ ] 4. Click path obligatorio en cámara:
  1. Header **Casandra** (podés ignorar el bloque “Pitch video pending”)
  2. **Your WDK wallet** → **500.00 USDT** · Self-custody
  3. Claim / **Demo lie** si hace falta → sello **FALSE**
  4. **Send 200 USDT** → **BLOCKED — money stays**
  5. (Opcional 5s) sección **Agent path** MCP/API abajo
  6. Footer registry `0xc9fcDEC1…`

### B) Subir (~10 min)

- [ ] 5. Quemá captions EN: [captions.en.srt](captions.en.srt) (CapCut o YouTube Studio).
- [ ] 6. Subí a YouTube → **Unlisted**: https://www.youtube.com/upload

### C) Pegar URL (~10 min) — 4 sitios

- [ ] 7. Comentario en issue [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) con `https://www.youtube.com/watch?v=...`
- [ ] 8. README del repo → línea `**Video:**` (reemplazá el placeholder)
- [ ] 9. Hacki → campo **Enlace de demostración\*** = URL YouTube Unlisted  
  *(la demo live ya está en Detalles / Details: `https://casandra-two.vercel.app`)*
- [ ] 10. **Avisá a Dax** (chat/Telegram) con la misma URL → setea `VITE_DEMO_VIDEO_URL` + redeploy en **&lt;15 min** para que el iframe aparezca en `#pitch-video`

### D) Hacki BUIDL (~10–15 min) — OBLIGATORIO actualizar copy

El formulario viejo todavía puede decir “Evidence Pack / market evidence”. **Borrá eso.**

- [ ] 11. **Descripción de una línea\*** — pegá exactamente:

```
Casandra is a lie detector for AI agents that talk about money. They can speak. They cannot seal a lie — and they cannot spend USDT on one.
```

- [ ] 12. **Detalles\*** — pegá el bloque “About” + Details de [HACKI_PASTE.md](HACKI_PASTE.md) (o el markdown largo de abajo).  
  Contrato correcto: `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` (**no** `0x27544…`).
- [ ] 13. **Tracks:** solo **General** + **WDK** (no Pears, no QVAC).
- [ ] 14. **Repo:** `https://github.com/Kenyi001/oraculo-radiohead`
- [ ] 15. Guardá / actualizá el submit (ya está “Presentado” — podés editar hasta el cierre).
- [ ] 16. Comentá la URL del BUIDL en issue [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7)

---

## Detalles Hacki (copiá si el About corto no alcanza)

```
## What is Casandra?

A lie detector for AI agents that talk about money. Your USDT stays in your WDK wallet — Casandra never custodies. Agents can speak. They cannot seal a lie — and they cannot spend USDT on one.

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
- MCP: audit_claim → seal_receipt → check_spend_guard
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
| API health | https://casandra-two.vercel.app/api/health |
| Repo | https://github.com/Kenyi001/oraculo-radiohead |
| Contract | https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975 |
| Guion | [RONALD_PITCH.md](RONALD_PITCH.md) |
| Captions | [captions.en.srt](captions.en.srt) |
| Vs WWall | [JUDGE_ONEPAGER.md](JUDGE_ONEPAGER.md) |
| BUIDL | https://hacki.crecimiento.build/h/aleph-hackathon-2026/buidls/96a0e616-5b7e-4577-84a0-6deb3d0d0a28 |

**No esperés a Dax para grabar:** la demo ya muestra custody + FALSE + BLOCKED.  
Cuando pegues la URL en #6, Dax setea el embed en la plataforma en minutos.
