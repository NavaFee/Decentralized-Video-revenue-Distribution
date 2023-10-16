// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/extensions/ERC721URIStorage.sol)

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./VIDToken.sol";

contract platform {
    address private admin; //管理员对于
    address owner; //owner有自己对于广告投放和竞价的权利
    AdvertisingPostion[] TotalAdvertisingPostion;
    //指定的ERC20合约来进行相关的购买
    VIDToken public tokenContract;

    struct Platform {
        string name;
    }

    struct AdvertisingPostion {
        uint256 ID;
        uint256 basicPrice; //该广告位的基础价格
        uint256 everySkimWasteCoin; //每次浏览该广告位所消耗的coin数量
        address currentOwner; //
        uint256 storageCapacity; //还有的coin存量
        string URI;
        uint256 skimnumber;
    }

    struct skim {
        uint256 skim;
    }

    event LogAdvertingPostionBasicprice(uint256 ID, uint256 basicPrice);
    event LogAdvertingPostionEverySkimWateCoin(
        uint256 ID,
        uint256 everySkimWasteCoin
    );
    event LogAdvertingPostionSkimNumber(uint256 ID, uint256 skim);
    event LogAdvertingPostionTransferRecord(
        uint256 ID,
        uint256 PurchasePrice,
        address owner
    );
    event LogCurrentAdvertingPostionURI(uint256 ID, string URI);
    event LogAdvertingPostionStatus(
        uint256 ID,
        uint256 basicPrice,
        uint256 everySkimWasteCoin,
        address currentOwner,
        uint256 storageCapacity,
        string URI,
        uint256 skimnumber
    );

    constructor(address _admin) {
        owner = msg.sender;
        admin = _admin;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    //修改广告位的基础价格 (购买广告位总共的价格=基础价格+每次浏览进行的消耗)
    function chageAdvertisingPostionPrice(
        uint256 ID,
        uint256 changeprice
    ) public onlyOwner {
        require(changeprice > 0, "The value is valid");
        require(
            ID <= TotalAdvertisingPostion.length,
            "This ad space doesn't exist."
        );
        TotalAdvertisingPostion[ID].basicPrice = changeprice;
        emit LogAdvertingPostionBasicprice(ID, changeprice);
    }

    //修改广告位每次浏览的coin消耗
    function changeAdvertisingPostionEverySkimWasteCoin(
        uint256 ID,
        uint256 changeprice
    ) public onlyOwner {
        require(changeprice > 0, "The value is valid");
        require(
            ID <= TotalAdvertisingPostion.length,
            "This ad space doesn't exist."
        );
        TotalAdvertisingPostion[ID].everySkimWasteCoin = changeprice;
        emit LogAdvertingPostionEverySkimWateCoin(ID, changeprice);
    }

    //购买广告位
    function advertisTransfer(
        uint256 ID,
        uint256 price
    )
        public
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint256,
            string memory,
            uint256
        )
    {
        require(
            price > TotalAdvertisingPostion[ID].basicPrice,
            "The current token doesn't enough"
        );
        tokenContract.approve(admin, price);
        TotalAdvertisingPostion[ID].storageCapacity =
            price -
            TotalAdvertisingPostion[ID].basicPrice;
        TotalAdvertisingPostion[ID].currentOwner = msg.sender;
        emit LogAdvertingPostionTransferRecord(ID, price, msg.sender);
        return checkCurrentAdvertisingPostion(ID);
    }

    //设置广告位的广告
    function setAdvertisements(uint256 ID, string memory _URI) public {
        require(
            msg.sender == TotalAdvertisingPostion[ID].currentOwner,
            "you don't have permission"
        );
        TotalAdvertisingPostion[ID].URI = _URI;
        emit LogCurrentAdvertingPostionURI(ID, _URI);
    }

    //查询当前广告位的相关信息
    function checkCurrentAdvertisingPostion(
        uint256 ID
    )
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            uint256,
            string memory,
            uint256
        )
    {
        require(
            ID < TotalAdvertisingPostion.length,
            "This ad space doesn't exist."
        );
        AdvertisingPostion memory position = TotalAdvertisingPostion[ID];
        return (
            position.ID,
            position.basicPrice,
            position.everySkimWasteCoin,
            position.currentOwner,
            position.storageCapacity,
            position.URI,
            position.skimnumber
        );
    }

    //广告位结束，由gate发起这笔交易,所有的消耗其实是由后端在进行计算的
    function advertisOver(uint256 ID, uint256 coinNumber) public onlyAdmin {
        require(
            ID < TotalAdvertisingPostion.length,
            "This ad space doesn't exist."
        );
        address _owner = TotalAdvertisingPostion[ID].currentOwner;
        uint256 currentTokenWithAdmin = tokenContract.allowance(_owner, admin);
        if (currentTokenWithAdmin < coinNumber) {
            tokenContract.burn(_owner, currentTokenWithAdmin);
            _spednStorageCapacity(ID, coinNumber);
            _overAdserver(ID);
        } else {
            tokenContract.burn(_owner, coinNumber);
            _spednStorageCapacity(ID, coinNumber);
            _overAdserver(ID);
        }
    }

    //根据后端的播放量 对广告位所存放的coin进行消耗
    function _spednStorageCapacity(
        uint256 ID,
        uint256 coinNumber
    ) private onlyAdmin {
        require(
            ID < TotalAdvertisingPostion.length,
            "This ad space doesn't exist"
        );
        TotalAdvertisingPostion[ID].storageCapacity =
            TotalAdvertisingPostion[ID].storageCapacity -
            coinNumber;
    }

    //该广告位结束此次出租 进行初始化
    function _overAdserver(uint256 ID) private onlyAdmin {
        require(
            ID < TotalAdvertisingPostion.length,
            "This ad space donesn't exist"
        );
        TotalAdvertisingPostion[ID].currentOwner = owner;
        TotalAdvertisingPostion[ID].storageCapacity = 0;
        TotalAdvertisingPostion[ID].URI = "";
    }
}
