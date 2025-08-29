export interface HabitLog {
  date: Date | string;
  isCompleted: boolean;
}

export function calculateStreak(logs: HabitLog[]): number {
  if (!logs || logs.length === 0) return 0;

  const completedLogs = logs
    .filter((log) => log.isCompleted)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedLogs.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLog = completedLogs.find((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  const startDate = todayLog ? today : new Date(completedLogs[0].date);
  startDate.setHours(0, 0, 0, 0);

  let streak = 0;

  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const hasLogForDate = completedLogs.some((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === checkDate.getTime();
    });

    if (hasLogForDate) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function isCompletedToday(logs: HabitLog[]): boolean {
  const today = new Date().toLocaleDateString("en-CA");
  return logs.some((log) => {
    const logDate = new Date(log.date).toLocaleDateString("en-CA");
    return logDate === today && log.isCompleted;
  });
}

export function calculateGoalProgress(
  logs: HabitLog[],
  goalTarget: number = 7
) {
  const currentValue = calculateStreak(logs);
  const targetValue = goalTarget;
  const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);
  const isAchieved = currentValue >= targetValue;

  return {
    currentValue,
    targetValue,
    progressPercentage,
    isAchieved,
  };
}

export const getWeekRange = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
};
