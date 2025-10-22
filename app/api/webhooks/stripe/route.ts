import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== "paid") break;

        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId || !planId || !subscriptionId) break;

        const subscriptionEndDate = new Date();
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { subscription: "PRO" },
          }),
          prisma.payment.create({
            data: {
              userId,
              stripeSessionId: session.id,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              amount: session.amount_total ?? 0,
              currency: session.currency?.toUpperCase() ?? "INR",
              planId,
              status: "COMPLETED",
              subscriptionEndDate,
            },
          }),
        ]);

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.billing_reason === "subscription_create") break;

        const customerId = invoice.customer as string;
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subscriptionId = typeof subRef === "string" ? subRef : subRef?.id;

        if (!subscriptionId) break;

        const existingPayment = await prisma.payment.findFirst({
          where: { stripeCustomerId: customerId },
          select: { userId: true, planId: true },
          orderBy: { createdAt: "desc" },
        });

        if (!existingPayment) break;

        const subscriptionEndDate = new Date(invoice.period_end * 1000);

        await prisma.$transaction([
          prisma.payment.create({
            data: {
              userId: existingPayment.userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid,
              currency: invoice.currency?.toUpperCase() ?? "INR",
              planId: existingPayment.planId,
              status: "COMPLETED",
              subscriptionEndDate,
            },
          }),
          prisma.user.update({
            where: { id: existingPayment.userId },
            data: { subscription: "PRO" },
          }),
        ]);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subscriptionId = typeof subRef === "string" ? subRef : subRef?.id;

        if (!subscriptionId) break;

        const existingPayment = await prisma.payment.findFirst({
          where: { stripeCustomerId: customerId },
          select: { userId: true, planId: true },
          orderBy: { createdAt: "desc" },
        });
        if (!existingPayment) break;

        await prisma.$transaction([
          prisma.payment.create({
            data: {
              userId: existingPayment.userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_due,
              currency: invoice.currency?.toUpperCase() ?? "INR",
              planId: existingPayment.planId,
              status: "FAILED",
            },
          }),
          prisma.user.update({
            where: { id: existingPayment.userId },
            data: { subscription: "FREE" },
          }),
        ]);

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;

        const existingPayment = await prisma.payment.findFirst({
          where: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
          select: { userId: true },
          orderBy: { createdAt: "desc" },
        });
        if (!existingPayment) break;

        const userSubscription: "FREE" | "PRO" =
          subscription.status === "active" || subscription.status === "trialing"
            ? "PRO"
            : "FREE";

        const subscriptionEndDate =
          userSubscription === "PRO"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : undefined;

        if (subscriptionEndDate) {
          await prisma.$transaction([
            prisma.payment.updateMany({
              where: {
                stripeSubscriptionId: subscriptionId,
                userId: existingPayment.userId,
              },
              data: { subscriptionEndDate },
            }),
            prisma.user.update({
              where: { id: existingPayment.userId },
              data: { subscription: userSubscription },
            }),
          ]);
        } else {
          await prisma.user.update({
            where: { id: existingPayment.userId },
            data: { subscription: userSubscription },
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
