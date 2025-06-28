"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, Clock, MapPin, ArrowRight, Calendar, ClockIcon, Zap } from "lucide-react"

interface ModernShipmentCardProps {
  id: number
  from: string
  to: string
  status: "delivered" | "transit" | "processing"
  date: string
  time: string
  priority: "عادي" | "سريع" | "فائق السرعة"
}

export function ModernShipmentCard({ id, from, to, status, date, time, priority }: ModernShipmentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusInfo = () => {
    switch (status) {
      case "delivered":
        return {
          icon: CheckCircle,
          text: "تم التوصيل",
          badgeClass: "modern-badge-success",
        }
      case "transit":
        return {
          icon: Truck,
          text: "جاري التوصيل",
          badgeClass: "modern-badge-warning",
        }
      case "processing":
        return {
          icon: Clock,
          text: "قيد المعالجة",
          badgeClass: "modern-badge-info",
        }
    }
  }

  const getPriorityClass = () => {
    switch (priority) {
      case "عادي":
        return "bg-gray-100 text-gray-600"
      case "سريع":
        return "bg-amber-100 text-amber-600"
      case "فائق السرعة":
        return "bg-purple-100 text-purple-600"
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon
  const priorityClass = getPriorityClass()

  return (
    <div
      className={`hover-lift rounded-xl clay-morphism p-4 transition-all ${isHovered ? "glow-border" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`modern-icon-container ${status === "delivered" ? "modern-gradient-success" : status === "transit" ? "modern-gradient-warning" : "modern-gradient-info"} text-white`}
          >
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold">شحنة #{id}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{from}</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{to}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`modern-badge ${statusInfo.badgeClass}`}>{statusInfo.text}</div>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${priorityClass}`}>
            <Zap className="h-3 w-3" />
            {priority}
          </div>
          <Button variant="outline" size="sm" className="rounded-xl clay-button">
            تفاصيل
          </Button>
        </div>
      </div>
    </div>
  )
}
