"use client";

import { ReactNode } from 'react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, row: any) => ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable({ 
  loading, 
  data, 
  columns, 
  emptyMessage = "لا توجد بيانات",
  className = ""
}: DataTableProps) {
  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
        <div className="p-8">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-6 p-4 bg-white/50 rounded-xl border border-gray-100/50">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-pulse"></div>
                </div>
                <div className="w-24 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
        <div className="relative p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
            </svg>
          </div>
          <p className="text-gray-700 text-xl font-bold mb-2">{emptyMessage}</p>
          <p className="text-gray-500 text-base">ستظهر البيانات هنا عند توفرها</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="relative overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50/90 to-gray-100/80 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-8 py-6 text-right text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200/60"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/40">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-purple-50/40 transition-all duration-300 group hover:shadow-sm"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-8 py-6 whitespace-nowrap">
                    <div className="group-hover:scale-[1.02] transition-transform duration-200">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
