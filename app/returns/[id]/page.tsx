"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  MapPin,
  Package,
  Printer,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  User,
  X,
  AlertTriangle,
  ImageIcon,
} from "lucide-react"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { routes } from "@/lib/routes"

// بيانات وهمية لطلب الرجيع
const getReturnData = (id: string) => {
  return {
    id,
    status: "processing", // pending, processing, approved, rejected, completed
    statusText: "قيد المعالجة",
    createdAt: "2023-04-15T10:30:00",
    updatedAt: "2023-04-16T14:20:00",
    returnReason: "المنتج مختلف عن الوصف",
    returnMethod: "استلام من المنزل",
    refundMethod: "إعادة المبلغ إلى البطاقة الأصلية",
    refundAmount: 245.5,
    currency: "ريال",
    originalOrder: {
      id: "ORD-78952",
      date: "2023-03-28T09:15:00",
    },
    customer: {
      id: "CUST-45678",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+966501234567",
    },
    address: {
      street: "شارع الملك فهد",
      city: "الرياض",
      state: "منطقة الرياض",
      postalCode: "12345",
      country: "المملكة العربية السعودية",
    },
    items: [
      {
        id: "ITEM-001",
        name: "سماعات لاسلكية",
        sku: "SKU-8745",
        quantity: 1,
        price: 199.0,
        returnReason: "منتج معيب",
        condition: "مفتوح العلبة",
        image: "/diverse-headphones.png",
      },
      {
        id: "ITEM-002",
        name: "شاحن سريع",
        sku: "SKU-5421",
        quantity: 1,
        price: 46.5,
        returnReason: "المنتج لا يعمل",
        condition: "مفتوح العلبة",
        image: "/electronic-charger-variety.png",
      },
    ],
    timeline: [
      {
        date: "2023-04-15T10:30:00",
        status: "تم إنشاء طلب الرجيع",
        description: "تم استلام طلب الرجيع وإضافته إلى النظام",
      },
      {
        date: "2023-04-15T14:45:00",
        status: "تمت الموافقة على الطلب",
        description: "تمت مراجعة الطلب والموافقة عليه",
      },
      {
        date: "2023-04-16T09:20:00",
        status: "تم جدولة الاستلام",
        description: "تم جدولة استلام المنتجات من العنوان المحدد",
      },
      {
        date: "2023-04-16T14:20:00",
        status: "قيد المعالجة",
        description: "جاري معالجة طلب الرجيع",
      },
    ],
    notes: "العميل يفضل الاستلام في الفترة المسائية بعد الساعة 4 مساءً",
    documents: [
      {
        name: "صورة المنتج التالف.jpg",
        type: "image",
        size: "2.4 MB",
        url: "/documents/damaged-product.jpg",
      },
      {
        name: "فاتورة الشراء الأصلية.pdf",
        type: "pdf",
        size: "1.2 MB",
        url: "/documents/original-invoice.pdf",
      },
      {
        name: "تقرير حالة المنتج.pdf",
        type: "pdf",
        size: "3.1 MB",
        url: "/documents/product-condition-report.pdf",
      },
    ],
  }
}

// مكون لعرض حالة الرجيع مع لون مناسب
const ReturnStatusBadge = ({ status, text }: { status: string; text: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "approved":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 ml-1" />
      case "processing":
        return <RefreshCw className="w-4 h-4 ml-1" />
      case "approved":
        return <CheckCircle className="w-4 h-4 ml-1" />
      case "rejected":
        return <X className="w-4 h-4 ml-1" />
      case "completed":
        return <ShieldCheck className="w-4 h-4 ml-1" />
      default:
        return <Clock className="w-4 h-4 ml-1" />
    }
  }

  return (
    <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{text}</span>
    </div>
  )
}

// مكون لعرض خط زمني للرجيع
const ReturnTimeline = ({ timeline }: { timeline: any[] }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">التحديثات</h3>
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex">
            <div className="ml-4 flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-300 mt-1"></div>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium text-blue-700">{item.status}</h4>
                <time className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleString("ar-SA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// مكون لعرض معلومات العميل والعنوان
const CustomerInfo = ({ customer, address }: { customer: any; address: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-lg p-4 shadow-neumorphism">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-blue-500 ml-2" />
          <h3 className="text-lg font-semibold">معلومات العميل</h3>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-medium">الاسم:</span> {customer.name}
          </p>
          <p>
            <span className="font-medium">البريد الإلكتروني:</span> {customer.email}
          </p>
          <p>
            <span className="font-medium">رقم الهاتف:</span> {customer.phone}
          </p>
          <p>
            <span className="font-medium">رقم العميل:</span> {customer.id}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-neumorphism">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-blue-500 ml-2" />
          <h3 className="text-lg font-semibold">عنوان الاستلام</h3>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-medium">الشارع:</span> {address.street}
          </p>
          <p>
            <span className="font-medium">المدينة:</span> {address.city}
          </p>
          <p>
            <span className="font-medium">المنطقة:</span> {address.state}
          </p>
          <p>
            <span className="font-medium">الرمز البريدي:</span> {address.postalCode}
          </p>
          <p>
            <span className="font-medium">الدولة:</span> {address.country}
          </p>
        </div>
      </div>
    </div>
  )
}

// مكون لعرض المنتجات المرتجعة
const ReturnItems = ({ items }: { items: any[] }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <Package className="w-5 h-5 text-blue-500 ml-2" />
        <h3 className="text-lg font-semibold">المنتجات المرتجعة</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-right border-b">المنتج</th>
              <th className="p-3 text-right border-b">رقم المنتج</th>
              <th className="p-3 text-right border-b">الكمية</th>
              <th className="p-3 text-right border-b">السعر</th>
              <th className="p-3 text-right border-b">سبب الإرجاع</th>
              <th className="p-3 text-right border-b">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover ml-3"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">{item.price.toFixed(2)} ريال</td>
                <td className="p-3">{item.returnReason}</td>
                <td className="p-3">{item.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// مكون لعرض معلومات الرجيع والطلب الأصلي
const ReturnInfo = ({ returnData }: { returnData: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-lg p-4 shadow-neumorphism">
        <div className="flex items-center mb-4">
          <RotateCcw className="w-5 h-5 text-blue-500 ml-2" />
          <h3 className="text-lg font-semibold">معلومات الرجيع</h3>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-medium">رقم طلب الرجيع:</span> {returnData.id}
          </p>
          <p>
            <span className="font-medium">تاريخ الإنشاء:</span> {new Date(returnData.createdAt).toLocaleString("ar-SA")}
          </p>
          <p>
            <span className="font-medium">سبب الرجيع:</span> {returnData.returnReason}
          </p>
          <p>
            <span className="font-medium">طريقة الرجيع:</span> {returnData.returnMethod}
          </p>
          <p>
            <span className="font-medium">طريقة استرداد المبلغ:</span> {returnData.refundMethod}
          </p>
          <p>
            <span className="font-medium">المبلغ المسترد:</span> {returnData.refundAmount.toFixed(2)}{" "}
            {returnData.currency}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-neumorphism">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-blue-500 ml-2" />
          <h3 className="text-lg font-semibold">الطلب الأصلي</h3>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-medium">رقم الطلب:</span> {returnData.originalOrder.id}
          </p>
          <p>
            <span className="font-medium">تاريخ الطلب:</span>{" "}
            {new Date(returnData.originalOrder.date).toLocaleString("ar-SA")}
          </p>
          <div className="mt-4">
            <button
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => window.open(`/orders/${returnData.originalOrder.id.replace("ORD-", "")}`)}
            >
              <span>عرض تفاصيل الطلب الأصلي</span>
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// إضافة قسم للمستندات والملفات المرفقة
const ReturnDocuments = ({ documents }: { documents: any[] }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 text-blue-500 ml-2" />
        <h3 className="text-lg font-semibold">المستندات والملفات المرفقة</h3>
      </div>
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-neumorphism flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center ml-3">
                {doc.type === "image" ? (
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                ) : doc.type === "pdf" ? (
                  <FileText className="w-5 h-5 text-red-600" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.size}</p>
              </div>
              <button
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => window.open(doc.url, "_blank")}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">لا توجد مستندات مرفقة لهذا الطلب</div>
      )}
    </div>
  )
}

// مكون لعرض الإجراءات المتاحة
const ReturnActions = ({ status }: { status: string }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [action, setAction] = useState("")

  const handleAction = (actionType: string) => {
    setAction(actionType)
    setShowConfirmation(true)
  }

  const confirmAction = () => {
    // هنا يمكن تنفيذ الإجراء الفعلي
    alert(`تم تنفيذ الإجراء: ${action}`)
    setShowConfirmation(false)
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-3">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-neumorphism-sm"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 ml-2" />
          <span>طباعة التفاصيل</span>
        </button>

        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-neumorphism-sm"
          onClick={() => handleAction("طباعة ملصق الشحن")}
        >
          <Download className="w-4 h-4 ml-2" />
          <span>طباعة ملصق الشحن</span>
        </button>

        {status === "pending" && (
          <button
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-neumorphism-sm"
            onClick={() => handleAction("إلغاء طلب الرجيع")}
          >
            <X className="w-4 h-4 ml-2" />
            <span>إلغاء طلب الرجيع</span>
          </button>
        )}

        {status === "processing" && (
          <button
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow-neumorphism-sm"
            onClick={() => handleAction("تحديث حالة الطلب")}
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            <span>تحديث حالة الطلب</span>
          </button>
        )}

        <button
          className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors shadow-neumorphism-sm"
          onClick={() => handleAction("إرسال تذكير للعميل")}
        >
          <Send className="w-4 h-4 ml-2" />
          <span>إرسال تذكير للعميل</span>
        </button>
      </div>

      {/* نافذة تأكيد الإجراء */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 ml-2" />
              <h3 className="text-lg font-semibold">تأكيد الإجراء</h3>
            </div>
            <p className="mb-6">هل أنت متأكد من رغبتك في {action}؟</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setShowConfirmation(false)}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={confirmAction}
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// الصفحة الرئيسية لتفاصيل الرجيع
export default function ReturnDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const returnId = params.id as string
  const returnData = getReturnData(returnId)

  return (
    <V7Layout>
      <V7Content>
        <div className="p-6">
          {/* رأس الصفحة مع زر العودة */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button
                onClick={() => router.push(routes.returns)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors ml-4"
              >
                <ArrowRight className="w-5 h-5 ml-1" />
                <span>العودة إلى قائمة المرتجعات</span>
              </button>
              <h1 className="text-2xl font-bold">تفاصيل طلب الرجيع #{returnId}</h1>
            </div>
            <ReturnStatusBadge status={returnData.status} text={returnData.statusText} />
          </div>

          {/* بطاقة المعلومات الرئيسية */}
          <div className="bg-white rounded-lg p-6 shadow-neumorphism">
            {/* معلومات الرجيع والطلب الأصلي */}
            <ReturnInfo returnData={returnData} />

            {/* المستندات والملفات المرفقة */}
            <ReturnDocuments documents={returnData.documents} />

            {/* معلومات العميل والعنوان */}
            <CustomerInfo customer={returnData.customer} address={returnData.address} />

            {/* المنتجات المرتجعة */}
            <ReturnItems items={returnData.items} />

            {/* ملاحظات */}
            {returnData.notes && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 ml-2" />
                  <h3 className="text-lg font-semibold">ملاحظات</h3>
                </div>
                <p className="text-gray-700">{returnData.notes}</p>
              </div>
            )}

            {/* خط زمني للتحديثات */}
            <ReturnTimeline timeline={returnData.timeline} />

            {/* الإجراءات المتاحة */}
            <ReturnActions status={returnData.status} />
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
