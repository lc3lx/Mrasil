"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ModernPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: ModernPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-6 bg-gradient-to-r from-white/95 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="text-sm font-medium text-gray-700">
          عرض <span className="font-bold text-blue-600">{startItem.toLocaleString()}</span> إلى <span className="font-bold text-blue-600">{endItem.toLocaleString()}</span> من <span className="font-bold text-gray-800">{totalItems.toLocaleString()}</span> عنصر
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="group flex items-center gap-2 px-5 py-3 text-sm font-bold text-gray-700 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
        >
          <ChevronRight className="h-4 w-4 group-hover:animate-bounce" />
          السابق
        </button>
        
        <div className="flex items-center gap-2">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="px-4 py-3 text-gray-400 font-bold">
                ⋯
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                    : 'text-gray-600 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="group flex items-center gap-2 px-5 py-3 text-sm font-bold text-gray-700 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:hover:scale-100"
        >
          التالي
          <ChevronLeft className="h-4 w-4 group-hover:animate-bounce" />
        </button>
      </div>
    </div>
  );
}
