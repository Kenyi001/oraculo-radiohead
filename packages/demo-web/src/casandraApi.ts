import type {
  AuditResult,
  PositionInput,
  SealedReceipt,
  SpendGuardResult,
} from "@oraculo/market-core";

export type ApiHealth = {
  ok?: boolean;
  version?: string;
  error?: string;
  product?: string;
};

export type AuditTransport = "api" | "local";

export class CasandraApiError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "CasandraApiError";
    this.status = status;
  }
}

async function readJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new CasandraApiError(
      res.ok
        ? "API returned non-JSON (local Vite without proxy?)"
        : `HTTP ${res.status} — API unavailable`,
      res.status
    );
  }
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new CasandraApiError(
      typeof data.error === "string" ? data.error : `HTTP ${res.status}`,
      res.status
    );
  }
  return data as T;
}

export async function fetchHealth(): Promise<ApiHealth> {
  const res = await fetch("/api/health");
  return readJson<ApiHealth>(res);
}

export async function postAuditClaim(input: {
  text: string;
  positions?: PositionInput[];
}): Promise<AuditResult> {
  const res = await fetch("/api/audit-claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: input.text,
      positions: input.positions,
    }),
  });
  return readJson<AuditResult>(res);
}

export async function postCheckSpendGuard(input: {
  receipt_id: string;
  receipt: SealedReceipt;
}): Promise<SpendGuardResult> {
  const res = await fetch("/api/check-spend-guard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      receipt_id: input.receipt_id,
      receipt: input.receipt,
    }),
  });
  return readJson<SpendGuardResult>(res);
}

/** True when every quote came from mock (no live coingecko). */
export function isMockOnlyAudit(result: AuditResult): boolean {
  const quotes = result.receipt.world_snapshot.quotes;
  if (quotes.length === 0) return false;
  return quotes.every((q) => q.source.includes("mock"));
}
