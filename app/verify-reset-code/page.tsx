'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyResetCodeMutation } from '../api/authApi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ResponseModal from '../components/ResponseModal';
import Image from 'next/image';

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [verifyCode, { isLoading }] = useVerifyResetCodeMutation();
  const [resetCode, setResetCode] = useState('');
  const [email, setEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error('الرجاء البدء من صفحة استرجاع كلمة المرور');
      router.push('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Remove any whitespace and ensure it's a clean string
      const formattedCode = resetCode.replace(/\s/g, '');
      
      // Log the exact payload we're sending
      console.log('Sending verification code:', { resetCode: formattedCode });
      
      const response = await verifyCode({ resetCode: formattedCode }).unwrap();
      console.log('Verification response:', response);
      
      toast.success('تم التحقق من الرمز بنجاح');
      router.push('/reset-password');
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.data?.message || 'رمز التحقق غير صحيح';
      console.log('Error details:', error);
      setModalMessage(errorMessage);
      setModalOpen(true);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) { // Limit to 6 digits
      setResetCode(value);
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
            <Link href="/" className="mb-6 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="شعار الشركة" className="h-40 w-auto sm:h-48" width={240} height={240} />
            </Link>
            <h2 className="text-4xl font-bold text-white mb-6 tracking-wide text-center drop-shadow-lg">إدخال رمز التحقق</h2>
            <p className="text-white/90 text-base mb-10 text-center font-medium">
              أدخل الرمز الذي تم إرساله إلى {email}
            </p>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Code Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="resetCode"
                    name="resetCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    className="block w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-base text-center tracking-widest border border-white/20"
                    placeholder="أدخل الرمز المكون من 6 أرقام"
                    value={resetCode}
                    onChange={handleCodeChange}
                    maxLength={6}
                    style={{ letterSpacing: '0.5em' }}
                  />
                </div>
              </div>
              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || resetCode.length !== 6}
                className="w-full py-4 rounded-xl text-white bg-primary font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التحقق...
                  </div>
                ) : (
                  'التحقق من الرمز'
                )}
              </button>
              {/* Links */}
              <div className="w-full flex justify-center gap-4 mt-4">
                <Link href="/forgot-password" className="text-white/80 text-base font-medium hover:underline hover:text-white">
                  لم تستلم الرمز؟ حاول مرة أخرى
                </Link>
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