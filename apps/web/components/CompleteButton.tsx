"use client";

import { useSubmitQuest } from "../hooks/useSubmitQuest";
import { useState } from "react";
import { toast } from "sonner";
import { useConnection } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function CompleteButton({
  questId,
  metadata,
}: {
  questId: number;
  metadata: any;
}) {
  const { submitQuest, loading } = useSubmitQuest();
  const [done, setDone] = useState(false);

  const { isConnected } = useConnection();
  const { openConnectModal } = useConnectModal();

  const handleClick = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    try {
      await submitQuest(questId, metadata);
      setDone(true);
      toast.success("Quest submitted! 🎉");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Submission failed");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || done}
      className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-black hover:bg-green-400 disabled:opacity-50"
    >
      {!isConnected
        ? "Connect Wallet"
        : done
          ? "Completed ✅"
          : loading
            ? "Processing..."
            : "Complete Quest"}
    </button>
  );
}
