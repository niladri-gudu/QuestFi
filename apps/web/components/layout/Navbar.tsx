"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi"; // Use useAccount for wallet status
import { useProfile } from "../../hooks/useProfile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal } from "lucide-react";
import { isAdmin } from "../../lib/admin";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { data } = useProfile(address);
  const pathname = usePathname();

  const navItem = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`relative px-1 py-2 text-sm font-bold uppercase tracking-widest transition-all ${
          active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-[1.5px] left-0 h-[2px] w-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:bg-emerald-400 transition-colors">
              <Terminal size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              QuestFi
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItem("/", "Home")}
          {navItem("/dashboard", "Dashboard")}
          {navItem("/leaderboard", "Leaderboard")}
          {isAdmin(address) && navItem("/admin", "Admin")}
        </div>

        <div className="flex items-center gap-4">
          {/* {isConnected && data && data.totalXP > 0 && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-400">
              <span className="animate-pulse">⚡</span>
              {data.totalXP.toLocaleString()} XP
            </div>
          )} */}

          <div className="rainbow-custom-connect">
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              //   accountStatus="address"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
