"use client";

import { Progress } from "@/components/ui/progress";
import {
  AchievementProgress,
  ACHIEVEMENT_ICONS,
} from "@/types/achievement-types";
import { getAchievementCategoryIcon } from "@/lib/achievements";
import { CheckCircle, Lock } from "lucide-react";

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

  const isLocked = progress === 0 && !isCompleted;
  const cardSize = size === "sm" ? "p-3" : size === "lg" ? "p-6" : "p-7";
  const titleSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  const renderIcon = () => {
    if (
      achievementData.icon &&
      ACHIEVEMENT_ICONS[achievementData.icon as keyof typeof ACHIEVEMENT_ICONS]
    ) {
      const IconComponent =
        ACHIEVEMENT_ICONS[
          achievementData.icon as keyof typeof ACHIEVEMENT_ICONS
        ];
      return <IconComponent className="h-5 w-5 text-white" />;
    }
    const CategoryIcon = getAchievementCategoryIcon(achievementData.category);
    return <CategoryIcon className="h-5 w-5 text-white" />;
  };

  return (
    <div
      className={`border rounded-lg transition-all duration-200 ${
        isCompleted
          ? "border-red-500/30 bg-red-50/50 dark:border-red-500/40 dark:bg-red-950/20"
          : isLocked
          ? "border-border bg-muted/30 opacity-70"
          : "border-red-500/20 hover:border-red-500/40 bg-card"
      }`}
    >
      <div className={`${cardSize}`}>
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isCompleted ? "bg-red-500" : isLocked ? "bg-muted" : "bg-red-500"
            }`}
          >
            {isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              renderIcon()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className={`${titleSize} font-medium leading-tight ${
                isLocked ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {achievementData.name}
            </h4>
            <p
              className={`text-xs text-muted-foreground mt-1 line-clamp-2 ${
                isLocked ? "opacity-60" : ""
              }`}
            >
              {achievementData.description}
            </p>
          </div>

          {isCompleted && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`text-xs px-2 py-1 rounded ${
              isCompleted
                ? "bg-red-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            +{achievementData.xpReward} XP
          </div>

          {!isLocked && (
            <span className="text-xs text-muted-foreground">
              {isCompleted ? "Complete" : `${Math.round(progressPercentage)}%`}
            </span>
          )}
        </div>

        {!isLocked && !isCompleted && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {progress} / {achievementData.requirement}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        )}

        {isCompleted && achievement.unlockedAt && (
          <div className="mt-3">
            <p className="text-xs text-red-500">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
