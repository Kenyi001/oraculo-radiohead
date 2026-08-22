import type { MarketNewsArticle } from "./news.js";
import type { MarketFavor } from "./pulse.js";
import type { WdkAction } from "./types.js";

export interface NewsAnalysis {
  /** -100 … +100 from headline keyword heuristics */
  sentiment_score: number;
  news_favor: MarketFavor;
  /** Maps to Casandra WDK-style gate */
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
  if (score >= 2) return "favorable";
  if (score <= -2) return "unfavorable";
  return "neutral";
}

function actionFromFavor(favor: MarketFavor): WdkAction {
  if (favor === "favorable") return "proceed";
  if (favor === "unfavorable") return "avoid";
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
    news_favor === "favorable"
      ? "FAVORABLE"
      : news_favor === "unfavorable"
        ? "DESFAVORABLE"
        : "MIXTO";

  let verdict_es: string;
  let verdict: string;

  if (news_favor === "favorable") {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares recientes inclinan a contexto positivo. Recomendación contextual: puede evaluarse exposición con precaución y revisar get_risk_level — NO es asesoría de inversión.`;
    verdict = `Conclusion ${news_favor.toUpperCase()} for ${sym}: recent headlines skew positive. Contextual hint: cautious exposure ok if risk level allows — NOT investment advice.`;
  } else if (news_favor === "unfavorable") {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares recientes inclinan a contexto negativo. Recomendación contextual: NO aumentar exposición ahora; esperar o reducir riesgo — NO es asesoría de inversión.`;
    verdict = `Conclusion ${news_favor.toUpperCase()} for ${sym}: recent headlines skew negative. Contextual hint: do NOT increase exposure now — NOT investment advice.`;
  } else {
    verdict_es = `Conclusión ${favorEs} para ${sym}: titulares balanceados. Recomendación contextual: esperar más claridad y cruzar con get_risk_level antes de decidir — NO es asesoría de inversión.`;
    verdict = `Conclusion ${news_favor.toUpperCase()} for ${sym}: mixed headlines. Contextual hint: wait for clarity and check get_risk_level — NOT investment advice.`;
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
