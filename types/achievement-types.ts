export type AchievementCategory = "STREAK" | "HABITS" | "CONSISTENCY";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  xpReward: number;
  category: AchievementCategory;
  requirement: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  achievement?: Achievement;
}

export interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
}

export interface AchievementProgress extends UserAchievement {
  achievement: Achievement;
  progressPercentage: number;
}

export interface AchievementConfig {
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: AchievementCategory;
  requirement: number;
}

export const PREDEFINED_ACHIEVEMENTS: AchievementConfig[] = [
  // Streak achievements
  {
    name: "First Steps",
    description: "Complete a 3-day habit streak",
    icon: "🎯",
    xpReward: 50,
    category: "STREAK",
    requirement: 3,
  },
  {
    name: "Week Warrior",
    description: "Complete a 7-day habit streak",
    icon: "⚡",
    xpReward: 100,
    category: "STREAK",
    requirement: 7,
  },
  {
    name: "Streak Master",
    description: "Complete a 30-day habit streak",
    icon: "🔥",
    xpReward: 500,
    category: "STREAK",
    requirement: 30,
  },
  {
    name: "Legendary Streak",
    description: "Complete a 100-day habit streak",
    icon: "👑",
    xpReward: 1000,
    category: "STREAK",
    requirement: 100,
  },
  // Habit count achievements
  {
    name: "Habit Beginner",
    description: "Create your first habit",
    icon: "🌱",
    xpReward: 25,
    category: "HABITS",
    requirement: 1,
  },
  {
    name: "Habit Builder",
    description: "Create 5 habits",
    icon: "🏗️",
    xpReward: 150,
    category: "HABITS",
    requirement: 5,
  },
  {
    name: "Habit Master",
    description: "Create 10 habits",
    icon: "🎪",
    xpReward: 300,
    category: "HABITS",
    requirement: 10,
  },
  // Consistency achievements
  {
    name: "Consistent Player",
    description: "Complete habits for 7 consecutive days",
    icon: "📅",
    xpReward: 200,
    category: "CONSISTENCY",
    requirement: 7,
  },
  {
    name: "Consistency King",
    description: "Complete habits for 30 consecutive days",
    icon: "🏆",
    xpReward: 750,
    category: "CONSISTENCY",
    requirement: 30,
  },
];
