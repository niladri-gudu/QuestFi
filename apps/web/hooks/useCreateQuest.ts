"use client";

import { useState } from "react";
import { toast } from "sonner";
import { API_URL } from "../lib/api";
import { useConnection } from "wagmi";

export function useCreateQuest() {
  const [loading, setLoading] = useState(false);
  const { address } = useConnection();

  const createQuest = async (payload: any) => {
    const toastId = toast.loading("Creating quest...");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/quests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      toast.success("Quest created!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createQuest, loading };
}
