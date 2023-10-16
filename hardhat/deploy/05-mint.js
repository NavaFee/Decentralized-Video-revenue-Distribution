const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer, admin, users, advertiser, platformer } =
        await getNamedAccounts()
    const chainId = network.config.chainId

    const vidToken = await ethers.getContract("VIDToken", deployer)
    const erc721 = await ethers.getContract("ERC721PlatformManage", deployer)
    const paltform = await ethers.getContract("platform", platformer)
    const gate = await ethers.getContract("Gate", admin)

    const value = await ethers.parseEther("10000")
    const mint_to_advertiser = await vidToken.mint(advertiser, value)

    console.log(
        "advertiser's balance =========",
        await vidToken.balanceOf(advertiser)
    )
}
module.exports.tags = ["all", "mint"]
