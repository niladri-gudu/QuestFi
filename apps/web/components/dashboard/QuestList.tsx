"use client";

import { useQuests } from "../../hooks/useQuests";
import QuestCard from "./QuestCard";

export default function QuestList() {
  const { data, isLoading, error } = useQuests();

  if (isLoading) return <Skeleton />;

  if (error) return <ErrorBox />;

  const activeQuests = data?.filter((q: any) => q.isActive);

  if (!activeQuests?.length) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
        No active quests yet 🚀
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">🔥 Active Quests</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((quest: any) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
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
