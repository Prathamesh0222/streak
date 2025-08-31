import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import { DateHabits } from "@/types/habit-types";

export const CalendarTrack = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { data: dateHabits, isLoading, error } = useHabitLogs(selectedDate);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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

  return (
    <div className="mt-8 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-1 xl:grid-cols-2 lg:gap-8">
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">Habit Calendar</h2>
        <Card className="p-4 md:p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full mx-auto"
          />
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-bold">
          {selectedDate ? formatDate(selectedDate) : "Select a date"}
        </h3>

        {isLoading ? (
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Loading habits...
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-center text-red-600 dark:text-red-400">
                Failed to load habits for this date
              </div>
            </CardContent>
          </Card>
        ) : dateHabits ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {dateHabits.completedHabits}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">
                        {dateHabits.totalHabits}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {dateHabits.totalHabits > 0
                        ? Math.round(
                            (dateHabits.completedHabits /
                              dateHabits.totalHabits) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completion Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-y-auto max-h-[400px] md:max-h-[500px] lg:max-h-[608px]">
              <CardHeader>
                <CardTitle className="text-lg">Habit Details</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                {dateHabits.habits.length > 0 ? (
                  <div className="space-y-3">
                    {dateHabits.habits.map((habitLog: DateHabits) => (
                      <div
                        key={habitLog.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-3 border rounded-lg bg-muted/50 dark:bg-card/50 space-y-2 md:space-y-0"
                      >
                        <div className="flex items-center gap-3">
                          {habitLog.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {habitLog.habit.title}
                            </div>
                            {habitLog.habit.category && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {habitLog.habit.category}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={getPriorityColor(
                              habitLog.habit.priority
                            )}
                          >
                            {habitLog.habit.priority}
                          </Badge>
                          <Badge
                            variant={
                              habitLog.isCompleted ? "default" : "secondary"
                            }
                            className={
                              habitLog.isCompleted
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : ""
                            }
                          >
                            {habitLog.isCompleted ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    No habits tracked for this date
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="text-center text-gray-600 dark:text-gray-400">
                {selectedDate
                  ? "No data available for this date"
                  : "Select a date to view habits"}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
