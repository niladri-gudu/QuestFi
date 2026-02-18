"use client";

import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useConnection } from "wagmi";
import { useState } from "react";

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function LeaderboardTable() {
  const { address } = useConnection(); // Consistent with previous update
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useLeaderboard(page, 10);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBox />;

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="px-3 md:px-6 py-4">Rank</th>
              <th className="px-3 md:px-6 py-4">Explorer</th>
              <th className="px-3 md:px-6 py-4 text-right">Reputation</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/50">
            {users.map((user: any) => {
              const isYou = address && user.wallet.toLowerCase() === address.toLowerCase();

              return (
                <tr
                  key={user.wallet}
                  className={`group transition-colors ${
                    isYou ? "bg-emerald-500/[0.05]" : "hover:bg-zinc-900/40"
                  }`}
                >
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-base hidden sm:inline">{getMedal(user.rank)}</span>
                      <span className="font-mono text-[11px] md:text-xs font-bold text-zinc-400">#{user.rank}</span>
                    </div>
                  </td>

                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs md:text-sm ${isYou ? "text-emerald-400 font-bold" : "text-zinc-300"}`}>
                        {shorten(user.wallet)}
                      </span>
                      {isYou && (
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[7px] md:text-[8px] font-black uppercase text-emerald-400 border border-emerald-500/20">
                          You
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-3 md:px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1 font-bold">
                      <span className="text-xs md:text-base text-white">{user.totalXP.toLocaleString()}</span>
                      <span className="text-[8px] md:text-[10px] uppercase text-zinc-600">XP</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} setPage={setPage} total={data?.totalUsers} />
    </div>
  );
}

function getMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🏅";
}

function Pagination({ page, setPage, total }: any) {
  const hasNext = page * 10 < total;

  return (
    <div className="flex items-center justify-between px-2">
      <button
        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30"
      >
        ← Prev
      </button>

      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
        Page <span className="text-zinc-300">{page}</span>
      </div>

      <button
        onClick={() => setPage((p: number) => p + 1)}
        disabled={!hasNext}
        className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function Skeleton() {
  return <div className="h-[500px] w-full animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50" />;
}

function ErrorBox() {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center text-xs font-bold uppercase tracking-widest text-red-400">
      Error fetching rankings
    </div>
  );
}