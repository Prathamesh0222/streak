import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { status } = body;
  const param = await params;

  if (!status || !["COMPLETED", "PENDING", "ONGOING"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  try {
    const updatedHabit = await prisma.habit.update({
      where: {
        id: param.id,
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
  { params }: { params: Promise<{ id: string }> }
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

  const param = await params;

  try {
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: param.id,
        userId: session.user.id,
      },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
      where: {
        id: param.id,
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
