import React, { useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableCitySelectProps {
  value: string;
  onChange: (value: string) => void;
  cities: string[];
  placeholder?: string;
}

export const SearchableCitySelect: React.FC<SearchableCitySelectProps> = ({ value, onChange, cities, placeholder }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredCities = useMemo(
    () => cities.filter((city) => city.toLowerCase().includes(search.toLowerCase())),
    [cities, search]
  );

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "flex items-center v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full cursor-pointer",
          open && "ring-2 ring-[#3498db]"
        )}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        style={{ direction: "rtl", fontFamily: "inherit" }}
      >
        <MapPin className="h-4 w-4 text-[#3498db] mr-2" />
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder || "اختر المدينة"}
        </span>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-100 focus:outline-none"
            placeholder="ابحث عن المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{ direction: "rtl", fontFamily: "inherit" }}
          />
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div
                key={city}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-blue-50 text-right",
                  city === value && "bg-blue-100 font-bold"
                )}
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {city}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">لا توجد نتائج</div>
          )}
        </div>
      )}
    </div>
  );
};
