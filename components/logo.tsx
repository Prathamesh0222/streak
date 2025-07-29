import { Flame } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
        <Flame className="w-4 h-4 text-white" />
      </div>
      <h1 className="font-bold text-lg">Streak</h1>
    </div>
  );
};
