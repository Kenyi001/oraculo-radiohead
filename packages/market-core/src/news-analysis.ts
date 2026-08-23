import type { MarketNewsArticle } from "./news.js";
import type { MarketFavor, WdkAction } from "./types.js";

export interface NewsAnalysis {
  /** -100 … +100 from headline keyword heuristics */
  sentiment_score: number;
  news_favor: MarketFavor;
  /** Maps to Casandra context hint */
  action: WdkAction;
  /** Plain recommendation for agents (not financial advice) */
  invest_recommendation: "avoid_increase" | "wait" | "caution_ok";
  verdict: string;
  verdict_es: string;
  reasons: string[];
  positive_signals: string[];
  negative_signals: string[];
  algorithm: "casandra-news-v1";
}

const POSITIVE = [
  "rally",
  "surge",
  "jump",
  "high",
  "highs",
  "record",
  "gain",
  "gains",
  "rise",
  "rebound",
  "bullish",
  "inflow",
  "approval",
  "approved",
  "breakeven",
  "growth",
  "soar",
  "climb",
  "support",
  "optimism",
  "etf",
  "partnership",
  "upgrade",
  "listing",
  "adoption",
];

const NEGATIVE = [
  "crash",
  "plunge",
  "drop",
  "fall",
  "falls",
  "decline",
  "bearish",
  "hack",
  "exploit",
  "ban",
  "lawsuit",
  "sec sues",
  "outflow",
  "fear",
  "selloff",
  "sell-off",
  "collapse",
  "warning",
  "risk",
  "doubts",
  "reject",
  "liquidation",
  "outage",
];

function scoreTitle(title: string): number {
  const t = title.toLowerCase();
  let score = 0;
  for (const w of POSITIVE) {
    if (t.includes(w)) score += 1;
  }
  for (const w of NEGATIVE) {
    if (t.includes(w)) score -= 1;
  }
  return score;
}

function favorFromScore(score: number): MarketFavor {
  if (score >= 2) return "for";
  if (score <= -2) return "against";
  return "neutral";
}

function actionFromFavor(favor: MarketFavor): WdkAction {
  if (favor === "for") return "proceed";
  if (favor === "against") return "avoid";
  return "caution";
}

function investRecFromAction(action: WdkAction): NewsAnalysis["invest_recommendation"] {
  if (action === "proceed") return "caution_ok";
  if (action === "avoid") return "avoid_increase";
  return "wait";
}

export function analyzeNewsHeadlines(
  symbol: string,
  articles: MarketNewsArticle[]
): NewsAnalysis {
  const sym = symbol.toUpperCase();
  const positive_signals: string[] = [];
  const negative_signals: string[] = [];
  let total = 0;

  if (articles.length === 0) {
    return {
      sentiment_score: 0,
      news_favor: "neutral",
      action: "caution",
      invest_recommendation: "wait",
      verdict:
        "No headlines to analyze. Wait for news or retry fetch — NOT investment advice.",
      verdict_es:
        "Sin titulares para analizar. Espera o reintenta — NO es asesoría de inversión.",
      reasons: [`No headlines available for ${sym}.`],
      positive_signals: [],
      negative_signals: [],
      algorithm: "casandra-news-v1",
    };
  }

  for (const a of articles) {
    const s = scoreTitle(a.title);
    total += s;
    if (s > 0) positive_signals.push(a.title);
    else if (s < 0) negative_signals.push(a.title);
  }

  const sentiment_score = Math.max(-100, Math.min(100, total * 20));
  const news_favor = favorFromScore(total);
  const action = actionFromFavor(news_favor);
  const invest_recommendation = investRecFromAction(action);

  const reasons = [
    `Analyzed ${articles.length} headline(s) for ${sym}.`,
    `Keyword score: ${total} (positive ${positive_signals.length}, negative ${negative_signals.length}).`,
    "Heuristic only — headlines ≠ causation.",
  ];

  const favorEs =
    news_favor === "for"
      ? "A FAVOR"
      : news_favor === "against"
        ? "EN CONTRA"
        : "NEUTRAL";

  let verdict_es: string;
  let verdict: string;

  if (news_favor === "for") {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares recientes inclinan a contexto positivo. Hint: puede evaluarse exposición con precaución y get_market_pulse — NO es asesoría de inversión.`;
    verdict = `Conclusion FOR ${sym}: recent headlines skew positive. Context hint: cautious exposure ok if pulse allows — NOT investment advice.`;
  } else if (news_favor === "against") {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares recientes inclinan a contexto negativo. Hint: NO aumentar exposición ahora — NO es asesoría de inversión.`;
    verdict = `Conclusion AGAINST ${sym}: recent headlines skew negative. Context hint: do NOT increase exposure now — NOT investment advice.`;
  } else {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares balanceados. Hint: esperar más claridad y cruzar con get_market_pulse — NO es asesoría de inversión.`;
    verdict = `Conclusion NEUTRAL for ${sym}: mixed headlines. Context hint: wait for clarity and check get_market_pulse — NOT investment advice.`;
  }

  return {
    sentiment_score,
    news_favor,
    action,
    invest_recommendation,
    verdict,
    verdict_es,
    reasons,
    positive_signals: positive_signals.slice(0, 3),
    negative_signals: negative_signals.slice(0, 3),
    algorithm: "casandra-news-v1",
  };
}
