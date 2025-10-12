# Release Guide

This guide explains how to prepare and publish a release of Publication NFT.

## Current Status

✅ **Mainnet Deployment Complete**

- **Package ID:** `0x58938c4d77a16c5baf8a7267ac0edbeee150658803d50b0222cf03e5d8cad45e`
- **Transaction:** `7nC76XP9FmhLdZUSfZE6gHJfKyRxmyxaK4yC5knyZrPx`
- **Explorer:** <https://suiexplorer.com/txblock/7nC76XP9FmhLdZUSfZE6gHJfKyRxmyxaK4yC5knyZrPx>

## 1. Prerequisites

- Node.js v18+ for Ethereum
- Sui CLI installed and configured with devnet/testnet wallet
- Test funds in both environments (SUI and ETH testnets as needed)

## 2. Verify Code Builds and Tests

- Ethereum
  - `cd ethereum && npm ci && npm run compile && npm test`
- Sui
  - `cd sui && sui move build && sui move test`

## 3. Deploy Sui Package

- `cd sui`
- Publish to devnet (or testnet):
  - `sui client publish --gas-budget 100000000`
- Record the Package ID printed by the CLI.

## 4. Mint on Sui

- Interactive mint (recommended):
  - `./scripts/mint-interactive.sh`
- Or run the example script:
  - `./scripts/mint-example.sh <PACKAGE_ID> <RECIPIENT_ADDRESS>`

## 5. Deploy Ethereum (optional)

- Sepolia example:
  - Export env vars (RPC + PRIVATE_KEY)
  - `cd ethereum && npm run deploy:sepolia`

## 6. Update Docs

- Update `README.md` with the new Sui Package ID (if you want to show a concrete example)
- Note any API changes in `sui/README.md`

## 7. Tag and Push Release

- At repo root:
  - `git add -A`
  - `git commit -m "chore(release): prep for <version>"`
  - `git tag v<version>`
  - `git push origin main --tags`

## 8. Post-Release

- Verify on explorers:
  - Sui Explorer: search for the Package ID
  - Etherscan (testnet): verify deployment if applicable
- Open an issue for any follow-ups discovered.
