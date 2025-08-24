import {
  Trophy,
  Gem,
  Star,
  Medal,
  Sprout,
  Flame,
  NotebookPen,
  Calendar,
  Award,
} from "lucide-react";

export function getXpForLevel(level: number): number {
  return Math.floor((100 * level * (level + 1)) / 2);
}

export function getLevelFromXp(totalXp: number): {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
} {
  let level = 1;
  let xpUsed = 0;

  while (true) {
    const xpForNextLevel = getXpForLevel(level);
    if (xpUsed + xpForNextLevel > totalXp) {
      break;
    }
    xpUsed += xpForNextLevel;
    level++;
  }

  const currentXp = totalXp - xpUsed;
  const xpForCurrentLevel = getXpForLevel(level);
  const xpToNextLevel = xpForCurrentLevel - currentXp;

  return {
    level,
    currentXp,
    xpToNextLevel,
    xpForCurrentLevel,
  };
}

export function calculateProgressPercentage(
  current: number,
  target: number
): number {
  return Math.min((current / target) * 100, 100);
}

export function getLevelColor(level: number): string {
  if (level >= 50) return "text-purple-500";
  if (level >= 25) return "text-blue-500";
  if (level >= 10) return "text-green-500";
  if (level >= 5) return "text-yellow-500";
  return "text-gray-500";
}

export function getLevelBadge(level: number) {
  if (level >= 50) return Trophy;
  if (level >= 25) return Gem;
  if (level >= 10) return Star;
  if (level >= 5) return Medal;
  return Sprout;
}

export function getAchievementCategoryIcon(category: string) {
  switch (category) {
    case "STREAK":
      return Flame;
    case "HABITS":
      return NotebookPen;
    case "CONSISTENCY":
      return Calendar;
    default:
      return Award;
  }
}

export function getAchievementCategoryColor(category: string): string {
  switch (category) {
    case "STREAK":
      return "text-orange-500";
    case "HABITS":
      return "text-blue-500";
    case "CONSISTENCY":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}
