"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Sun, Moon, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

interface V7LoginHeaderProps {
  onMenuClick?: () => void
  onThemeToggle?: () => void
  theme?: "light" | "dark"
}

export function V7LoginHeader({ onMenuClick, onThemeToggle, theme: propTheme }: V7LoginHeaderProps) {
  // استخدام مكتبة next-themes لإدارة السمة
  const { theme, setTheme, resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('v7-lang') || 'ar';
    }
    return 'ar';
  });

  const currentTheme = resolvedTheme || theme || "light"

  // تجنب مشكلة عدم تطابق الخادم والعميل
  useEffect(() => {
    setMounted(true)
  }, [])

  // إضافة تأثير للتأكد من تطبيق السمة على مستوى المستند
  useEffect(() => {
    if (mounted) {
      // تطبيق السمة على مستوى المستند
      document.documentElement.classList.toggle("dark", currentTheme === "dark")

      // تحديث سمة رمز الموضوع في العنوان (إن وجد)
      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", currentTheme === "dark" ? "#151929" : "#f0f4f8")
      }

      // حفظ السمة في التخزين المحلي لاستمرارية التجربة
      localStorage.setItem("v7-theme", currentTheme)

      // إرسال حدث لكل المكونات للاستجابة للتغيير في السمة
      window.dispatchEvent(new CustomEvent("v7-theme-change", { detail: { theme: currentTheme } }))

      // Set document direction based on language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('v7-lang', language);
    }
  }, [currentTheme, mounted, language])

  // إذا لم يتم تحميل المكون بعد، عرض نسخة بسيطة لتجنب مشكلة عدم تطابق الخادم والعميل
  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between v7-neu-header px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="v7-neu-logo">
              <span className="text-lg font-bold text-[#294D8B]">MR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-[#294D8B]">مراسيل</span>
              <span className="text-[10px] sm:text-xs text-[#6d6a67]">خدمات الشحن المتطورة</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
          <Button variant="ghost" size="icon" className="v7-neu-button-sm">
            <Globe className="h-4 sm:h-5 w-4 sm:w-5 text-[#6d6a67]" />
          </Button>
          <Button variant="ghost" size="icon" className="v7-neu-button-sm">
            <Moon className="h-4 sm:h-5 w-4 sm:w-5 text-[#6d6a67]" />
          </Button>
        </div>
      </header>
    )
  }

  // Function to toggle theme across the entire platform
  const toggleThemeGlobally = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    // Set theme using next-themes
    setTheme(newTheme)

    // Call the onThemeToggle prop if provided
    if (onThemeToggle) {
      onThemeToggle()
    }

    // Apply theme class directly to ensure immediate effect
    document.documentElement.classList.toggle("dark", newTheme === "dark")

    // Dispatch custom event for components not directly connected to next-themes
    window.dispatchEvent(new CustomEvent("v7-theme-change", { detail: { theme: newTheme } }))
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between v7-neu-header px-3 sm:px-4 md:px-6 mt-2 mb-2 sm:mt-4 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="v7-neu-logo">
            <span className="text-lg font-bold text-[#294D8B]">MR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-bold text-[#294D8B]">مراسيل</span>
            <span className="text-[10px] sm:text-xs text-[#6d6a67]">خدمات الشحن المتطورة</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                currentTheme === "dark"
                  ? "bg-[#1e263a] border border-[#2a3349] text-[#8b5cf6] hover:bg-[#252e45] hover:text-[#a78bfa]"
                  : "v7-neu-button-sm text-[#6d6a67] hover:text-[#3498db]"
              }`}
              title="تغيير اللغة"
              aria-label="تغيير اللغة"
            >
              <Globe className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="sr-only">تغيير اللغة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 rounded-xl v7-neu-dropdown">
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${language === "ar" ? "bg-[#294D8B]/10 text-[#294D8B] font-medium" : ""}`}
              onClick={() => {
                setLanguage("ar");
                localStorage.setItem('v7-lang', 'ar');
                document.documentElement.dir = 'rtl';
                window.dispatchEvent(new CustomEvent('v7-language-change', { 
                  detail: { language: 'ar' } 
                }));
              }}
            >
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${language === "en" ? "bg-[#294D8B]/10 text-[#294D8B] font-medium" : ""}`}
              onClick={() => {
                setLanguage("en");
                localStorage.setItem('v7-lang', 'en');
                document.documentElement.dir = 'ltr';
                window.dispatchEvent(new CustomEvent('v7-language-change', { 
                  detail: { language: 'en' } 
                }));
              }}
            >
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                currentTheme === "dark"
                  ? "bg-[#1e263a] border border-[#2a3349] text-[#8b5cf6] hover:bg-[#252e45] hover:text-[#a78bfa]"
                  : "v7-neu-button-sm text-[#6d6a67] hover:text-[#3498db]"
              }`}
              title={currentTheme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
              aria-label="تبديل السمة"
              data-theme-toggle="true"
            >
              {currentTheme === "dark" ? (
                <Sun className="h-4 sm:h-5 w-4 sm:w-5 text-[#8b5cf6]" />
              ) : (
                <Moon className="h-4 sm:h-5 w-4 sm:w-5" />
              )}
              <span className="sr-only">تغيير المظهر</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl v7-neu-dropdown">
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${currentTheme === "light" ? "bg-[#294D8B]/10 text-[#294D8B] font-medium" : ""}`}
              onClick={() => {
                setTheme("light");
                document.documentElement.classList.remove("dark");
                localStorage.setItem("v7-theme", "light");
                window.dispatchEvent(new CustomEvent("v7-theme-change", { detail: { theme: "light" } }));
              }}
            >
              <Sun className="h-4 w-4 mr-2" />
              الوضع النهاري
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`cursor-pointer rounded-lg ${currentTheme === "dark" ? "bg-[#294D8B]/10 text-[#294D8B] font-medium" : ""}`}
              onClick={() => {
                setTheme("dark");
                document.documentElement.classList.add("dark");
                localStorage.setItem("v7-theme", "dark");
                window.dispatchEvent(new CustomEvent("v7-theme-change", { detail: { theme: "dark" } }));
              }}
            >
              <Moon className="h-4 w-4 mr-2" />
              الوضع الليلي
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 