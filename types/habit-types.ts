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
