import React, { createContext, useState } from "react"

export const SharedStateContext = createContext()

export const SharedStateProvider = ({ children }) => {
    const [userbalance, setuserBalance] = useState("0")
    const [platformbalance, setplatformBalance] = useState("0")
    const [advertiserbalance, setadvertiserBalance] = useState("0")

    return (
        <SharedStateContext.Provider
            value={{
                userbalance,
                setuserBalance,
                platformbalance,
                setplatformBalance,
                advertiserbalance,
                setadvertiserBalance,
            }}
        >
            {children}
        </SharedStateContext.Provider>
    )
}
