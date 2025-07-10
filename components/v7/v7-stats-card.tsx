"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { WalletRechargeModal } from "./v7-wallet-recharge-modal"

interface StatItem {
  label: string
  value: string
  progress?: number
  trend?: "up" | "down"
}

interface V7StatsCardProps {
  title: string
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "danger" | "info"
  theme?: "light" | "dark"
  stats: StatItem[]
  action?: {
    label: string
    onClick: () => void
  }
}

export function V7StatsCard({ title, icon: Icon, color, theme = "light", stats, action }: V7StatsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // تحديث تعريف الألوان في colorMap لتشمل تدرجات لونية جميلة:
  const colorMap = {
    primary: {
      bg: "bg-gradient-to-br from-[#294D8B] to-[#1e3a6c]",
      text: "text-[#294D8B]",
      light: "bg-[#294D8B]/10",
      progressBg: "bg-[#294D8B]",
      hoverBg: "bg-[#1e3a6c]",
      darkModeBg: "bg-gradient-to-br from-[#294D8B] to-[#1e3a6c]",
      darkModeText: "text-[#5791F4]",
      iconColor: "text-blue-100",
    },
    secondary: {
      bg: "bg-gradient-to-br from-[#5791F4] to-[#4A7ED0]",
      text: "text-[#5791F4]",
      light: "bg-[#5791F4]/10",
      progressBg: "bg-[#5791F4]",
      hoverBg: "bg-[#4A7ED0]",
      darkModeBg: "bg-gradient-to-br from-[#5791F4] to-[#4A7ED0]",
      darkModeText: "text-[#5791F4]",
      iconColor: "text-blue-100",
    },
    success: {
      bg: "bg-gradient-to-br from-[#10b981] to-[#0d904f]",
      text: "text-[#0d904f]",
      light: "bg-green-100",
      progressBg: "bg-[#0d904f]",
      hoverBg: "bg-[#0b7a43]",
      darkModeBg: "bg-gradient-to-br from-[#34d399] to-[#10b981]",
      darkModeText: "text-[#34d399]",
      iconColor: "text-green-100",
    },
    warning: {
      bg: "bg-gradient-to-br from-[#5791F4] to-[#4A7ED0]", // تغيير من from-[#f59e0b] to-[#e67e22]
      text: "text-[#4A7ED0]", // تغيير من text-[#e67e22]
      light: "bg-blue-100", // تغيير من bg-yellow-100
      progressBg: "bg-[#4A7ED0]", // تغيير من bg-[#e67e22]
      hoverBg: "bg-[#3A6EC0]", // تغيير من bg-[#d35400]
      darkModeBg: "bg-gradient-to-br from-[#5791F4] to-[#4A7ED0]", // تغيير من from-[#fbbf24] to-[#f59e0b]
      darkModeText: "text-[#5791F4]", // تغيير من text-[#fbbf24]
      iconColor: "text-blue-100", // تغيير من text-yellow-100
    },
    danger: {
      bg: "bg-gradient-to-br from-[#ef4444] to-[#d91e18]",
      text: "text-[#d91e18]",
      light: "bg-red-100",
      progressBg: "bg-[#d91e18]",
      hoverBg: "bg-[#c0392b]",
      darkModeBg: "bg-gradient-to-br from-[#f87171] to-[#ef4444]",
      darkModeText: "text-[#f87171]",
      iconColor: "text-red-100",
    },
    info: {
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      text: "text-indigo-600",
      light: "bg-indigo-50",
      progressBg: "bg-indigo-600",
      hoverBg: "bg-indigo-700",
      darkModeBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      darkModeText: "text-indigo-300",
      iconColor: "text-indigo-100",
    },
  }

  // تحديث ألوان الحالات في v7-stats-card
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return {
          gradient: "from-emerald-500 to-emerald-600",
          textColor: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          iconColor: "text-emerald-500",
        }
      case "warning":
        return {
          gradient: "from-sky-500 to-sky-600",
          textColor: "text-sky-600",
          bgColor: "bg-sky-50",
          borderColor: "border-sky-200",
          iconColor: "text-sky-500",
        }
      case "info":
        return {
          gradient: "from-indigo-500 to-indigo-600",
          textColor: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-200",
          iconColor: "text-indigo-500",
        }
      case "danger":
        return {
          gradient: "from-rose-500 to-rose-600",
          textColor: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          iconColor: "text-rose-500",
        }
      default:
        return {
          gradient: "from-slate-500 to-slate-600",
          textColor: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          iconColor: "text-slate-500",
        }
    }
  }

  // تطبيق أنماط الوضع الداكن
  const isDark = theme === "dark"
  const cardClass = isDark ? "bg-[#1e293b] border-[#2a3349] text-[#f8fafc]" : "bg-white border-gray-200"

  // اختيار الألوان المناسبة بناءً على الوضع
  const bgColor = isDark ? colorMap[color].darkModeBg : colorMap[color].bg
  const textColor = isDark ? colorMap[color].darkModeText : colorMap[color].text
  const progressColor = isDark ? colorMap[color].darkModeBg : colorMap[color].progressBg
  const labelTextColor = isDark ? "text-gray-300" : "text-gray-600"
  const progressBgColor = isDark ? "bg-gray-700" : "bg-gray-100"

  // تحديث متغير iconColor لاستخدام الألوان المناسبة:
  const iconColor = isDark ? "text-white" : colorMap[color].iconColor

  return (
    <>
      <Card className={`${cardClass} v7-neu-card border-none overflow-hidden`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
            {/* تحديث div الأيقونة لتكون أكثر جمالاً: */}
            <div
              className={`v7-neu-icon ${bgColor} p-2.5 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden`}
              style={{
                boxShadow: isDark
                  ? "0 4px 10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                  : "0 4px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
              }}
            >
              <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-current to-transparent mix-blend-overlay"></div>
              <Icon className={`h-6 w-6 ${iconColor} relative z-10`} strokeWidth={2.5} />
            </div>
          </div>

          {/* Make stats fill the card vertically with even spacing */}
          <div className="flex flex-col justify-between h-[180px]">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col flex-1 justify-center">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${labelTextColor}`}>{stat.label}</span>
                  <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-800"}`}>{stat.value}</span>
                </div>

                {stat.progress !== undefined && (
                  <div className={`w-full h-2.5 ${progressBgColor} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${progressColor}`}
                      style={{
                        width: `${Math.min(stat.progress, 100)}%`,
                        boxShadow: isDark ? "0 0 8px rgba(255, 255, 255, 0.1)" : "0 0 8px rgba(0, 0, 0, 0.05)",
                      }}
                    ></div>
                  </div>
                )}

                {stat.trend && (
                  <div className="flex items-center justify-end">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${
                        stat.trend === "up"
                          ? isDark
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-700"
                          : isDark
                            ? "bg-red-900 text-red-300"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.trend === "up" ? "↑" : "↓"} {stat.value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {action && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-medium py-2.5 rounded-md transition-all duration-200"
            >
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>

      <WalletRechargeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
