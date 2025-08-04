"use client";

import { Bell, LogOut } from "lucide-react";
import { Pomodoro } from "./pomodoro";
import WeatherCard from "./weather-card";
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

export const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <>
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
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Bell
              size={20}
              className="text-muted-foreground hover:text-foreground"
            />
          </button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
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
            <DropdownMenuContent>
              <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Good Morning,{" "}
          <span className="text-red-500 underline underline-offset-4">
            {session?.user.name}
          </span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ready to build some{" "}
          <span className="text-red-500 underline underline-offset-4">
            streaks
          </span>{" "}
          today?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 items-start">
          <WeatherCard />
          <Pomodoro />
          <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 dark:hover:border-red-800/75 group h-full">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Today&apos;s Habits
            </h3>
            <p className="text-muted-foreground text-sm">
              Track your daily progress
            </p>
          </div>

          <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 dark:hover:border-red-800/75 group h-full">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Weekly Stats
            </h3>
            <p className="text-muted-foreground text-sm">
              View your performance
            </p>
          </div>

          <div className="border border-red-500/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 dark:hover:border-red-800/75 group h-full">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Achievements
            </h3>
            <p className="text-muted-foreground text-sm">
              Celebrate your milestones
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
