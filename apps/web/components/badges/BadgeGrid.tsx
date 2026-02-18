"use client";

import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import { ExternalLink, ShieldCheck, Box, Award } from "lucide-react";

export default function BadgeGrid() {
  const { address, isConnected } = useConnection();
  const { data, isLoading } = useProfile(address);

  if (!isConnected) return <Empty message="Connect wallet to access the vault." />;
  if (isLoading) return <Skeleton />;

  const badges = data?.badges ?? [];

  if (!badges.length) {
    return <Empty message="Vault is empty. Complete quests to earn badges." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <div className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            ID: {String(badge.tokenId).padStart(4, '0')}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-zinc-900/80 px-2 py-1 text-[8px] font-black uppercase tracking-tighter text-zinc-400 backdrop-blur-sm border border-zinc-800">
          <Box size={10} /> Sepolia-721
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-sm font-black uppercase tracking-tight text-white italic group-hover:text-emerald-400 transition-colors">
          {badge.name || "Achievement Badge"}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Soulbound</span>
          <a
            href={explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Explorer <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-700">
        <Award size={32} />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 max-w-[200px] leading-loose">
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