"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface UltraStatsCardProps {
  title: string
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "info"
  stats: Array<{
    label: string
    value: string
  }>
  action?: {
    label: string
    onClick: () => void
  }
}

export function UltraStatsCard({ title, icon: Icon, color, stats, action }: UltraStatsCardProps) {
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
    <div className="luxury-card hover-float-luxury glass-morphism overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${colors.gradient}`}></div>
      <div className="mb-4 flex items-center gap-3">
        <div className={`luxury-icon-container ${colors.gradient}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {action && (
        <Button onClick={action.onClick} className={`mt-4 w-full ${colors.gradient} text-white luxury-button`}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
