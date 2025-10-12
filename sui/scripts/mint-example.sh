#!/bin/bash

# Example script demonstrating how to mint a Publication NFT on SUI
# 
# Usage:
# ./scripts/mint-example.sh <recipient-address>

PACKAGE_ID=0x58938c4d77a16c5baf8a7267ac0edbeee150658803d50b0222cf03e5d8cad45e
RECIPIENT_ADDRESS=$1

if [ -z "$RECIPIENT_ADDRESS" ]; then
    echo "Usage: ./scripts/mint-example.sh <recipient-address>"
    exit 1
fi

echo "Minting Publication NFT on SUI Mainnet..."
echo "Package ID: $PACKAGE_ID"
echo "Recipient Address: $RECIPIENT_ADDRESS"
echo ""

# Example publication data
TITLE="New Contracts on Blockchains"
AUTHORS="John Doe, Jane Smith"
PUBLICATION_DATE=1234567890000
DOI="10.1000/new-contracts-on-blockchains"
METADATA_URL="https://ipfs.io/ipfs/QmExampleMetadataHash"
IMAGE_URL="https://ipfs.io/ipfs/QmExampleImageHash"
DESCRIPTION="An example NFT."
LICENSE="CC-BY-4.0"
FIELD="Computer Science"
VERSION="1"
EXTERNAL_URL="https://example.com/paper"

echo "Publication Details:"
echo "  Title: $TITLE"
echo "  Authors: $AUTHORS"
echo "  Publication Date: $PUBLICATION_DATE"
echo "  DOI: $DOI"
echo "  Description: $DESCRIPTION"
echo "  License: $LICENSE"
echo "  Field: $FIELD"
echo "  Version: $VERSION"
echo "  External URL: $EXTERNAL_URL"
echo "  Metadata URL: $METADATA_URL"
echo "  Image URL: $IMAGE_URL"
echo ""

# Mint the NFT
echo "Executing mint transaction..."
sui client call \
  --package "$PACKAGE_ID" \
  --module publication_nft \
  --function mint \
  --args \
    "$TITLE" \
    "$AUTHORS" \
    "$PUBLICATION_DATE" \
    "$DOI" \
    "$METADATA_URL" \
    "$IMAGE_URL" \
    "$DESCRIPTION" \
    "$LICENSE" \
    "$FIELD" \
    "$VERSION" \
    "$EXTERNAL_URL" \
    "$RECIPIENT_ADDRESS" \
  --gas-budget 100000000

echo ""
echo "✅ Mint transaction submitted!"
echo ""
echo "You can view the NFT in your SUI wallet or on the SUI Explorer:"
echo "https://suiexplorer.com"
