
```
score = 0.45 × |cambio 24h| escalado
      + 0.35 × volatilidad relativa vs BTC
      + 0.20 × (100 − % USDT/stable)
```
Bandas:
- **0–33** → `low`
- **34–66** → `med`
- **67–100** → `high`
### Qué falta
- No hay campo explícito `risk_pct` ni **veredicto en lenguaje natural**.
- El agente recibe JSON técnico y debe interpretarlo solo → riesgo de alucinación.
### Recomendación
- Añadir en `market-core`: `risk_pct`, `verdict`, `verdict_es`.
- Plantillas TypeScript deterministas (**sin LLM**).
- Exponerlo por MCP y mostrarlo en la UI demo.
---
## 3. Herramientas recomendadas (implementación)
| Prioridad | Herramienta | Para qué |
|-----------|-------------|----------|
| **P0** | TypeScript en `market-core` | `risk_pct` + `buildVerdict()` |
| **P0** | Zod + MCP SDK (ya instalados) | Contrato JSON estable para agentes |
| **P0** | React demo | Mostrar % y veredicto (no JSON crudo) |
| **P1** | Vitest | Tests deterministas del veredicto |
| **P2** | `zod-to-json-schema` | Documentación para integradores |
**Evitar:** LLM para veredictos, ML opaco, microservicios extra, i18n pesado.
### Stack mínimo (orden de implementación)
```
market-core (risk_pct + buildVerdict)
    → mcp-server (Zod + get_risk_level)
    → demo-web (gauge + verdict)
    → vitest (tests deterministas)
```
---
## 4. Noticias de mercado
### Qué hay hoy
**Nada.** Solo precio y cambio 24h. `get_market_context` genera bullets numéricos, no titulares.
### Por qué importa
Explican el *por qué* del movimiento; el score actual solo mide volatilidad reciente.
| Tipo de noticia | Efecto típico |
|-----------------|---------------|
| Macro / Fed | Presión en BTC/ETH |
| Regulación | Volatilidad puntual |
| Stablecoins (USDT) | Afecta el “ballast” del portfolio demo |
| Exchange / hack | Caídas bruscas |
| Adopción institucional | Sesgo alcista |
### Opciones para añadirlas
| API | Pros | Contras |
|-----|------|---------|
| **CoinGecko `/news`** | Misma familia que precios, filtro por moneda | Plan Analyst (de pago) |
| **RSS + `rss-parser`** | Gratis, rápido para demo | Filtrado manual por keyword |
| **CryptoCompare** | Orientado a crypto | Plan limitado |
### Recomendación
- Noticias como **contexto separado** (`get_market_news`), no como input opaco al score.
- Cada artículo: titular + URL + fecha + disclaimer.
- **Prioridad hackathon:** P1 (P0 sigue siendo deploy, video, contrato, submit).
---
## 5. JSON: ¿usar o no?
**Respuesta:** Sí usar JSON para agentes, pero **no solo JSON**.
| Capa | Formato |
|------|---------|
| MCP → agentes IA | JSON en `content[].text` (como ahora) |
| Veredicto legible | Campo de texto dentro del JSON (`verdict`, `verdict_es`) |
| Web demo | UI visual, no JSON crudo |
| Blockchain | Solo hash del JSON, no JSON on-chain |
| `market-core` | Objetos TypeScript, no archivos `.json` de datos |
### Formato ideal (híbrido)
```json
{
  "risk_pct": 13.7,
  "band": "low",
  "verdict": "Portfolio risk: LOW (13.7/100). 42.5% in USDT reduces volatility.",
  "verdict_es": "Riesgo BAJO (13.7/100). 42.5% en USDT reduce volatilidad.",
  "factors": [
    {
      "name": "abs_change_24h",
      "value": 0.36,
      "weight": 0.45,
      "note": "|24h change| scaled (input 0.07%)"
    }
  ],
  "fetched_at": "2026-08-22T17:50:00Z",
  "disclaimer": "Not financial advice."
}
```
El agente lee números para lógica y **cita el veredicto** al usuario sin inventar.
### Alternativas que no convienen
| Opción | Problema |
|--------|----------|
| Solo texto plano | El agente no puede parsear campos |
| Solo JSON sin `verdict` | Estado actual: funcional pero poco legible |
| XML / YAML / CSV | Peor DX para MCP y agentes LLM |
| JSON generado por LLM | Contradice la constitución (alucinaciones) |
---
## 6. Mapa general del producto
```
                    ┌─────────────────────┐
                    │  Agente IA          │
                    │  (Cursor / Claude)  │
                    └──────────┬──────────┘
                               │ MCP JSON
                               ▼
                    ┌─────────────────────┐
                    │  casandra-risk-v1   │
                    │  (market-core)      │
                    └──────────┬──────────┘
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌────────────┐   ┌──────────────┐  ┌─────────────┐
     │ CoinGecko  │   │ Score 0-100  │  │ Demo web    │
     │ (precios)  │   │ + factores   │  │ (React UI)  │
     └────────────┘   └──────┬───────┘  └─────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     verdict legible   get_market_news   CasandraRegistry
     (PENDIENTE)       (PENDIENTE)       (Base Sepolia)
```
---
## 7. Próximos pasos sugeridos (por impacto)
1. **Implementar `verdict` + `risk_pct`** en `market-core` (rápido, alto impacto para agentes).
2. **Actualizar MCP y UI** para mostrar el veredicto.
3. **Deploy Vercel + video + contrato Base Sepolia** (P0 hackathon).
4. **Añadir `get_market_news`** con RSS gratuito (P1, si hay tiempo).
---
## Conclusión
**Casandra ya entrega riesgo numérico y explicable vía MCP, pero le falta el veredicto legible para agentes y las noticias de contexto; la solución pasa por enriquecer el JSON existente (no reemplazarlo) con campos de texto deterministas, sin LLM ni caja negra.**
---
## Referencias en el repo
| Documento | Contenido |
|-----------|-----------|
| [README.md](../README.md) | Quick start, algoritmo, MCP config |
| [specs/constitution.md](../specs/constitution.md) | Reglas no negociables del hackathon |
| [specs/001-casandra-investment-oracle/spec.md](../specs/001-casandra-investment-oracle/spec.md) | Requisitos R1–R7 |
| [docs/REQUIREMENTS.md](REQUIREMENTS.md) | Checklist de entrega |
| [docs/BOARD.md](BOARD.md) | Orden de trabajo P0 |
| [packages/market-core/src/index.ts](../packages/market-core/src/index.ts) | Lógica de riesgo actual |
---
*Generado a partir de investigación de código y arquitectura — Aug 2026.*