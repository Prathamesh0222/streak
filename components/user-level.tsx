"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import { getLevelBadge, getLevelColor } from "@/lib/achievements";

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
    <div className="bg-card border border-red-500/20 rounded-lg p-3">
      <div className="p-4 pb-3">
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          {(() => {
            const LevelIcon = getLevelBadge(userProgress.level);
            return <LevelIcon className="h-4 w-4" />;
          })()}
          Level {userProgress.level}
          <Badge
            variant="secondary"
            className={getLevelColor(userProgress.level)}
          >
            {userProgress.totalXp} XP
          </Badge>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {userProgress.xp} / {userProgress.xpForCurrentLevel} XP
            </span>
            <span>{userProgress.xpToNextLevel} to next level</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
}
