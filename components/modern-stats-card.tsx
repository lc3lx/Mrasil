"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface ModernStatsCardProps {
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

export function ModernStatsCard({ title, icon: Icon, color, stats, action }: ModernStatsCardProps) {
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
      <div className="mb-4 flex items-center gap-3">
        <div className={`modern-icon-container blob-shape ${colors.gradient}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <h3 className="text-lg font-bold gradient-text">{title}</h3>
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
        <Button onClick={action.onClick} className={`mt-4 w-full ${colors.gradient} text-white modern-button`}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
