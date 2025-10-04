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
AUTHOR="Donald Knuth"
PUBLICATION_DATE=1234567890000
ISBN="978-0-201-89683-1"
METADATA_URL="https://ipfs.io/ipfs/QmExampleMetadataHash"
IMAGE_URL="https://ipfs.io/ipfs/QmExampleImageHash"

echo "Publication Details:"
echo "  Title: $TITLE"
echo "  Author: $AUTHOR"
echo "  Publication Date: $PUBLICATION_DATE"
echo "  ISBN: $ISBN"
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
    "$AUTHOR" \
    "$PUBLICATION_DATE" \
    "$ISBN" \
    "$METADATA_URL" \
    "$IMAGE_URL" \
    "$RECIPIENT_ADDRESS" \
  --gas-budget 10000000

echo ""
echo "✅ Mint transaction submitted!"
echo ""
echo "You can view the NFT in your SUI wallet or on the SUI Explorer:"
echo "https://suiexplorer.com"
