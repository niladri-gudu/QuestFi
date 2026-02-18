"use client";

import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import { ExternalLink, ShieldCheck, Box, Award } from "lucide-react";

import { useAccount } from "wagmi";

export default function BadgeGrid() {
  const { address, isConnected } = useAccount();
  const { data, isLoading } = useProfile(address);

  if (!isConnected) return <Empty message="Connect wallet to access the vault." />;
  if (isLoading) return <Skeleton />;

  const badges = data?.badges ?? [];

  if (!badges.length) {
    return <Empty message="Vault is empty. Complete quests to earn badges." />;
  }

  return (
    /* Changed: gap-4 for mobile to fit more cards on screen */
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge: any) => (
        <BadgeCard key={badge.tokenId} badge={badge} />
      ))}
    </div>
  );
}

function BadgeCard({ badge }: any) {
  const explorer = `https://sepolia.etherscan.io/token/${badge.contractAddr}?a=${badge.tokenId}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-2 transition-all hover:border-emerald-500/40 hover:bg-zinc-900/60">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </div>
          <div className="font-mono text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            ID: {String(badge.tokenId).padStart(4, '0')}
          </div>
        </div>

        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex items-center gap-1 rounded-md bg-zinc-900/80 px-1.5 py-0.5 md:px-2 md:py-1 text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-zinc-400 border border-zinc-800">
          <Box size={9} /> Sepolia-721
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="text-xs md:text-sm font-black uppercase tracking-tight text-white italic group-hover:text-emerald-400 transition-colors">
          {badge.name || "Achievement Badge"}
        </div>
        
        <div className="mt-3 md:mt-4 flex items-center justify-between">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-600">Soulbound</span>
          <a
            href={explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Explorer <ExternalLink size={10} className="md:w-3 md:h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 md:p-20 text-center">
      <div className="mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-700">
        <Award size={24} className="md:w-8 md:h-8" />
      </div>
      <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-500 max-w-[200px] md:max-w-xs leading-loose">
        {message}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-zinc-900/50 border border-zinc-800" />
      ))}
    </div>
  );
}