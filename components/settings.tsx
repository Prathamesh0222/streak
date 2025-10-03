"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <Settings2 className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-medium">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-600 text-white">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">
                  Current plan: {isLoading ? "Loading..." : subscription}
                </div>
                {!isLoading && limits && (
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4 text-red-600" />
                      Habits:{" "}
                      {limits.maxHabits === -1 ? "Unlimited" : limits.maxHabits}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4 text-red-600" />
                      AI/day: {limits.aiAssistantDaily}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4 text-red-600" />
                      Calendar:{" "}
                      {limits.calendarDays === -1
                        ? "Unlimited"
                        : `${limits.calendarDays} days`}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isFreePlan && (
                <Button
                  onClick={() => router.push("/pricing")}
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Upgrade to Pro
                </Button>
              )}
              {isPremium && (
                <Button variant="outline" disabled>
                  You are Pro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="md:col-span-2">
              <Button className="bg-red-600 hover:bg-red-700">
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">Light or Dark</div>
            </div>
            <ModeToggle />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
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
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sign out</div>
              <div className="text-sm text-muted-foreground">
                You can sign back in anytime
              </div>
            </div>
            <Button variant="outline">Sign out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
