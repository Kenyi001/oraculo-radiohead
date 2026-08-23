import type { MarketNewsArticle } from "./news.js";

export interface MarketNewsFeed {
  symbol: string;
  articles: MarketNewsArticle[];
  summary: string;
  summary_es: string;
  fetched_at: string;
  source: string;
  disclaimer: string;
}

const DISCLAIMER =
  "Headlines only — not causal analysis or financial advice. Verify URLs before sharing.";

const RSS_BY_SYMBOL: Record<string, { url: string; label: string }> = {
  btc: {
    url: "https://cointelegraph.com/rss/tag/bitcoin",
    label: "CoinTelegraph · Bitcoin",
  },
  bitcoin: {
    url: "https://cointelegraph.com/rss/tag/bitcoin",
    label: "CoinTelegraph · Bitcoin",
  },
  eth: {
    url: "https://cointelegraph.com/rss/tag/ethereum",
    label: "CoinTelegraph · Ethereum",
  },
  ethereum: {
    url: "https://cointelegraph.com/rss/tag/ethereum",
    label: "CoinTelegraph · Ethereum",
  },
  usdt: {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    label: "CoinDesk · Markets",
  },
  tether: {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    label: "CoinDesk · Markets",
  },
  sol: {
    url: "https://cointelegraph.com/rss/tag/solana",
    label: "CoinTelegraph · Solana",
  },
  solana: {
    url: "https://cointelegraph.com/rss/tag/solana",
    label: "CoinTelegraph · Solana",
  },
};

const DEFAULT_FEED = {
  url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  label: "CoinDesk",
};

function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseRss(xml: string, limit: number): MarketNewsArticle[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const articles: MarketNewsArticle[] = [];

  for (const block of items.slice(0, limit)) {
    const titleMatch =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ??
      block.match(/<title>([^<]+)<\/title>/i);
    const linkMatch =
      block.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ??
      block.match(/<link>([^<]+)<\/link>/i);
    const dateMatch = block.match(/<pubDate>([^<]+)<\/pubDate>/i);

    const title = decodeHtml(titleMatch?.[1]?.trim() ?? "");
    const url = (linkMatch?.[1] ?? "").trim();
    if (!title || !url) continue;

    articles.push({
      title,
      url,
      source: "rss",
      posted_at: dateMatch?.[1]
        ? new Date(dateMatch[1]).toISOString()
        : new Date().toISOString(),
      related_symbols: [],
    });
  }
  return articles;
}

export function getRssFeedMeta(symbol: string): { url: string; label: string } {
  const normalized = symbol.trim().toLowerCase().replace(/^\$/, "");
  return RSS_BY_SYMBOL[normalized] ?? DEFAULT_FEED;
}

export async function fetchMarketNewsFromRss(symbol: string): Promise<MarketNewsFeed> {
  const normalized = symbol.trim().toLowerCase().replace(/^\$/, "");
  const feed = getRssFeedMeta(normalized);

  const res = await fetch(feed.url, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "Casandra-Oracle/1.0 (Aleph Hackathon; +https://github.com/Kenyi001/oraculo-radiohead)",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`RSS ${res.status}`);

  const xml = await res.text();
  const articles = parseRss(xml, 5).map((a) => ({
    ...a,
    source: feed.label,
    related_symbols: [normalized],
  }));

  if (articles.length === 0) throw new Error("RSS empty");

  return {
    symbol: normalized,
    articles,
    summary: `${articles.length} live headline(s) for ${normalized.toUpperCase()} via ${feed.label}.`,
    summary_es: `${articles.length} titular(es) en vivo para ${normalized.toUpperCase()} vía ${feed.label}.`,
    fetched_at: new Date().toISOString(),
    source: feed.label,
    disclaimer: DISCLAIMER,
  };
}
