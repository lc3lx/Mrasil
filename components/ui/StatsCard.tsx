"use client";

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-white",
  gradientFrom = "from-blue-500",
  gradientTo = "to-blue-600",
  trend,
  loading = false 
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl shadow-lg animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded-lg w-24"></div>
            <div className="h-8 bg-gray-300 rounded-lg w-20"></div>
          </div>
          <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer`}>
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium tracking-wide">{title}</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-white drop-shadow-sm">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
                trend.isPositive 
                  ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30' 
                  : 'bg-red-400/20 text-red-100 border border-red-300/30'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Icon className={`h-8 w-8 ${iconColor} drop-shadow-sm`} />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-white/10 group-hover:animate-ping"></div>
        </div>
      </div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:h-2 transition-all duration-300"></div>
    </div>
  );
}
