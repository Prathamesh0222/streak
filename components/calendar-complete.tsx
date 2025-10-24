"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useHabitLogs } from "@/hooks/useHabitLogs";

export const description = "A radial chart with text";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export const CalendarComplete = ({
  selectedDate,
}: {
  selectedDate: Date | undefined;
}) => {
  const { data: dateHabits } = useHabitLogs(selectedDate);

  const completionRate =
    dateHabits.totalHabits > 0
      ? Math.round((dateHabits.completedHabits / dateHabits.totalHabits) * 100)
      : 0;

  const conditionalPolar = () => {
    if (completionRate === 100) {
      return [0, 25];
    } else {
      return [50, 45];
    }
  };

  const chartData = [
    {
      name: "completed",
      value: completionRate,
      fill: "#ef4444",
    },
  ];

  return (
    <div className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 rounded-xl bg-card p-1 transition-all duration-300">
      <div className="p-4 bg-background border border-red-500/20 rounded-lg">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[120px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + (completionRate / 100) * 360}
            innerRadius={55}
            outerRadius={40}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={conditionalPolar()}
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
                          className="fill-red-500 text-4xl font-bold"
                        >
                          {chartData[0].value}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
