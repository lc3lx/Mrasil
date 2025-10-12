"use client";

import { Search } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
  }[];
  children?: React.ReactNode;
}

export default function FilterToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "بحث...",
  filters = []
}: FilterToolbarProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/95 via-blue-50/30 to-purple-50/20 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/60 shadow-xl">
      {/* Animated background effects */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-6 py-4 border-2 border-gray-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 hover:border-gray-300 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md placeholder-gray-400"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>
        
        {filters.map((filter, index) => (
          <div key={index} className="relative group">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="appearance-none px-6 py-4 border-2 border-gray-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 hover:border-gray-300 transition-all duration-300 text-sm font-bold min-w-[180px] shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="" className="font-medium">{filter.placeholder}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value} className="font-medium">
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <svg className="absolute left-auto right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
