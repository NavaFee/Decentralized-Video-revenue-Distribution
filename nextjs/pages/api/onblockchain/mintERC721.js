import { ethers } from "ethers"
import ERC721Market_abi from "../../constants/ERC721PlatformManage.json"
import networkMapping from "../../constants/networkMapping.json"
import account from "../../constants/account.json"

const TESTNET_URL = "http://127.0.0.1:8545/"
const ERC721Market_addr = networkMapping["31337"].ERC721PlatformManage[0]

export default async function mintErc721(uri) {
    const provider = new ethers.JsonRpcProvider(TESTNET_URL)
    const accounts = await provider.getSigner()
    const platform1 = account["account"][3]

    const ERC721Market = new ethers.BaseContract(ERC721Market_addr, ERC721Market_abi, accounts)

    await ERC721Market.mintNft(platform1, uri)
}
