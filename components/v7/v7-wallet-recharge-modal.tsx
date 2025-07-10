"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface WalletRechargeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletRechargeModal({ isOpen, onClose }: WalletRechargeModalProps) {
  const [amount, setAmount] = useState<string>("100")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | null>(null)
  const [promoCode, setPromoCode] = useState<string>("")

  if (!isOpen) return null

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setCustomAmount(value)
      if (value) setAmount("custom")
    }
  }

  const handleContinue = () => {
    // Handle payment processing
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        {/* هذا العنصر يساعد على توسيط المحتوى عموديًا */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <div className="v7-neu-card-premium inline-block w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8 text-left align-middle transition-all transform rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b p-4 rtl">
            <button onClick={onClose} className="v7-neu-icon-sm flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold text-primary">إختر طريقة الدفع</h1>
          </div>

          <div className="p-6 space-y-6 rtl">
            <div className="space-y-4">
              <h2 className="text-lg font-bold">المبلغ:</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <button
                  onClick={() => handleAmountSelect("100")}
                  className={`rounded-full py-3 px-4 flex items-center justify-center text-sm ${
                    amount === "100" ? "v7-neu-button-accent" : "v7-neu-button"
                  }`}
                >
                  <span className="ml-1">﷼</span> 100
                </button>
                <button
                  onClick={() => handleAmountSelect("500")}
                  className={`rounded-full py-3 px-4 flex items-center justify-center text-sm ${
                    amount === "500" ? "v7-neu-button-accent" : "v7-neu-button"
                  }`}
                >
                  <span className="ml-1">﷼</span> 500
                </button>
                <button
                  onClick={() => handleAmountSelect("1000")}
                  className={`rounded-full py-3 px-4 flex items-center justify-center text-sm ${
                    amount === "1000" ? "v7-neu-button-accent" : "v7-neu-button"
                  }`}
                >
                  <span className="ml-1">﷼</span> 1000
                </button>
                <button
                  onClick={() => handleAmountSelect("2000")}
                  className={`rounded-full py-3 px-4 flex items-center justify-center text-sm ${
                    amount === "2000" ? "v7-neu-button-accent" : "v7-neu-button"
                  }`}
                >
                  <span className="ml-1">﷼</span> 2000
                </button>
                <button
                  onClick={() => handleAmountSelect("5000")}
                  className={`rounded-full py-3 px-4 flex items-center justify-center text-sm ${
                    amount === "5000" ? "v7-neu-button-accent" : "v7-neu-button"
                  }`}
                >
                  <span className="ml-1">﷼</span> 5000
                </button>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-xs">يجب أن يكون الرقم من مضاعفات الرقم SAR 100</p>
                <div className="flex-1">
                  <div className="v7-neu-input-container">
                    <input
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="مبلغ آخر"
                      className="v7-neu-input text-right"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("bank")}
                className={`v7-neu-card p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                  paymentMethod === "bank" ? "v7-neu-card-accent" : ""
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                    {paymentMethod === "bank" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2">التحويل البنكي</p>
                  <div className="flex justify-center">
                    <div className="v7-neu-icon-sm-premium w-14 h-14 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary rounded-md flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod("card")}
                className={`v7-neu-card p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                  paymentMethod === "card" ? "v7-neu-card-accent" : ""
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                    {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2">بطاقة الائتمان</p>
                  <div className="flex justify-center gap-2">
                    <div className="v7-neu-icon-sm w-10 h-6 flex items-center justify-center">
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="12" rx="2" fill="#1A1A1A" />
                        <path
                          d="M10 3.5C10 2.67157 10.6716 2 11.5 2H14.5C15.3284 2 16 2.67157 16 3.5V8.5C16 9.32843 15.3284 10 14.5 10H11.5C10.6716 10 10 9.32843 10 8.5V3.5Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="v7-neu-icon-sm w-10 h-6 flex items-center justify-center">
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="12" rx="2" fill="#1A1A1A" />
                        <rect x="4" y="4" width="12" height="4" fill="#FFB800" />
                      </svg>
                    </div>
                    <div className="v7-neu-icon-sm w-10 h-6 flex items-center justify-center">
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="12" rx="2" fill="#2566AF" />
                        <path d="M8 4L6 8H4L5 5.5L4 4H6L6.5 5L7 4H8Z" fill="white" />
                        <path d="M8 4L9 8H11L13 4H11L10 6.5L9.5 4H8Z" fill="white" />
                        <path d="M13 4L14 8H16L15 4H13Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold">الرمز الترويجي</h2>
              <p className="text-sm">لديك رمز ترويجي؟ استخدمه الآن:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 v7-neu-input-container order-2 sm:order-1">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="الرمز الترويجي"
                    className="v7-neu-input text-right"
                  />
                </div>
                <button className="v7-neu-button-accent px-6 py-2 order-1 sm:order-2">تطبيق</button>
              </div>
            </div>

            <div className="flex justify-center mt-8 pb-4">
              <button
                onClick={handleContinue}
                disabled={!paymentMethod || (!amount && !customAmount)}
                className={`v7-neu-button-accent px-12 py-3 text-base ${
                  !paymentMethod || (!amount && !customAmount) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                استمرار
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
