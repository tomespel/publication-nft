# Publication NFT

Provide an NFT implementation of published works on multiple blockchains.

## Overview

This repository contains NFT smart contracts for published works (books, articles, etc.) deployed on two blockchain platforms:

1. **Ethereum**: ERC-721 implementation using OpenZeppelin and Hardhat
2. **SUI**: Move smart contract for NFT functionality

## Repository Structure

```
publication-nft/
├── ethereum/               # Ethereum ERC-721 smart contracts
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

### SUI (Move)

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

### SUI Setup

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
# Mint a new publication NFT
sui client call \
  --package <PACKAGE_ID> \
  --module publication_nft \
  --function mint \
  --args \
    "The Great Gatsby" \
    "F. Scott Fitzgerald" \
    1234567890000 \
    "978-0-7432-7356-5" \
    "https://ipfs.io/ipfs/QmYourMetadataHash" \
    "https://ipfs.io/ipfs/QmYourImageHash" \
    <RECIPIENT_ADDRESS> \
  --gas-budget 10000000
```

## Smart Contract Details

### Ethereum Contract: PublicationNFT.sol

Key functions:
- `mintPublication()`: Mint a new publication NFT with metadata
- `getPublication()`: Retrieve publication metadata by token ID
- `tokenURI()`: Get the token URI for a given token ID

### SUI Contract: publication_nft.move

Key functions:
- `mint()`: Mint a new publication NFT
- `transfer_nft()`: Transfer an NFT to a new owner
- `burn()`: Burn an NFT
- Getter functions: `title()`, `author()`, `publication_date()`, `isbn()`, `url()`, `image_url()`

## Testing

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

### SUI Tests

The SUI tests cover:
- NFT minting
- NFT transfer
- NFT burning
- Metadata verification

Run tests:
```bash
cd sui
sui move test
```

## Environment Variables

Create a `.env` file in the `ethereum/` directory for sensitive data:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-project-id
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your-private-key-here
MINT_SAMPLE=false
```

**⚠️ Never commit your `.env` file to version control!**

## Security Considerations

- Always use a hardware wallet or secure key management for mainnet deployments
- Test thoroughly on testnets before mainnet deployment
- Consider getting a professional audit for production use
- Keep dependencies up to date for security patches

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
