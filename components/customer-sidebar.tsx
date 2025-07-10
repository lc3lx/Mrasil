"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Home,
  Package,
  ShoppingBag,
  Truck,
  CreditCard,
  Settings,
  Headphones,
  X,
  HelpCircle,
  History,
  RotateCcw,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { routes, isActiveRoute } from "@/lib/routes"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function CustomerSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "الرئيسية",
      href: routes.home,
      icon: Home,
      active: isActiveRoute(pathname, routes.home),
    },
    {
      title: "طلباتي",
      href: routes.orders,
      icon: ShoppingBag,
      active: isActiveRoute(pathname, routes.orders),
    },
    {
      title: "شحناتي",
      href: routes.shipments,
      icon: Package,
      active: isActiveRoute(pathname, routes.shipments),
    },
    {
      title: "إنشاء شحنة",
      href: routes.createShipment,
      icon: ShoppingBag,
      active: isActiveRoute(pathname, routes.createShipment),
    },
    {
      title: "تتبع الشحنات",
      href: routes.tracking,
      icon: Truck,
      active: isActiveRoute(pathname, routes.tracking),
    },
    {
      title: "الرجيع",
      href: routes.returns,
      icon: RotateCcw,
      active: isActiveRoute(pathname, routes.returns),
    },
    {
      title: "سجل الشحنات",
      href: routes.history,
      icon: History,
      active: isActiveRoute(pathname, routes.history),
    },
    {
      title: "المدفوعات",
      href: routes.payments,
      icon: CreditCard,
      active: isActiveRoute(pathname, routes.payments),
    },
    {
      title: "الإعدادات",
      href: routes.settings,
      icon: Settings,
      active: isActiveRoute(pathname, routes.settings),
    },
   
  ]

  return (
    <>
      <aside className="hidden w-64 border-l bg-white shadow-sm md:block">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="flex h-full flex-col gap-1 p-4 border rounded-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all border hover:bg-blue-700 hover:text-white ${
                  item.active
                    ? "bg-secondary text-white font-medium"
                    : "text-gray-700"
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                <span>{item.title}</span>
                {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
              </Link>
            ))}

            <div className="mt-auto">
              <div className="mt-6 rounded-xl bg-accent p-4">
                <div className="mb-2 text-sm font-medium">تحتاج مساعدة؟</div>
                <p className="mb-3 text-xs text-muted-foreground">فريق الدعم الفني متاح على مدار الساعة لمساعدتك</p>
                <Button size="sm" className="w-full primary-gradient button-hover">
                  <Headphones className="mr-2 h-4 w-4" />
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-lg font-bold text-primary">شيب إكسبرس</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-1 p-4 border rounded-lg mx-4 my-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all border hover:bg-blue-700 hover:text-white ${
                    item.active
                      ? "bg-secondary text-white font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                  <span>{item.title}</span>
                  {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
                </Link>
              ))}

              <div className="mt-6 rounded-xl bg-accent p-4">
                <div className="mb-2 text-sm font-medium">تحتاج مساعدة؟</div>
                <p className="mb-3 text-xs text-muted-foreground">فريق الدعم الفني متاح على مدار الساعة لمساعدتك</p>
                <Button size="sm" className="w-full primary-gradient button-hover">
                  <Headphones className="mr-2 h-4 w-4" />
                  تواصل معنا
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
