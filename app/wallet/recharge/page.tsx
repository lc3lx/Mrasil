"use client";

import type React from "react";

import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import V7Layout from "@/components/v7/v7-layout";
import {
  useRechargeWalletMutation,
  useRechargeWalletByBankMutation,
} from "@/app/api/walletApi";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
// import PaymentForm from "@/app/parcels/components/PaymentForm"
// import MoyasarLoader from "@/app/parcels/components/MoyasarScriptLoader";

export default function WalletRechargePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [amount, setAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | null>(
    null
  );
  const [promoCode, setPromoCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  // API mutations
  const [rechargeWallet] = useRechargeWalletMutation();
  const [rechargeWalletByBank] = useRechargeWalletByBankMutation();

  // Credit card form fields
  const [cardName, setCardName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [cardMonth, setCardMonth] = useState<string>("");
  const [cardYear, setCardYear] = useState<string>("");

  // Bank transfer form fields
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [transferImagePreview, setTransferImagePreview] = useState<string>("");

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      if (value) setAmount("custom");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (/^\d*$/.test(value)) {
      // Format as XXXX XXXX XXXX XXXX
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setCardNumber(formatted);
    }
  };

  const handleCardNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanNumber = pastedText.replace(/\D/g, "");
    if (/^\d{13,19}$/.test(cleanNumber)) {
      const formatted = cleanNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setCardNumber(formatted);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setCardCvc(value);
    }
  };

  const handleCardMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      const month = parseInt(value);
      if (month >= 1 && month <= 12) {
        setCardMonth(value);
      }
    }
  };

  const handleCardYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setCardYear(value);
    }
  };

  function MoyasarScriptLoader() {
    useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://cdn.moyasar.com/mpf/1.8.4/moyasar.js";
      script.async = true;
      script.onload = () => {
        console.log("Moyasar script loaded ✅");
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, []);

    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTransferImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTransferImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!paymentMethod) return;

    const finalAmount = customAmount || amount;
    if (!finalAmount) return;

    setIsLoading(true);

    try {
      if (paymentMethod === "card") {
        // Credit card payment
        const response = await rechargeWallet({
          amount: parseInt(finalAmount),
          name: cardName,
          number: cardNumber.replace(/\s/g, ""),
          cvc: cardCvc,
          month: cardMonth,
          year: cardYear,
        }).unwrap();

        setModalData(response.payment);
        setShowSuccessModal(true);
        sessionStorage.setItem(
          "walletRechargeResponse",
          JSON.stringify(response.payment)
        );
        return;
      } else if (paymentMethod === "bank" && transferImage) {
        // Bank transfer payment
        const response = await rechargeWalletByBank({
          amount: finalAmount,
          bankreceipt: transferImage,
        }).unwrap();

        setModalData(response);
        setShowSuccessModal(true);
        sessionStorage.setItem(
          "walletRechargeResponse",
          JSON.stringify(response)
        );
        return;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في الدفع",
        description: error?.data?.message || "حدث خطأ أثناء معالجة الدفع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    router.push("/payments");
  };

  const isDarkMode = theme === "dark";

  return (
    <V7Layout>
      {/* Success Modal */}
      <AlertDialog open={showSuccessModal}>
        <AlertDialogContent className="text-center max-w-lg w-full p-10 rounded-2xl shadow-2xl bg-gray-50 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-green-700">
            تمت العملية بنجاح
          </h2>
          {modalData && (
            <div className="space-y-3 text-right mx-auto max-w-md">
              {modalData.amount_format && (
                <div>
                  <span className="font-semibold">المبلغ:</span>{" "}
                  <span className="font-normal">{modalData.amount_format}</span>
                </div>
              )}
              {modalData.currency && (
                <div>
                  <span className="font-semibold">العملة:</span>{" "}
                  <span className="font-normal">{modalData.currency}</span>
                </div>
              )}
              {modalData.status && (
                <div>
                  <span className="font-semibold">الحالة:</span>{" "}
                  <span className="font-normal">{modalData.status}</span>
                </div>
              )}
              {modalData.transaction_url && (
                <div>
                  <span className="font-semibold">رابط العملية:</span>{" "}
                  <a
                    href={modalData.transaction_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all font-normal"
                  >
                    {modalData.transaction_url}
                  </a>
                </div>
              )}
              {modalData.company && (
                <div>
                  <span className="font-semibold">الشركة:</span>{" "}
                  <span className="font-normal">{modalData.company}</span>
                </div>
              )}
              {modalData.name && (
                <div>
                  <span className="font-semibold">الاسم:</span>{" "}
                  <span className="font-normal">{modalData.name}</span>
                </div>
              )}
              {/* Source details */}
              {modalData.source && (
                <div className="mt-6 p-4 rounded-lg bg-gray-100 border border-gray-200">
                  <div className="font-bold mb-2 text-base text-gray-700">
                    تفاصيل البطاقة
                  </div>
                  {modalData.source.type && (
                    <div>
                      <span className="font-semibold">نوع البطاقة:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.type}
                      </span>
                    </div>
                  )}
                  {modalData.source.company && (
                    <div>
                      <span className="font-semibold">الشركة:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.company}
                      </span>
                    </div>
                  )}
                  {modalData.source.name && (
                    <div>
                      <span className="font-semibold">الاسم:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.name}
                      </span>
                    </div>
                  )}
                  {modalData.source.number && (
                    <div>
                      <span className="font-semibold">رقم البطاقة:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.number}
                      </span>
                    </div>
                  )}

                  {modalData.source.issuer_name && (
                    <div>
                      <span className="font-semibold">اسم البنك المصدر:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.issuer_name}
                      </span>
                    </div>
                  )}
                  {modalData.source.issuer_country && (
                    <div>
                      <span className="font-semibold">بلد البنك المصدر:</span>{" "}
                      <span className="font-normal">
                        {modalData.source.issuer_country}
                      </span>
                    </div>
                  )}
                  {modalData.source.issuer_card_type && (
                    <div>
                      <span className="font-semibold">
                        نوع البطاقة المصدرة:
                      </span>{" "}
                      <span className="font-normal">
                        {modalData.source.issuer_card_type}
                      </span>
                    </div>
                  )}
                  {modalData.source.issuer_card_category && (
                    <div>
                      <span className="font-semibold">
                        فئة البطاقة المصدرة:
                      </span>{" "}
                      <span className="font-normal">
                        {modalData.source.issuer_card_category}
                      </span>
                    </div>
                  )}
                  {modalData.source.transaction_url && (
                    <div>
                      <span className="font-semibold">رابط العملية:</span>{" "}
                      <a
                        href={modalData.source.transaction_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all font-normal"
                      >
                        {modalData.source.transaction_url}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <AlertDialogAction
              onClick={handleModalOk}
              className="px-10 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              موافق
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <div className="rounded-xl shadow-md v7-neu-card p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <button
            onClick={handleBack}
            className={`p-2 rounded-full v7-neu-button-sm`}
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">إختر طريقة الدفع</h1>
        </div>

        <div className="space-y-8">
          <div
            className={`bg-blue-50 p-4 rounded-lg text-sm text-right ${
              isDarkMode ? "bg-blue-900/20 text-blue-200" : ""
            }`}
          >
            <p>
              باستخدام بطاقة الائتمان ، سيتم إضافة القيمة تلقائياً ؛ قد تستغرق
              معالجة التحويل المصرفي 24 ساعة
            </p>
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
              <p className="text-right text-sm">
                يجب أن يكون الرقم من مضاعفات الرقم SAR 100
              </p>
              <div className="flex-1">
                <Input
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="مبلغ آخر"
                  className={`text-right ${
                    isDarkMode
                      ? "bg-dark-elevated border-dark-border"
                      : "v7-neu-input"
                  }`}
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
                  {paymentMethod === "bank" && (
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  )}
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
                          className={`w-6 h-6 border-2 ${
                            isDarkMode ? "border-blue-400" : "border-blue-600"
                          }`}
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
                  {paymentMethod === "card" && (
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  )}
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

          {/* Bank Transfer Form */}
          {paymentMethod === "bank" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-right">
                إيصال التحويل البنكي
              </h2>
              <p className="text-right text-sm text-gray-600">
                قم برفع صورة إيصال التحويل البنكي
              </p>

              <div className="flex justify-center">
                <label
                  className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all hover:border-blue-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-dark-card"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {transferImagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={transferImagePreview}
                        alt="Transfer receipt"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-green-600">
                        تم رفع الصورة بنجاح
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm">اضغط لرفع صورة الإيصال</p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF حتى 5MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Credit Card Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-right">معلومات البطاقة</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-right text-sm font-medium mb-2">
                    اسم حامل البطاقة
                  </label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="اسم حامل البطاقة"
                    className={`text-right ${
                      isDarkMode
                        ? "bg-dark-elevated border-dark-border"
                        : "v7-neu-input"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-right text-sm font-medium mb-2">
                    رقم البطاقة
                  </label>
                  <Input
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onPaste={handleCardNumberPaste}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    dir="ltr"
                    inputMode="numeric"
                    className={`text-right ${
                      isDarkMode
                        ? "bg-dark-elevated border-dark-border"
                        : "v7-neu-input"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-right text-sm font-medium mb-2">
                      CVC
                    </label>
                    <Input
                      value={cardCvc}
                      onChange={handleCardCvcChange}
                      placeholder="123"
                      maxLength={3}
                      dir="ltr"
                      inputMode="numeric"
                      className={`text-right ${
                        isDarkMode
                          ? "bg-dark-elevated border-dark-border"
                          : "v7-neu-input"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-right text-sm font-medium mb-2">
                      الشهر
                    </label>
                    <Input
                      value={cardMonth}
                      onChange={handleCardMonthChange}
                      placeholder="12"
                      maxLength={2}
                      dir="ltr"
                      inputMode="numeric"
                      className={`text-right ${
                        isDarkMode
                          ? "bg-dark-elevated border-dark-border"
                          : "v7-neu-input"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-right text-sm font-medium mb-2">
                      السنة
                    </label>
                    <Input
                      value={cardYear}
                      onChange={handleCardYearChange}
                      placeholder="25"
                      maxLength={2}
                      dir="ltr"
                      inputMode="numeric"
                      className={`text-right ${
                        isDarkMode
                          ? "bg-dark-elevated border-dark-border"
                          : "v7-neu-input"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* <PaymentForm amount={2500} description="طلب رقم #302" /> */}
          <h2>الدفع الإلكتروني</h2>
          {/* // <MoyasarLoader /> */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleContinue}
              disabled={
                !paymentMethod ||
                (!amount && !customAmount) ||
                (paymentMethod === "bank" && !transferImage) ||
                (paymentMethod === "card" &&
                  (!cardName ||
                    !cardNumber ||
                    !cardCvc ||
                    !cardMonth ||
                    !cardYear)) ||
                isLoading
              }
              className={`px-16 py-6 text-lg ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
                  : "v7-neu-button disabled:opacity-50"
              }`}
            >
              {isLoading ? "جاري المعالجة..." : "استمرار"}
            </Button>
          </div>
        </div>
      </div>
    </V7Layout>
  );
}
