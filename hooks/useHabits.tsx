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
        return habit.goalProgress.isAchieved;
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
          !habit.completedToday
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

      if (!isCompleted) {
        try {
          await axios.post("/api/achievements/check", {
            habitId,
            action: "complete",
          });
        } catch (error) {
          console.error("Failed to check achievements:", error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
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

      try {
        await axios.post("/api/achievements/check", {
          habitId: response.data.id,
          action: "create",
        });
      } catch (error) {
        console.error("Failed to check achievements:", error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Habit created successfully!");
    },
    onError: () => {
      toast.error("Failed to create habit");
    },
  });

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
  };
};
