// Pinata
// a service for us to pin our files to IPFS
// Use the api keys by providing the strings directly
const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET

const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

// ./images/randomNft/
async function storeImages(imageFilePath) {
    const fullImagesPath = path.resolve(imageFilePath)
    const files = fs.readdirSync(fullImagesPath)
    console.log(files)
    let responses = []
    console.log("Uploading images to Pinata!...")
    for (fileIndex in files) {
        console.log(`Uploading image ${fileIndex} ...`)
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            const response = await pinata.pinFileToIPFS(
                readableStreamForFile,
                options
            )
            responses.push(response)
        } catch (e) {
            console.log(e)
        }
    }
    return { responses, files }
}

// async function main() {
//     await storeImages("./images/randomNft/")
// }

// main()

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (e) {
        console.log(e)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
