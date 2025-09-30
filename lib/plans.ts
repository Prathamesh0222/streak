export type PlanId = "pro_monthly";

const MONTHLY_AMOUNT = process.env.NODE_ENV === "development" ? 5000 : 29900;

export const PLANS: Record<
  PlanId,
  { name: string; amount: number; currency: string }
> = {
  pro_monthly: {
    name: "Pro Monthly",
    amount: MONTHLY_AMOUNT,
    currency: "inr",
  },
};
