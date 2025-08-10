"use client";

import { Button } from "./ui/button";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, HabitInput } from "@/lib/validate";
import axios from "axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { HabitCategoryChart } from "./habit-category";
import { ProgressChart } from "./progress-chart";
import { Habit } from "@/types/habit-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createHabit } from "./createHabit";
import { HabitCard } from "./habit-card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const form = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "PENDING",
      priority: "MEDIUM",
      frequency: "DAILY",
    },
  });

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const result =
      habit.HabitLogs?.some((log) => {
        const logDate = new Date(log.date);
        const isToday = logDate >= todayStart && logDate < todayEnd;
        return isToday && log.isCompleted;
      }) || false;

    return result;
  };

  const fetchHabits = useCallback(async () => {
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
        return;
      }

      setHabits(fetchedHabits);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      toast.error("Failed to fetch habits");
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  useEffect(() => {
    window.addEventListener("focus", fetchHabits);
    return () => {
      window.removeEventListener("focus", fetchHabits);
    };
  }, [fetchHabits]);

  const onSubmit = async (values: HabitInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/habits", values);
      toast.success("Habit created successfully!");
      setHabits([response.data.habit, ...habits]);
      form.reset();
      setIsDialogOpen(false);
      setShowCustomCategory(false);
    } catch (error) {
      console.error("Failed to create habit:", error);
      toast.error("Failed to create habit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHabit = async (
    habitId: string,
    newStatus: "COMPLETED" | "PENDING" | "ONGOING"
  ) => {
    setIsStatusUpdating(true);
    try {
      const response = await axios.patch(`/api/habits/${habitId}`, {
        status: newStatus,
      });
      toast.success("Status updated!");
      setHabits(
        habits.map((habit) =>
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
  };

  const getCompletionRate = (habit: Habit) => {
    if (!habit.HabitLogs || habit.HabitLogs.length === 0) return 0;

    const last7Days = habit.HabitLogs.filter((log) => {
      const logDate = new Date(log.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return logDate >= sevenDaysAgo;
    });

    if (last7Days.length === 0) return 0;

    const completedLogs = last7Days.filter((log) => log.isCompleted);
    return Math.round((completedLogs.length / last7Days.length) * 100);
  };

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

  const handleToggleHabitCompletion = async (
    habitId: string,
    date: string,
    isCompleted: boolean
  ) => {
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
    } catch (error) {
      console.error("Error while updating habit completion:", error);
      toast.error("Failed to update habit completion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Habits
      </h2>
      {createHabit({
        habits,
        isDialogOpen,
        setIsDialogOpen,
        form,
        onSubmit,
        isLoading,
        showCustomCategory,
        setShowCustomCategory,
      })}
      <Tabs defaultValue="habits" className="w-full">
        <TabsList>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="habits">
          <div className="flex">
            <Input />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No habits created yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first habit to get started on your journey!
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {habits.map((habit) => {
                const isCompletedToday = isHabitCompletedToday(habit);
                const completionRate = getCompletionRate(habit);
                const currentStreak = getCurrentStreak(habit);

                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={isCompletedToday}
                    completionRate={completionRate}
                    currentStreak={currentStreak}
                    isLoading={isLoading}
                    isStatusUpdating={isStatusUpdating}
                    onToggleCompletion={handleToggleHabitCompletion}
                    onUpdateStatus={handleUpdateHabit}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-3 mb-4">
            <HabitCategoryChart habits={habits} />
            <ProgressChart habits={habits} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
