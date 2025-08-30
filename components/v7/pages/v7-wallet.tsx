'use client';

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, AlertCircle, Upload, X, Loader2 } from "lucide-react";
import RealBlue from "../../../public/real-blue.png";
import RealWhite from "../../../public/real-white.png";
import Image from "next/image";
import bankTransfer from "../../../public/bankTransfer.png";
import creditCard1 from "../../../public/creditCard1.png";
import creditCard2 from "../../../public/creditCard2.png";
import creditCard3 from "../../../public/creditCard3.png";
import creditCard4 from "../../../public/creditCard4.png";
import creditCard5 from "../../../public/creditCard5.png";
import creditCard6 from "../../../public/creditCard6.png";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export default function V7Wallet({ isOpen, onClose, balance, onBalanceUpdate }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [transferImagePreview, setTransferImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // مراقبة رابط الكول باك (Callback URL) ومعالجة الإغلاق التلقائي
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const message = params.get('message');
    const token = params.get('id');

    if ((status === 'paid' || message === 'APPROVED') && token) {
      if (window.opener) {
        // إذا كانت نافذة منبثقة، أرسل رسالة إلى النافذة الأم وأغلق النافذة
        window.opener.postMessage({ type: 'payment_success', token, amount: paymentAmount }, '*'); // استخدم origin محدد في الإنتاج
        setTimeout(() => window.close(), 1000); // إغلاق تلقائي بعد 1 ثانية
      } else {
        // إذا لم تكن منبثقة، معالجة عادية
        setIsSubmitting(true);
        fetch('http://localhost:8000/api/wallet/rechargeWallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
          },
          body: JSON.stringify({ token, amount: paymentAmount }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => { throw new Error(data.message || 'فشل في معالجة الدفع'); });
            }
            return response.json();
          })
          .then(() => {
            setSuccess('تمت عملية الدفع بنجاح!');
            onBalanceUpdate(balance + paymentAmount);
            setTimeout(() => {
              handleClose();
              window.location.replace('/'); // إعادة توجيه نظيفة
            }, 2000);
          })
          .catch((error) => {
            setError(error.message || 'حدث خطأ أثناء معالجة الدفع');
          })
          .finally(() => {
            setIsSubmitting(false);
            // تنظيف معلمات URL
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      }
    }
  }, [paymentAmount, balance, onBalanceUpdate]);

  // استماع لرسائل postMessage من النافذة المنبثقة
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data.type === 'payment_success') {
        const { token, amount } = event.data;
        setIsSubmitting(true);
        fetch('http://localhost:8000/api/wallet/rechargeWallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
          },
          body: JSON.stringify({ token, amount }),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((data) => { throw new Error(data.message || 'فشل في معالجة الدفع'); });
            }
            return response.json();
          })
          .then(() => {
            setSuccess('تمت عملية الدفع بنجاح!');
            onBalanceUpdate(balance + amount);
            setTimeout(handleClose, 2000);
          })
          .catch((error) => {
            setError(error.message || 'حدث خطأ أثناء معالجة الدفع');
          })
          .finally(() => setIsSubmitting(false));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [balance, onBalanceUpdate]);

  // بقية الدوال كما هي (handleAmountSelect, handleCustomAmountChange, handleImageUpload, removeImage, handleClose, validateCardData)

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount)) setPaymentAmount(numAmount);
    setError("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) setPaymentAmount(numValue);
    else setPaymentAmount(0);
    setSelectedAmount(null);
    setError("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الملف يجب أن يكون أقل من 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("الملف يجب أن يكون صورة");
        return;
      }
      setTransferImage(file);
      setTransferImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    setTransferImage(null);
    setTransferImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  const handleClose = () => {
    setPaymentMethod("card");
    setSelectedAmount(null);
    setCustomAmount("");
    setPaymentAmount(0);
    setError("");
    setSuccess("");
    setCardName("");
    setCardNumber("");
    setCardMonth("");
    setCardYear("");
    setCardCvc("");
    setTransferImage(null);
    setTransferImagePreview(null);
    onClose();
  };

  const validateCardData = () => {
    if (!cardName.trim()) {
      setError("اسم حامل البطاقة مطلوب");
      return false;
    }
    const nameParts = cardName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setError("يرجى إدخال الاسم واسم العائلة");
      return false;
    }
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber || cleanedCardNumber.length !== 16) {
      setError("رقم البطاقة يجب أن يكون 16 رقمًا");
      return false;
    }
    if (!cardMonth || cardMonth.length !== 2) {
      setError("شهر الانتهاء يجب أن يكون رقمين");
      return false;
    }
    if (!cardYear || cardYear.length !== 2) {
      setError("سنة الانتهاء يجب أن تكون رقمين");
      return false;
    }
    if (!cardCvc || cardCvc.length !== 3) {
      setError("رمز الأمان يجب أن يكون 3 أرقام");
      return false;
    }
    return true;
  };

  // معالجة التحقق من 3D Secure (فتح نافذة منبثقة)
  const handle3DSecureVerification = (verificationUrl: string, tokenId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        let popup: Window | null = null;
        try {
          popup = window.open(
            verificationUrl,
            '3DSecureVerification',
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
          );
        } catch (err) {
          console.warn('تم حظر النافذة المنبثقة، جاري إعادة التوجيه في نفس النافذة');
          window.location.href = verificationUrl;
          resolve(true);
          return;
        }

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          console.warn('تم حظر النافذة المنبثقة، جاري إعادة التوجيه في نفس النافذة');
          window.location.href = verificationUrl;
          resolve(true);
          return;
        }

        const checkPopup = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkPopup);
              resolve(true);
            }
          } catch (e) {
            console.error('خطأ في فحص النافذة المنبثقة:', e);
            clearInterval(checkPopup);
            resolve(true);
          }
        }, 1000);
      } catch (error) {
        console.error('خطأ في التحقق من 3D Secure:', error);
        setError('حدث خطأ أثناء عملية التحقق من البطاقة');
        reject(error);
      }
    });
  };

  // إرسال طلب الدفع إلى الباك إند
  const createPayment = async (tokenId: string) => {
    try {
      if (!tokenId) {
        throw new Error('رمز الدفع غير صالح');
      }
      setError('جاري إرسال الطلب إلى الباك إند...');
      const userToken = localStorage.getItem('token');
      const backendResponse = await fetch('http://localhost:8000/api/wallet/rechargeWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userToken ? { 'Authorization': `Bearer ${userToken}` } : {}),
        },
        body: JSON.stringify({
          token: tokenId,
          amount: paymentAmount,
          cardName,
          cardNumber,
          cardMonth,
          cardYear,
          cardCvc,
        }),
      });
      const backendResult = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(backendResult.message || 'فشل في معالجة الدفع عبر الباك إند');
      }

      setSuccess('تم إرسال طلب الدفع بنجاح! سيتم معالجة العملية من قبل الإدارة.');
      onBalanceUpdate(balance + paymentAmount);
      setTimeout(() => {
        handleClose();
        window.location.replace('/'); // إعادة توجيه نظيفة
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء معالجة الدفع');
      setIsSubmitting(false);
    }
  };

  // معالجة تقديم الدفع
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setSuccess("");

    if (paymentAmount <= 0) {
      setError("يرجى إدخال مبلغ صالح");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "card") {
        if (!validateCardData()) {
          setIsSubmitting(false);
          return;
        }

        const tokenParams = new URLSearchParams();
        tokenParams.append('publishable_api_key', 'pk_test_EHPGwD3HWQA7pKqbEPeJvWv3LT7PMPvEsdfAu5Ad');
        tokenParams.append('name', cardName);
        tokenParams.append('number', cardNumber.replace(/\s/g, ''));
        tokenParams.append('month', cardMonth);
        tokenParams.append('year', `20${cardYear}`.slice(-4));
        tokenParams.append('cvc', cardCvc);
        tokenParams.append('callback_url', window.location.origin + '/'); // الـ callback يعالج في النافذة الأم

        const tokenResponse = await fetch('https://api.moyasar.com/v1/tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenParams,
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(tokenData.message || 'فشل في إنشاء رمز الدفع');
        }

        if (!tokenData.id) {
          throw new Error('فشل في إنشاء رمز الدفع');
        }

        if (tokenData.verification_url) {
          setError('جاري التوجيه إلى صفحة التحقق من البطاقة...');
          await handle3DSecureVerification(tokenData.verification_url, tokenData.id);
          await createPayment(tokenData.id); // إرسال الطلب بعد التحقق
        } else {
          await createPayment(tokenData.id);
        }
      } else {
        // معالجة التحويل البنكي (كما هي، مع إعادة توجيه)
        if (!transferImage) {
          setError("يرجى رفع صورة الإيصال");
          setIsSubmitting(false);
          return;
        }

        setTimeout(() => {
          setSuccess("تم استلام إيصال التحويل بنجاح، سيتم مراجعته خلال 24 ساعة");
          setIsSubmitting(false);
          
          setTimeout(() => {
            handleClose();
          }, 3000);
        }, 2000);
      }
    } catch (err: any) {
      console.error("خطأ في الدفع:", err);
      setError(err.message || "حدث خطأ أثناء عملية الدفع. يرجى التحقق من بيانات البطاقة والمحاولة مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-screen overflow-y-auto border-none py-10" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-right text-xl mb-4 border-b border-gray-300 pb-2 flex items-center justify-between" dir="rtl">
            <span className=" mt-4">شحن المحفظة</span>
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} dir="rtl">
          {/* الـ JSX كما هو بالكامل، دون تغيير */}
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
                    className={`p-2 text-sm rounded transition-colors flex items-center justify-center v7-neu-btn max-h-10  ${
                      isSelected
                        ? " text-white bg-primary "
                        : "bg-blue-50 text-[#5791F4] hover:bg-blue-100 "
                    }`}
                  >
                    {val}
                    {isSelected ?
                    
                    <Image alt={"price"} src={RealWhite}  className=" w-[20px]"/>
                    :<Image alt={"price"} src={RealBlue} className=" w-[20px]"/>
                  }
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
                    placeholder="مبلغ آخر"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="v7-neu-input-hollow text-gry"
            pattern="[0-9]"
              min="0"
            />
          </div>
                    {/* اختيار طريقة الدفع */}
            <div className=" flex items-center gap-4  ">
              <div
                onClick={() => setPaymentMethod("bank")}
                className=" w-full "
              >
                <div
                  className={`v7-neu-card h-[10rem] px-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 v7-neu-card-accent ${
                    paymentMethod === "bank" ?
                        "border border-blue-600 bg-blue-50"
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
                    paymentMethod === "card"?
                    "border border-blue-600 bg-blue-50"
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
          {paymentMethod === "card" && (
            <div className=" v7-neu-card space-y-4">
              <h3 className="text-right font-medium mb-4">معلومات البطاقة</h3>
              
              <div className="space-y-2 ">
                <Label className="text-right block">اسم حامل البطاقة</Label>
                <Input
                  placeholder="كما هو مدون على البطاقة"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="v7-neu-input-hollow text-gry"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-right block">رقم البطاقة</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="v7-neu-input-hollow text-gry"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 16) {
                       setCardNumber(value);
                    }
                  }}
                  maxLength={19}
                  required
                />
              </div>
              
              <div className=" flex flex-col  space-y-4 mt-2">
                  <Label className="text-right block">تاريخ الانتهاء</Label>
                  <div className="flex gap-6">
                              <div className="space-y-2">
                  <Label className="text-right block">شهر</Label>
                    <Input
                      placeholder="MM"
                      value={cardMonth}
                      className="v7-neu-input-hollow text-gry"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) setCardMonth(value);
                      }}
                      maxLength={2}
                      required
                    />
                    </div>
                       <div className="space-y-2">
                  <Label className="text-right block">سنة</Label>
                    <Input
                      placeholder="YY"
                      value={cardYear}
                      className="v7-neu-input-hollow text-gry"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 2) setCardYear(value);
                      }}
                      maxLength={2}
                      required
                    />
                    </div>
                  </div>
             
                
                <div className="space-y-2">
                  <Label className="text-right block">رمز الأمان (CVC)</Label>
                  <Input
                    placeholder="123"
                    value={cardCvc}
                    className="v7-neu-input-hollow text-gry"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) setCardCvc(value);
                    }}
                    maxLength={3}
                    required
                  />
                </div>
                 
              </div>
            </div>
          )}

          {/* رفع الإيصال */}
          {paymentMethod === "bank" && (
            <div className="space-y-4 v7-neu-card  ">
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
                    <p className="text-gray-500 text-sm">انقر لرفع صورة الإيصال</p>
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

          <DialogFooter className="flex flex-col sm:flex-row gap-2 " dir="ltr"  >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-primary  text-white py-2 px-6 rounded w-full sm:w-auto flex items-center justify-center gap-2"
              disabled={isSubmitting || paymentAmount <= 0}
            >
              {isSubmitting ? (
                <>
                  <span>جاري المعالجة...</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                <Image alt="push" src={RealWhite} className="w-[20px] h-[20px]"/>
                  <span className=" ">
                  {paymentAmount}
                  </span>
                ادفع 
                </>
              )}
            </Button>
          </DialogFooter>
           <p className="mt-2 text-xs text-gray-500 text-right">
                مدعوم بواسطة ميسر للدفع الإلكتروني
              </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}