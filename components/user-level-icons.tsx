"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAchievements } from "@/hooks/useAchievements";
import { getLevelColor, getAchievementCategoryIcon } from "@/lib/achievements";
import { ACHIEVEMENT_ICONS } from "@/types/achievement-types";
import { Progress } from "./ui/progress";
import { ArrowBigUp } from "lucide-react";
import { CustomCard, CustomContent } from "./custom-card";

export function UserLevelIcon() {
  const { userProgress, loading, achievements } = useAchievements();

  if (loading) {
    return (
      <Card className="w-full bg-background border shadow-none border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage =
    (userProgress.xp / userProgress.xpForCurrentLevel) * 100;

  const completedAchievements = achievements.filter((a) => a.isCompleted);

  const renderAchievementIcon = (achievement: {
    achievement: { icon?: string; category: string };
  }) => {
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
      return <IconComponent className="h-5 w-5 text-white" />;
    }
    const CategoryIcon = getAchievementCategoryIcon(
      achievement.achievement.category
    );
    return <CategoryIcon className="h-5 w-5 text-white" />;
  };

  return (
    <CustomCard className="w-full border border-red-500/20 hover:border-red-200 dark:hover:border-red-900/60 transition-all duration-300 to-red-50/50 dark:to-red-950/20 p-0.5 mb-2 md:mb-0">
      <CustomContent>
        <div className="flex flex-col gap-2 w-full h-full bg-background rounded-lg border border-red-500/20 p-4">
          <h1 className="font-semibold">Your Progress</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg hover:scale-115 transition-all duration-300">
                  <ArrowBigUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      Level {userProgress.level}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`${getLevelColor(
                        userProgress.level
                      )} text-xs font-medium border`}
                    >
                      {userProgress.totalXp} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userProgress.xp} / {userProgress.xpForCurrentLevel} XP to
                    next level
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Progress
                value={progressPercentage}
                className="h-3 bg-red-100 dark:bg-red-950/30"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(progressPercentage)}% to next level</span>
                <span>
                  {userProgress.xpForCurrentLevel - userProgress.xp} XP
                  remaining
                </span>
              </div>
            </div>
          </div>

          {completedAchievements.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Recent Achievements</h4>
                <Badge variant="outline" className="text-xs">
                  {completedAchievements.length} earned
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {completedAchievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border border-red-200/50 dark:border-red-800/30"
                    title={`${achievement.achievement.name} - ${achievement.achievement.description}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-2 shadow-lg hover:scale-115 transition-all duration-300">
                      {renderAchievementIcon(achievement)}
                    </div>

                    <p className="text-xs font-medium text-center leading-tight mb-2 line-clamp-2 text-foreground text-ellipsis overflow-hidden">
                      {achievement.achievement.name}
                    </p>

                    <Badge
                      variant="secondary"
                      className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5"
                    >
                      +{achievement.achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </div>
              {completedAchievements.length > 4 && (
                <div className="text-center pt-2">
                  <Badge
                    variant="outline"
                    className="text-xs px-3 py-1 text-red-500 border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    +{completedAchievements.length - 4} more achievements
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No achievements yet</p>
              <p className="text-xs">
                Complete habits to earn your first achievement!
              </p>
            </div>
          )}
        </div>
      </CustomContent>
    </CustomCard>
  );
}
