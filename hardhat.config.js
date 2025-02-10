require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Uses the Infura endpoint from your .env file
      chainId: 11155111, // Sepolia's chain ID
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
