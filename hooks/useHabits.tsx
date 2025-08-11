import { Habit } from "@/types/habit-types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isStatusUpdating, setIsStatusUpdating] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);

  const isHabitCompletedToday = useCallback((habit: Habit) => {
    const today = new Date().toLocaleDateString("en-CA");

    return (
      habit.HabitLogs.some((log) => {
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

  const createHabit = useCallback(async (habitData: any) => {
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
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    isStatusUpdating,
    isHabitCompletedToday,
  };
};
