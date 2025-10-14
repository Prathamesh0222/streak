"use client";

import { Target, AlertCircle } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Habit } from "@/types/habit-types";
import { CustomCard, CustomContent } from "./custom-card";

interface HabitCategoryChartProps {
  habits: Habit[];
}

export function HabitCategoryChart({ habits }: HabitCategoryChartProps) {
  const categoryCounts: Record<string, number> = {};
  for (const { category } of habits) {
    const key = category ?? "No Category";
    categoryCounts[key] = (categoryCounts[key] ?? 0) + 1;
  }

  const chartData = Object.entries(categoryCounts).map(
    ([category, count], index) => ({
      category,
      count,
      fill: `var(--chart-${(index % 5) + 1})`,
    })
  );

  const sortedData = [...chartData].sort((a, b) => b.count - a.count);
  const mostCategory = sortedData[0];
  const leastCategory = sortedData[sortedData.length - 1];

  const chartConfig = Object.fromEntries(
    chartData.map((item, index) => [
      item.category,
      {
        label: item.category,
        color: `var(--chart-${(index % 5) + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  chartConfig.count = {
    label: "Habits",
    color: "var(--chart-1)",
  };

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Habit Categories</CardTitle>
          <CardDescription>No habits created yet</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p>Create some habits to see category distribution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <CustomCard className="flex flex-col border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 w-full">
      <CustomContent className="gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4">
        <span className="items-center pb-0">
          <h1 className="font-semibold">Habit Categories</h1>
          <p className="text-xs text-muted-foreground">
            Distribution of your habits by category
          </p>
        </span>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
            ></Pie>
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            <Target className="h-4 w-4 text-green-500" />
            Most habits: {mostCategory?.category} ({mostCategory?.count} habits)
          </div>
          <div className="flex items-center gap-2 leading-none font-medium">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Least habits: {leastCategory?.category} ({leastCategory?.count}{" "}
            habits)
          </div>
          <div className="text-muted-foreground leading-none">
            Total {habits.length} habits across {chartData.length} categories
          </div>
        </CardFooter>
      </CustomContent>
    </CustomCard>
  );
}
