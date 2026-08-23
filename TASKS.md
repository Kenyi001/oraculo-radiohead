# Casandra — Task board (human panel)

> Spec: [specs/001-casandra-investment-oracle/spec.md](specs/001-casandra-investment-oracle/spec.md) · Constitution: [specs/constitution.md](specs/constitution.md)  
> Requirements: [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) · Track: [docs/TRACK.md](docs/TRACK.md) · **Board:** [docs/BOARD.md](docs/BOARD.md)  
> Issues: https://github.com/Kenyi001/oraculo-radiohead/issues  
> Deadline: **Sun 23 Aug ~11:00 BO**

## Product pivot

**Lie detector** — `audit_claim` → sealed receipt → WDK `check_spend_guard` blocks USDT on `FALSE`.

## Roles

| Who | Owns |
|---|---|
| Dax | MCP, market-core, audit, WDK gate, contracts, specs, submit |
| Partner | Demo web polish, deploy, video support |

## Work order (remaining)

1. Redeploy Vercel with seal UI
2. Record video ≤3 min + burn EN captions
3. Update Hacki BUIDL one-liner + About
4. Confirm General + WDK tracks on Hacki

## Now / P0

| ID | Task | Owner | Status |
|---|---|---|---|
| T1–T7 | Specs, core, MCP sources, UI v1 | Dax | **done** |
| T8 | Vercel live URL | Partner/Dax | live · redeploy after pivot |
| T9 | CasandraRegistry Sepolia | Dax/Victor | **done** `0x27544Fe45b81C09fC91f99c0A7374970839eC4FF` |
| T10 | Video 3 min + EN captions | **Ronald** | open · [docs/RONALD.md](docs/RONALD.md) |
| T11 | Hacki submit General + WDK | **Ronald** | open · [docs/HACKI_PASTE.md](docs/HACKI_PASTE.md) |
| T14 | Lie detector pivot (audit + seal + WDK gate) | Dax | **done** |

## Definition of done (Sunday)

- [x] `audit_claim` returns FALSE on demo lie
- [x] Web shows claim vs world + seal + blocked send
- [x] WDK permalinks in README
- [ ] Live deploy shows pivot UI
- [ ] Video with English captions
- [ ] Hacki BUIDL copy updated

Human ship steps: [docs/SHIP.md](docs/SHIP.md)
