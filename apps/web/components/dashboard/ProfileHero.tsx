"use client";

import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import CountUp from "react-countup";
import { Terminal, Zap } from "lucide-react";

export default function ProfileHero() {
  const { address, isConnected } = useConnection();
  const { data, isLoading } = useProfile(address);

  if (!isConnected || isLoading || !data) return <Skeleton />;

  const level = Math.floor(data.totalXP / 500) + 1;
  const nextLevelXP = level * 500;
  const remainingXP = nextLevelXP - data.totalXP;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <Terminal size={12} className="text-emerald-500" />
            Active Protocol Explorer
          </div>
          <div className="font-mono text-xl font-bold text-white tracking-tight">
            {address?.slice(0, 6)}
            <span className="text-zinc-600">...</span>
            {address?.slice(-4)}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/10 px-5 py-3 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <div className="text-sm font-black italic text-white uppercase leading-none tracking-tight">
              Level {level}
            </div>
            <div className="mt-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {remainingXP > 0
                ? `${remainingXP} XP TO NEXT LEVEL`
                : "MAX RANK REACHED"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="md:col-span-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">
            Lifetime Reputation
          </div>
          <div className="text-5xl font-black bg-linear-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent italic">
            <CountUp end={data.totalXP} duration={1.5} separator="," />{" "}
            <span className="text-xl not-italic text-zinc-400 ml-1">XP</span>
          </div>
        </div>

        <StatSmall label="Completed" value={data.completedQuests ?? 0} />
        <StatSmall
          label="Global Rank"
          value={`#${data.rank ?? "-"}`}
          highlight={data.rank <= 3}
        />
      </div>
    </section>
  );
}

function StatSmall({ label, value, highlight }: any) {
  return (
    <div
      className={`rounded-lg border p-2 text-center transition ${
        highlight
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-950/50"
      }`}
    >
      <div className="text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
        {label}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />
  );
}
