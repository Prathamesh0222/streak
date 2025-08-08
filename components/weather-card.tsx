"use client";

import { useEffect, useState } from "react";
import { Cloud, Wind, Gauge, Droplets, MapPin } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface WeatherData {
  temp_C: string;
  weatherDesc: Array<{ value: string }>;
  windspeedKmph: string;
  humidity: string;
  pressure: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await axios.get("https://wttr.in/Mumbai?format=j1");
        const data = await res.data;
        setWeather(data.current_condition[0]);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-red-500/20 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-18"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
        Failed to load weather data
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-red-500/20 hover:border-red-200 dark:hover:border-red-800/75 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Weather</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            Mumbai
          </div>
        </div>
        <div className="hidden md:block">
          <Link
            href="https://wttr.in/Mumbai"
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      <div className="md:flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-xl flex items-center justify-center mb-2 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
            <Cloud className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {weather.temp_C}°C
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {weather.weatherDesc?.[0]?.value || "Clear"}
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Wind className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="font-medium">Wind</span>
            <span className="ml-auto font-semibold">
              {weather.windspeedKmph} km/h
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Gauge className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="font-medium">Pressure</span>
            <span className="ml-auto font-semibold">
              {weather.pressure} hPa
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="font-medium">Humidity</span>
            <span className="ml-auto font-semibold">{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
