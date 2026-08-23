# Contracts — CasandraRegistry

Minimal on-chain risk-snapshot anchor for Aleph (Hacki: provide address if deployed).

**Official demo network: Ethereum Sepolia** (chainId `11155111`) — team has SepoliaETH. Base Sepolia remains optional if faucet appears later.

## Contract

`CasandraRegistry.publishRiskSnapshot(bytes32 portfolioHash, uint8 band, uint256 score, uint256 timestamp)`

Bands: `0` low · `1` med · `2` high. Score 0–100.

## Deployed (official)

| | |
|---|---|
| Address | `0x27544Fe45b81C09fC91f99c0A7374970839eC4FF` |
| Network | Ethereum Sepolia |
| Explorer | https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF |
| Artifact | `contracts/deployments/sepolia.json` |

## Setup

```bash
# from repo root
cp contracts/.env.example .env
# PRIVATE_KEY=0x...   # funded Ethereum Sepolia wallet — never commit
# SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
```

## Compile / deploy (official)

```bash
npx hardhat compile
npm run contracts:deploy:sepolia
# = hardhat run contracts/scripts/deploy.js --network sepolia
```

Log must show `chainId: 11155111`. Output: `contracts/deployments/sepolia.json`.

Demo env:

```bash
# packages/demo-web/.env or .env.production
VITE_CASANDRA_REGISTRY_ADDRESS=0x27544Fe45b81C09fC91f99c0A7374970839eC4FF
VITE_CASANDRA_REGISTRY_EXPLORER=https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF
```

## Optional Base Sepolia

```bash
npm run contracts:deploy:base
```

## Local smoke (no faucet)

```bash
npm run contracts:deploy:local
```
