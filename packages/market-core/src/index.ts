export type MarketBias = "bullish" | "bearish" | "sideways";
export type RiskBand = "low" | "med" | "high";
/** Structured context hint for agents (also used by optional WDK guardrail). Not a trade order. */
export type WdkAction = "proceed" | "caution" | "avoid";
import type { MarketNews, MarketNewsArticle, MarketNewsSource } from "./news.js";
import { fetchMarketNews } from "./news.js";
import {
  canonicalPortfolioPayload,
  bandToUint8,
  CASANDRA_REGISTRY_ABI,
  BASE_SEPOLIA_CHAIN,
  BASE_SEPOLIA_CHAIN_ID,
  type OnChainRiskSnapshot,
} from "./onchain.js";

export interface PriceQuote {
  symbol: string;
  name: string;
  price_usd: number;
  change_24h_pct: number | null;
  source: string;
  fetched_at: string;
  mock?: boolean;
}

export interface MarketSummary {
  bias: MarketBias;
  bullets: string[];
  quotes: PriceQuote[];
  fetched_at: string;
}

export interface HealthStatus {
  ok: boolean;
  version: string;
  last_fetch: string | null;
  source: string;
}

/** Position input for portfolio / risk tools */
export type { PositionInput } from "./types.js";
import type { PositionInput } from "./types.js";

export interface PositionState {
  symbol: string;
  quantity: number;
  price_usd: number;
  value_usd: number;
  cost_basis_usd: number | null;
  pnl_pct: number | null;
  weight_pct: number;
  change_24h_pct: number | null;
}

export interface PortfolioState {
  positions: PositionState[];
  total_value_usd: number;
  usdt_share_pct: number;
  fetched_at: string;
  disclaimer: string;
}

export type { RiskFactor, RiskAssessment } from "./types.js";
import type { RiskFactor, RiskAssessment } from "./types.js";

export interface WdkGuardrailResult {
  allow_wdk_send: boolean;
  allow_wdk_balance: boolean;
  action: WdkAction;
  risk_pct: number;
  band: RiskBand;
  reasons: string[];
  next_steps: string[];
  wdk_mcp_tools: {
    before_send: "check_wdk_guardrail";
    balance: "get_balance";
    send_preview: "send_token (dryRun: true)";
    send_execute: "send_token (dryRun: false) only if allow_wdk_send";
  };
  algorithm: string;
  disclaimer: string;
  risk: RiskAssessment;
}

export interface MarketContext {
  symbol: string;
  quote: PriceQuote;
  bias: MarketBias;
  bullets: string[];
  fetched_at: string;
  disclaimer: string;
}

export type MarketFavor = "for" | "against" | "neutral";
export type TrendStrength = "strong" | "weak" | "none";
export type NewsBias = "bullish" | "bearish" | "neutral";

export interface PulseHeadline {
  title: string;
  source: string;
  published_at: string;
  url: string;
  score: number;
}

export interface MarketMeters {
  price_usd: number;
  change_1h_pct: number | null;
  change_24h_pct: number | null;
  bias: MarketBias;
  trend_strength: TrendStrength;
  fear_greed_value: number;
  fear_greed_label: string;
  news_score: number;
  news_bias: NewsBias;
}

export interface MarketPulseWhy {
  market: string;
  news: string;
  sentiment: string;
  alignment: string;
}

/** Consume-only payload for AI agents (MCP / API-shaped JSON). */
export interface MarketPulse {
  symbol: string;
  fetched_at: string;
  market_favor: MarketFavor;
  risk_pct: number;
  band: RiskBand;
  verdict: WdkAction;
  confidence: number;
  meters: MarketMeters;
  reasons: string[];
  why: MarketPulseWhy;
  headlines: PulseHeadline[];
  consume_only: true;
  algorithm: string;
  disclaimer: string;
}

export interface FearGreedSnapshot {
  value: number;
  label: string;
  source: string;
  fetched_at: string;
  mock?: boolean;
}

/** CoinGecko id map for common tickers */
export const SYMBOL_TO_ID: Record<string, string> = {
  btc: "bitcoin",
  bitcoin: "bitcoin",
  eth: "ethereum",
  ethereum: "ethereum",
  usdt: "tether",
  tether: "tether",
  sol: "solana",
  solana: "solana",
  bnb: "binancecoin",
  xrp: "ripple",
  ada: "cardano",
  doge: "dogecoin",
  avax: "avalanche-2",
  matic: "matic-network",
  pol: "polygon-ecosystem-token",
};

const STABLE_SYMBOLS = new Set(["usdt", "tether", "usdc", "dai"]);

const MOCK_PRICES: Record<string, { name: string; price: number; change: number }> = {
  bitcoin: { name: "Bitcoin", price: 95000, change: 1.2 },
  ethereum: { name: "Ethereum", price: 3400, change: -0.8 },
  tether: { name: "Tether", price: 1.0, change: 0.01 },
  solana: { name: "Solana", price: 180, change: 2.5 },
  binancecoin: { name: "BNB", price: 650, change: 0.4 },
  ripple: { name: "XRP", price: 2.4, change: -1.1 },
  cardano: { name: "Cardano", price: 0.75, change: 0.3 },
  dogecoin: { name: "Dogecoin", price: 0.22, change: 3.1 },
  "avalanche-2": { name: "Avalanche", price: 28, change: -0.5 },
  "matic-network": { name: "Polygon", price: 0.35, change: 0.2 },
  "polygon-ecosystem-token": { name: "POL", price: 0.35, change: 0.2 },
};

let lastFetchAt: string | null = null;
const VERSION = "0.2.0";
const DISCLAIMER =
  "Not financial advice. Casandra risk scores are illustrative heuristics only.";
const ALGORITHM_ID = "casandra-risk-v1";

export function normalizeSymbol(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\$/, "");
}

export function resolveCoinId(symbol: string): string {
  const key = normalizeSymbol(symbol);
  return SYMBOL_TO_ID[key] ?? key;
}

function isStable(symbol: string): boolean {
  return STABLE_SYMBOLS.has(normalizeSymbol(symbol));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function bandFromScore(score: number): RiskBand {
  if (score <= 33) return "low";
  if (score <= 66) return "med";
  return "high";
}

export function actionFromBand(band: RiskBand): WdkAction {
  if (band === "low") return "proceed";
  if (band === "med") return "caution";
  return "avoid";
}

function mockQuote(coinId: string, symbol: string): PriceQuote {
  const m = MOCK_PRICES[coinId] ?? {
    name: symbol.toUpperCase(),
    price: 1,
    change: 0,
  };
  const fetched_at = new Date().toISOString();
  lastFetchAt = fetched_at;
  return {
    symbol: normalizeSymbol(symbol),
    name: m.name,
    price_usd: m.price,
    change_24h_pct: m.change,
    source: "mock-fallback",
    fetched_at,
    mock: true,
  };
}

export async function getPrice(symbol: string): Promise<PriceQuote> {
  const normalized = normalizeSymbol(symbol);
  const coinId = resolveCoinId(normalized);
  const url =
    `https://api.coingecko.com/api/v3/simple/price` +
    `?ids=${encodeURIComponent(coinId)}` +
    `&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return mockQuote(coinId, normalized);
    }
    const data = (await res.json()) as Record<
      string,
      { usd?: number; usd_24h_change?: number }
    >;
    const row = data[coinId];
    if (!row || typeof row.usd !== "number") {
      return mockQuote(coinId, normalized);
    }
    const fetched_at = new Date().toISOString();
    lastFetchAt = fetched_at;
    return {
      symbol: normalized,
      name: coinId,
      price_usd: row.usd,
      change_24h_pct:
        typeof row.usd_24h_change === "number" ? row.usd_24h_change : null,
      source: "coingecko",
      fetched_at,
    };
  } catch {
    return mockQuote(coinId, normalized);
  }
}

export function computeBias(quotes: PriceQuote[]): MarketBias {
  const changes = quotes
    .map((q) => q.change_24h_pct)
    .filter((c): c is number => typeof c === "number");
  if (changes.length === 0) return "sideways";
  const avg = changes.reduce((a, b) => a + b, 0) / changes.length;
  if (avg > 1.5) return "bullish";
  if (avg < -1.5) return "bearish";
  return "sideways";
}

export async function getMarketSummary(
  symbols: string[]
): Promise<MarketSummary> {
  const list = symbols.length > 0 ? symbols : ["btc", "eth", "usdt"];
  const quotes = await Promise.all(list.map((s) => getPrice(s)));
  const bias = computeBias(quotes);
  const bullets = quotes.map((q) => {
    const ch =
      q.change_24h_pct == null
        ? "n/a"
        : `${q.change_24h_pct >= 0 ? "+" : ""}${q.change_24h_pct.toFixed(2)}%`;
    return `${q.symbol.toUpperCase()}: $${q.price_usd.toLocaleString("en-US", {
      maximumFractionDigits: q.price_usd < 1 ? 4 : 2,
    })} (${ch} 24h)${q.mock ? " [mock]" : ""}`;
  });
  bullets.unshift(
    `Overall bias (simple 24h avg): ${bias}. ${DISCLAIMER}`
  );
  return {
    bias,
    bullets,
    quotes,
    fetched_at: new Date().toISOString(),
  };
}

/** Default demo portfolio (USDT ballast for General-track demo) */
export const DEFAULT_DEMO_POSITIONS: PositionInput[] = [
  { symbol: "usdt", quantity: 5000, cost_basis_usd: 1 },
  { symbol: "btc", quantity: 0.05, cost_basis_usd: 70000 },
  { symbol: "eth", quantity: 1.2, cost_basis_usd: 3200 },
];

export async function getPortfolioState(
  positions: PositionInput[]
): Promise<PortfolioState> {
  const list = positions.length > 0 ? positions : DEFAULT_DEMO_POSITIONS;
  const quotes = await Promise.all(list.map((p) => getPrice(p.symbol)));
  const rows: Omit<PositionState, "weight_pct">[] = list.map((p, i) => {
    const q = quotes[i];
    const value = p.quantity * q.price_usd;
    const cost =
      typeof p.cost_basis_usd === "number"
        ? p.quantity * p.cost_basis_usd
        : null;
    const pnl =
      cost != null && cost !== 0 ? ((value - cost) / cost) * 100 : null;
    return {
      symbol: normalizeSymbol(p.symbol),
      quantity: p.quantity,
      price_usd: q.price_usd,
      value_usd: value,
      cost_basis_usd: cost,
      pnl_pct: pnl,
      change_24h_pct: q.change_24h_pct,
    };
  });
  const total = rows.reduce((a, r) => a + r.value_usd, 0) || 1;
  const positionsOut: PositionState[] = rows.map((r) => ({
    ...r,
    weight_pct: (r.value_usd / total) * 100,
  }));
  const usdtValue = positionsOut
    .filter((p) => isStable(p.symbol))
    .reduce((a, p) => a + p.value_usd, 0);
  return {
    positions: positionsOut,
    total_value_usd: total === 1 && rows.length === 0 ? 0 : total,
    usdt_share_pct: (usdtValue / total) * 100,
    fetched_at: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}

function riskFromChangeAndUsdtShare(
  change24h: number | null,
  btcChange: number | null,
  usdtSharePct: number
): { score: number; factors: RiskFactor[] } {
  const absCh = Math.abs(change24h ?? 0);
  const absBtc = Math.abs(btcChange ?? 0.5);
  const absChangeComponent = clamp(absCh * 5, 0, 100);
  const relativeVol = clamp((absCh / Math.max(absBtc, 0.5)) * 40, 0, 100);
  const stableCushion = clamp(100 - usdtSharePct, 0, 100);

  const factors: RiskFactor[] = [
    {
      name: "abs_change_24h",
      value: absChangeComponent,
      weight: 0.45,
      note: `|24h change| scaled (input ${absCh.toFixed(2)}%)`,
    },
    {
      name: "relative_vol_vs_btc",
      value: relativeVol,
      weight: 0.35,
      note: `Asset move vs BTC 24h (|btc|=${absBtc.toFixed(2)}%)`,
    },
    {
      name: "non_stable_share",
      value: stableCushion,
      weight: 0.2,
      note: `USDT/stable share ${usdtSharePct.toFixed(1)}% → lower risk`,
    },
  ];

  const score = clamp(
    factors.reduce((a, f) => a + f.value * f.weight, 0),
    0,
    100
  );
  return { score: Math.round(score * 10) / 10, factors };
}

export async function getRiskLevel(input: {
  symbol?: string;
  positions?: PositionInput[];
}): Promise<RiskAssessment> {
  const btc = await getPrice("btc");
  const fetched_at = new Date().toISOString();

  if (input.positions && input.positions.length > 0) {
    const portfolio = await getPortfolioState(input.positions);
    // Portfolio risk: value-weighted average of |change|, then blend with USDT share
    const weightedAbs =
      portfolio.positions.reduce(
        (a, p) => a + Math.abs(p.change_24h_pct ?? 0) * (p.weight_pct / 100),
        0
      ) || 0;
    const { score, factors } = riskFromChangeAndUsdtShare(
      weightedAbs,
      btc.change_24h_pct,
      portfolio.usdt_share_pct
    );
    const band = bandFromScore(score);
    const action = actionFromBand(band);
    const verdict = `Portfolio risk: ${band.toUpperCase()} (${score}/100). ${portfolio.usdt_share_pct.toFixed(1)}% USDT allocation reduces overall volatility. Agent decision hint: ${action} (context only — not a trade or send order).`;
    const verdict_es = `Riesgo del portafolio: ${band === "low" ? "BAJO" : band === "med" ? "MEDIO" : "ALTO"} (${score}/100). ${portfolio.usdt_share_pct.toFixed(1)}% asignado a USDT reduce la volatilidad general. Hint para el agente: ${action} (contexto — no es orden de trade ni de envío).`;

    return {
      score,
      risk_pct: score,
      band,
      action,
      verdict,
      verdict_es,
      factors,
      scope: "portfolio",
      fetched_at,
      algorithm: ALGORITHM_ID,
      disclaimer: DISCLAIMER,
    };
  }

  const symbol = normalizeSymbol(input.symbol ?? "btc");
  const quote = await getPrice(symbol);
  const usdtShare = isStable(symbol) ? 100 : 0;
  const { score, factors } = riskFromChangeAndUsdtShare(
    quote.change_24h_pct,
    btc.change_24h_pct,
    usdtShare
  );
  const band = bandFromScore(score);
  const action = actionFromBand(band);
  const verdict = `${symbol.toUpperCase()} risk level: ${band.toUpperCase()} (${score}/100). 24h change ${quote.change_24h_pct == null ? "n/a" : `${quote.change_24h_pct >= 0 ? "+" : ""}${quote.change_24h_pct.toFixed(2)}%`}. Agent decision hint: ${action} (context only — not a trade or send order).`;
  const verdict_es = `Nivel de riesgo de ${symbol.toUpperCase()}: ${band === "low" ? "BAJO" : band === "med" ? "MEDIO" : "ALTO"} (${score}/100). Cambio 24h ${quote.change_24h_pct == null ? "n/a" : `${quote.change_24h_pct >= 0 ? "+" : ""}${quote.change_24h_pct.toFixed(2)}%`}. Hint para el agente: ${action} (contexto — no es orden de trade ni de envío).`;

  return {
    score,
    risk_pct: score,
    band,
    action,
    verdict,
    verdict_es,
    factors,
    scope: "symbol",
    symbol,
    fetched_at,
    algorithm: ALGORITHM_ID,
    disclaimer: DISCLAIMER,
  };
}

/**
 * WDK Track 1 guardrail: agents must call this before wdk-mcp `send_token`.
 * - avoid → block send
 * - caution → allow only dryRun / reduced size (agent policy)
 * - proceed → allow send after human-confirm dryRun flow
 */
export async function checkWdkGuardrail(input: {
  symbol?: string;
  positions?: PositionInput[];
  intended_send?: boolean;
}): Promise<WdkGuardrailResult> {
  const risk = await getRiskLevel({
    symbol: input.symbol,
    positions: input.positions,
  });
  const action = risk.action;
  const allow_wdk_balance = true;
  const allow_wdk_send = action !== "avoid";
  const reasons: string[] = [
    `Casandra action=${action} (band=${risk.band}, risk_pct=${risk.risk_pct})`,
    risk.verdict,
  ];
  const next_steps: string[] = [];
  if (!allow_wdk_send) {
    next_steps.push(
      "Do NOT call wdk-mcp send_token. Re-check market later or reduce exposure."
    );
  } else if (action === "caution") {
    next_steps.push(
      "You may call wdk-mcp get_balance. For send_token use dryRun:true first; prefer smaller size; require user confirm before dryRun:false."
    );
  } else {
    next_steps.push(
      "You may call wdk-mcp get_balance and send_token with dryRun:true, then dryRun:false only after explicit user confirmation."
    );
  }
  if (input.intended_send && !allow_wdk_send) {
    reasons.push("intended_send blocked by Casandra WDK guardrail");
  }
  return {
    allow_wdk_send,
    allow_wdk_balance,
    action,
    risk_pct: risk.risk_pct,
    band: risk.band,
    reasons,
    next_steps,
    wdk_mcp_tools: {
      before_send: "check_wdk_guardrail",
      balance: "get_balance",
      send_preview: "send_token (dryRun: true)",
      send_execute: "send_token (dryRun: false) only if allow_wdk_send",
    },
    algorithm: "casandra-wdk-guard-v1",
    disclaimer: DISCLAIMER,
    risk,
  };
}

export async function getMarketContext(symbol: string): Promise<MarketContext> {
  const quote = await getPrice(symbol);
  const btc = await getPrice("btc");
  const bias = computeBias([quote]);
  const ch = quote.change_24h_pct;
  const bullets: string[] = [
    `${quote.symbol.toUpperCase()} last $${quote.price_usd.toLocaleString("en-US", {
      maximumFractionDigits: quote.price_usd < 1 ? 4 : 2,
    })} (${quote.source}).`,
    ch == null
      ? "24h change unavailable."
      : `24h change ${ch >= 0 ? "+" : ""}${ch.toFixed(2)}% → short-term bias: ${bias}.`,
    `BTC reference 24h: ${
      btc.change_24h_pct == null
        ? "n/a"
        : `${btc.change_24h_pct >= 0 ? "+" : ""}${btc.change_24h_pct.toFixed(2)}%`
    }.`,
    isStable(quote.symbol)
      ? "Stablecoin context: typically used as ballast / settlement (USDT-centric demo)."
      : "Context only — not an entry recommendation. Compare risk via get_risk_level.",
    DISCLAIMER,
  ];
  return {
    symbol: normalizeSymbol(symbol),
    quote,
    bias,
    bullets,
    fetched_at: new Date().toISOString(),
    disclaimer: DISCLAIMER,
  };
}

const PULSE_ALGORITHM = "casandra-pulse-v1";

const NEWS_POS = [
  "etf",
  "approval",
  "partnership",
  "upgrade",
  "inflow",
  "listing",
  "record",
  "adoption",
  "rally",
  "surge",
];
const NEWS_NEG = [
  "hack",
  "exploit",
  "ban",
  "lawsuit",
  "outage",
  "liquidation",
  "crash",
  "sec",
  "probe",
  "fraud",
];

function trendStrengthFromChange(change: number | null): TrendStrength {
  if (change == null) return "none";
  const a = Math.abs(change);
  if (a >= 3) return "strong";
  if (a >= 1.5) return "weak";
  return "none";
}

function biasFromChange(change: number | null): MarketBias {
  if (change == null) return "sideways";
  if (change > 1.5) return "bullish";
  if (change < -1.5) return "bearish";
  return "sideways";
}

export function scoreHeadlineTitle(title: string): number {
  const t = title.toLowerCase();
  let s = 0;
  for (const w of NEWS_POS) if (t.includes(w)) s += 1;
  for (const w of NEWS_NEG) if (t.includes(w)) s -= 1;
  return clamp(s, -1, 1);
}

export function newsBiasFromScore(score: number): NewsBias {
  if (score > 0.25) return "bullish";
  if (score < -0.25) return "bearish";
  return "neutral";
}

export async function getFearGreed(): Promise<FearGreedSnapshot> {
  const fetched_at = new Date().toISOString();
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error("fng http");
    const data = (await res.json()) as {
      data?: { value?: string; value_classification?: string }[];
    };
    const row = data.data?.[0];
    const value = Number(row?.value);
    if (!Number.isFinite(value)) throw new Error("fng parse");
    return {
      value,
      label: row?.value_classification ?? "Unknown",
      source: "alternative.me",
      fetched_at,
    };
  } catch {
    return {
      value: 50,
      label: "Neutral",
      source: "mock-fallback",
      fetched_at,
      mock: true,
    };
  }
}

async function getExtendedQuote(symbol: string): Promise<{
  quote: PriceQuote;
  change_1h_pct: number | null;
}> {
  const normalized = normalizeSymbol(symbol);
  const coinId = resolveCoinId(normalized);
  const url =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&ids=${encodeURIComponent(coinId)}` +
    `&price_change_percentage=1h,24h`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const q = await getPrice(symbol);
      return { quote: q, change_1h_pct: null };
    }
    const rows = (await res.json()) as {
      current_price?: number;
      price_change_percentage_24h_in_currency?: number;
      price_change_percentage_1h_in_currency?: number;
      name?: string;
    }[];
    const row = rows[0];
    if (!row || typeof row.current_price !== "number") {
      const q = await getPrice(symbol);
      return { quote: q, change_1h_pct: null };
    }
    const fetched_at = new Date().toISOString();
    lastFetchAt = fetched_at;
    return {
      quote: {
        symbol: normalized,
        name: row.name ?? coinId,
        price_usd: row.current_price,
        change_24h_pct:
          typeof row.price_change_percentage_24h_in_currency === "number"
            ? row.price_change_percentage_24h_in_currency
            : null,
        source: "coingecko-markets",
        fetched_at,
      },
      change_1h_pct:
        typeof row.price_change_percentage_1h_in_currency === "number"
          ? row.price_change_percentage_1h_in_currency
          : null,
    };
  } catch {
    const q = await getPrice(symbol);
    return { quote: q, change_1h_pct: null };
  }
}

function mockHeadlines(symbol: string): PulseHeadline[] {
  const s = symbol.toUpperCase();
  const now = new Date().toISOString();
  return [
    {
      title: `${s} sees mixed flows as ETF narrative continues`,
      source: "mock-news",
      published_at: now,
      url: "https://example.com/mock/etf",
      score: 1,
    },
    {
      title: `Markets watch for liquidation cascades after volatility spike`,
      source: "mock-news",
      published_at: now,
      url: "https://example.com/mock/liquidation",
      score: -1,
    },
    {
      title: `Analysts debate partnership rumors around ${s} ecosystem`,
      source: "mock-news",
      published_at: now,
      url: "https://example.com/mock/partnership",
      score: 1,
    },
  ];
}

/** Free RSS (CoinTelegraph). Keyword-filter by symbol; fallback mock. */
export async function fetchHeadlines(
  symbol: string,
  _lookbackHours = 24
): Promise<PulseHeadline[]> {
  const key = normalizeSymbol(symbol);
  const aliases = [key, key.toUpperCase()];
  if (key === "btc") aliases.push("bitcoin");
  if (key === "eth") aliases.push("ethereum");
  try {
    const res = await fetch("https://cointelegraph.com/rss", {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!res.ok) return mockHeadlines(key);
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 20);
    const headlines: PulseHeadline[] = [];
    for (const m of items) {
      const block = m[1];
      const title =
        block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i)?.[1] ??
        block.match(/<title>(.*?)<\/title>/i)?.[1] ??
        "";
      const linkRaw =
        block.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i)?.[1] ??
        block.match(/<link>([^<]+)<\/link>/i)?.[1] ??
        "";
      const link = linkRaw.trim() || "https://cointelegraph.com";
      const pub =
        block.match(/<pubDate>(.*?)<\/pubDate>/i)?.[1] ??
        new Date().toISOString();
      if (!title) continue;
      const hit = aliases.some((a) => title.toLowerCase().includes(a.toLowerCase()));
      if (!hit && headlines.length >= 3) continue;
      if (!hit && aliases.every((a) => a.length < 4)) continue;
      headlines.push({
        title: title.trim(),
        source: "cointelegraph-rss",
        published_at: new Date(pub).toISOString(),
        url: link,
        score: scoreHeadlineTitle(title),
      });
      if (headlines.length >= 5) break;
    }
    if (headlines.length === 0) return mockHeadlines(key);
    return headlines;
  } catch {
    return mockHeadlines(key);
  }
}

function marketFavorFromBias(
  bias: MarketBias,
  side?: "buy" | "sell"
): MarketFavor {
  if (!side) {
    if (bias === "bullish") return "for";
    if (bias === "bearish") return "against";
    return "neutral";
  }
  if (bias === "sideways") return "neutral";
  if (bias === "bullish") return side === "buy" ? "for" : "against";
  return side === "sell" ? "for" : "against";
}

function worsenVerdict(a: WdkAction, b: WdkAction): WdkAction {
  const rank = { proceed: 0, caution: 1, avoid: 2 };
  return rank[a] >= rank[b] ? a : b;
}

function matchedNewsKeywords(title: string): { pos: string[]; neg: string[] } {
  const t = title.toLowerCase();
  return {
    pos: NEWS_POS.filter((w) => t.includes(w)),
    neg: NEWS_NEG.filter((w) => t.includes(w)),
  };
}

/** Spec-shaped `why.news` — counts scored headlines + keyword samples. */
export function summarizeHeadlinesForWhy(headlines: PulseHeadline[]): string {
  if (headlines.length === 0) {
    return "news_score 0.00 (neutral); 0 headlines";
  }
  const newsScore =
    headlines.reduce((a, h) => a + h.score, 0) / headlines.length;
  const nBias = newsBiasFromScore(newsScore);
  const posCount = headlines.filter((h) => h.score > 0).length;
  const negCount = headlines.filter((h) => h.score < 0).length;
  const negKeywords = new Set<string>();
  const posKeywords = new Set<string>();
  for (const h of headlines) {
    const { pos, neg } = matchedNewsKeywords(h.title);
    pos.forEach((k) => posKeywords.add(k));
    neg.forEach((k) => negKeywords.add(k));
  }

  let detail: string;
  if (negCount > 0) {
    const kw = [...negKeywords].slice(0, 4).join(", ");
    detail = `${negCount}/${headlines.length} titulares negativos${kw ? `: ${kw}` : ""}`;
  } else if (posCount > 0) {
    const kw = [...posKeywords].slice(0, 4).join(", ");
    detail = `${posCount}/${headlines.length} titulares positivos${kw ? `: ${kw}` : ""}`;
  } else {
    detail = `${headlines.length} titulares neutros`;
  }

  return `news_score ${newsScore.toFixed(2)} (${nBias}) (${detail})`;
}

export function buildPulseWhySentiment(
  fng: FearGreedSnapshot,
  side?: "buy" | "sell"
): string {
  let base = `Fear&Greed=${fng.value} ${fng.label}`;
  if (fng.mock) base += " [mock]";
  if (fng.value > 75 && side === "buy") return `${base} → no FOMO buy`;
  if (fng.value < 25 && side === "sell") return `${base} → caution capitulation sell`;
  return base;
}

export function buildPulseWhyAlignment(
  side: "buy" | "sell" | undefined,
  bias: MarketBias,
  favor: MarketFavor
): string {
  if (side) return `side=${side} vs bias=${bias} → market_favor=${favor}`;
  return `no side → market_favor=${favor}`;
}

export function assertMarketPulseContract(pulse: MarketPulse): void {
  if (pulse.algorithm !== PULSE_ALGORITHM) {
    throw new Error(`algorithm must be ${PULSE_ALGORITHM}`);
  }
  if (pulse.consume_only !== true) throw new Error("consume_only must be true");
  if (!pulse.disclaimer) throw new Error("disclaimer required");
  if (!pulse.fetched_at) throw new Error("fetched_at required");
  if (pulse.reasons.length < 3) throw new Error("reasons must have >= 3 entries");
  if (!pulse.why.market || !pulse.why.news || !pulse.why.sentiment || !pulse.why.alignment) {
    throw new Error("why must include market, news, sentiment, alignment");
  }
  if (pulse.confidence < 0 || pulse.confidence > 1) {
    throw new Error("confidence must be 0–1");
  }
}

/**
 * Product pulse for AI agents: price + Fear&Greed + news + why.
 * Consume-only — agents must not reinvent casandra-pulse-v1.
 */
export async function getMarketPulse(input: {
  symbol: string;
  side?: "buy" | "sell";
  lookback_hours?: number;
  include_news?: boolean;
}): Promise<MarketPulse> {
  const symbol = normalizeSymbol(input.symbol);
  const includeNews = input.include_news !== false;
  const lookback = input.lookback_hours ?? 24;

  const [{ quote, change_1h_pct }, risk, fng, headlinesFetched] = await Promise.all([
    getExtendedQuote(symbol),
    getRiskLevel({ symbol }),
    getFearGreed(),
    includeNews
      ? fetchHeadlines(symbol, lookback)
      : Promise.resolve([] as PulseHeadline[]),
  ]);

  const headlinesRaw =
    includeNews && headlinesFetched.length === 0
      ? mockHeadlines(symbol)
      : headlinesFetched;

  const change24 = quote.change_24h_pct;
  const bias = biasFromChange(change24);
  const strength = trendStrengthFromChange(change24);
  const newsScore =
    headlinesRaw.length === 0
      ? 0
      : headlinesRaw.reduce((a, h) => a + h.score, 0) / headlinesRaw.length;
  const nBias = newsBiasFromScore(newsScore);
  const favor = marketFavorFromBias(bias, input.side);

  let confidence = 0.7;
  let verdict: WdkAction = risk.action;
  const reasons: string[] = [];

  reasons.push(
    `${symbol.toUpperCase()} 24h ${
      change24 == null ? "n/a" : `${change24 >= 0 ? "+" : ""}${change24.toFixed(2)}%`
    } → bias ${bias} (${strength})`
  );
  reasons.push(
    `Fear&Greed=${fng.value} ${fng.label}${fng.mock ? " [mock]" : ""} (source ${fng.source})`
  );
  reasons.push(
    `Risk casandra-risk-v1: ${risk.risk_pct}/100 band=${risk.band} action=${risk.action}`
  );

  if (includeNews) {
    reasons.push(
      `News score ${newsScore.toFixed(2)} (${nBias}) from ${headlinesRaw.length} headlines`
    );
  }

  const newsDisagrees =
    (nBias === "bullish" && bias === "bearish") ||
    (nBias === "bearish" && bias === "bullish");
  if (newsDisagrees) {
    confidence -= 0.25;
    verdict = worsenVerdict(verdict, "caution");
    reasons.push("News bias disagrees with price bias → confidence down, max caution");
  }

  if (fng.value > 75 && input.side === "buy") {
    verdict = worsenVerdict(verdict, "caution");
    confidence -= 0.15;
    reasons.push("Extreme/high greed + BUY → block FOMO proceed");
  }
  if (fng.value < 25 && input.side === "sell") {
    verdict = worsenVerdict(verdict, "caution");
    confidence -= 0.1;
    reasons.push("Extreme/high fear + SELL → caution (capitulation risk)");
  }
  if (favor === "against" && input.side) {
    verdict = worsenVerdict(verdict, "caution");
    if (risk.band === "high") verdict = "avoid";
    reasons.push(
      `side=${input.side} vs market bias=${bias} → market_favor=against`
    );
  } else if (input.side) {
    reasons.push(
      `side=${input.side} aligns as market_favor=${favor} with bias=${bias}`
    );
  }

  confidence = clamp(confidence, 0.15, 0.95);

  const why: MarketPulseWhy = {
    market: `${symbol.toUpperCase()} 24h ${
      change24 == null ? "n/a" : `${change24 >= 0 ? "+" : ""}${change24.toFixed(2)}%`
    } → bias ${bias}`,
    news: includeNews
      ? summarizeHeadlinesForWhy(headlinesRaw)
      : "news omitted (include_news=false)",
    sentiment: buildPulseWhySentiment(fng, input.side),
    alignment: buildPulseWhyAlignment(input.side, bias, favor),
  };

  while (reasons.length < 3) {
    reasons.push(`Pulse algorithm ${PULSE_ALGORITHM} consume_only=true`);
  }

  const pulse: MarketPulse = {
    symbol,
    fetched_at: new Date().toISOString(),
    market_favor: favor,
    risk_pct: risk.risk_pct,
    band: risk.band,
    verdict,
    confidence: Math.round(confidence * 100) / 100,
    meters: {
      price_usd: quote.price_usd,
      change_1h_pct,
      change_24h_pct: change24,
      bias,
      trend_strength: strength,
      fear_greed_value: fng.value,
      fear_greed_label: fng.label,
      news_score: Math.round(newsScore * 100) / 100,
      news_bias: nBias,
    },
    reasons,
    why,
    headlines: headlinesRaw,
    consume_only: true,
    algorithm: PULSE_ALGORITHM,
    disclaimer: DISCLAIMER,
  };

  assertMarketPulseContract(pulse);
  return pulse;
}

export async function getMarketNews(symbol: string): Promise<MarketNews> {
  const normalized = normalizeSymbol(symbol);
  const { fetchMarketNewsFromRss, getRssFeedMeta } = await import("./news-rss.js");
  const { analyzeNewsHeadlines } = await import("./news-analysis.js");

  const [raw, quote, btc, risk, pulse] = await Promise.all([
    fetchMarketNewsFromRss(normalized),
    getPrice(normalized),
    getPrice("btc"),
    getRiskLevel({ symbol: normalized }),
    getMarketPulse({ symbol: normalized, include_news: false }),
  ]);

  const feed = getRssFeedMeta(normalized);
  const analysis = analyzeNewsHeadlines(normalized, raw.articles);
  const fetched_at = new Date().toISOString();

  const sources: MarketNewsSource[] = [
    {
      id: 1,
      name: feed.label,
      url: feed.url,
      type: "news",
    },
    {
      id: 2,
      name: quote.source,
      url: "https://www.coingecko.com",
      type: "price",
    },
    {
      id: 3,
      name: "Fear & Greed Index",
      url: "https://alternative.me/crypto/fear-and-greed-index/",
      type: "index",
    },
    ...raw.articles.map((a, i) => ({
      id: i + 4,
      name: a.source,
      url: a.url,
      type: "news" as const,
    })),
  ];

  return {
    symbol: normalized,
    articles: raw.articles,
    summary: raw.summary,
    summary_es: raw.summary_es,
    analysis,
    market_state: {
      bias: pulse.meters.bias,
      market_favor: analysis.news_favor,
      fear_greed_index: pulse.meters.fear_greed_value,
      fear_greed_label: pulse.meters.fear_greed_label,
      state_summary_es: `Estado: sesgo ${pulse.meters.bias}, noticias ${analysis.news_favor}, Fear&Greed ${pulse.meters.fear_greed_value} (${pulse.meters.fear_greed_label}).`,
    },
    market_numbers: {
      symbol: normalized,
      price_usd: quote.price_usd,
      change_24h_pct: quote.change_24h_pct,
      btc_change_24h_pct: btc.change_24h_pct,
      risk_pct: risk.risk_pct,
      risk_band: risk.band,
      fear_greed_index: pulse.meters.fear_greed_value,
      price_source: quote.source,
      fetched_at,
    },
    sources,
    fetched_at,
    source: raw.source,
    disclaimer:
      "Headline + market data for context only — NOT investment advice. Verify sources.",
  };
}

/** Off-chain snapshot ready for `publishRiskSnapshot` (hash: ethers.id(portfolioPayload)). */
export async function prepareOnChainRiskSnapshot(
  positions?: PositionInput[]
): Promise<OnChainRiskSnapshot> {
  const list = positions?.length ? positions : DEFAULT_DEMO_POSITIONS;
  const risk = await getRiskLevel({ positions: list });
  const portfolioPayload = canonicalPortfolioPayload(list);
  return {
    portfolioPayload,
    band: bandToUint8(risk.band),
    score: Math.round(risk.score),
    timestamp: Math.floor(Date.now() / 1000),
    risk,
  };
}

export {
  fetchMarketNews,
  canonicalPortfolioPayload,
  bandToUint8,
  CASANDRA_REGISTRY_ABI,
  BASE_SEPOLIA_CHAIN,
  BASE_SEPOLIA_CHAIN_ID,
};
export { analyzeNewsHeadlines } from "./news-analysis.js";
export type { NewsAnalysis } from "./news-analysis.js";
export type {
  MarketNews,
  MarketNewsArticle,
  MarketNewsSource,
  OnChainRiskSnapshot,
};

export function getHealth(): HealthStatus {
  return {
    ok: true,
    version: VERSION,
    last_fetch: lastFetchAt,
    source: "coingecko-with-mock-fallback",
  };
}
