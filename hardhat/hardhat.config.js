require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("solidity-coverage")
require("@nomiclabs/hardhat-ethers")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const SCROLLSCAN_API_KEY = process.env.SCROLLSCAN_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        scrollSepolia: {
            url: "https://sepolia-rpc.scroll.io/" || "",
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 534351,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // hardhat provide accounts
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.20" }],
    },

    gasReporter: {
        enabled: false,
        //outputFile: "gas-report.txt",
        //gasPrice: 21,
        noColors: true,
        currency: "CNY",
        //   coinmarketcap: COINMARKETCAP_API_KEY,
        //token: "ETH",
    },
    etherscan: {
        apiKey: {
            scrollSepolia: SCROLLSCAN_API_KEY,
        },
        customChains: [
            {
                network: "scrollSepolia",
                chainId: 534351,
                urls: {
                    apiURL: "https://sepolia-blockscout.scroll.io/api",
                    browserURL: "https://sepolia-blockscout.scroll.io/",
                },
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
            31337: 0,
            534351: 0,
        },
        admin: {
            default: 0,
            534351: 0,
        },
        users: {
            default: 1,
            534351: 0,
        },
        advertiser: {
            default: 2,
            534351: 0,
        },
        platformer: {
            default: 3,
            534351: 0,
        },
    },
    mocha: {
        timeout: 300000, // 200 seconds max
    },
}
