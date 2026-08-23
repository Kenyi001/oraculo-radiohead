import { getHealth, methodGuard } from "./_shared.mjs";

/**
 * GET /api/health — MCP/API readiness for judges.
 */
export default async function handler(req, res) {
  if (!methodGuard(req, res, ["GET"])) return;
  res.status(200).json({
    ...getHealth(),
    product: "casandra",
    loop: "audit_claim → seal_receipt → check_spend_guard → WDK dry-run",
    gate: {
      FALSE: "blocked",
      TRUE: "allowed_dry_run",
      MIXED: "allowed_dry_run",
      note: "Dry-run only — no USDT broadcast. Pass receipt with receipt_id on spend-guard.",
    },
    endpoints: [
      "POST /api/audit-claim",
      "POST /api/seal-receipt",
      "POST /api/check-spend-guard",
      "GET /api/health",
    ],
    registry: "0xc9fcDEC150C8903b51F299dcBa308F453C4AB975",
    disclaimer: "Dry-run only. Casandra never custodies USDT.",
  });
}
