import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { processHabitCompletion } from "@/lib/xp-service";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { habitId, date, isCompleted } = body;

    if (!habitId || !date) {
      return NextResponse.json(
        {
          error: "Habit ID and date are required",
        },
        {
          status: 400,
        }
      );
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const existingLog = await prisma.habitLogs.findFirst({
      where: {
        habitId,
        date: new Date(date),
      },
    });

    let habitLog;
    if (existingLog) {
      habitLog = await prisma.habitLogs.update({
        where: {
          id: existingLog.id,
        },
        data: {
          isCompleted,
        },
      });
    } else {
      habitLog = await prisma.habitLogs.create({
        data: {
          habitId,
          date: new Date(date),
          isCompleted,
        },
      });
    }

    if (isCompleted) {
      try {
        const xpResult = await processHabitCompletion({
          habitId,
          userId: session.user.id,
          habitPriority: habit.priority,
          habitTitle: habit.title,
        });
        console.log(
          `User gained ${xpResult.xpGained} XP. Level: ${xpResult.newLevel}`
        );
      } catch (error) {
        console.error("Failed to process XP:", error);
      }
    }

    try {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const userHabits = await prisma.habit.findMany({
        where: {
          userId: session.user.id,
          createdAt: { lte: endOfDay },
        },
        include: {
          HabitLogs: {
            where: {
              date: { gte: startOfDay, lte: endOfDay },
            },
            select: { isCompleted: true },
          },
        },
      });

      const totalHabits = userHabits.length;
      const completedHabits = userHabits.filter(
        (h) => h.HabitLogs[0]?.isCompleted === true
      ).length;

      const allDone = totalHabits > 0 && completedHabits === totalHabits;

      if (allDone) {
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: session.user.id,
            type: "ALL_HABITS_COMPLETED",
            createdAt: { gte: startOfDay, lte: endOfDay },
          },
        });

        if (!existingNotification) {
          await prisma.notification.create({
            data: {
              userId: session.user.id,
              type: "ALL_HABITS_COMPLETED",
              title: "All habits completed!",
              body: `Great job! You finished all ${totalHabits} habits for today.`,
            },
          });
        }
      }
    } catch (error) {
      console.error(
        "Failed to create all habits completed notification:",
        error
      );
      return NextResponse.json(
        { error: "Failed to create all habits completed notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Habit log updated successfully",
        habitLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while creating/updating habit log:", error);
    return NextResponse.json(
      { error: "Failed to create/update habit log" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId");
    const dateParam = searchParams.get("date");

    if (dateParam) {
      const targetDate = new Date(dateParam);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const userHabits = await prisma.habit.findMany({
        where: {
          userId: session.user.id,
          createdAt: {
            lte: endOfDay,
          },
        },
        include: {
          HabitLogs: {
            where: {
              date: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        },
      });

      const habitLogs = [];

      for (const habit of userHabits) {
        const logForDate = habit.HabitLogs[0];

        habitLogs.push({
          id: logForDate?.id || `pending-${habit.id}`,
          date: targetDate.toISOString(),
          isCompleted: logForDate?.isCompleted || false,
          habitId: habit.id,
          habit: {
            id: habit.id,
            title: habit.title,
            category: habit.category,
            priority: habit.priority,
          },
        });
      }

      const totalHabits = habitLogs.length;
      const completedHabits = habitLogs.filter((log) => log.isCompleted).length;

      return NextResponse.json({
        date: targetDate.toISOString().split("T")[0],
        totalHabits,
        completedHabits,
        habits: habitLogs,
      });
    }

    if (!habitId) {
      return NextResponse.json(
        {
          error: "Habit ID or date is required",
        },
        {
          status: 400,
        }
      );
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const habitLogs = await prisma.habitLogs.findMany({
      where: {
        habitId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(habitLogs);
  } catch (error) {
    console.error("Failed to fetch habit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit logs" },
      { status: 500 }
    );
  }
};
