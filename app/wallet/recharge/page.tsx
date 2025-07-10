"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function WalletRechargePage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [amount, setAmount] = useState<string>("100")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | null>(null)
  const [promoCode, setPromoCode] = useState<string>("")

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

  const handleBack = () => {
    router.back()
  }

  const handleContinue = () => {
    // Handle payment processing
    router.push("/balance")
  }

  const isDarkMode = theme === "dark"

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-dark-background text-dark-text" : "bg-[#f8f9fa]"}`}>
      <div className="max-w-3xl mx-auto p-4">
        <div className={`rounded-xl shadow-md ${isDarkMode ? "bg-dark-card" : "bg-white"} v7-neu-card p-6`}>
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <button onClick={handleBack} className={`p-2 rounded-full v7-neu-button-sm`}>
              <X className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">إختر طريقة الدفع</h1>
          </div>

          <div className="space-y-8">
            <div
              className={`bg-blue-50 p-4 rounded-lg text-sm text-right ${isDarkMode ? "bg-blue-900/20 text-blue-200" : ""}`}
            >
              <p>باستخدام بطاقة الائتمان ، سيتم إضافة القيمة تلقائياً ؛ قد تستغرق معالجة التحويل المصرفي 24 ساعة</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-right">المبلغ:</h2>
              <div className="grid grid-cols-5 gap-3">
                {["100", "500", "1000", "2000", "5000"].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className={`rounded-full py-3 px-4 flex items-center justify-center transition-all ${
                      amount === val
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "v7-neu-button-active text-white bg-blue-600"
                        : isDarkMode
                          ? "bg-dark-card border border-dark-border hover:bg-dark-hover"
                          : "v7-neu-button-flat bg-gray-100"
                    }`}
                  >
                    <span className="ml-1">﷼</span> {val}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <p className="text-right text-sm">يجب أن يكون الرقم من مضاعفات الرقم SAR 100</p>
                <div className="flex-1">
                  <Input
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="مبلغ آخر"
                    className={`text-right ${isDarkMode ? "bg-dark-elevated border-dark-border" : "v7-neu-input"}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("bank")}
                className={`border rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${
                  paymentMethod === "bank"
                    ? isDarkMode
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-blue-600 bg-blue-50"
                    : isDarkMode
                      ? "border-dark-border bg-dark-card hover:bg-dark-hover"
                      : "v7-neu-card hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      isDarkMode ? "border-gray-500" : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "bank" && <div className="w-4 h-4 rounded-full bg-blue-600"></div>}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2">التحويل البنكي</p>
                  <div className="flex justify-center">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-10 h-10 border-2 rounded-md flex items-center justify-center ${
                            isDarkMode ? "border-blue-400" : "border-blue-600"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 border-2 ${isDarkMode ? "border-blue-400" : "border-blue-600"}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod("card")}
                className={`border rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${
                  paymentMethod === "card"
                    ? isDarkMode
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-blue-600 bg-blue-50"
                    : isDarkMode
                      ? "border-dark-border bg-dark-card hover:bg-dark-hover"
                      : "v7-neu-card hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      isDarkMode ? "border-gray-500" : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "card" && <div className="w-4 h-4 rounded-full bg-blue-600"></div>}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2">بطاقة الائتمان</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-blue-600 rounded"></div>
                    </div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-red-500 rounded"></div>
                    </div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <div className="w-8 h-5 bg-black rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-right">الرمز الترويجي</h2>
              <p className="text-right">لديك رمز ترويجي؟ استخدمه الآن:</p>
              <div className="flex gap-2">
                <Button className={`px-8 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "v7-neu-button"}`}>
                  تطبيق
                </Button>
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="الرمز الترويجي"
                  className={`text-right ${isDarkMode ? "bg-dark-elevated border-dark-border" : "v7-neu-input"}`}
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleContinue}
                disabled={!paymentMethod || (!amount && !customAmount)}
                className={`px-16 py-6 text-lg ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
                    : "v7-neu-button disabled:opacity-50"
                }`}
              >
                استمرار
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
