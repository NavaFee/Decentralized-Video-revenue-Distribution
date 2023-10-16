import Link from "next/link"

import path from "path"

export async function getStaticProps() {
    const fs = require("fs") // Import fs inside the function

    const videoDir = path.join(process.cwd(), "public", "videos")
    const filenames = fs.readdirSync(videoDir)

    const videos = filenames.map((filename) => ({
        id: path.basename(filename, ".mp4"),
        title: path.basename(filename, ".mp4"),
        thumbnail: `/thumbnails/${path.basename(filename, ".mp4")}.jpg`,
    }))
    return {
        props: {
            videos,
        },
    }
}

import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import vidToken_abi from "../constants/VIDToken.json"
import account from "../constants/account.json"
import { useContext } from "react"
import { SharedStateContext } from "../components/SharedStateContext"

const VIDToken_addr = networkMapping["31337"].VIDToken[0]
const TESTNET_URL = "http://localhost:8545"

export default function HomePage({ videos }) {
    const {
        userbalance,
        setuserBalance,
        platformbalance,
        setplatformBalance,
        advertiserbalance,
        setadvertiserBalance,
    } = useContext(SharedStateContext)

    async function handlewatchClick() {
        const provider = new ethers.JsonRpcProvider(TESTNET_URL)
        const accounts = await provider.getSigner()
        const admin = account["account"][0]
        const platform = account["account"][3]
        const user_address = account["account"][1]
        const advertiser = account["account"][2]
        console.log("platform", platform)
        console.log("user_account", user_address)

        const vidToken = new ethers.BaseContract(VIDToken_addr, vidToken_abi, accounts)
        console.log("vidToken", vidToken)
        await vidToken.connect(user_address)
        const tx1 = await vidToken.mint(platform, ethers.parseEther("70"))
        const tx2 = await vidToken.mint(user_address, ethers.parseEther("30"))
        const user_balance = ethers.formatEther(await vidToken.balanceOf(user_address))
        const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))

        setuserBalance(user_balance.toString())

        setplatformBalance(platform_balance.toString())
    }
    return (
        <div>
            <div className="py-6 px-6 font-bold text-xl flex items-center justify-between">
                <div>Video List</div>
                <Link href={`/tx/tx`} className="font-bold">
                    <p>查询余额</p>
                </Link>
                <Link href={`/upload`} className="font-bold">
                    <p>上传视频</p>
                </Link>
            </div>

            <ul>
                {videos.map((video) => (
                    <li key={video.id}>
                        <Link href={`/${video.id}`} onClick={handlewatchClick}>
                            <img src={video.thumbnail} alt={video.title} width="flex" />
                            <p className="font-bold px-6">{video.title}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
