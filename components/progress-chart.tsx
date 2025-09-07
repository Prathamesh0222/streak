"use client";

import { Target, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Habit } from "@/types/habit-types";

interface ProgressChartProps {
  habits: Habit[];
}

export function ProgressChart({ habits }: ProgressChartProps) {
  const totalHabits = habits.length;
  const completedHabits = habits.filter(
    (habit) => habit.status === "COMPLETED"
  ).length;
  const completionPercentage =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const progressAngle = (completionPercentage / 100) * 360;

  const chartData = [
    {
      name: "Progress",
      value: completionPercentage,
      fill: completionPercentage === 100 ? "var(--chart-1)" : "var(--chart-2)",
    },
  ];

  const chartConfig = {
    value: {
      label: "Progress",
    },
    Progress: {
      label: "Progress",
      color: completionPercentage === 100 ? "var(--chart-1)" : "var(--chart-2)",
    },
  } satisfies ChartConfig;

  if (totalHabits === 0) {
    return (
      <Card className="flex flex-col bg-background w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Today&apos;s Progress</CardTitle>
          <CardDescription>No habits created yet</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <Target className="h-12 w-12 mx-auto mb-2" />
              <p>Create habits to track your progress</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Today&apos;s Progress</CardTitle>
        <CardDescription>
          {completedHabits} of {totalHabits} habits completed
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + progressAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {completionPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Progress
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {completionPercentage > 0 ? (
            <>
              Great progress! Keep it up <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Start your first habit today <Target className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          {totalHabits} habit{totalHabits !== 1 ? "s" : ""} in your routine
        </div>
      </CardFooter>
    </Card>
  );
}
