import { methodGuard, readJsonBody, sealReceipt, DEMO_LIE_CLAIM } from "./_shared.mjs";

/**
 * POST /api/seal-receipt
 * Body: { text?: string, positions?: PositionInput[] }
 * Same engine as MCP tool seal_receipt.
 */
export default async function handler(req, res) {
  if (!methodGuard(req, res, ["POST"])) return;
  try {
    const body = readJsonBody(req);
    const text =
      typeof body.text === "string" && body.text.trim()
        ? body.text
        : DEMO_LIE_CLAIM;
    const receipt = await sealReceipt({
      text,
      positions: Array.isArray(body.positions) ? body.positions : undefined,
    });
    res.status(200).json(receipt);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
