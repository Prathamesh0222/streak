import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useHabitLogs = (date: Date | undefined) => {
  return useQuery({
    queryKey: ["habit-logs", date?.toISOString().split("T")[0]],
    queryFn: async () => {
      if (!date) {
        throw new Error("Date is required");
      }

      const dateStr = date.toLocaleDateString("en-CA");
      const response = await axios.get(`/api/habit-logs?date=${dateStr}`);
      return response.data;
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
