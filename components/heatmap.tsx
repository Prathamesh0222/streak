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
    <div className="p-4 border rounded-xl">
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
      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-3 h-3 bg-red-200 dark:bg-red-900"></div>
          <div className="w-3 h-3 bg-red-300 dark:bg-red-800"></div>
          <div className="w-3 h-3 bg-red-400 dark:bg-red-700"></div>
          <div className="w-3 h-3 bg-red-500 dark:bg-red-600"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
