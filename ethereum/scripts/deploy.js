const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying PublicationNFT contract with the account:", deployer.address);

  const PublicationNFT = await hre.ethers.getContractFactory("PublicationNFT");
  const publicationNFT = await PublicationNFT.deploy(deployer.address);

  await publicationNFT.waitForDeployment();

  const contractAddress = await publicationNFT.getAddress();
  console.log("PublicationNFT deployed to:", contractAddress);

  // Optional: Mint a sample NFT
  if (process.env.MINT_SAMPLE === "true") {
    console.log("\nMinting sample publication NFT...");
    const tx = await publicationNFT.mintPublication(
      deployer.address,
      "ipfs://QmSampleHash",
      "Sample Publication",
      "John Doe",
      Math.floor(Date.now() / 1000),
      "10.1000/sample-doi",
      "Sample description",
      "CC-BY-4.0",
      "Computer Science",
      "1.0",
      "https://example.com/paper"
    );
    await tx.wait();
    console.log("Sample NFT minted successfully!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
