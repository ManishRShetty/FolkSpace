"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  Thermometer,
  CloudSnow,
  Wind,
  CloudRain,
  Snowflake,
  MapPin,
} from "lucide-react";
import { ReactNode } from "react";

// --- Weather Visuals ---
interface WeatherVisuals {
  icon: ReactNode;
  gradient: string;
  textColor: string;
  impactColor: string;
}
type WeatherCondition =
  | "Snowy"
  | "Snowstorm"
  | "Sunny"
  | "Windy"
  | "Rainy"
  | "Cloudy"
  | "Foggy"
  | string;

const getWeatherVisuals = (condition: WeatherCondition): WeatherVisuals => {
  const iconSize = "w-12 h-12";
  switch (condition) {
    case "Snowy":
      return {
        icon: <CloudSnow className={`${iconSize} text-white`} />,
        gradient: "from-blue-300 to-cyan-200",
        textColor: "text-blue-900",
        impactColor: "text-blue-700",
      };
    case "Snowstorm":
      return {
        icon: <Snowflake className={`${iconSize} text-white animate-spin-slow`} />,
        gradient: "from-gray-400 to-blue-500",
        textColor: "text-gray-900",
        impactColor: "text-red-700 font-semibold",
      };
    case "Sunny":
      return {
        icon: <Sun className={`${iconSize} text-yellow-500`} />,
        gradient: "from-yellow-200 to-orange-200",
        textColor: "text-orange-900",
        impactColor: "text-orange-700",
      };
    case "Windy":
      return {
        icon: <Wind className={`${iconSize} text-teal-500`} />,
        gradient: "from-teal-100 to-green-100",
        textColor: "text-teal-900",
        impactColor: "text-teal-700",
      };
    case "Rainy":
      return {
        icon: <CloudRain className={`${iconSize} text-blue-500`} />,
        gradient: "from-gray-300 to-blue-300",
        textColor: "text-gray-900",
        impactColor: "text-blue-700",
      };
    case "Foggy":
    case "Cloudy":
    default:
      return {
        icon: <Cloud className={`${iconSize} text-gray-500`} />,
        gradient: "from-gray-100 to-gray-200",
        textColor: "text-gray-800",
        impactColor: "text-gray-600",
      };
  }
};
const impactMap: Record<string, string> = {
  Sunny: "Low impact. Boost in outdoor activity sales.",
  Cloudy: "Low impact. Steady retail behavior.",
  Rainy: "Moderate impact. Demand for umbrellas and jackets.",
  Snowy: "High impact. Increased demand for winter wear.",
  Snowstorm: "Severe impact. Likely delays, emergency gear sales.",
  Windy: "Moderate impact. Increased demand for windbreakers.",
  Foggy: "Low visibility, possible travel delays.",
};

// --- Props for the widget ---
interface WeatherWidgetProps {
  locationName: string | null;
}

// --- Main Weather Widget ---
export default function WeatherWidget({ locationName }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no location is selected, show a default state
    if (!locationName) {
      setWeather({
        location: "Nordic Region",
        temperature: 10,
        condition: "Cloudy",
      });
      setLoading(false);
      setError(null);
      return; // Don't proceed to fetch
    }

    // A location IS selected, so "fetch" data
    const MOCK_SUCCESS = true;
    const SIMULATED_DELAY = 500; // 0.5 seconds

    setLoading(true);

    const timer = setTimeout(() => {
      if (MOCK_SUCCESS) {
        // --- DYNAMIC MOCK DATA based on prop ---
        let mockData;
        switch (locationName) {
          case "Sweden":
            mockData = { location: "Stockholm", temperature: 15, condition: "Cloudy" };
            break;
          case "Finland":
            mockData = { location: "Helsinki", temperature: 10, condition: "Rainy" };
            break;
          case "Norway":
            mockData = { location: "Oslo", temperature: 12, condition: "Windy" };
            break;
          case "Denmark":
            mockData = { location: "Copenhagen", temperature: 18, condition: "Sunny" };
            break;
          case "Iceland":
            mockData = { location: "Reykjavik", temperature: 5, condition: "Snowy" };
            break;
          default:
            mockData = { location: locationName, temperature: 10, condition: "Cloudy" };
        }
        setWeather(mockData);
        // ------------------------
        setError(null);
      } else {
        setError(`Failed to fetch data for ${locationName}.`);
        setWeather(null);
      }
      setLoading(false);
    }, SIMULATED_DELAY);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [locationName]); // <-- This dependency array makes it all work!

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="p-5 rounded-lg shadow-md bg-gray-100 text-gray-500 italic flex items-center gap-2">
        <MapPin className="w-5 h-5 animate-pulse" />
        Fetching weather data for {locationName}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-lg shadow-md bg-red-100 text-red-700 italic flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const visuals = getWeatherVisuals(weather.condition);
  const tempColor = weather.temperature <= 0 ? "text-blue-500" : "text-red-500";
  const impact = impactMap[weather.condition] || "Normal conditions.";

  return (
    <div
      className={`p-5 rounded-lg shadow-md bg-gradient-to-br ${visuals.gradient} transition-all duration-1000 ease-in-out`}
    >
      <h3 className={`text-lg font-semibold ${visuals.textColor} mb-4`}>
        Weather for {weather.location}
      </h3>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{visuals.icon}</div>
        <div className="flex-1">
          <p className={`text-xl font-bold ${visuals.textColor}`}>
            {weather.location}
          </p>
          <p className={`${visuals.textColor} opacity-90`}>
            {weather.condition}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 text-3xl font-bold ${visuals.textColor}`}
        >
          <Thermometer
            className={`w-7 h-7 ${tempColor} transition-colors duration-1000`}
          />
          {weather.temperature}°C
        </div>
      </div>

      <p className={`mt-4 text-sm ${visuals.impactColor} italic`}>{impact}</p>
    </div>
  );
}