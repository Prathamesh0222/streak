"use client";

import { Bell, BarChart3, Brain, FileBarChart2, Trophy } from "lucide-react";
import { CustomCard, CustomContent } from "./custom-card";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export const AdvancedFeatures = () => {
  return (
    <div className="border-t w-full">
      <section className="max-w-7xl mx-auto grid px-4 md:px-6 py-16 border-x">
        <div className="text-center mb-12">
          <Badge className="inline-block text-xs rounded-full bg-red-300/70 border-red-500 text-red-700 dark:bg-red-900/50 border dark:border-red-500 dark:text-red-500 font-bold">
            Advanced Tools
          </Badge>
          <h2 className="mt-3 text-2xl md:text-4xl font-bold">
            Powerful analytics and smart insights
          </h2>
          <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Dive deeper with advanced tracking, detailed analytics, and
            AI-powered insights to optimize your habit-building journey.
          </p>
        </div>
        <div className="space-y-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                <BarChart3 className="w-4 h-4" />
                <span>Progress Tracking</span>
              </div>
              <h3 className="text-xl md:text-3xl font-bold mb-3">
                Daily Progress Visualization
              </h3>
              <p className="text-muted-foreground max-w-prose text-sm md:text-base">
                Track your daily habit completion with beautiful heatmaps and
                progress charts. See your consistency patterns and build
                momentum with visual progress indicators.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <CustomCard>
                <CustomContent>
                  <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border rounded-lg p-6 h-full">
                    <div className="space-y-4">
                      <div className="bg-white/90 dark:bg-background border rounded-md p-4">
                        <motion.div
                          className="grid grid-cols-7 ml-4 md:ml-7 gap-1 mb-2"
                          variants={container}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                        >
                          {Array.from({ length: 35 }).map((_, i) => (
                            <motion.div
                              key={i}
                              variants={fadeIn}
                              className={`w-3 h-3 rounded-sm ${
                                i % 7 < 3
                                  ? "bg-red-400 dark:bg-red-600"
                                  : i % 7 < 5
                                  ? "bg-red-300 dark:bg-red-700"
                                  : "bg-red-200 dark:bg-red-800"
                              }`}
                            />
                          ))}
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-2"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        {["Exercise", "Reading", "Meditation"].map((habit) => (
                          <motion.div
                            key={habit}
                            className="flex items-center gap-3"
                            variants={fadeIn}
                          >
                            <motion.div
                              className="w-6 h-6 bg-red-500 rounded-full"
                              variants={fadeIn}
                            />
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: "75%" }}
                                  variants={fadeIn}
                                />
                              </div>
                            </div>
                            <motion.div
                              className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"
                              variants={fadeIn}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="order-1 md:order-1">
              <CustomCard>
                <CustomContent>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-50 dark:from-red-900/20 dark:to-red-900/20 border rounded-xl p-6 h-full">
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-center gap-2 mb-4"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="h-4 bg-red-200 dark:bg-red-700 rounded w-24"
                          variants={fadeIn}
                        />
                      </motion.div>

                      <div className="bg-white/90 dark:bg-background border rounded-lg p-4">
                        <motion.div
                          className="h-32 bg-gradient-to-r from-red-100 to-red-100 dark:from-red-900/30 dark:to-red-900/30 rounded-lg flex items-end justify-between px-2"
                          variants={container}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                        >
                          {Array.from({ length: 7 }).map((_, i) => (
                            <motion.div
                              key={i}
                              variants={fadeIn}
                              className={`w-6 rounded-t ${
                                i % 2 === 0
                                  ? "bg-red-300 dark:bg-red-600 h-16"
                                  : "bg-red-300 dark:bg-red-600 h-12"
                              }`}
                            />
                          ))}
                        </motion.div>
                      </div>
                      <motion.div
                        className="space-y-2"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="h-3 bg-red-200 dark:bg-red-700 rounded w-3/4"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="h-3 bg-red-200 dark:bg-red-700 rounded w-1/2"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="flex items-center gap-2 mt-3"
                          variants={fadeIn}
                        >
                          <div className="w-4 h-4 bg-red-400 rounded-full" />
                          <div className="h-3 bg-red-200 dark:bg-red-700 rounded w-20" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
            <div className="order-2 md:order-2">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="order-2 md:order-1">
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
            <div className="order-1 md:order-2">
              <CustomCard>
                <CustomContent>
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border rounded-xl p-6 h-full">
                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center gap-2 mb-3 mx-3"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-6 h-6 bg-rose-500 rounded-full"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="ml-auto w-2 h-2 bg-rose-400 rounded-full"
                          variants={fadeIn}
                        />
                      </motion.div>
                      <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        {[
                          "7-day streak!",
                          "New achievement!",
                          "Goal completed!",
                        ].map((text) => (
                          <motion.div
                            key={text}
                            className="bg-white/90 dark:bg-background border rounded-lg p-3"
                            variants={fadeIn}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <Bell className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                              </div>
                              <div className="w-2 h-2 bg-rose-400 rounded-full" />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
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
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border rounded-xl p-6 h-full">
                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center gap-2 mb-4"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg"
                          variants={fadeIn}
                        />
                        <motion.div
                          className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"
                          variants={fadeIn}
                        />
                      </motion.div>
                      <motion.div
                        className="bg-white/90 dark:bg-background border rounded-lg p-3 space-y-2"
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                      >
                        {[
                          {
                            rank: 1,
                            name: "You",
                            xp: "1,250",
                            isCurrent: true,
                          },
                          {
                            rank: 2,
                            name: "Alex",
                            xp: "980",
                            isCurrent: false,
                          },
                          {
                            rank: 3,
                            name: "Sarah",
                            xp: "850",
                            isCurrent: false,
                          },
                        ].map((user) => (
                          <motion.div
                            key={user.rank}
                            className="flex items-center gap-3 p-2 rounded-md"
                            variants={fadeIn}
                          >
                            <div
                              className={`w-8 h-8 ${
                                user.isCurrent
                                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                                  : "bg-gradient-to-r from-amber-400 to-yellow-400"
                              } rounded-full flex items-center justify-center`}
                            >
                              <span className="text-white text-xs font-bold">
                                {user.rank}
                              </span>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div
                                className={`h-3 ${
                                  user.isCurrent
                                    ? "bg-red-200 dark:bg-red-900/30"
                                    : "bg-gray-200 dark:bg-gray-700"
                                } rounded w-3/4`}
                              />
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-amber-400 rounded" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8" />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </CustomContent>
              </CustomCard>
            </div>
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
          </div>
        </div>
      </section>
    </div>
  );
};
