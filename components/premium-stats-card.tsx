"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface PremiumStatsCardProps {
  title: string
  icon: LucideIcon
  color: "blue" | "green" | "amber" | "purple"
  stats: Array<{
    label: string
    value: string
  }>
  action?: {
    label: string
    onClick: () => void
  }
}

export function PremiumStatsCard({ title, icon: Icon, color, stats, action }: PremiumStatsCardProps) {
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
      <div className="mb-4 flex items-center gap-3">
        <div className={`premium-icon-container ${colors.bgLight}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
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
        <Button onClick={action.onClick} className={`mt-4 w-full ${colors.gradient} text-white premium-button`}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
