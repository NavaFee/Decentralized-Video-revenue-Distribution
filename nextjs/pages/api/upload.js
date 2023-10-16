import { IncomingForm } from "formidable"
import fs from "fs"
import { hashRecords}

export const config = {
    api: {
        bodyParser: false, // Disabling body parser
    },
}

export default async (req, res) => {
    if (req.method === "POST") {
        // Generate a unique timestamp for this request
        const timestamp = Date.now().toString()

        const form = new IncomingForm({
            uploadDir: "./public/videos",
            keepExtensions: true,
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }

            if (files.file) {
                const file = files.file
                const filePath = `./videos/${timestamp}.mp4`

                // Use fs.rename to move the file to the desired location
                fs.rename(file.path, filePath, (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ error: err.message })
                    }
                    console.log("文件写入成功")
                    res.status(200).json({
                        name: timestamp,
                        path: `/videos/${timestamp}.mp4`,
                    })
                })
            } else if (files.image) {
                const file = files.image
                const filePath = `./videos/${timestamp}.jpg`

                // Use fs.rename to move the file to the desired location
                fs.rename(file.path, filePath, (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).json({ error: err.message })
                    }
                    console.log("文件写入成功")
                    res.status(200).json({
                        name: timestamp,
                        path: `/videos/${timestamp}.jpg`, // 注意这里改成 .jpg
                    })
                })
            } else {
                res.status(400).json({ error: "No valid file received." })
            }
        })
    } else {
        res.status(405).json({ error: "Method not allowed" })
    }
}
