"use client";

import {
  PanelLeftClose,
  PanelRightClose,
  Home,
  Settings,
  FileText,
  Calendar,
  Trophy,
  Flame,
  Medal,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

export const Sidebar = ({
  onMenuChange,
}: {
  onMenuChange: (
    menu:
      | "Dashboard"
      | "Habits"
      | "Calendar"
      | "Achievements"
      | "Settings"
      | "Leaderboard"
  ) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<
    | "Dashboard"
    | "Habits"
    | "Calendar"
    | "Achievements"
    | "Settings"
    | "Leaderboard"
  >("Dashboard");

  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: FileText, label: "Habits" },
    { icon: Calendar, label: "Calendar" },
    { icon: Trophy, label: "Achievements" },
    { icon: Settings, label: "Settings" },
    { icon: Medal, label: "Leaderboard" },
  ] as const;

  const handleMenuClick = (
    label:
      | "Dashboard"
      | "Habits"
      | "Calendar"
      | "Achievements"
      | "Settings"
      | "Leaderboard"
  ) => {
    setActiveMenu(label);
    onMenuChange(label);
  };

  return (
    <>
      <div
        className={`hidden lg:flex ${
          isSidebarOpen ? "w-60" : "w-16"
        } border-r border-red-500/30 transition-all ease-in-out duration-300 flex-col`}
      >
        <div className="p-4 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            {isSidebarOpen && <Logo />}

            {isSidebarOpen ? (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors p-2"
              >
                <PanelLeftClose
                  size={20}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                />
              </button>
            ) : (
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm cursor-pointer hover:scale-105 duration-300 ease-in-out">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="absolute translate-x-8 mt-2 rounded-full bg-white dark:bg-black/20 border border-red-500/20 shadow-sm p-1 hover:shadow-md transition-all duration-200"
                >
                  <PanelRightClose
                    size={16}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 items-center">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors group cursor-pointer ${
                    activeMenu === item.label
                      ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                      : ""
                  }`}
                  onClick={() => handleMenuClick(item.label)}
                >
                  <item.icon
                    size={20}
                    className={`${
                      activeMenu === item.label
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-300"
                    } group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors`}
                  />
                  {isSidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-red-500/20">
          {isSidebarOpen ? (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center"></div>
          ) : (
            <div className="w-8 h-8 bg-red-100 dark:bg-red-950/30 rounded-full mx-auto"></div>
          )}
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 border-t rounded-t-3xl border-red-500/50 bg-background z-50">
        <ul className="grid grid-cols-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                aria-label={item.label}
                onClick={() => handleMenuClick(item.label)}
                className={`w-full flex flex-col items-center justify-center py-4 text-xs transition-colors ${
                  activeMenu === item.label
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <item.icon size={20} />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
