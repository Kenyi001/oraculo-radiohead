#!/usr/bin/env node
/**
 * WDK demo flow — run after `npm run build:core`.
 * Prints Casandra guardrail JSON + exact wdk-mcp steps for agents/humans.
 */
import { checkWdkGuardrail, DEFAULT_DEMO_POSITIONS } from "@oraculo/market-core";
import { getWdkIntegrationManifest, buildWdkAgentSteps } from "@oraculo/wdk-bridge";

async function main() {
  const guardrail = await checkWdkGuardrail({
    positions: DEFAULT_DEMO_POSITIONS,
    intended_send: true,
  });
  const manifest = getWdkIntegrationManifest();
  const steps = buildWdkAgentSteps(guardrail);

  console.log("=== Casandra WDK guardrail ===\n");
  console.log(JSON.stringify(guardrail, null, 2));
  console.log("\n=== WDK manifest ===\n");
  console.log(JSON.stringify(manifest, null, 2));
  console.log("\n=== Agent steps (human unlock wallet first) ===\n");
  steps.forEach((s, i) => console.log(`${i + 1}. ${s}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
