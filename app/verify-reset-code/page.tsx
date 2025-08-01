'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyResetCodeMutation } from '../api/authApi';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [verifyCode, { isLoading }] = useVerifyResetCodeMutation();
  const [resetCode, setResetCode] = useState('');
  const [email, setEmail] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Remove any whitespace and ensure it's a clean string
      const formattedCode = resetCode.replace(/\s/g, '');
      
      // Log the exact payload we're sending
      console.log('Sending verification code:', { resetCode: formattedCode });
      
      const response = await verifyCode({ resetCode: formattedCode }).unwrap();
      console.log('Verification response:', response);
      
      toast.success('Code verified successfully');
      router.push('/reset-password');
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.data?.message || 'Invalid reset code';
      console.log('Error details:', error);
      toast.error(errorMessage);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) { // Limit to 6 digits
      setResetCode(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the code we sent to {email}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="resetCode" className="sr-only">
              Reset Code
            </label>
            <input
              id="resetCode"
              name="resetCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest"
              placeholder="Enter 6-digit code"
              value={resetCode}
              onChange={handleCodeChange}
              maxLength={6}
              style={{ letterSpacing: '0.5em' }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || resetCode.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Didn't receive the code? Try again
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 