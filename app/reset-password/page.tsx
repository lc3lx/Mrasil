'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPasswordMutation } from '../api/authApi';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
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
  
  const passwordStrength = getPasswordStrength(formData.newPassword);
  const strengthLabels = ['ضعيف', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error('Please start from the forgot password page');
      router.push('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين');
      return;
    }

    // Validate password strength
    const { checks } = getPasswordStrength(formData.newPassword);
    if (!checks.length) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (!checks.uppercase) {
      toast.error('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
      return;
    }
    if (!checks.lowercase) {
      toast.error('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
      return;
    }
    if (!checks.number) {
      toast.error('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
      return;
    }

    try {
      await resetPassword({ email, newPassword: formData.newPassword }).unwrap();
      // Clear the stored email
      localStorage.removeItem('resetEmail');
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.data?.message || 'فشل في إعادة تعيين كلمة المرور');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Link href="/invoices" className="mb-6 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="شعار الشركة" className="h-40 w-auto sm:h-48" width={240} height={240} />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تعيين كلمة مرور جديدة
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أدخل كلمة المرور الجديدة
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base"
                  placeholder="كلمة المرور الجديدة"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${strengthColors[passwordStrength.strength] || 'bg-gray-400'}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 font-medium min-w-[80px]">
                      {strengthLabels[passwordStrength.strength] || 'ضعيف'}
                    </span>
                  </div>
                  {/* Password Requirements */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? 'text-green-600' : ''}`}>
                      <span>{passwordStrength.checks.length ? '✓' : '○'}</span>
                      <span>8 أحرف على الأقل</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.uppercase ? 'text-green-600' : ''}`}>
                      <span>{passwordStrength.checks.uppercase ? '✓' : '○'}</span>
                      <span>حرف كبير واحد على الأقل (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.lowercase ? 'text-green-600' : ''}`}>
                      <span>{passwordStrength.checks.lowercase ? '✓' : '○'}</span>
                      <span>حرف صغير واحد على الأقل (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-green-600' : ''}`}>
                      <span>{passwordStrength.checks.number ? '✓' : '○'}</span>
                      <span>رقم واحد على الأقل (0-9)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base"
                  placeholder="تأكيد كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">كلمتا المرور غير متطابقتين</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 