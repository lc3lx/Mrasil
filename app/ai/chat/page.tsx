"use client";

import Link from "next/link";
import { useState } from "react";
import { V7AIChat } from "@/components/v7/v7-ai-chat";
import { Button } from "@/components/ui/button";

export default function AIChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <main className="min-h-screen bg-[#f0f4f8] dark:bg-[#0f172a] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-6">
        <header className="text-center space-y-2">
          <p className="text-xs font-medium tracking-[0.4em] uppercase text-sky-500">
            Marasil AI Assistant
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1c2c4e] dark:text-white">
            تحدث مع مراسيل بوت الذكي
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            احصل على مساعدة فورية في إنشاء الشحنات، تتبعها، وإدارة حسابك من أي مكان.
          </p>
        </header>

        <section className="relative flex justify-center">
          <V7AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </section>

        {!isChatOpen && (
          <div className="flex flex-col items-center gap-4 bg-white/70 dark:bg-slate-900/80 rounded-2xl px-6 py-8 border border-sky-100 dark:border-slate-700 backdrop-blur">
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              أغلقت المحادثة. يمكنك فتحها مجددًا في أي وقت.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 bg-[#3498db] hover:bg-[#2980b9] text-white"
              onClick={() => setIsChatOpen(true)}
            >
              إعادة فتح المحادثة
            </Button>
          </div>
        )}

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          <span>تواجه مشكلة؟ </span>
          <Link href="/" className="text-[#3498db] hover:underline">
            العودة إلى منصة مراسيل
          </Link>
        </footer>
      </div>
    </main>
  );
}
