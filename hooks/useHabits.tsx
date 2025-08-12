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

      const habitsToReset = fetchedHabits.filter(
        (habit) =>
          habit.frequency === "DAILY" &&
          habit.status === "COMPLETED" &&
          !isHabitCompletedToday(habit)
      );

      if (habitsToReset.length > 0) {
        await Promise.all(
          habitsToReset.map((habit) =>
            axios.patch(`/api/habits/${habit.id}`, { status: "PENDING" })
          )
        );
        const newResponse = await axios.get("/api/habits");
        setHabits(newResponse.data);
      } else {
        setHabits(fetchedHabits);
      }
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      toast.error("Failed to fetch habits");
    } finally {
      setIsLoading(false);
    }
  }, [isHabitCompletedToday]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  useEffect(() => {
    window.addEventListener("focus", fetchHabits);
    return () => {
      window.removeEventListener("focus", fetchHabits);
    };
  }, [fetchHabits]);

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
      if (!habit.isGoalActive || !habit.goalType || !habit.goalTarget) {
        return null;
      }

      const habitLogs = habit.HabitLogs || [];

      let currentValue = 0;
      const targetValue = habit.goalTarget;

      switch (habit.goalType) {
        case "STREAK":
          currentValue = getCurrentStreak(habit);
          break;
        case "WEEKLY_TARGET":
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);
          currentValue = habitLogs.filter((log) => {
            const logDate = new Date(log.date);
            return log.isCompleted && logDate >= weekStart;
          }).length;
          break;
        case "MONTHLY_TARGET":
          const monthStart = new Date();
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);
          currentValue = habitLogs.filter((log) => {
            const logDate = new Date(log.date);
            return log.isCompleted && logDate >= monthStart;
          }).length;
          break;
      }

      const progressPercentage = Math.min(
        (currentValue / targetValue) * 100,
        100
      );
      const isAchieved = currentValue >= targetValue;

      let daysRemaining: number | undefined;
      if (habit.goalDeadline) {
        const deadlineDate = new Date(habit.goalDeadline);
        const today = new Date();
        daysRemaining = Math.ceil(
          (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      return {
        currentValue,
        targetValue,
        progressPercentage,
        isAchieved,
        daysRemaining,
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
        await fetchHabits();
        return true;
      } catch (error) {
        console.error("Error while updating habit completion:", error);
        toast.error("Failed to update habit completion");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchHabits]
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
