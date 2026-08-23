require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const { PRIVATE_KEY, BASE_SEPOLIA_RPC, SEPOLIA_RPC } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./contracts/test",
    cache: "./contracts/cache",
    artifacts: "./contracts/artifacts",
  },
  networks: {
    hardhat: {},
    /** Official Aleph demo network (faucet available to the team). */
    sepolia: {
      url: SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    /** Optional — keep if Base faucet becomes available later. */
    baseSepolia: {
      url: BASE_SEPOLIA_RPC || "https://base-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
