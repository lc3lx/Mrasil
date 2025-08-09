"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useRechargeWalletMutation,
  useRechargeWalletByBankMutation,
} from "@/app/api/walletApi";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import bankTransfer from "../../../public/bankTransfer .png";
import creditCard1 from "../../../public/creditCard1.png";
import creditCard2 from "../../../public/creditCard2.png";
import creditCard3 from "../../../public/creditCard3.png";
import creditCard4 from "../../../public/creditCard4.png";
import creditCard5 from "../../../public/creditCard5.png";
import creditCard6 from "../../../public/creditCard6.png";
import Head from "next/head";
import Script from "next/script";
interface StatItem {
  label: string;
  value: React.ReactNode;
  progress?: number;
  trend?: "up" | "down";
}
declare global {
  interface Window {
    Moyasar?: any;
  }
}
interface V7StatsWalletProps {
  isOpen,
  onClose,
  theme?: "light" | "dark";
}
export default function V7Wallet({
      theme = "light",
        isOpen,
        onClose,

       
}: V7StatsWalletProps) {

       const handleClose = () => {
    onClose(false);
  };

  // Credit card form fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
const [select , setSelect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
// Bank transfer form fields
  const [paymentMethod, setPaymentMethod] = useState(null); // "card" أو "bank"
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transferImage, setTransferImage] = useState(null);
  const [transferImagePreview, setTransferImagePreview] = useState(null);
  const [isMoyasarLoaded, setIsMoyasarLoaded] = useState(false);

  // NEW

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  try {
    const token = "pk_live_3p2q5Kj7WiDPJZ2kYRSNc16SFQ47C6hfAvkKLkCc"; 
const userToken = localStorage.getItem("token");

    const res = await fetch("https://backend-marasil.onrender.com/api/wallet/rechargeWallet", {
      method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${userToken}`,
  },
    body: JSON.stringify({ token, amount: 10000 }),

    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "فشل في الدفع");
    }

    if (!data.transaction_url) {
      throw new Error("الرابط غير موجود");
    }

    window.location.href = data.transaction_url;

  } catch (err: any) {
    setError(err.message || "خطأ غير معروف");
  } finally {
    setIsSubmitting(false);
  }
};



  // القديم
  // عند اختيار مبلغ
  const handleAmountSelect = (val) => {
    setAmount(Number(val));
    setCustomAmount("");
    setSelect(true);
  };
  // مبلغ مخصص
  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    // فقط أرقام وصفر أو أكثر
    if (/^\d*$/.test(val)) {
      setCustomAmount(val);
      setAmount(Number(val));
    }
  };

  // رفع صورة الإيصال
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTransferImage(file);
      setTransferImagePreview(URL.createObjectURL(file));
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

  const isDarkMode = theme === "dark";
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleClose} >
        <DialogContent className=" border-none max-w-3xl overflow-y-auto  max-h-screen  scroll  "  style={{border:"none"}}  >
          <DialogHeader>
            <DialogTitle className="text-[#4A7ED0] w-full mt-4  text-right sm:text-2xl text-sm  border-b border-[#8888] pb-4  ">
              إختر طريقة الدفع
            </DialogTitle>
          </DialogHeader>
          <form id="moyasar-token-form" onSubmit={handleSubmit} className="  space-y-6 ">
            <input
              type="hidden"
              name="publishable_api_key"
              value="pk_live_3p2q5Kj7WiDPJZ2kYRSNc16SFQ47C6hfAvkKLkCc"
            />
            <input type="hidden" name="save_only" value="true" />
            <div
              className={`bg-blue-50 p-4 rounded-lg text-xs sm:text-sm text-right ${
                isDarkMode ? "bg-blue-900/20 text-blue-200" : ""
              }`}
            >
              <p>
                باستخدام بطاقة الائتمان ، سيتم إضافة القيمة تلقائياً ؛ قد تستغرق
                معالجة التحويل المصرفي 24 ساعة
              </p>
            </div>
            <div className=" flex flex-col gap-6">
              <div className="  grid grid-cols-5 gap-2 ">
                {["100", "500", "1000", "2000", "5000"].map((val) => {
const isSelected = selectedAmount === val;
                    return(
                  <button
                    key={val}
                    onClick={() => (handleAmountSelect(val), setSelectedAmount(val))}
                    className={`v7-neu-card  max-h-6  text-xs  sm:text-sm  flex items-center justify-center transition-all   bg-blue-600 v7-neu-button-flat
                                  ${isSelected && "!bg-[#294D8B] !text-white" }
                                      
                                      `}
                  >
                    <span className="ml-1">﷼</span> {val}
                  </button>
                    )
})}
              </div>

              <div className="flex items-center gap-4">
                <p className="text-right text-xs sm:text-sm">
                  يجب أن يكون الرقم من مضاعفات الرقم SAR 100
                </p>
                <div className="flex-1">
                  <Input
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="مبلغ آخر"
                    className={`text-right "v7-neu-input  text-gry focus:ring-0 focus:border-none hover:border-none hover:ring-0`}
                  />
                </div>
              </div>
            </div>
            <div className=" flex items-center gap-4  ">
                                <div onClick={() => setPaymentMethod("bank")}
                        className=" w-full " >
              <div className={`v7-neu-card h-[10rem] px-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                paymentMethod === "bank"
                    ? isDarkMode
                      ?  "border border-blue-500 bg-blue-900/20"
                      : "border border-blue-600 bg-blue-50"
                    : isDarkMode
                    ? "border-dark-border bg-dark-card hover:bg-dark-hover"
                    : "v7-neu-card hover:shadow-md"
                }`}>
                    <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                  {paymentMethod === "bank" && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-2 text-base sm:text-xl">التحويل البنكي</p>
                  <div className="flex justify-center">
                        <Image alt="bank" src={bankTransfer} width={50} height={50}/>
                  </div>
                </div>
              </div>
              </div>
                                <div onClick={() => setPaymentMethod("card")}
                        
                  className=" w-full   ">
              <div className={`v7-neu-card h-[10rem] p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                paymentMethod === "card"
                    ? isDarkMode
                      ?  "border border-blue-500 bg-blue-900/20"
                      : "border border-blue-600 bg-blue-50"
                    : isDarkMode
                    ? "border-dark-border bg-dark-card hover:bg-dark-hover"
                    : "v7-neu-card hover:shadow-md"
                }`}>
                    <div className="flex items-center justify-center mb-3">
                  <div className="w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center">
                  {paymentMethod === "card" && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-medium mb-4 text-base sm:text-xl "> بطاقة الائتمان</p>
                                   <div className=" grid grid-cols-3 gap-4 items-center ">
                    <Image
                      alt="creditCard"
                      src={creditCard1}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard2}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard3}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard4}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard5}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                    <Image
                      alt="creditCard"
                      src={creditCard6}
                      className=" w-[1.7rem]"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
              </div>

            </div>




            {/* Bank Transfer Form */}
            {paymentMethod === "bank" && (
              <div className="space-y-4" >
                <h2 className="sm:text-lg text-base font-bold text-right">
                  إيصال التحويل البنكي
                </h2>
                <div className="  flex flex-col gap-1 v7-neu-card">
                <span>اسم البنك : مصرف الراجحي </span>
                <span>المستفيد : شركة مراسيل لخدمات الأعمال</span>
                <span>رقم الحساب : 177608016234509</span>
                <span>الايبان : SA8180000177608016234509</span>
                <span className=" py-4  text-red-500">إذا كنت تستخدم بنك خارج المملكة العربية السعودية الرجاء شحن المحفظة عن طريق البطاقة</span>
                </div>



                <p className="text-right sm:text-lg text-base font-bold pt-8 text-gray-600">
                  قم برفع صورة إيصال التحويل البنكي
                </p>

                <div className="flex justify-center">
                  <label
                    className={`cursor-pointer border-2 border-dashed rounded-lg sm:p-8 p-2 text-center transition-all hover:border-blue-500 ${
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
                          className="sm:w-22 sm:h-22 w-16 h-16 object-cover rounded-lg mx-auto"
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
          
            {/* <PaymentForm amount={2500} description="طلب رقم #302" /> */}
            {/* // <MoyasarLoader /> */}
            <div className="flex justify-center flex-col  items-center text-center  gap-4 mt-16  ">
              {error && <p className="text-red-600">{error}</p>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`px-16 py-6 text-lg mt-8 ${
                  isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
                  : "v7-neu-button disabled:opacity-50"
                }`}
                >
                {isLoading ? "جاري المعالجة..." : "استمرار"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


    </div>
  )
}
