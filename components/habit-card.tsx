import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Flame,
  TrendingUp,
  Check,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { HabitCardProps } from "@/types/habit-types";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export const HabitCard = ({
  habit,
  isLoading,
  onToggleCompletion,
  onDeleteHabit,
}: HabitCardProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteHabit = async () => {
    setIsDeleting(true);
    await onDeleteHabit(habit.id);
    setOpen(false);
    setIsDeleting(false);
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
    <div
      className={`border rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col bg-card ${
        habit.completedToday
          ? "border-red-500 bg-red-50 dark:bg-red-950/20"
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
            </div>
            <button
              onClick={() =>
                onToggleCompletion(
                  habit.id,
                  new Date().toLocaleDateString("en-CA"),
                  habit.completedToday
                )
              }
              disabled={isLoading}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                habit.completedToday
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400"
              }`}
            >
              {habit.completedToday && <Check className="w-4 h-4" />}
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
          {habit.goalProgress && (
            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-300">
                    {"goal"}
                  </span>
                </div>
                <span className="text-sm text-red-300">
                  {habit.goalProgress.currentValue}/
                  {habit.goalProgress.targetValue}
                </span>
              </div>

              <Progress
                value={habit.goalProgress.progressPercentage}
                className="h-2 mb-2"
              />

              <div className="flex items-center justify-between text-xs text-red-600 dark:text-red-400">
                <span>
                  {Math.round(habit.goalProgress.progressPercentage)}% complete
                </span>
                {habit.goalProgress.currentValue !== undefined &&
                  habit.goalProgress.currentValue > 0 && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {habit.goalProgress.targetValue -
                          habit.goalProgress.currentValue}{" "}
                        days left
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Flame className="w-4 h-4 text-red-500" />
              <span>{habit.currentStreak} day streak</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>{habit.totalCompletions} completions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
          {habit.status}
        </Badge>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="cursor-pointer text-red-500 px-2 hover:bg-red-600 py-2 rounded-md hover:text-white transition-colors">
              <Trash className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Habit
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>"{habit.title}"</strong>
                ?
                <br />
                <span className="text-red-600 dark:text-red-400 text-sm mt-2 block">
                  This action cannot be undone.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteHabit}
                disabled={isDeleting}
                className="cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
