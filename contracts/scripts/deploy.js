const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Registry = await hre.ethers.getContractFactory("CasandraRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const address = await registry.getAddress();
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log(`CasandraRegistry deployed: ${address}`);
  console.log(`chainId: ${chainId}`);

  const out = {
    address,
    chainId,
    network: hre.network.name,
    explorer:
      chainId === 84532
        ? `https://sepolia.basescan.org/address/${address}`
        : null,
    deployedAt: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${outPath}`);

  // Demo publish so judges see a non-empty registry
  const hash = hre.ethers.id("casandra-demo-portfolio-v1");
  const tx = await registry.publishRiskSnapshot(hash, 0, 20, Math.floor(Date.now() / 1000));
  await tx.wait();
  console.log("Published demo snapshot id=0");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
