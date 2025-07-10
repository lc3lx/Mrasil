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
  BarChart3,
  MapPin,
  Users,
  Star,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function PremiumSidebar({ open, onClose }: SidebarProps) {
  const navItems = [
    {
      title: "الرئيسية",
      href: "/",
      icon: Home,
      active: true,
    },
    {
      title: "شحناتي",
      href: "/shipments",
      icon: Package,
    },
    {
      title: "إنشاء شحنة",
      href: "/create-shipment",
      icon: ShoppingBag,
    },
    {
      title: "تتبع الشحنات",
      href: "/tracking",
      icon: Truck,
    },
    {
      title: "مواقع التسليم",
      href: "/locations",
      icon: MapPin,
    },
    {
      title: "سجل الشحنات",
      href: "/history",
      icon: History,
    },
    {
      title: "المدفوعات",
      href: "/payments",
      icon: CreditCard,
    },
    {
      title: "التقارير",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "العملاء",
      href: "/customers",
      icon: Users,
    },
    {
      title: "الإعدادات",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "المساعدة",
      href: "/help",
      icon: HelpCircle,
    },
  ]

  return (
    <>
      <aside className="hidden w-72 border-l bg-white shadow-sm md:block">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="flex h-full flex-col gap-1 p-4">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-primary/20 p-1">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">العضوية الذهبية</span>
              </div>
              <div className="mb-3 text-xs text-muted-foreground">استمتع بمزايا حصرية وخصومات خاصة على جميع شحناتك</div>
              <Button size="sm" className="w-full primary-gradient premium-button">
                <span>ترقية العضوية</span>
              </Button>
            </div>

            <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">القائمة الرئيسية</div>
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover-float flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                  item.active
                    ? "bg-primary text-white font-medium shadow-md"
                    : "text-gray-700 hover:bg-accent hover:text-primary"
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                <span>{item.title}</span>
                {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
              </Link>
            ))}

            <div className="my-2 px-3 text-xs font-medium text-muted-foreground">إدارة الحساب</div>
            {navItems.slice(5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover-float flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                  item.active
                    ? "bg-primary text-white font-medium shadow-md"
                    : "text-gray-700 hover:bg-accent hover:text-primary"
                }`}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                <span>{item.title}</span>
                {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
              </Link>
            ))}

            <div className="mt-auto">
              <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-white shadow-lg">
                <div className="mb-2 text-sm font-medium">تحتاج مساعدة؟</div>
                <p className="mb-3 text-xs text-white/80">فريق الدعم الفني متاح على مدار الساعة لمساعدتك</p>
                <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 premium-button">
                  <Headphones className="mr-2 h-4 w-4" />
                  تواصل معنا
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-72 p-0">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg primary-gradient">
                <span className="text-sm font-bold text-white">SE</span>
              </div>
              <span className="text-lg font-bold text-primary">شيب إكسبرس</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-1 p-4">
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-primary/20 p-1">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">العضوية الذهبية</span>
                </div>
                <div className="mb-3 text-xs text-muted-foreground">
                  استمتع بمزايا حصرية وخصومات خاصة على جميع شحناتك
                </div>
                <Button size="sm" className="w-full primary-gradient premium-button">
                  <span>ترقية العضوية</span>
                </Button>
              </div>

              <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">القائمة الرئيسية</div>
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover-float flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                    item.active
                      ? "bg-primary text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-accent hover:text-primary"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                  <span>{item.title}</span>
                  {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
                </Link>
              ))}

              <div className="my-2 px-3 text-xs font-medium text-muted-foreground">إدارة الحساب</div>
              {navItems.slice(5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover-float flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                    item.active
                      ? "bg-primary text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-accent hover:text-primary"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                  <span>{item.title}</span>
                  {item.active && <div className="mr-auto h-2 w-2 rounded-full bg-white"></div>}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
