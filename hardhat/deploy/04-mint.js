const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer, admin, users, advertiser, platformer } =
        await getNamedAccounts()
    const chainId = network.config.chainId

    const vidToken = await ethers.getContract("VIDToken", deployer)

    const value = await ethers.parseEther("10000")
    const mint_to_advertiser = await vidToken.playVideo(advertiser, value)

    console.log(
        "advertiser's balance =========",
        await vidToken.balanceOf(advertiser)
    )
}
module.exports.tags = ["all", "mint"]
