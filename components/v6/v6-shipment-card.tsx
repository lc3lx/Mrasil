"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, Clock, MapPin, ArrowRight, Calendar, ClockIcon, Zap } from "lucide-react"

interface V6ShipmentCardProps {
  id: number
  from: string
  to: string
  status: "delivered" | "transit" | "processing"
  date: string
  time: string
  priority: "عادي" | "سريع" | "فائق السرعة"
}

export function V6ShipmentCard({ id, from, to, status, date, time, priority }: V6ShipmentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusInfo = () => {
    switch (status) {
      case "delivered":
        return {
          icon: CheckCircle,
          text: "تم التوصيل",
          badgeClass: "v6-badge-success",
        }
      case "transit":
        return {
          icon: Truck,
          text: "جاري التوصيل",
          badgeClass: "v6-badge-warning",
        }
      case "processing":
        return {
          icon: Clock,
          text: "قيد المعالجة",
          badgeClass: "v6-badge-info",
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
      className={`v6-hover-lift rounded-xl v6-clay p-4 transition-all ${isHovered ? "v6-glow-border" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`v6-icon-container ${status === "delivered" ? "v6-gradient-success" : status === "transit" ? "v6-gradient-warning" : "v6-gradient-info"} text-white`}
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
          <div className={`v6-badge ${statusInfo.badgeClass}`}>{statusInfo.text}</div>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${priorityClass}`}>
            <Zap className="h-3 w-3" />
            {priority}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl v6-clay-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "إغلاق" : "تفاصيل"}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 v6-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">تفاصيل الشحنة</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رقم التتبع:</span>
                  <span className="font-medium">TRK{id}SA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الوزن:</span>
                  <span className="font-medium">2.5 كجم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الأبعاد:</span>
                  <span className="font-medium">30 × 20 × 15 سم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">طريقة الدفع:</span>
                  <span className="font-medium">بطاقة ائتمان</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">معلومات المستلم</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الاسم:</span>
                  <span className="font-medium">محمد أحمد</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الهاتف:</span>
                  <span className="font-medium">+966 50 123 4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العنوان:</span>
                  <span className="font-medium">حي النزهة، شارع الأمير سلطان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المدينة:</span>
                  <span className="font-medium">{to}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="rounded-xl v6-clay-button">
              طباعة الفاتورة
            </Button>
            <Button size="sm" className="rounded-xl v6-gradient-primary text-white">
              تتبع الشحنة
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
