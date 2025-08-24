import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

function getXpForLevel(level: number): number {
  return Math.floor((100 * level * (level + 1)) / 2);
}

function getLevelFromXp(totalXp: number): { level: number; currentXp: number } {
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

  return {
    level,
    currentXp: totalXp - xpUsed,
  };
}

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { habitId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        Habit: {
          include: {
            HabitLogs: {
              where: { isCompleted: true },
              orderBy: { date: "desc" },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let maxStreak = 0;
    let currentStreak = 0;
    let totalHabits = user.Habit.length;
    let consecutiveDays = 0;

    user.Habit.forEach((habit) => {
      const streak = calculateStreak(habit.HabitLogs);
      maxStreak = Math.max(maxStreak, streak);
      if (habit.id === habitId) {
        currentStreak = streak;
      }
    });

    consecutiveDays = maxStreak;

    const incompleteAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: session.user.id,
        isCompleted: false,
      },
      include: {
        achievement: true,
      },
    });

    const newlyCompleted = [];
    let totalXpGained = 0;

    for (const userAchievement of incompleteAchievements) {
      const achievement = userAchievement.achievement;
      let newProgress = userAchievement.progress;
      let isCompleted = false;

      switch (achievement.category) {
        case "STREAK":
          newProgress = maxStreak;
          isCompleted = maxStreak >= achievement.requirement;
          break;
        case "HABITS":
          newProgress = totalHabits;
          isCompleted = totalHabits >= achievement.requirement;
          break;
        case "CONSISTENCY":
          newProgress = consecutiveDays;
          isCompleted = consecutiveDays >= achievement.requirement;
          break;
      }

      if (newProgress !== userAchievement.progress || isCompleted) {
        await prisma.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: newProgress,
            isCompleted,
            unlockedAt: isCompleted ? new Date() : userAchievement.unlockedAt,
          },
        });

        if (isCompleted && !userAchievement.isCompleted) {
          newlyCompleted.push(achievement);
          totalXpGained += achievement.xpReward;
        }
      }
    }

    if (totalXpGained > 0) {
      const newTotalXp = user.totalXp + totalXpGained;
      const { level: newLevel, currentXp } = getLevelFromXp(newTotalXp);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: currentXp,
          totalXp: newTotalXp,
          level: newLevel,
        },
      });
    }

    return NextResponse.json({
      message: "Achievements checked successfully",
      newlyCompleted,
      xpGained: totalXpGained,
      leveledUp:
        totalXpGained > 0 &&
        getLevelFromXp(user.totalXp + totalXpGained).level > user.level,
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

function calculateStreak(logs: any[]): number {
  if (!logs || logs.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sortedLogs = logs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const todayLog = sortedLogs.find((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  const startDate = todayLog ? today : new Date(sortedLogs[0].date);
  startDate.setHours(0, 0, 0, 0);

  let streak = 0;

  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(startDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const hasLogForDate = sortedLogs.some((log) => {
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
