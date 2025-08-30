"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedAchievements = getCompletedAchievements();
  const inProgressAchievements = getInProgressAchievements();
  const lockedAchievements = getLockedAchievements();
  const completionRate = getCompletionRate();

  return (
    <div className="space-y-6 mb-12 lg:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserLevel />
        <Card className="border-red-500/20 hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-red-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span>
                  {completedAchievements.length} / {achievements.length}
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover:border-red-200 dark:hover:border-red-800 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <div className="flex justify-between text-xs">
              <span>In Progress:</span>
              <Badge variant="secondary">{inProgressAchievements.length}</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span>Locked:</span>
              <Badge variant="outline">{lockedAchievements.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="STREAK" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Streak
              </TabsTrigger>
              <TabsTrigger value="HABITS" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Habits
              </TabsTrigger>
              <TabsTrigger
                value="CONSISTENCY"
                className="flex items-center gap-1"
              >
                <Calendar className="h-3 w-3" />
                Consistency
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-6">
                {completedAchievements.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed ({completedAchievements.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedAchievements.map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {inProgressAchievements.length > 0 && (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      In Progress ({inProgressAchievements.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inProgressAchievements.map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {lockedAchievements.length > 0 && (
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Locked ({lockedAchievements.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lockedAchievements.map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {(["STREAK", "HABITS", "CONSISTENCY"] as const).map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getAchievementsByCategory(category).map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
