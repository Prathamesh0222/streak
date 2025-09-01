"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  const stats = [
    { number: "10+", label: "Habit Categories" },
    { number: "20+", label: "Templates" },
    { number: "365", label: "Days Tracked" },
  ];

  return (
    <div className="relative h-full overflow-hidden max-w-7xl mx-auto border-x">
      <div className="relative h-full">
        <div className="flex flex-col items-center justify-center text-center h-full py-12">
          <Badge className="mb-4 rounded-xl bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 items-center border dark:border-white/15 border-black/15">
            <Flame /> Daily Discipline
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl">
            Transform your life
            <span className="block mt-3 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              one habit at a time
            </span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-2xl">
            Track habits, visualize progress, and build unstoppable streaks with
            our comprehensive habit tracking platform.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-red-600 dark:text-white hover:bg-red-700 cursor-pointer transition-all duration-200 font-semibold"
            >
              Start Building Habits
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex gap-12 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
