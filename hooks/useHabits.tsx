import { Habit } from "@/types/habit-types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { HabitInput } from "@/lib/validate";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);

  const getCurrentStreak = (habit: Habit) => {
    if (!habit.HabitLogs || habit.HabitLogs.length === 0) return 0;

    const sortedLogs = habit.HabitLogs.filter((log) => log.isCompleted).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (sortedLogs.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLog = sortedLogs.find((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    const startDate = todayLog ? today : new Date(sortedLogs[0].date);
    startDate.setHours(0, 0, 0, 0);

    let streak = 0;

    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      const hasLogForDate = sortedLogs.some((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === checkDate.getTime();
      });

      if (hasLogForDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const isHabitCompletedToday = useCallback((habit: Habit) => {
    const today = new Date().toLocaleDateString("en-CA");

    return (
      (habit.HabitLogs || []).some((log) => {
        const logDate = new Date(log.date).toLocaleDateString("en-CA");
        return logDate === today && log.isCompleted;
      }) || false
    );
  }, []);

  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/habits");
      const fetchedHabits: Habit[] = response.data;

      const habitsToRemove = fetchedHabits.filter((habit) => {
        if (!habit.goalTarget) return false;
        const currentStreak = getCurrentStreak(habit);
        return currentStreak >= habit.goalTarget;
      });

      if (habitsToRemove.length > 0) {
        if (habitsToRemove.length === 1) {
          toast.success(
            `Congratulations! You completed "${habitsToRemove[0].title}" challenge!`
          );
        } else {
          toast.success(
            `Congratulations! You completed ${habitsToRemove.length} challenges!`
          );
        }

        Promise.all(
          habitsToRemove.map((habit) => axios.delete(`/api/habits/${habit.id}`))
        ).catch((error) =>
          console.error("Failed to delete completed habits:", error)
        );
      }

      const remainingHabits = fetchedHabits.filter(
        (habit) => !habitsToRemove.some((removed) => removed.id === habit.id)
      );

      const habitsToReset = remainingHabits.filter(
        (habit) =>
          habit.frequency === "DAILY" &&
          habit.status === "COMPLETED" &&
          !isHabitCompletedToday(habit)
      );

      if (habitsToReset.length > 0) {
        Promise.all(
          habitsToReset.map((habit) =>
            axios.patch(`/api/habits/${habit.id}`, { status: "PENDING" })
          )
        ).catch((error) =>
          console.error("Failed to reset daily habits:", error)
        );
      }

      const finalHabits = remainingHabits.map((habit) => {
        if (habitsToReset.some((h) => h.id === habit.id)) {
          return { ...habit, status: "PENDING" as const };
        }
        return habit;
      });

      setHabits(finalHabits);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      toast.error("Failed to fetch habits");
    } finally {
      setIsLoading(false);
    }
  }, [isHabitCompletedToday]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const updateHabit = useCallback(
    async (habitId: string, newStatus: "COMPLETED" | "PENDING" | "ONGOING") => {
      setIsStatusUpdating(true);
      try {
        const response = await axios.patch(`/api/habits/${habitId}`, {
          status: newStatus,
        });
        toast.success("Status updated!");
        setHabits((prevHabits) =>
          prevHabits.map((habit) =>
            habit.id === habitId
              ? { ...response.data.habit, HabitLogs: habit.HabitLogs }
              : habit
          )
        );
      } catch (error) {
        console.error("Error while updating status", error);
        toast.error("Failed to update habit");
      } finally {
        setIsStatusUpdating(false);
      }
    },
    []
  );

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await axios.delete(`/api/habits/${habitId}`);
      setHabits((prevHabits) =>
        prevHabits.filter((habit) => habit.id !== habitId)
      );
      toast.success("Habit deleted successfully!");
    } catch (error) {
      console.error("Failed to delete habit:", error);
      toast.error("Failed to delete habit");
    }
  }, []);

  const createHabitAPI = useCallback(async (habitData: HabitInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/habits", habitData);
      toast.success("Habit created successfully!");
      setHabits((prevHabits) => [response.data.habit, ...prevHabits]);
      return true;
    } catch (error) {
      console.error("Failed to create habit:", error);
      toast.error("Failed to create habit");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateGoalProgress = useCallback(
    (habit: Habit) => {
      const goalTarget = habit.goalTarget || 7;

      const currentValue = getCurrentStreak(habit);
      const targetValue = goalTarget;

      const progressPercentage = Math.min(
        (currentValue / targetValue) * 100,
        100
      );
      const isAchieved = currentValue >= targetValue;

      return {
        currentValue,
        targetValue,
        progressPercentage,
        isAchieved,
      };
    },
    [getCurrentStreak]
  );

  const toggleHabitCompletion = useCallback(
    async (habitId: string, date: string, isCompleted: boolean) => {
      setIsLoading(true);
      try {
        await axios.post("/api/habit-logs", {
          habitId,
          date,
          isCompleted: !isCompleted,
        });

        const newStatus = !isCompleted ? "COMPLETED" : "PENDING";
        await axios.patch(`/api/habits/${habitId}`, {
          status: newStatus,
        });

        toast.success(
          isCompleted ? "Marked as incomplete" : "Marked as complete!"
        );

        setHabits((prevHabits) =>
          prevHabits.map((habit) => {
            if (habit.id === habitId) {
              return { ...habit, status: newStatus };
            }
            return habit;
          })
        );

        return true;
      } catch (error) {
        console.error("Error while updating habit completion:", error);
        toast.error("Failed to update habit completion");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    habits,
    loading,
    fetchHabits,
    createHabit: createHabitAPI,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    isStatusUpdating,
    getCurrentStreak,
    calculateGoalProgress,
    isHabitCompletedToday,
  };
};
