# Ethereum Smart Contracts

This directory contains the Ethereum ERC-721 smart contract implementation for Publication NFTs.

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npm run deploy:localhost

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

## Contract Overview

The `PublicationNFT` contract is an ERC-721 implementation that extends OpenZeppelin's contracts with additional functionality for publication metadata.

### Features

- ERC-721 compliant NFT implementation
- On-chain metadata storage (title, author, publication date, ISBN)
- IPFS URI support for extended metadata
- Owner-only minting
- Event emission for tracking

### Contract Structure

```
PublicationNFT
├── ERC721 (OpenZeppelin)
├── ERC721URIStorage (OpenZeppelin)
└── Ownable (OpenZeppelin)
```

## Development

### Prerequisites

- Node.js >= 18
- npm or yarn

### Testing

Run the full test suite:
```bash
npm test
```

### Deployment

1. Copy `.env.example` to `.env`
2. Fill in your RPC URL and private key
3. Run deployment script:

```bash
# Local
npm run deploy:localhost

# Sepolia testnet
npm run deploy:sepolia
```

## Contract API

### Write Functions

#### `mintPublication(address to, string uri, string title, string author, uint256 publicationDate, string isbn)`

Mints a new publication NFT. Only callable by the contract owner.

**Parameters:**
- `to`: Recipient address
- `uri`: Token URI (IPFS or other metadata storage)
- `title`: Publication title
- `author`: Publication author
- `publicationDate`: Publication date (Unix timestamp)
- `isbn`: ISBN number

**Returns:** Token ID

### Read Functions

#### `getPublication(uint256 tokenId)`

Returns the publication metadata for a given token ID.

**Returns:** PublicationMetadata struct with title, author, publicationDate, and ISBN

#### `tokenURI(uint256 tokenId)`

Returns the token URI for a given token ID.

## Events

### `PublicationMinted(uint256 indexed tokenId, address indexed owner, string title, string author)`

Emitted when a new publication NFT is minted.

## Security

- Uses OpenZeppelin's audited contract implementations
- Owner-only minting prevents unauthorized NFT creation
- Safe transfer functions prevent accidental token loss
