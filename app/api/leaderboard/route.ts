import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leaderboard = await prisma.user.findMany({
      orderBy: {
        totalXp: "desc",
      },
      select: {
        id: true,
        name: true,
        xp: true,
        totalXp: true,
      },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
};
