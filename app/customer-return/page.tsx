"use client"
import Link from "next/link"
import { CustomerReturnForm } from "@/components/customer-return-form"
import { Info, CheckCircle } from 'lucide-react'

export default function CustomerReturn() {
  return (
    <div className="bg-gray-50 min-h-screen rtl">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              S
            </div>
            <h1 className="text-xl font-bold text-gray-800">شيب لاين</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">نظام إرجاع المنتجات والبوالص</h2>
            <p className="text-gray-600">قم بتعبئة النموذج التالي لطلب إرجاع المنتجات أو بوليصة الشحن</p>
          </div>

          <CustomerReturnForm />

          <div className="mt-8 v7-neu-card p-4 rounded-xl bg-blue-50/30">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-blue-600">
                <Info className="w-5 h-5" />
              </span>
              هل تحتاج للمساعدة؟
            </h3>
            <p className="text-sm text-gray-600">
              إذا كنت تواجه أي مشكلة في عملية الإرجاع، يرجى التواصل مع فريق خدمة العملاء على الرقم
              <a href="tel:920001234" className="text-blue-600 mx-1 font-medium">
                920001234
              </a>
              أو عبر البريد الإلكتروني
              <a href="mailto:support@shipline.com" className="text-blue-600 mx-1 font-medium">
                support@shipline.com
              </a>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="v7-neu-card p-5 rounded-xl bg-blue-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-blue-600">
                  <Info className="w-5 h-5" />
                </span>
                دليل إرجاع المنتجات
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-medium text-gray-700">شروط إرجاع المنتجات:</p>
                <ul className="list-disc list-inside space-y-1 pr-4">
                  <li>يجب أن يكون المنتج في حالته الأصلية وبدون استخدام</li>
                  <li>يجب الاحتفاظ بجميع الملصقات والعلامات الأصلية</li>
                  <li>يجب إرفاق فاتورة الشراء أو إثبات الشراء</li>
                  <li>يجب تقديم طلب الإرجاع خلال 14 يوم من تاريخ الاستلام</li>
                  <li>لا يمكن إرجاع المنتجات المخصصة أو المصنوعة حسب الطلب</li>
                </ul>

                <p className="font-medium text-gray-700 mt-4">خطوات إرجاع المنتج:</p>
                <ol className="list-decimal list-inside space-y-1 pr-4">
                  <li>تعبئة نموذج طلب الإرجاع</li>
                  <li>انتظار الموافقة على طلب الإرجاع</li>
                  <li>تغليف المنتج بشكل آمن مع إرفاق ملصق الإرجاع</li>
                  <li>إرسال المنتج عبر إحدى طرق الإرجاع المتاحة</li>
                  <li>استلام تأكيد استلام المنتج المرتجع</li>
                  <li>استرداد المبلغ أو استبدال المنتج حسب الاختيار</li>
                </ol>
              </div>
            </div>

            <div className="v7-neu-card p-5 rounded-xl bg-green-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </span>
                الأسئلة الشائعة
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">كم تستغرق عملية الإرجاع؟</p>
                  <p className="text-sm text-gray-600">
                    تستغرق عملية الإرجاع عادة من 5-7 أيام عمل من تاريخ استلام المنتج المرتجع.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل هناك رسوم على إرجاع المنتجات؟</p>
                  <p className="text-sm text-gray-600">
                    لا توجد رسوم على إرجاع المنتجات في حالة وجود عيب مصنعي أو خطأ في الشحن. في الحالات الأخرى، قد تطبق
                    رسوم شحن الإرجاع.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">كيف يمكنني تتبع حالة طلب الإرجاع؟</p>
                  <p className="text-sm text-gray-600">
                    يمكنك تتبع حالة طلب الإرجاع من خلال رقم طلب الإرجاع الذي سيتم إرساله إليك بعد تقديم الطلب.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل يمكنني إرجاع جزء من الطلب فقط؟</p>
                  <p className="text-sm text-gray-600">نعم، يمكنك اختيار المنتجات التي ترغب في إرجاعها من الطلب.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 شيب لاين. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  )
}
