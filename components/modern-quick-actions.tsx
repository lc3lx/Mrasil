import { Button } from "@/components/ui/button"
import { Truck, History, CreditCard, RefreshCcw, MapPin, ShieldCheck } from "lucide-react"

export function ModernQuickActions() {
  const actions = [
    {
      title: "تتبع شحنة",
      icon: Truck,
      color: "modern-gradient-warning",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      icon: History,
      color: "modern-gradient-info",
      href: "/history",
    },
    {
      title: "المدفوعات",
      icon: CreditCard,
      color: "modern-gradient-success",
      href: "/payments",
    },
    {
      title: "تحديث الحالة",
      icon: RefreshCcw,
      color: "modern-gradient-secondary",
      href: "/update-status",
    },
    {
      title: "مواقع التسليم",
      icon: MapPin,
      color: "modern-gradient-danger",
      href: "/locations",
    },
    {
      title: "تأمين الشحنات",
      icon: ShieldCheck,
      color: "modern-gradient-primary",
      href: "/insurance",
    },
  ]

  return (
    <div className="clay-morphism p-6 rounded-3xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold gradient-text">إجراءات سريعة</h3>
        <p className="text-sm text-muted-foreground">الوصول السريع للخدمات الشائعة</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            className="hover-lift flex h-auto flex-col items-center justify-center gap-2 rounded-xl clay-button p-3"
            asChild
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
