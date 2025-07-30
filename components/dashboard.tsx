import { Bell, User } from "lucide-react";
import { Pomodoro } from "./pomodoro";
import WeatherCard from "./weather-card";

export const Dashboard = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium text-gray-800">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div className="flex gap-4 items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600 hover:text-gray-800" />
          </button>
          <div className="w-10 h-10 rounded-full border border-gray-300 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer">
            <User size={18} className="text-red-600" />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h1 className="text-gray-900 text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
          Good Morning, Prathamesh
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Ready to build some streaks today?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 items-start">
          <WeatherCard />
          <Pomodoro />
          <div className="border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:border-red-200 group h-full">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Today&apos;s Habits
            </h3>
            <p className="text-gray-500 text-sm">Track your daily progress</p>
          </div>

          <div className="border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:border-red-200 group h-full">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Weekly Stats
            </h3>
            <p className="text-gray-500 text-sm">View your performance</p>
          </div>

          <div className="border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:border-red-200 group h-full">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Achievements
            </h3>
            <p className="text-gray-500 text-sm">Celebrate your milestones</p>
          </div>
        </div>
      </div>
    </>
  );
};
