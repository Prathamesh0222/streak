"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementCard } from "./achievement-card";
import { UserLevel } from "./user-level";
import {
  Trophy,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Lock,
  Award,
  Star,
} from "lucide-react";
import { useState } from "react";

export function AchievementsSection() {
  const {
    achievements,
    loading,
    getCompletedAchievements,
    getInProgressAchievements,
    getLockedAchievements,
    getAchievementsByCategory,
    getCompletionRate,
  } = useAchievements();

  const [activeCategory, setActiveCategory] = useState("all");

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedAchievements = getCompletedAchievements();
  const inProgressAchievements = getInProgressAchievements();
  const lockedAchievements = getLockedAchievements();
  const completionRate = getCompletionRate();

  const categories = [
    { id: "all", name: "All", icon: Award },
    { id: "STREAK", name: "Streak", icon: Target },
    { id: "HABITS", name: "Habits", icon: Trophy },
    { id: "CONSISTENCY", name: "Consistency", icon: Calendar },
  ];

  const getAchievementsForCategory = (category: string) => {
    if (category === "all") return achievements;
    return getAchievementsByCategory(category);
  };

  return (
    <div className="space-y-8 mb-12 lg:mb-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <Trophy className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-medium">Achievements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserLevel />

        <div className="bg-card border border-red-500/20 rounded-lg p-3">
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <Star className="h-4 w-4 text-red-500" />
              Achievements
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Completed</span>
                <span>
                  {completedAchievements.length} / {achievements.length}
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-red-500/20 rounded-lg p-7">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium text-sm">Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Active</span>
              <Badge
                variant="default"
                className="bg-red-500 hover:bg-red-600 text-xs"
              >
                {inProgressAchievements.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Pending</span>
              <Badge variant="outline" className="text-xs">
                {lockedAchievements.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = activeCategory === category.id;
          const count = getAchievementsForCategory(category.id).length;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-red-500 text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComponent className="h-3 w-3" />
              {category.name}
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  isActive ? "bg-red-600" : "bg-background"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {completedAchievements.length > 0 &&
          (activeCategory === "all" ||
            getAchievementsByCategory(activeCategory).some((a) =>
              completedAchievements.find((ca) => ca.id === a.id)
            )) && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-medium text-red-600 dark:text-red-400">
                  Completed
                </h3>
                <div className="flex-1 border-b border-red-500/20"></div>
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded">
                  {activeCategory === "all"
                    ? completedAchievements.length
                    : getAchievementsByCategory(activeCategory).filter((a) =>
                        completedAchievements.find((ca) => ca.id === a.id)
                      ).length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeCategory === "all"
                  ? completedAchievements
                  : completedAchievements.filter((a) =>
                      getAchievementsByCategory(activeCategory).find(
                        (ca) => ca.id === a.id
                      )
                    )
                ).map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>
          )}

        {inProgressAchievements.length > 0 &&
          (activeCategory === "all" ||
            getAchievementsByCategory(activeCategory).some((a) =>
              inProgressAchievements.find((ia) => ia.id === a.id)
            )) && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-muted-foreground">
                  In Progress
                </h3>
                <div className="flex-1 border-b border-border"></div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {activeCategory === "all"
                    ? inProgressAchievements.length
                    : getAchievementsByCategory(activeCategory).filter((a) =>
                        inProgressAchievements.find((ia) => ia.id === a.id)
                      ).length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeCategory === "all"
                  ? inProgressAchievements
                  : inProgressAchievements.filter((a) =>
                      getAchievementsByCategory(activeCategory).find(
                        (ia) => ia.id === a.id
                      )
                    )
                ).map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>
          )}

        {lockedAchievements.length > 0 &&
          (activeCategory === "all" ||
            getAchievementsByCategory(activeCategory).some((a) =>
              lockedAchievements.find((la) => la.id === a.id)
            )) && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-muted-foreground">Locked</h3>
                <div className="flex-1 border-b border-border"></div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {activeCategory === "all"
                    ? lockedAchievements.length
                    : getAchievementsByCategory(activeCategory).filter((a) =>
                        lockedAchievements.find((la) => la.id === a.id)
                      ).length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeCategory === "all"
                  ? lockedAchievements
                  : lockedAchievements.filter((a) =>
                      getAchievementsByCategory(activeCategory).find(
                        (la) => la.id === a.id
                      )
                    )
                ).map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
