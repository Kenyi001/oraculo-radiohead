import type { PositionInput, RiskAssessment, RiskBand } from "./types.js";

/** Canonical JSON for portfolio hashing (sorted symbols). */
export function canonicalPortfolioPayload(positions: PositionInput[]): string {
  const sorted = [...positions]
    .map((p) => ({
      symbol: p.symbol.trim().toLowerCase().replace(/^\$/, ""),
      quantity: p.quantity,
      ...(typeof p.cost_basis_usd === "number"
        ? { cost_basis_usd: p.cost_basis_usd }
        : {}),
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
  return JSON.stringify(sorted);
}

export function bandToUint8(band: RiskBand): 0 | 1 | 2 {
  if (band === "low") return 0;
  if (band === "med") return 1;
  return 2;
}

export interface OnChainRiskSnapshot {
  portfolioPayload: string;
  band: 0 | 1 | 2;
  score: number;
  timestamp: number;
  risk: RiskAssessment;
}

/** Minimal ABI for MetaMask / Hardhat publish calls. */
export const CASANDRA_REGISTRY_ABI = [
  "function publishRiskSnapshot(bytes32 portfolioHash, uint8 band, uint256 score, uint256 timestamp) external returns (uint256)",
  "function snapshotCount() external view returns (uint256)",
  "function latestSnapshot() external view returns (tuple(bytes32 portfolioHash, uint8 band, uint256 score, uint256 timestamp, address publisher))",
] as const;

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_SEPOLIA_CHAIN = {
  chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
  chainName: "Base Sepolia",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://base-sepolia-rpc.publicnode.com"],
  blockExplorerUrls: ["https://sepolia.basescan.org"],
} as const;
