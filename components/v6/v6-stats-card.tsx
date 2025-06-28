"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface V6StatsCardProps {
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

export function V6StatsCard({ title, icon: Icon, color, stats, action }: V6StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return {
          gradient: "v6-gradient-success",
          textColor: "text-white",
        }
      case "warning":
        return {
          gradient: "v6-gradient-warning",
          textColor: "text-white",
        }
      case "info":
        return {
          gradient: "v6-gradient-info",
          textColor: "text-white",
        }
      case "secondary":
        return {
          gradient: "v6-gradient-secondary",
          textColor: "text-white",
        }
      default:
        return {
          gradient: "v6-gradient-primary",
          textColor: "text-white",
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div
      className={`v6-clay p-6 rounded-3xl v6-hover-lift ${isHovered ? "v6-glow-border" : ""} v6-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: "0.3s" }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`v6-icon-container v6-blob ${colors.gradient}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <h3 className="text-lg font-bold v6-gradient-text">{title}</h3>
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
        <Button onClick={action.onClick} className={`mt-4 w-full ${colors.gradient} text-white v6-button`}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
