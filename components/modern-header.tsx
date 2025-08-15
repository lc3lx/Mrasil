"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ModernHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <nav  className={` v7-neu-header sm:py-1 px-16 py-2   mx-auto  fixed sm:left-1/2  sm:-translate-x-1/2   z-50 bg-white/10 backdrop-blur-md border-b border-white/20  transform transition-transform duration-700 ease-in-out  scale-105
    ${
          isSmall ? "sm:min-w-[65rem] min-w-[20rem]     top-4  rounded-full  mx-auto  " : "  w-full     top-0  "
        }
    `}>
      <div className={` mx-auto px-4  flex justify-between items-center transition-all duration-300`}>

      {/* Right side: Navigation */}
      <ul className={`flex items-center gap-6 text-black font-bold   text-lg `}>
        <Link href="#" className=" hidden sm:block">الرئيسية</Link>
        <Link href="#" className=" hidden sm:block">الأسعار</Link>
        <Link href="#" className=" hidden sm:block">الشركاء</Link>
        <Link href="#" className=" hidden sm:block">المدونة</Link>
      </ul>

      {/* Center: Logo */}
      <div className="   sm:w-[12rem] sm:h-[6rem] w-[6rem] h-[3rem] ">
        <Image src="/logo.png" alt="MARASIL Logo" width={120} height={60} className=" w-full h-full object-contain" />
      </div>

      {/* Left side: Auth links */}
      <div className="flex items-center gap-6">
        <Link href="/login" className="text-black font-bold sm:text-lg text-sm">
          تسجيل دخول
        </Link>
        <Button
          className=" hidden sm:block font-medium sm:text-base text-sm rounded-lg  px-6 py-3 bg-[#0F2F55] hover:bg-[#0F2F55]/90 text-white  transition-colors sm:min-w-[140px] shadow"
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
    </nav>
  );
}
