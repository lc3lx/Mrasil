"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export function ModernHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push("/signup");
  };
    const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSmall(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`v7-neu-header-home fixed inset-x-0 top-0 z-50 w-full bg-transparent border-b border-white/20 backdrop-blur-md transform transition-all duration-500 ease-in-out py-2.5 px-4 sm:px-8 md:px-12 lg:px-16
      ${isSmall ? "lg:min-w-[65rem] lg:top-4 lg:rounded-full" : "top-0"}
    `}
      style={{ WebkitTextSizeAdjust: "100%", WebkitTapHighlightColor: "transparent" }}
    >
      <div className={`relative max-w-screen-xl mx-auto flex items-center justify-center xl:justify-between transition-all duration-300`}>

      {/* Right side: Navigation / Hamburger */}
      <div className="flex items-center gap-3 absolute left-3 top-1/2 -translate-y-1/2 xl:static xl:translate-y-0 xl:order-0 xl:flex-1 xl:justify-start">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="xl:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
        <ul className="hidden xl:flex items-center gap-6 text-black font-bold text-lg">
          <Link href="#">الرئيسية</Link>
          <Link href="#">الأسعار</Link>
          <Link href="#">الشركاء</Link>
          <Link href="#">المدونة</Link>
        </ul>
      </div>

      {/* Center: Logo */}
      <Link 
        href="/invoices"
        onClick={(e) => {
          // منع السلوك الافتراضي إذا كنا بالفعل في صفحة invoices
          if (pathname === '/invoices') {
            e.preventDefault();
            // إعادة تحميل الصفحة بدون redirect
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="sm:w-[12rem] sm:h-[6rem] w-[6rem] h-[3rem] hover:opacity-80 transition-opacity block"
      >
        <Image src="/logo.png" alt="MARASIL Logo" width={120} height={60} className=" w-full h-full object-contain" />
      </Link>

      {/* Left side: Auth links (desktop) */}
      <div className="hidden xl:flex xl:flex-1 items-center justify-end gap-6">
        <Link href="/login" className="text-black font-bold sm:text-lg text-sm">
          تسجيل دخول
        </Link>
        <Button
          className=" font-medium sm:text-base text-sm rounded-lg  px-6 py-3 bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white  transition-colors sm:min-w-[140px] shadow"
          onClick={handleSignup}
          disabled={loading}
          >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                  ></path>
              </svg>
              جاري التحميل...
            </span>
          ) : (
            "للتسجيل مجانًا"
          )}
        </Button>
      </div>
          </div>

      {/* Mobile/Tablet dropdown menu under header + blurred backdrop */}
      {menuOpen && (
        <>
          {/* Blurred overlay to dim the background */}
          <div
            className="fixed inset-0 z-40 bg-transparent backdrop-blur-sm xl:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Dropdown panel */}
          <div className="absolute inset-x-0 top-full z-50 xl:hidden">
            <div className="w-full px-0">
              <div className="rounded-b-2xl border border-white/10 border-t-0 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="px-6 py-4">
                  <nav className="flex flex-col items-center text-center divide-y divide-white/5 text-black">
                    <Link className="py-3 font-bold text-base" href="#" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
                    <Link className="py-3 font-bold text-base" href="#" onClick={() => setMenuOpen(false)}>الأسعار</Link>
                    <Link className="py-3 font-bold text-base" href="#" onClick={() => setMenuOpen(false)}>الشركاء</Link>
                    <Link className="py-3 font-bold text-base" href="#" onClick={() => setMenuOpen(false)}>المدونة</Link>
                  </nav>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/login" className="text-black font-bold" onClick={() => setMenuOpen(false)}>
                      تسجيل دخول
                    </Link>
                    <Button
                      className="font-medium rounded-lg px-6 py-3 bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white transition-colors shadow"
                      onClick={(e) => { setMenuOpen(false); handleSignup(e as any); }}
                      disabled={loading}
                    >
                      {loading ? "..." : "للتسجيل مجانًا"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
