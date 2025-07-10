"use client"

import Link from "next/link"

export function V7LoginFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-[#1e263a] border-t border-gray-200 dark:border-[#2a3349] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="v7-neu-logo">
              <span className="text-lg font-bold text-[#294D8B]">MR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#294D8B]">مراسيل</span>
              <span className="text-xs text-[#6d6a67]">خدمات الشحن المتطورة</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-[#6d6a67]">
            <Link href="/help" className="hover:text-[#294D8B] transition-colors">
              المساعدة
            </Link>
            <Link href="/support" className="hover:text-[#294D8B] transition-colors">
              الدعم الفني
            </Link>
            <Link href="/privacy" className="hover:text-[#294D8B] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-[#294D8B] transition-colors">
              شروط الاستخدام
            </Link>
          </div>
          
          <div className="text-sm text-[#6d6a67] mt-4 md:mt-0">
            © {currentYear} مراسيل. جميع الحقوق محفوظة
          </div>
        </div>
      </div>
    </footer>
  )
} 