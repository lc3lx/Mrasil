import { Button } from "@/components/ui/button"
import { Truck, History, CreditCard, RefreshCcw, MapPin, ShieldCheck } from "lucide-react"

export function PremiumQuickActions() {
  const actions = [
    {
      title: "تتبع شحنة",
      icon: Truck,
      color: "bg-amber-100 text-amber-600",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      icon: History,
      color: "bg-blue-100 text-blue-600",
      href: "/history",
    },
    {
      title: "المدفوعات",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
      href: "/payments",
    },
    {
      title: "تحديث الحالة",
      icon: RefreshCcw,
      color: "bg-purple-100 text-purple-600",
      href: "/update-status",
    },
    {
      title: "مواقع التسليم",
      icon: MapPin,
      color: "bg-rose-100 text-rose-600",
      href: "/locations",
    },
    {
      title: "تأمين الشحنات",
      icon: ShieldCheck,
      color: "bg-primary/10 text-primary",
      href: "/insurance",
    },
  ]

  return (
    <div className="premium-card">
      <div className="mb-4">
        <h3 className="text-xl font-bold">إجراءات سريعة</h3>
        <p className="text-sm text-muted-foreground">الوصول السريع للخدمات الشائعة</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            className="hover-float flex h-auto flex-col items-center justify-center gap-2 rounded-xl border p-3 hover:bg-accent hover:text-primary"
            asChild
          >
            <a href={action.href}>
              <div className={`rounded-xl p-2 ${action.color}`}>
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
