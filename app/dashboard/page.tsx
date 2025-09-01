"use client";

import { Main } from "@/components/main";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";

export default function Dashboard() {
  const [currentMenu, setCurrentMenu] = useState<
    | "Dashboard"
    | "Habits"
    | "Calendar"
    | "Achievements"
    | "Settings"
    | "Leaderboard"
  >("Dashboard");

  return (
    <div className="relative flex h-screen">
      <Sidebar
        onMenuChange={(
          menu:
            | "Dashboard"
            | "Habits"
            | "Calendar"
            | "Achievements"
            | "Settings"
            | "Leaderboard"
        ) => setCurrentMenu(menu)}
      />
      <Main currentMenu={currentMenu} />
    </div>
  );
}
