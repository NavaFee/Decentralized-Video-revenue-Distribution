const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer, admin, platformer } = await getNamedAccounts()

    const chainId = network.config.chainId

    log("----------------------------------------------------")
    const vidToken = await ethers.getContract("VIDToken", deployer)
    const tokenAddress = vidToken.target

    const args = [tokenAddress]

    const tokenMarketplace = await deploy("TokenMarketplace", {
        from: platformer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("----------------------------------------------------")
    if (
        !developmentChains.includes(network.name) &&
        process.env.SCROLLSCAN_API_KEY
    ) {
        log("Verifying on Scrollscan")

        await verify(tokenMarketplace.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "platform", "main"]
