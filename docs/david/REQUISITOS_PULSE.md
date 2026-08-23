# Requisitos de producto — Market Pulse (David)

**Owner:** David (@arnez69) · **Issue:** [#17](https://github.com/Kenyi001/oraculo-radiohead/issues/17)  
**Base de investigación:** [investigacion.md](investigacion.md) · [../INVESTIGACIONES.md](../INVESTIGACIONES.md) · [../TRACK.md](../TRACK.md)

---

## Exigencia (no negociable)

Casandra debe ofrecer a **agentes IA** un contrato de datos de inversión que:

1. Explique el **por qué** (reasons concretas, no frases vacías).
2. Revise **noticias** (headlines + score) además del precio.
3. Use un **algoritmo determinista documentado** (`casandra-pulse-v1`) — **sin ML**.
4. Sea **solo consumo**: el agente llama MCP/API y recibe JSON listo; no recalcula riesgo.

Esto es capa de **producto** (API mental para agentes), no un experimento suelto.

---

## Problema que resuelve

Hoy el agente ve precio/riesgo pero **no sabe por qué** el mercado se mueve ni si una operación va a favor.  
Market Pulse = **contexto + semáforo + razones** para decidir `proceed` / `caution` / `avoid` (y alimentar WDK guardrail).

---

## Contrato de entrada (API / MCP)

```ts
get_market_pulse({
  symbol: string;              // requerido
  side?: "buy" | "sell";       // operación que evalúa el agente
  lookback_hours?: number;     // default 24
  include_news?: boolean;      // default true
})
```

## Contrato de salida (obligatorio)

| Campo | Obligatorio | Para el agente |
|-------|-------------|----------------|
| `market_favor` | sí | `for` \| `against` \| `neutral` |
| `verdict` | sí | `proceed` \| `caution` \| `avoid` |
| `risk_pct` | sí | 0–100 |
| `confidence` | sí | 0–1 |
| `reasons[]` | sí | ≥3 razones específicas (números + news + F&G) |
| `meters` | sí | change_1h/24h, bias, fear_greed, news_score, news_bias |
| `headlines[]` | sí si include_news | title, source, published_at, url |
| `why` | sí | objeto corto: `{ market, news, sentiment, alignment }` |
| `algorithm` | sí | `casandra-pulse-v1` |
| `disclaimer` | sí | Not financial advice |
| `fetched_at` | sí | ISO-8601 |
| `consume_only` | sí | `true` — marca que el agente no debe reinventar la fórmula |

### Ejemplo de `why` (exigido)

```json
{
  "market": "ETH 24h -2.1% → bias bearish",
  "news": "news_score -0.4 (2/5 titulares negativos: hack, lawsuit)",
  "sentiment": "Fear&Greed=28 Fear → no FOMO buy",
  "alignment": "side=buy vs bias=bearish → market_favor=against"
}
```

Sin `why` completo → **rechazado**.

---

## Algoritmo `casandra-pulse-v1` (bueno = explicable)

### Capas (todas obligatorias)

| Capa | Fuente | Output |
|------|--------|--------|
| A Precio | CoinGecko (existente) | change_1h, change_24h, bias, trend_strength |
| B Riesgo | `getRiskLevel` / fórmula risk-v1 | risk_pct, band, action base |
| C Sentimiento | Alternative.me F&G free | fear_greed_value + label |
| D Noticias | RSS keyword lexicon o mock fallback | headlines + news_score −1…+1 |
| E Cruzamiento | reglas abajo | market_favor, confidence, verdict, reasons, why |

### Lexicon noticias (mínimo)

- **Positivo (+):** etf, approval, partnership, upgrade, inflow, listing, record, adoption  
- **Negativo (−):** hack, exploit, ban, lawsuit, outage, liquidation, crash, sec charge  

`news_score` = promedio de scores de títulos (clamp −1…1).  
`news_bias`: >0.25 bullish · <−0.25 bearish · else neutral.

### Reglas de veredicto (producto)

1. Base = `action` de riesgo (low→proceed, med→caution, high→avoid).  
2. Si news y bias de precio **discrepan** → `confidence -= 0.25`, verdict máximo `caution`.  
3. F&G > 75 y `side=buy` → no `proceed` (FOMO).  
4. F&G < 25 y `side=sell` → al menos `caution`.  
5. `market_favor=against` y `side` presente → no `proceed`.  
6. Siempre ≥3 `reasons` con **números reales** de esta corrida.

**Prohibido:** LLM para inventar reasons; ML; APIs de pago en happy path.

---

## Superficie de producto (cómo consumen los agentes)

| Canal | Cómo |
|-------|------|
| **MCP** | Tool `get_market_pulse` en `casandra` server |
| **API mental** | Mismo JSON; agentes solo leen campos; no reimplementan |
| **Demo web** | Panel opcional “Pulse” (recomendado) |
| **WDK** | Si `verdict=avoid` → no `send_token` (junto a `check_wdk_guardrail`) |

Regla de agente (documentar en README):

```
1. get_market_pulse(symbol, side?)
2. Leer verdict + why.reasons
3. Si avoid / against → stop
4. Si proceed/caution → check_wdk_guardrail antes de WDK send
```

---

## Definition of Done (David)

- [x] `getMarketPulse` en `market-core` con tipos exportados  
- [x] Tool MCP + Zod (`get_market_pulse` PRIMARY + `get_market_news` secondary)  
- [x] `why` + `reasons` (≥3) + `headlines` en respuesta real  
- [x] F&G live (Alternative.me) con fallback  
- [x] Noticias: RSS o lexicon + mock fallback  
- [x] README: sección “Market Pulse — consume-only API for agents” + ejemplo JSON  
- [x] Comentario en #17 con captura JSON de `btc` y `eth`  
- [x] Disclaimer en toda respuesta  
- [x] Integrado en `master` (Evidence Pack + Sepolia; sin MetaMask como héroe)  

**Rechazo automático si:** reasons genéricas (“el mercado es volátil”), sin noticias cuando `include_news=true`, sin `algorithm`, o sin `why`.

---

## Fuera de alcance

Deploy Vercel/video/contrato/WDK unlock · ML · CoinGecko News de pago.
