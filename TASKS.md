# Casandra — Task board (human panel)

> Spec: [specs/001-casandra-investment-oracle/spec.md](specs/001-casandra-investment-oracle/spec.md) · Constitution: [specs/constitution.md](specs/constitution.md)  
> Requirements: [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) · Track: [docs/TRACK.md](docs/TRACK.md) · WDK: [docs/WDK.md](docs/WDK.md) · **Board:** [docs/BOARD.md](docs/BOARD.md)  
> Issues: https://github.com/Kenyi001/oraculo-radiohead/issues  
> Deadline: **Sun 23 Aug ~11:00 BO** · **General (default) + WDK sponsor**

## Roles

| Who | Owns |
|---|---|
| Dax | MCP, market-core, WDK guardrail, submit |
| David (@arnez69) | Market Pulse (#17) |
| Vctor11180 | Contrato Base Sepolia (#10) |
| Partner | Demo polish, Vercel, video support |

## Work order (remaining)

1. WDK wallet unlock + demo loop (#8 human steps) — [docs/WDK.md](docs/WDK.md)
2. Vercel live URL (#5)
3. CasandraRegistry Base Sepolia (#10)
4. Video ≤3 min with Casandra→WDK (#6)
5. Hacki submit **General + WDK** (#7)
6. Market Pulse / UI polish if time (#17 / #11)

## Now / P0

| ID | Task | Owner | Status |
|---|---|---|---|
| T1–T7 | Specs / core / MCP / UI / requirements | Dax | **done** |
| T8 | Vercel live URL | Partner | open (#5) |
| T9 | CasandraRegistry Base Sepolia | Vctor11180 | local smoke done · faucet (#10) |
| T10 | Video 3 min (incl. WDK) | Partner+Dax | open (#6) |
| T11 | Hacki submit General + WDK | Dax | open (#7) |
| T12 | WDK CLI/`wdk-mcp` + guardrail | Dax | **code done** · human unlock for video (#8) |

## Later / P1

| ID | Task | Owner | Status |
|---|---|---|---|
| T13 | UI polish | Partner | open (#11) |
| T14 | Market Pulse | David | open (#17) |

## Definition of done (Sunday)

- [x] MCP answers portfolio + risk + `check_wdk_guardrail`
- [x] WDK packages declared (`@tetherto/wdk`, `@tetherto/wdk-cli`)
- [ ] Live URL + video + contract address in README
- [ ] Hacki BUIDL: General + WDK
- [ ] Disclaimer spoken/shown
