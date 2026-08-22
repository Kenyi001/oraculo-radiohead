#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  checkWdkGuardrail,
  getHealth,
  getMarketContext,
  getMarketNews,
  getMarketPulse,
  getMarketSummary,
  getPortfolioState,
  getPrice,
  getRiskLevel,
} from "@oraculo/market-core";

const server = new McpServer({
  name: "casandra",
  version: "0.2.0",
});

const positionSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  cost_basis_usd: z.number().optional(),
});

server.tool(
  "get_price",
  "Get current USD price and 24h change for a crypto symbol (e.g. btc, eth, usdt).",
  {
    symbol: z
      .string()
      .describe("Ticker or CoinGecko id, e.g. btc, eth, usdt, sol"),
  },
  async ({ symbol }) => {
    const quote = await getPrice(symbol);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(quote, null, 2) }],
    };
  }
);

server.tool(
  "get_market_summary",
  "Summarize market state (bullish/bearish/sideways) for one or more symbols using 24h % change.",
  {
    symbols: z
      .array(z.string())
      .optional()
      .describe("Symbols to include. Default: btc, eth, usdt"),
  },
  async ({ symbols }) => {
    const summary = await getMarketSummary(symbols ?? ["btc", "eth", "usdt"]);
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(summary, null, 2) },
      ],
    };
  }
);

server.tool(
  "get_portfolio_state",
  "Casandra: current investment/portfolio state (value, PnL %, weights, USDT share). Omit positions to use the demo portfolio.",
  {
    positions: z
      .array(positionSchema)
      .optional()
      .describe(
        "Positions [{symbol, quantity, cost_basis_usd?}]. Default demo includes USDT."
      ),
  },
  async ({ positions }) => {
    const state = await getPortfolioState(positions ?? []);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(state, null, 2) }],
    };
  }
);

server.tool(
  "get_risk_level",
  "Casandra: transparent risk score 0–100 (low/med/high) for a symbol or portfolio. Explainable factors — not financial advice.",
  {
    symbol: z.string().optional().describe("Single asset ticker, e.g. btc"),
    positions: z
      .array(positionSchema)
      .optional()
      .describe("If set, risk is computed for the portfolio"),
  },
  async ({ symbol, positions }) => {
    const risk = await getRiskLevel({ symbol, positions });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(risk, null, 2) }],
    };
  }
);

server.tool(
  "get_market_context",
  "Casandra: fast market context bullets for a symbol (bias + BTC reference). Context only — not an entry recommendation.",
  {
    symbol: z.string().describe("Ticker, e.g. eth or usdt"),
  },
  async ({ symbol }) => {
    const ctx = await getMarketContext(symbol);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(ctx, null, 2) }],
    };
  }
);

server.tool(
  "get_market_pulse",
  "Casandra: Fear & Greed + 24h bias → market_favor (favorable/neutral/unfavorable) + verdict for agents.",
  {
    symbols: z
      .array(z.string())
      .optional()
      .describe("Symbols for bias calc. Default: btc, eth, usdt"),
  },
  async ({ symbols }) => {
    const pulse = await getMarketPulse(symbols ?? ["btc", "eth", "usdt"]);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(pulse, null, 2) }],
    };
  }
);

server.tool(
  "get_market_news",
  "Casandra: recent crypto headlines + casandra-news-v1 analysis (favor, invest hint, verdict). NOT financial advice.",
  {
    symbol: z.string().describe("Ticker, e.g. btc or usdt"),
  },
  async ({ symbol }) => {
    const news = await getMarketNews(symbol);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(news, null, 2) }],
    };
  }
);

server.tool(
  "check_wdk_guardrail",
  "Aleph WDK track: BEFORE calling wdk-mcp send_token, call this. Returns allow_wdk_send (false when action=avoid). Pair with wdk-wallet MCP (get_balance / send_token dryRun).",
  {
    symbol: z.string().optional().describe("Single asset ticker, e.g. eth"),
    positions: z
      .array(positionSchema)
      .optional()
      .describe("Portfolio positions; default demo portfolio if omitted with no symbol"),
    intended_send: z
      .boolean()
      .optional()
      .describe("Set true when the agent plans to send USD₮ via WDK"),
  },
  async ({ symbol, positions, intended_send }) => {
    const result = await checkWdkGuardrail({
      symbol,
      positions:
        positions ??
        (symbol ? undefined : []),
      intended_send,
    });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  }
);

server.tool(
  "health",
  "Health check for the Casandra MCP server.",
  {},
  async () => {
    const status = getHealth();
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(status, null, 2) },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
