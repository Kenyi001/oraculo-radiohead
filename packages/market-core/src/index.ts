export type MarketBias = "bullish" | "bearish" | "sideways";

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
const VERSION = "0.1.0";

export function normalizeSymbol(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\$/, "");
}

export function resolveCoinId(symbol: string): string {
  const key = normalizeSymbol(symbol);
  return SYMBOL_TO_ID[key] ?? key;
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
  const list =
    symbols.length > 0 ? symbols : ["btc", "eth", "usdt"];
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
    `Overall bias (simple 24h avg): ${bias}. Not financial advice.`
  );
  return {
    bias,
    bullets,
    quotes,
    fetched_at: new Date().toISOString(),
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
