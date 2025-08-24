import { Calendar } from "./calendar";
import { Dashboard } from "./dashboard";
import { Habits } from "./habit";
import { Settings } from "./settings";
import { AchievementsSection } from "./achievements-section";
import { useMemo } from "react";

export const Main = ({ currentMenu }: { currentMenu: string }) => {
  const content = useMemo(() => {
    switch (currentMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Habits":
        return <Habits />;
      case "Calendar":
        return <Calendar />;
      case "Achievements":
        return <AchievementsSection />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  }, [currentMenu]);

  return (
    <main className="lg:p-6 w-full h-screen overflow-hidden">
      <div className="border border-red-500/20 lg:rounded-2xl h-full p-8 shadow-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div key={currentMenu}>{content}</div>
      </div>
    </main>
  );
};
