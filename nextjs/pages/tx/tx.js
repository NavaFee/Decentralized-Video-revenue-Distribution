import Header from "../../components/Header2"
import { Button } from "web3uikit"
import { ethers } from "ethers"
import networkMapping from "../../constants/networkMapping.json"
import vidToken_abi from "../../constants/VIDToken.json"
import accounts from "../../constants/account.json"
import { useEffect } from "react"
import { useState, useContext } from "react"
import { SharedStateContext } from "../../components/SharedStateContext"
import { useMoralis } from "react-moralis"

const VIDToken_addr = networkMapping["534351"].VIDToken[0]
const TESTNET_URL = "https://sepolia-rpc.scroll.io/"
const platform_address = accounts["scroll"][1]
const advertiser_address = accounts["scroll"][2]

export default function Tx() {
    const wallet1 = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY
    console.log("wallet1", wallet1)

    const [user1balance, setuser1Balance] = useState("0")
    const [user2balance, setuser2Balance] = useState("0")
    const [user3balance, setuser3Balance] = useState("0")

    const {
        userbalance,
        setuserBalance,
        platformbalance,
        setplatformBalance,
        advertiserbalance,
        setadvertiserBalance,
    } = useContext(SharedStateContext)
    const { account } = useMoralis()

    useEffect(() => {
        if (account) {
            const interval = setInterval(async () => {
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

                // const tx = await vidToken.mint(user_address, ethers.parseEther("100"))
                // console.log("tx", tx)
                const user_balance = ethers.formatEther(await vidToken.balanceOf(account))
                const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))
                const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))
                const user1_balance = ethers.formatEther(await vidToken.balanceOf(user1_address))
                const user2_balance = ethers.formatEther(await vidToken.balanceOf(user2_address))
                const user3_balance = ethers.formatEther(await vidToken.balanceOf(user3_address))

                console.log(advertiser_balance.toString())
                setuserBalance(user_balance.toString())
                setadvertiserBalance(advertiser_balance.toString())
                setplatformBalance(platform_balance.toString())
                setuser1Balance(user1_balance.toString())
                setuser2Balance(user2_balance.toString())
                setuser3Balance(user3_balance.toString())
            }, 5000) // 每5秒刷新一次余额

            return () => clearInterval(interval) // 在组件卸载时清除定时器
        }
    }, [account])

    async function handlewatchTVClick() {
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

        const tx1 = await vidToken.playVideo(account, ethers.parseEther("300"))
        await tx1.wait(1)
        const tx2 = await vidToken.playVideo(platform, ethers.parseEther("700"))

        const user_balance = ethers.formatEther(await vidToken.balanceOf(account))
        const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))

        setuserBalance(user_balance.toString())

        setplatformBalance(platform_balance.toString())
    }
    async function handlewatchADClick() {
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

        // const transaction = vidToken.functions[burn](advertiser, ethers.parseEther("100"))
        // const burn_token = vidToken.getFunction("burn")
        // const transaction = burn_token(advertiser, ethers.parseEther("100"))
        // const txx = new ethers.Transaction()
        // txx.clone(transaction)
        // await accounts.sendTransaction(txx)
        // const tx = await accounts.sendTransaction(transaction)

        const tx3 = await vidToken.clickAD(advertiser, ethers.parseEther("1000"))

        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))

        setadvertiserBalance(advertiser_balance.toString())
    }
    // function reflect(address) {
    //     const str1 = address.slice(0, 6)
    //     const str2 = address.slice(-6)
    //     return str1 + "..." + str2
    // }

    async function handlrefreshClick() {
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

        const user_balance = ethers.formatEther(await vidToken.balanceOf(account))
        const platform_balance = ethers.formatEther(await vidToken.balanceOf(platform))
        const advertiser_balance = ethers.formatEther(await vidToken.balanceOf(advertiser))
        const user1_balance = ethers.formatEther(await vidToken.balanceOf(user1_address))
        const user2_balance = ethers.formatEther(await vidToken.balanceOf(user2_address))
        const user3_balance = ethers.formatEther(await vidToken.balanceOf(user3_address))

        console.log(advertiser_balance.toString())
        setuserBalance(user_balance.toString())
        setadvertiserBalance(advertiser_balance.toString())
        setplatformBalance(platform_balance.toString())
        setuser1Balance(user1_balance.toString())
        setuser2Balance(user2_balance.toString())
        setuser3Balance(user3_balance.toString())
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
                    <span className="text-gray-800 font-semibold">Current Account Balance:</span>
                    <span className="ml-auto text-gray-600">{userbalance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Creator1 Balance:</span>
                    <span className="ml-auto text-gray-600">{user1balance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Creator2 Balance:</span>
                    <span className="ml-auto text-gray-600">{user2balance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Creator3 Balance:</span>
                    <span className="ml-auto text-gray-600">{user3balance} VIDToken</span>
                </div>

                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Video Platform Balance :</span>
                    <span className="ml-auto text-gray-600">{platformbalance} VIDToken</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-800 font-semibold">Advertiser Balance :</span>
                    <span className="ml-auto text-gray-600">{advertiserbalance} VIDToken</span>
                </div>
            </div>
            <h1></h1>
        </div>
    )
}
