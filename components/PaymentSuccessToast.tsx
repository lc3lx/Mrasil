"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface PaymentSuccessData {
  message: string;
  amount: number;
  timestamp: string;
}

export default function PaymentSuccessToast() {
  const [showToast, setShowToast] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(
    null
  );

  useEffect(() => {
    // التحقق من وجود رسالة نجاح في localStorage
    const checkPaymentSuccess = () => {
      const successData = localStorage.getItem("paymentSuccess");
      if (successData) {
        try {
          const parsedData = JSON.parse(successData);
          setPaymentData(parsedData);
          setShowToast(true);

          // إزالة البيانات من localStorage بعد عرضها
          localStorage.removeItem("paymentSuccess");

          // إخفاء الرسالة تلقائياً بعد 5 ثوانٍ
          setTimeout(() => {
            setShowToast(false);
          }, 5000);
        } catch (error) {
          console.error("خطأ في تحليل بيانات نجاح الدفع:", error);
        }
      }
    };

    // فحص فوري
    checkPaymentSuccess();

    // فحص دوري كل ثانية (للحالات التي قد تفوتها)
    const interval = setInterval(checkPaymentSuccess, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setShowToast(false);
    setPaymentData(null);
  };

  if (!showToast || !paymentData) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-500">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-green-800">تم بنجاح!</h3>
            <p className="mt-1 text-sm text-green-700">{paymentData.message}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {paymentData.amount} ريال سعودي
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


