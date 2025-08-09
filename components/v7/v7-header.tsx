"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Menu,
  Package,
  ChevronDown,
  User,
  LogOut,
  Search,
  Settings,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationAsReadMutation,
} from "@/app/api/notificationsApi";
import { useGetProfileQuery } from "@/app/api/profileApi";
import { useAuth } from "@/app/providers/AuthProvider";
import { V7FloatingAssistant } from "./v7-floating-assistant";

interface V7HeaderProps {
  onMenuClick: () => void;
  onThemeToggle?: () => void;
  theme?: "light" | "dark";
}

export function V7Header({
  onMenuClick,
  onThemeToggle,
  theme: propTheme,
}: V7HeaderProps) {
  // استخدام مكتبة next-themes لإدارة السمة
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("v7-lang") || "ar";
    }
    return "ar";
  });

  const router = useRouter();

  // Fetch notifications and unread count from API
  const { data: notificationsData, isLoading: notificationsLoading } =
    useGetMyNotificationsQuery();
  const { data: unreadCountData, isLoading: unreadCountLoading } =
    useGetUnreadNotificationsCountQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  const { logout } = useAuth();

  const currentTheme = resolvedTheme || theme || "light";

  // Handle logout function
  const handleLogout = () => {
    logout(); // This will clear auth state and redirect to login page
  };

  function timeSince(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `منذ ${seconds} ثانية`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `منذ ${days} يوم`;
    const months = Math.floor(days / 30);
    if (months < 12) return `منذ ${months} شهر`;
    const years = Math.floor(months / 12);
    return `منذ ${years} سنة`;
  }

  // تجنب مشكلة عدم تطابق الخادم والعميل
  useEffect(() => {
    setMounted(true);
  }, []);

  // إضافة تأثير للتأكد من تطبيق السمة على مستوى المستند
  useEffect(() => {
    if (mounted) {
      // تطبيق السمة على مستوى المستند
      document.documentElement.classList.toggle(
        "dark",
        currentTheme === "dark"
      );

      // تحديث سمة رمز الموضوع في العنوان (إن وجد)
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute(
          "content",
          currentTheme === "dark" ? "#151929" : "#f0f4f8"
        );
      }

      // حفظ السمة في التخزين المحلي لاستمرارية التجربة
      localStorage.setItem("v7-theme", currentTheme);

      // إرسال حدث لكل المكونات للاستجابة للتغيير في السمة
      window.dispatchEvent(
        new CustomEvent("v7-theme-change", { detail: { theme: currentTheme } })
      );

      // Set document direction based on language
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      localStorage.setItem("v7-lang", language);
    }
  }, [currentTheme, mounted, language]);

  // إذا لم يتم تحميل المكون بعد، عرض نسخة بسيطة لتجنب مشكلة عدم تطابق الخادم والعميل
  if (!mounted) {
    return (
      <header className="sticky  top-0 z-30 flex h-14 sm:h-16 items-center justify-between v7-neu-header px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden v7-neu-button-sm"
          >
            <Menu className="h-5 w-5 text-[#294D8B]" />
          </Button>
          <Link href="/">
            <div>
              <img src="/logo.png" alt="شعار الشركة" className="h-8 w-auto" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-gry">
                خدمات الشحن المتطورة
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
          <Button variant="ghost" size="icon" className="v7-neu-button-sm">
            <Globe className="h-4 sm:h-5 w-4 sm:w-5 text-gry" />
          </Button>
          <Button variant="ghost" size="icon" className="v7-neu-button-sm">
            <Moon className="h-4 sm:h-5 w-4 sm:w-5 text-gry" />
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="  fixed  -top-2 sm:-top-4 w-full z-30 flex  h-16  items-center justify-between v7-neu-header px-3 sm:px-4 md:px-6 mt-2 mb-2 sm:mt-4 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden v7-neu-button-sm"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5 text-[#294D8B]" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
        <Link href="/" className="">

            <img src="/logo.png" alt="شعار الشركة" className="h-12 w-auto" />
 
        </Link>
      </div>

      <div className="hidden max-w-md flex-1 px-4 sm:px-6 lg:block">
        <div
          className={`relative transition-all duration-300 ${
            searchFocused ? "scale-105" : ""
          }`}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {language === "ar" ? (
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
          ) : (
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
          )}
          <input
            type="search"
            placeholder={
              language === "ar"
                ? "البحث عن شحناتك..."
                : "Search your shipments..."
            }
            className={`v7-neu-input w-full ${
              language === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"
            } text-sm sm:text-base text-center`}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label={
              language === "ar" ? "البحث عن شحناتك" : "Search your shipments"
            }
            style={{ textAlign: "center" }}
          />
        </div>
      </div>
      <div className="   flex  items-center gap-1 sm:gap-3 md:gap-4">
      <div className="   sr-only sm:not-sr-only  ">

              <V7FloatingAssistant/>
      </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" hidden sm:block  ">
            <Button
              variant="ghost"
              size="icon"
              className={`relative    ${
                currentTheme === "dark"
                  ? "bg-[#1e263a] border  border-[#2a3349] text-[#8b5cf6] hover:bg-[#252e45] hover:text-[#a78bfa]"
                  : "v7-neu-button-sm text-gry  hover:text-[#3498db]"
              }`}
              title="تغيير اللغة"
              aria-label="تغيير اللغة"
            >
              <Globe className="h-4 sm:h-8 w-4 sm:w-8 mx-auto" />
              <span className="sr-only">تغيير اللغة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32 rounded-xl v7-neu-dropdown"
          >
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${
                language === "ar"
                  ? "bg-[#294D8B]/10 text-[#294D8B] font-medium"
                  : ""
              }`}
              onClick={() => {
                setLanguage("ar");
                localStorage.setItem("v7-lang", "ar");
                document.documentElement.dir = "rtl";
                window.dispatchEvent(
                  new CustomEvent("v7-language-change", {
                    detail: { language: "ar" },
                  })
                );
              }}
            >
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${
                language === "en"
                  ? "bg-[#294D8B]/10 text-[#294D8B] font-medium"
                  : ""
              }`}
              onClick={() => {
                setLanguage("en");
                localStorage.setItem("v7-lang", "en");
                document.documentElement.dir = "ltr";
                window.dispatchEvent(
                  new CustomEvent("v7-language-change", {
                    detail: { language: "en" },
                  })
                );
              }}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="  hidden sm:block ">
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                currentTheme === "dark"
                  ? "bg-[#1e263a] border border-[#2a3349] text-[#8b5cf6] hover:bg-[#252e45] hover:text-[#a78bfa]"
                  : "v7-neu-button-sm text-gry hover:text-[#3498db]"
              }`}
              title={
                currentTheme === "light"
                  ? "تفعيل الوضع الليلي"
                  : "تفعيل الوضع النهاري"
              }
              aria-label="تبديل السمة"
              data-theme-toggle="true"
            >
              {currentTheme === "dark" ? (
                <Sun className="h-4 sm:h-5 w-4 sm:w-5 text-[#8b5cf6] " />
              ) : (
                <Moon className="h-4 sm:h-5 w-4 sm:w-5 " />
              )}
              <span className="sr-only">تغيير المظهر</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-xl v7-neu-dropdown"
          >
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${
                currentTheme === "light"
                  ? "bg-[#294D8B]/10 text-[#294D8B] font-medium"
                  : ""
              }`}
              onClick={() => {
                setTheme("light");
                document.documentElement.classList.remove("dark");
                localStorage.setItem("v7-theme", "light");
                window.dispatchEvent(
                  new CustomEvent("v7-theme-change", {
                    detail: { theme: "light" },
                  })
                );
                if (onThemeToggle) onThemeToggle();
              }}
            >
              <Sun className="h-4 sm:h-8 w-4 sm:w-8" />
              الوضع النهاري
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${
                currentTheme === "dark"
                  ? "bg-[#294D8B]/10 text-[#294D8B] font-medium"
                  : ""
              }`}
              onClick={() => {
                setTheme("dark");
                document.documentElement.classList.add("dark");
                localStorage.setItem("v7-theme", "dark");
                window.dispatchEvent(
                  new CustomEvent("v7-theme-change", {
                    detail: { theme: "dark" },
                  })
                );
                if (onThemeToggle) onThemeToggle();
              }}
            >
              <Moon className="h-4 w-4 mr-2" />
              الوضع الليلي
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* زر البحث الجديد */}
        <Button
          variant="ghost"
          size="icon"
          className="v7-neu-button-sm lg:hidden hover:text-[#3498db] transition-colors"
          onClick={() => setMobileSearchOpen(true)}
          aria-label="البحث"
        >
          <Search className="h-4 sm:h-8 w-4 sm:w-8 text-[#294D8B] mx-auto" />
          <span className="sr-only">البحث</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="v7-neu-button-sm relative hover:text-[#3498db] transition-colors"
            >
              <Bell className="h-4 sm:h-8 w-4 sm:w-8 text-[#294D8B] mx-auto" />
              <span className="absolute -right-1 -top-1 flex h-3 sm:h-4 w-3 sm:w-4 items-center justify-center rounded-full bg-red-600 text-[8px] sm:text-[10px] font-medium text-white animate-pulse">
                {unreadCountLoading ? "..." : unreadCountData?.unreadCount || 0}
              </span>
              <span className="sr-only">الإشعارات</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 sm:w-80 rounded-xl v7-neu-dropdown"
          >
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#294D8B]" />
                  <h3 className="font-bold text-[#294D8B]">الإشعارات</h3>
                </div>
                <div className="bg-[#294D8B]/10 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-[#294D8B]">
                    {unreadCountLoading
                      ? "..."
                      : unreadCountData?.unreadCount || 0}{" "}
                    جديدة
                  </span>
                </div>
              </div>
              <p className="text-xs text-gry mt-1">
                {!notificationsLoading &&
                  notificationsData?.data?.length &&
                  `آخر تحديث: ${timeSince(
                    notificationsData.data[notificationsData.data.length - 1]
                      .timestamp
                  )}`}
              </p>
            </div>
            <div className="max-h-[250px] sm:max-h-[300px] overflow-auto">
              {notificationsLoading ? (
                <div className="p-4 text-center text-gry">جاري التحميل...</div>
              ) : notificationsData?.data?.length ? (
                notificationsData.data.map((notification) => (
                  <DropdownMenuItem
                    key={notification._id}
                    className={`flex cursor-pointer flex-col items-start p-3 rounded-lg mb-1 ${
                      notification.readStatus
                        ? "bg-white dark:bg-[#232a3b] opacity-70"
                        : "bg-[#294D8B]/10 dark:bg-[#294D8B]/20 border border-[#294D8B]/10"
                    }`}
                    onClick={() => {
                      if (!notification.readStatus)
                        markNotificationAsRead(notification._id);
                    }}
                    disabled={notification.readStatus}
                  >
                    <div className="font-medium text-[#294D8B]">
                      {notification.type}
                    </div>
                    <div className="text-sm text-gry">
                      {notification.message}
                    </div>
                    <div className="mt-1 text-xs text-gry">
                      {timeSince(notification.timestamp)}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gry">
                  لا توجد إشعارات جديدة
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-[#294D8B]">
              اغلاق
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="v7-neu-avatar overflow-hidden rounded-full w-8 h-8 border border-[#e5e7eb]">
              <img
                src="/abstract-user-icon.png"
                alt="صورة المستخدم"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-sm font-medium">
                {profileLoading
                  ? language === "ar"
                    ? "جاري التحميل..."
                    : "Loading..."
                  : profileData?.data?.firstName && profileData?.data?.lastName
                  ? `${profileData.data.firstName} ${profileData.data.lastName}`
                  : language === "ar"
                  ? "أحمد محمد"
                  : "Ahmed Mohamed"}
              </span>
            </div>
            <ChevronDown className="h-3 sm:h-4 w-3 sm:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 sm:w-56 rounded-xl v7-neu-dropdown"
        >
          <DropdownMenuLabel>حسابي</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer rounded-lg"
            onClick={() => router.push("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            الملف الشخصي
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-lg">
            <Package className="mr-2 h-4 w-4" />
            شحناتي
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            الإعدادات
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer rounded-lg text-red-500 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-16 px-4">
          <div className="bg-white dark:bg-[#1e263a] w-full max-w-md rounded-xl shadow-lg p-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
                <input
                  type="search"
                  placeholder="البحث عن شحناتك..."
                  className="v7-neu-input w-full pr-10 py-2 text-sm"
                  autoFocus
                  aria-label="البحث عن شحناتك"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSearchOpen(false)}
                className="text-gry"
              >
                إلغاء
              </Button>
            </div>
            <div className="mt-4 text-xs sm:text-sm text-gry">
              <p>اقتراحات البحث:</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-[#294D8B] hover:text-[#3498db] border-[#294D8B]/20 hover:border-[#294D8B]/40 text-xs sm:text-sm"
                >
                  شحناتي الحالية
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-[#294D8B] hover:text-[#3498db] border-[#294D8B]/20 hover:border-[#294D8B]/40 text-xs sm:text-sm"
                >
                  الشحنات المتأخرة
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-[#294D8B] hover:text-[#3498db] border-[#294D8B]/20 hover:border-[#294D8B]/40 text-xs sm:text-sm"
                >
                  الشحنات المسلمة
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-[#294D8B] hover:text-[#3498db] border-[#294D8B]/20 hover:border-[#294D8B]/40 text-xs sm:text-sm"
                >
                  الفواتير المستحقة
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
