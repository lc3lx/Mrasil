"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "../api/authApi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ResponseModal from "../components/ResponseModal";
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      localStorage.setItem("resetEmail", email);
      toast.success("تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني");
      router.push("/verify-reset-code");
    } catch (error: any) {
      setModalMessage(error.data?.message || "فشل في إرسال رمز إعادة التعيين");
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: 'url(/login.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/40 z-0" />
      <ResponseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status="fail" message={modalMessage} />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-12 flex flex-col items-center">
            {/* Title */}
            <Link href={"/"} className="mb-6">
              <Image src="/logo.png" alt="شعار الشركة" className="h-28 w-auto" width={180} height={180} />
            </Link>
            <h2 className="text-4xl font-bold text-white mb-10 tracking-wide text-center drop-shadow-lg">استرجاع كلمة المرور</h2>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Email Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-white bg-primary font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال رمز إعادة التعيين'
                )}
              </button>
              {/* Links */}
              <div className="w-full flex justify-center gap-4 mt-4">
                <p className="text-white/80 text-base font-medium flex gap-2">
                  ليس لديك حساب؟
                  <Link href="/signup" className="underline hover:text-white">تسجيل دخول جديد</Link>
                </p>
              </div>
              <div className="w-full flex justify-center">
                <Link href="/login" className="text-white/80 text-base font-medium hover:underline hover:text-white">
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
