import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;

          if (!userId || !planId) {
            console.error("Missing metadata in session:", session.id);
            break;
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
            prisma.payment.upsert({
              where: { stripeSessionId: session.id },
              update: {
                status: "COMPLETED",
                subscriptionEndDate,
              },
              create: {
                userId,
                stripeSessionId: session.id,
                amount: session.amount_total || 0,
                currency: session.currency || "inr",
                planId,
                status: "COMPLETED",
                subscriptionEndDate,
              },
            }),
          ]);

          console.log(`Subscription activated for user: ${userId}`);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "FAILED" },
        });

        console.log(`Checkout session expired: ${session.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
