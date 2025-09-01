import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
} from "lucide-react";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import { DateHabits } from "@/types/habit-types";

export const CalendarTrack = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { data: dateHabits, isLoading, error } = useHabitLogs(selectedDate);

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const disableFutureDates = (date: Date) => {
    return date > today;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-orange-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const completionRate =
    dateHabits?.totalHabits > 0
      ? Math.round((dateHabits.completedHabits / dateHabits.totalHabits) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <CalendarIcon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-medium">Habit Tracker</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-red-500/10 rounded-lg p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disableFutureDates}
              className="w-full mx-auto"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-1">
              {selectedDate ? formatDate(selectedDate) : "Select a date"}
            </h3>
            <p className="text-sm text-muted-foreground">
              View your habit progress for this day
            </p>
          </div>

          {isLoading ? (
            <div className="bg-card border border-red-500/10 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-red-500" />
                <span className="text-sm text-muted-foreground">
                  Loading habits...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-card border border-red-500/10 rounded-lg p-6">
              <div className="text-center text-red-500 text-sm">
                Failed to load habits for this date
              </div>
            </div>
          ) : dateHabits ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Completed
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    {dateHabits.completedHabits}
                  </div>
                </div>

                <div className="bg-card border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Total
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {dateHabits.totalHabits}
                  </div>
                </div>

                <div className="bg-card border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Rate
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    {completionRate}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-medium">Habit Details</h4>
                </div>

                <div className="bg-card border border-red-500/20 rounded-lg max-h-[455px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 mb-12 lg:mb-0">
                  {dateHabits.habits.length > 0 ? (
                    <div className="p-4 space-y-3">
                      {dateHabits.habits.map((habitLog: DateHabits) => (
                        <div
                          key={habitLog.id}
                          className={`border rounded-lg p-3 transition-colors ${
                            habitLog.isCompleted
                              ? "border-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                              : "border-border bg-muted/30"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                habitLog.isCompleted ? "bg-red-500" : "bg-muted"
                              }`}
                            >
                              {habitLog.isCompleted ? (
                                <CheckCircle className="w-3 h-3 text-white" />
                              ) : (
                                <XCircle className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-sm leading-tight">
                                  {habitLog.habit.title}
                                </h5>
                                <div className="flex gap-2">
                                  <div
                                    className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                                      habitLog.habit.priority
                                    )}`}
                                  >
                                    {habitLog.habit.priority}
                                  </div>
                                  <div
                                    className={`text-xs px-2 py-1 rounded ${
                                      habitLog.isCompleted
                                        ? "bg-red-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {habitLog.isCompleted ? "Done" : "Pending"}
                                  </div>
                                </div>
                              </div>
                              {habitLog.habit.category && (
                                <p className="text-xs text-muted-foreground">
                                  {habitLog.habit.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No habits tracked for this date
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-red-500/10 rounded-lg p-8 text-center">
              <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {selectedDate
                  ? "No data available for this date"
                  : "Select a date to view habits"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
