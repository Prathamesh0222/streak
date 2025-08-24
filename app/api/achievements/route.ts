import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
      include: {
        UserAchievements: {
          where: { userId: session.user.id },
        },
      },
      orderBy: { requirement: "asc" },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { level: true, xp: true, totalXp: true },
    });

    const achievementsWithProgress = achievements.map((achievement) => {
      const userAchievement = achievement.UserAchievements[0];
      return {
        id: userAchievement?.id || `temp-${achievement.id}`,
        userId: session.user.id,
        achievementId: achievement.id,
        unlockedAt: userAchievement?.unlockedAt || new Date(),
        progress: userAchievement?.progress || 0,
        isCompleted: userAchievement?.isCompleted || false,
        achievement: {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          xpReward: achievement.xpReward,
          category: achievement.category,
          requirement: achievement.requirement,
          isActive: achievement.isActive,
          createdAt: achievement.createdAt,
        },
        progressPercentage: Math.min(
          ((userAchievement?.progress || 0) / achievement.requirement) * 100,
          100
        ),
      };
    });

    return NextResponse.json({
      achievements: achievementsWithProgress,
      userProgress: user,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: { isActive: true },
    });

    const userAchievements = achievements.map((achievement) => ({
      userId: session.user.id,
      achievementId: achievement.id,
      progress: 0,
      isCompleted: false,
    }));

    await prisma.userAchievement.createMany({
      data: userAchievements,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Achievements initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing achievements:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
