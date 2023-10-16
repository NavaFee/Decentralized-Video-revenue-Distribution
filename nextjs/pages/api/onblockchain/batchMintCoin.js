import { ethers } from "ethers"
import Gate_abi from "../../constants/Gate.json"
import networkMapping from "../../constants/networkMapping.json"
import account from "../../constants/account.json"

const TESTNET_URL = "http://127.0.0.1:8545/"
const GateContract_addr = networkMapping["31337"].Gate[0]

export default async function batchMintCoin(_tokenids, _playCounts, _playPlatforms) {
    const provider = new ethers.JsonRpcProvider(TESTNET_URL)
    const accounts = await provider.getSigner()
    const platform1 = account["account"][3]

    const Gate = new ethers.BaseContract(GateContract_addr, Gate_abi, accounts)

    await Gate.batchMintCoin(_tokenids, _playCounts, _playPlatforms)
}
