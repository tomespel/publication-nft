const hre = require("hardhat");
const https = require("https");
const readline = require("readline");
const bip39 = require("bip39");
const { hdkey } = require("@ethereumjs/wallet");

/**
 * Get wallet address from private key
 * @param {string} privateKey - Private key without 0x prefix
 * @returns {string} Wallet address
 */
function getAddressFromPrivateKey(privateKey) {
  const wallet = hre.ethers.Wallet.fromPrivateKey("0x" + privateKey);
  return wallet.address;
}

/**
 * Setup wallet credentials interactively
 * @returns {Object} Object with privateKey and address
 */
async function setupWalletCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter your seed phrase (12 or 24 words): ", (seedPhrase) => {
      rl.close();

      try {
        // Use the correct API for @ethereumjs/wallet
        const hdKey = hdkey.EthereumHDKey.fromMnemonic(seedPhrase.trim());
        const derived = hdKey.derivePath("m/44'/60'/0'/0/0");
        const wallet = derived.getWallet();
        const privateKey = wallet.getPrivateKeyString();
        const address = wallet.getAddressString();

        console.log(`✅ Wallet configured: ${address}`);
        resolve({ privateKey, address });
      } catch (error) {
        console.error(`❌ Invalid seed phrase: ${error.message}`);
        process.exit(1);
      }
    });
  });
}

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

async function estimateDeploymentCost() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    const PublicationNFT = await hre.ethers.getContractFactory(
      "PublicationNFT"
    );

    const deployTx = await PublicationNFT.getDeployTransaction(
      deployer.address
    );
    const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);

    // Get current gas prices
    let gasPrices;
    try {
      gasPrices = await getCurrentGasPrices();
    } catch (error) {
      gasPrices = { safe: 2, proposed: 10, fast: 25 };
    }

    const safeCost = (Number(estimatedGas) * gasPrices.safe) / 1000000000;
    const proposedCost =
      (Number(estimatedGas) * gasPrices.proposed) / 1000000000;
    const fastCost = (Number(estimatedGas) * gasPrices.fast) / 1000000000;

    return {
      gas: estimatedGas,
      costs: {
        safe: safeCost,
        proposed: proposedCost,
        fast: fastCost,
      },
      gasPrices: gasPrices,
    };
  } catch (error) {
    // Fallback to measured values
    const estimatedGas = hre.ethers.parseUnits("1733473", "wei");
    const gasPrices = { safe: 2, proposed: 10, fast: 25 };

    const safeCost = (Number(estimatedGas) * gasPrices.safe) / 1000000000;
    const proposedCost =
      (Number(estimatedGas) * gasPrices.proposed) / 1000000000;
    const fastCost = (Number(estimatedGas) * gasPrices.fast) / 1000000000;

    return {
      gas: estimatedGas,
      costs: {
        safe: safeCost,
        proposed: proposedCost,
        fast: fastCost,
      },
      gasPrices: gasPrices,
    };
  }
}

async function main() {
  // Check for existing credentials
  let deployerAddress = null;
  let hasCredentials = false;

  // Check environment variables first
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) {
    hasCredentials = true;
    deployerAddress = getAddressFromPrivateKey(process.env.PRIVATE_KEY);
  } else if (process.env.SEED_PHRASE) {
    try {
      const hdKey = hdkey.EthereumHDKey.fromMnemonic(process.env.SEED_PHRASE);
      const derived = hdKey.derivePath("m/44'/60'/0'/0/0");
      const wallet = derived.getWallet();
      const privateKey = wallet.getPrivateKeyString();
      hasCredentials = true;
      deployerAddress = wallet.getAddressString();
      // Set the private key for this session
      process.env.PRIVATE_KEY = privateKey;
    } catch (error) {
      console.warn("Invalid SEED_PHRASE in environment:", error.message);
    }
  }

  // If no credentials, prompt for seed phrase
  if (!hasCredentials) {
    console.log("🔑 No wallet credentials found. Let's set up your wallet:");
    const credentials = await setupWalletCredentials();
    deployerAddress = credentials.address;

    // Set the private key for this session
    process.env.PRIVATE_KEY = credentials.privateKey;
  }

  console.log("=== PublicationNFT Contract Deployment ===");
  console.log("Deployer address:", deployerAddress);
  console.log("");

  // Estimate deployment costs
  console.log("🔍 Estimating deployment costs...");
  const estimate = await estimateDeploymentCost();

  console.log(`📊 Estimated gas: ${estimate.gas.toString()}`);

  // Check if we have live gas price data
  let hasLiveData = true;
  try {
    // If gas prices are the fallback values, we don't have live data
    if (
      estimate.gasPrices.safe === 2 &&
      estimate.gasPrices.proposed === 10 &&
      estimate.gasPrices.fast === 25
    ) {
      hasLiveData = false;
    }
  } catch (error) {
    hasLiveData = false;
  }

  if (hasLiveData) {
    console.log(
      `⛽ Current gas prices: Safe ${estimate.gasPrices.safe.toFixed(
        2
      )}gwei, Standard ${estimate.gasPrices.proposed.toFixed(
        2
      )}gwei, Fast ${estimate.gasPrices.fast.toFixed(2)}gwei`
    );
    console.log("");
    console.log("💰 Estimated deployment costs:");
    console.log(
      `   Safe: ${estimate.costs.safe.toFixed(4)} ETH ($${(
        estimate.costs.safe * 3829
      ).toFixed(2)})`
    );
    console.log(
      `   Standard: ${estimate.costs.proposed.toFixed(4)} ETH ($${(
        estimate.costs.proposed * 3829
      ).toFixed(2)})`
    );
    console.log(
      `   Fast: ${estimate.costs.fast.toFixed(4)} ETH ($${(
        estimate.costs.fast * 3829
      ).toFixed(2)})`
    );
    console.log("");
    console.log(
      "⚠️  Disclaimer: These are estimated prices based on real-time data and there is no guarantee of final costs."
    );
  } else {
    console.log(
      "⛽ Live gas price data not available - using fallback estimates"
    );
    console.log("");
    console.log("💰 Estimated deployment costs (fallback):");
    console.log(
      `   Safe: ${estimate.costs.safe.toFixed(4)} ETH ($${(
        estimate.costs.safe * 3829
      ).toFixed(2)})`
    );
    console.log(
      `   Standard: ${estimate.costs.proposed.toFixed(4)} ETH ($${(
        estimate.costs.proposed * 3829
      ).toFixed(2)})`
    );
    console.log(
      `   Fast: ${estimate.costs.fast.toFixed(4)} ETH ($${(
        estimate.costs.fast * 3829
      ).toFixed(2)})`
    );
    console.log("");
    console.log(
      "⚠️  Disclaimer: Live gas price data unavailable. Using fallback estimates - actual costs may vary significantly."
    );
  }

  // Check if user wants to proceed
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const proceed = await new Promise((resolve) => {
    rl.question("Proceed with deployment? (y/N): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });

  if (!proceed) {
    console.log("Deployment cancelled.");
    process.exit(0);
  }

  console.log("\n🚀 Deploying PublicationNFT contract...");

  const PublicationNFT = await hre.ethers.getContractFactory("PublicationNFT");
  const publicationNFT = await PublicationNFT.deploy(deployerAddress);

  const deployTx = await publicationNFT.deploymentTransaction();
  console.log("Deployment transaction hash:", deployTx.hash);

  await publicationNFT.waitForDeployment();

  const contractAddress = await publicationNFT.getAddress();
  console.log("PublicationNFT deployed to:", contractAddress);

  // Get deployment receipt to show gas used
  const receipt = await deployTx.wait();
  console.log("Gas used for deployment:", receipt.gasUsed.toString());

  // Optional: Mint a sample NFT
  if (process.env.MINT_SAMPLE === "true") {
    console.log("\nMinting sample publication NFT...");
    const tx = await publicationNFT.mintPublication(
      deployerAddress,
      "ipfs://QmSampleHash",
      "Sample Publication",
      "John Doe",
      Math.floor(Date.now() / 1000),
      "10.1000/sample-doi",
      "https://metadata.example.com",
      "https://image.example.com/cover.jpg",
      "Sample description",
      "CC-BY-4.0",
      "Computer Science",
      "1.0",
      "https://example.com/paper"
    );

    console.log("Mint transaction hash:", tx.hash);
    const mintReceipt = await tx.wait();
    console.log("Gas used for minting:", mintReceipt.gasUsed.toString());
    console.log("Sample NFT minted successfully!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
