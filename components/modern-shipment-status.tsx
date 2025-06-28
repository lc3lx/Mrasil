"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"

interface ModernShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "info"
}

export function ModernShipmentStatus({ title, count, icon: Icon, color }: ModernShipmentStatusProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return {
          gradient: "modern-gradient-success",
          textColor: "text-white",
        }
      case "warning":
        return {
          gradient: "modern-gradient-warning",
          textColor: "text-white",
        }
      case "info":
        return {
          gradient: "modern-gradient-info",
          textColor: "text-white",
        }
      case "secondary":
        return {
          gradient: "modern-gradient-secondary",
          textColor: "text-white",
        }
      default:
        return {
          gradient: "modern-gradient-primary",
          textColor: "text-white",
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div
      className={`clay-morphism p-6 rounded-3xl hover-lift ${isHovered ? "glow-border" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className={`modern-icon-container blob-shape ${colors.gradient}`}>
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
