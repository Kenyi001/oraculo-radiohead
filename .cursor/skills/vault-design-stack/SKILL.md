---
name: vault-design-stack
description: >-
  Stack de diseño web tomado de la memoria del vault (videos/posts de Dax):
  Design DNA, Genjutsu, GSAP, Motion Design, Three.js, anti-look-IA y patrón
  getdesign.md. Use when polishing packages/demo-web, designing UI for Casandra/
  Oraculo, avoiding generic AI look, or when the user mentions skills de diseño
  de la memoria / videos / getdesign / Design DNA / Genjutsu.
---

# Vault design stack (Oraculo)

Fuente de verdad en el vault (no inventar repos):

| Fuente | Link | Qué aporta |
|---|---|---|
| 5 skills diseño/animación | [Instagram DbnAbBglD0e](https://www.instagram.com/p/DbnAbBglD0e/) | Repos reales verificados |
| getdesign.md | [YouTube ba8XFsjpRvQ](https://youtube.com/shorts/ba8XFsjpRvQ) | `design.md` / ADN en el proyecto |
| Detectar look IA | [TikTok ZSQWk1sA1](https://vt.tiktok.com/ZSQWk1sA1/) | Anti-patrones |
| Stack taste/Figma/Playwright | [YouTube Cew0xnJUoIY](https://youtube.com/shorts/Cew0xnJUoIY) | Apilar skills + MCP (nombres Emil/Taste **no verificados** en audio) |
| Impecable (nombre ASR) | [TikTok ZS4Robvs6](https://vt.tiktok.com/ZS4Robvs6/) | Frontend no genérico — scrape **partial**, preferir Genjutsu/Design DNA |

## Orden de uso (como dice el post)

1. **Design DNA** (`.cursor/skills/design-dna`) — extrae tokens / estilo de una referencia o de Casandra actual.
2. **GSAP** (`gsap-core`, `gsap-react`, `gsap-timeline`, `gsap-scrolltrigger`, …) + **Motion Design** — movimiento.
3. **Three.js** (`threejs-*`) — solo si hace falta profundidad 3D (demo Aleph: opcional, no bloqueante).
4. **Genjutsu** (`genjutsu`, `genjutsu-cast`, `genjutsu-paint`) — pasada creativa / anti-slop final.
5. **Anti-AI look** (`.cursor/skills/anti-ai-web-look`) — checklist antes de dar por cerrado.

## Flujo Casandra / demo-web

```
Task Progress:
- [ ] Leer anti-ai-web-look
- [ ] Design DNA sobre referencia O sobre packages/demo-web actual
- [ ] Aplicar tokens en styles.css / App.tsx (sin pivotar producto)
- [ ] Motion mínima (2–3) con gsap-react si aporta al wow del judge
- [ ] Genjutsu paint/cast pasada final
- [ ] npm run dev:web + verificar anti-patrones
```

## Notas

- Skills instaladas en este repo bajo `.cursor/skills/` (copias de los repos públicos del caption).
- No instalar Three.js pesado en la demo solo por tener la skill — el deadline manda.
- Playwright/Figma MCP del short Cew0xnJUoIY: usar si están configurados en la máquina; no son requisito del hackathon.
