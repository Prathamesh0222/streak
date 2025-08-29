import { Habit } from "@/types/habit-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface WeeklyInsight {
  title: string;
  description: string;
  type: "achievement" | "pattern" | "prediction" | "recommendation";
  priority: "high" | "medium" | "low";
}

interface AIInsightsResponse {
  insights: WeeklyInsight[];
  weekRange: string;
  cached: boolean;
}

export const useInsights = () => {
  const queryClient = useQueryClient();

  const {
    data: insightsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: async (): Promise<AIInsightsResponse> => {
      const response = await axios.get("/api/ai-insights");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7,
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async (habits: Habit[]) => {
      const response = await axios.post("/api/ai-insights", { habits });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["ai-insights"], data);
    },
    onError: (error) => {
      console.error("Failed to generate insights:", error);
    },
  });

  const refreshInsights = (habits: Habit[]) => {
    generateInsightsMutation.mutate(habits);
  };

  return {
    insights: insightsData?.insights || [],
    weekRange: insightsData?.weekRange || "",
    isCached: insightsData?.cached || false,
    isLoading,
    error,
    refreshInsights,
    isGenerating: generateInsightsMutation.isPending,
    generateError: generateInsightsMutation.error,
  };
};
