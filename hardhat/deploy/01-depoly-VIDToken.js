const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")

    const args = [deployer]
    console.log(args)
    const vidToken = await deploy("VIDToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(vidToken.target)
    if (
        !developmentChains.includes(network.name) &&
        process.env.SCROLLSCAN_API_KEY
    ) {
        log("Verifying on Scrollscan")

        await verify(vidToken.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "vidToken", "main"]
