import {
  DEMO_LIE_CLAIM,
  auditClaim,
  methodGuard,
  readJsonBody,
} from "./_shared.mjs";

/**
 * POST /api/audit-claim
 * Body: { text?: string, positions?: PositionInput[] }
 * Same engine as MCP tool audit_claim.
 */
export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;
  try {
    const body = readJsonBody(req);
    const text =
      typeof body.text === "string" && body.text.trim()
        ? body.text
        : DEMO_LIE_CLAIM;
    const result = await auditClaim({
      text,
      positions: Array.isArray(body.positions) ? body.positions : undefined,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
