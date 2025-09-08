import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Invalid session metadata" },
        { status: 400 }
      );
    }

    const subscriptionEndDate = new Date();
    if (planId === "pro_monthly") {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          subscription: "PRO",
        },
      }),
      prisma.payment.create({
        data: {
          userId,
          stripeSessionId: sessionId,
          amount: session.amount_total || 0,
          currency: session.currency || "inr",
          planId,
          status: "COMPLETED",
          subscriptionEndDate,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Payment successful! Welcome to Pro!",
      subscription: "PRO",
      subscriptionEndDate,
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.json(
      { error: "Failed to process payment success" },
      { status: 500 }
    );
  }
}
