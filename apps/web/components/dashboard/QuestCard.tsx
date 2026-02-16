"use client";

import { useEffect, useState } from "react";
import CompleteButton from "../CompleteButton";

export default function QuestCard({
  quest,
  completed,
}: {
  quest: any;
  completed: boolean;
}) {
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const hash = quest.metadataHash.replace("ipfs://", "");
        const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
        const json = await res.json();
        setMetadata(json);
      } catch (err) {
        console.error("IPFS load failed", err);
      }
    };

    load();
  }, [quest.metadataHash]);

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        completed
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-zinc-800 bg-zinc-900 hover:border-emerald-500/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{quest.description}</p>
        </div>

        <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 border border-emerald-500/30">
          +{quest.xpReward} XP
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex items-center justify-between">
        <QuestTypeBadge type={quest.type} />

        {completed ? (
          <span className="text-sm font-semibold text-emerald-400">
            Completed ✅
          </span>
        ) : (
          <CompleteButton questId={quest.id} metadata={metadata} />
        )}
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
