"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSubscription } from "@/hooks/useSubscription";
import { useAchievements } from "@/hooks/useAchievements";
import { useSession, signOut } from "next-auth/react";
import {
  Crown,
  Check,
  Settings2,
  User,
  Mail,
  LogOut,
  Palette,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { getLevelBadge } from "@/lib/achievements";
import Image from "next/image";

export const Settings = () => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { data: session } = useSession();
  const { subscription, limits, isFreePlan, isPremium, isLoading } =
    useSubscription();
  const { userProgress, loading: progressLoading } = useAchievements();

  const upgrade = async () => {
    if (isUpgrading) return;
    try {
      setIsUpgrading(true);
      const res = await axios.post("/api/payment/create-checkout", {
        planId: "pro_monthly",
      });
      const checkoutUrl = res.data?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No checkoutUrl returned", res.data);
      }
    } catch (err) {
      console.error("Failed to create checkout session", err);
    } finally {
      setIsUpgrading(false);
    }
  };

  const progressPercentage = progressLoading
    ? 0
    : (userProgress.xp / userProgress.xpForCurrentLevel) * 100;

  return (
    <div className="space-y-6 mt-8.5 ">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <Settings2 className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-medium">Settings</h2>
      </div>
      <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
        <div className="p-6 bg-background border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold">Profile</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 flex items-center justify-center">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-20 h-20 object-cover rounded-full"
                    width={80}
                    height={80}
                  />
                ) : (
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || ""}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Name</div>
                  <div className="text-sm font-medium">
                    {session?.user?.name || "Not set"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">
                    {session?.user?.email || "Not set"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg h-full">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Subscription</h3>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <div className="flex flex-col items-center text-center w-full">
                        {subscription}
                        {isPremium && (
                          <Badge className="bg-red-500/20 border border-red-500 text-red-500 mt-1">
                            Active
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isLoading && limits && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    Plan Features
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">
                          {limits.maxHabits === -1
                            ? "Unlimited"
                            : limits.maxHabits}
                        </span>{" "}
                        Habits
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">
                          {limits.aiAssistantDaily}
                        </span>{" "}
                        AI requests/day
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">
                          {limits.calendarDays === -1
                            ? "Unlimited"
                            : `${limits.calendarDays} days`}
                        </span>{" "}
                        Calendar access
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                {isFreePlan && (
                  <Button
                    onClick={upgrade}
                    disabled={isUpgrading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md text-white"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isUpgrading ? "Redirecting…" : "Upgrade to Pro"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg h-full">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Your Progress</h3>
            </div>
            {progressLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
                    {(() => {
                      const LevelIcon = getLevelBadge(userProgress.level);
                      return <LevelIcon className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      Level {userProgress.level}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold border-red-500/30 text-red-600 dark:text-red-400"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {userProgress.totalXp} Total XP
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Current Level Progress
                    </span>
                    <span className="font-semibold text-red-500">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2.5" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {userProgress.xp} / {userProgress.xpForCurrentLevel} XP
                    </span>
                    <span>{userProgress.xpToNextLevel} XP to next level</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme Mode</div>
                <div className="text-sm text-muted-foreground">
                  Choose your preferred theme
                </div>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300">
          <div className="p-6 bg-background border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <LogOut className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Account</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sign out</div>
                <div className="text-sm text-muted-foreground">
                  Sign out of your account
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-500/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
