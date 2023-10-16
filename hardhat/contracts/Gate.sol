// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/ERC721URIStorage.sol)

pragma solidity ^0.8.7;

import "./ERC721PlatformManage.sol";
import "./VIDToken.sol";

contract Gate {
    //分配比例 ，分别是作者0.4，存放平台0.4 播放平台0.2
    uint256[3] disPercentage = [40, 40, 20];
    VIDToken public tokenContract;
    ERC721PlatformManage public marketContract;
    address admin;

    constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    event mintRecord(address tokenId, uint256 playCounts);

    //暂定为1播放量就mint 1
    function batchMintCoin(
        uint256[] memory tokenIds,
        uint256[] memory playCounts,
        address[] memory playPlatforms
    ) public onlyAdmin {
        require(
            tokenIds.length == playCounts.length,
            "The data has some wrong"
        );
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 currentTokenId = tokenIds[i];
            uint256 playCount = playCounts[i];
            address playPlatform = playPlatforms[i];
            distributionCoin(currentTokenId, playPlatform, playCount);
        }
    }

    function distributionCoin(
        uint256 tokenId,
        address playPlatform,
        uint256 coinNumber
    ) public onlyAdmin {
        uint256 contributorReward = (coinNumber / 10) * 4;
        uint256 hostingContributorReward = (coinNumber / 10) * 4;
        uint256 storageContributorReward = (coinNumber / 10) * 2;
        address contributorAddress = marketContract.checkOwners(tokenId);
        address hostingContributorAddress = marketContract.checkHostingPlatform(
            tokenId
        );

        tokenContract.mint(contributorAddress, contributorReward);
        tokenContract.mint(hostingContributorAddress, hostingContributorReward);
        tokenContract.mint(playPlatform, storageContributorReward);
    }
}
