"use client";

import { Bell, BarChart3, Brain, FileBarChart2, Trophy } from "lucide-react";
import { CustomCard, CustomContent } from "./custom-card";

export const AdvancedFeatures = () => {
  return (
    <div className="border-t w-full">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-x">
        <div className="text-center mb-12">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-300/70 border-red-500 text-red-700 dark:bg-red-900/50 border dark:border-red-500 dark:text-red-500 font-bold">
            Advanced Tools
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Powerful analytics and smart insights
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Dive deeper with advanced tracking, detailed analytics, and
            AI-powered insights to optimize your habit-building journey.
          </p>
        </div>
        <div className="space-y-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <CustomCard>
                <CustomContent>
                  <div className="bg-emerald-100/60 dark:bg-emerald-900/20 border rounded-2xl p-8 h-full">
                    <div className="mx-auto max-w-md">
                      <div className="w-4 h-4 rounded-full bg-red-400 mx-auto mb-6" />
                      <div className="rounded-xl bg-white/90 dark:bg-background border p-4 shadow-sm">
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-md border bg-muted flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                              </div>
                              <div className="flex-1 h-2 rounded-full bg-emerald-500/80" />
                              <div className="w-12 h-2 rounded-full bg-emerald-200" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <div className="w-2 h-2 rounded-full bg-emerald-300" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                <BarChart3 className="w-4 h-4" />
                <span>Progress Tracking</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Daily Progress Visualization
              </h3>
              <p className="text-muted-foreground max-w-prose">
                Track your daily habit completion with beautiful heatmaps and
                progress charts. See your consistency patterns and build
                momentum with visual progress indicators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                <FileBarChart2 className="w-4 h-4" />
                <span>AI Insights</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Weekly AI-Powered Reports
              </h3>
              <p className="text-muted-foreground max-w-prose">
                Get personalized weekly insights and analytics powered by AI.
                Discover patterns, receive recommendations, and understand your
                habit-building progress with smart analysis.
              </p>
            </div>
            <div>
              <CustomCard>
                <CustomContent>
                  <div className="bg-sky-100/60 dark:bg-sky-900/20 border rounded-2xl p-8 h-full">
                    <div className="mx-auto max-w-md">
                      <div className="rounded-xl bg-white/90 dark:bg-background border p-6 shadow-sm">
                        <div className="grid grid-cols-3 gap-3">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-16 rounded-md ${
                                i % 3 === 0 ? "bg-sky-400/60" : "bg-sky-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <CustomCard>
                <CustomContent>
                  <div className="bg-rose-100/60 dark:bg-rose-900/20 border rounded-2xl p-8 h-full">
                    <div className="mx-auto max-w-md">
                      <div className="rounded-xl bg-white/90 dark:bg-background border p-6 shadow-sm">
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="p-3 rounded-md border bg-rose-500/10"
                            >
                              <div className="text-xs font-medium mb-1 text-rose-600 flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Achievement
                              </div>
                              <div className="h-2 rounded-full bg-rose-400 w-3/5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                <Brain className="w-4 h-4" />
                <span>Smart Notifications</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Achievement Notifications
              </h3>
              <p className="text-muted-foreground max-w-prose">
                Stay motivated with timely achievement notifications and habit
                reminders. Get notified when you unlock new milestones and
                maintain your streak momentum.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Compete and Stay Motivated
              </h3>
              <p className="text-muted-foreground max-w-prose">
                Compare progress with friends, climb the ranks, and celebrate
                milestones together.
              </p>
            </div>
            <div>
              <CustomCard>
                <CustomContent>
                  <div className="bg-amber-100/60 dark:bg-amber-900/20 border rounded-2xl p-8 h-full">
                    <div className="mx-auto max-w-md">
                      <div className="rounded-xl bg-white/90 dark:bg-background border p-4 shadow-sm space-y-2">
                        {[
                          {
                            name: "You",
                            xp: "1,250",
                            rank: 1,
                            highlight: true,
                          },
                          {
                            name: "Alex",
                            xp: "980",
                            rank: 2,
                            highlight: false,
                          },
                          {
                            name: "Sarah",
                            xp: "850",
                            rank: 3,
                            highlight: false,
                          },
                        ].map((u) => (
                          <div
                            key={u.rank}
                            className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                          >
                            <div
                              className={`w-8 h-8 ${
                                u.highlight ? "bg-red-500" : "bg-muted"
                              } rounded-full flex items-center justify-center`}
                            >
                              <span
                                className={`${
                                  u.highlight
                                    ? "text-white"
                                    : "text-muted-foreground"
                                } text-xs font-bold`}
                              >
                                {u.rank}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium">
                                {u.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {u.xp} XP
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
