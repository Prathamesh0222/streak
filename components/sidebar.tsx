"use client";

import {
  PanelLeftClose,
  PanelRightClose,
  Home,
  Settings,
  FileText,
  Calendar,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

export const Sidebar = ({
  onMenuChange,
}: {
  onMenuChange: (menu: string) => void;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: FileText, label: "Habits" },
    { icon: Calendar, label: "Calendar" },
    { icon: Settings, label: "Settings" },
  ];

  const handleMenuClick = (label: string) => {
    setActiveMenu(label);
    onMenuChange(label);
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-60" : "w-16"
      } bg-white border-r border-gray-200 transition-all ease-in-out duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isSidebarOpen && <Logo />}

          {isSidebarOpen ? (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg hover:bg-red-50 transition-colors"
            >
              <PanelLeftClose
                size={20}
                className="text-gray-600 hover:text-red-600"
              />
            </button>
          ) : (
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm cursor-pointer hover:scale-115 duration-300 ease-in-out">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute translate-x-8 mt-2 rounded-full bg-white border border-gray-200 shadow-sm p-1 hover:shadow-md transition-all duration-200"
              >
                <PanelRightClose
                  size={16}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200"
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
                className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group cursor-pointer ${
                  activeMenu === item.label ? "bg-red-50 text-red-600" : ""
                }`}
                onClick={() => handleMenuClick(item.label)}
              >
                <item.icon
                  size={25}
                  className={`${
                    activeMenu === item.label ? "text-red-600" : "text-gray-600"
                  }  group-hover:text-red-600`}
                />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        {isSidebarOpen ? (
          <div className="text-xs text-gray-500 text-center"></div>
        ) : (
          <div className="w-8 h-8 bg-red-100 rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  );
};
