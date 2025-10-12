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
- On-chain metadata storage (title, authors, publication date, DOI, URLs, etc.)
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

#### `mintPublication(address to, string uri, string title, string authors, uint256 publicationDate, string doi, string url, string imageUrl, string description, string license, string field, string version, string externalUrl)`

Mints a new publication NFT. Only callable by the contract owner.

**Parameters:**
- `to`: Recipient address
- `uri`: Token URI (IPFS or other metadata storage)
- `title`: Publication title
- `authors`: Publication authors
- `publicationDate`: Publication date (Unix timestamp in milliseconds)
- `doi`: DOI of the publication
- `url`: Metadata URL
- `imageUrl`: Image URL for the publication cover
- `description`: Description/abstract of the publication
- `license`: License of the publication
- `field`: Field of study
- `version`: Version of the publication
- `externalUrl`: External URL to the publication

**Returns:** Token ID

### Read Functions

#### `getPublication(uint256 tokenId)`

Returns the publication metadata for a given token ID.

**Returns:** PublicationMetadata struct with all publication details

#### `tokenURI(uint256 tokenId)`

Returns the token URI for a given token ID.

## Events

### `PublicationMinted(uint256 indexed tokenId, address indexed owner, string title, string authors)`

Emitted when a new publication NFT is minted.

## Scripts

### Minting NFTs

#### Interactive Minting

For an interactive experience similar to the Sui implementation:

```bash
node scripts/mint-interactive.js <contract-address>
```

This script will prompt you for all required fields and validate inputs before minting.

**Mainnet Contract Address:** `0xBfeA7120A701625B5438ed9A3f06F3BC471DB399`

#### Example Minting

For quick testing with example data:

```bash
node scripts/mint-example.js <contract-address> <recipient-address>
```

## Security

- Uses OpenZeppelin's audited contract implementations
- Owner-only minting prevents unauthorized NFT creation
- Safe transfer functions prevent accidental token loss
