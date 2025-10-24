import { useHabitLogs } from "@/hooks/useHabitLogs";
import { DateHabits } from "@/types/habit-types";

export const CalendarStreak = ({
  selectedDate,
}: {
  selectedDate: Date | undefined;
}) => {
  const { data: dateHabits } = useHabitLogs(selectedDate);
  const completedHabits =
    dateHabits.habits.filter((habit: DateHabits) => habit.isCompleted) || [];
  const totalStreak =
    completedHabits.length > 0 ? completedHabits.length * 2 : 0;

  return (
    <div className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 rounded-xl bg-card p-1 transition-all duration-300 h-full">
      <div className="p-4 bg-background border border-red-500/20 rounded-lg h-full">
        <div className="text-center flex flex-col justify-center items-center h-full">
          <div className="text-4xl font-bold text-red-500 mb-1">
            {totalStreak}
          </div>
          <div className="text-xs text-muted-foreground font-bold">
            Day Streak
          </div>
        </div>
      </div>
    </div>
  );
};
