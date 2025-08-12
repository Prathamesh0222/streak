"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

export const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workTime = 25 * 60;
  const shortBreak = 5 * 60;
  const longBreak = 15 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === "work") {
        setSessions((prev) => prev + 1);
        if ((sessions + 1) % 4 === 0) {
          setMode("longBreak");
          setTimeLeft(longBreak);
        } else {
          setMode("break");
          setTimeLeft(shortBreak);
        }
      } else {
        setMode("work");
        setTimeLeft(workTime);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, sessions, longBreak, shortBreak, workTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workTime);
    setSessions(0);
  };

  const getModeColor = () => {
    switch (mode) {
      case "work":
        return "from-red-500 to-red-600";
      case "break":
        return "from-green-500 to-green-600";
      case "longBreak":
        return "from-blue-500 to-blue-600";
    }
  };

  const getModeText = () => {
    switch (mode) {
      case "work":
        return "Focus Time";
      case "break":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const progress = () => {
    const total =
      mode === "work" ? workTime : mode === "break" ? shortBreak : longBreak;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="border border-red-500/20 hover:border-red-200 dark:hover:border-red-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">Pomodoro Timer</h3>
          <button className="p-2 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`px-4 py-2 rounded-full bg-gradient-to-r ${getModeColor()} text-white text-sm font-medium`}
        >
          {getModeText()}
        </div>

        <div className="relative w-48 h-48">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress() / 100)}`}
              className={`transition-all duration-1000 ${
                mode === "work"
                  ? "text-red-500"
                  : mode === "break"
                  ? "text-green-500"
                  : "text-blue-500"
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Session {sessions + 1}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={toggleTimer}
            className={`p-3 rounded-full bg-gradient-to-r ${getModeColor()} text-white hover:shadow-lg transition-all duration-200`}
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Sessions today</span>
            <span className="font-semibold">{sessions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
