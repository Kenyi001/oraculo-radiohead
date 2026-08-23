---
name: getdesign-project-dna
description: >-
  Patrón getdesign.md (chantidev): poner identidad visual en markdown del
  proyecto para que el agente no diseñe genérico. Use when creating or updating
  design.md / Design DNA for Oraculo-Casandra, or when the user mentions
  getdesign or design.md en la raíz.
---

# getdesign → DNA en el proyecto

Fuente: [YouTube getdesign.md](https://youtube.com/shorts/ba8XFsjpRvQ) · vault `01-Fuentes-Raw/youtube/getdesign-md-sistemas-diseno.md`.

> La URL exacta de la biblioteca 70+ sistemas **no está verificada** en el scrape (solo el short). Preferí **Design DNA** (repo verificado) para extraer ADN.

## Pasos

1. Elegí referencia (marca real, screenshot, o la demo Casandra actual).
2. Corré skill **design-dna** (Phase 2) → JSON de tokens/estilo/efectos.
3. Guardá el resultado usable en la raíz del repo como [`design.md`](../../../design.md) (o actualizalo).
4. En siguientes ediciones de UI, **leé `design.md` primero** antes de tocar CSS.
5. Extra: podés pedirle al agente que analice *tu* marca (Casandra oracle dark/gold) para funciones nuevas.

## Relación con otras skills

- Extracción → `design-dna`
- Evitar slop → `anti-ai-web-look`
- Pulido final → `genjutsu-paint` / `genjutsu-cast`
- Orquestación → `vault-design-stack`
