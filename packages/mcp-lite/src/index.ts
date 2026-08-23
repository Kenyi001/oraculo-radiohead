#!/usr/bin/env node
/**
 * Casandra Lite — low-API MCP for agents.
 * Only audit_claim → check_spend_guard → health (no exploration tools).
 * Set CASANDRA_CACHE_TTL_MS=300000 (default below) to cut CoinGecko calls.
 * Set CASANDRA_OFFLINE=1 for zero network (mock quotes).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  DEMO_LIE_CLAIM,
  auditClaim,
  getHealth,
} from "@oraculo/market-core";
import { runWdkSpendGuard, WDK_PACKAGES } from "./wdkGuard.js";

if (!process.env.CASANDRA_CACHE_TTL_MS) {
  process.env.CASANDRA_CACHE_TTL_MS = "300000";
}
const server = new McpServer({
  name: "casandra-lite",
  version: "0.1.0",
});

const positionSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  cost_basis_usd: z.number().optional(),
});

server.tool(
  "audit_claim",
  "Casandra Lite lie detector (cached market quotes). Compare a money claim to the world → TRUE|MIXED|FALSE + sealed receipt. Prefer this over full Casandra when you want fewer API calls.",
  {
    text: z
      .string()
      .optional()
      .describe(`Agent claim to audit. Default: "${DEMO_LIE_CLAIM}"`),
    positions: z.array(positionSchema).optional(),
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
  "check_spend_guard",
  "WDK spend gate (lite): FALSE receipt → USDT dry-run blocked. No live broadcast.",
  {
    receipt_id: z
      .string()
      .describe("Receipt id from audit_claim (rcpt_…)"),
  },
  async ({ receipt_id }) => {
    const result = runWdkSpendGuard(receipt_id);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { ...result, wdk_packages: WDK_PACKAGES, server: "casandra-lite" },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.tool(
  "health",
  "Health for Casandra Lite (shows cache / offline source).",
  {},
  async () => {
    const status = getHealth();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              ...status,
              server: "casandra-lite",
              cache_ttl_ms: process.env.CASANDRA_CACHE_TTL_MS ?? "300000",
              offline: process.env.CASANDRA_OFFLINE ?? "0",
              wdk_packages: WDK_PACKAGES,
              tools: ["audit_claim", "check_spend_guard", "health"],
            },
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
