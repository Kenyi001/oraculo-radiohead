# Ship checklist — Casandra (human blockers)

Deadline: **Sun 23 Aug ~11:00 BO**  
Tracks: **General (default) + WDK sponsor** — [TRACK.md](TRACK.md) · [WDK.md](WDK.md)

## Done in repo

- [x] Track lock: General + WDK ([TRACK.md](TRACK.md))
- [x] WDK deps + `check_wdk_guardrail` + dual MCP docs ([WDK.md](WDK.md))
- [x] Requirements board ([REQUIREMENTS.md](REQUIREMENTS.md) · [TASKS.md](../TASKS.md))
- [x] Issues mapped (#5–#11, #17)
- [x] CasandraRegistry compiled + local deploy smoke
- [x] Demo footer ready for registry address (`VITE_CASANDRA_*`)
- [x] Demo shows WDK `action` (proceed/caution/avoid)

## You must do (login / faucet / mic)

### 1) WDK wallet unlock for demo video (#8 remainder)

1. `npm install` (pulls `@tetherto/wdk` + `@tetherto/wdk-cli`)
2. `npx wdk wallet create --name casandra-dev --words 12` (test wallet only)
3. Unlock short TTL; configure Cursor with [mcp-casandra-wdk.example.json](mcp-casandra-wdk.example.json)
4. Show `check_wdk_guardrail` → `get_balance` / `send_token` dryRun in video

### 2) Base Sepolia deploy (#10 — @Vctor11180)

1. Fund wallet / set `PRIVATE_KEY` in root `.env`
2. `npm run contracts:deploy:base`
3. Paste address into README + `packages/demo-web/.env`

### 3) Vercel (#5)

```bash
npx vercel login
npx vercel --prod
```

### 4) Video (#6)

≤3 min using [SUBMIT.md](SUBMIT.md) — **must show Casandra → WDK loop**.

### 5) Hacki submit (#7)

1. Create BUIDL on DoraHacks / Hacki.
2. **General** (default) + mark **WDK**.
3. Attach: repo · video · deploy URL · contract address · WDK package list ([WDK.md](WDK.md)).

Links: https://hacki.crecimiento.build/h/aleph-hackathon-2026 · https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track
