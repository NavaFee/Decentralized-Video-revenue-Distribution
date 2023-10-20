// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error NotApprovedForMarketplace();
error NoProceeds();
error TransferFailed();

contract TokenMarketplace {
    struct Order {
        address seller;
        uint256 amount;
        uint256 price;
    }

    mapping(address => uint256) private s_proceeds;
    address public tokenAddress;
    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event TokensPurchased(address buyer, uint256 orderId, uint256 amount);
    event TokensSold(address seller, uint256 orderId, uint256 amount);

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function createOrder(uint256 _amount, uint256 _price) external {
        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(msg.sender) >= _amount,
            "Insufficient token balance"
        );
        require(_price > 0, "Price must be greater than zero");
        if (token.allowance(msg.sender, address(this)) < _amount) {
            revert NotApprovedForMarketplace();
        }

        token.transferFrom(msg.sender, address(this), _amount);

        Order storage order = orders[orderCount];
        order.seller = msg.sender;
        order.amount = _amount;
        order.price = _price;

        emit TokensSold(msg.sender, orderCount, _amount);

        orderCount++;
    }

    function buyTokens(uint256 _orderId) external payable {
        Order storage order = orders[_orderId];
        require(order.seller != address(0), "Invalid order");
        require(
            msg.value >= getPrice(_orderId),
            "Incorrect amount of ETH sent"
        );

        IERC20 token = IERC20(tokenAddress);
        s_proceeds[order.seller] += msg.value;
        uint256 amount = order.amount;
        delete orders[_orderId];

        token.transfer(msg.sender, amount);

        emit TokensPurchased(msg.sender, _orderId, order.amount);
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    function getPrice(uint256 _orderId) public view returns (uint256) {
        Order storage order = orders[_orderId];
        uint256 price = order.amount * order.price;
        return price;
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
