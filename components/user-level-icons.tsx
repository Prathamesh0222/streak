"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import {
  getLevelBadge,
  getLevelColor,
  getAchievementCategoryIcon,
} from "@/lib/achievements";
import { ACHIEVEMENT_ICONS } from "@/types/achievement-types";
import { Progress } from "./ui/progress";

export function UserLevelIcon() {
  const { userProgress, loading, achievements } = useAchievements();

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

  const completedAchievements = achievements.filter((a) => a.isCompleted);

  const renderAchievementIcon = (achievement: any) => {
    if (
      achievement.achievement.icon &&
      ACHIEVEMENT_ICONS[
        achievement.achievement.icon as keyof typeof ACHIEVEMENT_ICONS
      ]
    ) {
      const IconComponent =
        ACHIEVEMENT_ICONS[
          achievement.achievement.icon as keyof typeof ACHIEVEMENT_ICONS
        ];
      return <IconComponent className="h-4 w-4" />;
    }
    const CategoryIcon = getAchievementCategoryIcon(
      achievement.achievement.category
    );
    return <CategoryIcon className="h-4 w-4" />;
  };

  return (
    <Card className="w-auto gap-2  border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
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
          {userProgress.xp} / {userProgress.xpForCurrentLevel} XP
          <Progress className="w-[40%]" value={progressPercentage} />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {completedAchievements.length > 0 && (
          <div>
            <div className="flex gap-2">
              {completedAchievements.slice(0, 4).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center p-2 rounded-lg bg-red-800/50 dark:bg-red-800/20 border border-red-700/50 min-w-[80px] hover:bg-red-800/70 transition-colors"
                  title={`${achievement.achievement.name} - ${achievement.achievement.description}`}
                >
                  <div className="w-8 h-8 rounded-full bg-red-700/50 flex items-center justify-center mb-2 border border-red-600/30 dark:bg-red-800/20 dark:border-red-700/30">
                    {renderAchievementIcon(achievement)}
                  </div>

                  <p className="text-xs font-medium text-red-200 text-center leading-tight mb-1 line-clamp-2">
                    {achievement.achievement.name}
                  </p>

                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-1 py-0.5"
                  >
                    +{achievement.achievement.xpReward} XP
                  </Badge>
                </div>
              ))}
              {completedAchievements.length > 4 && (
                <div className="flex items-center justify-center min-w-[80px]">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 text-red-400 border-red-500/30"
                  >
                    +{completedAchievements.length - 4}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
