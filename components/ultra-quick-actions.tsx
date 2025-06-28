import { Button } from "@/components/ui/button"
import { Truck, History, CreditCard, RefreshCcw, MapPin, ShieldCheck } from "lucide-react"

export function UltraQuickActions() {
  const actions = [
    {
      title: "تتبع شحنة",
      icon: Truck,
      color: "luxury-warning",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      icon: History,
      color: "luxury-info",
      href: "/history",
    },
    {
      title: "المدفوعات",
      icon: CreditCard,
      color: "luxury-success",
      href: "/payments",
    },
    {
      title: "تحديث الحالة",
      icon: RefreshCcw,
      color: "luxury-secondary",
      href: "/update-status",
    },
    {
      title: "مواقع التسليم",
      icon: MapPin,
      color: "luxury-danger",
      href: "/locations",
    },
    {
      title: "تأمين الشحنات",
      icon: ShieldCheck,
      color: "luxury-primary",
      href: "/insurance",
    },
  ]

  return (
    <div className="luxury-card glass-morphism">
      <div className="mb-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          إجراءات سريعة
        </h3>
        <p className="text-sm text-muted-foreground">الوصول السريع للخدمات الشائعة</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            className="hover-float-luxury flex h-auto flex-col items-center justify-center gap-2 rounded-xl glass-morphism border-none p-3 hover:bg-white/50"
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
