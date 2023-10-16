import Link from "next/link"
import Header from "../components/Header"
import { useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis } from "react-moralis"

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function UploadPage() {
    const { account } = useMoralis()
    const dispatch = useNotification()
    const [videoTitle, setVideoTitle] = useState("")
    const onUploadfile = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        formData.append("title", videoTitle)

        const response = await fetch("/api/uploadfile", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        console.log(data)
    }

    const onUploadimg = async (event) => {
        event.preventDefault()

        const formData = new FormData(event.target)
        formData.append("title", videoTitle)

        const response = await fetch("/api/uploadimg", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        console.log(data)
        await sleep(2000)
        dispatch({
            type: "success",
            message: `Send NFT to ${account}`,
            title: "Upload successful",
            position: "topR",
        })
    }

    return (
        <div className="container mx-auto p-4">
            <Header />

            <br />

            <form onSubmit={onUploadfile} encType="multipart/form-data">
                <div className="mb-4">
                    <label htmlFor="title" className="font-bold">
                        视频标题
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="video" className="font-bold">
                        上传视频
                    </label>
                    <input
                        type="file"
                        id="video"
                        name="file"
                        className="border rounded p-2 ml-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        上传视频
                    </button>
                </div>
            </form>

            <br />

            <form onSubmit={onUploadimg} encType="multipart/form-data">
                <div className="mb-4 flex items-center">
                    <label htmlFor="cover" className="font-bold">
                        上传封面
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="cover"
                        name="image"
                        className="border rounded p-2 ml-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        上传封面
                    </button>
                </div>
            </form>

            <br />

            <Link href="/">
                <p className="mt-4 text-center text-blue-500 underline cursor-pointer">返回首页</p>
            </Link>
        </div>
    )
}

export default UploadPage
