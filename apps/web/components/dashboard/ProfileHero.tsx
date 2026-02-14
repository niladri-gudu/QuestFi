"use client";

import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";

function shorten(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ProfileHero() {
  const { address, isConnected } = useConnection();
  const { data, isLoading } = useProfile(address);

  if (!isConnected) return null;

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="h-6 w-40 rounded bg-zinc-800 mb-4" />
        <div className="h-12 w-32 rounded bg-zinc-800" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">Wallet</div>
          <div className="text-lg font-medium text-white">
            {shorten(address)}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400 text-sm">
          ⚡ Leveling Up
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-zinc-400">Total XP</div>
        <div className="mt-1 text-4xl font-bold bg-linear-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
          {data.totalXP.toLocaleString()}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Completed" value={data.completedQuests ?? 0} />
        <StatCard label="Badges" value={data.badges?.length ?? 0} />
        <StatCard label="Rank" value="-" />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}
