"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X } from "lucide-react";
import { isAdmin } from "../../lib/admin";

export default function Navbar() {
  const { address, isConnected } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data } = useProfile(isConnected ? address : undefined);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItem = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`relative px-1 py-2 text-sm font-bold uppercase tracking-widest transition-all ${
          active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-[1.5px] left-0 hidden md:block h-[2px] w-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
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
          {address && navItem("/badges", "Badges")}
          {address && isAdmin(address) && navItem("/admin", "Admin")}
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton showBalance={false} chainStatus="icon" />

          <button
            onClick={toggleMenu}
            className="flex items-center justify-center p-2 text-zinc-400 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-2 duration-200">
          {navItem("/", "Home")}
          {navItem("/dashboard", "Dashboard")}
          {navItem("/leaderboard", "Leaderboard")}
          {address && navItem("/badges", "Badges")}
          {address && isAdmin(address) && navItem("/admin", "Admin")}
        </div>
      )}
    </nav>
  );
}
