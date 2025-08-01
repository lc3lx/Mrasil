"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRequestOtpMutation } from "../../api/verifyEmailApi"
import { useVerifyOtpMutation } from "../../api/verifyOtpApi"
import { useRouter } from "next/navigation"
import { CheckCircleIcon } from "lucide-react"
import ChooseActionStep from "./ChooseActionStep"
import { useGetCustomerMeQuery } from "../../api/customerApi"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [requestOtp, { isLoading }] = useRequestOtpMutation()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()
  const [step, setStep] = useState<'verify' | 'choose'>('verify')
  const { data: customerData } = useGetCustomerMeQuery();
  const company = customerData?.data;

  // Compute a very light brand color
  const lightBrandColor = company?.brand_color
    ? `${company.brand_color}20` // add alpha for lightness if hex, fallback if not
    : '#f8fafc';

  useEffect(() => {
    if (
      showOtpInput &&
      email &&
      otp.length === 5 &&
      /^\d{5}$/.test(otp)
    ) {
    }
  }, [otp, email, showOtpInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showOtpInput && email && otp.length === 5 && /^\d{5}$/.test(otp)) {
      try {
        const res = await verifyOtp({ email, otpCode: otp }).unwrap()
        setAlert({ type: 'success', message: res.message })
        setShowSuccessModal(true)
        localStorage.setItem('showExtraReplacementBtns', '1')
        setTimeout(() => {
          setShowSuccessModal(false)
          setStep('choose')
        }, 2000)
      } catch (err: any) {
        setAlert({ type: 'error', message: err?.data?.message || 'فشل التحقق من الرمز' })
      }
      return
    }
    if (!showOtpInput) {
      try {
        const res = await requestOtp({ email }).unwrap()
        setShowOtpInput(true)
      } catch (err: any) {
        setAlert({ type: 'error', message: err?.data?.message || 'حدث خطأ أثناء إرسال رمز التحقق' })
      }
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOtp(value)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: lightBrandColor }}>
      <div>
        <div className="flex flex-col items-center py-6 z-10">
          {company?.brand_logo && (
            <div style={{ border: `2px solid ${company?.brand_color || '#294D8B'}`, borderRadius: '20%', padding: 8, display: 'inline-block', background: '#fff' }}>
              <img src={company.brand_logo} alt="logo" className="h-16 mb-2" style={{objectFit:'contain'}} />
            </div>
          )}
          <div className="text-center mt-2">
            <div className="font-bold text-xl text-[#294D8B] dark:text-blue-400">{company?.company_name_ar}</div>
            <div className="text-md text-gray-600 dark:text-gray-300">{company?.company_name_en}</div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center" style={{marginTop: '40px'}}>
          {step === 'verify' && (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-6"
              dir="rtl"
            >
              <h2 className="text-2xl font-bold text-[#294D8B] dark:text-blue-400 text-center mb-2">التحقق من البريد الالكترونى</h2>
              <label htmlFor="email" className="block text-right text-[#294D8B] dark:text-blue-400 font-medium mb-2">
                الرجاء إدخال بريدك الإلكتروني للتحقق
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="v7-neu-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                readOnly={showOtpInput}
              />
              {showOtpInput && (
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="otp" className="block text-right text-[#294D8B] dark:text-blue-400 font-medium mb-2">
                    الرجاء إدخال رمز التحقق المرسل إلى بريدك الإلكتروني
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="رمز التحقق"
                    value={otp}
                    onChange={handleOtpChange}
                    required
                    className="v7-neu-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    maxLength={5}
                  />
                </div>
              )}
              {alert && (
                <div className={`rounded p-3 text-center mb-2 ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {alert.message}
                </div>
              )}
              <Button
                type="submit"
                className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700 w-full"
                disabled={isLoading || isVerifying}
              >
                {(isLoading || isVerifying) ? 'جاري الإرسال...' : 'تحقق'}
              </Button>
            </form>
          )}
          {step === 'choose' && (
            <ChooseActionStep onSelect={(action) => {
              console.log('Selected action:', action)
            }} company={company} />
          )}
          {showSuccessModal && step === 'verify' && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center shadow-lg">
                <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-400">تم التحقق بنجاح!</h3>
                <p className="text-gray-700 dark:text-gray-200">سيتم نقلك للخطوة التالية...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer with company info */}
      <footer className="bg-[#6050DC] rounded-lg shadow-sm mt-20">
        <div className="w-full max-w-screen-xl mx-auto p-4 py-2">
          <div className="sm:flex sm:items-center sm:justify-centre">
            
            <ul className="flex flex-wrap items-center mb-6 text-base font-medium text-blue-100 sm:mb-0">
              {company?.brand_email && (
                <li className="me-4 md:me-6">
                  <span className="hover:underline">📧 {company.brand_email}</span>
                </li>
              )}
              {company?.brand_website && (
                <li className="me-4 md:me-6">
                  <a href={company.brand_website} target="_blank" rel="noopener noreferrer" className="hover:underline">🌐 {company.brand_website}</a>
                </li>
              )}
              {company?.tax_number && (
                <li className="me-4 md:me-6">
                  <span className="hover:underline">💳 الرقم الضريبي: {company.tax_number}</span>
                </li>
              )}
              {company?.additional_info && (
                <li>
                  <span className="hover:underline">{company.additional_info}</span>
                </li>
              )}
            </ul>
          </div>
          <hr className="my-6 border-blue-200 sm:mx-auto lg:my-8" />
          <span className="block text-sm text-blue-100 sm:text-center">© {new Date().getFullYear()} <a href={company?.brand_website || '#'} className="hover:underline">{company?.brand_name || 'Marasil'}</a>. جميع الحقوق محفوظة.</span>
        </div>
      </footer>
    </div>
  )
} 