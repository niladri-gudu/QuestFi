"use client";

import { useConnection } from "wagmi";
import { useState } from "react";
import { parseEther } from "viem";
import { API_URL } from "../lib/api";

type Metadata = {
  contractAddress: string;
  minValue: string;
};

export function useSubmitQuest() {
  const { address } = useConnection();
  const [loading, setLoading] = useState(false);

  const submitQuest = async (questId: string, metadata: Metadata) => {
    if (!address) throw new Error("Wallet not connected");

    try {
      setLoading(true);

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: metadata.contractAddress,
            value: `0x${parseEther(metadata.minValue).toString(16)}`,
          },
        ],
      });

      console.log("TX Hash:", tx);

      await waitFortx(tx);

      await fetch(`${API_URL}/quests/${questId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: address,
          txHash: tx,
        }),
      });

      return tx;
    } finally  {
        setLoading(false);
    }
  };

  return { submitQuest, loading };
}

async function waitFortx(txHash: string) {
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            const receipt = await window.ethereum.request({
                method: "eth_getTransactionReceipt",
                params: [txHash],
            })

            if (receipt) {
                clearInterval(interval);
                resolve(receipt);
            }
        }, 2000)
    })
}