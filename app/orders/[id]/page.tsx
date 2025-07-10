"use client"

import { useState } from "react"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import {
  ArrowLeft,
  Printer,
  Download,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
  Package,
  CreditCard,
  FileText,
  MessageSquare,
  User,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

// Mock data for the order
const orderData = {
  id: "ORD-12345",
  date: "2023-04-15",
  status: "completed",
  shippingStatus: "delivered",
  customer: {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
  },
  items: [
    { id: 1, name: "هاتف ذكي", sku: "SKU-001", quantity: 1, price: 1999, total: 1999 },
    { id: 2, name: "سماعات لاسلكية", sku: "SKU-002", quantity: 2, price: 299, total: 598 },
    { id: 3, name: "شاحن سريع", sku: "SKU-003", quantity: 1, price: 99, total: 99 },
  ],
  shipping: {
    method: "توصيل سريع",
    trackingNumber: "TRK-987654",
    cost: 25,
    address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
    estimatedDelivery: "2023-04-18",
  },
  payment: {
    method: "بطاقة ائتمان",
    status: "مدفوع",
    transactionId: "TXN-123456",
    subtotal: 2696,
    tax: 135,
    shipping: 25,
    discount: 50,
    total: 2806,
  },
  timeline: [
    { date: "2023-04-15 09:30", status: "تم إنشاء الطلب", icon: "FileText" },
    { date: "2023-04-15 10:15", status: "تم تأكيد الدفع", icon: "CreditCard" },
    { date: "2023-04-16 11:20", status: "قيد التجهيز", icon: "Package" },
    { date: "2023-04-17 08:45", status: "تم الشحن", icon: "TruckIcon" },
    { date: "2023-04-18 14:30", status: "تم التوصيل", icon: "CheckCircle" },
  ],
  notes: "يرجى التوصيل في الفترة المسائية بعد الساعة 4 مساءً",
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  // تحديث دالة StatusBadge لتستخدم نظام الألوان الموحد
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-slate-50"
    let textColor = "text-slate-700"
    let borderColor = "border-slate-200"
    let icon = <Clock className="w-4 h-4 mr-1" />

    if (status === "completed" || status === "delivered") {
      bgColor = "bg-emerald-50"
      textColor = "text-emerald-700"
      borderColor = "border-emerald-200"
      icon = <CheckCircle className="w-4 h-4 mr-1" />
    } else if (status === "cancelled") {
      bgColor = "bg-rose-50"
      textColor = "text-rose-700"
      borderColor = "border-rose-200"
      icon = <XCircle className="w-4 h-4 mr-1" />
    } else if (status === "processing") {
      bgColor = "bg-sky-50"
      textColor = "text-sky-700"
      borderColor = "border-sky-200"
      icon = <Clock className="w-4 h-4 mr-1" />
    } else if (status === "shipped") {
      bgColor = "bg-indigo-50"
      textColor = "text-indigo-700"
      borderColor = "border-indigo-200"
      icon = <TruckIcon className="w-4 h-4 mr-1" />
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor} ${textColor} border-${borderColor}`}
      >
        {icon}
        {status === "completed"
          ? "مكتمل"
          : status === "processing"
            ? "قيد التنفيذ"
            : status === "cancelled"
              ? "ملغي"
              : status === "delivered"
                ? "تم التوصيل"
                : status === "shipped"
                  ? "تم الشحن"
                  : status}
      </span>
    )
  }

  // Timeline icon component
  const TimelineIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "FileText":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-green-500" />
      case "Package":
        return <Package className="w-5 h-5 text-yellow-500" />
      case "TruckIcon":
        return <TruckIcon className="w-5 h-5 text-purple-500" />
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <V7Layout>
      <V7Content>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
              <Link href="/orders" className="v7-neu-button-flat p-2 rounded-full mr-3">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold">تفاصيل الطلب #{params.id}</h1>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{orderData.date}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              <button className="v7-neu-button-flat px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center text-sm">
                <Printer className="w-4 h-4 mr-1 md:mr-2" />
                <span>طباعة</span>
              </button>
              <button className="v7-neu-button-flat px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center text-sm">
                <Download className="w-4 h-4 mr-1 md:mr-2" />
                <span>تصدير PDF</span>
              </button>
              <button className="v7-neu-button px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center text-sm">
                <Edit className="w-4 h-4 mr-1 md:mr-2" />
                <span>تعديل</span>
              </button>
            </div>
          </div>

          {/* Order Status */}
          <div className="v7-neu-card p-4 md:p-6 mb-4 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="mb-2 md:mb-0">
                <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">حالة الطلب</h2>
                <div className="flex items-center">
                  <StatusBadge status={orderData.status} />
                </div>
              </div>
              <div className="mb-2 md:mb-0">
                <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">حالة الشحن</h2>
                <div className="flex items-center">
                  <StatusBadge status={orderData.shippingStatus} />
                </div>
              </div>
              <div className="mb-2 md:mb-0">
                <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">رقم التتبع</h2>
                <div className="flex items-center">
                  <span className="text-blue-500 font-medium">{orderData.shipping.trackingNumber}</span>
                </div>
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-1 md:mb-2">المبلغ الإجمالي</h2>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-1" />
                  <span className="text-lg md:text-xl font-bold">{orderData.payment.total} ر.س</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
            <nav className="flex space-x-4 md:space-x-8 rtl:space-x-reverse min-w-max">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                تفاصيل الطلب
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === "customer"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                معلومات العميل
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === "shipping"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                الشحن والتوصيل
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === "timeline"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                سجل الطلب
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === "details" && (
              <div>
                {/* Order Items */}
                <div className="v7-neu-card p-4 md:p-6 mb-4 md:mb-6">
                  <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">المنتجات</h2>
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 md:px-0">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              المنتج
                            </th>
                            <th
                              scope="col"
                              className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              رمز المنتج
                            </th>
                            <th
                              scope="col"
                              className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الكمية
                            </th>
                            <th
                              scope="col"
                              className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              السعر
                            </th>
                            <th
                              scope="col"
                              className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              الإجمالي
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orderData.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                    <Package className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                                  </div>
                                  <div className="mr-2 md:mr-4">
                                    <div className="text-xs md:text-sm font-medium text-gray-900">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                                {item.sku}
                              </td>
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                                {item.price} ر.س
                              </td>
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                                {item.total} ر.س
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="v7-neu-card p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">معلومات الدفع</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <div className="mb-3 md:mb-4">
                        <span className="block text-xs md:text-sm font-medium text-gray-500 mb-1">طريقة الدفع</span>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mr-2" />
                          <span className="text-sm md:text-base">{orderData.payment.method}</span>
                        </div>
                      </div>
                      <div className="mb-3 md:mb-4">
                        <span className="block text-xs md:text-sm font-medium text-gray-500 mb-1">حالة الدفع</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {orderData.payment.status}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs md:text-sm font-medium text-gray-500 mb-1">رقم العملية</span>
                        <span className="text-sm md:text-base">{orderData.payment.transactionId}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg mt-3 md:mt-0">
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">المجموع الفرعي</span>
                        <span>{orderData.payment.subtotal} ر.س</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">الضريبة (5%)</span>
                        <span>{orderData.payment.tax} ر.س</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">تكلفة الشحن</span>
                        <span>{orderData.payment.shipping} ر.س</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">الخصم</span>
                        <span className="text-red-500">- {orderData.payment.discount} ر.س</span>
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm md:text-base">
                        <span>الإجمالي</span>
                        <span>{orderData.payment.total} ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "customer" && (
              <div className="v7-neu-card p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{orderData.customer.name}</h2>
                    <p className="text-gray-500">عميل منذ 2022</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">معلومات الاتصال</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="mr-3">
                          <p className="text-sm font-medium text-gray-900">الاسم</p>
                          <p className="text-sm text-gray-500">{orderData.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="mr-3">
                          <p className="text-sm font-medium text-gray-900">البريد الإلكتروني</p>
                          <p className="text-sm text-gray-500">{orderData.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="mr-3">
                          <p className="text-sm font-medium text-gray-900">رقم الهاتف</p>
                          <p className="text-sm text-gray-500">{orderData.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">عنوان التوصيل</h3>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="mr-3">
                        <p className="text-sm text-gray-500">{orderData.customer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="v7-neu-card p-6">
                <h2 className="text-lg font-semibold mb-4">معلومات الشحن والتوصيل</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 mb-1">طريقة الشحن</span>
                      <div className="flex items-center">
                        <TruckIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span>{orderData.shipping.method}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 mb-1">رقم التتبع</span>
                      <span className="text-blue-500 font-medium">{orderData.shipping.trackingNumber}</span>
                    </div>
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-500 mb-1">تكلفة الشحن</span>
                      <span>{orderData.shipping.cost} ر.س</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500 mb-1">تاريخ التوصيل المتوقع</span>
                      <span>{orderData.shipping.estimatedDelivery}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-1">عنوان التوصيل</span>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <p className="mr-3 text-gray-700">{orderData.shipping.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Status Tracker */}
                <div className="mt-6 md:mt-8">
                  <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">حالة الشحن</h3>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-1">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <FileText className="w-3 h-3 md:w-5 md:h-5 text-green-600" />
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">تم الطلب</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-1">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Package className="w-3 h-3 md:w-5 md:h-5 text-green-600" />
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">قيد التجهيز</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-1">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <TruckIcon className="w-3 h-3 md:w-5 md:h-5 text-green-600" />
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">تم الشحن</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-1">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-green-600" />
                          </div>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2">تم التوصيل</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="v7-neu-card p-6">
                <h2 className="text-lg font-semibold mb-4">سجل الطلب</h2>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {orderData.timeline.map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== orderData.timeline.length - 1 ? (
                            <span
                              className="absolute top-4 right-4 -mr-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                          ) : null}
                          <div className="relative flex space-x-3 rtl:space-x-reverse">
                            <div>
                              <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100">
                                <TimelineIcon icon={event.icon} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 rtl:space-x-reverse">
                              <div>
                                <p className="text-sm text-gray-500">{event.status}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={event.date}>{event.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notes */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">ملاحظات</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="mr-3">
                        <p className="text-sm text-yellow-700">{orderData.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
