# Casandra — Design DNA (proyecto)

Patrón [getdesign.md](https://youtube.com/shorts/ba8XFsjpRvQ) + extracción vía skill `design-dna`.

## Identidad

- **Producto:** Casandra — lie detector for AI agents that talk about money (Aleph 2026)
- **Mood:** ink & wax forensic ledger — warm charcoal, brass, blood-wax seal
- **Forma:** geometría **cuadrada** (`border-radius: 0`) — paneles, inputs, botones; el sello wax sigue circular (metáfora)
- **No:** purple SaaS glow, glassmorphism spam, pill badges, marquesinas, métricas en cajas de a 3–4 (ver skill `anti-ai-web-look`)

## Tokens (demo-web)

```css
--bg: #0b0907;
--ink: #14110e;
--text: #f3ebe0;
--muted: #9a8f7e;
--accent: #d4a84b; /* brass */
--true: #4faf78;
--false: #c94a3a; /* wax */
--radius: 0;
```

### Tipografías (4)

| Rol | Familia | Uso |
|-----|---------|-----|
| Brand / logo | **Clash Display** (Fontshare; Aeternus-like geometric) | `h1.brand-logo` Casandra |
| Display | **Clash Display** | balance, seal, BLOCKED |
| UI | **Syne** | botones, labels, story rail |
| Body | **IBM Plex Sans** | párrafos, claim |
| Mono | **IBM Plex Mono** | address, hash, code |

> Aeternus Variable is commercial — Clash Display is the free geometric substitute for the logo.

### Botones

- `btn btn-primary` — Seal / CTAs
- `btn btn-ghost` — Demo lie / Pitch script
- `btn btn-danger` — Send USDT on FALSE
- Estados: hover / focus-visible (brass ring) / active / disabled

## Secciones (un trabajo cada una)

1. Hero — brand Casandra + custody promise
2. Pitch video — embed `VITE_DEMO_VIDEO_URL` o placeholder CTA
3. Story rail — your money → seal → spend
4. Wallet ledger — USDT in WDK (self-custody)
5. Agent claim — seal contradiction / demo lie
6. Seal board — claim vs world + wax verdict
7. WDK gate — Send USDT → BLOCKED on FALSE
8. Footer — MCP tools + Sepolia registry

## Motion (2–3, purposeful)

1. Seal land on audit
2. Rail fill on step change
3. Gate flash on BLOCKED

## Skills

Ver `.cursor/skills/vault-design-stack/SKILL.md`.
