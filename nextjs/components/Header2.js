import { ConnectButton } from "web3uikit"
import Link from "next/link"
export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <div className="py-4 px-4 font-bold text-xl">
                <Link href={`/`} className="font-bold">
                    <p>返回首页</p>
                </Link>
            </div>
            <div className="ml-auto py-2 ">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
