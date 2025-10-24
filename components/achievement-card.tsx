"use client";

import { Progress } from "@/components/ui/progress";
import {
  AchievementProgress,
  ACHIEVEMENT_ICONS,
} from "@/types/achievement-types";
import { getAchievementCategoryIcon } from "@/lib/achievements";
import { CheckCircle, Lock } from "lucide-react";
import { Badge } from "./ui/badge";
import { CustomCard, CustomContent } from "./custom-card";

interface AchievementCardProps {
  achievement: AchievementProgress;
  size?: "sm" | "md" | "lg";
}

export function AchievementCard({
  achievement,
  size = "md",
}: AchievementCardProps) {
  const {
    achievement: achievementData,
    progress,
    isCompleted,
    progressPercentage,
  } = achievement;

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const isLocked = progress === 0 && !isCompleted;
  const cardSize = size === "sm" ? "p-4" : size === "lg" ? "p-6" : "p-5";
  const titleSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";
  const iconSize =
    size === "sm" ? "w-10 h-10" : size === "lg" ? "w-14 h-14" : "w-12 h-12";

  const renderIcon = () => {
    if (
      achievementData.icon &&
      ACHIEVEMENT_ICONS[achievementData.icon as keyof typeof ACHIEVEMENT_ICONS]
    ) {
      const IconComponent =
        ACHIEVEMENT_ICONS[
          achievementData.icon as keyof typeof ACHIEVEMENT_ICONS
        ];
      return <IconComponent className="h-6 w-6 text-white" />;
    }
    const CategoryIcon = getAchievementCategoryIcon(achievementData.category);
    return <CategoryIcon className="h-6 w-6 text-white" />;
  };

  if (isLocked) {
    return (
      <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 group">
        <CustomContent
          className={`${cardSize} bg-background border border-red-500/20 rounded-lg`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`${iconSize} rounded-xl bg-muted flex items-center justify-center`}
            >
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground mb-1">
                {achievementData.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 opacity-60">
                {achievementData.description}
              </p>
            </div>
            <div className="text-xs px-3 py-1 rounded-lg bg-muted text-muted-foreground">
              Locked
            </div>
          </div>
        </CustomContent>
      </CustomCard>
    );
  }

  if (isCompleted) {
    return (
      <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 hover:shadow-lg w-full md:w-1/2 group bg-red-50 dark:bg-red-950/20">
        <CustomContent
          className={`${cardSize} bg-red-50 dark:bg-red-950/20 border border-red-500/20 rounded-lg`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`${iconSize} rounded-xl bg-red-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
            >
              {renderIcon()}
            </div>
            <Badge
              variant={"destructive"}
              className="text-white py-1 rounded-full text-xs font-semibold flex items-center"
            >
              <CheckCircle className="h-3 w-3" />
            </Badge>
          </div>

          <div className="space-y-2">
            <h4
              className={`${titleSize} font-bold text-foreground flex items-center gap-2`}
            >
              {achievementData.name}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {achievementData.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold">
              +{achievementData.xpReward} XP
            </div>
            <Badge
              variant={"outline"}
              className="text-xs font-semibold rounded-lg border border-red-500/20 text-red-500 dark:text-red-400"
            >
              <div>{formatCategory(achievementData.category)}</div>
            </Badge>
          </div>

          {achievement.unlockedAt && (
            <div className="mt-3 pt-3 border-t border-red-500/20">
              <p className="text-xs text-red-500 dark:text-red-400">
                Unlocked{" "}
                {new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </CustomContent>
      </CustomCard>
    );
  }

  return (
    <CustomCard className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 group">
      <CustomContent
        className={`${cardSize} bg-background border border-red-500/20 rounded-lg relative overflow-hidden`}
      >
        <div className="absolute top-0 left-0 h-0.5 bg-red-500 transition-all duration-500" />

        <div className="flex items-start gap-3 mb-3 pt-1">
          <div
            className={`${iconSize} rounded-xl bg-red-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
          >
            {renderIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`${titleSize} font-semibold text-foreground mb-1`}>
              {achievementData.name}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {achievementData.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant={"outline"}
              className="text-xs font-semibold rounded-lg border border-red-500/20 text-red-500 dark:text-red-400"
            >
              <div>{formatCategory(achievementData.category)}</div>
            </Badge>
            <div className="text-xs font-bold text-red-500 dark:text-red-400">
              +{achievementData.xpReward} XP
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">
                {progress} / {achievementData.requirement}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-right">
              <span className="text-xs font-semibold text-red-500 dark:text-red-400">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </CustomContent>
    </CustomCard>
  );
}
