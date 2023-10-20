import Link from "next/link"
import Header from "../components/Header"
import { useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import videoNFT_abi from "../constants/VideoNFT.json"
import accounts from "../constants/account.json"
const VideoNFT_addr = networkMapping["534351"].VideoNFT[0]
const TESTNET_URL = "https://sepolia-rpc.scroll.io/"
const wallet1 = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function UploadPage() {
    const { account } = useMoralis()
    const dispatch = useNotification()
    const [videoTitle, setVideoTitle] = useState("")
    const onUploadfile = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        formData.append("title", videoTitle)

        const response = await fetch("/api/uploadfile", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        console.log(data)
    }

    const onUploadimg = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        formData.append("title", videoTitle)

        const response = await fetch("/api/uploadimg", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        console.log(data)
        const provider = new ethers.JsonRpcProvider(TESTNET_URL)
        const wallet_admin = new ethers.Wallet(wallet1, provider)
        const admin = accounts["scroll"][0]
        const platform = accounts["scroll"][1]
        const advertiser = accounts["scroll"][2]
        const user1_address = accounts["scroll"][3]
        const user2_address = accounts["scroll"][4]
        const user3_address = accounts["scroll"][5]
        console.log("platform", platform)
        console.log("user_account", user1_address)
        console.log(VideoNFT_addr)
        console.log(videoNFT_abi)
        console.log(wallet_admin)
        const videoNFT = new ethers.Contract(VideoNFT_addr, videoNFT_abi, wallet_admin)
        console.log("videoNFT", videoNFT)
        const tokenUri =
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
        const tx1 = await videoNFT.uploadVideo(tokenUri, account)
        await tx1.wait(1)

        dispatch({
            type: "success",
            message: `Mint NFT to ${reflect(account)}`,
            title: "Upload successful",
            position: "topR",
        })
    }
    function reflect(address) {
        const str1 = address.slice(0, 6)
        const str2 = address.slice(-6)
        return str1 + "..." + str2
    }

    return (
        <div className="container mx-auto p-4">
            <Header />

            <br />

            <form onSubmit={onUploadfile} encType="multipart/form-data">
                <div className="mb-4">
                    <label htmlFor="title" className="font-bold">
                        视频标题
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="video" className="font-bold">
                        上传视频
                    </label>
                    <input
                        type="file"
                        id="video"
                        name="file"
                        className="border rounded p-2 ml-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        上传视频
                    </button>
                </div>
            </form>

            <br />

            <form onSubmit={onUploadimg} encType="multipart/form-data">
                <div className="mb-4 flex items-center">
                    <label htmlFor="cover" className="font-bold">
                        上传封面
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="cover"
                        name="image"
                        className="border rounded p-2 ml-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        上传封面
                    </button>
                </div>
            </form>

            <br />

            <Link href="/">
                <p className="mt-4 text-center text-blue-500 underline cursor-pointer">返回首页</p>
            </Link>
        </div>
    )
}

export default UploadPage
