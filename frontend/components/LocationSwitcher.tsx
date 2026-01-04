"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import Flag from "react-world-flags";

// Define the Location type to match usage in CardNav
export type Location = {
  name: string;
  code: string; // ISO country code for flag
} | null;

interface LocationSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

// Nordic countries only - these match the WeatherWidget mock data
const locations = [
  { name: "Norway", code: "NO" },
  { name: "Sweden", code: "SE" },
  { name: "Finland", code: "FI" },
  { name: "Denmark", code: "DK" },
  { name: "Iceland", code: "IS" },
];

export default function LocationSwitcher({
  isOpen,
  onToggle,
  selectedLocation,
  onLocationChange,
}: LocationSwitcherProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none transition-colors"
        aria-expanded={isOpen}
      >
        <span className="w-5 h-4 overflow-hidden rounded-sm shadow-sm">
          <Flag code={selectedLocation?.code || "NO"} className="w-full h-full object-cover" />
        </span>
        <span className="leading-none">{selectedLocation?.name || "Norway"}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] ring-1 ring-black/5 z-50 overflow-hidden text-sm">
          <div className="py-1">
            {locations.map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => onLocationChange(loc)}
                className={`flex items-center w-full px-4 py-2.5 text-left transition-colors ${selectedLocation?.name === loc.name
                  ? "bg-gray-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="mr-3 w-6 h-4 overflow-hidden rounded-sm shadow-sm">
                  <Flag code={loc.code} className="w-full h-full object-cover" />
                </span>
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
