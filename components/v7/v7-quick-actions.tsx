import { Button } from "@/components/ui/button"
import { Truck, History, CreditCard, RefreshCcw, MapPin, ShieldCheck } from "lucide-react"

interface V7QuickActionsProps {
  theme: "light" | "dark"
}

export function V7QuickActions({ theme }: V7QuickActionsProps) {
  const actions = [
    {
      title: "تتبع شحنة",
      icon: Truck,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      icon: History,
      color: "text-[#5791F4]",
      bgColor: "bg-[#5791F4]/10",
      href: "/history",
    },
    {
      title: "المدفوعات",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/payments",
    },
    {
      title: "تحديث الحالة",
      icon: RefreshCcw,
      color: "text-[#294D8B]",
      bgColor: "bg-[#294D8B]/10",
      href: "/update-status",
    },
    {
      title: "مواقع التسليم",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/locations",
    },
    {
      title: "تأمين الشحنات",
      icon: ShieldCheck,
      color: "text-[#5791F4]",
      bgColor: "bg-[#5791F4]/10",
      href: "/insurance",
    },
  ]

  // تحسين شكل وتباعد الإجراءات السريعة
  return (
    <div className="v7-neu-card p-3 sm:p-4 md:p-6 rounded-xl v7-fade-in" style={{ transitionDelay: "0.4s" }}>
      <div className="mb-2 sm:mb-3 md:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#294D8B]">إجراءات سريعة</h3>
        <p className="text-[10px] sm:text-xs text-[#6d6a67]">الوصول السريع للخدمات الشائعة</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            className="v7-neu-button-flat flex h-auto flex-col items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 v7-stagger-item v7-fade-in"
            asChild
            style={{ animationDelay: `${0.4 + i * 0.05}s` }}
          >
            <a href={action.href}>
              <div className={`v7-neu-icon-sm ${action.color}`}>
                <action.icon className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5" />
              </div>
              <div className="text-center text-[8px] sm:text-[10px] md:text-xs font-medium">{action.title}</div>
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
