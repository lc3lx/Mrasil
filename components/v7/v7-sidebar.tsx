"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  Zap,
  Shield,
  RotateCcw,
  Workflow,
  Box,
  UserPlus,
  LogOut,
  Link,
  Code,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { routes, isActiveRoute } from "@/lib/routes";
import { useAuth } from "@/app/providers/AuthProvider";
import { V7FloatingAssistant } from "./v7-floating-assistant";
import { V7MobileNav } from "./v7-mobile-nav";

type Language = "ar" | "en";

type NavItem = {
  title: string;
  href: string;
  icon: any;
  active: boolean;
};

type TranslationType = {
  mainMenu: string;
  shipmentsAndParcels: string;
  storeIntegration: string;
  trackingAndLocations: string;
  financeAndBilling: string;
  accountManagement: string;
  signOut: string;
  needHelp: string;
  supportTeam: string;
  contactUs: string;
  navItems: {
    home: string;
    orders: string;
    shipments: string;
    createShipment: string;
    parcels: string;
    returns: string;
    replacements: string;
    automation: string;
    webhooks: string;
    api: string;
    carriers: string;
    tracking: string;
    customTracking: string;
    locations: string;
    history: string;
    payments: string;
    team: string;
    salary: string;
    settings: string;
  };
};

type Translations = {
  [key in Language]: TranslationType;
};

const translations: Translations = {
  ar: {
    mainMenu: "القائمة الرئيسية",
    shipmentsAndParcels: "الشحنات والطرود",
    storeIntegration: "توصيل المتاجر",
    trackingAndLocations: "التتبع والمواقع",
    financeAndBilling: "المالية والفواتير",
    accountManagement: "إدارة الحساب",
    signOut: "تسجيل الخروج",
    needHelp: "تحتاج مساعدة؟",
    supportTeam: "فريق الدعم الفني متاح على مدار الساعة لمساعدتك",
    contactUs: "تواصل معنا",
    navItems: {
      home: "الرئيسية",
      orders: "الطلبات",
      shipments: "شحناتي",
      createShipment: "إنشاء شحنة",
      parcels: "إدارة الطرود",
      returns: "إدارة المرتجعات",
      replacements: "إدارة الاستبدال",
      automation: "الأتمتة",
      webhooks: "توصيل المتاجر",
      api: "واجهة API",
      carriers: "شركات الشحن",
      tracking: "تتبع الشحنات",
      customTracking: "تخصيص التتبع",
      locations: "العناوين",
      history: "سجل الشحنات",
      payments: "المحفظة",

      team: "الفريق",
      salary: "الرواتب",
      settings: "الإعدادات",
    },
  },
  en: {
    mainMenu: "Main Menu",
    shipmentsAndParcels: "Shipments & Parcels",
    storeIntegration: "Store Integration",
    trackingAndLocations: "Tracking & Locations",
    financeAndBilling: "Finance & Billing",
    accountManagement: "Account Management",
    signOut: "Sign Out",
    needHelp: "Need Help?",
    supportTeam: "Support team is available 24/7 to help you",
    contactUs: "Contact Us",
    navItems: {
      home: "Home",
      orders: "Orders",
      shipments: "My Shipments",
      createShipment: "Create Shipment",
      parcels: "Manage Parcels",
      returns: "Manage Returns",
      replacements: "Manage Replacements",
      automation: "Automation",
      webhooks: "Store Integration",
      api: "API Interface",
      carriers: "Shipping Carriers",
      tracking: "Track Shipments",
      customTracking: "Custom Tracking",
      locations: "Addresses",
      history: "Shipment History",
      payments: "Wallet",
      team: "Team",
      salary: "Salaries",
      settings: "Settings",
    },
  },
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export function V7Sidebar({ open, onClose, theme }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [language, setLanguage] = useState<Language>(() => {
    // Server-side default to 'ar'
    if (typeof window === "undefined") return "ar";
    // Client-side initialization
    return (localStorage.getItem("v7-lang") || "ar") as Language;
  });
  const { logout } = useAuth();

  // Listen for language changes
  useEffect(() => {
    // Initial language sync
    const currentLang = localStorage.getItem("v7-lang");
    if (currentLang && (currentLang === "ar" || currentLang === "en")) {
      setLanguage(currentLang as Language);
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    }

    // Listen for language changes from other components
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "v7-lang" && event.newValue) {
        if (event.newValue === "ar" || event.newValue === "en") {
          setLanguage(event.newValue as Language);
          document.documentElement.dir =
            event.newValue === "ar" ? "rtl" : "ltr";
        }
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for direct language changes
    const handleCustomLanguageChange = (e: CustomEvent) => {
      const newLang = e.detail?.language;
      if (newLang && (newLang === "ar" || newLang === "en")) {
        setLanguage(newLang as Language);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        localStorage.setItem("v7-lang", newLang);
      }
    };

    // Add event listener for language changes
    window.addEventListener(
      "v7-language-change",
      handleCustomLanguageChange as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "v7-language-change",
        handleCustomLanguageChange as EventListener
      );
    };
  }, []);

  // Memoize translations to prevent unnecessary re-renders
  const currentTranslations = useMemo(() => translations[language], [language]);

  // تحديث المسار الحالي عند تغيير pathname
  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  // التحقق مما إذا كان المسار الحالي متعلقًا بالفواتير
  // const isInvoiceActive =
  //   isActiveRoute(currentPath, routes.invoices) ||
  //   isActiveRoute(currentPath, routes.taxInvoices) ||
  //   isActiveRoute(currentPath, routes.zakatInvoices)

  // تعريف عناصر القائمة مع التحقق من المسار النشط
  const navItems = useMemo(
    () => [
      {
        title: currentTranslations.navItems.home,
        href: routes.home,
        icon: Home,
        active: isActiveRoute(currentPath, routes.home),
      },
      {
        title: currentTranslations.navItems.orders,
        href: routes.orders,
        icon: ShoppingBag,
        active: isActiveRoute(currentPath, routes.orders),
      },
      {
        title: currentTranslations.navItems.shipments,
        href: routes.shipments,
        icon: Package,
        active: isActiveRoute(currentPath, routes.shipments),
      },
      {
        title: currentTranslations.navItems.createShipment,
        href: routes.createShipment,
        icon: ShoppingBag,
        active: isActiveRoute(currentPath, routes.createShipment),
      },
      {
        title: currentTranslations.navItems.parcels,
        href: routes.parcels,
        icon: Box,
        active: isActiveRoute(currentPath, routes.parcels),
      },
      {
        title: currentTranslations.navItems.returns,
        href: routes.returns,
        icon: RotateCcw,
        active: isActiveRoute(currentPath, routes.returns),
      },
      {
        title: currentTranslations.navItems.replacements,
        href: routes.replacements,
        icon: RefreshCw,
        active: isActiveRoute(currentPath, routes.replacements),
      },
      // {
      //   title: currentTranslations.navItems.automation,
      //   href: routes.automation,
      //   icon: Workflow,
      //   active: isActiveRoute(currentPath, routes.automation),
      // },
      {
        title: currentTranslations.navItems.webhooks,
        href: routes.webhooks,
        icon: Link,
        active: isActiveRoute(currentPath, routes.webhooks),
      },
      // {
      //   title: currentTranslations.navItems.api,
      //   href: routes.api,
      //   icon: Code,
      //   active: isActiveRoute(currentPath, routes.api),
      // },
      {
        title: currentTranslations.navItems.carriers,
        href: routes.carriers,
        icon: Truck,
        active: isActiveRoute(currentPath, routes.carriers),
      },
      {
        title: currentTranslations.navItems.tracking,
        href: routes.tracking,
        icon: Truck,
        active: isActiveRoute(currentPath, routes.tracking),
      },
      {
        title: currentTranslations.navItems.customTracking,
        href: routes.customTracking,
        icon: Zap,
        active: isActiveRoute(currentPath, routes.customTracking),
      },
      {
        title: currentTranslations.navItems.locations,
        href: routes.locations,
        icon: MapPin,
        active: isActiveRoute(currentPath, routes.locations),
      },
      // {
      //   title: currentTranslations.navItems.history,
      //   href: routes.history,
      //   icon: History,
      //   active: isActiveRoute(currentPath, routes.history),
      // },
      {
        title: currentTranslations.navItems.payments,
        href: routes.payments,
        icon: CreditCard,
        active: isActiveRoute(currentPath, routes.payments),
      },
      // {
      //   title: currentTranslations.navItems.invoices,
      //   href: routes.invoices,
      //   icon: Receipt,
      //   active: isInvoiceActive,
      // },

      {
        title: currentTranslations.navItems.team,
        href: routes.team,
        icon: UserPlus,
        active: isActiveRoute(currentPath, routes.team),
      },
      {
        title: currentTranslations.navItems.salary,
        href: routes.salary,
        icon: BarChart3,
        active: isActiveRoute(currentPath, routes.salary),
      },
      {
        title: currentTranslations.navItems.settings,
        href: routes.settings,
        icon: Settings,
        active: isActiveRoute(currentPath, routes.settings),
      },
    ],
    [currentPath, currentTranslations]
  );

  // دالة للتنقل بين الصفحات مع إغلاق القائمة الجانبية في الأجهزة المحمولة
  const handleNavigation = (href: string) => {
    router.push(href);
    if (open) {
      onClose();
    }
  };

  // Apply dark mode styling
  const sidebarClass =
    theme === "dark"
      ? "bg-[#1e263a] border-r border-[#2a3349] text-[#e2e8f0]"
      : "bg-white border-r border-gray-200";

  // Apply to the main sidebar container
  // For any navigation links, update their active/hover states:
  const linkClass =
    theme === "dark"
      ? "hover:bg-[#2a3349] text-muted-foreground"
      : "hover:bg-gray-100 text-muted-foreground";

  const activeLinkClass =
    theme === "dark"
      ? "bg-[#2a3349] text-[#8b5cf6]"
      : "bg-gray-100 text-primary";

  // Add section title class
  const sectionTitleClass =
    theme === "dark" ? "text-muted-foreground" : "text-muted-foreground";

  // Update the handleSignOut function
  const handleSignOut = () => {
    logout(); // This will clear auth state and redirect to login page
    onClose(); // Close the sidebar if it's open
  };
  return (
    <>
      <aside
        className={`hidden md:block w-64 lg:w-72 flex-shrink-0 v7-neu-sidebar    ${sidebarClass}`}
      >
        <ScrollArea className="h-[calc(100vh-4rem)] ">
          <div className="flex h-full flex-col gap-2 p-4 sm:p-5">
            <div className="mb-3 px-3 text-base font-bold text-[#5791F4] uppercase tracking-wider">
              {currentTranslations.mainMenu}
            </div>

            <div className="space-y-1.5 mb-4">
              {navItems.slice(0, 3).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* قسم الشحنات والطرود */}
            <div className="mb-2 px-3 text-base font-medium text-muted-foreground">
              {currentTranslations.shipmentsAndParcels}
            </div>
            <div className="space-y-1.5 mb-4">
              {navItems.slice(3, 7).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* قسم التكامل والواجهات البرمجية */}
            <div className="mb-2 px-3 text-base font-medium text-muted-foreground">
              {currentTranslations.storeIntegration}
            </div>
            <div className="space-y-1.5 mb-4">
              {navItems.slice(7, 10).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* قسم التتبع والمواقع */}
            <div className="mb-2 px-3 text-base font-medium text-muted-foreground">
              {currentTranslations.trackingAndLocations}
            </div>
            <div className="space-y-1.5 mb-4">
              {navItems.slice(10, 12).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* قسم المالية والفواتير */}
            <div className="mb-2 px-3 text-base font-medium text-muted-foreground">
              {currentTranslations.financeAndBilling}
            </div>
            <div className="space-y-1.5 mb-4">
              {navItems.slice(12, 15).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* قسم إدارة الحساب */}
            <div className="mb-3 px-3 text-base font-bold text-[#5791F4] uppercase tracking-wider">
              {currentTranslations.accountManagement}
            </div>
            <div className="space-y-1.5">
              {navItems.slice(15, 17).map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`v7-sidebar-item flex w-full items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all v7-fade-in cursor-pointer ${
                    item.active ? "v7-neu-button-active" : "v7-neu-button-flat"
                  } ${item.active ? activeLinkClass : linkClass}`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${1.2 + index * 0.05}s` }}
                  role="link"
                  aria-label={item.title}
                  aria-current={item.active ? "page" : undefined}
                >
                  <div
                    className={`v7-icon-container ${
                      item.active ? "v7-icon-active" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 sm:h-7 w-6 sm:w-7 ${
                        item.active ? "text-[#5791F4]" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className="flex-1 text-center font-semibold text-lg sm:text-xl">
                    {item.title}
                  </span>
                  {item.active && (
                    <div className="h-2 w-2 rounded-full bg-[#5791F4]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="mt-6 border-t border-gray-200 dark:border-[#2a3349] pt-4">
          <button
            onClick={handleSignOut}
            className={`v7-sidebar-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base transition-all ${
              theme === "dark"
                ? "hover:bg-[#2a3349] text-[#e05d34]"
                : "hover:bg-gray-100 text-[#e05d34]"
            }`}
          >
            <div className="v7-icon-container">
              <LogOut className="h-6 w-6 text-[#e05d34]" />
            </div>
            <span className="text-base">{currentTranslations.signOut}</span>
          </button>
        </div>
        <div className=" flex justify-center items-center   ">
          <V7FloatingAssistant />
        </div>
        {/* <div className="mt-auto">
          <div className="mt-6 rounded-xl v7-neu-card-support p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#3498db]/10 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#3498db]" />
              <span className="text-base font-medium">{currentTranslations.needHelp}</span>
            </div>
            <p className="mb-3 text-sm text-gry">{currentTranslations.supportTeam}</p>
            <Button size="sm" className="w-full v7-neu-button-support" onClick={() => handleNavigation("/support")}>
              <Headphones className="mr-2 h-5 w-5" />
              {currentTranslations.contactUs}
            </Button>
          </div>
        </div> */}
      </aside>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className={`w-64 sm:w-72 flex-shrink-0 p-0 v7-neu-sidebar ${sidebarClass}`}
        >
          <div className="flex h-14 sm:h-16 items-center justify-between border-b px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <div className="v7-neu-logo-sm">
                <span className="text-sm font-bold text-[#3498db]">MR</span>
              </div>
              <span className="text-base font-bold text-[#3498db]">مراسيل</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="v7-close-button"
              aria-label="إغلاق القائمة"
            >
              <X className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-3 sm:p-4 md:p-5">
              {/* قسم القائمة الرئيسية */}
              <div className="mb-3 px-3 text-[10px] sm:text-xs font-bold text-[#5791F4] uppercase tracking-wider">
                {currentTranslations.mainMenu}
              </div>

              {/* تقسيم القائمة الرئيسية إلى مجموعات منطقية */}
              <div className="space-y-1.5 mb-4 ">
                {/* الصفحات الرئيسية */}
                {navItems.slice(0, 4).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all ${
                      item.active
                        ? "v7-neu-button-active"
                        : "v7-neu-button-flat"
                    } ${item.active ? activeLinkClass : linkClass}`}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                    role="link"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className={`v7-icon-container ${
                        item.active ? "v7-icon-active" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-6 sm:h-7 w-6 sm:w-7 ${
                          item.active
                            ? "text-[#5791F4]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-base sm:text-lg">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className="mr-auto h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#5791F4]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* قسم الشحنات والطرود */}
              <div className="mb-2 px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">
                {currentTranslations.shipmentsAndParcels}
              </div>
              <div className="space-y-1.5 mb-4">
                {navItems.slice(4, 8).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all ${
                      item.active
                        ? "v7-neu-button-active"
                        : "v7-neu-button-flat"
                    } ${item.active ? activeLinkClass : linkClass}`}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                    role="link"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className={`v7-icon-container ${
                        item.active ? "v7-icon-active" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-6 sm:h-7 w-6 sm:w-7 ${
                          item.active
                            ? "text-[#5791F4]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-base sm:text-lg">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className="mr-auto h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#5791F4]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* قسم التكامل والواجهات البرمجية */}
              <div className="mb-2 px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">
                {currentTranslations.storeIntegration}
              </div>
              <div className="space-y-1.5 mb-4">
                {navItems.slice(8, 11).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all ${
                      item.active
                        ? "v7-neu-button-active"
                        : "v7-neu-button-flat"
                    } ${item.active ? activeLinkClass : linkClass}`}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                    role="link"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className={`v7-icon-container ${
                        item.active ? "v7-icon-active" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-6 sm:h-7 w-6 sm:w-7 ${
                          item.active
                            ? "text-[#5791F4]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-base sm:text-lg">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className="mr-auto h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#5791F4]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* قسم التتبع والمواقع */}
              <div className="mb-2 px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">
                {currentTranslations.trackingAndLocations}
              </div>
              <div className="space-y-1.5 mb-4">
                {navItems.slice(11, 15).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all ${
                      item.active
                        ? "v7-neu-button-active"
                        : "v7-neu-button-flat"
                    } ${item.active ? activeLinkClass : linkClass}`}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                    role="link"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className={`v7-icon-container ${
                        item.active ? "v7-icon-active" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-6 sm:h-7 w-6 sm:w-7 ${
                          item.active
                            ? "text-[#5791F4]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-base sm:text-lg">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className="mr-auto h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#5791F4]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* قسم إدارة الحساب */}
              <div className="mb-3 px-3 text-[10px] sm:text-xs font-bold text-[#5791F4] uppercase tracking-wider">
                {currentTranslations.accountManagement}
              </div>
              <div className="space-y-1.5">
                {navItems.slice(17).map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all cursor-pointer ${
                      item.active
                        ? "v7-neu-button-active"
                        : "v7-neu-button-flat"
                    } ${item.active ? activeLinkClass : linkClass}`}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                    role="link"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className={`v7-icon-container ${
                        item.active ? "v7-icon-active" : ""
                      }`}
                    >
                      <item.icon
                        className={`h-6 sm:h-7 w-6 sm:w-7 ${
                          item.active
                            ? "text-[#5791F4]"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-base sm:text-lg">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className="mr-auto h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#5791F4]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <V7FloatingAssistant />
            <div className="mt-6 border-t border-gray-200 dark:border-[#2a3349] pt-4 px-3">
              <button
                onClick={handleSignOut}
                className={`v7-sidebar-item flex w-full items-center gap-2 sm:gap-3 rounded-xl px-3 py-2.5 sm:py-3 text-sm sm:text-base transition-all ${
                  theme === "dark"
                    ? "hover:bg-[#2a3349] text-[#e05d34]"
                    : "hover:bg-gray-100 text-[#e05d34]"
                }`}
              >
                <div className="v7-icon-container">
                  <LogOut className="h-6 sm:h-7 w-6 sm:w-7 text-[#e05d34]" />
                </div>
                <span className="text-base">{currentTranslations.signOut}</span>
              </button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
