// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error VideoNFT__NotOwner();
error VideoNFT__NotAdmin();

contract VideoNFT is ERC721 {
    using Strings for uint256;
    address private immutable i_admin;
    uint256 private s_tokenCounter;

    mapping(uint256 tokenId => string) private TOKEN_URI;
    mapping(uint256 tokenId => address platform) private bindToPlatform;

    event VNFTMinted(uint256 tokenId);

    constructor(address admin) ERC721("VideoNFT", "VNFT") {
        s_tokenCounter = 0;
        i_admin = admin;
    }

    function uploadVideo(
        string memory token_uri,
        address to
    ) external returns (uint256) {
        if (msg.sender != i_admin) {
            revert VideoNFT__NotAdmin();
        }
        _safeMint(to, s_tokenCounter);
        setTokenUri(token_uri, s_tokenCounter);
        emit VNFTMinted(s_tokenCounter);
        s_tokenCounter++;

        return s_tokenCounter;
    }

    function changePlatform(
        uint256 tokenId,
        address platform
    ) public returns (address) {
        if (ownerOf(tokenId) != msg.sender) {
            revert VideoNFT__NotOwner();
        }
        bindToPlatform[tokenId] = platform;
        return bindToPlatform[tokenId];
    }

    function setTokenUri(string memory token_uri, uint256 tokenId) internal {
        TOKEN_URI[tokenId] = token_uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return TOKEN_URI[tokenId];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getNftplatform(uint256 tokenId) public view returns (address) {
        return bindToPlatform[tokenId];
    }
}
