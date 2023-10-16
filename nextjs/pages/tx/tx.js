import Header from "../../components/Header2"
import { Button } from "web3uikit"
import { ethers } from "ethers"
import networkMapping from "../../constants/networkMapping.json"
import vidToken_abi from "../../constants/VIDToken.json"
import account from "../../constants/account.json"
import { useEffect } from "react"
import React, { useContext } from "react"
import { SharedStateContext } from "../../components/SharedStateContext"

const VIDToken_addr = networkMapping["31337"].VIDToken[0]
const TESTNET_URL = "http://localhost:8545"
export default function Tx() {
    // const { ethers } = require("ethers")
    // const [userbalance, setuserBalance] = useState("0")
    // const [platformbalance, setplatformBalance] = useState("0")
    // const [advertiserbalance, setadvertiserBalance] = useState("0")
    const {
        userbalance,
        setuserBalance,
        platformbalance,
        setplatformBalance,
        advertiserbalance,
        setadvertiserBalance,
    } = useContext(SharedStateContext)
    useEffect(() => {
        const interval = setInterval(async () => {
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

            // const tx = await vidToken.mint(user_address, ethers.parseEther("100"))
            // console.log("tx", tx)
            const user_balance = ethers.formatEther(await vidToken.balanceOf(user_address))
            const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))
            const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))
            console.log(advertiser_balance.toString())
            setuserBalance(user_balance.toString())
            setadvertiserBalance(advertiser_balance.toString())
            setplatformBalance(platform_balance.toString())
        }, 500) // 每5秒刷新一次余额

        return () => clearInterval(interval) // 在组件卸载时清除定时器
    }, [])
    async function handlewatchTVClick() {
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
    async function handlewatchADClick() {
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
        // const transaction = vidToken.functions[burn](advertiser, ethers.parseEther("100"))
        // const burn_token = vidToken.getFunction("burn")
        // const transaction = burn_token(advertiser, ethers.parseEther("100"))
        // const txx = new ethers.Transaction()
        // txx.clone(transaction)
        // await accounts.sendTransaction(txx)
        // const tx = await accounts.sendTransaction(transaction)

        const tx3 = await vidToken.burn(advertiser, ethers.parseEther("100"))

        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))

        setadvertiserBalance(advertiser_balance.toString())
    }
    async function handlrefreshClick() {
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

        const user_balance = ethers.formatEther(await vidToken.balanceOf(user_address))
        const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))
        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))
        console.log(advertiser_balance.toString())
        setuserBalance(user_balance.toString())
        setadvertiserBalance(advertiser_balance.toString())
        setplatformBalance(platform_balance.toString())
    }

    return (
        <div>
            <Header />
            <div className="flex justify-between">
                <Button
                    text="Watch Vedio Button"
                    color="green"
                    theme="primary"
                    onClick={handlewatchTVClick}
                />
                <Button text="Refresh" color="blue" theme="colored" onClick={handlrefreshClick} />

                <Button
                    text="Watch AD Button "
                    color="blue"
                    theme="colored"
                    onClick={handlewatchADClick}
                />
            </div>
            <div className="bg-gray-100 rounded-lg p-4 space-y-4">
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Creator Balance:</span>
                    <span className="ml-auto text-gray-600">{userbalance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Video Platform Balance:</span>
                    <span className="ml-auto text-gray-600">{platformbalance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Advertiser Balance:</span>
                    <span className="ml-auto text-gray-600">{advertiserbalance} VIDToken</span>
                </div>
            </div>
            <h1></h1>
        </div>
    )
}
