# Agent policy — Casandra + WDK

Mandatory for any agent with both MCP servers enabled.

1. Before any `send_token` on `wdk-wallet`, call Casandra `check_wdk_guardrail` with `intended_send: true`.
2. If `allow_wdk_send` is `false` or `action` is `avoid` → **stop**. Do not send.
3. If `action` is `caution` → only `send_token` with `dryRun: true` unless the user explicitly confirms a small size.
4. If `action` is `proceed` → still run `dryRun: true` first, show fees, then `dryRun: false` only after user confirmation.
5. Prefer network `sepolia` (or documented testnet) for demos. Never use a personal mainnet wallet.
6. After the session: ask the user to run `wdk wallet lock`.

Casandra tools: `get_risk_level`, `check_wdk_guardrail`, `get_portfolio_state`.  
WDK tools: `get_balance`, `get_address`, `send_token`, …
