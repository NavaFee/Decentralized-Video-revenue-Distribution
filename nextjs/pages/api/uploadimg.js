import { IncomingForm } from "formidable"
import fs from "fs"

export const config = {
    api: {
        bodyParser: false, // Disabling body parser
    },
}

export default async (req, res) => {
    if (req.method === "POST") {
        const unique_id = "666"

        const form = new IncomingForm({
            uploadDir: "./public/thumbnails",
            keepExtensions: true,
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            const filepath = files["image"][0].filepath
            console.log("files_path:", filepath)
            console.log("fields:", fields)
            console.log("files:", files)
            const title = fields.title

            const newfilePath = `./public/thumbnails/${title}.jpg`

            // 使用fs.rename将文件移动到所需位置
            fs.rename(filepath, newfilePath, (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: err.message })
                }
                console.log("文件写入成功")
                res.status(200).json({
                    name: title,
                    path: `/thumbanils/${title}.mp4`,
                })
            })
        })
    } else {
        res.status(405).json({ error: "Method not allowed" })
    }
}
