"use client";

import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HABIT_TEMPLATES, HabitTemplate } from "@/types/template";
import { Plus, Target, Clock, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { useHabits } from "@/hooks/useHabits";

interface HabitTemplateProps {
  onHabitAdded?: () => void;
}

export const HabitTemplates = ({ onHabitAdded }: HabitTemplateProps) => {
  const { habits, createHabit } = useHabits();
  const [loadingTemplates, setLoadingTemplates] = useState<
    Record<string, boolean>
  >({});

  const isTemplateAdded = (template: HabitTemplate) => {
    return habits.some((habit) => habit.title === template.title);
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

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "DAILY":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "WEEKLY":
        return <Target className="w-4 h-4 text-green-500" />;
      case "MONTHLY":
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAddTemplate = async (template: HabitTemplate) => {
    if (isTemplateAdded(template)) {
      toast.error("This habit already exists!");
      return;
    }

    setLoadingTemplates((prev) => ({ ...prev, [template.title]: true }));

    try {
      const habitData = {
        title: template.title,
        description: template.description,
        category: template.category,
        priority: template.priority,
        frequency: template.frequency,
        status: "PENDING" as const,
        goalTarget: template.goalTarget,
      };

      const success = await createHabit(habitData);

      if (success) {
        onHabitAdded?.();
      }
    } catch (error) {
      console.error("Failed to add habit:", error);
    } finally {
      setLoadingTemplates((prev) => {
        const { [template.title]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Habit Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from our curated collection of popular habits to get started
          quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {HABIT_TEMPLATES.map((template) => {
          const isAdded = isTemplateAdded(template);
          const isLoading = loadingTemplates[template.title] || false;

          return (
            <div
              key={template.id}
              className={`border rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col bg-card ${
                isAdded
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                  : "border-red-500/20 hover:border-red-200 dark:hover:border-red-800 duration-300"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {template.title}
                      </h4>
                    </div>
                    <Button
                      onClick={() => handleAddTemplate(template)}
                      disabled={isLoading || isAdded}
                      size="sm"
                      className={`${
                        isAdded
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-red-600 hover:bg-red-500 cursor-pointer"
                      } text-white`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : isLoading ? (
                        <>
                          <Check className="w-4 h-4 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {template.category}
                    </Badge>
                    <Badge className={getPriorityColor(template.priority)}>
                      {template.priority}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      {template.frequency}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      {getFrequencyIcon(template.frequency)}
                      <span className="capitalize">
                        {template.frequency.toLowerCase()}
                      </span>
                    </div>
                    {template.goalTarget && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Target className="w-4 h-4 text-red-500" />
                        <span>{template.goalTarget} day goal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
