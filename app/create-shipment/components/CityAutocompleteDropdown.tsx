import React from "react";
import { useSearchCitiesQuery } from "../../api/cityApi";

interface CityAutocompleteDropdownProps {
  search: string;
  onSelect: (city: any) => void;
}

export const CityAutocompleteDropdown: React.FC<CityAutocompleteDropdownProps> = ({ search, onSelect }) => {
  const { data: cityResults, isLoading } = useSearchCitiesQuery(search, { skip: !search });
  // يدعم كل من data أو results حسب استجابة الـ API
  const citySuggestions = cityResults?.results || cityResults?.data || [];

  if (!search) return null;

  return (
    <div className="absolute z-50 w-full bg-[#f3f6fa] max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar mt-1">
      {isLoading ? (
        <div className="py-2 px-3 text-gray-500">جاري البحث...</div>
      ) : citySuggestions.length > 0 ? (
        citySuggestions.map((city: any) => (
          <div
            key={city.city_id || city._id}
            className="py-2 px-3 hover:bg-blue-50 cursor-pointer text-right"
            onMouseDown={() => onSelect(city)}
          >
            <span className="font-bold">{city.name_ar || city.name}</span>
            {city.region_name && (
              <span className="text-xs text-gray-500 mr-2">({city.region_name})</span>
            )}
          </div>
        ))
      ) : (
        <div className="py-2 px-3 text-gray-400">لا توجد نتائج</div>
      )}
    </div>
  );
};

export default CityAutocompleteDropdown;
