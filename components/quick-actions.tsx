import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Truck, History, CreditCard } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "إنشاء شحنة",
      description: "إنشاء شحنة جديدة",
      icon: Plus,
      color: "bg-primary/10 text-primary",
      href: "/create-shipment",
    },
    {
      title: "تتبع شحنة",
      description: "متابعة حالة الشحنة",
      icon: Truck,
      color: "bg-amber-100 text-amber-600",
      href: "/tracking",
    },
    {
      title: "سجل الشحنات",
      description: "عرض الشحنات السابقة",
      icon: History,
      color: "bg-blue-100 text-blue-600",
      href: "/history",
    },
    {
      title: "المدفوعات",
      description: "إدارة المدفوعات",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
      href: "/payments",
    },
  ]

  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardHeader className="bg-accent pb-4">
        <CardTitle className="text-xl">إجراءات سريعة</CardTitle>
        <CardDescription>الوصول السريع للخدمات الشائعة</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className="flex h-auto flex-col items-center justify-center gap-2 rounded-xl border p-4 hover:bg-accent hover:text-primary"
              asChild
            >
              <a href={action.href}>
                <div className={`rounded-full p-2 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
