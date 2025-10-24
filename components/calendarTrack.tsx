import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  Target,
  Lock,
  Crown,
  Check,
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
import { CustomCard, CustomContent } from "./custom-card";

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="space-y-3 xl:col-span-8">
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
            <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300">
              <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4">
                <div className="text-center text-red-500 text-sm font-medium">
                  Failed to load habits for this date
                </div>
              </CustomContent>
            </CustomCard>
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
                <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300">
                  <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4 max-h-[455px] overflow-y-auto scrollbar-hide">
                    {dateHabits.habits.length > 0 ? (
                      <div className="space-y-4">
                        {dateHabits.habits.map((habitLog: DateHabits) => (
                          <div
                            key={habitLog.id}
                            className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                              habitLog.isCompleted
                                ? "bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                                : "bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 hover:bg-red-50/50 dark:hover:bg-red-950/10"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  habitLog.isCompleted
                                    ? "bg-red-500 border-red-500 text-white"
                                    : "border-gray-300 dark:border-gray-600 bg-transparent"
                                }`}
                              >
                                {habitLog.isCompleted && (
                                  <Check className="w-4 h-4" />
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                  {habitLog.habit.title}
                                </h5>
                                <div className="flex items-center gap-2 ml-3">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                                      habitLog.isCompleted
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                    }`}
                                  >
                                    {habitLog.isCompleted
                                      ? "Completed"
                                      : "Pending"}
                                  </span>
                                </div>
                              </div>

                              {habitLog.habit.category && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {habitLog.habit.category}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <Target className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          No habits for this date
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Select a different date to view habits
                        </p>
                      </div>
                    )}
                  </CustomContent>
                </CustomCard>
              </div>
            </div>
          ) : (
            <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300">
              <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {selectedDate
                    ? "No data available for this date"
                    : "Select a date to view habits"}
                </p>
              </CustomContent>
            </CustomCard>
          )}
        </div>
        <div className="space-y-3 xl:col-span-4">
          <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300">
            <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4">
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
            </CustomContent>
          </CustomCard>
          {isFreePlan && !subscriptionLoading && (
            <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 bg-red-50 dark:bg-red-950/20">
              <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4">
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
              </CustomContent>
            </CustomCard>
          )}
        </div>
      </div>
    </div>
  );
};
