"use client";

import { AlignJustify, Flame, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";

export const MobileSidebar = ({
  handleAnchor,
}: {
  handleAnchor: (id: string) => void;
}) => {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="md:hidden p-4 flex justify-between items-center backdrop-blur-sm sticky top-0 z-40 mx-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm cursor-pointer hover:scale-105 duration-300 transition-all">
            <Flame
              onClick={() => {
                router.push("/");
              }}
              className="w-5 h-5 text-white"
            />
          </div>
          <h1 className="font-bold text-lg tracking-tighter">Streak</h1>
        </div>

        <AlignJustify onClick={() => setMobileSidebar(!mobileSidebar)} />
      </nav>
      {mobileSidebar && (
        <div className="absolute inset-y-0 z-50 inset-x-0 w-full min-h-screen bg-background border-red-500/20 flex flex-col">
          <div className="flex justify-end p-4 mx-2 gap-6 items-center">
            <Button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 transition-all duration-200 font-semibold cursor-pointer dark:text-white rounded-xl"
            >
              Get Started
            </Button>
            <X onClick={() => setMobileSidebar(!mobileSidebar)} />
          </div>
          <div className="border-b"></div>
          <div className="flex p-3 flex-col text-sm gap-2 font-semibold items-center mt-4">
            <Button
              variant={"ghost"}
              onClick={() => handleAnchor("features")}
              className="hover:underline cursor-pointer w-full rounded-xl py-6"
            >
              Features
            </Button>
            <Button
              variant={"ghost"}
              onClick={() => router.push("/pricing")}
              className="hover:underline cursor-pointer w-full rounded-xl py-6"
            >
              Pricing
            </Button>
            <Button
              variant={"ghost"}
              onClick={() => handleAnchor("faq")}
              className="hover:underline cursor-pointer w-full rounded-xl py-6"
            >
              FAQ
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
