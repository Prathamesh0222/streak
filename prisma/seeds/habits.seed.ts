import { predefinedHabits } from "@/types/habit-types";
import type { PrismaClient } from "@prisma/client";

export const seedHabits = async (prisma: PrismaClient) => {
  console.log("Seeding: habits");

  const demo = await prisma.user.findUnique({
    where: { email: "demo@streak.app" },
    select: { id: true },
  });

  if (!demo) {
    console.warn("Demo user not found; skipping habit seeds");
    return;
  }

  for (const h of predefinedHabits) {
    const habitId = `${demo.id}-${h.title.toLowerCase().split(" ").join("-")}`;

    await prisma.habit.upsert({
      where: { id: habitId },
      update: {
        title: h.title,
        description: h.description,
        category: h.category,
        frequency: h.frequency,
        priority: h.priority,
        goalTarget: h.goalTarget,
        userId: demo.id,
      },
      create: {
        id: habitId,
        title: h.title,
        description: h.description,
        category: h.category,
        frequency: h.frequency,
        priority: h.priority,
        goalTarget: h.goalTarget,
        userId: demo.id,
      },
    });
  }

  console.log("Seeding: habits done");
};
