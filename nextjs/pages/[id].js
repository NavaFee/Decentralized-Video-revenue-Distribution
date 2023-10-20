import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import vidToken_abi from "../constants/VIDToken.json"
import accounts from "../constants/account.json"
import React, { useContext } from "react"
import { SharedStateContext } from "../components/SharedStateContext"

const VIDToken_addr = networkMapping["534351"].VIDToken[0]
const TESTNET_URL = "https://sepolia-rpc.scroll.io/"
const wallet1 = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY
export default function VideoPage() {
    const {
        userbalance,
        setuserBalance,
        platformbalance,
        setplatformBalance,
        advertiserbalance,
        setadvertiserBalance,
    } = useContext(SharedStateContext)
    const router = useRouter()
    const [videoId, setVideoId] = useState(null)

    const adImages = ["/ad/adimage/ad1.jpg", "/ad/adimage/ad2.jpg", "/ad/adimage/ad3.jpg"]
    const adVideos = ["/ad/advideo/ad1.mp4", "/ad/advideo/ad2.mp4", "/ad/advideo/ad3.mp4"]

    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    const adInterval = useRef(null)

    useEffect(() => {
        if (router && router.query) {
            setVideoId(router.query.id)
        }
    }, [router])

    useEffect(() => {
        adInterval.current = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adImages.length)
        }, 1000)

        return () => {
            clearInterval(adInterval.current)
        }
    }, [])

    useEffect(() => {
        play()
    }, [])

    const handleAdClick = async (index) => {
        const videoIdFromAd = adVideos[index].split("/").pop().split(".")[0]
        setVideoId(videoIdFromAd)
        // 这里可以是广告页面的路由，例如/ad/ad1，你需要根据实际情况调整
        const adPagePath = `/ad/${adVideos[index].split("/").pop().split(".")[0]}`
        router.push(adPagePath)
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

        const vidToken = new ethers.Contract(VIDToken_addr, vidToken_abi, wallet_admin)
        console.log("vidToken", vidToken)

        const tx3 = await vidToken.clickAD(advertiser, ethers.parseEther("1000"))

        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))

        setadvertiserBalance(advertiser_balance.toString())
    }

    async function play() {
        const tokenID = router.query.id
        console.log("videoId", tokenID)
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
        const vidToken = new ethers.Contract(VIDToken_addr, vidToken_abi, wallet_admin)
        console.log("vidToken", vidToken)
        console.log("videoId", tokenID)
        if (tokenID == "晚霞") {
            const tx1 = await vidToken.playVideo(user1_address, ethers.parseEther("300"))
            await tx1.wait(1)
        }
        if (tokenID == "草原") {
            const tx1 = await vidToken.playVideo(user2_address, ethers.parseEther("300"))
            await tx1.wait(1)
        }
        if (tokenID == "雪山") {
            const tx1 = await vidToken.playVideo(user3_address, ethers.parseEther("300"))
            await tx1.wait(1)
        }
        if (tokenID == "日落") {
            const tx1 = await vidToken.playVideo(user1_address, ethers.parseEther("300"))
            await tx1.wait(1)
        }

        const tx2 = await vidToken.playVideo(platform, ethers.parseEther("700"))
    }

    if (!videoId) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="py-6 px-6 font-bold text-xl flex items-center justify-between">
                <h1>Playing Video {videoId}</h1>
                <Link href={`/`} className="font-bold">
                    <p>返回首页</p>
                </Link>
            </div>
            <video width="640" height="360" controls autoPlay>
                <source src={`/videos/${videoId}.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <br className="py-" />
            <br />
            <div className="flex justify-center" onClick={play}>
                广告
            </div>

            <div className="overflow-hidden relative w-640px top-1">
                <img
                    src={adImages[currentAdIndex]}
                    alt="Advertisement"
                    className="transition-opacity w-full h-auto"
                    onClick={() => handleAdClick(currentAdIndex)}
                />
            </div>
        </div>
    )
}
