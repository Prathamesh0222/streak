import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const seedUsers = async (prisma: PrismaClient) => {
  console.log("Seeding: Users");

  const users = [
    {
      name: "Demo User",
      email: "demo@streak.app",
      password: "demo123",
    },
    {
      name: "Test User",
      email: "test@streak.app",
      password: "test123",
    },
  ];

  for (const u of users) {
    const password = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: {
        email: u.email,
      },
      update: {
        name: u.name,
        password,
      },
      create: {
        name: u.name,
        email: u.email,
        password,
      },
    });
  }
  console.log("Seeding: users done");
};
