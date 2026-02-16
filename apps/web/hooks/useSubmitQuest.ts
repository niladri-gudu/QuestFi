"use client";

import { useState } from "react";
import { useConnection, usePublicClient, useSendTransaction } from "wagmi";
import { toast } from "sonner";
import { API_URL } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

type Metadata = {
  contractAddress: string;
  minValue: string;
};

export function useSubmitQuest() {
  const { address } = useConnection();
  const publicClient = usePublicClient();
  const { mutateAsync } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const submitQuest = async (questId: string, metadata: Metadata) => {
    if (!address) throw new Error("Wallet not connected");
    if (!publicClient) throw new Error("Public client not ready");

    if (!metadata?.contractAddress || !metadata?.minValue) {
      throw new Error("Invalid quest metadata");
    }

    const toastId = toast.loading("Sending transaction...");

    try {
      setLoading(true);

      const hash = await mutateAsync({
        to: metadata.contractAddress as `0x${string}`,
        value: BigInt(metadata.minValue),
      });

      console.log("TX Hash:", hash);

      toast.loading("Waiting for confirmation ⛏️", { id: toastId });

      await publicClient.waitForTransactionReceipt({ hash });

      toast.loading("Verifying quest...", { id: toastId });

      const res = await fetch(`${API_URL}/quests/${questId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          txHash: hash,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Backend verification failed");
      }

      toast.success("Quest completed! XP awarded ⚡", {
        id: toastId,
        description: "Your NFT badge will appear shortly 🎖",
      });

      queryClient.invalidateQueries({ queryKey: ["profile"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["activeQuests"],
        exact: false,
      });

      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Quest failed", {
        id: toastId,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitQuest, loading };
}
