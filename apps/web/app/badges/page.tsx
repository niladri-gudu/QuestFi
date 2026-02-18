"use client";

import BadgeGrid from "../../components/badges/BadgeGrid";
import { Award } from "lucide-react";

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 md:py-10">
      <header className="relative overflow-hidden rounded-3xl md:rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
          <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-inner">
            <Award size={24} className="md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">
              Achievement Vault
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">
              Verifiable Soulbound Tokens • Sepolia Network
            </p>
          </div>
        </div>
      </header>

      <BadgeGrid />
    </div>
  );
}