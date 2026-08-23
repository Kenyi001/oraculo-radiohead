import type { NewsAnalysis } from "./news-analysis.js";

export interface MarketNewsArticle {
  title: string;
  url: string;
  source: string;
  posted_at: string;
  related_symbols: string[];
}

export interface MarketNewsSource {
  id: number;
  name: string;
  url: string;
  type: "news" | "price" | "index";
}

export interface MarketStateSnapshot {
  bias: import("./types.js").MarketBias;
  market_favor: import("./types.js").MarketFavor;
  fear_greed_index: number;
  fear_greed_label: string;
  state_summary_es: string;
}

export interface MarketNumbers {
  symbol: string;
  price_usd: number;
  change_24h_pct: number | null;
  btc_change_24h_pct: number | null;
  risk_pct: number;
  risk_band: import("./types.js").RiskBand;
  fear_greed_index: number;
  price_source: string;
  fetched_at: string;
}

export interface MarketNews {
  symbol: string;
  articles: MarketNewsArticle[];
  summary: string;
  summary_es: string;
  analysis: NewsAnalysis;
  market_state: MarketStateSnapshot;
  market_numbers: MarketNumbers;
  sources: MarketNewsSource[];
  fetched_at: string;
  source: string;
  disclaimer: string;
}

function normalizeSymbol(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\$/, "");
}

function isBrowser(): boolean {
  return (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { window?: unknown }).window !== "undefined"
  );
}

/** Browser: calls Vite `/api/market-news`. Server/MCP: use `getMarketNews` from index. */
export async function fetchMarketNews(symbol: string): Promise<MarketNews> {
  const normalized = normalizeSymbol(symbol);
  if (!isBrowser()) {
    throw new Error("Use getMarketNews() in Node/MCP; fetchMarketNews is browser-only.");
  }
  const res = await fetch(
    `/api/market-news?symbol=${encodeURIComponent(normalized)}`,
    { signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) throw new Error(`api ${res.status}`);
  return (await res.json()) as MarketNews;
}

export { analyzeNewsHeadlines } from "./news-analysis.js";
export { fetchMarketNewsFromRss, getRssFeedMeta } from "./news-rss.js";
