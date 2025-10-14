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
        const next = { ...prev };
        delete next[template.title];
        return next;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Habit Templates
        </h2>
        <p className="text-muted-foreground">
          Choose from our curated collection of popular habits to get started
          quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HABIT_TEMPLATES.map((template) => {
          const isAdded = isTemplateAdded(template);
          const isLoading = loadingTemplates[template.title] || false;

          return (
            <div
              key={template.id}
              className={`border rounded-xl p-1 transition-all duration-300 h-full ${
                isAdded
                  ? "border-red-500/30 bg-red-50 dark:bg-red-950/20 hover:border-red-400 dark:hover:border-red-700"
                  : "border-red-500/20 bg-card hover:border-red-200 dark:hover:border-red-800"
              }`}
            >
              <div
                className={`p-6 bg-background border rounded-lg h-full flex flex-col ${
                  isAdded ? "border-red-500/20" : "border-red-500/20"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-semibold text-foreground">
                      {template.title}
                    </h4>
                    <Button
                      onClick={() => handleAddTemplate(template)}
                      disabled={isLoading || isAdded}
                      size="sm"
                      className={`${
                        isAdded
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      } text-white shadow-sm flex-shrink-0`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : isLoading ? (
                        <>
                          <Clock className="w-4 h-4 mr-1 animate-spin" />
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

                  <p className="text-muted-foreground text-sm">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-red-500/20 text-foreground bg-muted"
                    >
                      {template.category}
                    </Badge>
                    <Badge className={getPriorityColor(template.priority)}>
                      {template.priority}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
                      {template.frequency}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm pt-2 border-t border-red-500/10">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getFrequencyIcon(template.frequency)}
                      <span className="capitalize font-medium">
                        {template.frequency.toLowerCase()}
                      </span>
                    </div>
                    {template.goalTarget && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="w-4 h-4 text-red-500" />
                        <span className="font-medium">
                          {template.goalTarget} day goal
                        </span>
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
