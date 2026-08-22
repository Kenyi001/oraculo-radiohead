import type { WdkGuardrailResult } from "@oraculo/market-core";

/**
 * WDK track evidence: this package declares @tetherto/wdk as a core dependency
 * of Casandra. Agents use wdk-mcp for wallet ops and Casandra check_wdk_guardrail
 * before send_token. See docs/WDK.md.
 */
import { PolicyConfigurationError, PolicyViolationError } from "@tetherto/wdk";

export const WDK_PACKAGES = {
  "@tetherto/wdk": "1.0.0-beta.16",
  "@tetherto/wdk-cli": "1.0.0-beta.3",
  mcp_bin: "wdk-mcp",
  track: "https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track",
} as const;

/** Re-export WDK policy errors for agent tooling / future policy hooks. */
export { PolicyConfigurationError, PolicyViolationError };

export function getWdkIntegrationManifest() {
  return {
    ...WDK_PACKAGES,
    casandra_guardrail_tool: "check_wdk_guardrail",
    policy: "docs/AGENT_WDK_POLICY.md",
    wdk_policy_errors: ["PolicyConfigurationError", "PolicyViolationError"],
    flow: [
      "npx wdk wallet unlock --name casandra-dev --ttl 5",
      "casandra.check_wdk_guardrail",
      "if allow_wdk_send: wdk-mcp get_balance",
      "if allow_wdk_send: wdk-mcp send_token dryRun:true",
      "human confirm → send_token dryRun:false",
      "npx wdk wallet lock",
    ],
  };
}

/** Deterministic step list for demos / scripts after guardrail runs. */
export function buildWdkAgentSteps(guardrail: WdkGuardrailResult): string[] {
  const steps: string[] = [
    "Human: npx wdk wallet unlock --name casandra-dev --ttl 5",
    "Agent: Casandra check_wdk_guardrail (done — see JSON above)",
  ];
  if (!guardrail.allow_wdk_send) {
    steps.push("STOP — allow_wdk_send=false. Do NOT call wdk-mcp send_token.");
    steps.push(...guardrail.next_steps);
    steps.push("Human: npx wdk wallet lock");
    return steps;
  }
  steps.push("Agent: wdk-mcp get_balance (Sepolia test USDT)");
  if (guardrail.action === "caution") {
    steps.push("Agent: wdk-mcp send_token with dryRun:true only; smaller size");
    steps.push("Human: confirm before any dryRun:false send");
  } else {
    steps.push("Agent: wdk-mcp send_token dryRun:true (preview)");
    steps.push("Human: explicit confirm → send_token dryRun:false");
  }
  steps.push("Human: npx wdk wallet lock");
  return steps;
}
