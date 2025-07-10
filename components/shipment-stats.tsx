import { Package, Truck, CheckCircle, Box } from "lucide-react"

export function ShipmentStats() {
  const stats = [
    {
      title: "تم التوصيل",
      value: "76",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "green-gradient",
    },
    {
      title: "جاري التوصيل",
      value: "0",
      icon: Truck,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      gradient: "yellow-gradient",
    },
    {
      title: "جاهز للشحن",
      value: "1",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "blue-gradient",
    },
    {
      title: "جميع الشحنات",
      value: "77",
      icon: Box,
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "primary-gradient",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="card-hover overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className={`h-1 w-full ${stat.gradient}`}></div>
          <div className="p-4 text-center">
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full animate-float"
              style={{ backgroundColor: stat.bgColor }}
            >
              <stat.icon className={`h-6 w-6 ${stat.color} stat-icon`} />
            </div>
            <div className="text-sm font-medium">{stat.title}</div>
            <div className="mt-1 text-3xl font-bold">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
