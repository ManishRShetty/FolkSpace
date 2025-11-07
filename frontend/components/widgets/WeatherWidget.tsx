// components/widgets/WeatherWidget.tsx
"use client";
import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer } from "lucide-react";

interface WeatherWidgetProps {
  locationName: string | null;
}

interface WeatherData {
  temperature: number;
  windspeed: number;
  description: string;
  icon: JSX.Element;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ locationName }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationName) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Map location name to coordinates (roughly)
        const coords: Record<string, { lat: number; lon: number }> = {
          Sweden: { lat: 59.33, lon: 18.06 },
          Finland: { lat: 60.17, lon: 24.94 },
          Norway: { lat: 59.91, lon: 10.75 },
          Denmark: { lat: 55.68, lon: 12.57 },
          Iceland: { lat: 64.14, lon: -21.94 },
        };
        const { lat, lon } = coords[locationName] || coords["Norway"];

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`
        );
        const data = await res.json();

        const code = data.current.weather_code;
        let description = "Clear";
        let icon = <Sun />;
        if ([51, 61, 63, 65, 80, 81, 82].includes(code)) {
          description = "Rainy";
          icon = <CloudRain />;
        } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
          description = "Snowy";
          icon = <CloudSnow />;
        } else if ([1, 2, 3].includes(code)) {
          description = "Cloudy";
          icon = <Cloud />;
        }

        setWeather({
          temperature: data.current.temperature_2m,
          windspeed: data.current.wind_speed_10m,
          description,
          icon,
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [locationName]);

  return (
    <div className="p-4 text-center">
      <h3 className="text-lg font-semibold mb-2">
        {locationName || "Select a Location"}
      </h3>
      {loading ? (
        <p>Loading weather...</p>
      ) : weather ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl">{weather.icon}</div>
          <p className="text-xl font-bold">{weather.temperature}°C</p>
          <p className="text-sm text-gray-400">{weather.description}</p>
          <p className="text-xs text-gray-500">Wind: {weather.windspeed} km/h</p>
        </div>
      ) : (
        <p>No weather data.</p>
      )}
    </div>
  );
};

export default WeatherWidget;
