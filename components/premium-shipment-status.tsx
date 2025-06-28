import type { LucideIcon } from "lucide-react"

interface PremiumShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "green" | "amber" | "blue" | "purple"
}

export function PremiumShipmentStatus({ title, count, icon: Icon, color }: PremiumShipmentStatusProps) {
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return {
          gradient: "green-gradient",
          bgLight: "bg-green-50",
          textColor: "text-green-600",
        }
      case "amber":
        return {
          gradient: "amber-gradient",
          bgLight: "bg-amber-50",
          textColor: "text-amber-600",
        }
      case "blue":
        return {
          gradient: "blue-gradient",
          bgLight: "bg-blue-50",
          textColor: "text-blue-600",
        }
      case "purple":
        return {
          gradient: "purple-gradient",
          bgLight: "bg-purple-50",
          textColor: "text-purple-600",
        }
      default:
        return {
          gradient: "primary-gradient",
          bgLight: "bg-primary/5",
          textColor: "text-primary",
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div className="premium-card hover-float overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${colors.gradient}`}></div>
      <div className="flex items-center gap-4">
        <div className={`premium-icon-container ${colors.bgLight}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <div>
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </div>
    </div>
  )
}
