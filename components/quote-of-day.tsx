"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motivationalQuotes } from "@/lib/quote";
import { useState, useEffect } from "react";

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
    <Card className="w-full border shadow-none border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 mb-2">
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
