"use client";

"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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
import realBlue from "../../../public/real-blue.png";
import realWhite from "../../../public/real-white.png";

// Global type declaration for Moyasar
interface MoyasarPaymentForm {
  init: (config: {
    element: HTMLElement | string;
    amount: number;
    currency: string;
    description: string;
    publishable_api_key: string;
    callback_url: string;
    methods: string[];
    on_completed: (payment: any) => void;
    on_failed: (error: any) => void;
    style?: {
      base?: {
        color?: string;
        fontFamily?: string;
        fontSmoothing?: string;
        fontSize?: string;
        '::placeholder'?: {
          color?: string;
        };
      };
      invalid?: {
        color?: string;
        iconColor?: string;
      };
    };
  }) => void;
}

declare global {
  interface Window {
    Moyasar?: {
      init: MoyasarPaymentForm['init'];
    };
  }
}

interface V7WalletProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
  theme?: "light" | "dark";
}

export default function V7Wallet({
  theme = "light",
  isOpen,
  onClose,
  balance,
  onBalanceUpdate,
}: V7WalletProps) {
  const handleClose = () => {
    onClose();
  };

  // Credit card form fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [select, setSelect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  // Bank transfer form fields
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [transferImagePreview, setTransferImagePreview] = useState<string | null>(null);

  const [isMoyasarReady, setIsMoyasarReady] = useState(false);
  const moyasarFormRef = useRef<HTMLDivElement>(null);
  


  // NEW

  const [rechargeWallet, { isLoading: isRecharging }] = useRechargeWalletMutation();
  const [rechargeByBank, { isLoading: isBankTransferring }] = useRechargeWalletByBankMutation();

  // Load Moyasar script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.moyasar.com/mpf/1.13.0/moyasar.js';
    script.async = true;
    script.onload = () => {
      setIsMoyasarReady(true);
      console.log('Moyasar script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Moyasar script');
      setError('فشل تحميل نظام الدفع. يرجى تحديث الصفحة والمحاولة مرة أخرى');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const preparePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setError('الرجاء إدخال مبلغ صالح');
      return;
    }

    if (!isMoyasarReady) {
      setError('جاري تحميل نظام الدفع، يرجى الانتظار...');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Call your backend to prepare payment and get the amount in halalas
      const response = await fetch('/api/wallet/prepare-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paymentAmount })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في تحضير عملية الدفع');
      }

      // Clear previous form if any
      if (moyasarFormRef.current) {
        moyasarFormRef.current.innerHTML = '';
      }

      // Initialize Moyasar payment form
      if (window.Moyasar && moyasarFormRef.current) {
        window.Moyasar.init({
          element: moyasarFormRef.current,
          amount: data.amountInHalalas,
          currency: 'SAR',
          description: `شحن المحفظة (رصيدك بعد الخصم ${data.netAmount} ريال)`,
          publishable_api_key: 'pk_live_3p2q5Kj7WiDPJZ2kYRSNc16SFQ47C6hfAvkKLkCc',
          callback_url: `${window.location.origin}/payment/success`,
          methods: ['creditcard', 'mada'],
          on_completed: (payment: any) => {
            toast({
              title: "تمت العملية بنجاح",
              description: `تم شحن رصيدك بنجاح بمبلغ ${paymentAmount} ريال`,
              variant: "default",
            });
            onClose();
            // Optional: Redirect to success page or refresh wallet balance
            window.location.href = `${window.location.origin}/payment/success?amount=${paymentAmount}`;
          },
          on_failed: (error: any) => {
            setError('فشلت عملية الدفع. الرجاء التحقق من البيانات والمحاولة مرة أخرى');
            console.error('Payment failed:', error);
          },
          // Add more customization as needed
          style: {
            base: {
              color: '#32325d',
              fontFamily: 'Arial, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        });
      } else {
        throw new Error('نظام الدفع غير متوفر حالياً. يرجى المحاولة لاحقاً');
      }
    } catch (err: any) {
      console.error('Payment preparation error:', err);
      setError(err.message || 'حدث خطأ أثناء تحضير عملية الدفع');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      await preparePayment();
    } else if (paymentMethod === 'bank') {
      // Handle bank transfer submission
      if (!transferImage) {
        setError('الرجاء رفع صورة إيصال التحويل');
        return;
      }
      
      setIsSubmitting(true);
      setError('');
      
      try {
        const formData = new FormData();
        formData.append('amount', paymentAmount.toString());
        if (transferImage) {
          formData.append('transferImage', transferImage);
        }
        
        const response = await rechargeByBank(formData).unwrap();
        
        toast({
          title: "تم استلام طلبك",
          description: "سيتم مراجعة طلبك وتفعيل الرصيد خلال 24 ساعة",
          variant: "default",
        });
        
        onClose();
      } catch (err: any) {
        console.error('Bank transfer error:', err);
        setError(err.data?.message || 'حدث خطأ أثناء إرسال طلبك');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // القديم
  // عند اختيار مبلغ
  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) {
      setPaymentAmount(numAmount);
    }
  };

  // Alias for handleAmountClick for backward compatibility
  const handleAmountSelect = handleAmountClick;
  // مبلغ مخصص
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPaymentAmount(numValue);
    } else {
      setPaymentAmount(0);
    }
    setSelectedAmount("");
  };

  // Handle image upload for bank transfer
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className=" border-none max-w-3xl overflow-y-auto  max-h-screen  scroll"
          style={{ border: "none" , direction:"ltr"}}
        >
          <DialogHeader>
            <DialogTitle className="text-[#4A7ED0] w-full mt-4 text-right sm:text-2xl text-sm border-b border-[#8888] pb-4">
              شحن المحفظة
            </DialogTitle>
          </DialogHeader>
          <form
            id="moyasar-token-form"
            onSubmit={handleSubmit}
            className="  space-y-6 "
            dir="rtl"
          >
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
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <label className="block text-right text-sm font-medium text-gray-700">
                  المبلغ (ريال):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded-md text-right"
                  min="1"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {["100", "500", "1000", "2000", "5000"].map((val) => {
                  const isSelected = selectedAmount === val;
                  return (
                    <button
                    type="button"
                      key={val}
                      onClick={() => (
                        handleAmountSelect(val), setSelectedAmount(val)
                      )}
                      className={`v7-neu-card  max-h-6  text-xs  sm:text-sm  flex items-center justify-center transition-all   bg-blue-600 v7-neu-button-flat
                                  ${isSelected && "!bg-[#294D8B] !text-white"}
                                      
                                      `}
                    >
                      {val}
                      {isSelected ? (
                        <Image
                          alt="real"
                          src={realWhite}
                          width={10}
                          height={10}
                          className=" w-[1.5rem]"
                        />
                      ) : (
                        <Image
                          alt="real"
                          src={realBlue}
                          width={10}
                          height={10}
                          className="w-[1.5rem]"
                        />
                      )}
                    </button>
                  );
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
              <div
                onClick={() => setPaymentMethod("bank")}
                className=" w-full "
              >
                <div
                  className={`v7-neu-card h-[10rem] px-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                    paymentMethod === "bank"
                      ? isDarkMode
                        ? "border border-blue-500 bg-blue-900/20"
                        : "border border-blue-600 bg-blue-50"
                      : isDarkMode
                      ? "border-dark-border bg-dark-card hover:bg-dark-hover"
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
                    <div className="flex justify-center">
                      <Image
                        alt="bank"
                        src={bankTransfer}
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setPaymentMethod("card")}
                className=" w-full   "
              >
                <div
                  className={`v7-neu-card h-[10rem] p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                    paymentMethod === "card"
                      ? isDarkMode
                        ? "border border-blue-500 bg-blue-900/20"
                        : "border border-blue-600 bg-blue-50"
                      : isDarkMode
                      ? "border-dark-border bg-dark-card hover:bg-dark-hover"
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
                    <p className="font-medium mb-4 text-base sm:text-xl ">
                      {" "}
                      بطاقة الائتمان
                    </p>
                    <div className=" grid grid-cols-3 gap-4 items-center ">
                      <Image
                        alt="creditCard"
                        src={creditCard1}
                        className=" min-w-[1.7rem]"
                        width={20}
                        height={20}
                      />
                      <Image
                        alt="creditCard"
                        src={creditCard2}
                        className=" min-w-[1.7rem]"
                        width={20}
                        height={20}
                      />
                      <Image
                        alt="creditCard"
                        src={creditCard3}
                        className=" min-w-[1.7rem]"
                        width={20}
                        height={20}
                      />
                      <Image
                        alt="creditCard"
                        src={creditCard4}
                        className=" min-w-[1.7rem]"
                        width={20}
                        height={20}
                      />
                      <Image
                        alt="creditCard"
                        src={creditCard5}
                        className=" min-w-[1.7rem]"
                        width={20}
                        height={20}
                      />
                      <Image
                        alt="creditCard"
                        src={creditCard6}
                        className=" min-w-[2rem]"
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
              <div className="space-y-4">
                <h2 className="sm:text-lg text-base font-bold text-right">
                  إيصال التحويل البنكي
                </h2>
                <div className="flex flex-col gap-1 v7-neu-card p-4">
                  <span className="text-sm sm:text-base">اسم البنك: مصرف الراجحي</span>
                  <span className="text-sm sm:text-base">المستفيد: شركة مراسيل لخدمات الأعمال</span>
                  <span className="text-sm sm:text-base">رقم الحساب: 177608016234509</span>
                  <span className="text-sm sm:text-base">الايبان: SA8180000177608016234509</span>
                  <span className="py-4 text-red-500 text-sm sm:text-base">
                    إذا كنت تستخدم بنك خارج المملكة العربية السعودية الرجاء شحن
                    المحفظة عن طريق البطاقة
                  </span>
                </div>

                <p className="text-right sm:text-lg text-base font-bold pt-4 text-gray-600">
                  قم برفع صورة إيصال التحويل البنكي
                </p>

                <div className="flex justify-center">
                  <label
                    className={`cursor-pointer border-2 border-dashed rounded-lg w-full p-6 text-center transition-all hover:border-blue-500 ${
                      isDarkMode
                        ? "border-gray-600 bg-dark-card"
                        : "border-gray-300 bg-gray-50"
                    } ${transferImagePreview ? 'border-green-500' : ''}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div>
                      {transferImagePreview ? (
                        <>
                          <div className="text-green-500 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm text-green-600 mb-2 text-center">تم تحميل الصورة بنجاح</p>
                          <div className="flex justify-center">
                            <img
                              src={transferImagePreview}
                              alt="Transfer Receipt"
                              className="mt-2 max-h-32 max-w-full rounded"
                              onLoad={(e) => URL.revokeObjectURL(transferImagePreview)}
                            />
                          </div>
                          <div className="text-center mt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTransferImage(null);
                                setTransferImagePreview(null);
                              }}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              حذف الصورة
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-gray-400 mb-2 mx-auto" />
                          <p className="text-sm text-gray-500">
                            اسحب وأفلت الملف هنا أو انقر للاختيار
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            (يُفضل صيغة JPG أو PNG)
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={preparePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  disabled={isSubmitting || !paymentAmount}
                >
                  {isSubmitting ? 'جاري التحميل...' : 'إدفع الآن'}
                </Button>
                <div ref={moyasarFormRef} id="moyasar-payment-form" className="mt-4"></div>
              </div>
            )}
            
            {paymentMethod === 'bank' && (
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className={`w-full font-bold py-2 px-4 rounded transition-colors ${
                    isSubmitting || !paymentAmount || !transferImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={isSubmitting || !paymentAmount || !transferImage}
                >
                  {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد إرسال الإيصال'}
                </Button>
              </DialogFooter>
            )}
            
            {error && (
              <div className="mt-2 text-red-500 text-sm text-center w-full">
                {error}
              </div>
            )}
            
            {/* Payment form container */}
            <div className="mt-6 w-full">
              <div ref={moyasarFormRef} id="moyasar-payment-form" className="w-full">
                {/* Moyasar form will be injected here */}
              </div>
              <p className="mt-2 text-xs text-gray-500 text-right">
                مدعوم بواسطة ميسر للدفع الإلكتروني
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
