import type { MarketPulse } from "@oraculo/market-core";

export async function fetchMarketPulse(input: {
  symbol: string;
  side?: "buy" | "sell";
  lookback_hours?: number;
  include_news?: boolean;
}): Promise<MarketPulse> {
  const params = new URLSearchParams({ symbol: input.symbol });
  if (input.side) params.set("side", input.side);
  if (input.lookback_hours != null) {
    params.set("lookback_hours", String(input.lookback_hours));
  }
  if (input.include_news === false) params.set("include_news", "false");

  const res = await fetch(`/api/market-pulse?${params.toString()}`, {
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `api ${res.status}`);
  }
  return (await res.json()) as MarketPulse;
}
