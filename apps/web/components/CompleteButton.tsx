"use client";

import { useSubmitQuest } from "../hooks/useSubmitQuest";
import { useState } from "react";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Zap } from "lucide-react";

export default function CompleteButton({
  questId,
  metadata,
}: {
  questId: number;
  metadata: any;
}) {
  const { submitQuest, loading } = useSubmitQuest();
  const { isConnected } = useConnection();
  const { openConnectModal } = useConnectModal();
  const [done, setDone] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    
    try {
      await submitQuest(questId, metadata);
      queryClient.invalidateQueries({ queryKey: ["profile"], exact: false });
      setDone(true);
      toast.success("Quest verified!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Submission failed");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || done}
      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 
        ${done 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default" 
          : "bg-zinc-100 text-black hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
        }`}
    >
      {loading ? (
        <>
          <Loader2 size={12} className="animate-spin" />
          <span>Verifying</span>
        </>
      ) : done ? (
        <>
          <Zap size={12} fill="currentColor" />
          <span>Verified</span>
        </>
      ) : !isConnected ? (
        "Connect Wallet"
      ) : (
        "Start Quest"
      )}
    </button>
  );
}