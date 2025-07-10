"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupMutation } from '../api/authApi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { V7LoginHeader } from '@/components/v7/v7-login-header';
import { V7LoginFooter } from '@/components/v7/v7-login-footer';
import ResponseModal from '../components/ResponseModal';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setModalMessage('كلمتا المرور غير متطابقتين');
      setModalOpen(true);
      return;
    }

    try {
      await signup(formData).unwrap();
      toast.success('تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.');
      router.push('/login');
    } catch (error: any) {
      setModalMessage(error.data?.message || 'فشل في إنشاء الحساب');
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: 'url(/login.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/40 z-0" />
     
      <ResponseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status="fail" message={modalMessage} />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-10 flex flex-col items-center">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-8 tracking-wide text-center drop-shadow">Sign Up</h2>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div className="w-full grid grid-cols-1 gap-4">
                {/* First Name */}
                <div className="w-full">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full py-3 px-4 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {/* Last Name */}
                <div className="w-full">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full py-3 px-4 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {/* Email */}
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
                      className="block w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Password */}
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
                      className="block w-full pl-12 pr-10 py-3 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
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
                      className="block w-full pl-12 pr-10 py-3 bg-white/10 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-white text-blue-700 font-bold text-lg shadow hover:shadow-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
              {/* Login Link */}
              <div className="w-full flex justify-center mt-4">
                <p className="text-white/80 text-base font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="underline hover:text-white">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
     
    </div>
  );
} 