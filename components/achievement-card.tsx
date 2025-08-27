"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AchievementProgress,
  ACHIEVEMENT_ICONS,
} from "@/types/achievement-types";
import {
  getAchievementCategoryColor,
  getAchievementCategoryIcon,
} from "@/lib/achievements";
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
      return <IconComponent className="h-5 w-5" />;
    }
    const CategoryIcon = getAchievementCategoryIcon(achievementData.category);
    return <CategoryIcon className="h-5 w-5" />;
  };

  return (
    <Card
      className={`relative transition-all duration-200 ${
        isCompleted
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
          : isLocked
          ? "opacity-60"
          : "hover:shadow-md"
      }`}
    >
      <CardHeader className={`${cardSize} pb-2`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">{renderIcon()}</div>
            <div>
              <CardTitle
                className={`${titleSize} ${
                  isLocked ? "text-muted-foreground" : ""
                }`}
              >
                {achievementData.name}
              </CardTitle>
              <p
                className={`text-xs text-muted-foreground ${
                  isLocked ? "opacity-60" : ""
                }`}
              >
                {achievementData.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : isLocked ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : null}

            <Badge
              variant="secondary"
              className={`text-xs ${getAchievementCategoryColor(
                achievementData.category
              )}`}
            >
              +{achievementData.xpReward} XP
            </Badge>
          </div>
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
            {isCompleted && achievement.unlockedAt && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
