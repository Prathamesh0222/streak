import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const STRIPE_PLANS = {
  pro_monthly: {
    name: "Pro Monthly",
    amount: process.env.NODE_ENV === "development" ? 5000 : 29900,
    currency: "inr",
  },
};

export const createCheckoutSession = async (
  planId: string,
  userId: string,
  userEmail: string
) => {
  const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS];
  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: plan.currency,
          product_data: {
            name: plan.name,
            description: `Habit Tracker ${plan.name}`,
          },
          unit_amount: plan.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
    customer_email: userEmail,
    metadata: {
      userId,
      planId,
    },
  });

  return session.url;
};
