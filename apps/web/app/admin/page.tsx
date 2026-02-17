"use client";

import { useAccount } from "wagmi";
import { isAdmin } from "../../lib/admin";
import AdminCreateQuest from "../../components/admin/AdminCreateQuest";
import { Settings, ShieldAlert, Lock } from "lucide-react";

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Gate 
        icon={<Lock size={24} />} 
        title="System Locked" 
        message="Connect administrator wallet to continue." 
      />
    );
  }

  if (!isAdmin(address)) {
    return (
      <Gate 
        icon={<ShieldAlert size={24} />} 
        title="Access Denied" 
        message="Your address is not whitelisted for administrative privileges." 
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      <Header />
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-1">
         <AdminCreateQuest />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
      {/* Background technical grid or glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-inner">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">
            Admin Panel
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-1">
            QuestFi Protocol Management — v1.0.0
          </p>
        </div>
      </div>
    </header>
  );
}

function Gate({ icon, title, message }: { icon: React.ReactNode, title: string, message: string }) {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          {icon}
        </div>
      </div>
      <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
        {title}
      </h2>
      <p className="mt-2 text-sm text-zinc-500 leading-relaxed px-6">
        {message}
      </p>
      <div className="mt-8 h-px w-full bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
    </div>
  );
}