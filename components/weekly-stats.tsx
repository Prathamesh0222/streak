"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Habit } from "@/types/habit-types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type DayPoint = { key: string; label: string; count: number };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toKey(d: Date) {
  return d.toLocaleDateString("en-US");
}

function weekdayShort(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function WeeklyStats() {
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/api/habits");
        if (mounted) setHabits(res.data as Habit[]);
      } catch (e) {
        if (mounted) setErr("Failed to load weekly stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const today = startOfDay(new Date());
  const baseDays: DayPoint[] = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    return { key: toKey(day), label: weekdayShort(day), count: 0 };
  });

  let data = baseDays;
  let totalCompletions = 0;
  let expected = 0;
  let rate = 0;

  if (habits && habits.length > 0) {
    const countsByKey: Record<string, number> = Object.fromEntries(
      baseDays.map((d) => [d.key, 0])
    );

    for (const habit of habits) {
      const logs = habit.HabitLogs || [];
      for (const log of logs) {
        if (!log.isCompleted) continue;
        const key = toKey(startOfDay(new Date(log.date)));
        if (countsByKey[key] !== undefined) countsByKey[key] += 1;
      }
    }

    data = baseDays.map((d) => ({ ...d, count: countsByKey[d.key] || 0 }));
    totalCompletions = data.reduce((sum, d) => sum + d.count, 0);

    const dailyCount = habits.filter((h) => h.frequency === "DAILY").length;
    const weeklyCount = habits.filter((h) => h.frequency === "WEEKLY").length;
    expected = dailyCount * 7 + weeklyCount * 1;
    rate =
      expected > 0
        ? Math.min(100, Math.round((totalCompletions / expected) * 100))
        : 0;
  }

  if (loading) {
    return (
      <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm bg-card">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg" />
            ))}
          </div>
          <div className="h-40 rounded-xl" />
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

  const bestDay = data.reduce(
    (a, b) => (b.count > a.count ? b : a),
    data[0] || { key: "", label: "", count: 0 }
  );

  return (
    <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 dark:hover:border-red-800/75 group h-full bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Weekly Stats</h3>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">Completions</div>
          <div className="text-xl font-semibold">{totalCompletions}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">Completion rate</div>
          <div className="text-xl font-semibold">{rate}%</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-muted-foreground">Best day</div>
          <div className="text-xl font-semibold">
            {bestDay?.label || "-"} {bestDay?.count ? `(${bestDay.count})` : ""}
          </div>
        </div>
      </div>

      <ChartContainer
        id="weekly-stats"
        className="h-60 w-full mt-10"
        config={{
          completions: {
            label: "Completions",
            color: "hsl(var(--primary))",
          },
        }}
      >
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            content={
              <ChartTooltipContent labelKey="label" nameKey="completions" />
            }
          />
          <Bar
            dataKey="count"
            fill="var(--color-completions)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
