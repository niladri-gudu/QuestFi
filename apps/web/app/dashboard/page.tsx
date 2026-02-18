"use client";

import ProfileHero from "../../components/dashboard/ProfileHero";
import QuestList from "../../components/dashboard/QuestList";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-emerald-500/30">
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12 space-y-8 md:space-y-12">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">
            Explorer <span className="text-emerald-500 pl-1 md:pl-2 not-italic">Dashboard</span>
          </h1>
          <p className="text-[10px] md:text-sm text-zinc-500 uppercase tracking-widest font-medium">
            Track your progress and verify on-chain actions
          </p>
        </header>

        <ProfileHero />
        
        <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
        
        <QuestList />
      </main>
    </div>
  );
}