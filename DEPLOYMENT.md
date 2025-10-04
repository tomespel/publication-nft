# Deployment Guide

This guide covers deploying the Publication NFT contracts to both Ethereum and SUI networks.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Ethereum Deployment](#ethereum-deployment)
- [SUI Deployment](#sui-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For Ethereum

- Node.js v18 or higher
- npm or yarn
- Ethereum wallet with ETH for gas fees
- RPC endpoint (Infura, Alchemy, or your own node)

### For SUI

- SUI CLI installed ([Installation Guide](https://docs.sui.io/build/install))
- SUI wallet with SUI tokens for gas
- Active internet connection

## Ethereum Deployment

### Step 1: Install Dependencies

```bash
cd ethereum
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the `ethereum/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x_prefix
MINT_SAMPLE=false
```

**⚠️ SECURITY WARNING:**
- Never commit your `.env` file
- Use a separate wallet for deployment
- For mainnet, consider using a hardware wallet or multisig

### Step 3: Compile Contracts

```bash
npm run compile
```

This will:
- Download the Solidity compiler
- Compile all contracts
- Generate artifacts in `artifacts/` directory
- Generate TypeScript types in `typechain-types/`

### Step 4: Test Contracts (Recommended)

```bash
npm run test
```

Ensure all tests pass before deployment.

### Step 5: Deploy to Testnet (Sepolia)

```bash
npm run deploy:sepolia
```

Expected output:
```
Deploying PublicationNFT contract with the account: 0x...
PublicationNFT deployed to: 0x...
```

**Save the contract address!** You'll need it to interact with the contract.

### Step 6: Verify Contract on Etherscan (Optional)

Add Etherscan API key to `.env`:
```
ETHERSCAN_API_KEY=your_api_key
```

Verify the contract:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```

### Step 7: Deploy to Mainnet (Production)

⚠️ **Only after thorough testing on testnet!**

```bash
npm run deploy:mainnet
```

### Minting Example (Ethereum)

After deployment, mint an NFT:

```bash
node scripts/mint-example.js <CONTRACT_ADDRESS> <RECIPIENT_ADDRESS>
```

## SUI Deployment

### Step 1: Install SUI CLI

Follow the [official installation guide](https://docs.sui.io/build/install).

Verify installation:
```bash
sui --version
```

### Step 2: Configure Wallet

Create a new wallet or import existing one:

```bash
# Create new wallet
sui client new-address ed25519

# Or switch to existing wallet
sui client switch --address <ADDRESS>
```

Check your active address:
```bash
sui client active-address
```

### Step 3: Get Test Tokens (Testnet)

For testnet deployment:

```bash
# Switch to testnet
sui client switch --env testnet

# Request test tokens
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{"FixedAmountRequest":{"recipient":"<YOUR_ADDRESS>"}}'
```

### Step 4: Build Package

```bash
cd sui
sui move build
```

This will:
- Compile Move modules
- Check for errors
- Generate build artifacts

### Step 5: Test Package (Recommended)

```bash
sui move test
```

Ensure all tests pass before deployment.

### Step 6: Deploy to Testnet

```bash
# Ensure you're on testnet
sui client switch --env testnet

# Publish the package
sui client publish --gas-budget 100000000
```

Expected output will include:
- Package ID (save this!)
- Transaction digest
- Created objects (including Display and Publisher objects)

**Important:** Save the Package ID from the output!

Example output:
```
----- Transaction Digest ----
<TRANSACTION_DIGEST>

----- Transaction Data ----
...

----- Transaction Effects ----
...

----- Object Changes ----
Created Objects:
  ┌──
  │ ObjectID: 0x... (This is your PACKAGE_ID)
  │ ...
```

### Step 7: Deploy to Mainnet (Production)

⚠️ **Only after thorough testing on testnet!**

```bash
# Switch to mainnet
sui client switch --env mainnet

# Ensure you have sufficient SUI for gas
sui client gas

# Publish the package
sui client publish --gas-budget 100000000
```

### Minting Example (SUI)

After deployment, mint an NFT:

```bash
cd sui
./scripts/mint-example.sh <PACKAGE_ID> <RECIPIENT_ADDRESS>
```

Or manually:

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module publication_nft \
  --function mint \
  --args \
    "Book Title" \
    "Author Name" \
    1234567890000 \
    "978-0-123456-78-9" \
    "https://ipfs.io/ipfs/QmMetadataHash" \
    "https://ipfs.io/ipfs/QmImageHash" \
    <RECIPIENT_ADDRESS> \
  --gas-budget 10000000
```

## Post-Deployment

### Ethereum

1. **Verify Contract**: Use Etherscan verification
2. **Update Frontend**: Configure frontend with contract address and ABI
3. **Grant Roles**: If using additional access control, grant necessary roles
4. **Test Minting**: Mint a test NFT to verify functionality
5. **Monitor**: Set up monitoring for contract events

### SUI

1. **Save Package ID**: Store the package ID in your application config
2. **Test Functionality**: Mint and transfer test NFTs
3. **Update Frontend**: Configure frontend with package ID
4. **Monitor**: Use SUI Explorer to monitor transactions
5. **Update Display**: If needed, update the Display object

## Security Checklist

- [ ] All tests passing
- [ ] Contract code reviewed
- [ ] Environment variables secured
- [ ] Testnet deployment successful
- [ ] Functionality tested on testnet
- [ ] Gas costs estimated and acceptable
- [ ] Access controls verified
- [ ] Emergency procedures documented
- [ ] Monitoring set up
- [ ] Backup of deployment keys secured

## Cost Estimation

### Ethereum (approximate on Sepolia/Mainnet)

- **Deployment**: ~2-3M gas (~$50-150 at 50 gwei, $ETH at $2000)
- **Minting**: ~200-300k gas per NFT (~$10-15 per mint)

### SUI (approximate)

- **Package Publication**: ~0.1-0.5 SUI
- **Minting**: ~0.001-0.01 SUI per NFT

**Note**: Costs vary based on network congestion and gas prices.

## Troubleshooting

### Ethereum

**Problem**: "Insufficient funds for gas"
- **Solution**: Ensure your wallet has enough ETH for gas fees

**Problem**: "Nonce too low"
- **Solution**: Reset your wallet's transaction history or use a different RPC endpoint

**Problem**: Contract verification fails
- **Solution**: Ensure constructor arguments match deployment

### SUI

**Problem**: "Insufficient gas"
- **Solution**: Increase gas budget or get more SUI tokens

**Problem**: "Package verification failed"
- **Solution**: Ensure all dependencies are correctly specified in Move.toml

**Problem**: "Address resolution failed"
- **Solution**: Check that you're using the correct address format

## Resources

### Ethereum
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Etherscan](https://etherscan.io) / [Sepolia Etherscan](https://sepolia.etherscan.io)

### SUI
- [SUI Documentation](https://docs.sui.io)
- [SUI Move Book](https://move-book.com)
- [SUI Explorer](https://suiexplorer.com)
- [SUI Testnet Faucet](https://discord.gg/sui)

## Support

For issues or questions:
1. Check the README files in respective directories
2. Review test files for usage examples
3. Consult blockchain-specific documentation
4. Open an issue in the repository
