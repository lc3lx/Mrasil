import React from "react";

interface CountryAutocompleteDropdownProps {
  search: string;
  onSelect: (item: { name_ar: string }) => void;
}

const countries = [
  { name_ar: "السعودية" },
  { name_ar: "الإمارات" },
  { name_ar: "قطر" },
  { name_ar: "الكويت" },
  { name_ar: "البحرين" },
  { name_ar: "عمان" },
  // ... أضف باقي الدول حسب حاجتك
];

const CountryAutocompleteDropdown: React.FC<CountryAutocompleteDropdownProps> = ({ search, onSelect }) => {
  const filtered = countries.filter((c) => c.name_ar.includes(search));

  if (filtered.length === 0) return null;

  return (
    <ul className="absolute z-10 w-full bg-[#f3f6fa] border  border-none rounded shadow-md max-h-48 overflow-y-auto">
      {filtered.map((item, i) => (
        <li
          key={i}
          className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-right"
          onClick={() => onSelect(item)}
        >
          {item.name_ar}
        </li>
      ))}
    </ul>
  );
};

export default CountryAutocompleteDropdown;
