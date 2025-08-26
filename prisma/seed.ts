import { prisma } from "@/lib/prisma";
import { seedUsers } from "./seeds/user.seed";
import { seedAchievements } from "./seeds/achievement.seed";
import { seedHabits } from "./seeds/habits.seed";

const seed = async () => {
  await seedAchievements(prisma);

  if (process.env.NODE_ENV === "development") {
    await seedUsers(prisma);
    await seedHabits(prisma);
  }
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
