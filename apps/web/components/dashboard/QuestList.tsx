"use client";

import { useActiveQuests } from "../../hooks/useActiveQuests";
import { useConnection } from "wagmi";
import QuestCard from "./QuestCard";

export default function QuestList() {
  const { address } = useConnection();
  const { data, isLoading, error } = useActiveQuests(address as string);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBox />;

  const active = data?.filter((q) => !q.completed);
  const completed = data?.filter((q) => q.completed);

  if (!data?.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
        No quests yet 🚀
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {active?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-white pt-6">🔥 Active Quests</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {active.map((quest: any) => (
              <QuestCard key={quest.id} quest={quest} completed={false} />
            ))}
          </div>
        </>
      )}

      {completed?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-emerald-400 pt-6">
            ✅ Completed
          </h2>

          <div className="grid gap-4 md:grid-cols-2 opacity-80">
            {completed.map((quest: any) => (
              <QuestCard key={quest.id} quest={quest} completed />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-zinc-900" />
      ))}
    </div>
  );
}

function ErrorBox() {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
      Failed to load quests
    </div>
  );
}
