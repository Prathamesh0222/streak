"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, HabitInput } from "@/lib/validate";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Flame,
  TrendingUp,
  Check,
} from "lucide-react";
import { HabitCategoryChart } from "./habit-category";
import { ProgressChart } from "./progress-chart";
import { Habit } from "@/types/habit-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createHabit } from "./createHabit";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "ONGOING":
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "PENDING":
        return (
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return (
          <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
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
                  <div
                    key={habit.id}
                    className={`border rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col ${
                      isCompletedToday
                        ? "border-red-500 border shadow-md"
                        : "border-red-500/20 hover:border-red-200 dark:hover:border-red-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {habit.title}
                            </h4>
                            {isCompletedToday && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                ✓ Today
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleToggleHabitCompletion(
                                habit.id,
                                new Date().toLocaleDateString("en-CA"),
                                isCompletedToday
                              )
                            }
                            disabled={isLoading}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              isCompletedToday
                                ? "bg-red-500 border-red-500 text-white"
                                : "border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400"
                            }`}
                          >
                            {isCompletedToday && <Check className="w-4 h-4" />}
                          </button>
                        </div>

                        {habit.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {habit.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {habit.category && (
                            <Badge
                              variant="outline"
                              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {habit.category}
                            </Badge>
                          )}
                          <Badge className={getPriorityColor(habit.priority)}>
                            {habit.priority}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                            {habit.frequency}
                          </Badge>
                        </div>
                        <div className="flex items-center mb-3">
                          {getStatusIcon(habit.status)}
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                            {habit.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Flame className="w-4 h-4 text-red-500" />
                            <span>{currentStreak} day streak</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span>{completionRate}% this week</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                      <Button
                        variant={isCompletedToday ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleToggleHabitCompletion(
                            habit.id,
                            new Date().toLocaleDateString("en-CA"),
                            isCompletedToday
                          )
                        }
                        disabled={isLoading}
                        className={
                          isCompletedToday
                            ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer"
                            : "dark:hover:text-gray-300 cursor-pointer"
                        }
                      >
                        {isCompletedToday
                          ? "✓ Completed Today"
                          : "Mark Complete"}
                      </Button>

                      <Select
                        key={`${habit.id}-${habit.status}`}
                        value={habit.status}
                        onValueChange={(
                          value: "COMPLETED" | "PENDING" | "ONGOING"
                        ) => handleUpdateHabit(habit.id, value)}
                        disabled={isStatusUpdating || isCompletedToday}
                      >
                        <SelectTrigger className="w-32 h-9 cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
