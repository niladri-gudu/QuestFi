import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api";

export const useLeaderboard = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["leaderboard", page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/users/leaderboard?page=${page}&limit=${limit}`,
      );

      if (!res.ok) throw new Error("Failed to fetch leaderboard");

      return res.json();
    },

    staleTime: 1000 * 60,
  });
};
