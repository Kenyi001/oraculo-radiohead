# Ship checklist — Casandra (human blockers)

Deadline: **Sun 23 Aug ~11:00 BO**  
Tracks: **General (default) + WDK sponsor** — evidencia-first — [TRACK.md](TRACK.md) · [DIRECTION.md](DIRECTION.md) · [WDK.md](WDK.md)

## Done in repo

- [x] Track lock: General + WDK
- [x] Evidence Pack / Pulse + demo Pulse-first + live Vercel
- [x] WDK deps + `check_wdk_guardrail` + dual MCP docs
- [x] CasandraRegistry Solidity + local smoke
- [x] Demo footer `VITE_CASANDRA_*`
- [x] Reposicionamiento: agente decide; WDK opcional
- [x] CasandraRegistry **Ethereum Sepolia** (#10 cerrado)

**Live demo:** https://casandra-two.vercel.app (#5)  
**Contract:** [`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)

## You must do (login / faucet / mic)

### 1) WDK wallet unlock (#8 — Dax) — antes del video

1. `npm install`
2. `npx wdk wallet create --name casandra-dev --words 12` (test only)
3. Unlock short TTL; Cursor dual MCP: [mcp-casandra-wdk.example.json](mcp-casandra-wdk.example.json)
4. Listo para mostrar en video: Pulse → (si actúa) guardrail → dry-run

### 2) Ethereum Sepolia deploy (#10 — Victor)

**DONE** — official network = Ethereum Sepolia. No redeploy needed.

### 3) Vercel (#5)

**DONE** — https://casandra-two.vercel.app

### 4) Video (#6 — Ronald / Augusto)

≤3 min · **70% Pulse** · **20% WDK dry-run** · **10% tracks/disclaimer**  
Guion: [PITCH_AUGUSTO.md](PITCH_AUGUSTO.md) · [SUBMIT.md](SUBMIT.md)

### 5) Hacki submit (#7 — Ronald)

Pack copy-paste: **[HACKI_SUBMIT_PACK.md](HACKI_SUBMIT_PACK.md)**

1. BUIDL en Hacki/DoraHacks  
2. Tracks: **General** + marcar **WDK** (no “AI only”)  
3. Adjuntar: repo · video · https://casandra-two.vercel.app · contract Sepolia · packages WDK ([WDK.md](WDK.md))

Links: https://hacki.crecimiento.build/h/aleph-hackathon-2026 · https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track
