"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnection } from "wagmi";
import { useProfile } from "../hooks/useProfile";

export default function Page() {
  const { address, isConnected } = useConnection();
  const { data, isLoading, error } = useProfile(address);

  return (
    <main className="p-10 space-y-4">
      <ConnectButton />

      {isConnected && <div>Wallet: {address}</div>}

      {isLoading && <div>Loading profile...</div>}

      {error && <div className="text-red-500">Error loading profile</div>}

      {data && (
        <pre className="bg-black text-green-400 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
