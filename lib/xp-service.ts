import { Prisma } from "@prisma/client";
import { getLevelFromXp } from "./achievements";
import { prisma } from "./prisma";

interface HabitCompletionData {
  habitId: string;
  userId: string;
  habitPriority: "HIGH" | "MEDIUM" | "LOW";
  habitTitle: string;
}

const calculateHabitXp = (priority: "HIGH" | "MEDIUM" | "LOW") => {
  switch (priority) {
    case "HIGH":
      return 15;
    case "MEDIUM":
      return 12;
    case "LOW":
      return 8;
    default:
      return 10;
  }
};

export const createXpNotifications = async (
  tx: Prisma.TransactionClient,
  data: HabitCompletionData,
  xpGained: number,
  leveledUp: boolean,
  newLevel: number
) => {
  const notifications = [
    {
      userId: data.userId,
      type: "XP_GAINED",
      title: "XP Gained!",
      body: `You earned ${xpGained} XP for completing "${data.habitTitle}"!`,
    },
  ];

  if (leveledUp) {
    notifications.push({
      userId: data.userId,
      type: "LEVEL_UP",
      title: "Level Up!",
      body: `Congratulations! You've reached level ${newLevel}!`,
    });
  }

  await tx.notification.createMany({ data: notifications });
};

export const processHabitCompletion = async (data: HabitCompletionData) => {
  const xpGained = calculateHabitXp(data.habitPriority);
  return await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: data.userId,
      },
      data: {
        xp: {
          increment: xpGained,
        },
      },
      select: {
        xp: true,
        level: true,
      },
    });

    const newTotalXp = updatedUser.xp;
    const currentLevel = updatedUser.level || 1;

    const levelInfo = getLevelFromXp(newTotalXp);
    const newLevel = levelInfo.level;
    const leveledUp = newLevel > currentLevel;

    if (leveledUp) {
      await tx.user.update({
        where: {
          id: data.userId,
        },
        data: {
          level: newLevel,
        },
      });
    }

    await createXpNotifications(tx, data, xpGained, leveledUp, newLevel);

    return {
      xpGained,
      newTotalXp,
      newLevel,
      leveledUp,
      xpToNextLevel: levelInfo.xpToNextLevel,
    };
  });
};
