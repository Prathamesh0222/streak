"use client";

import { useEffect, useState } from "react";
import { Cloud, Wind, Gauge, Droplets, MapPin } from "lucide-react";
import axios from "axios";

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
      <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-18"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-600">
        Failed to load weather data
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Weather</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            Mumbai
          </div>
        </div>
        <a
          href="https://wttr.in/Mumbai"
          className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Details
        </a>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
            <Cloud className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-3xl font-bold text-gray-800">
            {weather.temp_C}°C
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {weather.weatherDesc?.[0]?.value || "Clear"}
          </span>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Wind className="w-4 h-4 text-gray-500" />
            </div>
            <span className="font-medium">Wind</span>
            <span className="ml-auto font-semibold">
              {weather.windspeedKmph} km/h
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Gauge className="w-4 h-4 text-gray-500" />
            </div>
            <span className="font-medium">Pressure</span>
            <span className="ml-auto font-semibold">
              {weather.pressure} hPa
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-gray-500" />
            </div>
            <span className="font-medium">Humidity</span>
            <span className="ml-auto font-semibold">{weather.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
