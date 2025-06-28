import type { LucideIcon } from "lucide-react"

interface UltraShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "info"
}

export function UltraShipmentStatus({ title, count, icon: Icon, color }: UltraShipmentStatusProps) {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return {
          gradient: "luxury-success",
          textColor: "text-white",
        }
      case "warning":
        return {
          gradient: "luxury-warning",
          textColor: "text-white",
        }
      case "info":
        return {
          gradient: "luxury-info",
          textColor: "text-white",
        }
      case "secondary":
        return {
          gradient: "luxury-secondary",
          textColor: "text-white",
        }
      default:
        return {
          gradient: "luxury-primary",
          textColor: "text-white",
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div className="card-3d">
      <div className="card-3d-inner">
        <div className="luxury-card hover-float-luxury glass-morphism overflow-hidden">
          <div className={`absolute inset-x-0 top-0 h-1 ${colors.gradient}`}></div>
          <div className="flex items-center gap-4">
            <div className={`luxury-icon-container ${colors.gradient}`}>
              <Icon className={`h-6 w-6 ${colors.textColor}`} />
            </div>
            <div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground">{title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
