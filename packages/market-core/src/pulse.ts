import type { MarketBias } from "./types.js";

export type MarketFavor = "favorable" | "neutral" | "unfavorable";

export interface MarketPulse {
  fear_greed_index: number;
  fear_greed_label: string;
  market_bias: MarketBias;
  market_favor: MarketFavor;
  reasons: string[];
  verdict: string;
  verdict_es: string;
  fetched_at: string;
  source: string;
  disclaimer: string;
}

const DISCLAIMER =
  "Not financial advice. Market pulse is a heuristic blend of Fear & Greed + 24h bias.";

const MOCK_FNG = { value: 52, classification: "Neutral" };

async function fetchFearGreed(): Promise<{ value: number; classification: string }> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return MOCK_FNG;
    const json = (await res.json()) as {
      data?: Array<{ value: string; value_classification: string }>;
    };
    const row = json.data?.[0];
    if (!row) return MOCK_FNG;
    return {
      value: Number(row.value),
      classification: row.value_classification,
    };
  } catch {
    return MOCK_FNG;
  }
}

function computeBiasFromChanges(changes: number[]): MarketBias {
  if (changes.length === 0) return "sideways";
  const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
  if (avg > 1.5) return "bullish";
  if (avg < -1.5) return "bearish";
  return "sideways";
}

function marketFavorFrom(fng: number, bias: MarketBias): MarketFavor {
  if (fng >= 60 && bias !== "bearish") return "favorable";
  if (fng <= 35 || bias === "bearish") return "unfavorable";
  if (fng >= 45 && fng <= 55) return "neutral";
  if (bias === "bullish" && fng >= 50) return "favorable";
  return "neutral";
}

export async function buildMarketPulse(
  symbols: string[],
  getMarketSummaryFn: (s: string[]) => Promise<{ bias: MarketBias }>
): Promise<MarketPulse> {
  const list = symbols.length > 0 ? symbols : ["btc", "eth", "usdt"];
  const [fng, summary] = await Promise.all([
    fetchFearGreed(),
    getMarketSummaryFn(list),
  ]);
  const market_favor = marketFavorFrom(fng.value, summary.bias);
  const reasons = [
    `Fear & Greed Index: ${fng.value} (${fng.classification})`,
    `24h market bias (Casandra): ${summary.bias}`,
    `Symbols tracked: ${list.map((s) => s.toUpperCase()).join(", ")}`,
  ];
  const favorEn =
    market_favor === "favorable"
      ? "FAVORABLE"
      : market_favor === "unfavorable"
        ? "UNFAVORABLE"
        : "NEUTRAL";
  const favorEs =
    market_favor === "favorable"
      ? "FAVORABLE"
      : market_favor === "unfavorable"
        ? "DESFAVORABLE"
        : "NEUTRAL";
  return {
    fear_greed_index: fng.value,
    fear_greed_label: fng.classification,
    market_bias: summary.bias,
    market_favor,
    reasons,
    verdict: `Market pulse: ${favorEn}. Fear & Greed ${fng.value}; bias ${summary.bias}.`,
    verdict_es: `Pulso de mercado: ${favorEs}. Fear & Greed ${fng.value}; sesgo ${summary.bias}.`,
    fetched_at: new Date().toISOString(),
    source: "alternative.me-fng+coingecko-bias",
    disclaimer: DISCLAIMER,
  };
}

export { computeBiasFromChanges };
