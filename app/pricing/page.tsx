"use client";

import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { CustomCard, CustomContent } from "@/components/custom-card";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  const pro = PLANS.pro_monthly;

  const rupees = pro.amount / 100;
  const monthlyPriceLabel = `₹${Math.round(rupees)}`;
  const freeLabel = "₹0";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b">
        <Header />
      </div>
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-20 border-x">
          <div className="text-center mt-6 mb-10">
            <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
            <p className="text-gray-600 mt-2">
              Pick a plan that fits you. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <CustomCard className="rounded-2xl">
              <CustomContent>
                <div className="border p-4 rounded-xl bg-background">
                  <h2 className="text-xl font-semibold">Free</h2>
                  <p className="text-4xl font-bold mt-2">
                    {freeLabel}
                    <span className="text-base font-medium text-gray-600">
                      {" "}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-1">Forever free</p>
                </div>
                <div className="px-5">
                  <ul className="mt-6 space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      Up to 10 habits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      7 days calendar history
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      10 AI assistant uses/day
                    </li>
                    <li className="flex items-center gap-2 text-gray-500">
                      <X className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      Priority support
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-3">
                  <Link href="/signup">
                    <Button className="w-full bg-red-600 hover:bg-red-700 rounded-xl">
                      Get started free
                    </Button>
                  </Link>
                </div>
              </CustomContent>
            </CustomCard>

            <CustomCard className="rounded-2xl relative border-2 border-red-600">
              <CustomContent>
                <div className="absolute -top-3 right-4 text-xs bg-red-600 text-white px-2 py-1 rounded shadow">
                  Best Value
                </div>
                <div className="border p-4 rounded-xl bg-background">
                  <h2 className="text-xl font-semibold">Pro</h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-4xl font-bold">{monthlyPriceLabel}</p>
                    <span className="text-base font-medium text-gray-600">
                      / month
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Best for power users</p>
                </div>
                <div className="px-5">
                  <ul className="mt-6 space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />
                      Unlimited habits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      Unlimited calendar history
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      50 AI assistant uses/day
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-7 h-7 border p-1 rounded-full text-red-600 bg-red-600/10" />{" "}
                      Priority support
                    </li>
                  </ul>
                </div>
                <div className="mt-6 p-3">
                  <form action="/api/payment/create-checkout" method="post">
                    <input type="hidden" name="planId" value="pro_monthly" />
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Upgrade to Pro
                    </Button>
                  </form>
                </div>
              </CustomContent>
            </CustomCard>
          </div>
        </div>
      </div>
      <div className="border-t">
        <Footer />
      </div>
    </div>
  );
}
