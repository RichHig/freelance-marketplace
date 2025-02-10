// scripts/deploy.js

async function main() {
  // Get the contract factory for Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");

  // Deploy the contract
  const marketplace = await Marketplace.deploy();

  // Wait until the contract is fully deployed using the Ethers v6 method
  await marketplace.waitForDeployment();

  // In Ethers v6, the deployed contract address is available via the "target" property
  console.log("Marketplace deployed to:", marketplace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
