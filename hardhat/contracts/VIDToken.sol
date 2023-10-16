// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VIDToken is ERC20 {
    address private admin;

    constructor(uint256 initialSupply, address account) ERC20("Video", "VID") {
        admin = account;
        _mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 value) external {
        require(msg.sender == admin, "Only the admin can call this function");
        _mint(account, value);
    }

    function burn(address account, uint256 value) external {
        require(msg.sender == admin, "Only the admin can call this function");
        _burn(account, value);
    }

    
}
