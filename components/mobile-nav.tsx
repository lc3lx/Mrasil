"use client"

import Link from "next/link"
import { Home, Package, ShoppingBag, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { routes, isActiveRoute } from "@/lib/routes"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white shadow-lg md:hidden">
      <div className="grid grid-cols-4">
        <Link
          href={routes.home}
          className={`flex flex-col items-center justify-center py-3 ${isActiveRoute(pathname, routes.home) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div
            className={`rounded-full ${isActiveRoute(pathname, routes.home) ? "bg-primary/10" : "bg-gray-100"} p-1.5`}
          >
            <Home className="h-5 w-5" />
          </div>
          <span className={`mt-1 text-xs ${isActiveRoute(pathname, routes.home) ? "font-medium" : ""}`}>الرئيسية</span>
        </Link>
        <Link
          href={routes.orders}
          className={`flex flex-col items-center justify-center py-3 ${isActiveRoute(pathname, routes.orders) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div
            className={`rounded-full ${isActiveRoute(pathname, routes.orders) ? "bg-primary/10" : "bg-gray-100"} p-1.5`}
          >
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className={`mt-1 text-xs ${isActiveRoute(pathname, routes.orders) ? "font-medium" : ""}`}>الطلبات</span>
        </Link>
        <Link
          href={routes.shipments}
          className={`flex flex-col items-center justify-center py-3 ${isActiveRoute(pathname, routes.shipments) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div
            className={`rounded-full ${isActiveRoute(pathname, routes.shipments) ? "bg-primary/10" : "bg-gray-100"} p-1.5`}
          >
            <Package className="h-5 w-5" />
          </div>
          <span className={`mt-1 text-xs ${isActiveRoute(pathname, routes.shipments) ? "font-medium" : ""}`}>
            الشحنات
          </span>
        </Link>
        <Link
          href={routes.profile}
          className={`flex flex-col items-center justify-center py-3 ${isActiveRoute(pathname, routes.profile) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div
            className={`rounded-full ${isActiveRoute(pathname, routes.profile) ? "bg-primary/10" : "bg-gray-100"} p-1.5`}
          >
            <User className="h-5 w-5" />
          </div>
          <span className={`mt-1 text-xs ${isActiveRoute(pathname, routes.profile) ? "font-medium" : ""}`}>حسابي</span>
        </Link>
      </div>
    </div>
  )
}
