import TokenMarketplace_abi from "../constants/TokenMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
const Marketplace_addr = networkMapping["534351"].TokenMarketplace[0]
const TESTNET_URL = "https://sepolia-rpc.scroll.io/"
const wallet1 = process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY
const SwapPage = () => {
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const [orderId, setOrderId] = useState(0)

    useEffect(() => {
        const initEthers = async () => {
            if (typeof window.ethereum !== "undefined") {
                const providerInstance = new ethers.JsonRpcProvider(TESTNET_URL)
                const signerInstance = new ethers.Wallet(wallet1, provider)

                const contractInstance = new ethers.Contract(
                    Marketplace_addr, // Replace 5777 with your network ID
                    TokenMarketplace_abi,
                    signerInstance
                )

                setProvider(providerInstance)
                setSigner(signerInstance)
                setContract(contractInstance)
            } else {
                alert("Please install Metamask!")
            }
        }
        initEthers()
    }, [])

    const createOrder = async () => {
        if (contract) {
            try {
                const tx = await contract.createOrder(amount, price)
                await tx.wait()
                alert("Order created!")
            } catch (err) {
                alert(`Error: ${err.message}`)
            }
        }
    }

    const buyTokens = async () => {
        if (contract) {
            try {
                const orderPrice = await contract.getPrice(orderId)
                const tx = await contract.buyTokens(orderId, { value: orderPrice })
                await tx.wait()
                alert("Tokens bought!")
            } catch (err) {
                alert(`Error: ${err.message}`)
            }
        }
    }

    return (
        <div className="container">
            <h1 className="title">Token Marketplace</h1>

            <div className="card">
                <h2>Create Order</h2>
                <div className="input-group">
                    <label>Amount:</label>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                    />
                </div>
                <div className="input-group">
                    <label>Price per Token:</label>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per Token"
                    />
                </div>
                <button onClick={createOrder}>Create Order</button>
            </div>

            <div className="card">
                <h2>Buy Tokens</h2>
                <div className="input-group">
                    <label>Order ID:</label>
                    <input
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Order ID"
                    />
                </div>
                <button onClick={buyTokens}>Buy Tokens</button>
            </div>
            <div className="card">
                <h2>Order Listings</h2>
                <div className="order-listing bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-lg font-semibold">Order ID: 0</p>
                    <p className="text-gray-600">Amount: 100,000</p>
                    <p className="text-gray-600">Price: 9.9 ETH</p>
                </div>
                <div className="order-listing bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-lg font-semibold">Order ID: 2</p>
                    <p className="text-gray-600">Amount: 500,000</p>
                    <p className="text-gray-600">Price: 48.5 ETH</p>
                </div>
            </div>

            <style jsx>{`
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }

                .title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                    font-size: 28px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .card {
                    background-color: #f9f9f9;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .input-group {
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                }

                label {
                    flex: 1;
                    font-weight: bold;
                    margin-right: 10px;
                }

                input {
                    flex: 2;
                    padding: 8px 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                button {
                    width: 100%;
                    padding: 12px;
                    margin-top: 10px;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #0056b3;
                }
                .order-listing {
                    margin: 10px 0;
                    padding: 10px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    display: flex;
                    flex-direction: column;
                }

                .order-listing p {
                    margin: 5px 0;
                }

                .order-listing p:first-child {
                    font-weight: bold;
                }

                .order-listing p:last-child {
                    margin-top: 10px;
                }
            `}</style>
        </div>
    )
}

export default SwapPage
