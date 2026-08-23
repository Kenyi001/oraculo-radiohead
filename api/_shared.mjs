/**
 * Shared helpers for Casandra HTTP API (Vercel serverless).
 * Same product loop as MCP: audit → seal → check_spend_guard (dry-run only).
 */
import {
  auditClaim,
  checkSpendGuard,
  getHealth,
  rememberReceipt,
  sealReceipt,
  DEMO_LIE_CLAIM,
} from "../packages/market-core/dist/index.js";

export { auditClaim, checkSpendGuard, getHealth, rememberReceipt, sealReceipt, DEMO_LIE_CLAIM };

export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function readJsonBody(req) {
  if (req.body == null || req.body === "") return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(String(req.body));
  } catch {
    return {};
  }
}

export function methodGuard(req, res, allowed) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }
  if (!allowed.includes(req.method)) {
    res.status(405).json({
      error: `Method ${req.method} not allowed`,
      allow: allowed,
    });
    return false;
  }
  return true;
}
