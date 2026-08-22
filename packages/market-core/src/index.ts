export type MarketBias = "bullish" | "bearish" | "sideways";
export type RiskBand = "low" | "med" | "high";
/** Structured action for agents + WDK guardrails (Aleph WDK track). */
export type WdkAction = "proceed" | "caution" | "avoid";

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
export interface PositionInput {
  symbol: string;
  /** Quantity of the asset */
  quantity: number;
  /** Optional cost basis per unit in USD */
  cost_basis_usd?: number;
}

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

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  note: string;
}

export interface RiskAssessment {
  score: number;
  risk_pct: number;
  band: RiskBand;
  /** proceed | caution | avoid — agents must gate WDK send_token on this */
  action: WdkAction;
  verdict: string;
  verdict_es: string;
  factors: RiskFactor[];
  scope: "symbol" | "portfolio";
  symbol?: string;
  fetched_at: string;
  algorithm: string;
  disclaimer: string;
}

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

function bandFromScore(score: number): RiskBand {
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
    const verdict = `Portfolio risk: ${band.toUpperCase()} (${score}/100). ${portfolio.usdt_share_pct.toFixed(1)}% USDT allocation reduces overall volatility. WDK action: ${action}.`;
    const verdict_es = `Riesgo del portafolio: ${band === "low" ? "BAJO" : band === "med" ? "MEDIO" : "ALTO"} (${score}/100). ${portfolio.usdt_share_pct.toFixed(1)}% asignado a USDT reduce la volatilidad general. Acción WDK: ${action}.`;

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
  const verdict = `${symbol.toUpperCase()} risk level: ${band.toUpperCase()} (${score}/100). 24h change ${quote.change_24h_pct == null ? "n/a" : `${quote.change_24h_pct >= 0 ? "+" : ""}${quote.change_24h_pct.toFixed(2)}%`}. WDK action: ${action}.`;
  const verdict_es = `Nivel de riesgo de ${symbol.toUpperCase()}: ${band === "low" ? "BAJO" : band === "med" ? "MEDIO" : "ALTO"} (${score}/100). Cambio 24h ${quote.change_24h_pct == null ? "n/a" : `${quote.change_24h_pct >= 0 ? "+" : ""}${quote.change_24h_pct.toFixed(2)}%`}. Acción WDK: ${action}.`;

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

export function getHealth(): HealthStatus {
  return {
    ok: true,
    version: VERSION,
    last_fetch: lastFetchAt,
    source: "coingecko-with-mock-fallback",
  };
}
