"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModernHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push("/signup");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between h-24 px-8">
      {/* Right side: Navigation */}
      <nav className="flex items-center gap-8 text-black font-bold text-lg">
        <Link href="#">الرئيسية</Link>
        <Link href="#">الأسعار</Link>
        <Link href="#">الشركاء</Link>
        <Link href="#">المدونة</Link>
      </nav>

      {/* Center: Logo */}
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="MARASIL Logo" width={120} height={60} />
      </div>

      {/* Left side: Auth links */}
      <div className="flex items-center gap-6">
        <Link href="/login" className="text-black font-bold text-lg">
          تسجيل دخول
        </Link>
        <Button
          className="font-bold text-base rounded-lg px-6 py-3 bg-blue-900 text-white hover:bg-blue-800 transition-colors min-w-[140px] shadow"
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
    </header>
  );
}
