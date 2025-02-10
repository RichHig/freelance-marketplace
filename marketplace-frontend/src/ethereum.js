// src/ethereum.js
import { ethers } from "ethers";
import MarketplaceABI from "./MarketplaceABI.json";

// Use your deployed contract address (example address):
const contractAddress = "0xEF9b13F15248adC61f76E71B9876621260991bC5";

export async function connectWallet() {
  if (!window.ethereum) {
    alert(
      "MetaMask is not installed. Please install MetaMask to use this DApp."
    );
    return null;
  }

  // Request account access from MetaMask
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Create a provider (using Ethers v6)
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Create a contract instance using the deployed contract address and ABI
  const marketplaceContract = new ethers.Contract(
    contractAddress,
    MarketplaceABI,
    signer
  );

  return { provider, signer, marketplaceContract };
}
