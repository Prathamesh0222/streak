export interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  goalTarget?: number;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: "drink-water",
    title: "Drink 8 glasses of water",
    description:
      "Stay hydrated by drinking at least 8 glasses of water throughout the day",
    category: "Health & Fitness",
    priority: "HIGH",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "exercise",
    title: "Exercise for 30 minutes",
    description: "Get your body moving with 30 minutes of physical activity",
    category: "Health & Fitness",
    priority: "HIGH",
    frequency: "DAILY",
    goalTarget: 21,
  },
  {
    id: "walk-steps",
    title: "Walk 10,000 steps",
    description: "Aim for 10,000 steps daily to maintain an active lifestyle",
    category: "Health & Fitness",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "meditation",
    title: "Meditate for 10 minutes",
    description: "Practice mindfulness and reduce stress with daily meditation",
    category: "Mindfulness",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 21,
  },
  {
    id: "sleep-early",
    title: "Sleep before 11 PM",
    description:
      "Maintain a healthy sleep schedule by going to bed before 11 PM",
    category: "Health & Fitness",
    priority: "HIGH",
    frequency: "DAILY",
    goalTarget: 30,
  },

  // Productivity
  {
    id: "read-books",
    title: "Read for 30 minutes",
    description: "Dedicate time daily to reading books and expanding knowledge",
    category: "Learning",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "journal",
    title: "Write in journal",
    description: "Reflect on your day and thoughts through daily journaling",
    category: "Personal Development",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "no-phone-morning",
    title: "No phone for first hour",
    description: "Start your morning without immediately checking your phone",
    category: "Productivity",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 21,
  },
  {
    id: "learn-language",
    title: "Practice a new language",
    description: "Spend 15 minutes daily learning or practicing a new language",
    category: "Learning",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "clean-workspace",
    title: "Clean and organize workspace",
    description:
      "Keep your workspace tidy and organized for better productivity",
    category: "Home & Organization",
    priority: "LOW",
    frequency: "DAILY",
    goalTarget: 21,
  },

  // Personal Development
  {
    id: "gratitude",
    title: "Write 3 things you're grateful for",
    description:
      "Practice gratitude by writing down three things you're thankful for",
    category: "Personal Development",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "skill-practice",
    title: "Practice a skill for 30 minutes",
    description: "Dedicate time to practicing and improving a specific skill",
    category: "Personal Development",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },

  // Social & Relationships
  {
    id: "call-family",
    title: "Call family or friends",
    description: "Stay connected with loved ones through regular phone calls",
    category: "Relationships",
    priority: "MEDIUM",
    frequency: "WEEKLY",
    goalTarget: 3,
  },
  {
    id: "compliment-someone",
    title: "Give someone a genuine compliment",
    description: "Spread positivity by giving someone a heartfelt compliment",
    category: "Relationships",
    priority: "LOW",
    frequency: "DAILY",
    goalTarget: 21,
  },

  // Finance
  {
    id: "track-expenses",
    title: "Track daily expenses",
    description: "Monitor your spending by recording all daily expenses",
    category: "Finance",
    priority: "MEDIUM",
    frequency: "DAILY",
    goalTarget: 30,
  },
  {
    id: "save-money",
    title: "Save $5 daily",
    description: "Build your savings by setting aside a small amount each day",
    category: "Finance",
    priority: "HIGH",
    frequency: "DAILY",
    goalTarget: 30,
  },

  // Creativity
  {
    id: "creative-time",
    title: "Spend 20 minutes being creative",
    description:
      "Engage in any creative activity like drawing, writing, or crafting",
    category: "Creativity",
    priority: "LOW",
    frequency: "DAILY",
    goalTarget: 21,
  },

  // Career
  {
    id: "network",
    title: "Connect with one professional",
    description:
      "Expand your network by reaching out to one professional contact",
    category: "Career",
    priority: "MEDIUM",
    frequency: "WEEKLY",
    goalTarget: 2,
  },
];
