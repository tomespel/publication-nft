#!/bin/bash

# Interactive script for minting Publication NFTs on SUI
# Prompts for all required parameters and validates inputs before minting

set -e

# Function to validate URL
validate_url() {
    local url=$1
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate Sui address (basic check: 66 characters starting with 0x)
validate_address() {
    local addr=$1
    if [[ $addr =~ ^0x[0-9a-fA-F]{64}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate number
validate_number() {
    local num=$1
    if [[ $num =~ ^[0-9]+$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate non-empty string
validate_string() {
    local str=$1
    if [[ -n "$str" ]]; then
        return 0
    else
        return 1
    fi
}

echo "=== Publication NFT Minting Script ==="
echo "Defaulting to Mainnet Package ID. Press Enter to use default or enter custom ID."
echo ""

# Get package ID (default to mainnet)
DEFAULT_PACKAGE_ID="0x58938c4d77a16c5baf8a7267ac0edbeee150658803d50b0222cf03e5d8cad45e"
read -p "Enter Package ID (default: $DEFAULT_PACKAGE_ID): " PACKAGE_ID
PACKAGE_ID=${PACKAGE_ID:-$DEFAULT_PACKAGE_ID}

# Get recipient address
read -p "Enter Recipient Address: " RECIPIENT_ADDRESS
if ! validate_address "$RECIPIENT_ADDRESS"; then
    echo "Error: Invalid recipient address format (should be 0x followed by 64 hex characters)"
    exit 1
fi

# Get title
read -p "Enter Publication Title: " TITLE
if ! validate_string "$TITLE"; then
    echo "Error: Title cannot be empty"
    exit 1
fi

# Get authors
read -p "Enter Authors (comma-separated): " AUTHORS
if ! validate_string "$AUTHORS"; then
    echo "Error: Authors cannot be empty"
    exit 1
fi

# Get publication date
read -p "Enter Publication Date (Unix timestamp in milliseconds): " PUBLICATION_DATE
if ! validate_number "$PUBLICATION_DATE"; then
    echo "Error: Publication date must be a valid number"
    exit 1
fi

# Get DOI
read -p "Enter DOI: " DOI
if ! validate_string "$DOI"; then
    echo "Error: DOI cannot be empty"
    exit 1
fi

# Get metadata URL
read -p "Enter Metadata URL (e.g., IPFS): " METADATA_URL
if ! validate_url "$METADATA_URL"; then
    echo "Error: Invalid URL format (must start with http:// or https://)"
    exit 1
fi

# Get image URL
read -p "Enter Image URL: " IMAGE_URL
if ! validate_url "$IMAGE_URL"; then
    echo "Error: Invalid URL format (must start with http:// or https://)"
    exit 1
fi

# Get description
read -p "Enter Description/Abstract: " DESCRIPTION
if ! validate_string "$DESCRIPTION"; then
    echo "Error: Description cannot be empty"
    exit 1
fi

# Get license
read -p "Enter License (e.g., CC-BY-4.0): " LICENSE
if ! validate_string "$LICENSE"; then
    echo "Error: License cannot be empty"
    exit 1
fi

# Get field
read -p "Enter Field of Study: " FIELD
if ! validate_string "$FIELD"; then
    echo "Error: Field cannot be empty"
    exit 1
fi

# Get version
read -p "Enter Version: " VERSION
if ! validate_string "$VERSION"; then
    echo "Error: Version cannot be empty"
    exit 1
fi

# Get external URL
read -p "Enter External URL: " EXTERNAL_URL
if ! validate_url "$EXTERNAL_URL"; then
    echo "Error: Invalid URL format (must start with http:// or https://)"
    exit 1
fi

echo ""
echo "=== Review Publication Details ==="
echo "Package ID: $PACKAGE_ID"
echo "Recipient Address: $RECIPIENT_ADDRESS"
echo "Title: $TITLE"
echo "Authors: $AUTHORS"
echo "Publication Date: $PUBLICATION_DATE"
echo "DOI: $DOI"
echo "Metadata URL: $METADATA_URL"
echo "Image URL: $IMAGE_URL"
echo "Description: $DESCRIPTION"
echo "License: $LICENSE"
echo "Field: $FIELD"
echo "Version: $VERSION"
echo "External URL: $EXTERNAL_URL"
echo ""

read -p "Proceed with minting? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Minting cancelled."
    exit 0
fi

echo ""
echo "Minting Publication NFT..."

# Execute the mint transaction
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