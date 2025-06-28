"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Home, Package, ShoppingBag, Box, RotateCcw } from "lucide-react"
import { routes, isActiveRoute } from "@/lib/routes"

interface V7MobileNavProps {
  theme: "light" | "dark"
}

export function V7MobileNav({ theme }: V7MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState<string>("/")

  // تحديث المسار الحالي عند تغيير pathname
  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname)
    }
  }, [pathname])

  const navItems = [
    {
      title: "الرئيسية",
      href: routes.home,
      icon: Home,
      active: isActiveRoute(currentPath, routes.home),
    },
    {
      title: "555شحناتي",
      href: routes.shipments,
      icon: Package,
      active: isActiveRoute(currentPath, routes.shipments),
    },
    {
      title: "إنشاء شحنة",
      href: routes.createShipment,
      icon: ShoppingBag,
      active: isActiveRoute(currentPath, routes.createShipment),
    },
    {
      title: "الطرود",
      href: routes.parcels,
      icon: Box,
      active: isActiveRoute(currentPath, routes.parcels),
    },
    {
      title: "المرتجعات",
      href: routes.returns,
      icon: RotateCcw,
      active: isActiveRoute(currentPath, routes.returns),
    },
  ]

  // دالة للتنقل بين الصفحات
  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#3498db]/10 bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] dark:from-[#1a365d] dark:to-[#0f2948] dark:border-[#3b82f6]/10 md:hidden shadow-lg shadow-[0_-4px_14px_0_rgba(0,0,0,0.08)]">
      {navItems.map((item, index) => (
        <button
          key={item.href}
          onClick={() => handleNavigation(item.href)}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 ${item.active ? "" : "opacity-80"}`}
          aria-label={item.title}
        >
          <div
            className={`flex items-center justify-center ${
              item.active
                ? "v7-neu-icon-active-mobile bg-[#5791F4]/15 h-8 sm:h-10 w-8 sm:w-10 rounded-full"
                : index === 2
                  ? "h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-gradient-to-r from-[#294D8B] to-[#1e3a6c] shadow-lg shadow-[#294D8B]/20 border border-white/20"
                  : "h-8 sm:h-10 w-8 sm:w-10 rounded-full"
            }`}
            style={{
              boxShadow: index === 2 && !item.active ? "0 4px 10px rgba(52, 152, 219, 0.3)" : "",
              transform: index === 2 ? "translateY(-8px)" : "",
            }}
          >
            <item.icon
              className={`${
                index === 2 && !item.active
                  ? "h-5 sm:h-6 w-5 sm:w-6 text-white"
                  : item.active
                    ? "h-4 sm:h-5 w-4 sm:w-5 text-[#5791F4]"
                    : "h-4 sm:h-5 w-4 sm:w-5 text-gray-600 dark:text-gray-300"
              }`}
            />
          </div>
          <span
            className={`text-[9px] sm:text-[10px] font-medium ${
              item.active ? "text-[#5791F4] font-bold" : "text-gray-600 dark:text-gray-300"
            } ${index === 2 ? "mt-2" : ""}`}
          >
            {item.title}
          </span>
          {item.active && (
            <div className="h-0.5 sm:h-1 w-6 sm:w-8 rounded-full bg-[#5791F4] mt-0.5 sm:mt-1 shadow-sm shadow-[#5791F4]/30"></div>
          )}
        </button>
      ))}
    </div>
  )
}
