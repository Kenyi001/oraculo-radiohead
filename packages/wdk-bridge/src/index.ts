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
      "unlock wallet (human)",
      "casandra.check_wdk_guardrail",
      "if allow_wdk_send: wdk-mcp get_balance / send_token dryRun",
      "lock wallet",
    ],
  };
}
