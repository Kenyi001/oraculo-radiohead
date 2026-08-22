#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getHealth,
  getMarketSummary,
  getPrice,
} from "@oraculo/market-core";

const server = new McpServer({
  name: "oraculo-market",
  version: "0.1.0",
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
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(quote, null, 2),
        },
      ],
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
        {
          type: "text" as const,
          text: JSON.stringify(summary, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "health",
  "Health check for the Oraculo market MCP server.",
  {},
  async () => {
    const status = getHealth();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(status, null, 2),
        },
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
