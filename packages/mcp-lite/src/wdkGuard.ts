/**
 * Thin WDK dry-run gate for casandra-lite (duplicated from mcp-server for
 * independent package builds — same behaviour).
 */
import { createRequire } from "node:module";
import {
  checkSpendGuard,
  type SpendGuardResult,
} from "@oraculo/market-core";

export const WDK_PACKAGES = {
  wdk: "@tetherto/wdk@1.0.0-beta.16",
  cli: "@tetherto/wdk-cli@1.0.0-beta.3",
} as const;

const require = createRequire(import.meta.url);

export function loadWdkModule(): {
  loaded: boolean;
  name: string;
  note: string;
} {
  try {
    require.resolve("@tetherto/wdk");
    return {
      loaded: true,
      name: WDK_PACKAGES.wdk,
      note: "WDK package resolved. Casandra Lite only dry-runs; no live broadcast.",
    };
  } catch {
    return {
      loaded: false,
      name: WDK_PACKAGES.wdk,
      note:
        "WDK listed in package.json; install with npm i. Gate still blocks FALSE without a live wallet.",
    };
  }
}

export interface WdkDryRunResult extends SpendGuardResult {
  wdk_integration: {
    packages: typeof WDK_PACKAGES;
    module: ReturnType<typeof loadWdkModule>;
    cli_preview: string;
    executed_send: false;
  };
}

export function runWdkSpendGuard(receiptId: string): WdkDryRunResult {
  const gate = checkSpendGuard(receiptId);
  const module = loadWdkModule();
  const cli_preview = gate.wdk.blocked
    ? `wdk send --token USDT --dry-run  # BLOCKED by Casandra Lite receipt ${receiptId}`
    : `wdk send --token USDT --dry-run  # allowed preview for receipt ${receiptId}`;

  return {
    ...gate,
    wdk_integration: {
      packages: WDK_PACKAGES,
      module,
      cli_preview,
      executed_send: false,
    },
  };
}
