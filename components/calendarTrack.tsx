import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Target,
  Lock,
  Crown,
} from "lucide-react";
import { useHabitLogs } from "@/hooks/useHabitLogs";
import { useSubscription } from "@/hooks/useSubscription";
import { DateHabits } from "@/types/habit-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { CalendarComplete } from "./calendar-complete";
import { CalendarStreak } from "./calendar-streak";
import { CalendarXp } from "./calendar-xp";

export const CalendarTrack = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { data: dateHabits, isLoading, error } = useHabitLogs(selectedDate);
  const {
    isFreePlan,
    isPremium,
    limits,
    getEarliestAccessDate,
    isLoading: subscriptionLoading,
  } = useSubscription();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const earliestAccessDate = getEarliestAccessDate();

  const disableFutureDates = (date: Date) => {
    if (date > today) return true;
    if (isFreePlan && earliestAccessDate && date < earliestAccessDate) {
      return true;
    }

    return false;
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

  return (
    <div className="space-y-8 mt-8.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-medium">Habit Tracker</h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={isPremium ? "default" : "secondary"}
            className={`flex items-center gap-1.5 px-3 py-1 ${
              isPremium
                ? "bg-red-500 hover:bg-red-600"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {isPremium ? (
              <>
                <Crown className="h-3.5 w-3.5" />
                Premium
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Free Plan
              </>
            )}
          </Badge>
        </div>
      </div>

      {isFreePlan && !subscriptionLoading && (
        <div className="border border-red-500/20 rounded-xl bg-red-50 dark:bg-red-950/20 p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
          <div className="p-5 bg-background border border-red-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Limited Calendar Access
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Free plan users can view habit data for the last{" "}
                  <span className="font-semibold text-red-500">
                    {limits?.calendarDays} days
                  </span>{" "}
                  only. Upgrade to Premium for unlimited calendar access.
                </p>
                <Button
                  size="sm"
                  onClick={handleUpgrade}
                  className="bg-red-500 hover:bg-red-600 text-white shadow-sm"
                >
                  <Crown className="h-3 w-3 mr-1.5" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
            <div className="p-5 bg-background border border-red-500/20 rounded-lg">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disableFutureDates}
                className="w-full mx-auto"
                modifiers={{
                  restricted: (date) => {
                    if (!isFreePlan || !earliestAccessDate || date <= today) {
                      return false;
                    }
                    return date < earliestAccessDate;
                  },
                }}
                modifiersStyles={{
                  restricted: {
                    textDecoration: "line-through",
                    color: "#ed1826",
                    opacity: 0.5,
                  },
                }}
              />

              {isFreePlan && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <span className="text-muted-foreground font-medium">
                        Available dates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted rounded-full opacity-50"></div>
                      <span className="text-muted-foreground font-medium">
                        Premium only
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {selectedDate ? formatDate(selectedDate) : "Select a date"}
            </h3>
            <p className="text-sm text-muted-foreground">
              View your habit progress for this day
              {isFreePlan && (
                <span className="text-red-500 font-medium">
                  {" "}
                  • Last {limits?.calendarDays} days only
                </span>
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="border border-red-500/20 rounded-xl bg-card p-1">
              <div className="p-6 bg-background border border-red-500/20 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 animate-spin text-red-500" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Loading habits...
                  </span>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="border border-red-500/20 rounded-xl bg-card p-1">
              <div className="p-6 bg-background border border-red-500/20 rounded-lg">
                <div className="text-center text-red-500 text-sm font-medium">
                  Failed to load habits for this date
                </div>
              </div>
            </div>
          ) : dateHabits ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <CalendarComplete selectedDate={selectedDate} />
                <div className="flex w-full gap-2 md:hidden">
                  <div className="w-1/2">
                    <CalendarStreak selectedDate={selectedDate} />
                  </div>
                  <div className="w-1/2">
                    <CalendarXp selectedDate={selectedDate} />
                  </div>
                </div>
                <div className="hidden md:block">
                  <CalendarStreak selectedDate={selectedDate} />
                </div>
                <div className="hidden md:block">
                  <CalendarXp selectedDate={selectedDate} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold">Habit Details</h4>
                </div>

                <div className="border border-red-500/20 rounded-xl bg-card p-1">
                  <div className="bg-background border border-red-500/20 rounded-lg max-h-[455px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 mb-12 lg:mb-0">
                    {dateHabits.habits.length > 0 ? (
                      <div className="p-4 space-y-3">
                        {dateHabits.habits.map((habitLog: DateHabits) => (
                          <div
                            key={habitLog.id}
                            className={`border rounded-xl p-4 transition-all duration-200 ${
                              habitLog.isCompleted
                                ? "border-red-500/30 bg-red-50 dark:bg-red-950/20 shadow-sm"
                                : "border-border bg-muted/30 hover:border-red-500/20"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                                  habitLog.isCompleted
                                    ? "bg-red-500"
                                    : "bg-muted"
                                }`}
                              >
                                {habitLog.isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-sm leading-tight">
                                    {habitLog.habit.title}
                                  </h5>
                                  <div className="flex gap-2">
                                    <div
                                      className={`text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm ${getPriorityColor(
                                        habitLog.habit.priority
                                      )}`}
                                    >
                                      {habitLog.habit.priority}
                                    </div>
                                    <div
                                      className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                                        habitLog.isCompleted
                                          ? "bg-red-500 text-white shadow-sm"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {habitLog.isCompleted
                                        ? "Done"
                                        : "Pending"}
                                    </div>
                                  </div>
                                </div>
                                {habitLog.habit.category && (
                                  <p className="text-xs text-muted-foreground font-medium">
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
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                          <Target className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          No habits tracked for this date
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-red-500/20 rounded-xl bg-card p-1">
              <div className="p-8 bg-background border border-red-500/20 rounded-lg text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {selectedDate
                    ? "No data available for this date"
                    : "Select a date to view habits"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
