"use client";

import { useAccount } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import CountUp from "react-countup";
import { Terminal, Zap } from "lucide-react";

export default function ProfileHero() {
  const { address, isConnected } = useAccount();
  const { data, isLoading } = useProfile(address);

  if (!isConnected || isLoading || !data) return <Skeleton />;

  const level = Math.floor(data.totalXP / 500) + 1;
  const nextLevelXP = level * 500;
  const remainingXP = nextLevelXP - data.totalXP;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* User Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <Terminal size={12} className="text-emerald-500" />
            Connected Explorer
          </div>
          <div className="font-mono text-lg font-medium text-white">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </div>

        {/* Level Indicator */}
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/5 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <div className="text-sm font-black italic text-white uppercase leading-none">
              Level {level}
            </div>
            <div className="mt-1 text-[10px] font-bold text-emerald-400/80 uppercase">
              {remainingXP > 0 ? `${remainingXP} XP to next level` : "Max Rank reached"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Reputation</div>
          <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
            <CountUp end={data.totalXP} duration={1.2} separator="," /> <span className="text-sm">XP</span>
          </div>
        </div>

        <StatSmall label="Quests" value={data.completedQuests ?? 0} />
        <StatSmall label="Rank" value={`#${data.rank ?? '-'}`} highlight={data.rank <= 3} />
      </div>
    </section>
  );
}

function StatSmall({ label, value, highlight }: any) {
  return (
    <div className={`rounded-lg border p-2 text-center transition ${
      highlight ? "border-emerald-500/40 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/50"
    }`}>
      <div className="text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">{label}</div>
    </div>
  );
}

function Skeleton() {
  return <div className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />;
}