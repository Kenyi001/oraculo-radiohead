const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const core = await import("@oraculo/market-core");
  const snap = await core.prepareOnChainRiskSnapshot();
  const portfolioHash = hre.ethers.id(snap.portfolioPayload);

  const deployPath = path.join(
    __dirname,
    "..",
    "deployments",
    `${hre.network.name}.json`
  );
  if (!fs.existsSync(deployPath)) {
    console.error(
      `Missing ${deployPath} — run npm run contracts:deploy:base (or :local) first.`
    );
    process.exit(1);
  }
  let { address } = JSON.parse(fs.readFileSync(deployPath, "utf8"));
  let registry = await hre.ethers.getContractAt("CasandraRegistry", address);
  const code = await hre.ethers.provider.getCode(address);
  if (code === "0x") {
    console.warn(`No contract at ${address} — deploying fresh on ${hre.network.name}...`);
    const Registry = await hre.ethers.getContractFactory("CasandraRegistry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();
    address = await registry.getAddress();
    console.log(`CasandraRegistry deployed: ${address}`);
  }

  console.log("Publishing risk snapshot...");
  console.log(
    JSON.stringify(
      {
        registry: address,
        portfolioHash,
        band: snap.band,
        score: snap.score,
        timestamp: snap.timestamp,
        verdict: snap.risk.verdict,
      },
      null,
      2
    )
  );

  const tx = await registry.publishRiskSnapshot(
    portfolioHash,
    snap.band,
    snap.score,
    snap.timestamp
  );
  const receipt = await tx.wait();
  console.log(`Published risk snapshot tx=${receipt.hash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
