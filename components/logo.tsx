import { Flame } from "lucide-react";

export const Logo = ({ size }: { size: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm">
        <Flame className={`w-${size} h-${size} text-white`} />
      </div>
      <h1 className="font-bold text-md">Streak</h1>
    </div>
  );
};
