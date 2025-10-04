# SUI Smart Contracts

This directory contains the SUI Move smart contract implementation for Publication NFTs.

## Quick Start

```bash
# Build the package
sui move build

# Run tests
sui move test

# Publish to network
sui client publish --gas-budget 100000000
```

## Contract Overview

The `publication_nft` module implements NFT functionality for published works using SUI's Move language and object model.

### Features

- Native SUI object-based NFT implementation
- Rich on-chain metadata (title, author, publication date, ISBN)
- IPFS URL support for metadata and images
- Display standard integration for wallet compatibility
- Transfer and burn functionality
- Type-safe Move implementation

## Development

### Prerequisites

- SUI CLI installed ([Installation Guide](https://docs.sui.io/build/install))
- SUI wallet configured

### Building

```bash
sui move build
```

### Testing

Run all tests:
```bash
sui move test
```

Run with verbose output:
```bash
sui move test --verbose
```

### Deployment

1. Ensure you have SUI tokens in your wallet
2. Publish the package:

```bash
sui client publish --gas-budget 100000000
```

3. Save the package ID from the output

## Module API

### Entry Functions

#### `mint(title, author, publication_date, isbn, url, image_url, recipient, ctx)`

Mints a new publication NFT and transfers it to the recipient.

**Parameters:**
- `title`: String - Publication title
- `author`: String - Publication author
- `publication_date`: u64 - Publication date (Unix timestamp in milliseconds)
- `isbn`: String - ISBN number
- `url`: vector<u8> - URL for metadata (e.g., IPFS)
- `image_url`: vector<u8> - URL for cover image
- `recipient`: address - Recipient address
- `ctx`: &mut TxContext - Transaction context

**Example:**
```bash
sui client call \
  --package $PACKAGE_ID \
  --module publication_nft \
  --function mint \
  --args \
    "The Great Gatsby" \
    "F. Scott Fitzgerald" \
    1234567890000 \
    "978-0-7432-7356-5" \
    "https://ipfs.io/ipfs/QmHash" \
    "https://ipfs.io/ipfs/QmImageHash" \
    $RECIPIENT_ADDRESS \
  --gas-budget 10000000
```

#### `transfer_nft(nft, recipient, ctx)`

Transfers an NFT to a new owner.

**Parameters:**
- `nft`: PublicationNFT - The NFT object to transfer
- `recipient`: address - New owner address
- `ctx`: &mut TxContext - Transaction context

#### `burn(nft, ctx)`

Destroys an NFT permanently.

**Parameters:**
- `nft`: PublicationNFT - The NFT object to burn
- `ctx`: &mut TxContext - Transaction context

### View Functions

#### `title(nft: &PublicationNFT): String`
Returns the title of the publication.

#### `author(nft: &PublicationNFT): String`
Returns the author of the publication.

#### `publication_date(nft: &PublicationNFT): u64`
Returns the publication date (Unix timestamp in milliseconds).

#### `isbn(nft: &PublicationNFT): String`
Returns the ISBN number.

#### `url(nft: &PublicationNFT): &Url`
Returns a reference to the metadata URL.

#### `image_url(nft: &PublicationNFT): &Url`
Returns a reference to the image URL.

## Events

### `PublicationMinted`

Emitted when a new publication NFT is minted.

**Fields:**
- `object_id`: address - The object ID of the minted NFT
- `creator`: address - The address that created the NFT
- `title`: String - Publication title
- `author`: String - Publication author

## Object Structure

### `PublicationNFT`

```move
public struct PublicationNFT has key, store {
    id: UID,
    title: String,
    author: String,
    publication_date: u64,
    isbn: String,
    url: Url,
    image_url: Url,
}
```

## Display Standard

The module integrates with SUI's Display standard to provide wallet compatibility. The following fields are displayed:
- `title`
- `author`
- `publication_date`
- `isbn`
- `url`
- `image_url`
- `description`
- `project_url`
- `creator`

## Security Considerations

- Move's type system prevents common vulnerabilities
- Object ownership model ensures clear ownership semantics
- No dynamic dispatch reduces attack surface
- All functions are properly scoped (entry vs public)
