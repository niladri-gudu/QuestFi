import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api";

export const useActiveQuests = (address: string) => {
  return useQuery({
    queryKey: ["activeQuests", address],
    queryFn: async () => {
      const url = address
        ? `${API_URL}/quests/active?wallet=${address}`
        : `${API_URL}/quests/active`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch active quests");
      return res.json();
    },
  });
};
