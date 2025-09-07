"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

const motivationalQuotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Unknown",
  },
  {
    text: "Every day is a new beginning. Take a deep breath and start again.",
    author: "Unknown",
  },
];

export function QuoteOfDay() {
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  return (
    <Card className="w-full border shadow-none border-red-500/20 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10">
      <CardContent className="px-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-3">
              Quote of the Day
            </h3>
            <blockquote className="text-foreground text-sm my-3 leading-relaxed italic">
              &quot;{dailyQuote.text}&quot;
            </blockquote>
            <p className="text-xs text-muted-foreground font-medium">
              — {dailyQuote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
