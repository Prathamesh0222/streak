import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { habitSchema } from "@/lib/validate";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

export const GET = async (req: NextRequest) => {
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
          take: 7,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(habits);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
};
