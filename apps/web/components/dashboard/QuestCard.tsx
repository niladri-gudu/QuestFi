"use client";

import { CheckCircle2 } from "lucide-react";
import CompleteButton from "../CompleteButton";
import { useEffect, useState } from "react";

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
        const res = await fetch(`https://ipfs.io/ipfs/${hash}`);
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
      className={`group relative overflow-hidden rounded-xl border p-4 md:p-5 transition-all duration-300 ${
        completed
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
            {quest.title}
          </h3>
          <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed line-clamp-2 md:line-clamp-none">
            {quest.description}
          </p>
        </div>

        <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 whitespace-nowrap bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
          +{quest.xpReward} XP
        </span>
      </div>

      <div className="mt-4 md:mt-6 flex items-center justify-between border-t border-zinc-800/50 pt-4">
        <QuestTypeBadge type={quest.type} />
        <div className="scale-90 md:scale-100 origin-right">
          {completed ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <CheckCircle2 size={14} />
              <span>Complete</span>
            </div>
          ) : (
            <CompleteButton questId={quest.id} metadata={metadata} />
          )}
        </div>
      </div>
    </div>
  );
}
function QuestTypeBadge({ type }: { type: string }) {
  const styles: any = {
    TX: "bg-blue-500/10 text-blue-400 border-blue-400/20",
    SIGN: "bg-violet-500/10 text-violet-400 border-violet-400/20",
    MULTI: "bg-orange-500/10 text-orange-400 border-orange-400/30",
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-black border uppercase ${styles[type] || "border-zinc-800 text-zinc-500"}`}
    >
      {type}
    </span>
  );
}
