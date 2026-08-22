import { describe, expect, it } from "vitest";
import {
  actionFromBand,
  bandFromScore,
  canonicalPortfolioPayload,
} from "./index.js";
import { bandToUint8 } from "./onchain.js";

describe("bandFromScore", () => {
  it("maps 13.7 to low (verdict BAJO band)", () => {
    expect(bandFromScore(13.7)).toBe("low");
  });

  it("maps 50 to med", () => {
    expect(bandFromScore(50)).toBe("med");
  });

  it("maps 80 to high", () => {
    expect(bandFromScore(80)).toBe("high");
  });
});

describe("actionFromBand", () => {
  it("low → proceed", () => {
    expect(actionFromBand("low")).toBe("proceed");
  });

  it("med → caution", () => {
    expect(actionFromBand("med")).toBe("caution");
  });

  it("high → avoid", () => {
    expect(actionFromBand("high")).toBe("avoid");
  });
});

describe("bandToUint8", () => {
  it("low → 0", () => {
    expect(bandToUint8("low")).toBe(0);
  });
});

describe("canonicalPortfolioPayload", () => {
  it("sorts symbols for stable hash", () => {
    const payload = canonicalPortfolioPayload([
      { symbol: "eth", quantity: 1.2 },
      { symbol: "usdt", quantity: 5000 },
      { symbol: "btc", quantity: 0.05 },
    ]);
    expect(payload.indexOf("btc")).toBeLessThan(payload.indexOf("eth"));
    expect(payload.indexOf("eth")).toBeLessThan(payload.indexOf("usdt"));
  });
});

describe("verdict band mapping", () => {
  it("score 13.7 implies BAJO band for Spanish verdicts", () => {
    const band = bandFromScore(13.7);
    const label = band === "low" ? "BAJO" : band === "med" ? "MEDIO" : "ALTO";
    expect(label).toBe("BAJO");
    expect(actionFromBand(band)).toBe("proceed");
  });
});
