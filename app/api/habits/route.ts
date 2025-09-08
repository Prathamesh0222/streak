import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateGoalProgress,
  calculateStreak,
  isCompletedToday,
} from "@/lib/streak";
import { checkHabitLimit } from "@/lib/subscription";
import { habitSchema } from "@/lib/validate";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habitLimit = await checkHabitLimit(session.user.id);

  if (!habitLimit.allowed) {
    return NextResponse.json(
      {
        error: "Habit limit exceeded",
        message: `You've reached your habit limit of ${habitLimit.limit}. Upgrade to Pro for unlimited habits!`,
        current: habitLimit.current,
        limit: habitLimit.limit,
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsedData = habitSchema.safeParse(body);

  if (!parsedData.data) {
    return NextResponse.json(
      {
        error: "Invalid Input Validations",
      },
      {
        status: 411,
      }
    );
  }

  try {
    const createHabit = await prisma.habit.create({
      data: {
        ...parsedData.data,
        userId: session?.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Habit created successfully",
        habit: createHabit,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error while creating habit", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        HabitLogs: {
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const habitsWithMetadata = habits.map((habit) => {
      const logs = habit.HabitLogs || [];

      return {
        ...habit,
        currentStreak: calculateStreak(logs),
        completedToday: isCompletedToday(logs),
        goalProgress: calculateGoalProgress(logs, habit.goalTarget || 7),

        totalCompletions: logs.filter((log) => log.isCompleted).length,
        lastCompletionDate: logs.find((log) => log.isCompleted)?.date || null,

        HabitLogs: logs.slice(0, 7),
      };
    });

    return NextResponse.json(habitsWithMetadata);
  } catch (error) {
    console.error("Failed to fetch habits", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
};
