# Pitch + video — Augusto (@RonaldGaymer2002)

**Tu rol:** exponer y grabar el demo ≤3 min.  
**Tracks:** General (producto = evidencia) + sponsor WDK (prueba opcional).  
**Tesis:** [DIRECTION.md](DIRECTION.md) · script: [SUBMIT.md](SUBMIT.md) · WDK setup: [WDK.md](WDK.md)

**Reparto del video: 70% Pulse/evidencia · 20% WDK dry-run · 10% cierre.**

---

## Qué debes tener listo antes de grabar

| # | Qué | Quién | Check |
|---|-----|-------|-------|
| 1 | Live demo https://casandra-two.vercel.app | Dax (#5 done) | [ ] |
| 2 | Panel **Market Pulse** (why / reasons / headlines) | Ya en master | [ ] |
| 3 | Cursor dual MCP (Casandra + wdk-wallet) | Dax (#8) | [ ] |
| 4 | Wallet test unlock | Dax | [ ] |
| 5 | Address contrato (opcional) | Victor (#10) | [ ] |

---

## Qué mostrar (orden)

### A) Demo web — Evidence Pack (~90–110s) — **70%**
1. Abrir https://casandra-two.vercel.app  
2. **Market Pulse** primero: `why` (market / news / sentiment / alignment)  
3. Leer **≥3 reasons** con números en voz alta  
4. Meters: Fear&Greed, news_score, change 24h  
5. Headlines  
6. Decir: *“Agent decision hint”* proceed/caution/avoid = **contexto**, no orden de compra ni de send  
7. Risk gauge / portfolio = apoyo, no el héroe  

### B) Cursor — agente decide (~40–50s) — luego WDK **20%**
1. Pregunta:  
   *“Call get_market_pulse for eth side=buy. Summarize why and reasons. Do not send anything yet. Then, only if you would act, call check_wdk_guardrail and dry-run WDK.”*  
2. Mostrar JSON Pulse: `why`, `reasons`, `confidence`, `verdict`  
3. **Solo si** el agente elige actuar: `check_wdk_guardrail` → `get_balance` o `send_token` **dryRun: true**  
4. Decir: *“Casandra informs; the agent decides; WDK is optional execution under evidence.”*

### C) Cierre (~15–20s) — **10%**
- Repo + live URL  
- **Not financial advice** · no predictions · no money-mover  
- Tracks: **General + WDK**

---

## Guion hablado (~2:30–3:00, EN)

> Hi — I'm Augusto from the Casandra team, Santa Cruz. AI agents invent prices and invent reasons. Casandra is a decision substrate, not a money-mover and not a predictor. It gives agents a consume-only Evidence Pack: price, risk, news, Fear and Greed, and a structured why — so the agent decides on its own.  
> Here's the web demo: Market Pulse first — reasons with numbers, then a context hint. Same engine in Cursor via get_market_pulse.  
> Only if the agent chooses to act, we optionally check a WDK guardrail and dry-run a USD₮ send — that's our sponsor proof, not the product.  
> Submitted under Aleph General plus WDK. Not financial advice. Thanks.

---

## Datos que puedes citar

- Producto: **Casandra** — Evidence Pack / Decision Substrate  
- **Simplifica:** una tool → evidencia completa; el agente decide (no inventa)  
- **Vs otros:** no es chat-opinion ni money-mover; es JSON con `why`/`reasons` + timestamp  
- Tools héroe: `get_market_pulse` (`casandra-pulse-v1`)  
- Hint: proceed / caution / avoid = contexto para el agente  
- WDK: `@tetherto/wdk` + `wdk-mcp` — capa opcional  
- Live: https://casandra-two.vercel.app  
- Disclaimer siempre  

---

## Entregables

1. **[#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6)** — Video ≤3 min + URL en README  
2. Avisar a Dax para submit (#7)

Vercel (#5) ya está live. Dax ayuda con wallet/MCP. Victor con contrato si alcanza.
