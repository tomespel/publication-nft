const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PublicationNFT", function () {
  let publicationNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const PublicationNFT = await ethers.getContractFactory("PublicationNFT");
    publicationNFT = await PublicationNFT.deploy(owner.address);
    await publicationNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await publicationNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await publicationNFT.name()).to.equal("PublicationNFT");
      expect(await publicationNFT.symbol()).to.equal("PNFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new publication NFT", async function () {
      const uri = "ipfs://QmTestHash";
      const title = "Test Book";
      const authors = "Test Author";
      const publicationDate = Math.floor(Date.now() / 1000);
      const doi = "10.1000/test-doi";
      const description = "Test description";
      const license = "CC-BY-4.0";
      const field = "Computer Science";
      const version = "1.0";
      const externalUrl = "https://example.com/paper";

      await expect(
        publicationNFT.mintPublication(
          addr1.address,
          uri,
          title,
          authors,
          publicationDate,
          doi,
          description,
          license,
          field,
          version,
          externalUrl
        )
      )
        .to.emit(publicationNFT, "PublicationMinted")
        .withArgs(0, addr1.address, title, authors);

      expect(await publicationNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await publicationNFT.tokenURI(0)).to.equal(uri);
    });

    it("Should store publication metadata correctly", async function () {
      const uri = "ipfs://QmTestHash";
      const title = "Test Book";
      const authors = "Test Author";
      const publicationDate = Math.floor(Date.now() / 1000);
      const doi = "10.1000/test-doi";
      const description = "Test description";
      const license = "CC-BY-4.0";
      const field = "Computer Science";
      const version = "1.0";
      const externalUrl = "https://example.com/paper";

      await publicationNFT.mintPublication(
        addr1.address,
        uri,
        title,
        authors,
        publicationDate,
        doi,
        description,
        license,
        field,
        version,
        externalUrl
      );

      const publication = await publicationNFT.getPublication(0);
      expect(publication.title).to.equal(title);
      expect(publication.authors).to.equal(authors);
      expect(publication.publicationDate).to.equal(publicationDate);
      expect(publication.doi).to.equal(doi);
      expect(publication.description).to.equal(description);
      expect(publication.license).to.equal(license);
      expect(publication.field).to.equal(field);
      expect(publication.version).to.equal(version);
      expect(publication.externalUrl).to.equal(externalUrl);
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        publicationNFT
          .connect(addr1)
          .mintPublication(
            addr2.address,
            "ipfs://QmTestHash",
            "Test Book",
            "Test Author",
            Math.floor(Date.now() / 1000),
            "10.1000/test-doi",
            "Test description",
            "CC-BY-4.0",
            "Computer Science",
            "1.0",
            "https://example.com/paper"
          )
      ).to.be.revertedWithCustomError(
        publicationNFT,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const uri = "ipfs://QmTestHash";
      await publicationNFT.mintPublication(
        addr1.address,
        uri,
        "Test Book",
        "Test Author",
        Math.floor(Date.now() / 1000),
        "10.1000/test-doi",
        "Test description",
        "CC-BY-4.0",
        "Computer Science",
        "1.0",
        "https://example.com/paper"
      );

      expect(await publicationNFT.tokenURI(0)).to.equal(uri);
    });

    it("Should revert for non-existent token", async function () {
      await expect(publicationNFT.tokenURI(999)).to.be.revertedWithCustomError(
        publicationNFT,
        "ERC721NonexistentToken"
      );
    });
  });
});
