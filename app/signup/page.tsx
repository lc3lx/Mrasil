"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "../api/authApi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ResponseModal from "../components/ResponseModal";
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    
    if (checks.length) strength++;
    if (checks.uppercase) strength++;
    if (checks.lowercase) strength++;
    if (checks.number) strength++;
    
    return { strength, checks };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['ضعيف', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setModalMessage("كلمتا المرور غير متطابقتين");
      setModalOpen(true);
      return;
    }

    // Validate password strength
    const { checks } = getPasswordStrength(formData.password);
    if (!checks.length) {
      setModalMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.uppercase) {
      setModalMessage("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.lowercase) {
      setModalMessage("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.number) {
      setModalMessage("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
      setModalOpen(true);
      return;
    }

    // Validate name length
    if (formData.firstName.length < 3) {
      setModalMessage("الاسم الأول يجب أن يكون 3 أحرف على الأقل");
      setModalOpen(true);
      return;
    }

    if (formData.lastName.length < 3) {
      setModalMessage("الاسم الأخير يجب أن يكون 3 أحرف على الأقل");
      setModalOpen(true);
      return;
    }
    
    try {
      // Prepare data for API (exclude confirmPassword from request body)
      const { confirmPassword, ...signupData } = formData;
      
      console.log("Signup form data being sent:", signupData);

      await signup(signupData).unwrap();
      toast.success("تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup Error:", error);
      setModalMessage(error.data?.message || "فشل في إنشاء الحساب");
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
            <Link href="/invoices" className="mb-6 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="شعار الشركة" className="h-40 w-auto sm:h-48" width={240} height={240} />
            </Link>
            <h2 className="text-4xl font-bold text-white mb-10 tracking-wide text-center drop-shadow-lg">تسجيل دخول جديد</h2>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* First Name Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="الاسم الأول"
                    value={formData.firstName}
                    onChange={handleChange}
                    minLength={3}
                  />
                </div>
              </div>
              {/* Last Name Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="الاسم الأخير"
                    value={formData.lastName}
                    onChange={handleChange}
                    minLength={3}
                  />
                </div>
              </div>
              {/* Phone Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Password Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-10 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strengthColors[passwordStrength.strength] || 'bg-gray-400'}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/80 font-medium min-w-[80px]">
                        {strengthLabels[passwordStrength.strength] || 'ضعيف'}
                      </span>
                    </div>
                    {/* Password Requirements */}
                    <div className="text-xs text-white/70 space-y-1 rtl">
                      <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? 'text-green-300' : ''}`}>
                        <span>{passwordStrength.checks.length ? '✓' : '○'}</span>
                        <span>8 أحرف على الأقل</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.checks.uppercase ? 'text-green-300' : ''}`}>
                        <span>{passwordStrength.checks.uppercase ? '✓' : '○'}</span>
                        <span>حرف كبير واحد على الأقل (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.checks.lowercase ? 'text-green-300' : ''}`}>
                        <span>{passwordStrength.checks.lowercase ? '✓' : '○'}</span>
                        <span>حرف صغير واحد على الأقل (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-green-300' : ''}`}>
                        <span>{passwordStrength.checks.number ? '✓' : '○'}</span>
                        <span>رقم واحد على الأقل (0-9)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Confirm Password Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-10 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base border border-white/20"
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* Signup Button */}
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
                    جار إنشاء الحساب...
                  </div>
                ) : (
                  'إنشاء حساب'
                )}
              </button>
              {/* Login Link */}
              <div className="w-full flex justify-center gap-4 mt-4">
                <p className="text-white/80 text-base font-medium flex gap-2">
                  هل لديك حساب بالفعل؟
                  <Link href="/login" className="underline hover:text-white">تسجيل دخول</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
