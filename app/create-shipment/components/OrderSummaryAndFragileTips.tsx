import React from "react";
import { FileText, Package, Shield, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

export function OrderSummaryAndFragileTips({ values }: { values: any }) {
  console.log(values);

  const { watch } = useFormContext();
  const length = watch("dimension_length") || 0;
  const width = watch("dimension_width") || 0;
  const height = watch("dimension_high") || 0;
 const volume = length * width * height;

  return (
    <>
      {/* نصائح للشحنات القابلة للكسر */}
      <div className="flex items-center gap-3">
        <div className="v7-neu-icon-sm bg-amber-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-alert h-5 w-5 text-[#3498db]"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          نصائح للشحنات القابلة للكسر
        </h3>
      </div>
      <div className="v7-neu-card-inner p-6 bg-gradient-to-br from-amber-50 to-white border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3498db]/20 flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-package h-6 w-6 text-[#3498db]"
            >
              <path d="m7.5 4.27 9 5.15"></path>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <path d="m3.3 7 8.7 5 8.7-5"></path>
              <path d="M12 22V12"></path>
            </svg>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">
              كيف تحمي شحنتك القابلة للكسر؟
            </h4>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#3498db]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-[#3498db] text-xs font-bold">١</span>
                </div>
                <p className="text-gray-700">
                  استخدم تغليف مناسب مثل الفقاعات الهوائية أو الفلين لحماية
                  المحتويات الهشة
                </p>
              </li>

              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#3498db]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-[#3498db] text-xs font-bold">٢</span>
                </div>
                <p className="text-gray-700">
                  ضع علامة "قابل للكسر" بشكل واضح على جميع جوانب الطرد
                </p>
              </li>

              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#3498db]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-[#3498db] text-xs font-bold">٣</span>
                </div>
                <p className="text-gray-700">
                  اختر خدمة الشحن المميزة للتعامل مع الشحنات الحساسة بعناية
                  إضافية
                </p>
              </li>

              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#3498db]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-[#3498db] text-xs font-bold">٤</span>
                </div>
                <p className="text-gray-700">
                  نوصي بشدة بإضافة تأمين الشحنة لتغطية أي أضرار محتملة أثناء
                  النقل
                </p>
              </li>
            </ul>

            <div className="flex items-center gap-2 mt-2 bg-[#3498db]/20 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield h-5 w-5 text-[#3498db]"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
              <p className="text-amber-700 font-medium">
                يمكنك إضافة تأمين على الشحنة من خلال الفرع كل ماعليك فعله عند
                تسليم الشحنة أخبرهم انك تريد التأمين عليها.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* كوبون الخصم */}
      <div className="flex items-center gap-3 mb-4">
        <div className="v7-neu-icon-sm ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-ticket h-5 w-5 text-[#3498db]"
          >
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">كوبون الخصم</h3>
      </div>
      <div className="v7-neu-card-inner p-6 bg-gradient-to-br from-[##3498db] to-white border border-[#3498db]/15">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ticket h-5 w-5 text-[#3498db]"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                <path d="M13 5v2"></path>
                <path d="M13 17v2"></path>
                <path d="M13 11v2"></path>
              </svg>
            </div>
            <input
              className="flex h-10 w-full rounded-lg border-[0.5px] border-transparent bg-background/5 px-3 py-2 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-input/20 focus-visible:bg-gradient-to-b focus-visible:from-background/10 focus-visible:to-background/5 focus-visible:shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] hover:border-input/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/20 disabled:shadow-none pr-10 v7-neu-input"
              placeholder="أدخل كود الخصم"
              value=""
            />
          </div>
          <button className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] relative overflow-hidden group">
            <span className="relative z-10 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check ml-2 h-5 w-5"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              تطبيق الكوبون
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#2980b9] to-[#3498db] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>

      {/* ملخص الطلب */}
      <div
        className="mt-8 v7-neu-card p-6 bg-gradient-to-br from-white to-[#f0f4f8] relative overflow-hidden"
        style={{ opacity: 1, transform: "none" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#3498db]/5 to-transparent rounded-full transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-[#3498db]/5 to-transparent rounded-full transform -translate-x-20 translate-y-20"></div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-[#1a365d]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-credit-card h-5 w-5 text-[#3498db]"
              >
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
              ملخص الطلب
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">من</span>
              <span className="font-medium text-[#1a365d]">
                {values.shipper_city  || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">إلى</span>
              <span className="font-medium text-[#1a365d]">{values.recipient_city  || "غير محدد"}</span>
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">نوع الشحنة</span>
              <span className="font-medium text-[#1a365d]">{values.paymentMethod == "Prepaid" ? "الدفع مسبق" :"الدفع عند الأستلام" }</span>
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">حجم الطرد</span>
              {values.dimension_width ?
              <span className="font-medium text-[#1a365d] ">{values.dimension_high} * {values.dimension_length} * {values.dimension_width} </span>
             :<span className="font-medium text-[#1a365d] ">غير محدد</span> }
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">الوزن</span>
              <span className="font-medium text-[#1a365d]">{values.weight || "غير محدد"}</span>
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">عدد الصناديق</span>
              <span className="font-medium text-[#1a365d]">{values.Parcels || "غير محدد"}</span>
            </div>
            <div className="flex justify-between items-center  py-3 border-b border-[#3498db]/10">
              <span className="text-[#6d6a67] font-medium">خدمة التوصيل</span>
              <span className="font-medium text-[#1a365d]">
                {values.company == "omniclama" ? "lamabox" : values.company  || "غير محدد"}
              </span>
            </div>
            <div className="flex justify-between items-center  py-4 text-xl font-bold">
              <span className="text-[#1a365d]">سعر البوليصة</span>
              <span className="text-[#3498db] px-3 py-1.5 rounded-lg inline-flex items-center">
              {values.total  || "غير محدد"} ريال
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
