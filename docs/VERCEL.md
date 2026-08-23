# Vercel deploy — Casandra demo (#5)

Owner: **Dax** ([@Kenyi001](https://github.com/Kenyi001))  
App: Vite + React in `packages/demo-web` (root `vercel.json`).

## Prerequisites

- Node ≥ 20
- Repo on `master` (already pushed)
- Vercel account linked to GitHub `Kenyi001/oraculo-radiohead`

## One-shot CLI (recommended)

From repo root:

```bash
npx vercel login
npx vercel link          # first time: create project, Root Directory = .
npx vercel --prod
```

Confirm local build first (optional):

```bash
npm install
npm run build -w @oraculo/market-core
npm run build -w @oraculo/demo-web
```

Or: `npm run deploy:web` (runs `npx vercel --prod`).

## Dashboard import (alternative)

1. [vercel.com/new](https://vercel.com/new) → Import `Kenyi001/oraculo-radiohead`
2. Framework: **Other** (config comes from `vercel.json`)
3. Root Directory: `.` (repo root)
4. Build / Output are already set in `vercel.json`:
   - Install: `npm install`
   - Build: `npm run build -w @oraculo/market-core && npm run build -w @oraculo/demo-web`
   - Output: `packages/demo-web/dist`
5. Deploy

## Env vars (Production)

In Vercel → Project **casandra-two** → Settings → Environment Variables:

| Name | Example |
|---|---|
| `VITE_CASANDRA_REGISTRY_ADDRESS` | `0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` |
| `VITE_CASANDRA_REGISTRY_EXPLORER` | `https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` |
| `VITE_DEMO_VIDEO_URL` | `https://www.youtube.com/watch?v=XXXXXXXXXXX` |

Registry values are also in `packages/demo-web/.env.production`.

### After Ronald pastes YouTube Unlisted

1. Set **`VITE_DEMO_VIDEO_URL`** on Vercel (Production) to the watch URL (or `youtu.be/…`).
2. From repo root: `npx vercel --prod` (project `casandra-two`).
3. Alias if needed: `npx vercel alias set <deployment> casandra-two.vercel.app`
4. Confirm embed at https://casandra-two.vercel.app/#pitch-video (iframe, not “Pitch video pending”).
5. Target: **&lt;15 min** after Ronald comments the URL on [#6](https://github.com/Kenyi001/oraculo-radiohead/issues/6).

Redeploy after any `VITE_*` change so Vite bakes them into the bundle.

## After deploy

1. Paste HTTPS URL into README (`**Live:**` line) if it changed
2. Use live URL + video URL in Hacki (#7) and pitch (#6)

## Smoke check

- [ ] HTTPS opens Casandra (wallet → seal FALSE → Send → BLOCKED)
- [ ] `GET https://casandra-two.vercel.app/api/health` returns JSON with registry `0xc9fcDEC1…`
- [ ] `POST /api/audit-claim` seals FALSE on demo lie
- [ ] Footer shows Sepolia registry `0xc9fcDEC1…`
- [ ] Agent path section shows Live API when functions are up
- [ ] After video env: `#pitch-video` shows YouTube embed
