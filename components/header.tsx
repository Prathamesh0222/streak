"use client";

import { Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  const router = useRouter();

  return (
    <nav className="p-4 flex justify-between items-center backdrop-blur-sm sticky top-0 z-50 max-w-7xl mx-auto border-x">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div className="flex text-sm gap-6 font-semibold items-center">
          <button className="hover:underline cursor-pointer">Features</button>
          <button
            onClick={() => router.push("/pricing")}
            className="hover:underline cursor-pointer"
          >
            Pricing
          </button>
          <button className="hover:underline cursor-pointer">FAQ</button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Button
          onClick={() => router.push("/signin")}
          variant="ghost"
          className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold cursor-pointer hover:rounded-xl"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          className="bg-red-600 hover:bg-red-700 transition-all duration-200 font-semibold cursor-pointer dark:text-white rounded-xl"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};
