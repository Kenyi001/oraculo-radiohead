# Casandra — Dirección del proyecto

Documento canónico: **qué somos**, **tracks**, **pitch**, **mantenimiento**.  
Complementa: [TRACK.md](TRACK.md) · [SUBMIT.md](SUBMIT.md) · [WDK.md](WDK.md) · [BOARD.md](BOARD.md) · [david/REQUISITOS_PULSE.md](david/REQUISITOS_PULSE.md)

---

## 1. Tesis de producto

**Casandra = Decision Substrate for AI agents**  
Oráculo de **evidencia de mercado** (precio + riesgo + sentimiento + noticias + `why` / `reasons`), `consume_only: true`, algoritmos versionados (`casandra-risk-v1`, `casandra-pulse-v1`).

| Casandra **es** | Casandra **no es** |
|-----------------|-------------------|
| Pack de evidencia sourced + timestamped | Predictor de precio |
| Contexto para que el **agente decida** | Bot que compra/vende por ti |
| Semáforo = **hint de contexto** | Orden de envío de tokens |
| WDK = prueba **opcional** post-evidencia | App genérica de “mover dinero” |

**One-liner:**  
> Casandra gives AI agents sourced, timestamped market evidence — price, risk, news, and why — so the agent can decide on its own. Not predictions. Not financial advice. WDK optional for execution under evidence.

### Qué simplifica (para el agente)

Sin Casandra el agente tiene que: scrapear precios, inventar “porqués”, mezclar noticias a ojo, y decidir si mueve wallet con alucinaciones.  
**Con Casandra:** una sola tool (`get_market_pulse`) → Evidence Pack listo (`why` + `reasons` + meters + headlines + `fetched_at`). El agente **lee y decide**; no recalcula la fórmula (`consume_only`).

### Qué ofrece que otros no

| Otros (genéricos) | Casandra |
|-------------------|----------|
| Chat que “opina” del mercado | JSON **determinista** + algoritmo versionado |
| Solo precio o solo wallet send | Precio + riesgo + F&G + noticias + **por qué** en un pack |
| Black-box LLM advice | `reasons[]` con **números reales** de esta corrida |
| “Confía en el modelo” | `consume_only` + timestamp — el agente no reinventa |
| Producto = mover USD₮ | Producto = **informar**; WDK solo si el agente elige actuar |

```
Agente → get_market_pulse (Evidence Pack) → Agente decide
                ↓ (solo si elige actuar)
         check_wdk_guardrail → wdk-mcp dry-run (sponsor proof)
```

---

## 2. Tracks (Hacki)

| Capa | Decisión |
|------|----------|
| **General** | Por **defecto** — best overall (producto = intel para agentes) |
| **Sponsor (1)** | **WDK** Track 1 — ejecución opcional con evidencia |
| **No** | QVAC · Pears |

Detalle: [TRACK.md](TRACK.md).

---

## 3. Qué queremos (evidencia)

| # | Queremos | Proof |
|---|----------|-------|
| 1 | Sin alucinaciones de mercado | MCP + `fetched_at` + fuentes |
| 2 | El agente entiende el **por qué** | `why{}` + `reasons[]` (≥3) |
| 3 | Consume-only | `consume_only: true` · `casandra-pulse-v1` |
| 4 | Juez entiende en &lt;30s | Demo Pulse primero (web) |
| 5 | Sponsor WDK (opcional) | `check_wdk_guardrail` + dry-run tras leer Pulse |
| 6 | Proof on-chain | CasandraRegistry (#10) |

---

## 4. Pitch (70 / 20 / 10)

Ver [SUBMIT.md](SUBMIT.md) · [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md):

- **70%** Evidence Pack / Pulse (`why`, reasons, meters, headlines)  
- **20%** WDK dry-run solo si el agente elige actuar  
- **10%** tracks + disclaimer  

---

## 5. Mantenimiento

| Área | Owner |
|------|-------|
| Core + MCP + Pulse + submit | Dax |
| Market Pulse calidad (#17) | David (@arnez69) |
| Contrato Ethereum Sepolia (#10) | @Vctor11180 |
| Pitch + video (#6) | Augusto |
| Vercel (#5) | Dax |

Principios: single `market-core`; algoritmos versionados; sin ML v1; el **agente decide**; disclaimer permanente.

---

## 6. Mensaje de equipo

Participamos en **General** (intel/evidencia para agentes) y marcamos sponsor **WDK** (ejecución opcional bajo evidencia). Casandra no predice ni mueve plata por el usuario: entrega el Evidence Pack; el agente decide.
