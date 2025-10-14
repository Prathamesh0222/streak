"use client";

import { useSession } from "next-auth/react";
import { HeatMap } from "./heatmap";
import { WeeklyStats } from "./weekly-stats";
import { HabitCategoryChart } from "./habit-category";
import { ProgressChart } from "./progress-chart";
import { useHabits } from "@/hooks/useHabits";
import { UserLevelIcon } from "./user-level-icons";
import { WeeklyAIInsights } from "./weekly-ai-insights";
import { QuoteOfDay } from "./quote-of-day";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export const Dashboard = () => {
  const { data: session } = useSession();
  const { habits, loading } = useHabits();

  return (
    <>
      <section className="mt-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          {getGreeting()},{" "}
          <span className="text-red-500 underline underline-offset-4">
            {session?.user?.name?.split(" ")[0] ?? "there"}
          </span>
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Ready to build some{" "}
          <span className="text-red-500 underline underline-offset-4">
            streaks
          </span>{" "}
          today?
        </p>
        <div className="grid grid-cols-3 gap-2 mt-8 mb-12 md:mb-0">
          <div>
            <HeatMap />
            <UserLevelIcon />
          </div>
          <div>
            <ProgressChart habits={habits} />
            <HabitCategoryChart habits={habits} />
          </div>
          <div>
            <QuoteOfDay />
            <WeeklyStats habits={habits} loading={loading} />
            <WeeklyAIInsights habits={habits} />
          </div>
        </div>
      </section>
    </>
  );
};
