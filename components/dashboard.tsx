"use client";

import { Bell, LogOut } from "lucide-react";
import { Pomodoro } from "./pomodoro";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { HeatMap } from "./heatmap";
import { WeeklyStats } from "./weekly-stats";
import { HabitCategoryChart } from "./habit-category";
import { ProgressChart } from "./progress-chart";
import { useHabits } from "@/hooks/useHabits";
import { UserLevelIcon } from "./user-level-icons";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export const Dashboard = () => {
  const { data: session } = useSession();
  const { habits, loading } = useHabits();

  return (
    <>
      <header className="-mx-8 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium text-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>
          <div className="flex gap-4 items-center">
            <button className="p-2 rounded-full hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:focus-visible:ring-red-600">
              <Bell size={20} className="text-muted-foreground" />
            </button>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:focus-visible:ring-red-600">
                <div className="w-10 h-10 rounded-full border border-border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 object-cover rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {session?.user?.name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {session?.user?.name ?? "Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          {getGreeting()},{" "}
          <span className="text-red-500 underline underline-offset-4">
            {session?.user?.name ?? "there"}
          </span>
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Ready to build some{" "}
          <span className="text-red-500 underline underline-offset-4">
            streaks
          </span>{" "}
          today?
        </p>

        <div className="flex w-full mt-8 md:gap-4">
          <div className="md:w-full max-w-4xl">
            <HeatMap />
          </div>
          <UserLevelIcon />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-12 mb:mb-0">
          <HabitCategoryChart habits={habits} />
          <ProgressChart habits={habits} />
          <div className="break-inside-avoid mb-6">
            <WeeklyStats habits={habits} loading={loading} />
          </div>
          <div className="h-full">
            <Pomodoro />
          </div>
        </div>
      </section>
    </>
  );
};
