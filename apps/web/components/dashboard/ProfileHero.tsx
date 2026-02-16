"use client";

import { useConnection } from "wagmi";
import { useProfile } from "../../hooks/useProfile";
import CountUp from "react-countup";

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

  const level = Math.floor(data.totalXP / 500) + 1;
  const nextLevelXP = level * 500;
  const remainingXP = nextLevelXP - data.totalXP;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-950 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">Wallet</div>
          <div className="text-lg font-medium text-white">
            {shorten(address as string)}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 px-4 py-2 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-xl shadow-inner">
            ⚡
          </div>
          <div>
            <div className="text-sm font-black italic text-emerald-100 uppercase leading-none">
              Level {level}
            </div>
            <div className="mt-1 text-[10px] font-medium text-emerald-400/80">
              {remainingXP > 0 ? `${remainingXP} XP TO GO` : "TOP TIER"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-zinc-400">Total XP</div>
        <div className="mt-1 text-4xl font-bold bg-linear-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
          <CountUp end={data.totalXP} duration={1.2} separator="," />
        </div>

        {data.totalXP === 0 && (
          <div className="text-xs text-zinc-500 mt-2">
            Complete your first quest to start leveling 🚀
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Completed" value={data.completedQuests ?? 0} />
        <StatCard label="Badges" value={data.badges?.length ?? 0} />
        <StatCard
          label="Rank"
          value={data.rank ? `${getMedal(data.rank)} #${data.rank}` : "-"}
          highlight={data.rank && data.rank <= 3}
        />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: any;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight
          ? "border-yellow-500/40 shadow-yellow-500/10 shadow"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}

const getMedal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🏅";
};
