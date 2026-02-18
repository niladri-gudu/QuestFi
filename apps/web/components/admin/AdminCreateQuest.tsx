"use client";

import { useState } from "react";
import { useCreateQuest } from "../../hooks/useCreateQuest";
import { PlusCircle, Database, Hash, FileText, Send } from "lucide-react";

export default function AdminCreateQuest() {
  const { createQuest, loading } = useCreateQuest();

  const [type, setType] = useState<"TX" | "SIGN">("TX");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [xp, setXp] = useState(200);

  const [contract, setContract] = useState("");
  const [value, setValue] = useState("1000000000000000");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const metadata =
      type === "TX"
        ? { contractAddress: contract, minValue: value }
        : { message };

    await createQuest({
      title,
      description: desc,
      type,
      xpReward: xp,
      metadata,
    });
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-6">
        <PlusCircle className="text-emerald-500" size={20} />
        <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Deploy New Quest</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Input 
            label="Quest Title" 
            placeholder="e.g., Verify On-Chain Identity"
            value={title} 
            onChange={setTitle} 
            icon={<FileText size={14} />}
          />
          <Input 
            label="Description" 
            placeholder="What should the user do?"
            value={desc} 
            onChange={setDesc} 
          />
          <Input 
            label="XP Reward" 
            type="number"
            value={xp} 
            onChange={(v) => setXp(Number(v))} 
            icon={<Hash size={14} />}
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Logic Type</label>
            <select
              className="mt-2 w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-sm font-bold text-white outline-hidden focus:border-emerald-500/50 transition-all appearance-none cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="TX">Transaction Quest</option>
              <option value="SIGN">Signature Quest</option>
            </select>
          </div>

          {type === "TX" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                label="Contract Address"
                placeholder="0x..."
                value={contract}
                onChange={setContract}
                icon={<Database size={14} />}
                mono
              />
              <Input 
                label="Min Value (Wei)" 
                value={value} 
                onChange={setValue} 
                mono
              />
            </div>
          )}

          {type === "SIGN" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Input 
                label="Message to Sign" 
                placeholder="I verify that..."
                value={message} 
                onChange={setMessage} 
                icon={<Send size={14} />}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-end pt-6 border-t border-zinc-800">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-8 py-3 font-black uppercase tracking-widest text-black transition-all hover:bg-emerald-400 disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Broadcasting...
            </span>
          ) : (
            <>
              Initialize Quest
              <PlusCircle size={18} className="transition-transform group-hover:rotate-90" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------------- REUSABLE COMPONENTS ----------------

function Input({ label, value, onChange, placeholder, type = "text", icon, mono }: any) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
        {icon && <span className="text-zinc-600">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-sm text-white transition-all outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-zinc-700 ${mono ? 'font-mono' : 'font-medium'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}