"use client";

import { Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  return (
    <nav className="p-3 flex justify-between items-center border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-xl">Streak</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.push("/signin")}
          variant="outline"
          className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold cursor-pointer"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-sm hover:shadow-md transition-all duration-200 font-semibold cursor-pointer"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};
