import { authOptions } from "@/lib/auth";
import { generateWeeklyInsights } from "@/lib/generate";
import { prisma } from "@/lib/prisma";
import { getWeekRange } from "@/lib/streak";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const existingInsights = await prisma.weeklyInsight.findFirst({
      where: {
        userEmail: session.user.email,
        weekStart: {
          gte: weekStart,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (existingInsights) {
      return NextResponse.json({
        insights: existingInsights.insights,
        weekRange: getWeekRange(existingInsights.weekStart),
        cached: true,
      });
    }

    return NextResponse.json({
      insights: [],
      weekRange: getWeekRange(weekStart),
      cached: false,
    });
  } catch (error) {
    console.error("Get insights error:", error);
    return NextResponse.json(
      { error: "Failed to load insights" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { habits } = await req.json();

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const existingInsights = await prisma.weeklyInsight.findFirst({
      where: {
        userEmail: session.user.email,
        weekStart: {
          gte: weekStart,
        },
      },
    });

    if (existingInsights) {
      return NextResponse.json({
        insights: existingInsights.insights,
        weekRange: getWeekRange(existingInsights.weekStart),
        cached: true,
      });
    }

    const insights = await generateWeeklyInsights(
      weekStart,
      session.user.email,
      habits
    );

    return NextResponse.json({
      insights,
      weekRange: getWeekRange(weekStart),
      cached: false,
    });
  } catch (error) {
    console.error("Generate insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
};
