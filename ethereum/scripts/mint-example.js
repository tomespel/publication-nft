/**
 * Example script demonstrating how to mint a Publication NFT
 * 
 * Usage:
 * node scripts/mint-example.js <contract-address> <recipient-address>
 */

const hre = require("hardhat");

async function main() {
  // Get command line arguments
  const contractAddress = process.argv[2];
  const recipientAddress = process.argv[3];

  if (!contractAddress || !recipientAddress) {
    console.error("Usage: node scripts/mint-example.js <contract-address> <recipient-address>");
    process.exit(1);
  }

  console.log("Minting Publication NFT...");
  console.log("Contract Address:", contractAddress);
  console.log("Recipient Address:", recipientAddress);

  // Get the contract instance
  const PublicationNFT = await hre.ethers.getContractFactory("PublicationNFT");
  const publicationNFT = PublicationNFT.attach(contractAddress);

  // Example publication data
  const publicationData = {
    uri: "ipfs://QmExampleHash123",
    title: "Example Publication",
    authors: "John Doe",
    publicationDate: Math.floor(Date.now() / 1000),
    doi: "10.1000/example-doi",
    description: "Example description",
    license: "CC-BY-4.0",
    field: "Computer Science",
    version: "1.0",
    externalUrl: "https://example.com/paper",
  };

  console.log("\nPublication Details:");
  console.log("  Title:", publicationData.title);
  console.log("  Authors:", publicationData.authors);
  console.log(
    "  Date:",
    new Date(publicationData.publicationDate * 1000).toISOString()
  );
  console.log("  DOI:", publicationData.doi);
  console.log("  Description:", publicationData.description);
  console.log("  License:", publicationData.license);
  console.log("  Field:", publicationData.field);
  console.log("  Version:", publicationData.version);
  console.log("  External URL:", publicationData.externalUrl);
  console.log("  Metadata URI:", publicationData.uri);

  // Mint the NFT
  console.log("\nMinting...");
  const tx = await publicationNFT.mintPublication(
    recipientAddress,
    publicationData.uri,
    publicationData.title,
    publicationData.authors,
    publicationData.publicationDate,
    publicationData.doi,
    publicationData.description,
    publicationData.license,
    publicationData.field,
    publicationData.version,
    publicationData.externalUrl
  );

  console.log("Transaction hash:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("✅ NFT minted successfully!");
  console.log("Gas used:", receipt.gasUsed.toString());

  // Find the token ID from the event
  const event = receipt.logs.find(log => {
    try {
      return publicationNFT.interface.parseLog(log).name === "PublicationMinted";
    } catch (e) {
      return false;
    }
  });

  if (event) {
    const parsedEvent = publicationNFT.interface.parseLog(event);
    console.log("Token ID:", parsedEvent.args.tokenId.toString());
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
