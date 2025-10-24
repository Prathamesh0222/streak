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
  userEmail: string,
  existingCustomerId?: string
) => {
  const plan = STRIPE_PLANS[planId as keyof typeof STRIPE_PLANS];
  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  let customerId = existingCustomerId;
  if (!customerId) {
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }
  }

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
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
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
    metadata: {
      userId,
      planId,
    },
    ...(customerId ? { customer: customerId } : { customer_email: userEmail }),
  };

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return session.url;
};
