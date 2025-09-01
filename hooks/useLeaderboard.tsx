import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLeaderboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await axios.get("/api/leaderboard");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    leaderboard: data || [],
    isLoading,
    error,
  };
};
