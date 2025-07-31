import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    if (!habitId) {
      return NextResponse.json(
        {
          error: "Habit ID is required",
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
