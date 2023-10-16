const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer, admin } = await getNamedAccounts()

    const chainId = network.config.chainId

    log("----------------------------------------------------")

    const args = [admin]

    const gate = await deploy("Gate", {
        from: deployer,
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

        await verify(gate.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "gate", "main"]
