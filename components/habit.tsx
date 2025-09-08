"use client";

import { Button } from "./ui/button";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, HabitInput } from "@/lib/validate";
import {
  Activity,
  Plus,
  Search,
  Tag,
  Target,
  BookOpen,
  Bot,
  Lock,
  Crown,
} from "lucide-react";
import { HabitSuggestion, PREDEFINED_CATEGORIES } from "@/types/habit-types";
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
import { AiAssistant } from "./ai-assistant";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "./ui/badge";
import axios from "axios";

export const Habits = () => {
  const {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    isStatusUpdating,
  } = useHabits();

  const {
    isFreePlan,
    isPremium,
    limits,
    isLoading: subscriptionLoading,
  } = useSubscription();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("habits");

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
    },
  });

  const canCreateHabit = useMemo(() => {
    if (isPremium) return true;
    if (!limits) return false;
    return habits.length < limits.maxHabits;
  }, [isPremium, limits, habits.length]);

  const habitLimitReached = !canCreateHabit && isFreePlan;

  const onSubmit = async (values: HabitInput) => {
    if (habitLimitReached) {
      return;
    }

    const success = await createHabit(values);
    if (success) {
      form.reset();
      setIsDialogOpen(false);
      setShowCustomCategory(false);
    }
  };

  const handleAIHabitCreation = (suggestion: HabitSuggestion) => {
    if (habitLimitReached) {
      return;
    }

    form.setValue("title", suggestion.title);
    form.setValue("description", suggestion.description);
    form.setValue("category", suggestion.category);
    form.setValue("frequency", suggestion.frequency);
    form.setValue("priority", suggestion.priority);
    if (suggestion.goalTarget) {
      form.setValue("goalTarget", suggestion.goalTarget);
    }
    setIsDialogOpen(true);
  };

  const handleCreateHabitClick = () => {
    if (habitLimitReached) {
      return;
    }
    setIsDialogOpen(true);
  };

  const handleUpgrade = async () => {
    try {
      const { data } = await axios.post("/api/payment/create-checkout", {
        planId: "pro_monthly",
      });
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Error while upgrading", error);
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

  const tabs = [
    { id: "habits", name: "My Habits", icon: Target },
    { id: "ai-assistant", name: "AI Assistant", icon: Bot },
    { id: "template", name: "Templates", icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-medium">Habits</h2>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isPremium ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isPremium ? (
              <>
                <Crown className="h-3 w-3" />
                Premium
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Free Plan
              </>
            )}
          </Badge>

          {isFreePlan && limits && (
            <Badge
              variant={habitLimitReached ? "destructive" : "outline"}
              className="text-xs"
            >
              {habits.length}/{limits.maxHabits} habits
            </Badge>
          )}

          {CreateHabitDialog({
            isDialogOpen,
            setIsDialogOpen,
            form,
            onSubmit,
            isLoading: loading,
            showCustomCategory,
            setShowCustomCategory,
            disabled: habitLimitReached,
          })}
        </div>
      </div>

      {habitLimitReached && !subscriptionLoading && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800 dark:text-red-400 mb-1">
                Habit Limit Reached
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                You&apos;ve reached the maximum of {limits?.maxHabits} habits
                for free users. Upgrade to Premium for unlimited habits and more
                features.
              </p>
              <Button
                size="sm"
                onClick={handleUpgrade}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Crown className="h-3 w-3 mr-1" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-red-500 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComponent className="h-3 w-3" />
              {tab.name}
              {tab.id === "habits" && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    isActive ? "bg-red-600" : "bg-background"
                  }`}
                >
                  {habits.length}
                  {isFreePlan && limits && `/${limits.maxHabits}`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "habits" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-red-500/20 focus:border-red-500"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[160px] border-red-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-red-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="w-[180px] border-red-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-red-500" />
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
            <div className="bg-card border border-red-500/10 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ||
                statusFilter !== "ALL" ||
                categoryFilter !== "ALL"
                  ? "No habits match your filters"
                  : "No habits created yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery ||
                statusFilter !== "ALL" ||
                categoryFilter !== "ALL"
                  ? "Try adjusting your search or filters to find habits."
                  : "Create your first habit to get started on your journey to better habits!"}
              </p>
              {!searchQuery &&
                statusFilter === "ALL" &&
                categoryFilter === "ALL" &&
                !habitLimitReached && (
                  <Button
                    onClick={handleCreateHabitClick}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Habit
                  </Button>
                )}
              {habitLimitReached && (
                <Button
                  onClick={handleUpgrade}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Create More
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                  <Target className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-medium">Your Habits</h3>
                {isFreePlan && limits && (
                  <span className="text-xs text-muted-foreground">
                    ({habits.length}/{limits.maxHabits} used)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isLoading={loading}
                    isStatusUpdating={isStatusUpdating}
                    onToggleCompletion={toggleHabitCompletion}
                    onUpdateStatus={updateHabit}
                    onDeleteHabit={deleteHabit}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "template" && (
        <div className="space-y-6">
          {habitLimitReached && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                <Lock className="h-4 w-4 inline mr-1" />
                You&apos;ve reached your habit limit. Upgrade to add more habits
                from templates.
              </p>
            </div>
          )}
          <HabitTemplates
            onHabitAdded={() => {
              setActiveTab("habits");
            }}
          />
        </div>
      )}

      <div className="hidden md:block">
        {activeTab === "ai-assistant" && (
          <div className="space-y-6">
            {habitLimitReached && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  <Lock className="h-4 w-4 inline mr-1" />
                  You&apos;ve reached your habit limit. Upgrade to create
                  AI-suggested habits.
                </p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-medium">AI Habit Assistant</h3>
            </div>
            <AiAssistant
              habits={habits}
              onCreateHabit={handleAIHabitCreation}
              disabled={habitLimitReached}
            />
          </div>
        )}
      </div>
    </div>
  );
};
