import { FrequencyType, PriorityType } from "@prisma/client";

interface HabitLog {
  id: string;
  date: string;
  isCompleted: boolean;
  habitId: string;
  createdAt: string;
}

export interface GoalProgress {
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  isAchieved: boolean;
}

export interface DateHabits {
  id: string;
  date: string;
  isCompleted: boolean;
  habitId: string;
  habit: {
    id: string;
    title: string;
    category?: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  };
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: "COMPLETED" | "PENDING" | "ONGOING";
  priority: "HIGH" | "MEDIUM" | "LOW";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  goalTarget?: number;
  isGoalActive?: boolean;
  createdAt: string;
  HabitLogs: HabitLog[];
  currentStreak: number;
  completedToday: boolean;
  goalProgress: GoalProgress;
  totalCompletions: number;
  lastCompletionDate: string | null;
}

export const PREDEFINED_CATEGORIES = [
  "Health & Fitness",
  "Productivity",
  "Learning",
  "Personal Development",
  "Relationships",
  "Finance",
  "Creativity",
  "Mindfulness",
  "Career",
  "Home & Organization",
  "Social",
  "Other",
];

export interface HabitCardProps {
  habit: Habit;
  isLoading: boolean;
  isStatusUpdating: boolean;
  onToggleCompletion: (
    habitId: string,
    date: string,
    isCompleted: boolean
  ) => void;
  onUpdateStatus: (
    habitId: string,
    status: "COMPLETED" | "PENDING" | "ONGOING"
  ) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const predefinedHabits: Array<{
  title: string;
  description?: string;
  category?: string;
  frequency: FrequencyType;
  priority: PriorityType;
  goalTarget?: number;
}> = [
  {
    title: "Morning Walk",
    description: "Walk for 20 minutes",
    category: "Health",
    frequency: "DAILY",
    priority: "MEDIUM",
    goalTarget: 7,
  },
  {
    title: "Read Books",
    description: "Read 10 pages",
    category: "Learning",
    frequency: "DAILY",
    priority: "LOW",
    goalTarget: 7,
  },
  {
    title: "Weekly Review",
    description: "Plan the next week",
    category: "Planning",
    frequency: "WEEKLY",
    priority: "HIGH",
    goalTarget: 4,
  },
];

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  suggestions?: HabitSuggestion[];
  timestamp: Date;
}

export interface HabitSuggestion {
  title: string;
  description: string;
  category: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  priority: "HIGH" | "MEDIUM" | "LOW";
  goalTarget: number;
  reasoning: string;
}
