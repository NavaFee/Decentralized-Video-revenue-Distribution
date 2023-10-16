import { IncomingForm } from "formidable"
import fs from "fs"

export const config = {
    api: {
        bodyParser: false, // Disabling body parser
    },
}

export default async (req, res) => {
    if (req.method === "POST") {
        // 为此请求生成一个唯一的时间戳

        const form = new IncomingForm({
            uploadDir: "./public/videos",
            keepExtensions: true,
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            const filepath = files["file"][0].filepath
            console.log("files_path:", filepath)
            console.log("fields:", fields)
            console.log("files:", files)
            const title = fields.title[0]
            const newfilePath = `./public/videos/${title}.mp4`

            // 使用fs.rename将文件移动到所需位置
            fs.rename(filepath, newfilePath, (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: err.message })
                }
                console.log("文件写入成功")
                res.status(200).json({
                    name: title,
                    path: `/videos/${title}.mp4`,
                })
            })
        })
    } else {
        res.status(405).json({ error: "Method not allowed" })
    }
}
