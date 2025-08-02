import { Calendar } from "./calendar";
import { Dashboard } from "./dashboard";
import { Habit } from "./habit";
import { Settings } from "./settings";

export const Main = ({ currentMenu }: { currentMenu: string }) => {
  const renderContent = () => {
    switch (currentMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Habits":
        return <Habit />;
      case "Calendar":
        return <Calendar />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };
  return (
    <div className="p-6 w-full min-h-screen">
      <div className="border border-red-500/20 rounded-2xl h-full p-8 shadow-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {renderContent()}
      </div>
    </div>
  );
};
