/**
 * Simple script to check Ethereum wallet balance
 *
 * Usage:
 * npx hardhat run scripts/check-balance.js
 */

const hre = require("hardhat");

async function main() {
  // Get the signer (wallet) from Hardhat
  const [signer] = await hre.ethers.getSigners();

  console.log("Checking wallet balance...");
  console.log("Address:", signer.address);

  // Get balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  const balanceInEth = hre.ethers.formatEther(balance);

  console.log("Balance:", balanceInEth, "ETH");

  // Check network
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name, `(Chain ID: ${network.chainId})`);

  if (network.chainId === 11155111) {
    // Sepolia
    console.log("\n💡 Tips for Sepolia testnet:");
    console.log("  - Get test ETH from: https://sepoliafaucet.com");
    console.log("  - Or: https://faucet.quicknode.com/ethereum/sepolia");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
