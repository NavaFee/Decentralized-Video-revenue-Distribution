const fs = require("fs")
const { network, ethers } = require("hardhat")
require("dotenv").config()
const frontEndContractsFile = "../nextjs/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs/constants/"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front End Written!")
    }
}

async function updateAbi() {
    const VIDToken = await ethers.getContract("VIDToken")
    fs.writeFileSync(
        `${frontEndAbiLocation}VIDToken.json`,
        VIDToken.interface.formatJson()
    )

    const platform = await ethers.getContract("platform")
    fs.writeFileSync(
        `${frontEndAbiLocation}platform.json`,
        platform.interface.formatJson()
    )
    const ERC721PlatformManage = await ethers.getContract(
        "ERC721PlatformManage"
    )
    fs.writeFileSync(
        `${frontEndAbiLocation}ERC721PlatformManage.json`,
        ERC721PlatformManage.interface.formatJson()
    )
    const Gate = await ethers.getContract("Gate")
    fs.writeFileSync(
        `${frontEndAbiLocation}Gate.json`,
        Gate.interface.formatJson()
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const VIDToken = await ethers.getContract("VIDToken")
    const platform = await ethers.getContract("platform")
    const ERC721PlatformManage = await ethers.getContract(
        "ERC721PlatformManage"
    )
    const Gate = await ethers.getContract("Gate")

    const contractAddress = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (chainId in contractAddress) {
        if (!contractAddress[chainId]["VIDToken"].includes(VIDToken.target)) {
            contractAddress[chainId]["VIDToken"][0] = VIDToken.target
        }
    } else {
        contractAddress[chainId] = { VIDToken: [VIDToken.target] }
    }
    if (chainId in contractAddress) {
        if (!contractAddress[chainId]["platform"].includes(platform.target)) {
            contractAddress[chainId]["platform"][0] = platform.target
        }
    } else {
        contractAddress[chainId] = { platform: [platform.target] }
    }
    if (chainId in contractAddress) {
        if (
            !contractAddress[chainId]["ERC721PlatformManage"].includes(
                ERC721PlatformManage.target
            )
        ) {
            contractAddress[chainId]["ERC721PlatformManage"][0] =
                ERC721PlatformManage.target
        }
    } else {
        contractAddress[chainId] = {
            ERC721PlatformManage: [ERC721PlatformManage.target],
        }
    }
    if (chainId in contractAddress) {
        if (!contractAddress[chainId]["Gate"].includes(Gate.target)) {
            contractAddress[chainId]["Gate"][0] = Gate.target
        }
    } else {
        contractAddress[chainId] = { Gate: [Gate.target] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
