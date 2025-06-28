import type { LucideIcon } from "lucide-react"

interface V7ShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "info" | "danger"
  theme: "light" | "dark"
}

export function V7ShipmentStatus({ title, count, icon: Icon, color, theme }: V7ShipmentStatusProps) {
  // تحديث دالة getColorClass لتستخدم نظام الألوان الموحد
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "text-[#294D8B] bg-[#294D8B]/10"
      case "secondary":
        return "text-[#5791F4] bg-[#5791F4]/10"
      case "success":
        return "text-emerald-600 bg-emerald-50"
      case "warning":
        return "text-sky-600 bg-sky-50"
      case "info":
        return "text-indigo-600 bg-indigo-50"
      case "danger":
        return "text-rose-600 bg-rose-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const colorClass = getColorClass()

  return (
    <div className="v7-neu-card-inner p-3 sm:p-4 md:p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className={`v7-neu-icon-sm sm:v7-neu-icon ${colorClass}`}>
          <Icon className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
        </div>
        <div className="flex-1">
          <div className="text-xs sm:text-sm text-[#6d6a67]">{title}</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{count}</div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 md:mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass.split(" ")[0]} transition-all duration-500 group-hover:w-full`}
          style={{ width: `${Math.min(count * 10, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
