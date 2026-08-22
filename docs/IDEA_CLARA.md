# Casandra — Idea clara (para no perderse)

Léelo en 2 minutos. Esto es **todo** lo que importa para terminar.

---

## 1. Qué es (la idea)

**Casandra** = una app/oráculo que le da a un **agente de IA** (Cursor, Claude) datos reales de mercado y riesgo, para que **no invente números** y **no mande plata a lo loco**.

| Parte | Qué hace |
|-------|----------|
| **Casandra** | Precio, portafolio, riesgo 0–100, dice `proceed` / `caution` / `avoid` |
| **WDK** (Tether) | Wallet del agente (USD₮). Solo se usa si Casandra no dice `avoid` |
| **Demo web** | Lo mismo en pantalla para que el juez lo vea sin instalar MCP |
| **Contrato** | Opcional: deja un “sello” del riesgo en Base Sepolia |

**No es:** exchange, predicción del futuro, ni app de trading automática.

**Tracks Hacki:** General (vas siempre) + elegimos sponsor **WDK**.

---

## 2. Frase para explicar a cualquiera

> “Los agentes IA inventan precios y pueden enviar tokens sin criterio. Casandra les da el estado real y un semáforo; WDK solo mueve USD₮ si el semáforo no está en rojo.”

---

## 3. Qué ya está listo (código en GitHub)

Repo: https://github.com/Kenyi001/oraculo-radiohead (`master` y `main` = mismo commit)

- [x] MCP tools (precio, portafolio, riesgo, guardrail WDK)
- [x] Demo web con gauge + veredicto + acción WDK
- [x] Dependencias WDK + docs de pitch/equipo
- [x] Issues asignados al equipo

---

## 4. Qué falta para “terminar” (P0 humano)

Sin esto **no se puede submit**:

| # | Qué | Quién | Bloqueo típico |
|---|-----|-------|----------------|
| 5 | URL Vercel del demo | **Augusto** | Login Vercel |
| 6 | Video ≤3 min (pitch) | **Augusto** | Grabar con demo + Cursor |
| 10 | Address del contrato | **Victor** | Faucet ETH Base Sepolia + private key |
| 8 | Wallet WDK de prueba unlock | **Dax** | Crear wallet test (no plata real) |
| 7 | Submit en Hacki | **Dax** | Necesita 5+6 (+10 si se puede) |

**Paralelo (no bloquea submit mínimo):** David #17 Market Pulse.

---

## 5. Cómo se ve el avance (orden)

```
Hoy código OK
    ↓
Augusto: Vercel (#5)
Victor: contrato (#10)
Dax: unlock WDK (#8)
    ↓
Augusto: graba video (#6)  ← usa docs/PITCH_AUGUSTO.md
    ↓
Dax: submit Hacki General+WDK (#7)
```

---

## 6. Pitch (resumen)

Augusto dice/muestra:

1. Problema (agentes inventan / envían mal)  
2. Demo web (gauge + semáforo WDK)  
3. Cursor (`check_wdk_guardrail` → balance o dry-run)  
4. Disclaimer + General + WDK  

Guion: [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md) · [SUBMIT.md](SUBMIT.md)
