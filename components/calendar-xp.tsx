"use client";

import { useHabitLogs } from "@/hooks/useHabitLogs";
import { calculateHabitXp, DateHabits } from "@/types/habit-types";

export const CalendarXp = ({
  selectedDate,
}: {
  selectedDate: Date | undefined;
}) => {
  const { data: dateHabits } = useHabitLogs(selectedDate);

  const totalXp =
    dateHabits?.habits
      .filter((habit: DateHabits) => habit.isCompleted)
      .reduce(
        (sum: number, habit: DateHabits) =>
          sum + calculateHabitXp(habit.habit.priority),
        0
      ) || 0;

  return (
    <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 h-full">
      <div className="p-4 bg-background border border-red-500/20 rounded-lg h-full">
        <div className="text-center flex flex-col justify-center h-full">
          <div className="text-4xl font-bold text-red-500 mb-1">+{totalXp}</div>
          <div className="text-xs text-muted-foreground font-bold">
            XP Earned
          </div>
        </div>
      </div>
    </div>
  );
};
