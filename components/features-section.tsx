"use client";

import {
  Check,
  Flame,
  Trophy,
  Zap,
  Star,
  Target,
  Award,
  Crown,
  Gem,
  Shield,
  Medal,
  ArrowRight,
} from "lucide-react";
import { CustomCard, CustomContent } from "./custom-card";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <>
      <div className="border-t w-full">
        <section
          id="features"
          className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-x"
        >
          <div className="text-center mb-10">
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-300/70 border-red-500 text-red-700 dark:bg-red-900/50 border dark:border-red-500 dark:text-red-500 font-bold">
              Features
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Everything you need to build lasting habits
            </h2>
            <p className="mt-2 text-muted-foreground">
              Track your progress, get AI-powered insights, and stay motivated
              with our comprehensive habit-building platform.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <CustomCard>
                <CustomContent>
                  <div className="gap-4">
                    <div className="flex w-full h-full bg-background rounded-lg border p-2">
                      <motion.div
                        className="flex flex-col gap-2 w-full p-3"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="flex p-3 border items-center justify-between gap-3 rounded-md"
                          variants={fadeIn}
                        >
                          <Flame className="w-10 h-10 border border-border rounded-full text-red-500 p-2.5 hover:scale-105 duration-300 ease-in-out bg-muted flex-shrink-0" />
                          <div className="flex flex-col gap-2 w-full p-2">
                            <div className="h-2 rounded-full bg-red-500 w-3/4" />
                            <div className="h-2 rounded-full bg-red-500 w-full" />
                          </div>
                          <div className="h-8 w-8 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center hover:scale-105 duration-300 ease-in-out ">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                        <motion.div
                          className="px-3.5 border rounded-md flex items-center justify-between gap-3 bg-card"
                          variants={fadeIn}
                        >
                          <div className="w-5 h-5 border border-border rounded-full text-red-500 p-2.5" />
                          <div className="flex flex-col gap-2 w-full p-2">
                            <div className="h-1 rounded-full bg-red-500 w-1/2" />
                            <div className="h-1 rounded-full bg-red-500 w-full" />
                          </div>
                          <div className="h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center" />
                        </motion.div>
                        <motion.div
                          className="px-3.5 border rounded-md flex items-center justify-between gap-3 bg-card"
                          variants={fadeIn}
                        >
                          <div className="w-5 h-5 border border-border rounded-full text-red-500 p-2.5" />
                          <div className="flex flex-col gap-2 w-full p-2">
                            <div className="h-1 rounded-full bg-red-500 w-1/2" />
                            <div className="h-1 rounded-full bg-red-500 w-full" />
                          </div>
                          <div className="h-5 w-5 rounded-full border flex-shrink-0 flex items-center justify-center" />
                        </motion.div>
                      </motion.div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">Habit Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Track your daily habits with progress indicators and
                        completion status.
                      </p>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
              <CustomCard>
                <CustomContent>
                  <div className="gap-4">
                    <div className="w-full h-full bg-background rounded-lg border p-3 py-3.5">
                      <motion.div
                        className="flex justify-center"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        {Array.from({ length: 22 }).map((_, rowIdx) => (
                          <div key={rowIdx}>
                            {Array.from({ length: 9 }).map((_, colIdx) => (
                              <div
                                key={colIdx}
                                className={`p-2 border rounded-sm ${
                                  rowIdx > 10 ? "bg-red-500" : "bg-white"
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">Progress Heatmap</h3>
                      <p className="text-sm text-muted-foreground">
                        Visualize your consistency with GitHub-style activity
                        heatmaps.
                      </p>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
              <CustomCard>
                <CustomContent>
                  <div className="gap-4">
                    <div className="flex w-full h-full bg-background rounded-lg border p-3">
                      <motion.div
                        className="flex flex-col gap-3 w-full px-3"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="flex items-center gap-2 p-2 border rounded-md bg-card"
                          variants={fadeIn}
                        >
                          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              AI
                            </span>
                          </div>
                          <div className="flex-1 h-2 bg-muted rounded-full" />
                        </motion.div>
                        <motion.div className="space-y-5" variants={container}>
                          <motion.div
                            className="flex gap-2 mx-2"
                            variants={fadeIn}
                          >
                            <div className="w-6 h-6 rounded-full bg-muted border" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 bg-red-500 rounded-full w-3/4" />
                              <div className="h-2 bg-red-500 rounded-full w-1/2" />
                            </div>
                          </motion.div>
                          <motion.div
                            className="flex gap-2 justify-end mx-2"
                            variants={fadeIn}
                          >
                            <div className="flex-1 space-y-1 max-w-2/3">
                              <div className="h-2 bg-muted rounded-full w-full" />
                              <div className="h-2 bg-muted rounded-full w-2/3" />
                            </div>
                            <div className="w-6 h-6 rounded-full bg-red-500 border" />
                          </motion.div>
                        </motion.div>
                        <motion.div
                          className="flex gap-2 p-2 border rounded-md bg-card"
                          variants={fadeIn}
                        >
                          <div className="flex-1 h-7 bg-muted rounded-md" />
                          <div className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center">
                            <ArrowRight className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">AI Assistant</h3>
                      <p className="text-sm text-muted-foreground">
                        Get personalized habit suggestions powered by AI.
                      </p>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
              <CustomCard>
                <CustomContent>
                  <div className="gap-4">
                    <div className="w-full h-full bg-background rounded-lg border p-3">
                      <motion.div
                        className="space-y-3"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="grid grid-cols-2 gap-3"
                          variants={container}
                        >
                          <div className="text-center p-3 border rounded-lg bg-card">
                            <div className="relative w-12 h-12 mx-auto mb-2">
                              <div className="w-12 h-12 rounded-full border-2 border-muted"></div>
                              <div
                                className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent transform -rotate-90"
                                style={{ clipPath: "circle(50% at 50% 50%)" }}
                              ></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-red-500">
                                  5
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              Level
                            </div>
                          </div>
                          <div className="text-center p-3 border rounded-lg bg-card">
                            <div className="relative w-12 h-12 mx-auto mb-2">
                              <div className="w-12 h-12 rounded-full border-2 border-muted"></div>
                              <div
                                className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-red-500 border-t-transparent transform -rotate-45"
                                style={{ clipPath: "circle(50% at 50% 50%)" }}
                              ></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-red-500">
                                  12
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              Streak
                            </div>
                          </div>
                        </motion.div>
                        <motion.div className="space-y-1" variants={container}>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              XP Progress
                            </span>
                            <span className="font-bold text-red-500">
                              1,250 / 2,000
                            </span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full border border-border/50">
                            <motion.div
                              className="h-full bg-red-500 rounded-full w-3/5"
                              variants={fadeIn}
                            ></motion.div>
                          </div>
                        </motion.div>
                        <motion.div className="flex gap-2" variants={container}>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Trophy className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Flame className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Target className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Zap className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Star className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Award className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Crown className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Shield className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Medal className="w-4 h-4 text-white" />
                          </motion.div>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                            variants={fadeIn}
                          >
                            <Gem className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">Gamification</h3>
                      <p className="text-sm text-muted-foreground">
                        Earn XP, unlock achievements, and level up your habits.
                      </p>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
