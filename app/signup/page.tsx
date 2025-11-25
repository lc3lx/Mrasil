"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "../api/authApi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ResponseModal from "../components/ResponseModal";
import { Eye, EyeOff } from "lucide-react";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  
  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    
    if (checks.length) strength++;
    if (checks.uppercase) strength++;
    if (checks.lowercase) strength++;
    if (checks.number) strength++;
    
    return { strength, checks };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['ضعيف', 'ضعيف', 'متوسط', 'قوي', 'قوي جداً'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setModalMessage("كلمتا المرور غير متطابقتين");
      setModalOpen(true);
      return;
    }

    // Validate password strength
    const { checks } = getPasswordStrength(formData.password);
    if (!checks.length) {
      setModalMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.uppercase) {
      setModalMessage("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.lowercase) {
      setModalMessage("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل");
      setModalOpen(true);
      return;
    }
    if (!checks.number) {
      setModalMessage("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
      setModalOpen(true);
      return;
    }

    // Validate name length
    if (formData.firstName.length < 3) {
      setModalMessage("الاسم الأول يجب أن يكون 3 أحرف على الأقل");
      setModalOpen(true);
      return;
    }

    if (formData.lastName.length < 3) {
      setModalMessage("الاسم الأخير يجب أن يكون 3 أحرف على الأقل");
      setModalOpen(true);
      return;
    }
    
    try {
      // Prepare data for API (exclude confirmPassword from request body)
      const { confirmPassword, ...signupData } = formData;
      
      console.log("Signup form data being sent:", signupData);

      await signup(signupData).unwrap();
      toast.success("تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup Error:", error);
      setModalMessage(error.data?.message || "فشل في إنشاء الحساب");
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: 'url(/login.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/40 z-0" />
      <ResponseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} status="fail" message={modalMessage} />
      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-xl mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center max-h-[95vh] overflow-y-auto">
            {/* Title */}
            <Link href="/invoices" className="mb-4 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="شعار الشركة" className="h-24 w-auto sm:h-28" width={180} height={180} />
            </Link>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-wide text-center drop-shadow-lg">تسجيل دخول جديد</h2>
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col gap-4">
              {/* First Name Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="الاسم الأول"
                    value={formData.firstName}
                    onChange={handleChange}
                    minLength={3}
                  />
                </div>
              </div>
              {/* Last Name Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="الاسم الأخير"
                    value={formData.lastName}
                    onChange={handleChange}
                    minLength={3}
                  />
                </div>
              </div>
              {/* Phone Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full pl-12 pr-4 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Email Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Password Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-10 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-1.5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strengthColors[passwordStrength.strength] || 'bg-gray-400'}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/80 font-medium min-w-[70px]">
                        {strengthLabels[passwordStrength.strength] || 'ضعيف'}
                      </span>
                    </div>
                    {/* Password Requirements */}
                    <div className="text-xs text-white/70 space-y-0.5 rtl">
                      <div className={`flex items-center gap-1.5 ${passwordStrength.checks.length ? 'text-green-300' : ''}`}>
                        <span className="text-xs">{passwordStrength.checks.length ? '✓' : '○'}</span>
                        <span>8 أحرف على الأقل</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.checks.uppercase ? 'text-green-300' : ''}`}>
                        <span className="text-xs">{passwordStrength.checks.uppercase ? '✓' : '○'}</span>
                        <span>حرف كبير (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.checks.lowercase ? 'text-green-300' : ''}`}>
                        <span className="text-xs">{passwordStrength.checks.lowercase ? '✓' : '○'}</span>
                        <span>حرف صغير (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordStrength.checks.number ? 'text-green-300' : ''}`}>
                        <span className="text-xs">{passwordStrength.checks.number ? '✓' : '○'}</span>
                        <span>رقم (0-9)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Confirm Password Field */}
              <div className="w-full">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-10 py-2.5 bg-white/10 text-white placeholder-white/70 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-none text-sm sm:text-base border border-white/20"
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white focus:outline-none"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* Terms and Privacy Notice */}
              <div className="w-full text-center">
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  بمجرد التسجيل، أنت توافق على{" "}
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(true)}
                    className="underline hover:text-white transition-colors font-medium"
                  >
                    شروط الاستخدام
                  </button>
                  {" "}و{" "}
                  <button
                    type="button"
                    onClick={() => setPrivacyModalOpen(true)}
                    className="underline hover:text-white transition-colors font-medium"
                  >
                    سياسة الخصوصية
                  </button>
                </p>
              </div>
              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white bg-primary font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جار إنشاء الحساب...
                  </div>
                ) : (
                  'إنشاء حساب'
                )}
              </button>
              {/* Login Link */}
              <div className="w-full flex justify-center gap-4 mt-3">
                <p className="text-white/80 text-sm sm:text-base font-medium flex gap-2">
                  هل لديك حساب بالفعل؟
                  <Link href="/login" className="underline hover:text-white">تسجيل دخول</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              سياسة حماية البيانات الشخصية
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-right rtl">
            <div>
              <h3 className="text-xl font-semibold mb-3">منصة مراسيل – شحن داخلي</h3>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">1. مقدمة</h4>
              <p className="text-gray-700 leading-relaxed">
                تحرص منصة مراسيل على حماية خصوصية عملائها، وتلتزم بالحفاظ على سرية المعلومات والبيانات الشخصية وفقًا لأنظمة المملكة العربية السعودية، وعلى رأسها نظام حماية البيانات الشخصية الصادر عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">2. جمع البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">
                نقوم بجمع البيانات التالية فقط لأغراض تشغيل المنصة وتحسين الخدمة:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>الاسم الكامل</li>
                <li>رقم الجوال</li>
                <li>العنوان</li>
                <li>بيانات الطلبات</li>
                <li>وسائل الدفع (بشكل مشفّر)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">3. استخدام البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">
                تُستخدم البيانات التي نجمعها لتحقيق الأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>تنفيذ عمليات الشحن وتأكيد الطلبات.</li>
                <li>التواصل مع العملاء لتقديم الدعم الفني وخدمة العملاء.</li>
                <li>التحليل الداخلي لتحسين تجربة المستخدم وتطوير خدمات المنصة.</li>
                <li>إرسال إشعارات أو عروض ترويجية تتعلق بخدمات منصة مراسيل فقط، وعند تسجيلك بالمنصة فأنت توافق على ذلك.</li>
                <li>يمكن للمستخدم إلغاء الاشتراك في الرسائل الإعلانية في أي وقت من خلال إعدادات الحساب أو عبر التواصل معنا مباشرة.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">4. حماية البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">نلتزم بما يلي:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>استخدام تقنيات التشفير الحديثة</li>
                <li>تأمين الخوادم بأنظمة حماية موثوقة</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">5. مشاركة البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">
                لا نقوم بمشاركة بيانات العملاء مع أي طرف ثالث إلا في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>شركاء لوجستيين لتنفيذ عمليات التوصيل</li>
                <li>جهات حكومية عند الطلب الرسمي</li>
                <li>جهات أمنية في حال وجود تحقيق قانوني</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">6. حقوق المستخدم</h4>
              <p className="text-gray-700 leading-relaxed mb-2">يحق للمستخدم:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>طلب الاطلاع على بياناته</li>
                <li>تعديل أو تحديث بياناته</li>
                <li>طلب حذف بياناته (ما لم تكن لازمة لحفظ السجلات حسب الأنظمة)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">7. خرق البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">في حال حدوث اختراق أمني:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>نلتزم بإبلاغ الجهات المختصة خلال مدة لا تتجاوز 72 ساعة</li>
                <li>نبلغ المستخدمين المتضررين بالحادثة والإجراءات المتخذة</li>
                <li>نقوم بتحليل الخرق واتخاذ الإجراءات التصحيحية الفورية</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">8. التعديلات</h4>
              <p className="text-gray-700 leading-relaxed">
                يحق لنا تعديل هذه السياسة في أي وقت، وسيتم نشر التعديلات عبر منصتنا الرسمية مع تحديد تاريخ التحديث.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-gray-700">
                <strong>للاستفسار:</strong> info@marasil.sa
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              شروط وأحكام الاشتراك والخدمات في منصة مراسيل
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-right rtl">
            <div>
              <h4 className="text-lg font-semibold mb-2">1. المقدمة</h4>
              <p className="text-gray-700 leading-relaxed">
                تمثل هذه الشروط والأحكام اتفاقًا رسميًا بين منصة مراسيل والشركات أو المؤسسات التي ترغب في استخدام خدمات المنصة.
                باستخدامك المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي بند من هذه الشروط، يجب عدم الاشتراك في المنصة أو استخدام أي من خدماتها.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>تنويه:</strong> منصة مراسيل تعمل كوسيط تقني بين المتاجر وشركات الشحن، ولا تمتلك أسطول شحن خاص بها.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">2. التعريفات</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li><strong>منصة مراسيل:</strong> النظام الإلكتروني الذي يتيح للمشتركين إدارة شحناتهم والتواصل مع شركات الشحن، مع إضافة الذكاء الاصطناعي في إنشاء الشحنات، وتتبعها، وحل مشاكل الشحن.</li>
                <li><strong>المشترك/المتجر/الشركة:</strong> الجهة التجارية المسجلة في المنصة وتستخدم خدماتها لتقديم الشحن لعملائها.</li>
                <li><strong>الحساب:</strong> الحساب الخاص بالمتجر في منصة مراسيل.</li>
                <li><strong>الشحنة/الطرود:</strong> المنتجات أو البضائع التي يتم شحنها من قبل المتجر عبر شركات الشحن المعتمدة في المنصة.</li>
                <li><strong>شركة الشحن:</strong> أي شركة تقدم خدمات الشحن والتوصيل داخل المملكة العربية السعودية أو خارجها، ومربوطة بالمنصة.</li>
                <li><strong>الخدمة:</strong> أي ميزة مقدمة من منصة مراسيل، بما في ذلك إنشاء الشحنات، تتبع الطرود، الدفع عند الاستلام، الدعم عبر الذكاء الاصطناعي، الربط مع منصات المتاجر الإلكترونية، وغيرها.</li>
                <li><strong>العميل النهائي:</strong> المستفيد من خدمات الشحن التي يقدمها المتجر عبر منصة مراسيل.</li>
                <li><strong>القوانين المعمول بها:</strong> الأنظمة واللوائح السعودية السارية، بما في ذلك اللوائح التنظيمية المتعلقة بالنقل والشحن وحماية البيانات.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">3. الاشتراك في منصة مراسيل</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>يجب أن يكون المتجر أو المؤسسة مرخصًا ويعمل وفق الأنظمة السعودية.</li>
                <li>يلتزم المشترك بتقديم بيانات صحيحة وكاملة عند التسجيل.</li>
                <li>لا يحق للمشترك استخدام المنصة لأي نشاط غير قانوني أو مخالف للأنظمة.</li>
                <li>منصة مراسيل تحتفظ بحق تعليق أو إلغاء الحساب في حال المخالفة.</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>رسوم الاشتراك:</strong> حاليًا، الاشتراك مجاني، ويمكن إضافة الرسوم مستقبلًا وفق إشعار مسبق.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">4. خدمات منصة مراسيل</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li><strong>وسيط شحن:</strong> تربط المنصة المتاجر بشركات الشحن دون تحمل أي مسؤولية عن فقد، تلف، أو تأخير الشحنة.</li>
                <li><strong>الدفع عند الاستلام:</strong> إدارة خيارات الدفع بما في ذلك الدفع عند الاستلام.</li>
                <li><strong>التتبع وإشعارات العملاء:</strong> إمكانية تتبع الطرود وإرسال تحديثات تلقائية للعملاء.</li>
                <li><strong>الذكاء الاصطناعي:</strong> دعم العملاء في إنشاء الشحنات، متابعة الشحن، حل مشاكل التوصيل، وتقديم المساعدة في الوقت الفعلي.</li>
                <li><strong>ربط API مع منصات المتاجر:</strong> تمكين المشترك من إدارة الشحنات مباشرة من متجره الإلكتروني.</li>
                <li><strong>الدعم الفني:</strong> توفير المساعدة وحل النزاعات المتعلقة بالشحن مع شركات الشحن.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">5. مسؤولية المشترك</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>إدخال بيانات صحيحة للشحنات، بما في ذلك الوزن والأبعاد ومحتوى الطرد.</li>
                <li>تحمل تكاليف الشحن وفق ما تحدده شركات الشحن.</li>
                <li>التأكد من صحة بيانات العملاء وعناوين التسليم.</li>
                <li>الالتزام بسياسات شركات الشحن المتعاقد معها عبر المنصة.</li>
                <li>تحمل المسؤولية عن أي خسائر ناتجة عن سوء استخدام النظام أو تقديم بيانات مضللة.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">6. مسؤولية منصة مراسيل</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>تقديم منصة تقنية لربط المتاجر مع شركات الشحن.</li>
                <li>إدارة وإتاحة خدمات الدفع عند الاستلام، التتبع، وربط API.</li>
                <li>دعم العملاء ومساعدتهم في حل المشاكل.</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>تنويه:</strong> المنصة غير مسؤولة عن أي فقد، تلف، تأخير، أو تقصير من شركات الشحن.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">7. احتساب الوزن والفوترة</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>الوزن الفعلي والحجمي يُحتسب وفقًا لمعايير شركات الشحن.</li>
                <li>أي اختلاف بين البيانات المعلنة والوزن الفعلي يؤدي إلى تعديل الفاتورة أو رفض الشحنة.</li>
                <li>منصة مراسيل تحتفظ بحق خصم أي فروقات مالية من رصيد المشترك أو الدفع عند الاستلام.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">8. حماية البيانات</h4>
              <p className="text-gray-700 leading-relaxed mb-2">
                تحرص منصة مراسيل على حماية خصوصية عملائها، وتلتزم بالحفاظ على سرية المعلومات والبيانات الشخصية وفقًا لأنظمة المملكة العربية السعودية، وعلى رأسها نظام حماية البيانات الشخصية الصادر عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                يلتزم المشترك بحماية بيانات عملائه والامتثال لجميع اللوائح.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                منصة مراسيل غير مسؤولة عن أي خرق أمني ناتج عن إهمال المشترك.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">9. الملكية الفكرية</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>جميع حقوق الملكية الفكرية محفوظة لمنصة مراسيل.</li>
                <li>يحظر على المشترك تعديل أو نسخ أو استخدام أي محتوى أو عناصر تقنية إلا وفق الأغراض المصرح بها.</li>
                <li>عند إنهاء الاشتراك، يلتزم المشترك بالتوقف فورًا عن استخدام أي من موارد المنصة.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">10. القانون المعمول به وحل النزاعات</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
                <li>تخضع هذه الشروط للقوانين واللوائح السعودية.</li>
                <li>تكون المحاكم المختصة في المملكة العربية السعودية هي الجهة القضائية للنظر في أي نزاع.</li>
                <li>تُعتبر جميع الرسائل والتواصل الإلكتروني بين المتجر ومنصة مراسيل ذات حجية قانونية قائمة بحد ذاتها، وتعد ملزمة قانونيًا للطرفين.</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">11. التعديلات</h4>
              <p className="text-gray-700 leading-relaxed">
                تحتفظ منصة مراسيل بحق تعديل الشروط والأحكام أو الرسوم في أي وقت، ويُعتبر استمرار استخدام المنصة بعد التعديل موافقة على التحديثات.
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-gray-700 mb-2">
                <strong>تواصل معنا</strong>
              </p>
              <p className="text-gray-700">
                إذا كانت لديك أي أسئلة حول شروط وأحكام الاشتراك، يرجى الاتصال بنا عبر info@marasil.sa أو عبر الرقم 966500556618
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
