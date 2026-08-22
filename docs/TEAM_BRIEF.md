# Brief del equipo — qué queremos y quién hace qué

**Deadline:** Sun 23 Aug ~11:00 America/La_Paz  
**Tracks:** **General** (por defecto) + sponsor **WDK**  
**Repo:** https://github.com/Kenyi001/oraculo-radiohead

---

## Objetivo (una frase)

Que un **agente IA** consulte Casandra (precios, portafolio, riesgo con `action`) y solo use **WDK** (`wdk-mcp`) para USD₮ si el guardrail lo permite — demo web + video + submit Hacki.

**No es:** exchange, predicción ML, QVAC ni Pears.

---

## Estado de las ramas

| Rama | Qué tiene | Pendiente |
|------|-----------|-----------|
| `master` | Core MCP + demo + verdict + WDK guardrail + docs General/WDK | Push de cambios locales WDK si aún no están en origin |
| `rama-victor` | Ya mergeado a master (verdict + investigación) | **Solo queda #10 deploy Base Sepolia** |
| `feature/Arnez` | Investigación docs (también en master) | **Implementar #17 Market Pulse** (no más docs sueltos) |
| `rama-augusto` | Sin commits propios vs master | **Tomar #6 video / #11 polish** |

**Regla:** trabajar desde `master` actualizado (`git pull origin master`). No abrir features largas sin issue.

---

## Asignaciones (avanzar YA)

### Victor (`@Vctor11180`) — Web3
**Issue:** [#10](https://github.com/Kenyi001/oraculo-radiohead/issues/10)

1. `git checkout master && git pull`
2. Fondear wallet / `.env` con `PRIVATE_KEY` + RPC
3. `npm run contracts:deploy:base`
4. Pegar address en README + `packages/demo-web/.env` (`VITE_CASANDRA_*`)
5. Comentar el address en el issue

**Done cuando:** explorer muestra el contrato y el footer del demo lo lee.

### David (`@arnez69`) — Market Pulse (producto / API para agentes)
**Issue:** [#17](https://github.com/Kenyi001/oraculo-radiohead/issues/17)  
**Contrato:** [david/REQUISITOS_PULSE.md](david/REQUISITOS_PULSE.md)

**Exigencia:** noticias + algoritmo `casandra-pulse-v1` + **por qué** (`why`/`reasons`) + JSON consume-only para MCP.

Base ya en master (`get_market_pulse`). David valida DoD, mejora calidad news/reasons, pega JSON real en #17.

### Augusto (`@RonaldGaymer2002`) — Pitch + video
**Issues:** [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6) (P0 pitch/video)

**Guía completa para exponer:** [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md)

1. Grabar ≤3 min mostrando: gauge web → veredicto/WDK action → Cursor guardrail → dry-run WDK  
2. Pegar link del video en README + issue #6  

Dax deja Vercel URL + wallet/MCP; Victor el address del contrato si alcanza.

### Dax (`@Kenyi001`) — Vercel + WDK + submit
**Issues:** [#5](https://github.com/Kenyi001/oraculo-radiohead/issues/5) · [#8](https://github.com/Kenyi001/oraculo-radiohead/issues/8) · [#7](https://github.com/Kenyi001/oraculo-radiohead/issues/7)

1. Deploy demo a Vercel (#5) — [VERCEL.md](VERCEL.md) → pegar URL en README  
2. Dejar wallet `casandra-dev` unlock + MCP dual listos para que **Augusto** grabe ([WDK.md](WDK.md))  
3. Submit Hacki: **General + WDK** con video/URL/contrato

---

## Orden del día (para no bloquearse)

```
Victor #10 deploy ─┐
Dax #5 Vercel ─────┼─→ Video #6 (Casandra→WDK) ─→ Submit #7
Dax #8 wallet ─────┘
David #17 en paralelo (no bloquea submit mínimo)
```

Board vivo: [BOARD.md](BOARD.md)
