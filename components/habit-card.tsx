import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Flame,
  TrendingUp,
  Check,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Calendar,
} from "lucide-react";
import { HabitCardProps } from "@/types/habit-types";
import { Progress } from "@/components/ui/progress";

export const HabitCard = ({
  habit,
  isCompletedToday,
  completionRate,
  currentStreak,
  isLoading,
  isStatusUpdating,
  onToggleCompletion,
  onUpdateStatus,
  goalProgress,
}: HabitCardProps) => {
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

  const getGoalTypeDisplay = (goalType: string) => {
    switch (goalType) {
      case "STREAK":
        return "Day Streak";
      case "WEEKLY_TARGET":
        return "Weekly Target";
      case "MONTHLY_TARGET":
        return "Monthly Target";
      default:
        return "Goal";
    }
  };

  return (
    <div
      className={`border rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col bg-card ${
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
                onToggleCompletion(
                  habit.id,
                  new Date().toLocaleDateString("en-CA"),
                  isCompletedToday
                )
              }
              disabled={isLoading}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
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

          {goalProgress && habit.isGoalActive && (
            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-300">
                    {getGoalTypeDisplay(habit.goalType!)}
                  </span>
                </div>
                <span className="text-sm text-red-300">
                  {goalProgress.currentValue}/{goalProgress.targetValue}
                </span>
              </div>

              <Progress
                value={goalProgress.progressPercentage}
                className="h-2 mb-2"
              />

              <div className="flex items-center justify-between text-xs text-red-600 dark:text-red-400">
                <span>
                  {Math.round(goalProgress.progressPercentage)}% complete
                </span>
                {goalProgress.daysRemaining !== undefined &&
                  goalProgress.daysRemaining > 0 && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{goalProgress.daysRemaining} days left</span>
                    </div>
                  )}
              </div>
            </div>
          )}

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
            onToggleCompletion(
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
          {isCompletedToday ? "✓ Completed Today" : "Mark Complete"}
        </Button>

        <Select
          key={`${habit.id}-${habit.status}`}
          value={habit.status}
          onValueChange={(value: "COMPLETED" | "PENDING" | "ONGOING") =>
            onUpdateStatus(habit.id, value)
          }
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
};
