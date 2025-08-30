"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  const cardSize = size === "sm" ? "p-3" : size === "lg" ? "p-6" : "p-4";
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
    <Card
      className={`border transition-all duration-200 ${
        isCompleted
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
          : isLocked
          ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/50 opacity-60"
          : "border-red-500/20 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md"
      }`}
    >
      <CardHeader className={`${cardSize} pb-2`}>
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isCompleted
                ? "bg-red-500"
                : isLocked
                ? "bg-gray-400"
                : "bg-red-500"
            }`}
          >
            {isLocked ? <Lock className="h-4 w-4 text-white" /> : renderIcon()}
          </div>

          <div className="flex-1">
            <CardTitle
              className={`${titleSize} ${
                isLocked ? "text-muted-foreground" : ""
              }`}
            >
              {achievementData.name}
            </CardTitle>
            <p
              className={`text-xs text-muted-foreground mt-1 ${
                isLocked ? "opacity-60" : ""
              }`}
            >
              {achievementData.description}
            </p>
          </div>

          {isCompleted && (
            <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Badge
            variant="secondary"
            className="text-xs bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            +{achievementData.xpReward} XP
          </Badge>

          {!isLocked && (
            <span className="text-xs text-muted-foreground">
              {isCompleted ? "Complete" : `${Math.round(progressPercentage)}%`}
            </span>
          )}
        </div>
      </CardHeader>

      {!isLocked && !isCompleted && (
        <CardContent className={`${cardSize} pt-0`}>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {progress} / {achievementData.requirement}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        </CardContent>
      )}

      {isCompleted && achievement.unlockedAt && (
        <CardContent className={`${cardSize} pt-0`}>
          <p className="text-xs text-red-600 dark:text-red-400">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
