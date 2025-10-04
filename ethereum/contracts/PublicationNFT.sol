// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PublicationNFT
 * @dev ERC-721 NFT contract for published works with metadata storage
 */
contract PublicationNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from token ID to publication metadata
    mapping(uint256 => PublicationMetadata) public publications;

    struct PublicationMetadata {
        string title;
        string author;
        uint256 publicationDate;
        string isbn;
    }

    event PublicationMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string title,
        string author
    );

    constructor(address initialOwner)
        ERC721("PublicationNFT", "PNFT")
        Ownable(initialOwner)
    {}

    /**
     * @dev Mint a new publication NFT
     * @param to The address that will own the minted token
     * @param uri The token URI containing metadata
     * @param title The title of the publication
     * @param author The author of the publication
     * @param publicationDate The publication date (unix timestamp)
     * @param isbn The ISBN of the publication
     */
    function mintPublication(
        address to,
        string memory uri,
        string memory title,
        string memory author,
        uint256 publicationDate,
        string memory isbn
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        publications[tokenId] = PublicationMetadata({
            title: title,
            author: author,
            publicationDate: publicationDate,
            isbn: isbn
        });

        emit PublicationMinted(tokenId, to, title, author);

        return tokenId;
    }

    /**
     * @dev Get publication metadata
     * @param tokenId The token ID
     */
    function getPublication(uint256 tokenId)
        public
        view
        returns (PublicationMetadata memory)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return publications[tokenId];
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
