import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api";

export function useQuests() {
  return useQuery({
    queryKey: ["quests"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/quests`);
      if (!res.ok) throw new Error("Failed to fetch quests");
      return res.json();
    },
    staleTime: 1000 * 30,
  });
}
