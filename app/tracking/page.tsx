"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Package, MapPin, Calendar, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react"
import V7Layout from "@/components/v7/v7-layout"

interface TimelineStep {
  status: string
  date: string
  time: string
  completed: boolean
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTracking = () => {
    if (!trackingNumber.trim()) {
      setError("الرجاء إدخال رقم الشحنة")
      return
    }

    setIsTracking(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (trackingNumber === "SE1002202504") {
        setTrackingResult({
          id: 1002,
          trackingNumber: "SE1002202504",
          status: "transit",
          from: "الدمام",
          to: "الرياض",
          customer: "محمد أحمد",
          date: "16 أبريل 2025",
          estimatedDelivery: "17 أبريل 2025",
          weight: "2.5 كجم",
          service: "توصيل سريع",
          timeline: [
            { status: "تم استلام الطلب", date: "15 أبريل 2025", time: "09:30 ص", completed: true },
            { status: "تم تجهيز الشحنة", date: "15 أبريل 2025", time: "02:45 م", completed: true },
            { status: "الشحنة في الطريق", date: "16 أبريل 2025", time: "10:15 ص", completed: true },
            { status: "وصلت إلى مركز التوزيع", date: "16 أبريل 2025", time: "04:30 م", completed: true },
            { status: "جاري توصيل الشحنة", date: "17 أبريل 2025", time: "09:00 ص", completed: false },
            { status: "تم التسليم", date: "17 أبريل 2025", time: "12:00 م", completed: false },
          ],
        })
      } else if (trackingNumber === "SE1001202504") {
        setTrackingResult({
          id: 1001,
          trackingNumber: "SE1001202504",
          status: "delivered",
          from: "الرياض",
          to: "جدة",
          customer: "أحمد محمد",
          date: "15 أبريل 2025",
          estimatedDelivery: "تم التسليم",
          weight: "1.8 كجم",
          service: "توصيل عادي",
          timeline: [
            { status: "تم استلام الطلب", date: "13 أبريل 2025", time: "10:30 ص", completed: true },
            { status: "تم تجهيز الشحنة", date: "13 أبريل 2025", time: "03:15 م", completed: true },
            { status: "الشحنة في الطريق", date: "14 أبريل 2025", time: "09:45 ص", completed: true },
            { status: "وصلت إلى مركز التوزيع", date: "14 أبريل 2025", time: "05:30 م", completed: true },
            { status: "جاري توصيل الشحنة", date: "15 أبريل 2025", time: "10:00 ص", completed: true },
            { status: "تم التسليم", date: "15 أبريل 2025", time: "01:30 م", completed: true },
          ],
        })
      } else {
        setError("لم يتم العثور على شحنة بهذا الرقم")
        setTrackingResult(null)
      }
      setIsTracking(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500"
      case "transit":
        return "text-amber-500"
      case "processing":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم"
      case "transit":
        return "جاري التوصيل"
      case "processing":
        return "قيد المعالجة"
      case "ready":
        return "جاهز للشحن"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "transit":
        return <Truck className="h-6 w-6 text-amber-500" />
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />
      case "ready":
        return <Package className="h-6 w-6 text-purple-500" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <V7Layout>
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-2xl font-bold text-[#3498db]">تتبع الشحنات</h1>
          <p className="text-sm text-[#6d6a67]">تتبع شحناتك ومعرفة حالتها الحالية</p>
        </div>

        <div className="v7-neu-card p-6 rounded-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#3498db]">أدخل رقم الشحنة</h2>
            <p className="text-sm text-[#6d6a67]">أدخل رقم الشحنة المكون من 12 رقم للتتبع</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 v7-neu-input-container">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="مثال: SE1002202504"
                className="v7-neu-input w-full pl-12 text-right"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTracking()}
              />
            </div>
            <Button 
              className="v7-neu-button w-full md:w-auto px-6 py-3 bg-[#3498db] hover:bg-[#2980b9] text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-lg shadow-lg hover:shadow-xl dark:bg-[#2c3e50] dark:hover:bg-[#34495e] dark:text-white"
              onClick={handleTracking} 
              disabled={isTracking}
            >
              {isTracking ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري البحث...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>تتبع الشحنة</span>
                </div>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-500 p-4 rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {trackingResult && (
            <div className="mt-8 space-y-6 v7-fade-in">
              <div className="flex flex-col md:flex-row justify-between gap-6 p-6 rounded-xl v7-neu-card-inner">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="v7-neu-icon">{getStatusIcon(trackingResult.status)}</div>
                  <div>
                    <div className="text-sm text-[#6d6a67]">رقم الشحنة</div>
                    <div className="text-lg font-bold">{trackingResult.trackingNumber}</div>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-sm text-[#6d6a67]">حالة الشحنة</div>
                  <div className={`text-lg font-bold ${getStatusColor(trackingResult.status)}`}>
                    {getStatusText(trackingResult.status)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl v7-neu-card-inner space-y-4">
                  <h3 className="text-lg font-bold text-[#3498db]">تفاصيل الشحنة</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">من</span>
                      </div>
                      <div className="font-medium">{trackingResult.from}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">إلى</span>
                      </div>
                      <div className="font-medium">{trackingResult.to}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">تاريخ الشحن</span>
                      </div>
                      <div className="font-medium">{trackingResult.date}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">موعد التسليم المتوقع</span>
                      </div>
                      <div className="font-medium">{trackingResult.estimatedDelivery}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">الوزن</span>
                      </div>
                      <div className="font-medium">{trackingResult.weight}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#6d6a67]" />
                        <span className="text-sm text-[#6d6a67]">نوع الخدمة</span>
                      </div>
                      <div className="font-medium">{trackingResult.service}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl v7-neu-card-inner">
                  <h3 className="text-lg font-bold text-[#3498db] mb-4">مسار الشحنة</h3>

                  <div className="relative">
                    <div className="absolute top-0 bottom-0 right-[19px] w-[2px] bg-gray-200"></div>

                    <div className="space-y-6">
                      {trackingResult.timeline.map((step: TimelineStep, index: number) => (
                        <div key={index} className="relative flex gap-4 group hover:bg-[#3498db] rounded-lg p-2 transition-all duration-200 cursor-pointer">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                              step.completed ? "bg-[#3498db] text-white" : "v7-neu-icon-sm text-[#6d6a67]"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-[#6d6a67]"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-white transition-colors duration-200">{step.status}</div>
                            <div className="text-sm text-[#6d6a67] group-hover:text-white/80 transition-colors duration-200">
                              {step.date} - {step.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </V7Layout>
  )
}
