"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Habit } from "@/types/habit-types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isCompletedToday(habit: Habit) {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  return (
    habit.HabitLogs?.some((log) => {
      const d = new Date(log.date);
      return d >= today && d < tomorrow && log.isCompleted;
    }) || false
  );
}

export function TodaysHabits() {
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/api/habits");
        if (mounted) setHabits(res.data as Habit[]);
      } catch (e) {
        if (mounted) setErr("Failed to load habits");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const todays = useMemo(() => {
    if (!habits) return [];
    // Show habits that are not completed today
    // and are daily/weekly (monthly can be shown too; keeping simple)
    return habits
      .filter((h) => !isCompletedToday(h))
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 6);
  }, [habits]);

  const markComplete = async (habit: Habit) => {
    const dateStr = new Date().toLocaleDateString("en-CA");
    try {
      setSavingId(habit.id);
      await axios.post("/api/habit-logs", {
        habitId: habit.id,
        date: dateStr,
        isCompleted: true,
      });
      await axios.patch(`/api/habits/${habit.id}`, { status: "COMPLETED" });
      toast.success("Marked complete!");
      // Optimistic update
      setHabits((prev) =>
        prev
          ? prev.map((h) =>
              h.id === habit.id
                ? {
                    ...h,
                    status: "COMPLETED",
                    HabitLogs: [
                      ...(h.HabitLogs || []),
                      {
                        id: crypto.randomUUID(),
                        date: dateStr,
                        isCompleted: true,
                        habitId: habit.id,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : h
            )
          : prev
      );
    } catch {
      toast.error("Failed to mark complete");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-100 dark:bg-gray-900 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
        {err}
      </div>
    );
  }

  return (
    <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 dark:hover:border-red-800/75 group h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today&apos;s Habits</h3>
        <span className="text-xs text-muted-foreground">
          {todays.length} due
        </span>
      </div>

      {todays.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          All caught up for today. Great job!
        </div>
      ) : (
        <ul className="space-y-2">
          {todays.map((h) => {
            const disabled = savingId === h.id;
            return (
              <li
                key={h.id}
                className="flex items-center gap-3 border border-border rounded-lg px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{h.title}</div>
                  {h.category && (
                    <div className="text-xs text-muted-foreground truncate">
                      {h.category}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={disabled}
                  onClick={() => markComplete(h)}
                >
                  {disabled ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
