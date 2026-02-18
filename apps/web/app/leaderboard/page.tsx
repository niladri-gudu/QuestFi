import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      <header className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400">
            <Trophy size={24} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">
            Global Rankings
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Sepolia Testnet Hall of Fame
          </p>
        </div>
      </header>

      <LeaderboardTable />
    </div>
  );
}