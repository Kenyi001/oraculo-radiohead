# Pitch + video — Augusto (@RonaldGaymer2002)

**Tu rol:** exponer el proyecto (pitch) y grabar el demo ≤3 min.  
**Tracks:** General (default) + sponsor WDK.  
**Script base:** [SUBMIT.md](SUBMIT.md) · **Setup WDK:** [WDK.md](WDK.md)

---

## Qué debes tener listo antes de grabar

| # | Qué | Quién te lo entrega | Check |
|---|-----|---------------------|-------|
| 1 | Demo web corriendo (`npm run dev:web` o URL Vercel) | Tú (#5) o master local | [ ] |
| 2 | Gauge con `action` proceed/caution/avoid | Ya en master | [ ] |
| 3 | Cursor con dual MCP (Casandra + wdk-wallet) | Dax (#8) / [mcp-casandra-wdk.example.json](mcp-casandra-wdk.example.json) | [ ] |
| 4 | Wallet test unlock (solo demo) | Dax | [ ] |
| 5 | Address contrato (si ya está) | Victor (#10) — opcional en video | [ ] |

---

## Qué mostrar en pantalla (orden del demo)

### A) Demo web (jueces sin MCP) — ~40–50s
1. Abrir Casandra (localhost o Vercel).
2. Señalizar: **Risk level** gauge + score 0–100.
3. Leer en voz alta el **veredicto** (`verdict_es`) y la caja **WDK guardrail: proceed | caution | avoid**.
4. Tabla **Portfolio** con USDT share (ballast).
5. (Opcional) Market context de BTC/ETH.

### B) Agente / Cursor (producto real) — ~50–60s
1. Pregunta al agente:  
   *“Usa Casandra: check_wdk_guardrail del portafolio demo. Si allow_wdk_send, pide balance WDK; si avoid, no envíes.”*
2. Mostrar JSON: `action`, `risk_pct`, `allow_wdk_send`, `reasons`.
3. Si allow: tool WDK `get_balance` o `send_token` con **dryRun: true** (nunca mainnet con plata real).
4. Decir: *“Casandra decide; WDK solo actúa si el guardrail lo permite.”*

### C) Cierre — ~20s
- Repo GitHub + disclaimer: **Not financial advice**.
- Tracks: **General + WDK**.

---

## Guion hablado (~2:30–3:00, EN preferido)

> Hi — I'm Augusto from the Casandra team, Santa Cruz. AI agents invent prices and risk, and unsafe agents might send tokens anyway. Casandra is an investment oracle MCP: live portfolio, transparent risk score, and a clear action — proceed, caution, or avoid.  
> Here's the web demo for judges: risk gauge, Spanish verdict, and the WDK guardrail banner. Same engine powers Cursor tools.  
> Now in Cursor: we call check_wdk_guardrail — if avoid, no send; if allowed, wdk-mcp can check balance or dry-run a send.  
> Optional on-chain CasandraRegistry on Base Sepolia anchors a risk snapshot. Submitted under Aleph General plus WDK. Not financial advice. Thanks.

Tabla por segundos: [SUBMIT.md](SUBMIT.md).

---

## Datos que puedes citar (no inventar)

- Producto: **Casandra** — oráculo MCP, repo `oraculo-radiohead`
- Fórmula: `casandra-risk-v1` (cambio 24h + vol vs BTC + % USDT)
- Bandas: 0–33 low → proceed · 34–66 med → caution · 67–100 high → avoid
- WDK packages: `@tetherto/wdk` + `@tetherto/wdk-cli` / `wdk-mcp`
- USDT = ballast en riesgo + token del flujo WDK
- Disclaimer siempre

---

## Entregables tuyos

1. **[#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6)** — Video ≤3 min (Loom/YouTube) + URL en README  
2. **[#5](https://github.com/Kenyi001/oraculo-radiohead/issues/5)** — Vercel live URL (para que el demo del video también sea público)  
3. Pegar ambas URLs en los issues y avisar a Dax para submit (#7)

Dax te ayuda con wallet unlock / MCP si se traba. Victor te pasa el address del contrato cuando #10 esté green.
