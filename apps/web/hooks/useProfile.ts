import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api";

export function useProfile(wallet?: string) {
  return useQuery({
    queryKey: ["profile", wallet],
    enabled: !!wallet,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/${wallet}`);
      return res.json();
    },
  });
}
