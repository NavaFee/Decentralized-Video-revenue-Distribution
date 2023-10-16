// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract ERC721PlatformManage is ERC721URIStorage {
   
    address admin;
    uint256 private s_tokenCounter;
    uint256 tokenId;
    //托管平台
    address[] internal platformAddress;

    constructor(
        string memory _name,
        string memory _symbol,
        address _admin
        
    ) ERC721(_name, _symbol) {
        tokenId = 0;
        admin = _admin;
    }

    mapping(uint256 => address) public _owners;

    mapping(uint256 => address) public _hostingPlatform;

    mapping(uint256 => uint256) private _playCount;

    event CreatNFTRecord(address owner, uint256 tokenId, address platform);

    event TokenskimNumber(uint256 ID, uint256 playCount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyTokenOwner(uint256 _tokenId) {
        require(
            _ownerOf(_tokenId) == msg.sender,
            "Only the token owner can perform this action"
        );
        _;
    }

    function mintNft(address platform,string memory _uri) public returns (uint256) {
        _safeMint(msg.sender, tokenId);
        _owners[tokenId] = msg.sender;
        hostingPlatformWithToken(tokenId, platform);
       _setTokenURI(tokenId, _uri);
       tokenId++;
       emit CreatNFTRecord(msg.sender, tokenId, platform);
        return tokenId;
    }

  

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function _addPlatformAddress(address newplatform) external onlyAdmin {
        platformAddress.push(newplatform);
    }

    //remove platformaddress
    function _removePlatformAddress(address platform) external onlyAdmin {
        for (uint256 i = 0; i < platformAddress.length; i++) {
            if (platformAddress[i] == platform) {
                platformAddress[i] = platformAddress[
                    platformAddress.length - 1
                ];
                platformAddress.pop();
                return;
            }
        }
    }

    //hosting NFT by platform
    function hostingPlatformWithToken(
        uint256 _tokenId,
        address platform
    ) internal {
        _hostingPlatformWithToken(_tokenId, platform);
    }

    function changePlatformWithToken(
        uint256 _tokenId,
        address platform
    ) external {
        _changePlatformWithToken(_tokenId, platform);
    }

    function _hostingPlatformWithToken(
        uint256 _tokenId,
        address platform
    ) internal {
        _hostingPlatform[_tokenId] = platform;
    }

    function _changePlatformWithToken(
        uint256 _tokenId,
        address platform
    ) internal {
        require(
            _hostingPlatform[_tokenId] != address(0),
            "The Nft Never hosting any platform"
        );
        _hostingPlatform[tokenId] = platform;
    }

    //批量更改播放量
    function batchUpdatePlayCount(
        uint256[] memory tokenIds,
        uint256[] memory playCounts
    ) public onlyAdmin {
        require(
            tokenIds.length == playCounts.length,
            "The data has some wrong"
        );
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 currentTokenId = tokenIds[i];
            uint256 playCount = playCounts[i];

            _playCount[currentTokenId] += playCount;
            emit TokenskimNumber(tokenId, playCount);
        }
    }

    function checkOwners(uint256 _tokenId) external view returns (address) {
        return _owners[_tokenId];
    }

    function checkHostingPlatform(
        uint256 _tokenId
    ) external view returns (address) {
        return _hostingPlatform[_tokenId];
    }
}
