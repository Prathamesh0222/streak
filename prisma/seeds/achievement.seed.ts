import { PREDEFINED_ACHIEVEMENTS } from "@/types/achievement-types";
import { PrismaClient } from "@prisma/client";

export const seedAchievements = async (prisma: PrismaClient) => {
  console.log("Seeding: Achievements");

  for (const cfg of PREDEFINED_ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { name: cfg.name },
      update: {
        description: cfg.description,
        icon: cfg.icon,
        xpReward: cfg.xpReward,
        category: cfg.category,
        requirement: cfg.requirement,
        isActive: true,
      },
      create: {
        name: cfg.name,
        description: cfg.description,
        icon: cfg.icon,
        xpReward: cfg.xpReward,
        category: cfg.category,
        requirement: cfg.requirement,
        isActive: true,
      },
    });
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  const achievements = await prisma.achievement.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await prisma.userAchievement.createMany({
      data: achievements.map((achievement) => ({
        userId: user.id,
        achievementId: achievement.id,
        progress: 0,
        isCompleted: false,
      })),
      skipDuplicates: true,
    });
  }

  console.log("Seeding achievements done");
};
