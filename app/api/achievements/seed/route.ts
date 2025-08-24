import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PREDEFINED_ACHIEVEMENTS } from "@/types/achievement-types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const achievementsToCreate = PREDEFINED_ACHIEVEMENTS.map((config) => ({
      name: config.name,
      description: config.description,
      icon: config.icon,
      xpReward: config.xpReward,
      category: config.category,
      requirement: config.requirement,
      isActive: true,
    }));

    for (const achievement of achievementsToCreate) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement,
      });
    }

    const users = await prisma.user.findMany({
      select: { id: true },
    });

    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      const userAchievements = achievements.map((achievement) => ({
        userId: user.id,
        achievementId: achievement.id,
        progress: 0,
        isCompleted: false,
      }));

      await prisma.userAchievement.createMany({
        data: userAchievements,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      message: "Achievements seeded successfully",
      count: achievementsToCreate.length,
    });
  } catch (error) {
    console.error("Error seeding achievements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
