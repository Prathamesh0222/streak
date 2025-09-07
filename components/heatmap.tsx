import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Habit } from "@/types/habit-types";

export const HeatMap = () => {
  const { data: session } = useSession();
  const [calendarData, setCalendarData] = useState<
    Array<{ date: string; count: number }>
  >([]);
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get("/api/habits");
        const fetchedHabits: Habit[] = response.data;

        const habitLogsMap = new Map<string, number>();

        fetchedHabits.forEach((habit) => {
          habit.HabitLogs.forEach((log) => {
            const dateKey = new Date(log.date).toISOString().split("T")[0];
            const currentCount = habitLogsMap.get(dateKey) || 0;
            if (log.isCompleted) {
              habitLogsMap.set(dateKey, currentCount + 1);
            }
          });
        });

        const calendarDataArray = Array.from(habitLogsMap.entries()).map(
          ([date, count]) => ({
            date,
            count,
          })
        );

        setCalendarData(calendarDataArray);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      }
    };

    if (session?.user) {
      fetchHabits();
    }
  }, [session?.user]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);
  return (
    <div className="p-6 rounded-xl bg-card border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Activity Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Your habit completion streak over the past year
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] w-full">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={calendarData}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              if (value.count >= 5) return "color-scale-4";
              if (value.count >= 3) return "color-scale-3";
              if (value.count >= 1) return "color-scale-2";
              return "color-scale-1";
            }}
            titleForValue={(value) => {
              if (!value) return "No data";
              return `${value.count} habit${
                value.count === 1 ? "" : "s"
              } completed on ${value.date}`;
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-200 dark:bg-red-900 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-300 dark:bg-red-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-400 dark:bg-red-700 rounded-sm"></div>
            <div className="w-3 h-3 bg-red-500 dark:bg-red-600 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
        <div className="text-sm text-muted-foreground">Last 12 months</div>
      </div>
    </div>
  );
};
