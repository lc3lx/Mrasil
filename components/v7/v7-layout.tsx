"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { V7Header } from "./v7-header"
import { V7Sidebar } from "./v7-sidebar"
import { V7MobileNav } from "./v7-mobile-nav"
import { V7FloatingAssistant } from "./v7-floating-assistant"
import { useTheme } from "next-themes"
import { V7WhatsAppWebhook } from "./v7-whatsapp-webhook"
import { ArrowRight, PlusCircle, AlertCircle, Filter, Clock, BarChart3 } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface V7LayoutProps {
  children: React.ReactNode
  theme?: "light" | "dark"
}

// تعريف دالة للتحقق من صلاحيات المستخدم
const getUserPermissions = () => {
  // في التطبيق الحقيقي، هذه الدالة ستتحقق من JWT أو من حالة المستخدم في الخادم
  // هنا نستخدم localStorage كمثال بسيط
  try {
    const userRole = localStorage.getItem("userRole") || "admin" // تعيين "admin" كقيمة افتراضية للاختبار
    return {
      canCreateAutomation: ["admin", "manager", "supervisor"].includes(userRole),
      userRole,
    }
  } catch (error) {
    console.error("Error checking permissions:", error)
    return {
      canCreateAutomation: false,
      userRole: "user",
    }
  }
}

export const V7Layout = ({ children, theme = "light" }: V7LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme as "light" | "dark")
  const pathname = usePathname()
  const { theme: systemTheme, setTheme } = useTheme()
  const router = useRouter()

  // إضافة حالة للتحقق من صلاحيات المستخدم بعد تعريف الحالات الأخرى
  const [userPermissions, setUserPermissions] = useState({
    canCreateAutomation: false,
    userRole: "",
    isLoading: true,
  })

  // تحديد الوضع الحالي
  useEffect(() => {
    // استرجاع الوضع المحفوظ من التخزين المحلي
    const savedTheme = localStorage.getItem("v7-theme") as "light" | "dark" | null

    // تحديد الوضع الافتراضي
    const defaultTheme = savedTheme || systemTheme || theme || "light"

    // تطبيق الوضع
    setCurrentTheme(defaultTheme as "light" | "dark")
    setTheme(defaultTheme)

  
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = (e.detail?.theme || defaultTheme) as "light" | "dark"
      setCurrentTheme(newTheme)
    }

    window.addEventListener("v7-theme-change", handleThemeChange as EventListener)

    // تطبيق فئة الانتقال السلس
    document.documentElement.classList.add("theme-transition")

    // إزالة المستمع عند تفكيك المكون
    return () => {
      window.removeEventListener("v7-theme-change", handleThemeChange as EventListener)
    }
  }, [systemTheme, theme, setTheme])

  // إضافة تأثير للتحقق من صلاحيات المستخدم بعد تعريفات useEffect الأخرى
  useEffect(() => {
    // محاكاة طلب للتحقق من صلاحيات المستخدم
    const checkUserPermissions = async () => {
      try {
        // محاكاة تأخير الشبكة
        await new Promise((resolve) => setTimeout(resolve, 300))

        // الحصول على صلاحيات المستخدم
        const permissions = getUserPermissions()

        setUserPermissions({
          canCreateAutomation: permissions.canCreateAutomation,
          userRole: permissions.userRole,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error checking permissions:", error)
        setUserPermissions({
          canCreateAutomation: false,
          userRole: "user",
          isLoading: false,
        })
      }
    }

    checkUserPermissions()
  }, [])

  // إغلاق الشريط الجانبي عند تغيير المسار
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // تأثير التحميل
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
      // إزالة فئة الانتقال بعد التحميل
      document.documentElement.classList.remove("theme-transition")
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // تطبيق فئة الوضع الداكن على عنصر html
  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [currentTheme])

  // معالج تبديل الوضع
  const handleThemeToggle = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setCurrentTheme(newTheme)
    setTheme(newTheme)
    localStorage.setItem("v7-theme", newTheme)

    // إضافة فئة الانتقال السلس عند تبديل الوضع
    document.documentElement.classList.add("theme-transition")
    // تأخير قصير لضمان ظهور الانتقال السلس
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 500)

    // إرسال حدث لإعلام المكونات الأخرى
    window.dispatchEvent(new CustomEvent("v7-theme-change", { detail: { theme: newTheme } }))
  }

  // التحقق مما إذا كان المسار الحالي هو الصفحة الرئيسية
  const isHomePage = pathname === "/"

  // التحقق مما إذا كان المسار الحالي هو صفحة تخصيص التتبع
  const isCustomTrackingPage = pathname === "/custom-tracking" || pathname?.includes("/custom-tracking")

  // التحقق مما إذا كان المسار الحالي هو صفحة الطلبات
  const isOrdersPage = pathname === "/orders" || pathname?.includes("/orders")

  const isDarkMode = currentTheme === "dark"

  // دالة لفتح صفحة طلب الصلاحيات
  const openPermissionRequest = () => {
    // في التطبيق الحقيقي، هذا سينقل المستخدم إلى صفحة طلب الصلاحيات
    router.push("/settings?tab=permissions&request=automation")
  }

  // دالة لإنشاء قاعدة أتمتة جديدة من الصفر
  const createBlankAutomationRule = () => {
    // حذف جميع البيانات المخزنة مؤقتًا
    try {
      // حذف من localStorage
      const keysToRemove = [
        "automationDraft",
        "lastAutomationTemplate",
        "automationTemplates",
        "currentAutomationRule",
        "automationState",
        "automationHistory",
        "automationSettings",
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      })

      // إعادة تعيين حالة الأتمتة في ذاكرة التخزين المؤقت
      if (window.caches) {
        caches.delete("automation-cache").catch(() => {})
      }

      // تعيين علامة في localStorage تشير إلى أن المستخدم يريد إنشاء قاعدة فارغة
      localStorage.setItem("createBlankAutomation", "true")

      console.log("تم مسح جميع بيانات الأتمتة المخزنة مؤقتًا")
    } catch (error) {
      console.error("خطأ أثناء مسح بيانات الأتمتة:", error)
    }

    // استخدام مسار مختلف تمامًا لتجنب أي منطق معالجة موجود في المسار العادي
    // نستخدم مسار جديد مع معلمات واضحة
    const timestamp = new Date().getTime()
    router.push(`/automation/create-blank?t=${timestamp}`)
  }

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isDarkMode ? "v7-dark" : "v7-light"
      } transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <V7Header onMenuClick={() => setSidebarOpen(true)} onThemeToggle={handleThemeToggle} theme={currentTheme} />
      <div className="flex flex-1 w-full overflow-x-hidden">
        <V7Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} theme={currentTheme} />
        <main className={`flex-1 w-0 min-w-0 transition-all duration-300 ${isDarkMode ? "v7-dark" : "v7-light"}`}>
          {!isHomePage && (
            <div className={`border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
              <div className="container mx-auto px-4 py-4 max-w-[1920px]">
                {/* عناوين الصفحات المختلفة */}
                {pathname.includes("/automation") && (
                  <div className="mt-4 text-right">
                    <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-[#1a5889]"}`}>
                      {pathname.includes("/automation/create") || pathname.includes("/automation/create-blank")
                        ? "إنشاء قاعدة أتمتة شحنات جديدة"
                        : "قواعد الأتمتة"}
                    </h1>
                    <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {pathname.includes("/automation/create") || pathname.includes("/automation/create-blank")
                        ? "قم بإنشاء قواعد ذكية لأتمتة عمليات الشحن وتحسين كفاءة العمليات اللوجستية"
                        : "قم بإنشاء وإدارة قواعد أتمتة مخصصة لتبسيط عمليات الشحن وتحسين تجربة العملاء. يمكنك إضافة الشروط المتقدمة والجدولة الزمنية ومراقبة أداء القواعد."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={`container mx-auto py-6 px-4 ${isHomePage ? "pt-4" : ""} max-w-[1920px]`}>
            {pathname === "/webhooks" && <V7WhatsAppWebhook theme={currentTheme} />}

            {pathname === "/automation" && (
              <div className="mb-6">
                <div className="v7-neu-card p-6 rounded-2xl mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col">
                      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-[#1a5889]"}`}>
                        نظام الأتمتة المتقدم
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        أنشئ قواعد أتمتة مخصصة لتبسيط عمليات الشحن وإرسال الإشعارات التلقائية للعملاء
                      </p>
                    </div>

                    {userPermissions.isLoading ? (
                      // عرض مؤشر تحميل أثناء التحقق من الصلاحيات
                      <div className="h-10 w-40 rounded-xl bg-gray-200 animate-pulse"></div>
                    ) : userPermissions.canCreateAutomation ? (
                      // عرض الزر فقط إذا كان المستخدم يملك الصلاحية
                      <div className="flex gap-2">
                        <button
                          onClick={createBlankAutomationRule}
                          className="v7-neu-button-accent flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>إنشاء قاعدة أتمتة جديدة</span>
                        </button>
                      </div>
                    ) : (
                      // عرض رسالة مع رابط لطلب الصلاحية
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm v7-neu-card-inset">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <span>لا تملك صلاحية إنشاء قواعد أتمتة</span>
                          <button
                            onClick={openPermissionRequest}
                            className="text-[#3498db] underline px-1 h-auto font-medium"
                          >
                            طلب الصلاحية
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="v7-neu-card-inner p-5 rounded-xl flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Filter className="h-7 w-7 text-[#3498db]" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">شروط متقدمة</h3>
                      <p className="text-sm text-gray-500">أنشئ قواعد معقدة باستخدام شروط متعددة ومنطق متقدم</p>
                    </div>

                    <div className="v7-neu-card-inner p-5 rounded-xl flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <Clock className="h-7 w-7 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">جدولة زمنية</h3>
                      <p className="text-sm text-gray-500">حدد أوقات محددة لتنفيذ القواعد وتكرارها</p>
                    </div>

                    <div className="v7-neu-card-inner p-5 rounded-xl flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <BarChart3 className="h-7 w-7 text-green-600" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">إحصائيات الأداء</h3>
                      <p className="text-sm text-gray-500">تتبع أداء قواعد الأتمتة وتأثيرها على عمليات الشحن</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
      <V7MobileNav theme={currentTheme} />
      <V7FloatingAssistant />
    </div>
  )
}

export default V7Layout
