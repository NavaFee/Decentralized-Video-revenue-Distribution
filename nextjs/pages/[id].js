import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import vidToken_abi from "../constants/VIDToken.json"
import account from "../constants/account.json"
import React, { useContext } from "react"
import { SharedStateContext } from "../components/SharedStateContext"

const VIDToken_addr = networkMapping["31337"].VIDToken[0]
const TESTNET_URL = "http://localhost:8545"

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

    const handleAdClick = async (index) => {
        const videoIdFromAd = adVideos[index].split("/").pop().split(".")[0]
        setVideoId(videoIdFromAd)
        // 这里可以是广告页面的路由，例如/ad/ad1，你需要根据实际情况调整
        const adPagePath = `/ad/${adVideos[index].split("/").pop().split(".")[0]}`
        router.push(adPagePath)
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

        const tx3 = await vidToken.burn(advertiser, ethers.parseEther("100"))
        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))

        setadvertiserBalance(advertiser_balance.toString())
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

            <br />
            <br />
            <div className="flex justify-center">广告</div>

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
