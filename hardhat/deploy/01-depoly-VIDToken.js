const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    const initialSupply = "1000000000000000000000000000"
    const args = [initialSupply, deployer]
    const vidToken = await deploy("VIDToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying on Etherscan")

        await verify(vidToken.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "vidToken", "main"]
