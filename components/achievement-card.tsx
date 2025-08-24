"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AchievementProgress } from "@/types/achievement-types";
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

  return (
    <Card
      className={`relative transition-all duration-200 ${
        isCompleted
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
          : isLocked
          ? "opacity-60"
          : "hover:shadow-md"
      }`}
    >
      <CardHeader className={`${cardSize} pb-2`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {(() => {
              if (achievementData.icon) {
                return <span className="text-lg">{achievementData.icon}</span>;
              }
              const CategoryIcon = getAchievementCategoryIcon(
                achievementData.category
              );
              return <CategoryIcon className="h-4 w-4" />;
            })()}
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

      {!isLocked && (
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
