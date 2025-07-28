import { Flame } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <nav className="p-4 flex justify-between">
      <div className="flex items-center">
        <Flame className="w-7 h-7" />
        <h1 className="font-semibold text-2xl">Streak</h1>
      </div>
      <div className="space-x-4">
        <Button variant={"outline"}>Login</Button>
        <Button>Get Started</Button>
      </div>
    </nav>
  );
};
