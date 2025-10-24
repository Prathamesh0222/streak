import { getLevelFromXp } from "@/lib/achievements";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/streak";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const { habitId } = body;

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
    const totalHabits = user.Habit.length;
    let consecutiveDays = 0;

    user.Habit.forEach((habit) => {
      const streak = calculateStreak(habit.HabitLogs);
      maxStreak = Math.max(maxStreak, streak);
      if (habit.id === habitId) {
        maxStreak = streak;
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

      if (newLevel > user.level) {
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            type: "LEVEL_UP",
            title: `Level ${newLevel} reached!`,
            body: `You gained ${totalXpGained} XP`,
          },
        });
      }
    }

    if (newlyCompleted.length > 0) {
      await prisma.notification.createMany({
        data: newlyCompleted.map((a) => ({
          userId: session.user.id,
          type: "ACHIEVEMENT",
          title: `Achievement Unlocked: ${a.name}`,
          body: `You've unlocked a new achievement: ${a.name}`,
        })),
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
