# Agent policy — Casandra + WDK

Casandra is an **Evidence Pack** for agents. The **agent decides**. Casandra does not order trades or sends.

## Mandatory order

1. Call `get_market_pulse` (symbol, optional `side`). Read `why`, `reasons[]`, `meters`, `headlines`, `confidence`, and the context hint `verdict`.
2. **You (the agent) decide** whether to act, wait, ask the human, or stop. Do not treat `verdict` as a trade order or a prediction.
3. Only if you choose a WDK wallet action (`send_token`):
   - Call `check_wdk_guardrail` with `intended_send: true`.
   - If `allow_wdk_send` is `false` or `action` is `avoid` → **stop**. Do not send.
   - If `caution` → only `send_token` with `dryRun: true` unless the user explicitly confirms a small size.
   - If `proceed` → still `dryRun: true` first, show fees, then `dryRun: false` only after user confirmation.
4. Prefer testnet for demos. Never use a personal mainnet wallet.
5. After the session: ask the user to run `wdk wallet lock`.

## Tool roles

| Tool | Role |
|------|------|
| `get_market_pulse` | **Primary** — consume-only evidence |
| `get_risk_level` / `get_portfolio_state` | Supporting evidence |
| `check_wdk_guardrail` | Optional execution gate (sponsor WDK) |
| WDK `get_balance` / `send_token` | Optional action **after** evidence + decision |

`consume_only: true` means: do not reinvent `casandra-pulse-v1` — read the JSON fields.
