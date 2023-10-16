const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer, admin, platformer } = await getNamedAccounts()

    const chainId = network.config.chainId

    log("----------------------------------------------------")

    const args = [admin]

    const platform = await deploy("platform", {
        from: platformer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("----------------------------------------------------")
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying on Etherscan")

        await verify(platform.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "platform", "main"]
