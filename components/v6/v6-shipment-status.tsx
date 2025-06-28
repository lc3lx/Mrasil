"use client"

import { useState, useEffect } from "react"
import type { LucideIcon } from "lucide-react"

interface V6ShipmentStatusProps {
  title: string
  count: number
  icon: LucideIcon
  color: "primary" | "secondary" | "success" | "warning" | "info"
}

export function V6ShipmentStatus({ title, count, icon: Icon, color }: V6ShipmentStatusProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayCount((prev) => {
          if (prev >= count) {
            clearInterval(interval)
            return count
          }
          return prev + 1
        })
      }, 30)

      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [count])

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
      className={`v6-clay p-6 rounded-3xl v6-hover-lift ${isHovered ? "v6-glow-border" : ""} transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className={`v6-icon-container v6-blob ${colors.gradient}`}>
          <Icon className={`h-6 w-6 ${colors.textColor}`} />
        </div>
        <div>
          <div className="text-2xl font-bold">{displayCount}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </div>
    </div>
  )
}
