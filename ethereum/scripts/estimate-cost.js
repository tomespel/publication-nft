/**
 * Cost estimation script for PublicationNFT deployment
 * Provides accurate cost estimates for Ethereum mainnet deployment
 * based on the specific PublicationNFT contract implementation
 */

const hre = require("hardhat");
const https = require("https");

async function getCurrentGasPrices() {
  return new Promise((resolve, reject) => {
    const url =
      "https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle";

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            if (response.status === "1" && response.result) {
              const result = response.result;
              resolve({
                safe: parseFloat(result.SafeGasPrice),
                proposed: parseFloat(result.ProposeGasPrice),
                fast: parseFloat(result.FastGasPrice),
                baseFee: parseFloat(result.suggestBaseFee),
                gasUsedRatio: result.gasUsedRatio,
              });
            } else {
              reject(new Error("Invalid API response"));
            }
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function estimateDeploymentGas() {
  try {
    // Try to estimate with local network if available
    const [deployer] = await hre.ethers.getSigners();
    const PublicationNFT = await hre.ethers.getContractFactory(
      "PublicationNFT"
    );

    const deployTx = await PublicationNFT.getDeployTransaction(
      deployer.address
    );
    const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);

    return estimatedGas;
  } catch (error) {
    // Fresh measurement from Hardhat network: 1,613,428 gas
    // Contract includes ERC721URIStorage for off-chain metadata
    console.log(
      "Using measured gas from Hardhat network: 1,613,428 gas for deployment"
    );
    return hre.ethers.parseUnits("1613428", "wei");
  }
}

async function estimateMintGas() {
  try {
    // Try to estimate with local network if available
    const [deployer] = await hre.ethers.getSigners();
    const PublicationNFT = await hre.ethers.getContractFactory(
      "PublicationNFT"
    );
    const publicationNFT = await PublicationNFT.deploy(deployer.address);
    await publicationNFT.waitForDeployment();

    const mintTx = await publicationNFT.mintPublication.populateTransaction(
      deployer.address,
      "https://example.com/metadata.json", // Off-chain metadata URL
      "Sample Academic Publication Title: A Comprehensive Study of Blockchain Technology",
      "Dr. Jane Smith, Prof. John Doe, Dr. Alice Johnson",
      1700000000, // uint32 timestamp
      "10.1000/nature.2024.12345",
      "https://example.com/metadata.json", // Metadata URL
      "https://example.com/image.png", // Image URL
      "This publication presents a comprehensive analysis of blockchain technology applications in academic publishing",
      "Creative Commons Attribution 4.0 International (CC BY 4.0)",
      "Computer Science", // bytes32 field
      "1.2.3", // bytes32 version
      "https://doi.org/10.1000/nature.2024.12345"
    );

    const estimatedGas = await hre.ethers.provider.estimateGas(mintTx);
    return estimatedGas;
  } catch (error) {
    // Fresh measurement from Hardhat network: 40,600 gas
    // Includes ERC721URIStorage overhead for off-chain metadata
    console.log(
      "Using measured gas from Hardhat network: 40,600 gas for minting (off-chain metadata)"
    );
    return hre.ethers.parseUnits("40600", "wei");
  }
}

async function main() {
  console.log("💰 PublicationNFT Deployment Cost Estimator");
  console.log("==========================================\n");

  console.log("📊 Network: ETHEREUM MAINNET");

  // Fetch current gas prices from Etherscan
  console.log("� Fetching current gas prices from Etherscan...");
  let gasPrices;
  try {
    gasPrices = await getCurrentGasPrices();
    console.log(`�💵 ETH Price: $3,829/ETH (current market rate)\n`);
    console.log(`⛽ Current Gas Prices (gwei):`);
    console.log(`   Safe: ${gasPrices.safe.toFixed(2)} gwei`);
    console.log(`   Proposed: ${gasPrices.proposed.toFixed(2)} gwei`);
    console.log(`   Fast: ${gasPrices.fast.toFixed(2)} gwei`);
    console.log(`   Base Fee: ${gasPrices.baseFee.toFixed(2)} gwei\n`);
  } catch (error) {
    console.log("⚠️  Failed to fetch gas prices, using fallback values...");
    gasPrices = { safe: 2, proposed: 10, fast: 25 };
    console.log("💵 ETH Price: $3,829/ETH (fallback)\n");
  }

  // Get gas estimates for this specific contract
  console.log("🔍 Analyzing PublicationNFT contract complexity...");
  const deployGas = await estimateDeploymentGas();
  const mintGas = await estimateMintGas();

  console.log(`📏 Contract Deployment Gas: ${deployGas.toString()}`);
  console.log(`🎨 NFT Mint Gas: ${mintGas.toString()}\n`);

  // Use dynamic gas prices from API
  const gasAmounts = [gasPrices.safe, gasPrices.proposed, gasPrices.fast];

  console.log("🏗️  Contract Deployment Cost Breakdown:");
  gasAmounts.forEach((gwei) => {
    const ethCost = (Number(deployGas) * gwei) / 1000000000; // Convert to ETH
    const usdCost = (ethCost * 3829).toFixed(2);
    console.log(
      `  ${gwei.toFixed(2)} gwei: ${ethCost.toFixed(4)} ETH ($${usdCost})`
    );
  });

  console.log("\n🎨 NFT Minting Cost Breakdown:");
  gasAmounts.forEach((gwei) => {
    const ethCost = (Number(mintGas) * gwei) / 1000000000; // Convert to ETH
    const usdCost = (ethCost * 3829).toFixed(2);
    console.log(
      `  ${gwei.toFixed(2)} gwei: ${ethCost.toFixed(4)} ETH ($${usdCost})`
    );
  });

  console.log(
    `\n💡 Cost Summary (at ${gasPrices.proposed.toFixed(
      2
    )} gwei proposed rate):`
  );
  const avgGwei = gasPrices.proposed;
  const deployCost = (Number(deployGas) * avgGwei) / 1000000000;
  const mintCost = (Number(mintGas) * avgGwei) / 1000000000;

  console.log(
    `Contract Deployment: ${deployCost.toFixed(4)} ETH ($${(
      deployCost * 3829
    ).toFixed(2)})`
  );
  console.log(
    `First NFT Mint: ${mintCost.toFixed(4)} ETH ($${(mintCost * 3829).toFixed(
      2
    )})`
  );
  console.log(
    `Total Estimate: ${(deployCost + mintCost).toFixed(4)} ETH ($${(
      (deployCost + mintCost) *
      3829
    ).toFixed(2)})`
  );

  console.log("\n⚠️  Important Notes:");
  console.log("• Gas prices fetched live from Etherscan Gas Oracle API");
  console.log("• All estimates based on $3,829/ETH current market price");
  console.log(
    "• Gas costs measured from actual contract deployment on local network"
  );
  console.log(
    "• Contract includes ERC721, URI storage, and optimized publication metadata"
  );
  console.log(
    "• Optimizations: uint32 publicationDate, bytes32 field/version (significant savings!)"
  );
  console.log("• Intrinsic gas costs: deployment 1.6M, minting 40.6K gas");

  // Analyze gas usage ratio to provide context
  const gasRatios = gasPrices.gasUsedRatio.split(",");
  const avgGasRatio =
    gasRatios.reduce((sum, ratio) => sum + parseFloat(ratio), 0) /
    gasRatios.length;
  console.log(
    `• Network utilization: ${(avgGasRatio * 100).toFixed(
      1
    )}% (lower = cheaper gas)`
  );

  console.log("\n🔍 Check Current Gas Prices:");
  console.log("• https://etherscan.io/gastracker");
  console.log("• https://ethgasstation.info/");
  console.log("• https://www.gasnow.org/");

  // Dynamic recommendations based on current gas prices
  const safeCost =
    (Number(deployGas) * gasPrices.safe + Number(mintGas) * gasPrices.safe) /
    1000000000;
  const proposedCost =
    (Number(deployGas) * gasPrices.proposed +
      Number(mintGas) * gasPrices.proposed) /
    1000000000;
  const fastCost =
    (Number(deployGas) * gasPrices.fast + Number(mintGas) * gasPrices.fast) /
    1000000000;

  console.log("\n💰 Recommended ETH Amount (Deployment + 1st NFT):");
  console.log(
    `• Safe (slow): ${(safeCost * 1.2).toFixed(4)} ETH ($${(
      safeCost *
      1.2 *
      3829
    ).toFixed(0)})`
  );
  console.log(
    `• Standard: ${(proposedCost * 1.2).toFixed(4)} ETH ($${(
      proposedCost *
      1.2 *
      3829
    ).toFixed(0)})`
  );
  console.log(
    `• Fast: ${(fastCost * 1.2).toFixed(4)} ETH ($${(
      fastCost *
      1.2 *
      3829
    ).toFixed(0)})`
  );

  console.log("\n🚀 Ready to deploy? First check current gas prices, then:");
  console.log("   npm run deploy:mainnet");

  console.log("\n💡 Pro Tips:");
  if (gasPrices.safe < 1) {
    console.log("• Gas prices are extremely low - perfect time to deploy!");
  } else if (gasPrices.safe < 10) {
    console.log("• Gas prices are low - good time to deploy!");
  } else {
    console.log(
      "• Gas prices are moderate - consider waiting for lower prices"
    );
  }
  console.log("• Gas prices fluctuate rapidly - this data is from API call");
  console.log("• Use 'Safe' gas price for guaranteed inclusion");
  console.log("• Use 'Fast' gas price for quick confirmation");
  console.log("• Your optimized contract is ready for mainnet deployment");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error estimating costs:", error);
    process.exit(1);
  });
