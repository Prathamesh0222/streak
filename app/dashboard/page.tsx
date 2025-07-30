"use client";

import { Main } from "@/components/main";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";

export default function Dashboard() {
  const [currentMenu, setCurrentMenu] = useState("Dashboard");
  return (
    <div className="relative flex h-screen">
      <Sidebar onMenuChange={setCurrentMenu} />
      <Main currentMenu={currentMenu} />
    </div>
  );
}
