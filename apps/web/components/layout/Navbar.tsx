'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useConnection } from "wagmi"
import { useProfile } from "../../hooks/useProfile"

export default function Navbar() {
    const { address, isConnected } = useConnection()
    const { data } = useProfile(address)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur ">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

                <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold tracking-tight text-white">
                        QuestFi
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isConnected && data && (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-emerald-400">
                            ⚡ {data.totalXP} XP
                        </div>
                    )}

                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </nav>
    )
}