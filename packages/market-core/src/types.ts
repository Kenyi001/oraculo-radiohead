export type MarketBias = "bullish" | "bearish" | "sideways";
export type RiskBand = "low" | "med" | "high";
export type WdkAction = "proceed" | "caution" | "avoid";
/** Product Pulse favor (consume-only Evidence Pack). */
export type MarketFavor = "for" | "against" | "neutral";

export interface PositionInput {
  symbol: string;
  quantity: number;
  cost_basis_usd?: number;
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
