import { BrowserProvider, Contract, id, type Eip1193Provider } from "ethers";
import {
  BASE_SEPOLIA_CHAIN,
  BASE_SEPOLIA_CHAIN_ID,
  CASANDRA_REGISTRY_ABI,
  canonicalPortfolioPayload,
  bandToUint8,
  DEFAULT_DEMO_POSITIONS,
  prepareOnChainRiskSnapshot,
  type OnChainRiskSnapshot,
} from "@oraculo/market-core";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export async function connectMetaMask(): Promise<{
  address: string;
  chainId: number;
}> {
  if (!window.ethereum) {
    throw new Error("MetaMask no detectado. Instala la extensión.");
  }
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== BASE_SEPOLIA_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_SEPOLIA_CHAIN.chainId }],
      });
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [BASE_SEPOLIA_CHAIN],
        });
      } else {
        throw err;
      }
    }
  }
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  const signer = await provider.getSigner();
  return { address: accounts[0] ?? (await signer.getAddress()), chainId: BASE_SEPOLIA_CHAIN_ID };
}

export async function publishRiskViaMetaMask(
  registryAddress: string
): Promise<{ txHash: string; snapshot: OnChainRiskSnapshot; portfolioHash: string }> {
  if (!window.ethereum) {
    throw new Error("MetaMask no detectado.");
  }
  const snap = await prepareOnChainRiskSnapshot(DEFAULT_DEMO_POSITIONS);
  const portfolioHash = id(snap.portfolioPayload);
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const registry = new Contract(registryAddress, [...CASANDRA_REGISTRY_ABI], signer);
  const tx = await registry.publishRiskSnapshot(
    portfolioHash,
    snap.band,
    snap.score,
    snap.timestamp
  );
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash as string,
    snapshot: snap,
    portfolioHash,
  };
}

export { canonicalPortfolioPayload, bandToUint8, DEFAULT_DEMO_POSITIONS };
