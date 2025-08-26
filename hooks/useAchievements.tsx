import {
  Achievement,
  AchievementProgress,
  UserProgress,
} from "@/types/achievement-types";
import { getLevelFromXp } from "@/lib/achievements";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AchievementsData {
  achievements: AchievementProgress[];
  userProgress: UserProgress;
}

export const useAchievements = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: async (): Promise<AchievementsData> => {
      const response = await axios.get("/api/achievements");
      const { achievements, userProgress } = response.data;

      const levelInfo = getLevelFromXp(userProgress.totalXp);

      return {
        achievements,
        userProgress: {
          ...userProgress,
          ...levelInfo,
        },
      };
    },
  });

  const checkAchievements = useMutation({
    mutationFn: async ({
      habitId,
      action,
    }: {
      habitId: string;
      action: string;
    }) => {
      const response = await axios.post("/api/achievements/check", {
        habitId,
        action,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.newlyCompleted && data.newlyCompleted.length > 0) {
        data.newlyCompleted.forEach((achievement: Achievement) => {
          toast.success(
            `Achievement Unlocked: ${achievement.name}! +${achievement.xpReward} XP`,
            { duration: 5000 }
          );
        });
      }

      if (data.leveledUp) {
        toast.success("Level Up! You've reached a new level!", {
          duration: 5000,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: () => {
      toast.error("Failed to check achievements");
    },
  });

  const initializeAchievements = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/achievements");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievements initialized!");
    },
    onError: () => {
      toast.error("Failed to initialize achievements");
    },
  });

  const getCompletedAchievements = () => {
    return data?.achievements.filter((a) => a.isCompleted) || [];
  };

  const getInProgressAchievements = () => {
    return (
      data?.achievements.filter((a) => !a.isCompleted && a.progress > 0) || []
    );
  };

  const getLockedAchievements = () => {
    return (
      data?.achievements.filter((a) => !a.isCompleted && a.progress === 0) || []
    );
  };

  const getAchievementsByCategory = (category: string) => {
    return (
      data?.achievements.filter((a) => a.achievement.category === category) ||
      []
    );
  };

  const getCompletionRate = () => {
    if (!data?.achievements.length) return 0;
    const completed = getCompletedAchievements().length;
    return (completed / data.achievements.length) * 100;
  };

  return {
    achievements: data?.achievements || [],
    userProgress: data?.userProgress || {
      level: 1,
      xp: 0,
      totalXp: 0,
      xpToNextLevel: 100,
      xpForCurrentLevel: 100,
    },
    loading,
    error,
    checkAchievements: (habitId: string, action: string = "complete") =>
      checkAchievements.mutate({ habitId, action }),
    initializeAchievements: () => initializeAchievements.mutate(),
    isCheckingAchievements: checkAchievements.isPending,
    getCompletedAchievements,
    getInProgressAchievements,
    getLockedAchievements,
    getAchievementsByCategory,
    getCompletionRate,
  };
};
