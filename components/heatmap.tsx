import ActivityCalendar from "react-activity-calendar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Habit } from "@/types/habit-types";
import { useTheme } from "next-themes";

export const HeatMap = () => {
  const { data: session } = useSession();
  const [calendarData, setCalendarData] = useState<
    Array<{ date: string; count: number; level: number }>
  >([]);
  const { theme } = useTheme();
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

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 365);

        const fullYearData = [];
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = d.toISOString().split("T")[0];
          const count = habitLogsMap.get(dateStr) || 0;
          fullYearData.push({
            date: dateStr,
            count,
            level: count === 0 ? 0 : Math.min(Math.floor(count / 2) + 1, 4),
          });
        }

        setCalendarData(fullYearData);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
      }
    };

    if (session?.user) {
      fetchHabits();
    }
  }, [session?.user]);

  return (
    <div className="p-1 rounded-xl bg-card border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 mb-2">
      <div className="p-5 bg-background border border-red-500/20 rounded-lg">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">Activity Overview</h3>
          <p className="text-sm text-muted-foreground">
            Your habit completion streak over the past year
          </p>
        </div>
        <div className="w-full overflow-x-auto">
          <ActivityCalendar
            data={
              calendarData.length > 0
                ? calendarData
                : [
                    {
                      date: new Date().toLocaleDateString("en-CA"),
                      count: 0,
                      level: 0,
                    },
                  ]
            }
            theme={{
              light: ["#f3f4f6", "#fecaca", "#fca5a5", "#f87171", "#ef4444"],
              dark: ["#374151", "#eb6464", "#991b1b", "#b91c1c", "#dc2626"],
            }}
            colorScheme={theme === "dark" ? "dark" : "light"}
            showWeekdayLabels
            labels={{
              months: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              totalCount: "{{count}} habits in {{year}}",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
            blockSize={12}
            blockRadius={3}
            blockMargin={2}
          />
        </div>
      </div>
    </div>
  );
};
