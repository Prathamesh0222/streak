"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { Crown, Check, Settings2 } from "lucide-react";

export const Settings = () => {
  const router = useRouter();
  const { subscription, limits, isFreePlan, isPremium, isLoading } =
    useSubscription();
  return (
    <div className="space-y-6 mt-8.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <Settings2 className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-medium">Settings</h2>
      </div>

      <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
        <div className="p-6 bg-background border border-red-500/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="h-5 w-5 text-red-500" />
            Subscription
          </h3>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-sm">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  Current plan: {isLoading ? "Loading..." : subscription}
                </div>
                {!isLoading && limits && (
                  <div className="text-sm text-muted-foreground mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-red-500" />
                      <span className="font-medium">
                        Habits:{" "}
                        {limits.maxHabits === -1
                          ? "Unlimited"
                          : limits.maxHabits}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-red-500" />
                      <span className="font-medium">
                        AI/day: {limits.aiAssistantDaily}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-red-500" />
                      <span className="font-medium">
                        Calendar:{" "}
                        {limits.calendarDays === -1
                          ? "Unlimited"
                          : `${limits.calendarDays} days`}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isFreePlan && (
                <Button
                  onClick={() => router.push("/pricing")}
                  className="bg-red-500 hover:bg-red-600 shadow-sm"
                >
                  Upgrade to Pro
                </Button>
              )}
              {isPremium && (
                <Button
                  variant="outline"
                  disabled
                  className="border-red-500/20 text-red-500"
                >
                  You are Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Name
                </Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div>
                <Button className="bg-red-500 hover:bg-red-600 shadow-sm">
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">
                  Light or Dark
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email updates</div>
                  <div className="text-sm text-muted-foreground">
                    Product news and tips
                  </div>
                </div>
                <Switch id="email-updates" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Daily habit reminders
                  </div>
                </div>
                <Switch id="reminders" />
              </div>
            </div>
          </div>
        </div>
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sign out</div>
                <div className="text-sm text-muted-foreground">
                  You can sign back in anytime
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-500/20 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
