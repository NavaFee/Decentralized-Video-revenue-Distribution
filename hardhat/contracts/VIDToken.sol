// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error VIDToken__NotAdmin();

contract VIDToken is ERC20 {
    address private immutable i_admin;

    constructor(address admin) ERC20("Video", "VID") {
        i_admin = admin;
    }

    function playVedio(address account, uint256 value) external {
        if (msg.sender != i_admin) {
            revert VIDToken__NotAdmin();
        }
        _mint(account, value);
    }

    function clickAD(address advertiser, uint256 value) external {
        if (msg.sender != i_admin) {
            revert VIDToken__NotAdmin();
        }
        _burn(advertiser, value);
    }

    function getAdmin() external view returns (address) {
        return i_admin;
    }
}
