const fs = require("fs")
import path from "path"
import distributionCoin from "./onblockchain/distributionCoin"
import batchMintCoin from "./onblockchain/batchMintCoin"

export function skimVideotoRecord(id, platform) {
    const record = { videoId: id, platForm: platform }
    const filePath = "../constants/data.json"

    const jsonContent = JSON.stringify(record)

    fs.writeFile(filePath, jsonContent, "utf8", (err) => {
        if (err) {
            console.error("Faild to write", err)
        } else {
            console.log("Record success")
            mergeRecords(filePath)
        }
    })
}

export async function mergeRecords() {
    const filePath = "../../constants/hashRecords.json"
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("MergeRecord failed to read file", err)
            return
        }

        let records
        try {
            records = JSON.parse(data)
        } catch (err) {
            console.error("Json", err)
            return
        }

        let found = false

        records.forEach((record) => {
            if (record.videoId === id && record.platForm === platform) {
                record.playnumber = (record.playnumber || 0) + 1
                found = true
            }
        })

        if (!found) {
            records.push({ videoId: id, platForm: platform, playnumber: 1 })
        }

        const updatedData = JSON.stringify(records)

        fs.writeFile(filePath, updatedData, "utf8", (err) => {
            if (err) {
                console.error("Faild to write file", err)
            } else {
                console.log("Update file Success")

                // 清空文件内容
                fs.truncate(filePath, 0, (err) => {
                    if (err) {
                        console.error("清空文件内容时发生错误：", err)
                    } else {
                        console.log("clean success")
                    }
                })
            }
        })
    })
}

async function uploadRecordToBlockchain(_tokenids, _playCounts, _playPlatforms) {
    await batchMintCoin(_tokenids, _playCounts, _playPlatforms)
}

async function uploadMintRecordToBlockchain(_tokenids, _playPlatform, _coinNumber) {
    await distributionCoin(_tokenids, _playPlatforms, _coinNumber)
}

export function hashRecords(hash, id, platform) {
    const filePath = path.join(__dirname, "../../constants/hashRecord.json")
    const data = { hash, id, platform }
    fs.readFile(filePath, "utf8", (err, jsonString) => {
        if (err) {
            console.error(err)
            return
        }

        let records = []

        try {
            records = JSON.parse(jsonString)
        } catch (err) {
            console.error(err)
        }

        records.push(data)

        fs.writeFile(filePath, JSON.stringify(records), (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log("Hash record saved successfully")
            }
        })
    })
}

export { hashRecords, mergeRecords, skimVideotoRecord }
