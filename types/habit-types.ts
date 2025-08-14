interface HabitLog {
  id: string;
  date: string;
  isCompleted: boolean;
  habitId: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: "COMPLETED" | "PENDING" | "ONGOING";
  priority: "HIGH" | "MEDIUM" | "LOW";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  goalType: "STREAK" | "WEEKLY_TARGET" | "MONTHLY_TARGET";
  goalTarget?: number;
  goalDeadline?: number;
  isGoalActive?: boolean;
  createdAt: string;
  HabitLogs: HabitLog[];
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

export interface GoalProgress {
  currentValue: number;
  targetValue: number;
  progressPercentage: number;
  isAchieved: boolean;
  daysRemaining?: number;
}

export interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  completionRate: number;
  currentStreak: number;
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
  goalProgress?: GoalProgress | null;
}
