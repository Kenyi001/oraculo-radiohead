# Ship checklist — Casandra (human blockers)

Deadline: **Sun 23 Aug ~11:00 BO**

## Done in repo (this marco)

- [x] Track: **AI** + General criteria ([TRACK.md](TRACK.md))
- [x] Requirements board ([REQUIREMENTS.md](REQUIREMENTS.md) · [TASKS.md](../TASKS.md))
- [x] Issues #5–#10 mapped
- [x] CasandraRegistry compiled + local deploy smoke
- [x] Demo footer ready for registry address (`VITE_CASANDRA_*`)

## You must do (cannot automate without your login / faucet / mic)

### 1) Base Sepolia deploy (#10)

1. Fund `deployWallet` in `contracts/deployments/baseSepolia.json` (or put your key in root `.env` as `PRIVATE_KEY`).
2. `BASE_SEPOLIA_RPC=https://base-sepolia-rpc.publicnode.com npm run contracts:deploy:base`
3. Paste address into README + `packages/demo-web/.env` (`VITE_CASANDRA_REGISTRY_ADDRESS` + explorer URL).
4. Rebuild demo.

### 2) Vercel (#5)

```bash
npx vercel login
npx vercel --prod
```

Paste live URL into README.

### 3) Video (#6)

Record ≤3 min using [SUBMIT.md](SUBMIT.md) pitch table.

### 4) Hacki submit (#7)

1. Create BUIDL on DoraHacks / Hacki.
2. Select **AI** challenge track (one only).
3. Attach: repo · video · deploy URL · contract address.
4. Pitch for General criteria.

Links: https://hacki.crecimiento.build/h/aleph-hackathon-2026 · https://alephhackathon.crecimiento.build/
