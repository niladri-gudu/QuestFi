"use client";

import { useState } from "react";
import { useConnection, usePublicClient, useSendTransaction } from "wagmi";
import { toast } from "sonner";
import { API_URL } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSignMessage } from "wagmi";

type Metadata = {
  contractAddress?: string;
  minValue?: string;
  message?: string;
};

export function useSubmitQuest() {
  const { address } = useConnection();
  const publicClient = usePublicClient();
  const { mutateAsync: sendTx } = useSendTransaction();
  const { mutateAsync: signMessage } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const submitQuest = async (questId: string, metadata: Metadata) => {
    if (!address) throw new Error("Wallet not connected");

    const toastId = toast.loading("Sending transaction...");

    if (
      !metadata?.message &&
      !(metadata?.contractAddress && metadata?.minValue)
    ) {
      throw new Error("Invalid quest metadata");
    }

    try {
      setLoading(true);

      let txHash: string | undefined;
      let signature: string | undefined;

      if (metadata.contractAddress && metadata.minValue) {
        if (!publicClient) throw new Error("Public client not ready");

        toast.loading("Sending transaction...", { id: toastId });

        txHash = await sendTx({
          to: metadata.contractAddress as `0x${string}`,
          value: BigInt(metadata.minValue),
        });

        toast.loading("Waiting for confirmation ⛏️", { id: toastId });

        await publicClient.waitForTransactionReceipt({ hash: txHash });
      }

      if (metadata.message) {
        toast.loading("Signing message...", { id: toastId });

        signature = await signMessage({
          message: metadata.message,
        });
      }

      toast.loading("Verifying quest...", { id: toastId });

      const res = await fetch(`${API_URL}/quests/${questId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          txHash,
          signature,
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
