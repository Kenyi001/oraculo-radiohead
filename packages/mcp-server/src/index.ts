#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  getHealth,
  getMarketContext,
  getMarketSummary,
  getPortfolioState,
  getPrice,
  getRiskLevel,
  sealReceipt,
} from "@oraculo/market-core";
import { runWdkSpendGuard, WDK_PACKAGES } from "./wdkGuard.js";

const server = new McpServer({
  name: "casandra",
  version: "0.3.0",
});

const positionSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  cost_basis_usd: z.number().optional(),
});

// —— Hero tools (lie detector) ————————————————————————————————

server.tool(
  "audit_claim",
  "Casandra lie detector: compare an agent money claim to live market + risk. Returns verdict TRUE|MIXED|FALSE, contradictions, and a sealed receipt. Default demo claim is an obvious lie.",
  {
    text: z
      .string()
      .optional()
      .describe(
        `Agent claim to audit. Default: "${DEMO_LIE_CLAIM}"`
      ),
    positions: z
      .array(positionSchema)
      .optional()
      .describe("Optional portfolio for risk-band checks. Default demo portfolio."),
  },
  async ({ text, positions }) => {
    const result = await auditClaim({
      text: text ?? DEMO_LIE_CLAIM,
      positions,
    });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(result, null, 2) },
      ],
    };
  }
);

server.tool(
  "seal_receipt",
  "Seal a Casandra contradiction receipt (hash + verdict). Same engine as audit_claim; use the receipt_id with check_spend_guard before any USDT send.",
  {
    text: z.string().optional().describe("Claim text to seal"),
    positions: z.array(positionSchema).optional(),
  },
  async ({ text, positions }) => {
    const receipt = await sealReceipt({
      text: text ?? DEMO_LIE_CLAIM,
      positions,
    });
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(receipt, null, 2) },
      ],
    };
  }
);

server.tool(
  "check_spend_guard",
  "WDK spend gate: if Casandra sealed FALSE, USDT send is blocked. Otherwise returns dry-run preview via @tetherto/wdk (no live broadcast). Core product loop — not optional.",
  {
    receipt_id: z
      .string()
      .describe("Receipt id from audit_claim / seal_receipt (rcpt_…)"),
  },
  async ({ receipt_id }) => {
    const result = runWdkSpendGuard(receipt_id);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { ...result, wdk_packages: WDK_PACKAGES },
            null,
            2
          ),
        },
      ],
    };
  }
);

// —— Evidence sources (supporting; not the pitch) ——————————————

server.tool(
  "get_price",
  "Evidence source: USD price + 24h change for a crypto symbol.",
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
  "Evidence source: bullish/bearish/sideways summary for symbols.",
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
  "Evidence source: portfolio value, PnL, weights, USDT share.",
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
  "Evidence source: transparent risk score 0–100 (casandra-risk-v1). Used by audit_claim for band checks.",
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
  "Evidence source: short market context bullets for a symbol.",
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
  "health",
  "Health check for the Casandra MCP server.",
  {},
  async () => {
    const status = getHealth();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { ...status, wdk_packages: WDK_PACKAGES },
            null,
            2
          ),
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
