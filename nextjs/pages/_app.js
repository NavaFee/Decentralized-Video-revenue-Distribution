import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { SharedStateProvider } from "../components/SharedStateContext"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <SharedStateProvider>
                    <Component {...pageProps} />
                </SharedStateProvider>
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
