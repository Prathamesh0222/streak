"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import { getLevelBadge } from "@/lib/achievements";

export function UserLevel() {
  const { userProgress, loading } = useAchievements();

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage =
    (userProgress.xp / userProgress.xpForCurrentLevel) * 100;

  return (
    <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
      <div className="p-5 bg-background border border-red-500/20 rounded-lg">
        <div className="flex items-center gap-2 text-sm font-semibold mb-4">
          {(() => {
            const LevelIcon = getLevelBadge(userProgress.level);
            return <LevelIcon className="h-5 w-5 text-red-500" />;
          })()}
          Level {userProgress.level}
          <Badge
            variant="outline"
            className="text-xs font-semibold rounded-lg border border-red-500/20 text-red-500 dark:text-red-400"
          >
            {userProgress.totalXp} XP
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {userProgress.xp} / {userProgress.xpForCurrentLevel} XP
            </span>
            <span>{userProgress.xpToNextLevel} to next level</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-right">
            <span className="text-xs font-semibold text-red-500 dark:text-red-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
