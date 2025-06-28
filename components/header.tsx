"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Package, ChevronDown, User, LogOut, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full primary-gradient">
            <span className="text-lg font-bold text-white">SE</span>
          </div>
          <span className="hidden text-xl font-bold text-primary md:inline-block">شيب إكسبرس</span>
        </Link>
      </div>

      <div className="hidden max-w-md flex-1 px-6 lg:block">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث عن شحنات، طلبات، عملاء..."
            className="w-full rounded-full border-none bg-secondary pl-4 pr-10 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="default" className="hidden primary-gradient button-hover md:flex" size="sm">
          <Package className="mr-2 h-4 w-4" />
          إنشاء شحنة
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none bg-secondary hover:bg-secondary/80"
            >
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
              <span className="sr-only">الإشعارات</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="flex cursor-pointer flex-col items-start p-3">
                  <div className="font-medium">تم تسليم الشحنة #{1000 + i}</div>
                  <div className="text-sm text-muted-foreground">تم تسليم الشحنة بنجاح إلى العميل</div>
                  <div className="mt-1 text-xs text-muted-foreground">منذ {i * 10} دقائق</div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-primary">
              عرض جميع الإشعارات
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-primary/10">
                <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">شركة إكسبرس</span>
                <span className="text-xs text-muted-foreground">مدير</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              شحناتي
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
