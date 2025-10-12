/**
 * Interactive script for minting Publication NFTs on Ethereum
 * Prompts for all required parameters and validates inputs before minting
 *
 * Usage:
 * node scripts/mint-interactive.js <contract-address>
 */

const hre = require("hardhat");
const readline = require("readline");
const https = require("https");
const bip39 = require("bip39");
const { hdkey } = require("@ethereumjs/wallet");
const { ethers } = require("ethers");

/**
 * Derive private key from seed phrase
 */
function derivePrivateKeyFromSeed(seedPhrase) {
  const hdKey = hdkey.EthereumHDKey.fromMnemonic(seedPhrase);
  const child = hdKey.derivePath("m/44'/60'/0'/0/0");
  const wallet = child.getWallet();
  return wallet.getPrivateKeyString();
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

async function setupWalletCredentials() {
  // Check if credentials are already set in environment
  if (process.env.PRIVATE_KEY || process.env.SEED_PHRASE) {
    console.log("✅ Using credentials from environment variables");

    // Still need to return the wallet address for default recipient
    let walletAddress;
    if (process.env.PRIVATE_KEY) {
      // Get address from private key
      const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY);
      walletAddress = wallet.address;
    } else if (process.env.SEED_PHRASE) {
      // Derive address from seed phrase
      const hdKey = hdkey.EthereumHDKey.fromMnemonic(
        process.env.SEED_PHRASE.trim()
      );
      const derived = hdKey.derivePath("m/44'/60'/0'/0/0");
      const wallet = derived.getWallet();
      walletAddress = wallet.getAddressString();
    }

    return walletAddress;
  }

  console.log("🔐 No wallet credentials found in environment variables");
  console.log("Please provide your seed phrase to continue:");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let seedPhrase;
  do {
    seedPhrase = await askQuestion(
      rl,
      "Enter your 12 or 24 word seed phrase: "
    );
    if (!bip39.validateMnemonic(seedPhrase)) {
      console.log("❌ Invalid seed phrase. Please try again.");
      seedPhrase = null;
    }
  } while (!seedPhrase);

  rl.close();

  // Derive private key from seed phrase
  const hdKey = hdkey.EthereumHDKey.fromMnemonic(seedPhrase);
  const derived = hdKey.derivePath("m/44'/60'/0'/0/0");
  const wallet = derived.getWallet();
  const privateKey = wallet.getPrivateKeyString();

  // Set the private key in environment for this session
  process.env.PRIVATE_KEY = privateKey;

  console.log("✅ Wallet configured successfully");
  console.log("📧 Wallet address:", wallet.getAddressString());

  return wallet.getAddressString();
}

async function estimateMintCost(contractAddress) {
  try {
    const PublicationNFT = await hre.ethers.getContractFactory(
      "PublicationNFT"
    );
    const publicationNFT = PublicationNFT.attach(contractAddress);

    // Estimate gas for a typical mint transaction
    const mintTx = await publicationNFT.mintPublication.populateTransaction(
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // dummy address
      "ipfs://QmSampleHash123456789012345678901234567890123456789012345678901234567890",
      "Sample Academic Publication Title: A Comprehensive Study of Blockchain Technology",
      "Dr. Jane Smith, Prof. John Doe, Dr. Alice Johnson",
      1700000000,
      "10.1000/nature.2024.12345",
      "https://metadata.example.com/publication/12345",
      "https://images.example.com/publications/12345/cover.jpg",
      "This publication presents a comprehensive analysis of blockchain technology applications in academic publishing",
      "Creative Commons Attribution 4.0 International (CC BY 4.0)",
      "Computer Science",
      "1.2.3",
      "https://doi.org/10.1000/nature.2024.12345"
    );

    const estimatedGas = await hre.ethers.provider.estimateGas(mintTx);

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
    const estimatedGas = hre.ethers.parseUnits("423938", "wei");
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

function validateAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

function validateUrl(url) {
  // Allow HTTP(S) and IPFS URLs
  return /^(https?:\/\/|ipfs:\/\/).+/.test(url);
}

function validateNumber(num) {
  return /^\d+$/.test(num) && !isNaN(num);
}

function validateString(str) {
  return str && str.trim().length > 0;
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  // Setup wallet credentials if needed
  const walletAddress = await setupWalletCredentials();

  // Get the signer from Hardhat (this will use the correct network)
  const [signer] = await hre.ethers.getSigners();
  console.log(
    "Using",
    hre.network.name,
    "network with address:",
    signer.address
  );

  const args = process.argv.slice(2);
  let contractAddress = args[0];

  // Check for contract address in environment variable if not provided as arg
  if (!contractAddress) {
    contractAddress = process.env.CONTRACT_ADDRESS;
  }

  // Use deployed contracts if no address provided
  if (!contractAddress) {
    // Check if we're targeting sepolia or mainnet network
    const networkName = hre.network.name;
    if (networkName === "mainnet") {
      contractAddress =
        process.env.MAINNET_CONTRACT_ADDRESS ||
        "0xBfeA7120A701625B5438ed9A3f06F3BC471DB399";
      console.log("Using deployed Mainnet contract:", contractAddress);
    } else if (networkName === "sepolia") {
      contractAddress =
        process.env.SEPOLIA_CONTRACT_ADDRESS ||
        "0x613AFb793B3554704f04D701A4f52B96A2B29e4F";
      console.log("Using deployed Sepolia contract:", contractAddress);
    } else if (networkName === "hardhat") {
      // For hardhat network, we need a contract address
      console.error(
        "For hardhat network, please provide CONTRACT_ADDRESS environment variable or pass as argument"
      );
      console.error(
        "Usage: CONTRACT_ADDRESS=<address> npx hardhat run scripts/mint-interactive.js --network hardhat"
      );
      process.exit(1);
    } else {
      console.error(
        "Usage: npx hardhat run scripts/mint-interactive.js --network <network>"
      );
      console.error(
        "For Sepolia: npx hardhat run scripts/mint-interactive.js --network sepolia"
      );
      console.error(
        "For Mainnet: npx hardhat run scripts/mint-interactive.js --network mainnet"
      );
      console.error(
        "For other networks: CONTRACT_ADDRESS=<address> npx hardhat run scripts/mint-interactive.js --network <network>"
      );
      process.exit(1);
    }
  }

  if (!validateAddress(contractAddress)) {
    console.error("Error: Invalid contract address format");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("=== Publication NFT Minting Script ===");

  // Get recipient address
  let recipientAddress;
  const defaultRecipient = walletAddress || "";
  do {
    const prompt = defaultRecipient
      ? `Enter Recipient Address (default: ${defaultRecipient}): `
      : "Enter Recipient Address: ";
    recipientAddress = await askQuestion(rl, prompt);

    // Use default if empty and we have a wallet address
    if (!recipientAddress && defaultRecipient) {
      recipientAddress = defaultRecipient;
      console.log(`Using wallet address: ${recipientAddress}`);
    }

    if (!validateAddress(recipientAddress)) {
      console.log(
        "Error: Invalid recipient address format (should be 0x followed by 40 hex characters)"
      );
    }
  } while (!validateAddress(recipientAddress));

  // Get title
  let title;
  do {
    title = await askQuestion(rl, "Enter Publication Title: ");
    if (!validateString(title)) {
      console.log("Error: Title cannot be empty");
    }
  } while (!validateString(title));

  // Get authors
  let authors;
  do {
    authors = await askQuestion(rl, "Enter Authors (comma-separated): ");
    if (!validateString(authors)) {
      console.log("Error: Authors cannot be empty");
    }
  } while (!validateString(authors));

  // Get publication date
  let publicationDate;
  do {
    publicationDate = await askQuestion(
      rl,
      "Enter Publication Date (Unix timestamp in seconds): "
    );
    if (!validateNumber(publicationDate)) {
      console.log("Error: Publication date must be a valid number");
    } else if (parseInt(publicationDate) > 4294967295) {
      console.log(
        "Error: Publication date too large for uint32 (max: 4294967295)"
      );
      publicationDate = null;
    }
  } while (!validateNumber(publicationDate) || publicationDate === null);

  // Get DOI
  let doi;
  do {
    doi = await askQuestion(rl, "Enter DOI: ");
    if (!validateString(doi)) {
      console.log("Error: DOI cannot be empty");
    }
  } while (!validateString(doi));

  // Get metadata URL
  let uri;
  do {
    uri = await askQuestion(rl, "Enter Metadata URL (https:// or ipfs://): ");
    if (!validateUrl(uri)) {
      console.log(
        "Error: Invalid URL format (must start with http://, https://, or ipfs://)"
      );
    }
  } while (!validateUrl(uri));

  // Get image URL
  let imageUrl;
  do {
    imageUrl = await askQuestion(rl, "Enter Image URL (https:// or ipfs://): ");
    if (!validateUrl(imageUrl)) {
      console.log(
        "Error: Invalid URL format (must start with http://, https://, or ipfs://)"
      );
    }
  } while (!validateUrl(imageUrl));

  // Get description
  let description;
  do {
    description = await askQuestion(rl, "Enter Description/Abstract: ");
    if (!validateString(description)) {
      console.log("Error: Description cannot be empty");
    }
  } while (!validateString(description));

  // Get license
  let license;
  do {
    license = await askQuestion(rl, "Enter License (e.g., CC-BY-4.0): ");
    if (!validateString(license)) {
      console.log("Error: License cannot be empty");
    }
  } while (!validateString(license));

  // Get field
  let field;
  do {
    field = await askQuestion(rl, "Enter Field of Study (max 32 chars): ");
    if (!validateString(field)) {
      console.log("Error: Field cannot be empty");
    } else if (field.length > 32) {
      console.log("Error: Field must be 32 characters or less");
      field = null;
    }
  } while (!validateString(field) || field === null);

  // Get version
  let version;
  do {
    version = await askQuestion(rl, "Enter Version (max 32 chars): ");
    if (!validateString(version)) {
      console.log("Error: Version cannot be empty");
    } else if (version.length > 32) {
      console.log("Error: Version must be 32 characters or less");
      version = null;
    }
  } while (!validateString(version) || version === null);

  // Get external URL
  let externalUrl;
  do {
    externalUrl = await askQuestion(
      rl,
      "Enter External URL (https:// or ipfs://): "
    );
    if (!validateUrl(externalUrl)) {
      console.log(
        "Error: Invalid URL format (must start with http://, https://, or ipfs://)"
      );
    }
  } while (!validateUrl(externalUrl));

  rl.close();

  console.log("\n=== Review Publication Details ===");
  console.log("Contract Address:", contractAddress);
  console.log("Recipient Address:", recipientAddress);
  console.log("Title:", title);
  console.log("Authors:", authors);
  console.log("Publication Date:", publicationDate);
  console.log("DOI:", doi);
  console.log("Metadata URL:", uri);
  console.log("Image URL:", imageUrl);
  console.log("Description:", description);
  console.log("License:", license);
  console.log("Field:", field);
  console.log("Version:", version);
  console.log("External URL:", externalUrl);
  console.log("");

  // Estimate minting costs
  console.log("🔍 Estimating minting costs...");
  const estimate = await estimateMintCost(contractAddress);

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
    console.log("💰 Estimated minting costs:");
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
    console.log("💰 Estimated minting costs (fallback):");
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

  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const confirm = await askQuestion(rl2, "Proceed with minting? (y/N): ");
  rl2.close();

  if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
    console.log("Minting cancelled.");
    process.exit(0);
  }

  console.log("\nMinting Publication NFT...");

  // Create contract instance with signer
  const contract = new ethers.Contract(
    contractAddress,
    [
      "function mintPublication(address,string,string,string,uint32,string,string,string,string,string,string,string,string) external returns (uint256)",
    ],
    signer
  );

  // Mint the NFT
  const tx = await contract.mintPublication(
    recipientAddress,
    uri, // metadata URI (IPFS/HTTP)
    title,
    authors,
    parseInt(publicationDate), // Convert to number for uint32
    doi,
    uri, // metadata URL (keeping for backward compatibility)
    imageUrl,
    description,
    license,
    field,
    version,
    externalUrl
  );

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ NFT minted successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Find the token ID from the event
  const event = receipt.logs.find((log) => {
    return (
      log.address === contractAddress &&
      log.topics[0] ===
        ethers.id("PublicationMinted(uint256,address,string,string)")
    );
  });

  if (event) {
    const iface = new ethers.Interface([
      "event PublicationMinted(uint256 indexed tokenId, address indexed owner, string title, string authors)",
    ]);
    const parsed = iface.parseLog(event);
    console.log("Token ID:", parsed.args.tokenId.toString());
  }

  console.log("\nYou can view the NFT on OpenSea or Etherscan:");
  console.log("https://opensea.io");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
