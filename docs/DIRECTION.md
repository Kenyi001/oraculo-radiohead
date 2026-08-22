# Casandra — Dirección del proyecto

Documento canónico: **qué somos**, **tracks**, **pitch**, **mantenimiento**.  
Complementa: [TRACK.md](TRACK.md) · [SUBMIT.md](SUBMIT.md) · [WDK.md](WDK.md) · [BOARD.md](BOARD.md)

---

## 1. Tracks (Hacki)

| Capa | Decisión |
|------|----------|
| **General** | Por **defecto** — best overall (incluye AI/MCP) |
| **Sponsor (1)** | **WDK** Track 1 — `@tetherto/wdk-cli` / `wdk-mcp` |
| **No** | QVAC · Pears |

**Equipos:** 1–4 miembros.

Detalle: [TRACK.md](TRACK.md).

### Producto unificado

**Casandra** = oráculo de inversión MCP para agentes.  
**WDK** = brazo de wallet/USD₮ bajo guardrails de `verdict`.

```
Agente → Casandra (riesgo/verdict) → si no avoid → wdk-mcp (balance/send)
```

---

## 2. Idea (lo que queremos)

Un agente pregunta: *“¿cómo está mi inversión / este activo y puedo operar?”*  
Casandra responde con **números + veredicto**; WDK solo actúa si el guardrail lo permite.

| # | Queremos | Evidencia |
|---|----------|-----------|
| 1 | Sin alucinaciones de precio/riesgo | MCP + `fetched_at` |
| 2 | Juez entiende en &lt;30s | Demo gauge + portfolio + USDT |
| 3 | Decisión medible | `risk_pct`, `verdict`, `reasons` |
| 4 | Send seguro | `check_wdk_guardrail` → allow/deny antes de `send_token` |
| 5 | Proof on-chain | CasandraRegistry (#10) |

**One-liner:**  
> Casandra: investment oracle MCP + WDK-guarded USD₮ wallet for AI agents. Not hallucinations. Not financial advice.

---

## 3. Pitch

Ver [SUBMIT.md](SUBMIT.md) — incluir 20–30s Casandra verdict → WDK.

---

## 4. Mantenimiento

| Área | Owner |
|------|-------|
| Core + MCP + guardrail WDK + submit | Dax |
| Market Pulse (#17) | David (@arnez69) |
| Contrato Base Sepolia (#10) | @Vctor11180 |
| Demo / Vercel / video | Partner / equipo |

Principios: single `market-core`; algoritmos versionados; sin ML v1; disclaimer permanente.

---

## 5. Mensaje de equipo

Participamos en **General por defecto** y marcamos sponsor **WDK**. Casandra es el oráculo; WDK es la wallet del agente bajo `verdict`. Victor despliega contrato; David pulse; Dax core + WDK guardrail + submit.
