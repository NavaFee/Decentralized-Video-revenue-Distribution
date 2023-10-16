// pages/ad/adpage/[id].js

import { useRouter } from "next/router"
import Link from "next/link"

function AdPage() {
    const router = useRouter()
    const { id } = router.query

    if (!id) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="py-6 px-6 font-bold text-xl flex items-center justify-between">
                <h1>Playing Ad Video {id}</h1>
                <Link href={`/`} className="font-bold">
                    <p>返回首页</p>
                </Link>
            </div>

            <video width="640" height="360" controls autoPlay>
                <source src={`/ad/advideo/${id}.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

export default AdPage
