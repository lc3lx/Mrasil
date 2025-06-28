'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '../api/authApi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { V7LoginHeader } from '@/components/v7/v7-login-header';
import { V7LoginFooter } from '@/components/v7/v7-login-footer';
import ResponseModal from '../components/ResponseModal';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword({ email }).unwrap();
      localStorage.setItem('resetEmail', email);
      toast.success('تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني');
      router.push('/verify-reset-code');
    } catch (error: any) {
      setModalMessage(error.data?.message || 'فشل في إرسال رمز إعادة التعيين');
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <V7LoginHeader />
      <ResponseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status="fail" message={modalMessage} />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                استعادة كلمة المرور
              </h2>
              <p className="text-blue-100 text-sm">
                أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة تعيين كلمة المرور
              </p>
            </div>
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        إرسال رمز إعادة التعيين
                      </div>
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      العودة لتسجيل الدخول
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              بإعادة تعيين كلمة المرور، فإنك توافق على{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                شروط الاستخدام
              </Link>{' '}
              و{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                سياسة الخصوصية
              </Link>
            </p>
          </div>
        </div>
      </main>
      <V7LoginFooter />
    </div>
  );
} 