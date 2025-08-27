"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "../api/authApi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { V7LoginHeader } from "@/components/v7/v7-login-header";
import { V7LoginFooter } from "@/components/v7/v7-login-footer";
import ResponseModal from "../components/ResponseModal";
import { LockKeyhole } from "lucide-react";

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
    <div
      className="min-h-screen flex  flex-col relative"
      style={{
        backgroundImage: "url(/login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0 m-auto" />
      <ResponseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        status="fail"
        message={modalMessage}
      />
      <main className="flex-1 flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full flex justify-center  items-center ">
          <div className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-10 flex flex-col items-center">
            <div className=" text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
               <LockKeyhole className=" text-white"/>
              </div>
              <h2 className="text-3xl font-bold text-white mb-8 tracking-wide text-center drop-shadow">
                تغيير كلمة المرور
              </h2>
              <p className="text-white text-sm flex gap-2">
          ليس لديك حساب؟ 
          <Link href={"/signup"} className=" text-primary">انشئ حسابك</Link>
              </p>
              <p className=" text-sm   text-white flex gap-2">
                أو 
                <Link href={"/login"} className=" text-primary">العودة لتسجيل الدخول</Link>
              </p>
            </div>
            <div className="px-6 py-8">
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-6"
              >
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full  py-3 rounded-full text-white bg-primary font-bold text-sm  shadow hover:shadow-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center text-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center text-center  justify-center text-sm">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        إرسال رمز إعادة التعيين
                      </div>
                    )}
                  </button>
                </div>
               
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
