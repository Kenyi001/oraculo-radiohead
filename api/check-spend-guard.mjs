import {
  checkSpendGuard,
  methodGuard,
  readJsonBody,
  rememberReceipt,
} from "./_shared.mjs";

/**
 * POST /api/check-spend-guard
 * Body: { receipt_id: string, receipt?: SealedReceipt }
 *
 * Pass `receipt` from a prior audit/seal response so serverless cold starts
 * still gate correctly (in-memory store is per-instance).
 * Same product loop as MCP check_spend_guard — dry-run only, no broadcast.
 */
export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;
  try {
    const body = readJsonBody(req);
    const receiptId =
      typeof body.receipt_id === "string"
        ? body.receipt_id
        : typeof body.receiptId === "string"
          ? body.receiptId
          : "";
    if (!receiptId) {
      res.status(400).json({
        error: "receipt_id is required",
        hint: "Call POST /api/audit-claim first, then pass receipt.id here.",
      });
      return;
    }
    if (body.receipt && typeof body.receipt === "object") {
      rememberReceipt(body.receipt);
    }
    const result = checkSpendGuard(receiptId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
