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

    const VideoNFT = await ethers.getContract("VideoNFT")
    fs.writeFileSync(
        `${frontEndAbiLocation}VideoNFT.json`,
        VideoNFT.interface.formatJson()
    )
    const TokenMarketplace = await ethers.getContract("TokenMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}TokenMarketplace.json`,
        TokenMarketplace.interface.formatJson()
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const VIDToken = await ethers.getContract("VIDToken")
    const VideoNFT = await ethers.getContract("VideoNFT")
    const TokenMarketplace = await ethers.getContract("TokenMarketplace")

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
        if (!contractAddress[chainId]["VideoNFT"].includes(VideoNFT.target)) {
            contractAddress[chainId]["VideoNFT"][0] = VideoNFT.target
        }
    } else {
        contractAddress[chainId] = { VideoNFT: [VideoNFT.target] }
    }
    if (chainId in contractAddress) {
        if (
            !contractAddress[chainId]["TokenMarketplace"].includes(
                TokenMarketplace.target
            )
        ) {
            contractAddress[chainId]["TokenMarketplace"][0] =
                TokenMarketplace.target
        }
    } else {
        contractAddress[chainId] = {
            TokenMarketplace: [TokenMarketplace.target],
        }
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddress))
}

module.exports.tags = ["all", "frontend"]
