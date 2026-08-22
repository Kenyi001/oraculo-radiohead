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

## Env vars (optional until Victor finishes #10)

In Vercel → Project → Settings → Environment Variables (Production):

| Name | Example |
|---|---|
| `VITE_CASANDRA_REGISTRY_ADDRESS` | `0x…` (Base Sepolia only) |
| `VITE_CASANDRA_REGISTRY_EXPLORER` | `https://sepolia.basescan.org/address/0x…` |

Redeploy after setting them so Vite bakes them into the bundle.

## After deploy

1. Paste HTTPS URL into README (`**Live demo:**` line)
2. Comment the URL on [#5](https://github.com/Kenyi001/oraculo-radiohead/issues/5)
3. Use the same URL in the pitch video (#6) and Hacki submit (#7)

## Smoke check

- [ ] HTTPS opens Casandra (gauge + portfolio + WDK `action`)
- [ ] Refresh demo works (CoinGecko or mock fallback)
- [ ] Footer shows registry pending or BaseScan link
