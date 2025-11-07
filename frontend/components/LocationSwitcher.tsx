"use client";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";

// --- LOCATION DATA ---
const nordicLocations = [
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Iceland", flag: "🇮🇸" },
];

// --- TYPE FOR LOCATION ---
type Location = {
  name: string;
  flag: string;
} | null;

// --- PROPS ---
interface LocationSwitcherProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

const LocationSwitcher: React.FC<LocationSwitcherProps> = ({
  isOpen,
  onToggle,
  selectedLocation,
  onLocationChange,
}) => {
  return (
    <div className="relative">
      {/* Visible Button */}
      <div
        className="hidden md:flex items-center gap-2 cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-110"
        onClick={onToggle}
      >
        {selectedLocation ? (
          <span className="text-xl -ml-1">{selectedLocation.flag}</span>
        ) : (
          <IoLocationOutline size={22} />
        )}
        <span className="text-base font-medium">
          {selectedLocation ? selectedLocation.name : "Location"}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-full bg-white rounded-lg shadow-lg overflow-hidden z-10">
          {nordicLocations.map((loc) => (
            <div
              key={loc.name}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 whitespace-nowrap text-black"
              onClick={() => {
                onLocationChange(loc);
                // onToggle(); // Removed: Parent now controls closing
              }}
            >
              <span className="text-xl">{loc.flag}</span>
              <span className="text-base font-medium">{loc.name}</span>
            </div>
          ))}
          {/* Reset button */}
          {selectedLocation && (
            <div
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 border-t text-black"
              onClick={() => {
                onLocationChange(null);
                // onToggle(); // Removed: Parent now controls closing
              }}
            >
              <IoLocationOutline size={22} />
              <span className="text-base font-medium">Location</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSwitcher;