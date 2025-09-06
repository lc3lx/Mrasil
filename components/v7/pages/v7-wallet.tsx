"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import RealBlue from "../../../public/real-blue.png";
import RealWhite from "../../../public/real-white.png";
import bankTransfer from "../../../public/bankTransfer.png";
import creditCard1 from "../../../public/creditCard1.png";
import creditCard2 from "../../../public/creditCard2.png";
import creditCard3 from "../../../public/creditCard3.png";
import creditCard4 from "../../../public/creditCard4.png";
import creditCard5 from "../../../public/creditCard5.png";
import creditCard6 from "../../../public/creditCard6.png";

// استيراد مكتبة Moyasar
import "moyasar-payment-form/dist/moyasar.css";
// @ts-ignore
import Moyasar from "moyasar-payment-form";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export default function V7Wallet({
  isOpen,
  onClose,
  balance,
  onBalanceUpdate,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [transferImagePreview, setTransferImagePreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [processedPayments, setProcessedPayments] = useState<Set<string>>(
    new Set()
  );

  // دالة اختبار لمحاكاة السيناريوهات المختلفة (للتطوير فقط)
  const testPaymentScenarios = () => {
    console.log("🧪 Testing Payment Scenarios");

    // اختبار 1: نجاح الدفع
    console.log("Test 1: Success");
    window.history.pushState({}, "", "?status=paid&id=test-success-123");

    setTimeout(() => {
      // اختبار 2: فشل الدفع - رصيد غير كافي
      console.log("Test 2: Insufficient Funds");
      window.history.pushState(
        {},
        "",
        "?status=failed&id=test-failed-123&message=INSUFFICIENT+FUNDS"
      );

      setTimeout(() => {
        // اختبار 3: فشل الدفع - بطاقة مرفوضة
        console.log("Test 3: Card Declined");
        window.history.pushState(
          {},
          "",
          "?status=failed&id=test-failed-456&message=CARD+DECLINED"
        );

        setTimeout(() => {
          // العودة للحالة الطبيعية
          window.history.pushState({}, "", window.location.pathname);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // تشغيل الاختبارات عند الضغط على Ctrl+Shift+T (للتطوير فقط)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        testPaymentScenarios();
      }
    };

    if (process.env.NODE_ENV === "development") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, []);

  // تنظيف URL.createObjectURL عند إلغاء تحميل المكون أو إزالة الصورة
  useEffect(() => {
    return () => {
      if (transferImagePreview) {
        URL.revokeObjectURL(transferImagePreview);
      }
    };
  }, [transferImagePreview]);

  // تهيئة نموذج Moyasar عند اختيار طريقة الدفع بالبطاقة
  useEffect(() => {
    if (paymentMethod === "card" && paymentAmount > 0) {
      // مسح النموذج السابق إذا كان موجوداً
      const formElement = document.querySelector(".mysr-form");
      if (formElement) {
        formElement.innerHTML = "";
      }

      try {
        // الحصول على معرف المستخدم من localStorage
        const userToken = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const userId = userData ? JSON.parse(userData).id : null;
        const customerId = userId ? `user_${userId}` : `guest_${Date.now()}`;

        console.log("🔍 Debug metadata:", {
          userData,
          userId,
          customerId,
          metadata: {
            customerId: customerId,
            source: "wallet_recharge",
            amount: paymentAmount,
            timestamp: new Date().toISOString(),
          },
        });

        Moyasar.init({
          element: ".mysr-form",
          theme: "light",
          language: "ar",
          error: {
            message: "خطأ في معالجة الدفع",
          },
          success: {
            message: "تمت عملية الدفع بنجاح!",
          },
          metadata: {
            customerId: customerId,
            source: "wallet_recharge",
            amount: paymentAmount,
            timestamp: new Date().toISOString(),
          },
          amount: paymentAmount * 100, // المبلغ بالهللة (SAR * 100)
          currency: "SAR",
          description: `شحن المحفظة - ${paymentAmount} ريال سعودي`,
          publishable_api_key:
            "pk_live_yvEP28tLV8sHaWY1WTKuD9Fs47WX9qpVsE1gbnAF",
          callback_url: `${window.location.origin}/`,
          methods: ["creditcard"],
          on_completed: async (payment: any) => {
            // تحقق من أن هذه الدفعة لم تتم معالجتها مسبقاً
            if (processedPayments.has(payment.id)) {
              console.log("Payment already processed:", payment.id);
              return;
            }

            setProcessedPayments((prev) => {
              const newSet = new Set(prev);
              newSet.add(payment.id);
              return newSet;
            });
            setIsSubmitting(true);
            setError("");

            try {
              const userToken = localStorage.getItem("token");
              if (!userToken) {
                setError("يرجى تسجيل الدخول أولاً");
                setIsSubmitting(false);
                return;
              }

              const response = await fetch(
                "https://www.marasil.site/api/wallet/rechargeWallet",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                  },
                  body: JSON.stringify({
                    id: payment.id,
                    amount: paymentAmount,
                    description: `شحن المحفظة بمبلغ ${paymentAmount} ريال`,
                  }),
                }
              );

              const result = await response.json();
              if (!response.ok) {
                setError(
                  result.error || result.message || "فشل في معالجة الدفع"
                );
              } else {
                setSuccess(result.message || "تمت عملية الدفع بنجاح!");
                if (result.balance !== undefined) {
                  onBalanceUpdate(result.balance);
                } else {
                  onBalanceUpdate(balance + paymentAmount);
                }
                setTimeout(() => {
                  handleClose();
                  router.push("/");
                }, 2000);
              }
            } catch (error: any) {
              console.error("خطأ في الدفع:", error);
              setError(error.message || "حدث خطأ أثناء معالجة الدفع");
            } finally {
              setIsSubmitting(false);
            }
          },
          on_failed: (error: any) => {
            console.error("فشل في الدفع:", error);

            let errorMessage = "فشل في معالجة الدفع";
            let originalErrorMessage = "";

            if (error && error.message) {
              originalErrorMessage = error.message;
              // ترجمة رسائل الخطأ الشائعة من ميسر
              switch (error.message) {
                case "INSUFFICIENT_FUNDS":
                case "insufficient_funds":
                  errorMessage = "رصيد البطاقة غير كافي";
                  break;
                case "CARD_DECLINED":
                case "card_declined":
                  errorMessage = "تم رفض البطاقة";
                  break;
                case "INVALID_CARD":
                case "invalid_card":
                  errorMessage = "بيانات البطاقة غير صحيحة";
                  break;
                case "EXPIRED_CARD":
                case "expired_card":
                  errorMessage = "البطاقة منتهية الصلاحية";
                  break;
                case "TRANSACTION_TIMEOUT":
                case "transaction_timeout":
                  errorMessage = "انتهت مهلة العملية";
                  break;
                default:
                  errorMessage = error.message || "فشل في معالجة الدفع";
              }
            }

            setError(errorMessage);
            setIsSubmitting(true);

            // إرسال طلب للباك إند لحفظ المعاملة الفاشلة من ميسر
            const userToken = localStorage.getItem("token");
            if (userToken) {
              console.log(
                "📤 Sending failed Moyasar payment to backend for logging"
              );
              fetch("https://www.marasil.site/api/wallet/rechargeWallet", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                  id: error.id || `moyasar-failed-${Date.now()}`,
                  amount: paymentAmount,
                  status: "failed",
                  error_message:
                    originalErrorMessage || "Moyasar payment failed",
                  source: "moyasar_callback",
                  description: `محاولة شحن المحفظة فاشلة عبر ميسر - ${paymentAmount} ريال - السبب: ${errorMessage}`,
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    console.warn(
                      "Failed to log Moyasar failed payment:",
                      response.status
                    );
                  } else {
                    console.log(
                      "✅ Moyasar failed payment logged successfully"
                    );
                  }
                  return response.json().catch(() => ({}));
                })
                .catch((logError) => {
                  console.error(
                    "Error logging Moyasar failed payment:",
                    logError
                  );
                })
                .finally(() => {
                  setIsSubmitting(false);
                });
            } else {
              setIsSubmitting(false);
            }
          },
        });
      } catch (error) {
        console.error("خطأ في تهيئة ميسر:", error);
        setError("خطأ في تهيئة نموذج الدفع");
      }
    }
  }, [paymentMethod, paymentAmount, balance, onBalanceUpdate, router]);

  // معالجة Callback URL و postMessage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const message = params.get("message");
    const token = params.get("id");

    // تسجيل معاملات URL للتتبع
    if (status || message || token) {
      console.log("🔍 URL Parameters:", { status, message, token });
    }

    // معالجة حالات نجاح الدفع
    if ((status === "paid" || message === "APPROVED") && token) {
      console.log("✅ Payment Success detected via URL");
      // تحقق من أن هذه الدفعة لم تتم معالجتها مسبقاً
      if (processedPayments.has(token)) {
        console.log("Payment already processed via URL:", token);
        return;
      }

      if (window.opener) {
        window.opener.postMessage(
          { type: "payment_success", token, amount: paymentAmount },
          window.location.origin
        );
        setTimeout(() => window.close(), 1000);
      } else {
        setProcessedPayments((prev) => {
          const newSet = new Set(prev);
          newSet.add(token);
          return newSet;
        });
        setIsSubmitting(true);
        fetch("https://www.marasil.site/api/wallet/rechargeWallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {}),
          },
          body: JSON.stringify({
            id: token,
            amount: paymentAmount,
            description: `شحن المحفظة بمبلغ ${paymentAmount} ريال`,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                throw new Error(data.message || "فشل في معالجة الدفع");
              });
            }
            return response.json();
          })
          .then((result) => {
            setSuccess(result.message || "تمت عملية الدفع بنجاح!");
            if (result.balance !== undefined) {
              onBalanceUpdate(result.balance);
            } else {
              onBalanceUpdate(balance + paymentAmount);
            }
            setTimeout(() => {
              handleClose();
              router.push("/");
            }, 2000);
          })
          .catch((error) => {
            setError(error.message || "حدث خطأ أثناء معالجة الدفع");
          })
          .finally(() => {
            setIsSubmitting(false);
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          });
      }
    }

    // معالجة حالات فشل الدفع
    else if (status === "failed" && token) {
      console.log("❌ Payment Failed detected via URL");

      // تحقق من أن هذه الدفعة الفاشلة لم تتم معالجتها مسبقاً
      if (processedPayments.has(token)) {
        console.log("Failed payment already processed via URL:", token);
        return;
      }

      setProcessedPayments((prev) => {
        const newSet = new Set(prev);
        newSet.add(token);
        return newSet;
      });

      let errorMessage = "فشل في معالجة الدفع";
      let originalMessage = "";

      // ترجمة رسائل الخطأ الشائعة
      if (message) {
        const decodedMessage = decodeURIComponent(message.replace(/\+/g, " "));
        originalMessage = decodedMessage;
        console.log("🔍 Decoded error message:", decodedMessage);
        switch (decodedMessage) {
          case "INSUFFICIENT FUNDS":
            errorMessage = "رصيد البطاقة غير كافي";
            break;
          case "CARD DECLINED":
            errorMessage = "تم رفض البطاقة";
            break;
          case "INVALID CARD":
            errorMessage = "بيانات البطاقة غير صحيحة";
            break;
          case "EXPIRED CARD":
            errorMessage = "البطاقة منتهية الصلاحية";
            break;
          case "TRANSACTION TIMEOUT":
            errorMessage = "انتهت مهلة العملية";
            break;
          default:
            errorMessage = `فشل في الدفع: ${decodedMessage}`;
        }
      }

      console.log("🚨 Setting error message:", errorMessage);
      setError(errorMessage);
      setIsSubmitting(true);

      // إرسال طلب للباك إند لحفظ المعاملة الفاشلة
      const userToken = localStorage.getItem("token");
      if (userToken) {
        console.log("📤 Sending failed payment to backend for logging");
        fetch("https://www.marasil.site/api/wallet/rechargeWallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            id: token,
            amount: paymentAmount,
            status: "failed",
            error_message: originalMessage || "Payment failed",
            description: `محاولة شحن المحفظة فاشلة - ${paymentAmount} ريال - السبب: ${errorMessage}`,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              console.warn("Failed to log failed payment:", response.status);
            } else {
              console.log("✅ Failed payment logged successfully");
            }
            return response.json().catch(() => ({}));
          })
          .catch((error) => {
            console.error("Error logging failed payment:", error);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        setIsSubmitting(false);
      }

      // تنظيف URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (window.opener) {
        console.log("📤 Sending payment_failed message to parent window");
        window.opener.postMessage(
          { type: "payment_failed", error: errorMessage },
          window.location.origin
        );
        setTimeout(() => window.close(), 3000);
      }
    }
  }, [paymentAmount, balance, onBalanceUpdate, router, processedPayments]);

  // استماع لرسائل postMessage
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data.type === "payment_success") {
        const { token, amount } = event.data;

        // تحقق من أن هذه الدفعة لم تتم معالجتها مسبقاً
        if (processedPayments.has(token)) {
          console.log("Payment already processed via postMessage:", token);
          return;
        }

        if (isSubmitting) return;

        setProcessedPayments((prev) => {
          const newSet = new Set(prev);
          newSet.add(token);
          return newSet;
        });
        setIsSubmitting(true);

        fetch("https://www.marasil.site/api/wallet/rechargeWallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {}),
          },
          body: JSON.stringify({
            id: token,
            amount,
            description: `شحن المحفظة بمبلغ ${amount} ريال`,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => {
                throw new Error(data.message || "فشل في معالجة الدفع");
              });
            }
            return response.json();
          })
          .then((result) => {
            setSuccess(result.message || "تمت عملية الدفع بنجاح!");
            if (result.balance !== undefined) {
              onBalanceUpdate(result.balance);
            } else {
              onBalanceUpdate(balance + amount);
            }
            setTimeout(() => {
              handleClose();
              router.push("/");
            }, 2000);
          })
          .catch((error) => {
            setError(error.message || "حدث خطأ أثناء معالجة الدفع");
          })
          .finally(() => setIsSubmitting(false));
      } else if (event.data.type === "payment_failed") {
        setError(event.data.error || "فشل في معالجة الدفع");
        setIsSubmitting(false);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [balance, onBalanceUpdate, isSubmitting, router, processedPayments]);

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
    setSuccess("");
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount % 100 === 0) {
      setPaymentAmount(numAmount);
    } else {
      setPaymentAmount(0);
      setError("المبلغ يجب أن يكون مضاعفًا لـ 100 ريال سعودي");
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomAmount(value);
    setError("");
    setSuccess("");
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue % 100 === 0) {
      setPaymentAmount(numValue);
    } else if (value && numValue > 0) {
      setPaymentAmount(0);
      setError("المبلغ يجب أن يكون مضاعفًا لـ 100 ريال سعودي");
    } else {
      setPaymentAmount(0);
    }
    setSelectedAmount(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الملف يجب أن يكون أقل من 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("الملف يجب أن يكون صورة");
        return;
      }
      setTransferImage(file);
      setTransferImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    if (transferImagePreview) {
      URL.revokeObjectURL(transferImagePreview);
    }
    setTransferImage(null);
    setTransferImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleClose = () => {
    // تنظيف نموذج ميسر
    const formElement = document.querySelector(".mysr-form");
    if (formElement) {
      formElement.innerHTML = "";
    }

    setPaymentMethod("card");
    setSelectedAmount(null);
    setCustomAmount("");
    setPaymentAmount(0);
    setError("");
    setSuccess("");
    setTransferImage(null);
    setTransferImagePreview(null);
    setIsSubmitting(false);
    setProcessedPayments(new Set());
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setSuccess("");

    if (paymentAmount <= 0 || paymentAmount % 100 !== 0) {
      setError("يرجى إدخال مبلغ صالح (مضاعفات 100 ريال سعودي)");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "bank") {
        if (!transferImage) {
          setError("يرجى رفع صورة الإيصال");
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("amount", paymentAmount.toString());
        formData.append("transferImage", transferImage);
        const userToken = localStorage.getItem("token");

        const response = await fetch(
          "https://www.marasil.site/api/wallet/rechargeWalletbyBank",
          {
            method: "POST",
            headers: {
              ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
            },
            body: formData,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.error || result.message || "فشل في رفع إيصال التحويل"
          );
        }

        setSuccess(
          result.message ||
            "تم استلام إيصال التحويل بنجاح، سيتم مراجعته خلال 24 ساعة"
        );
        setTimeout(() => {
          handleClose();
          router.push("/");
        }, 2000);
        setIsSubmitting(false);
      }
      // لا حاجة لمعالجة الدفع بالبطاقة هنا، لأن Moyasar Payment Form يتولى ذلك
    } catch (err: any) {
      console.error("خطأ في الدفع:", err);
      setError(
        err.message || "حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-xl max-h-screen overflow-y-auto border-none py-10"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right text-xl mb-4 border-b border-gray-300 pb-2 flex items-center justify-between">
            <span className="mt-4">شحن المحفظة</span>
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-right block">اختر المبلغ</Label>
            <div className="grid grid-cols-5 gap-2">
              {["100", "200", "500", "1000", "5000"].map((val) => {
                const isSelected = selectedAmount === val;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className={`p-2 text-sm rounded transition-colors flex items-center justify-center v7-neu-btn max-h-10 ${
                      isSelected
                        ? "text-white bg-primary"
                        : "bg-blue-50 text-[#5791F4] hover:bg-blue-100"
                    }`}
                  >
                    {val}
                    <Image
                      alt="price"
                      src={isSelected ? RealWhite : RealBlue}
                      className="w-[20px]"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-right text-xs sm:text-sm">
              يجب أن يكون الرقم من مضاعفات الرقم SAR 100
            </p>
            <Input
              placeholder="مبلغ آخر (مضاعفات 100 ريال)"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="v7-neu-input-hollow text-gry"
              pattern="[0-9]*"
              type="text"
              inputMode="numeric"
              min="100"
            />
          </div>

          <div className="flex items-center gap-4">
            <div onClick={() => setPaymentMethod("bank")} className="w-full">
              <div
                className={`v7-neu-card h-[10rem] px-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                  paymentMethod === "bank"
                    ? "border border-blue-600 bg-blue-50"
                    : "v7-neu-card hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                    {paymentMethod === "bank" && (
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2 text-base sm:text-xl">
                    التحويل البنكي
                  </p>
                  <Image alt="bank" src={bankTransfer} width={50} height={50} />
                </div>
              </div>
            </div>
            <div onClick={() => setPaymentMethod("card")} className="w-full">
              <div
                className={`v7-neu-card h-[10rem] p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                  paymentMethod === "card"
                    ? "border border-blue-600 bg-blue-50"
                    : "v7-neu-card hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                    {paymentMethod === "card" && (
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-4 text-base sm:text-xl">
                    بطاقة الائتمان
                  </p>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Image
                      alt="creditCard"
                      src={creditCard1}
                      className="min-w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard2}
                      className="min-w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard3}
                      className="min-w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard4}
                      className="min-w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard5}
                      className="min-w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard6}
                      className="min-w-[2rem]"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === "card" && paymentAmount > 0 && (
            <div className="v7-neu-card space-y-4">
              <h3 className="text-right font-medium mb-4">معلومات الدفع</h3>
              <div className="text-center text-sm text-gray-600 mb-4">
                المبلغ: {paymentAmount} ريال سعودي
              </div>
              <div className="mysr-form min-h-[200px] flex items-center justify-center">
                {isSubmitting ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-sm text-gray-600">
                      جاري تحميل نموذج الدفع...
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    جاري تحميل نموذج الدفع...
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="space-y-4 v7-neu-card">
              <h2 className="sm:text-lg text-base font-bold text-right">
                إيصال التحويل البنكي
              </h2>
              <div className="flex flex-col gap-1 v7-neu-card p-4">
                <span className="text-sm sm:text-base">
                  اسم البنك: مصرف الراجحي
                </span>
                <span className="text-sm sm:text-base">
                  المستفيد: شركة مراسيل لخدمات الأعمال
                </span>
                <span className="text-sm sm:text-base">
                  رقم الحساب: 177608016234509
                </span>
                <span className="text-sm sm:text-base">
                  الايبان: SA8180000177608016234509
                </span>
                <span className="py-4 text-red-500 text-sm sm:text-base">
                  إذا كنت تستخدم بنك خارج المملكة العربية السعودية الرجاء شحن
                  المحفظة عن طريق البطاقة
                </span>
              </div>

              <p className="text-right sm:text-lg text-base font-bold pt-4 text-gray-600">
                قم برفع صورة إيصال التحويل البنكي
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                {transferImagePreview ? (
                  <div className="relative border rounded-lg p-4">
                    <img
                      src={transferImagePreview}
                      alt="إيصال التحويل"
                      className="max-h-48 mx-auto"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="text-gray-400" size={24} />
                    <p className="text-gray-500 text-sm">
                      انقر لرفع صورة الإيصال
                    </p>
                    <p className="text-gray-400 text-xs">الحجم الأقصى: 5MB</p>
                  </label>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm text-right flex items-center gap-1">
                <AlertCircle size={16} />
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm text-right flex items-center gap-1">
                <AlertCircle size={16} />
                {success}
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2" dir="rtl">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
            {paymentMethod === "bank" && (
              <Button
                type="submit"
                className="bg-primary text-white py-2 px-6 rounded w-full sm:w-auto flex items-center justify-center gap-2"
                disabled={isSubmitting || paymentAmount <= 0 || !transferImage}
              >
                {isSubmitting ? (
                  <>
                    <span>جاري المعالجة...</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <Image
                      alt="push"
                      src={RealWhite}
                      className="w-[20px] h-[20px]"
                    />
                    <span>{paymentAmount}</span>
                    ادفع
                  </>
                )}
              </Button>
            )}
          </DialogFooter>

          {/* معلومات التطوير */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
              <p className="font-bold mb-2">🛠️ معلومات التطوير:</p>
              <p>• اضغط Ctrl+Shift+T لاختبار سيناريوهات الدفع</p>
              <p>• تحقق من Console للتتبع المفصل</p>
              <p>• المدفوعات المعالجة: {processedPayments.size}</p>
              {processedPayments.size > 0 && (
                <p>• آخر معاملة: {Array.from(processedPayments).pop()}</p>
              )}
              <p>• حالة الإرسال: {isSubmitting ? "جاري المعالجة" : "متوقف"}</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
