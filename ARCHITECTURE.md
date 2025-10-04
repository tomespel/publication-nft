# Architecture

This document describes the architecture and design decisions for the Publication NFT project.

## Overview

The Publication NFT project implements NFT contracts for published works on two blockchain platforms:

1. **Ethereum** - Using ERC-721 standard
2. **SUI** - Using native Move language

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Publication NFT System                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐       ┌──────────────────────┐   │
│  │   Ethereum Chain     │       │     SUI Chain        │   │
│  │                      │       │                      │   │
│  │  ┌────────────────┐ │       │  ┌────────────────┐ │   │
│  │  │ PublicationNFT │ │       │  │publication_nft │ │   │
│  │  │   (ERC-721)    │ │       │  │  (Move Module) │ │   │
│  │  └────────────────┘ │       │  └────────────────┘ │   │
│  │         │            │       │         │            │   │
│  │    [Metadata]        │       │    [Metadata]        │   │
│  │  - Title             │       │  - Title             │   │
│  │  - Author            │       │  - Author            │   │
│  │  - Date              │       │  - Date              │   │
│  │  - ISBN              │       │  - ISBN              │   │
│  │  - Token URI         │       │  - URL               │   │
│  │                      │       │  - Image URL         │   │
│  └──────────────────────┘       └──────────────────────┘   │
│           │                               │                  │
│           └───────────────┬───────────────┘                 │
│                           │                                  │
│                    [IPFS Storage]                           │
│                  - JSON Metadata                            │
│                  - Images                                   │
│                  - Additional Files                         │
└─────────────────────────────────────────────────────────────┘
```

## Ethereum Implementation

### Smart Contract Design

```
PublicationNFT
├── ERC721 (Base NFT functionality)
├── ERC721URIStorage (Token URI management)
└── Ownable (Access control)
```

**Key Components:**

1. **ERC721 Base**
   - Standard NFT functionality
   - Transfer, approval mechanisms
   - Balance tracking

2. **ERC721URIStorage**
   - Token URI management
   - Metadata linking

3. **Ownable**
   - Owner-only minting
   - Access control for sensitive operations

4. **Custom Functionality**
   - Publication metadata storage
   - Minting with metadata
   - Publication data retrieval

### Data Structures

```solidity
struct PublicationMetadata {
    string title;           // Publication title
    string author;          // Author name
    uint256 publicationDate; // Unix timestamp
    string isbn;            // ISBN identifier
}

mapping(uint256 => PublicationMetadata) public publications;
```

### State Management

- **Token Counter**: `_nextTokenId` tracks the next token ID
- **Metadata Mapping**: Stores on-chain publication data
- **URI Storage**: Links to off-chain metadata (IPFS)

### Gas Optimization

- Efficient struct packing
- Minimal storage operations
- Batch operations support (future)

## SUI Implementation

### Module Design

```
publication_nft module
├── PublicationNFT (Struct)
├── PUBLICATION_NFT (One-Time-Witness)
├── PublicationMinted (Event)
└── Functions
    ├── init
    ├── mint
    ├── transfer_nft
    ├── burn
    └── Getters
```

**Key Components:**

1. **PublicationNFT Struct**
   - Unique ID
   - All metadata fields
   - URL references

2. **One-Time-Witness (OTW)**
   - Package initialization
   - Display standard setup
   - Publisher creation

3. **Display Integration**
   - Wallet compatibility
   - Metadata display
   - Standard fields

4. **Event System**
   - Mint tracking
   - Transfer tracking

### Object Model

SUI uses an object-based model where each NFT is a unique object:

```move
public struct PublicationNFT has key, store {
    id: UID,                    // Unique identifier
    title: String,              // Publication title
    author: String,             // Author name
    publication_date: u64,      // Timestamp in ms
    isbn: String,               // ISBN identifier
    url: Url,                   // Metadata URL
    image_url: Url,            // Image URL
}
```

### Capabilities

- `key`: Object can be owned
- `store`: Object can be stored in other objects

### Ownership Model

- NFTs are owned objects
- Transfer changes ownership
- Burn destroys the object

## Metadata Standards

### On-Chain Metadata

Both implementations store:
- **Title**: Publication title
- **Author**: Author name  
- **Publication Date**: Unix timestamp
- **ISBN**: International Standard Book Number

### Off-Chain Metadata (IPFS)

```json
{
  "name": "Publication Title",
  "description": "Publication description",
  "image": "ipfs://QmImageHash",
  "attributes": [
    {
      "trait_type": "Author",
      "value": "Author Name"
    },
    {
      "trait_type": "Publication Date",
      "value": "2024"
    },
    {
      "trait_type": "ISBN",
      "value": "978-0-123456-78-9"
    },
    {
      "trait_type": "Publisher",
      "value": "Publisher Name"
    },
    {
      "trait_type": "Category",
      "value": "Fiction"
    }
  ],
  "external_url": "https://example.com/publication",
  "animation_url": "ipfs://QmAnimationHash"
}
```

## Security Model

### Ethereum

**Access Control:**
- Owner-only minting via `Ownable`
- Standard ERC-721 transfer security
- OpenZeppelin battle-tested contracts

**Vulnerabilities Mitigated:**
- Reentrancy: SafeTransfer functions
- Integer Overflow: Solidity 0.8+ built-in checks
- Front-running: Owner-controlled minting

### SUI

**Type Safety:**
- Move's linear type system
- Compile-time checks
- Resource safety

**Access Control:**
- Object ownership model
- Entry functions for public access
- Type-based permissions

**Vulnerabilities Mitigated:**
- Double-spending: Type system prevents
- Resource duplication: Impossible by design
- Undefined behavior: Compile-time prevention

## Design Decisions

### Why Two Blockchains?

1. **Ethereum**: Established ecosystem, large market
2. **SUI**: Modern design, lower costs, better scalability

### Why On-Chain Metadata?

- **Immutability**: Cannot be changed
- **Availability**: Always accessible
- **Verification**: Easy to verify authenticity

### Why Additional IPFS Storage?

- **Rich Content**: Images, PDFs, etc.
- **Cost**: Cheaper than on-chain storage
- **Flexibility**: Can include large files

## Deployment Architecture

### Ethereum Networks

```
Development: Hardhat Local Network (chainId: 1337)
    ↓
Testing: Sepolia Testnet (chainId: 11155111)
    ↓
Production: Ethereum Mainnet (chainId: 1)
```

### SUI Networks

```
Development: Local SUI Network
    ↓
Testing: SUI Testnet
    ↓
Production: SUI Mainnet
```

## Integration Points

### Frontend Integration

```javascript
// Ethereum (ethers.js)
const contract = new ethers.Contract(address, abi, signer);
await contract.mintPublication(to, uri, title, author, date, isbn);

// SUI (SUI SDK)
const tx = new TransactionBlock();
tx.moveCall({
  target: `${packageId}::publication_nft::mint`,
  arguments: [title, author, date, isbn, url, imageUrl, recipient]
});
await client.signAndExecuteTransactionBlock({ transactionBlock: tx });
```

### Indexing

Both chains can be indexed for:
- Transfer events
- Mint events
- Ownership history
- Metadata changes

Recommended indexers:
- **Ethereum**: The Graph, Alchemy, Moralis
- **SUI**: SUI Indexer, custom indexer

## Future Enhancements

### Potential Features

1. **Batch Minting**: Mint multiple NFTs in one transaction
2. **Royalties**: EIP-2981 royalty standard (Ethereum)
3. **Collection Management**: Group publications by series/collection
4. **Access Control**: Role-based permissions
5. **Metadata Updates**: Limited update capabilities for corrections
6. **Cross-Chain Bridge**: Enable transfers between chains
7. **Fractional Ownership**: Split ownership of rare publications

### Scalability Considerations

1. **Layer 2 Solutions**: Deploy on Arbitrum, Optimism
2. **SUI Scaling**: Already highly scalable
3. **Off-Chain Indexing**: For complex queries
4. **Caching Layers**: For metadata and images

## Testing Strategy

### Unit Tests
- Individual function testing
- Edge case coverage
- Access control verification

### Integration Tests
- End-to-end workflows
- Multi-transaction scenarios
- Event emission verification

### Gas Optimization Tests
- Transaction cost measurement
- Comparison between implementations
- Optimization opportunities

## Monitoring and Observables

### Events to Monitor

**Ethereum:**
- `PublicationMinted`
- `Transfer`
- `Approval`

**SUI:**
- `PublicationMinted`
- Object creation/deletion

### Metrics

- Minting frequency
- Gas costs
- Transfer activity
- Owner distribution
- Metadata access patterns

## References

- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [SUI Move Documentation](https://docs.sui.io/build/move)
- [IPFS Documentation](https://docs.ipfs.tech/)
