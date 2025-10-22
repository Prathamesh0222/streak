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

    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
      include: { user: true },
    });

    if (!payment) {
      return NextResponse.json({
        success: true,
        pending: true,
        message: "Payment confirmed! Processing your subscription...",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successful! Welcome to Pro!",
      subscription: payment.user.subscription,
      subscriptionEndDate: payment.subscriptionEndDate,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.stripeSessionId,
      planId: payment.planId,
    });
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.json(
      { error: "Failed to process payment success" },
      { status: 500 }
    );
  }
}
