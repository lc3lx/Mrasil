"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
// إضافة أيقونة RotateCcw للاستيراد
import {
  Home,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
  Settings,
  Headphones,
  X,
  BarChart3,
  RotateCcw,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { routes, isActiveRoute } from "@/lib/routes"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  // تحديث مصفوفة عناصر القائمة لإضافة عنصر الرجيع بعد عنصر الشحنات
  const navItems = [
    {
      title: "الرئيسية",
      href: routes.home,
      icon: Home,
      active: isActiveRoute(pathname, routes.home),
    },
    {
      title: "الطلبات",
      href: routes.orders,
      icon: ShoppingBag,
      active: isActiveRoute(pathname, routes.orders),
    },
    {
      title: "الشحنات",
      href: routes.shipments,
      icon: Package,
      active: isActiveRoute(pathname, routes.shipments),
    },
    {
      title: "الرجيع",
      href: routes.returns,
      icon: RotateCcw,
      active: isActiveRoute(pathname, routes.returns),
    },
    {
      title: "التتبع",
      href: routes.tracking,
      icon: Truck,
      active: isActiveRoute(pathname, routes.tracking),
    },
    {
      title: "العملاء",
      href: routes.customers,
      icon: Users,
      active: isActiveRoute(pathname, routes.customers),
    },
    {
      title: "الرصيد",
      href: routes.balance,
      icon: Wallet,
      active: isActiveRoute(pathname, routes.balance),
    },
 
    {
      title: "الإعدادات",
      href: routes.settings,
      icon: Settings,
      active: isActiveRoute(pathname, routes.settings),
    },
    {
      title: "الدعم",
      href: routes.support,
      icon: Headphones,
      active: isActiveRoute(pathname, routes.support),
    },
  ]

  return (
    <>
      <aside className="hidden w-64 border-l bg-white shadow-sm md:block">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="flex h-full flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  item.active
                    ? "primary-gradient text-white shadow-sm"
                    : "text-gray-700 hover:bg-accent hover:text-primary"
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "" : "text-gray-500"}`} />
                <span className="font-medium">{item.title}</span>
                {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
              </Link>
            ))}

            <div className="mt-auto">
              <div className="mt-6 rounded-lg bg-accent p-4">
                <div className="mb-2 text-sm font-medium">تحتاج مساعدة؟</div>
                <p className="mb-3 text-xs text-muted-foreground">فريق الدعم الفني متاح على مدار الساعة لمساعدتك</p>
                <Button size="sm" className="w-full primary-gradient">
                  <Headphones className="mr-2 h-4 w-4" />
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-64 p-0">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-lg font-bold text-primary">شيب إكسبرس</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    item.active
                      ? "primary-gradient text-white shadow-sm"
                      : "text-gray-700 hover:bg-accent hover:text-primary"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? "" : "text-gray-500"}`} />
                  <span className="font-medium">{item.title}</span>
                  {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
                </Link>
              ))}

              <div className="mt-6 rounded-lg bg-accent p-4">
                <div className="mb-2 text-sm font-medium">تحتاج مساعدة؟</div>
                <p className="mb-3 text-xs text-muted-foreground">فريق الدعم الفني متاح على مدار الساعة لمساعدتك</p>
                <Button size="sm" className="w-full primary-gradient">
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
