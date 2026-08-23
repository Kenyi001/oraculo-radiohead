# Contracts — CasandraRegistry

Minimal on-chain anchor for Aleph (Hacki: provide address if you deploy).

## Contract

`CasandraRegistry.publishRiskSnapshot(bytes32 portfolioHash, uint8 band, uint256 score, uint256 timestamp)`

Bands: `0` low · `1` med · `2` high. Score 0–100.

## Setup

```bash
# from repo root — copy and fill PRIVATE_KEY (gitignored .env)
cp contracts/.env.example .env
# PRIVATE_KEY=0x...   # funded Base Sepolia wallet — never commit
# BASE_SEPOLIA_RPC=https://base-sepolia-rpc.publicnode.com
```

Deploy wallet currently staged in `contracts/deployments/baseSepolia.json` (`deployWallet`).  
**Live Aleph registry (Ethereum Sepolia):**  
`0xc9fcDEC150C8903b51F299dcBa308F453C4AB975` — https://sepolia.etherscan.io/address/0xc9fcDEC150C8903b51F299dcBa308F453C4AB975  

```bash
npm run contracts:deploy:sepolia   # funded wallet on Ethereum Sepolia
# Base Sepolia: fund deployWallet first, then npm run contracts:deploy:base
```

Fund Base via [Alchemy Base Sepolia faucet](https://www.alchemy.com/faucets/base-sepolia) (needs mainnet eligibility) or Coinbase CDP faucet, then run Base deploy.

## Compile / deploy

```bash
npx hardhat compile
npx hardhat run contracts/scripts/deploy.js --network baseSepolia
```

Output: `contracts/deployments/baseSepolia.json` → paste `address` into README and set:

```bash
# packages/demo-web/.env
VITE_CASANDRA_REGISTRY_ADDRESS=0x...
VITE_CASANDRA_REGISTRY_EXPLORER=https://sepolia.basescan.org/address/0x...
```

## Local smoke (no faucet)

```bash
npx hardhat run contracts/scripts/deploy.js --network hardhat
```
