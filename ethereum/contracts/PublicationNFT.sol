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
        uint32 publicationDate;
        bytes32 field;
        bytes32 version;
        string title;
        string authors;
        string doi;
        string url;
        string imageUrl;
        string description;
        string license;
        string externalUrl;
    }

    event PublicationMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string title,
        string authors
    );

    constructor(address initialOwner)
        ERC721("PublicationNFT", "PNFT")
        Ownable(initialOwner)
    {}

    /**
     * @dev Convert string to bytes32 (reverts if string is longer than 32 bytes)
     */
    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        assembly {
            let len := mload(source)
            if gt(len, 32) { revert(0, 0) }
            result := mload(add(source, 32))
        }
    }

    /**
     * @dev Convert bytes32 to string
     */
    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    /**
     * @dev Mint a new publication NFT
     * @param to The address that will own the minted token
     * @param uri The metadata URI (IPFS or HTTP)
     * @param title The title of the publication
     * @param authors The authors of the publication
     * @param publicationDate The publication date (unix timestamp in seconds, fits in uint32)
     * @param doi The DOI of the publication
     * @param url The URL for the publication metadata
     * @param imageUrl The image URL for the publication cover
     * @param description The description/abstract of the publication
     * @param license The license of the publication
     * @param field The field of study (max 32 chars)
     * @param version The version of the publication (max 32 chars)
     * @param externalUrl The external URL to the publication
     */
    function mintPublication(
        address to,
        string memory uri,
        string memory title,
        string memory authors,
        uint32 publicationDate,
        string memory doi,
        string memory url,
        string memory imageUrl,
        string memory description,
        string memory license,
        string memory field,
        string memory version,
        string memory externalUrl
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        publications[tokenId] = PublicationMetadata({
            title: title,
            authors: authors,
            publicationDate: publicationDate,
            doi: doi,
            url: url,
            imageUrl: imageUrl,
            description: description,
            license: license,
            field: stringToBytes32(field),
            version: stringToBytes32(version),
            externalUrl: externalUrl
        });

        emit PublicationMinted(tokenId, to, title, authors);

        return tokenId;
    }

    /**
     * @dev Get publication metadata
     * @param tokenId The token ID
     */
    function getPublication(uint256 tokenId)
        external
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
