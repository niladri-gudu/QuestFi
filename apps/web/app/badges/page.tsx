"use client";

import BadgeGrid from "../../components/badges/BadgeGrid";
import { Award } from "lucide-react";

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-10">
      <header className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-inner">
            <Award size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">
              Achievement Vault
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">
              Verifiable Soulbound Tokens • Sepolia Network
            </p>
          </div>
        </div>
      </header>

      <BadgeGrid />
    </div>
  );
}