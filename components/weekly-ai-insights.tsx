"use client";

import { Brain, Loader2, RefreshCw, Calendar } from "lucide-react";
import { Habit } from "@/types/habit-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInsights } from "@/hooks/useInsights";

interface WeeklyAIInsightsProps {
  habits: Habit[];
}

export function WeeklyAIInsights({ habits }: WeeklyAIInsightsProps) {
  const {
    insights,
    weekRange,
    isCached,
    isLoading,
    error,
    refreshInsights,
    isGenerating,
    generateError,
  } = useInsights();

  const handleRefresh = () => {
    refreshInsights(habits);
  };

  if (!habits || habits.length === 0) return null;

  return (
    <Card className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">Weekly AI Insights</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {weekRange}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isGenerating}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isLoading || isGenerating) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-red-500" />
            <span className="ml-2 text-sm text-muted-foreground">
              {insights.length > 0
                ? "Refreshing insights..."
                : "Generating weekly insights..."}
            </span>
          </div>
        )}

        {(error || generateError) && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            {error?.message ||
              generateError?.message ||
              "Failed to load insights"}
          </div>
        )}

        {!isLoading &&
          !isGenerating &&
          !error &&
          !generateError &&
          insights.length > 0 && (
            <>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      insight.priority === "high"
                        ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                        : insight.priority === "medium"
                        ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                        : "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    }`}
                  >
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>

              {isCached && (
                <div className="text-xs text-muted-foreground text-center pt-2">
                  Cached insights • Refresh for new analysis
                </div>
              )}
            </>
          )}

        {!isLoading &&
          !isGenerating &&
          !error &&
          !generateError &&
          insights.length === 0 && (
            <div className="text-center py-8">
              <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                No weekly insights available yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isGenerating}
              >
                Generate First Insights
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
