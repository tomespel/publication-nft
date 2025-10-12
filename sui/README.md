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
- Rich on-chain metadata (title, authors, publication date, DOI, description, license, field, version)
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

### Deploy

1. Ensure you have SUI tokens in your wallet
2. Publish the package:

```bash
sui client publish --gas-budget 100000000
```

3. Save the package ID from the output

**Mainnet Package ID:** `0x58938c4d77a16c5baf8a7267ac0edbeee150658803d50b0222cf03e5d8cad45e`

## Minting NFTs

After deployment, you can mint Publication NFTs using the provided scripts.

### Interactive Minting Script

For a user-friendly way to mint NFTs with input validation:

```bash
./scripts/mint-interactive.sh
```

This script will prompt you for all required parameters, validate the inputs, and execute the mint transaction.

### Manual Minting

You can also mint NFTs manually using the SUI CLI. See the [Module API](#module-api) section for details.

For an example with hardcoded values, use:

```bash
./scripts/mint-example.sh <package-id> <recipient-address>
```

## Module API

### Entry Functions

#### `mint(title, authors, publication_date, doi, url, image_url, description, license, field, version, external_url, recipient, ctx)`

Mints a new publication NFT and transfers it to the recipient.

**Parameters:**

- `title`: String - Publication title
- `authors`: String - Publication authors (comma-separated)
- `publication_date`: u64 - Publication date (Unix timestamp in milliseconds)
- `doi`: String - DOI of the publication
- `url`: `vector<u8>` - URL for metadata (e.g., IPFS)
- `image_url`: `vector<u8>` - URL for cover image
- `description`: String - Description/abstract of the publication
- `license`: String - License of the publication
- `field`: String - Field of study
- `version`: String - Version of the publication
- `external_url`: `vector<u8>` - External URL to the publication
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
    "10.1000/great-gatsby" \
    "https://ipfs.io/ipfs/QmHash" \
    "https://ipfs.io/ipfs/QmImageHash" \
    "A classic American novel about the Jazz Age." \
    "CC-BY-4.0" \
    "Literature" \
    "1.0" \
    "https://example.com/paper" \
    $RECIPIENT_ADDRESS \
  --gas-budget 100000000
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

#### `authors(nft: &PublicationNFT): String`

Returns the authors of the publication.

#### `publication_date(nft: &PublicationNFT): u64`

Returns the publication date (Unix timestamp in milliseconds).

#### `doi(nft: &PublicationNFT): String`

Returns the DOI of the publication.

#### `url(nft: &PublicationNFT): &Url`

Returns a reference to the metadata URL.

#### `image_url(nft: &PublicationNFT): &Url`

Returns a reference to the image URL.

#### `description(nft: &PublicationNFT): String`

Returns the description of the publication.

#### `license(nft: &PublicationNFT): String`

Returns the license of the publication.

#### `field(nft: &PublicationNFT): String`

Returns the field of study.

#### `version(nft: &PublicationNFT): String`

Returns the version of the publication.

#### `external_url(nft: &PublicationNFT): &Url`

Returns a reference to the external URL.

## Events

### `PublicationMinted`

Emitted when a new publication NFT is minted.

**Fields:**

- `object_id`: address - The object ID of the minted NFT
- `creator`: address - The address that created the NFT
- `title`: String - Publication title
- `authors`: String - Publication authors

## Object Structure

### `PublicationNFT`

```move
public struct PublicationNFT has key, store {
    id: UID,
    title: String,
    authors: String,
    publication_date: u64,
    doi: String,
    url: url::Url,
    image_url: url::Url,
    description: String,
    license: String,
    field: String,
    version: String,
    external_url: url::Url,
}
```

## Display Standard

The module integrates with SUI's Display standard to provide wallet compatibility. The following fields are displayed:

- `title`
- `description`
- `image_url`
- `link`
- `project_url`
- `creator`
- `authors`
- `publication_date`
- `doi`
- `url`
- `license`
- `field`
- `version`
- `external_url`

## Security Considerations

- Move's type system prevents common vulnerabilities
- Object ownership model ensures clear ownership semantics
- No dynamic dispatch reduces attack surface
- All functions are properly scoped (entry vs public)
