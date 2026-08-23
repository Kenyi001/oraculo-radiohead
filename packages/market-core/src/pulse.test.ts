import { describe, expect, it } from "vitest";
import {
  assertMarketPulseContract,
  buildPulseWhyAlignment,
  buildPulseWhySentiment,
  getMarketPulse,
  newsBiasFromScore,
  scoreHeadlineTitle,
  summarizeHeadlinesForWhy,
  type PulseHeadline,
} from "./index.js";

describe("scoreHeadlineTitle", () => {
  it("scores positive keywords", () => {
    expect(scoreHeadlineTitle("Bitcoin ETF approval drives rally")).toBeGreaterThan(0);
  });

  it("scores negative keywords", () => {
    expect(scoreHeadlineTitle("Exchange hack triggers lawsuit")).toBeLessThan(0);
  });
});

describe("newsBiasFromScore", () => {
  it("maps bullish / bearish / neutral thresholds", () => {
    expect(newsBiasFromScore(0.5)).toBe("bullish");
    expect(newsBiasFromScore(-0.5)).toBe("bearish");
    expect(newsBiasFromScore(0)).toBe("neutral");
  });
});

describe("summarizeHeadlinesForWhy", () => {
  const headlines: PulseHeadline[] = [
    {
      title: "Protocol hack sparks lawsuit fears",
      source: "mock",
      published_at: "2026-01-01T00:00:00.000Z",
      url: "https://example.com/1",
      score: -1,
    },
    {
      title: "Liquidation wave after crash",
      source: "mock",
      published_at: "2026-01-01T00:00:00.000Z",
      url: "https://example.com/2",
      score: -1,
    },
    {
      title: "ETF inflow record adoption",
      source: "mock",
      published_at: "2026-01-01T00:00:00.000Z",
      url: "https://example.com/3",
      score: 1,
    },
    {
      title: "Partnership upgrade listing",
      source: "mock",
      published_at: "2026-01-01T00:00:00.000Z",
      url: "https://example.com/4",
      score: 1,
    },
    {
      title: "Markets steady on macro data",
      source: "mock",
      published_at: "2026-01-01T00:00:00.000Z",
      url: "https://example.com/5",
      score: 0,
    },
  ];

  it("includes negative headline count and keywords", () => {
    const summary = summarizeHeadlinesForWhy(headlines);
    expect(summary).toMatch(/news_score 0\.00 \(neutral\)/);
    expect(summary).toMatch(/2\/5 titulares negativos/);
    expect(summary).toMatch(/hack|lawsuit|liquidation|crash/);
  });
});

describe("buildPulseWhySentiment", () => {
  it("adds FOMO hint on high greed + buy", () => {
    expect(
      buildPulseWhySentiment(
        { value: 78, label: "Greed", source: "test", fetched_at: "" },
        "buy"
      )
    ).toContain("→ no FOMO buy");
  });
});

describe("buildPulseWhyAlignment", () => {
  it("matches spec format with side and bias", () => {
    expect(buildPulseWhyAlignment("buy", "bearish", "against")).toBe(
      "side=buy vs bias=bearish → market_favor=against"
    );
  });
});

describe("assertMarketPulseContract", () => {
  it("accepts a minimal valid pulse shape", () => {
    expect(() =>
      assertMarketPulseContract({
        symbol: "btc",
        fetched_at: new Date().toISOString(),
        market_favor: "neutral",
        risk_pct: 30,
        band: "low",
        verdict: "proceed",
        confidence: 0.7,
        meters: {
          price_usd: 1,
          change_1h_pct: 0,
          change_24h_pct: 0,
          bias: "sideways",
          trend_strength: "none",
          fear_greed_value: 50,
          fear_greed_label: "Neutral",
          news_score: 0,
          news_bias: "neutral",
        },
        reasons: ["a", "b", "c"],
        why: {
          market: "BTC 24h +0.00% → bias sideways",
          news: "news_score 0.00 (neutral); 0 headlines",
          sentiment: "Fear&Greed=50 Neutral",
          alignment: "side=buy vs bias=sideways → market_favor=neutral",
        },
        headlines: [],
        consume_only: true,
        algorithm: "casandra-pulse-v1",
        disclaimer: "Not financial advice.",
      })
    ).not.toThrow();
  });
});

describe("getMarketPulse integration", () => {
  it(
    "returns contract fields for btc side=buy with headlines",
    async () => {
      const pulse = await getMarketPulse({
        symbol: "btc",
        side: "buy",
        include_news: true,
      });
      assertMarketPulseContract(pulse);
      expect(pulse.symbol).toBe("btc");
      expect(pulse.algorithm).toBe("casandra-pulse-v1");
      expect(pulse.headlines.length).toBeGreaterThan(0);
      expect(pulse.why.market).toMatch(/BTC 24h/);
      expect(pulse.why.news).toMatch(/news_score/);
      expect(pulse.why.sentiment).toMatch(/Fear&Greed=/);
      expect(pulse.why.alignment).toMatch(/side=buy vs bias=/);
      expect(pulse.reasons.length).toBeGreaterThanOrEqual(3);
    },
    45000
  );

  it(
    "returns contract fields for eth side=buy with headlines",
    async () => {
      const pulse = await getMarketPulse({
        symbol: "eth",
        side: "buy",
        include_news: true,
      });
      assertMarketPulseContract(pulse);
      expect(pulse.symbol).toBe("eth");
      expect(pulse.headlines.length).toBeGreaterThan(0);
      expect(pulse.why.alignment).toContain("side=buy");
    },
    45000
  );
});
