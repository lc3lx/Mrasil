import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, Clock, MapPin, ArrowRight, Calendar, ClockIcon, Zap } from "lucide-react"

interface UltraShipmentCardProps {
  id: number
  from: string
  to: string
  status: "delivered" | "transit" | "processing"
  date: string
  time: string
  priority: "عادي" | "سريع" | "فائق السرعة"
}

export function UltraShipmentCard({ id, from, to, status, date, time, priority }: UltraShipmentCardProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "delivered":
        return {
          icon: CheckCircle,
          text: "تم التوصيل",
          badgeClass: "status-badge-success",
        }
      case "transit":
        return {
          icon: Truck,
          text: "جاري التوصيل",
          badgeClass: "status-badge-warning",
        }
      case "processing":
        return {
          icon: Clock,
          text: "قيد المعالجة",
          badgeClass: "status-badge-info",
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
    <div className="hover-float-luxury rounded-xl glass-morphism p-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`luxury-icon-container ${status === "delivered" ? "luxury-success" : status === "transit" ? "luxury-warning" : "luxury-info"} text-white`}
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
          <div className={`status-badge-luxury ${statusInfo.badgeClass}`}>{statusInfo.text}</div>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${priorityClass}`}>
            <Zap className="h-3 w-3" />
            {priority}
          </div>
          <Button variant="outline" size="sm" className="rounded-xl glass-morphism border-none">
            تفاصيل
          </Button>
        </div>
      </div>
    </div>
  )
}
