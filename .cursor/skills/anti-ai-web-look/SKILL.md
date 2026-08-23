---
name: anti-ai-web-look
description: >-
  Checklist anti "se nota hecho con IA" desde el TikTok de patrones de webs
  generadas. Use when polishing demo-web UI, reviewing Casandra design, or
  when the user mentions look genérico, AI slop, o detectar webs hechas con IA.
---

# Anti AI web look

Fuente: [Cómo detectar webs hechas con IA](https://vt.tiktok.com/ZSQWk1sA1/) · vault `01-Fuentes-Raw/tiktok/como-detectar-webs-hechas-con-ia.md` · complementa [getdesign.md](https://youtube.com/shorts/ba8XFsjpRvQ).

## Patrones a evitar en `packages/demo-web`

- [ ] Mezclar texto normal con *itálica* sin razón
- [ ] Resaltar texto con color/gradiente sin necesidad
- [ ] Tags/badges redondeados con puntito en casi todos los títulos
- [ ] Métricas siempre agrupadas de a 3 o 4 en cajas idénticas
- [ ] Glassmorphism excesivo
- [ ] Marquesina infinita de logos/texto

## Qué hacer en su lugar (Casandra)

- Tipografía serif solo en display (h1 / big numbers); body limpio
- Accent único (oro Casandra) — no arcoíris de highlights
- Secciones con un trabajo cada una (risk / portfolio / context)
- Motion puntual (gauge, bias), no ambient spam
- Si necesitás ADN de marca → skill `design-dna` o `design.md` en la raíz (patrón getdesign)

## Done

Pasá la checklist en la demo viva (`npm run dev:web`) antes de grabar el video Aleph.
