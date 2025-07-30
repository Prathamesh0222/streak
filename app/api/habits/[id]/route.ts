import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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

  const { status } = await req.json();

  try {
    const updatedHabit = await prisma.habit.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        status: status as "COMPLETED" | "PENDING" | "ONGOING",
      },
    });

    return NextResponse.json({
      message: "Status updated successfully",
      habit: updatedHabit,
    });
  } catch (error) {
    console.error("Error while updating the status", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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

  try {
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      {
        message: "Habit deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while deleting habit", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
};
