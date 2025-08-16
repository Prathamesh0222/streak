"use client";

import { Button } from "./ui/button";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, HabitInput } from "@/lib/validate";
import { Activity, Plus, Search, Tag } from "lucide-react";
import { HabitCategoryChart } from "./habit-category";
import { ProgressChart } from "./progress-chart";
import { Habit, PREDEFINED_CATEGORIES } from "@/types/habit-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createHabit as CreateHabitDialog } from "./createHabit";
import { HabitCard } from "./habit-card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useHabits } from "@/hooks/useHabits";
import { HabitTemplates } from "./habit-template";

export const Habits = () => {
  const {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    getCurrentStreak,
    calculateGoalProgress,
    toggleHabitCompletion,
    isStatusUpdating,
    isHabitCompletedToday,
  } = useHabits();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
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
      goalTarget: undefined,
      isGoalActive: false,
    },
  });

  const onSubmit = async (values: HabitInput) => {
    const success = await createHabit(values);
    if (success) {
      form.reset();
      setIsDialogOpen(false);
      setShowCustomCategory(false);
    }
  };

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesStatus =
        statusFilter === "ALL" || habit.status === statusFilter;
      const matchesCategory =
        categoryFilter === "ALL" || habit.category === categoryFilter;
      const matchesSearch =
        searchQuery === "" ||
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description &&
          habit.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [habits, statusFilter, categoryFilter, searchQuery]);

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Habits
      </h2>
      {CreateHabitDialog({
        habits,
        isDialogOpen,
        setIsDialogOpen,
        form,
        onSubmit,
        isLoading: loading,
        showCustomCategory,
        setShowCustomCategory,
      })}
      <Tabs defaultValue="habits" className="w-full">
        <TabsList>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        <TabsContent value="habits">
          <div className="flex gap-4 mb-6 items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {filteredHabits.length === 0 ? (
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
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredHabits.map((habit) => {
                const isCompletedToday = isHabitCompletedToday(habit);
                const completionRate = getCompletionRate(habit);
                const currentStreak = getCurrentStreak(habit);
                const goalProgress = calculateGoalProgress(habit);

                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompletedToday={isCompletedToday}
                    completionRate={completionRate}
                    currentStreak={currentStreak}
                    isLoading={loading}
                    isStatusUpdating={isStatusUpdating}
                    onToggleCompletion={toggleHabitCompletion}
                    onUpdateStatus={updateHabit}
                    onDeleteHabit={deleteHabit}
                    goalProgress={goalProgress}
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
        <TabsContent value="template">
          <div>
            <HabitTemplates />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
