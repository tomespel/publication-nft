require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const bip39 = require("bip39");
const { hdkey } = require("@ethereumjs/wallet");

/**
 * Derive private key from seed phrase
 * @param {string} seedPhrase - The BIP39 seed phrase
 * @param {number} accountIndex - The account index (default: 0)
 * @returns {string} Private key without 0x prefix
 */
function derivePrivateKeyFromSeed(seedPhrase, accountIndex = 0) {
  if (!seedPhrase || seedPhrase.trim().length === 0) {
    throw new Error("Seed phrase is required");
  }

  // Create HD key from mnemonic directly
  const hdKey = hdkey.EthereumHDKey.fromMnemonic(seedPhrase.trim());

  // Derive path: m/44'/60'/0'/0/{accountIndex}
  const path = `m/44'/60'/0'/0/${accountIndex}`;
  const child = hdKey.derivePath(path);

  // Get wallet and private key
  const wallet = child.getWallet();
  const privateKey = wallet.getPrivateKeyString();

  // Return private key with 0x prefix removed
  return privateKey.slice(2);
}

/**
 * Get accounts for network deployment
 * @param {string} networkName - The network name
 * @returns {string[]} Array of private keys
 */
function getAccounts(networkName) {
  // First try to get private key directly from env
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) {
    console.log(`🔑 Using direct private key for ${networkName}`);
    return [process.env.PRIVATE_KEY];
  }

  // Then try to derive from seed phrase
  if (process.env.SEED_PHRASE) {
    try {
      const hdKey = hdkey.EthereumHDKey.fromMnemonic(process.env.SEED_PHRASE);
      const derived = hdKey.derivePath("m/44'/60'/0'/0/0");
      const wallet = derived.getWallet();
      const privateKey = wallet.getPrivateKeyString();
      console.log(`🔑 Derived private key from seed phrase for ${networkName}`);
      return [privateKey.slice(2)]; // Remove 0x prefix
    } catch (error) {
      console.error(
        `❌ Failed to derive private key from seed phrase: ${error.message}`
      );
      return [];
    }
  }

  // No valid credentials found
  console.warn(
    `⚠️  No valid credentials found for ${networkName}. Set PRIVATE_KEY or SEED_PHRASE in .env`
  );
  return [];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: getAccounts("sepolia"),
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: getAccounts("mainnet"),
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
