# Publication NFT

Provide an NFT implementation of published works on multiple blockchains.

## Overview

This repository contains NFT smart contracts for published works (books, articles, etc.) deployed on two blockchain platforms:

1. **Ethereum**: ERC-721 implementation using OpenZeppelin and Hardhat
2. **Sui**: Move smart contract for NFT functionality

## Repository Structure

```
publication-nft/
├── ethereum/              # Ethereum ERC-721 smart contracts
│   ├── contracts/         # Solidity smart contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Test files
│   ├── hardhat.config.js  # Hardhat configuration
│   └── package.json       # Node.js dependencies
│
└── sui/                   # SUI blockchain smart contracts
    ├── sources/           # Move smart contracts
    ├── tests/             # Move test files
    └── Move.toml          # SUI Move configuration
```

## Features

### Ethereum (ERC-721)

- **Standard Compliance**: Implements OpenZeppelin's ERC-721 standard
- **Metadata Storage**: On-chain storage of publication details (title, author, publication date, ISBN)
- **URI Support**: IPFS or other decentralized storage for detailed metadata
- **Access Control**: Owner-only minting functionality
- **Comprehensive Testing**: Full test suite using Hardhat

### Sui (Move)

- **Native SUI NFT**: Implements SUI's object model for NFTs
- **Rich Metadata**: Stores title, author, publication date, ISBN, and URLs
- **Display Standard**: Integrated with SUI's Display standard for wallet compatibility
- **Transfer & Burn**: Full lifecycle management of NFTs
- **Type Safety**: Leverages Move's type system for security

## Getting Started

### Ethereum Setup

#### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

#### Installation

```bash
cd ethereum
npm install
```

#### Compile Contracts

```bash
npm run compile
```

#### Run Tests

```bash
npm run test
```

#### Deploy

Local deployment:
```bash
npm run deploy:localhost
```

Testnet deployment (Sepolia):
```bash
# Set environment variables
export SEPOLIA_RPC_URL="your_rpc_url"
export PRIVATE_KEY="your_private_key"
npm run deploy:sepolia
```

#### Usage Example

```javascript
// Mint a new publication NFT
const tx = await publicationNFT.mintPublication(
  recipientAddress,
  "ipfs://QmYourMetadataHash",
  "The Great Gatsby",
  "F. Scott Fitzgerald",
  Math.floor(Date.now() / 1000),
  "978-0-7432-7356-5"
);
```

**Mainnet Contract Address:** `0xBfeA7120A701625B5438ed9A3f06F3BC471DB399`

### Sui Setup

#### Prerequisites

- SUI CLI installed ([Installation Guide](https://docs.sui.io/build/install))
- SUI wallet with test tokens

#### Build the Package

```bash
cd sui
sui move build
```

#### Run Tests

```bash
sui move test
```

#### Deploy

```bash
sui client publish --gas-budget 100000000
```

#### Usage Example

```bash
# Mint a new publication NFT (manual CLI)
sui client call \
  --package 0x58938c4d77a16c5baf8a7267ac0edbeee150658803d50b0222cf03e5d8cad45e \
  --module publication_nft \
  --function mint \
  --args \
    "The Great Gatsby" \
    "F. Scott Fitzgerald" \
    1234567890000 \
    "10.1000/great-gatsby" \
    "https://ipfs.io/ipfs/QmYourMetadataHash" \
    "https://ipfs.io/ipfs/QmYourImageHash" \
    "A classic American novel about the Jazz Age." \
    "CC-BY-4.0" \
    "Literature" \
    "1.0" \
    "https://example.com/paper" \
    <RECIPIENT_ADDRESS> \
  --gas-budget 100000000

# Or use the interactive script (recommended)
./sui/scripts/mint-interactive.sh
```

## Smart Contract Details

### Ethereum Contract: PublicationNFT.sol

Key functions:

- `mintPublication(to, uri, title, authors, publicationDate, doi, description, license, field, version, externalUrl)`
- `getPublication(tokenId)`
- `tokenURI(tokenId)`


### Sui Contract: publication_nft.move

Key functions:

- `mint(title, authors, publication_date, doi, url, image_url, description, license, field, version, external_url, recipient, ctx)`
- `transfer_nft(nft, recipient, ctx)`
- `burn(nft, ctx)`
- Getter functions: `title()`, `authors()`, `publication_date()`, `doi()`, `url()`, `image_url()`, `description()`, `license()`, `field()`, `version()`, `external_url()`


### Ethereum Tests

The Ethereum tests cover:

- Contract deployment
- NFT minting
- Metadata storage and retrieval
- Access control
- Token URI functionality

Run tests:

```bash
cd ethereum
npm test
```

### Sui Tests

The Sui tests cover:

- NFT minting
- NFT transfer
- NFT burning
- Metadata verification

Run tests:

```bash
cd sui
sui move test
```

## Simple Minting on Ethereum and Sui

### Ethereum Minting

For a quick mint on Ethereum mainnet:

1. Set up your environment:

   ```bash
   cd ethereum
   cp .env.example .env
   # Edit .env with your PRIVATE_KEY and MAINNET_RPC_URL
   ```

2. Use the interactive minting script:

   ```bash
   npx hardhat run scripts/mint-interactive.js --network mainnet
   ```

The script will default to the deployed mainnet contract and prompt for all publication details.

### Sui Minting

For a quick mint on Sui mainnet:

1. Ensure you have Sui CLI and test SUI tokens

2. Use the interactive minting script:

   ```bash
   cd sui
   ./scripts/mint-interactive.sh
   ```

The script will prompt for all publication details and mint the NFT on the Sui network.

## Environment Variables

Create a `.env` file in the `ethereum/` directory for sensitive data:

```ini
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-project-id
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your-private-key-here
MINT_SAMPLE=false
```

**⚠️ Never commit your `.env` file to version control!**

## Usage of AI

I used GitHub Copilot to assist in writing and optimizing smart contract code and scripts.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
