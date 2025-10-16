"use client";

import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { MobileSidebar } from "./mobile-sidebar";
import { Flame } from "lucide-react";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleAnchor = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(`/?scrollTo=${id}`, { scroll: false });
    }
  };

  return (
    <>
      <MobileSidebar handleAnchor={handleAnchor} />
      <nav className="hidden p-4 md:flex justify-between items-center backdrop-blur-sm sticky top-0 z-50 max-w-7xl mx-auto border-x">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm cursor-pointer hover:scale-105 duration-300 transition-all">
            <Flame
              onClick={() => {
                router.push("/");
              }}
              className="w-5 h-5 text-white"
            />
          </div>
          <div className="flex text-sm gap-6 font-semibold items-center">
            <button
              onClick={() => handleAnchor("features")}
              className="hover:underline cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="hover:underline cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => handleAnchor("faq")}
              className="hover:underline cursor-pointer"
            >
              FAQ
            </button>
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
    </>
  );
};
