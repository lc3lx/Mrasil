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
      className={`v7-neu-header-home fixed inset-x-0 top-0 z-50 w-full bg-[#ccd5dd] border-b border-white/30 md:border-white/20 backdrop-blur-md transform transition-all duration-700 ease-in-out py-2 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
      ${isSmall ? "lg:min-w-[65rem] lg:top-4 lg:rounded-full" : "top-0"}
    `}
      style={{
        WebkitTextSizeAdjust: "100%",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        className={`relative max-w-screen-xl mx-auto flex items-center justify-center xl:justify-between transition-all duration-500 min-h-[44px] md:min-h-[52px]`}
      >
        {/* Right side: Navigation / Hamburger */}
        <div className="flex items-center gap-3 absolute right-3 top-1/2 -translate-y-1/2 xl:left-3 xl:static xl:translate-y-0 xl:order-0 xl:flex-1 xl:justify-start">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="xl:hidden p-3 rounded-xl bg-[#ccd5dd] hover:bg-[#ccd5dd]/90 backdrop-blur-md border border-white/30 md:border-white/10 transition-all duration-300 shadow-sm md:shadow-none"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
          <ul className="hidden xl:flex items-center gap-8 text-black font-bold text-xl">
            <Link href="#">الرئيسية</Link>
            <Link href="#">الأسعار</Link>
            <Link href="#">الشركاء</Link>
            <Link href="#">المدونة</Link>
          </ul>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          onClick={(e) => {
            // منع السلوك الافتراضي إذا كنا بالفعل في الصفحة الرئيسية
            if (pathname === "/") {
              e.preventDefault();
              // إعادة تحميل الصفحة بدون redirect
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="
          w-[6rem] h-[3rem]
          sm:w-[7rem] sm:h-[4rem]
          md:w-[9rem] md:h-[5rem]
          xl:w-[11rem] xl:h-[6rem]
          hover:opacity-80 transition-opacity block
        "
        >
          <Image
            src="/logo.png"
            alt="MARASIL Logo"
            width={160}
            height={120}
            className=" w-full h-full object-contain"
          />
        </Link>

        {/* Left side: Auth links (desktop) */}
        <div className="hidden xl:flex xl:flex-1 items-center justify-end gap-6">
          <Link
            href="/login"
            className="text-black font-bold sm:text-lg xl:text-xl text-sm"
          >
            تسجيل دخول
          </Link>
          <Button
            className=" font-medium sm:text-base xl:text-lg text-sm rounded-lg xl:rounded-xl px-6 xl:px-8 py-3 xl:py-4 bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white  transition-colors sm:min-w-[140px] xl:min-w-[160px] shadow"
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Dropdown panel */}
          <div className="absolute inset-x-0 top-full z-50 xl:hidden">
            <div className="w-full px-0">
              <div className="rounded-b-2xl border border-white/20 border-t-0 bg-[#ccd5dd] backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="px-4 sm:px-6 py-6">
                  <nav className="flex flex-col items-center text-center divide-y divide-gray-200 text-black">
                    <Link
                      className="py-4 font-bold text-lg hover:text-[#0F2F55] transition-colors w-full text-center"
                      href="#"
                      onClick={() => setMenuOpen(false)}
                    >
                      الرئيسية
                    </Link>
                    <Link
                      className="py-4 font-bold text-lg hover:text-[#0F2F55] transition-colors w-full text-center"
                      href="#"
                      onClick={() => setMenuOpen(false)}
                    >
                      الأسعار
                    </Link>
                    <Link
                      className="py-4 font-bold text-lg hover:text-[#0F2F55] transition-colors w-full text-center"
                      href="#"
                      onClick={() => setMenuOpen(false)}
                    >
                      الشركاء
                    </Link>
                    <Link
                      className="py-4 font-bold text-lg hover:text-[#0F2F55] transition-colors w-full text-center"
                      href="#"
                      onClick={() => setMenuOpen(false)}
                    >
                      المدونة
                    </Link>
                  </nav>
                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/login"
                      className="text-[#0F2F55] font-bold text-lg hover:text-[#0F2F55]/80 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      تسجيل دخول
                    </Link>
                    <Button
                      className="font-medium rounded-xl px-8 py-3 bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto min-w-[200px]"
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleSignup(e as any);
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
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
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
