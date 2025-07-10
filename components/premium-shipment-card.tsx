import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, Clock, MapPin, ArrowRight, Calendar, ClockIcon } from "lucide-react"

interface PremiumShipmentCardProps {
  id: number
  from: string
  to: string
  status: "delivered" | "transit" | "processing"
  date: string
  time: string
}

export function PremiumShipmentCard({ id, from, to, status, date, time }: PremiumShipmentCardProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "delivered":
        return {
          icon: CheckCircle,
          text: "تم التوصيل",
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          borderColor: "border-green-200",
        }
      case "transit":
        return {
          icon: Truck,
          text: "جاري التوصيل",
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          borderColor: "border-amber-200",
        }
      case "processing":
        return {
          icon: Clock,
          text: "قيد المعالجة",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          borderColor: "border-blue-200",
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div
      className={`hover-scale rounded-xl border ${statusInfo.borderColor} bg-white p-4 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${statusInfo.bgColor} p-2`}>
            <StatusIcon className={`h-6 w-6 ${statusInfo.textColor}`} />
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
          <div
            className={`status-badge ${status === "delivered" ? "status-badge-success" : status === "transit" ? "status-badge-warning" : "status-badge-info"}`}
          >
            {statusInfo.text}
          </div>
          <Button variant="outline" size="sm" className="rounded-lg">
            تفاصيل
          </Button>
        </div>
      </div>
    </div>
  )
}
