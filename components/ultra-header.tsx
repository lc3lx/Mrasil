"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Menu,
  Package,
  ChevronDown,
  User,
  LogOut,
  Search,
  HelpCircle,
  MessageSquare,
  Settings,
  Sun,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UltraHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between glass-morphism px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-primary/10" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl luxury-primary shadow-lg">
            <span className="text-xl font-bold text-white">SE</span>
            <div className="absolute inset-0 bg-white opacity-20 shimmer"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              شيب إكسبرس
            </span>
            <span className="text-xs text-muted-foreground">خدمات الشحن الفاخرة</span>
          </div>
        </Link>
      </div>

      <div className="hidden max-w-md flex-1 px-8 lg:block">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث عن2222 شحناتك..."
            className="luxury-input w-full pr-12 glass-morphism border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-none bg-white/50 hover:bg-white/80 backdrop-blur-md"
        >
          <Sun className="h-5 w-5 text-amber-500" />
          <span className="sr-only">تغيير المظهر</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-none bg-white/50 hover:bg-white/80 backdrop-blur-md"
        >
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="sr-only">المحادثات</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-none bg-white/50 hover:bg-white/80 backdrop-blur-md"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
          <span className="sr-only">المساعدة</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-none bg-white/50 hover:bg-white/80 backdrop-blur-md"
        >
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full luxury-danger text-[10px] font-medium text-white">
            3
          </span>
          <span className="sr-only">الإشعارات</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-xl">
              <div className="gradient-border">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl gradient-border-content flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">أحمد محمد</span>
                <span className="text-xs text-muted-foreground">عميل مميز</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl glass-morphism border-none">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              <User className="mr-2 h-4 w-4" />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              <Package className="mr-2 h-4 w-4" />
              شحناتي
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              الإعدادات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-lg text-red-500 hover:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
