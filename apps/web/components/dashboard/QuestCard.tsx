"use client";

import { useConnection } from "wagmi";
import CompleteButton from "../CompleteButton";

export default function QuestCard({ quest }: { quest: any }) {
  const { isConnected } = useConnection();

  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-emerald-500/40 hover:bg-zinc-900/70">
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{quest.description}</p>
        </div>

        <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 border border-emerald-500/30">
          +{quest.xpReward} XP
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <QuestTypeBadge type={quest.type} />
        <CompleteButton questId={quest.id} metadata={quest.metadata} />
      </div>
    </div>
  );
}

function QuestTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    TX: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    SIGN: "text-violet-400 border-violet-400/30 bg-violet-400/10",
    MULTI: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  };

  return (
    <div
      className={`rounded-md border px-2 py-1 text-xs font-medium ${
        colors[type] || "text-zinc-400 border-zinc-700"
      }`}
    >
      {type}
    </div>
  );
}
