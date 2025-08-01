import type { LucideIcon } from "lucide-react"

interface ShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "green" | "amber" | "blue" | "purple"
}

export function ShipmentStatus({ title, count, icon: Icon, color }: ShipmentStatusProps) {
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "bg-green-50 text-green-600 border-green-100"
      case "amber":
        return "bg-amber-50 text-amber-600 border-amber-100"
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-100"
      case "purple":
        return "bg-purple-50 text-purple-600 border-purple-100"
      default:
        return "bg-primary/5 text-primary border-primary/10"
    }
  }

  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 ${getColorClasses()}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/80`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-lg font-bold">{count}</div>
        <div className="text-sm">{title}</div>
      </div>
    </div>
  )
}
