import { Button } from "@/components/ui/button"
import { Truck, History, CreditCard, RefreshCcw, MapPin, ShieldCheck } from "lucide-react"

export function V6QuickActions() {
  const actions = [
    {
      title: "تتبع شحنة",
      icon: Truck,
      color: "v6-gradient-warning",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      icon: History,
      color: "v6-gradient-info",
      href: "/history",
    },
    {
      title: "المدفوعات",
      icon: CreditCard,
      color: "v6-gradient-success",
      href: "/payments",
    },
    {
      title: "تحديث الحالة",
      icon: RefreshCcw,
      color: "v6-gradient-secondary",
      href: "/update-status",
    },
    {
      title: "مواقع التسليم",
      icon: MapPin,
      color: "v6-gradient-danger",
      href: "/locations",
    },
    {
      title: "تأمين الشحنات",
      icon: ShieldCheck,
      color: "v6-gradient-primary",
      href: "/insurance",
    },
  ]

  return (
    <div className="v6-clay p-6 rounded-3xl v6-fade-in" style={{ transitionDelay: "0.4s" }}>
      <div className="mb-4">
        <h3 className="text-xl font-bold v6-gradient-text">إجراءات سريعة</h3>
        <p className="text-sm text-muted-foreground">الوصول السريع للخدمات الشائعة</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            className="v6-hover-lift flex h-auto flex-col items-center justify-center gap-2 rounded-xl v6-clay-button p-3 v6-stagger-item v6-fade-in"
            asChild
            style={{ animationDelay: `${0.4 + i * 0.05}s` }}
          >
            <a href={action.href}>
              <div className={`rounded-xl p-2 ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center text-xs font-medium">{action.title}</div>
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
