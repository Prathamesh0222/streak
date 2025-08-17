import { Habit } from "@/types/habit-types";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HabitInput } from "@/lib/validate";

export const useHabits = () => {
  const queryClient = useQueryClient();

  const {
    data: habits = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: async (): Promise<Habit[]> => {
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
        )
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
          })
          .catch((error) =>
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
        )
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
          })
          .catch((error) =>
            console.error("Failed to reset daily habits:", error)
          );
      }

      return remainingHabits.map((habit) => {
        if (habitsToReset.some((h) => h.id === habit.id)) {
          return { ...habit, status: "PENDING" as const };
        }
        return habit;
      });
    },
  });

  const toggleHabitCompletion = useMutation({
    mutationFn: async ({
      habitId,
      date,
      isCompleted,
    }: {
      habitId: string;
      date: string;
      isCompleted: boolean;
    }) => {
      await axios.post("/api/habit-logs", {
        habitId,
        date,
        isCompleted: !isCompleted,
      });

      const newStatus = !isCompleted ? "COMPLETED" : "PENDING";
      await axios.patch(`/api/habits/${habitId}`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit updated!");
    },
    onError: () => {
      toast.error("Failed to update habit");
    },
  });

  const updateHabit = useMutation({
    mutationFn: async ({
      habitId,
      status,
    }: {
      habitId: string;
      status: "COMPLETED" | "PENDING" | "ONGOING";
    }) => {
      const response = await axios.patch(`/api/habits/${habitId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Status updated!");
    },
    onError: () => {
      toast.error("Failed to update habit");
    },
  });

  const deleteHabit = useMutation({
    mutationFn: async (habitId: string) => {
      await axios.delete(`/api/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete habit");
    },
  });

  const createHabit = useMutation({
    mutationFn: async (habitData: HabitInput) => {
      const response = await axios.post("/api/habits", habitData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit created successfully!");
    },
    onError: () => {
      toast.error("Failed to create habit");
    },
  });

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

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date().toLocaleDateString("en-CA");
    return (habit.HabitLogs || []).some((log) => {
      const logDate = new Date(log.date).toLocaleDateString("en-CA");
      return logDate === today && log.isCompleted;
    });
  };

  const calculateGoalProgress = (habit: Habit) => {
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
  };

  return {
    habits,
    loading,
    error,
    toggleHabitCompletion: (
      habitId: string,
      date: string,
      isCompleted: boolean
    ) => toggleHabitCompletion.mutate({ habitId, date, isCompleted }),
    updateHabit: (
      habitId: string,
      status: "COMPLETED" | "PENDING" | "ONGOING"
    ) => updateHabit.mutate({ habitId, status }),
    deleteHabit: (habitId: string) => deleteHabit.mutate(habitId),
    createHabit: async (habitData: HabitInput) => {
      return new Promise((resolve) => {
        createHabit.mutate(habitData, {
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        });
      });
    },
    isStatusUpdating: updateHabit.isPending,
    getCurrentStreak,
    calculateGoalProgress,
    isHabitCompletedToday,
  };
};
