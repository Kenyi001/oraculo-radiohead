# Casandra — Idea clara (para no perderse)

Léelo en 2 minutos. Esto es **todo** lo que importa para terminar.

---

## 1. Qué es (la idea)

**Casandra** = oráculo de **evidencia** para agentes de IA.  
No inventa números. No predice el precio. **No mueve la plata por ti.**  
Entrega un **Evidence Pack** (precio, riesgo, noticias, sentimiento, `why` / `reasons`) para que el **agente decida solo**.

| Parte | Qué hace |
|-------|----------|
| **Casandra (héroe)** | `get_market_pulse` → evidencia consume-only + hint `proceed`/`caution`/`avoid` |
| **Demo web** | Muestra el Pulse a jueces sin instalar MCP |
| **WDK (opcional)** | Solo si el agente **elige** actuar: dry-run USD₮ bajo evidencia (track sponsor) |
| **Contrato** | Opcional: “sello” on-chain del snapshot en Base Sepolia |

**No es:** exchange, predictor, ni app de trading automática / money-mover.

### Qué simplifica

El agente deja de inventar precios/razones y de armar el contexto a mano.  
**Una llamada** → Evidence Pack completo → el agente decide.

### Qué ofrece que otros no

- **Porqués con números** (`why` + `reasons[]`), no opinión de chat  
- **Consume-only** — el agente no reinventar la fórmula  
- **Fuentes + timestamp** en el mismo JSON  
- **No es money-mover**: informar primero; WDK opcional después  

**Tracks Hacki:** General (vas siempre — producto intel) + sponsor **WDK** (prueba de ejecución).

---

## 2. Frase para explicar a cualquiera

> “Los agentes inventan precios y razones. Casandra les da evidencia con fuentes, timestamp y porqués. El agente decide. Si actúa, WDK puede ejecutar bajo esa evidencia — no al revés.”

---

## 3. Qué ya está listo (código en GitHub)

Repo: https://github.com/Kenyi001/oraculo-radiohead (`master` / `main`)

- [x] MCP: Pulse + riesgo + portfolio + guardrail WDK
- [x] Demo web live: https://casandra-two.vercel.app
- [x] Docs de pitch/equipo / tracks
- [x] Issues asignados

---

## 4. Qué falta para “terminar” (P0 humano)

| # | Qué | Quién |
|---|-----|-------|
| 6 | Video ≤3 min (70% Pulse · 20% WDK · 10% cierre) | **Augusto** |
| 10 | Address contrato **Base Sepolia** | **Victor** |
| 8 | Wallet WDK test unlock | **Dax** |
| 7 | Submit Hacki General + WDK | **Dax** |

**Paralelo:** David #17 calidad Pulse.

---

## 5. Orden

```
Código + Vercel OK
    ↓
Augusto: video (#6) con guion evidencia-first
Victor: contrato Base (#10)
Dax: WDK unlock (#8) + submit (#7)
```

Guion: [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md) · [SUBMIT.md](SUBMIT.md) · [DIRECTION.md](DIRECTION.md)
