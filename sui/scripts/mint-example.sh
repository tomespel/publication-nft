#!/bin/bash

# Example script demonstrating how to mint a Publication NFT on SUI
# 
# Usage:
# ./scripts/mint-example.sh <package-id> <recipient-address>

PACKAGE_ID=$1
RECIPIENT_ADDRESS=$2

if [ -z "$PACKAGE_ID" ] || [ -z "$RECIPIENT_ADDRESS" ]; then
    echo "Usage: ./scripts/mint-example.sh <package-id> <recipient-address>"
    exit 1
fi

echo "Minting Publication NFT on SUI..."
echo "Package ID: $PACKAGE_ID"
echo "Recipient Address: $RECIPIENT_ADDRESS"
echo ""

# Example publication data
TITLE="The Art of Computer Programming"
AUTHORS="Donald Knuth"
PUBLICATION_DATE=1234567890000
DOI="10.1000/art-of-programming"
METADATA_URL="https://ipfs.io/ipfs/QmExampleMetadataHash"
IMAGE_URL="https://ipfs.io/ipfs/QmExampleImageHash"
DESCRIPTION="A comprehensive guide to computer programming algorithms and data structures."
LICENSE="CC-BY-4.0"
FIELD="Computer Science"
VERSION="1.0"
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
  --gas-budget 10000000

echo ""
echo "✅ Mint transaction submitted!"
echo ""
echo "You can view the NFT in your SUI wallet or on the SUI Explorer:"
echo "https://suiexplorer.com"
