import Link from "next/link"
import { Home, Package, Plus, User, Search } from "lucide-react"

export function ModernMobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 clay-morphism md:hidden">
      <div className="grid grid-cols-5">
        <Link href="/" className="flex flex-col items-center justify-center py-3 text-primary">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Home className="h-5 w-5" />
          </div>
          <span className="mt-1 text-xs font-medium">الرئيسية</span>
        </Link>
        <Link
          href="/shipments"
          className="flex flex-col items-center justify-center py-3 text-muted-foreground hover:text-foreground"
        >
          <div className="rounded-full bg-gray-100 p-1.5">
            <Package className="h-5 w-5" />
          </div>
          <span className="mt-1 text-xs">شحناتي</span>
        </Link>
        <Link href="/create-shipment" className="flex flex-col items-center justify-center py-2 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full modern-gradient-primary shadow-lg">
            <Plus className="h-7 w-7" />
          </div>
        </Link>
        <Link
          href="/tracking"
          className="flex flex-col items-center justify-center py-3 text-muted-foreground hover:text-foreground"
        >
          <div className="rounded-full bg-gray-100 p-1.5">
            <Search className="h-5 w-5" />
          </div>
          <span className="mt-1 text-xs">التتبع</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center justify-center py-3 text-muted-foreground hover:text-foreground"
        >
          <div className="rounded-full bg-gray-100 p-1.5">
            <User className="h-5 w-5" />
          </div>
          <span className="mt-1 text-xs">حسابي</span>
        </Link>
      </div>
    </div>
  )
}
