"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function ModernHeader() {
  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: translate(-50%, -5px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push("/signup");
  };

  return (
    <header
      className={
        (scrolled
          ? "fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm border-b border-gray-200/30 flex items-center justify-between h-20 px-8 rounded-[40px] w-[calc(80vw-1rem)] max-w-6xl shadow-lg transform transition-all duration-300 ease-out"
          : "sticky top-0 z-50 bg-[#D4DBEA] backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between h-24 px-8 transform transition-all duration-300 ease-out") + " " +
        (scrolled ? "animate-fadeInScale" : "")
      }
      style={{
        ...(scrolled ? {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          animation: 'fadeInScale 0.2s ease-out forwards',
        } : {
          background: '#D4DBEA',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        })
      }}
    >
      {/* Right side: Navigation */}
      <nav className="flex items-center gap-8 text-black font-bold text-lg">
        {/* Globe icon for language switch */}

        <Link href="#">الرئيسية</Link>
        <Link href="#">الشركاء</Link>
        <Link href="#">المدونة</Link>
        <button
          type="button"
          aria-label="تغيير اللغة"
          className="hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none"
          style={{ display: "flex", alignItems: "center" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-globe"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 0 20" />
            <path d="M12 2a15.3 15.3 0 0 0 0 20" />
          </svg>
        </button>
      </nav>

      {/* Center: Logo */}
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="MARASIL Logo" width={200} height={200} />
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
