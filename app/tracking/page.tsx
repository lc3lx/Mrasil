"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Package, MapPin, Calendar, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react"
import V7Layout from "@/components/v7/v7-layout"
import axios from "axios";

interface TimelineStep {
  status: string
  date: string
  time: string
  completed: boolean
}
interface Tracking{
  trackingNumber:number
}

export default function () {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [error, setError] = useState("")
// API

 const [number, setNumber] = useState("");
  const [data, setData] = useState(null);

  const handleTrack = async () => {
    try {
      const res = await axios.post("https://backend-marasil.onrender.com/api/shipment/traking", {
        trackingNumber: number
      });
      setData(res.data); 
      console.log("DATA",data);
      
    } catch (err) {
      console.error("Error", err);
      setData(null);
    }
  }

// API
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
      <div className="space-y-8 pb-20 my-16">
        <div>
          <h1 className="text-2xl font-bold text-[#294D8B]">تتبع الشحنات</h1>
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
                // value={trackingNumber}
                // onChange={(e) => setTrackingNumber(e.target.value)}
                // onKeyDown={(e) => e.key === "Enter" && handleTracking()}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <Button 
              className="inline-flex items-center justify-center hover:text-white gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 v7-neu-button"
             onClick={handleTrack} 
              // disabled={isTracking}
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
                  <div className={`text-lg font-bold text-amber-500 ${getStatusColor(trackingResult.status)}`}>
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
                        <MapPin className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">من</span>
                      </div>
                      <div className="font-medium">{trackingResult.from}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">إلى</span>
                      </div>
                      <div className="font-medium">{trackingResult.to}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">تاريخ الشحن</span>
                      </div>
                      <div className="font-medium">{trackingResult.date}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">موعد التسليم المتوقع</span>
                      </div>
                      <div className="font-medium">{trackingResult.estimatedDelivery}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">الوزن</span>
                      </div>
                      <div className="font-medium">{trackingResult.weight}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gry" />
                        <span className="text-sm text-gry">نوع الخدمة</span>
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
                              step.completed ? "bg-[#3498db] text-white" : "v7-neu-icon-sm text-gry"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-gry"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-white transition-colors duration-200">{step.status}</div>
                            <div className="text-sm text-gry group-hover:text-white/80 transition-colors duration-200">
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
          <div>
          </div>
        <div className=" grid md:grid-cols-2 gap-6 mt-6">

        <div className=" p-6 rounded-xl v7-neu-card-inner">

            <h1 className="text-lg font-bold text-[#3498db] mb-4 ">معلومات المرسل</h1>
            <div className=" space-y-3 text-sm">

            <div className="flex justify-between">
              <span className=" text-[#6d6a67]">الاسم:</span>
              <span className=" text-[#1A5889] font-medium">شركة التجارة الإلكترونية</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-[#6d6a67]">الهاتف:</span>
              <span className=" text-[#1A5889] font-medium">+966 13 123 4567</span>
            </div>
            <div className="flex justify-between">
              <span className=" text-[#6d6a67]">العنوان:</span>
              <span className=" text-[#1A5889] font-medium">المنطقة الصناعية، الدمام</span>
            </div>
            </div>
              </div>
            <div className=" p-6 rounded-xl v7-neu-card-inner">
              
              <h1 className="text-lg font-bold text-[#3498db] mb-4">معلومات المستلم</h1>
              <div className=" space-y-3 text-sm">
                <div className="flex justify-between">

                <span className=" text-[#6d6a67]">الاسم:</span>
                <span className=" text-[#1A5889] font-medium">محمد أحمد</span> 
              </div>
              <div className="flex justify-between">
                <span className=" text-[#6d6a67]">الهاتف:</span>
                <span className=" text-[#1A5889] font-medium">+966 50 123 4567</span>
              </div>
              <div className="flex justify-between">
                <span className=" text-[#6d6a67]">العنوان:</span>
                <span className=" text-[#1A5889] font-medium">حي النزهة، شارع الأمير سلطان</span>
              </div>
              <div className="flex justify-between">
                <span className=" text-[#6d6a67]">المدينة:</span>
                <span className=" text-[#1A5889] font-medium">الرياض</span>
                </div>
              </div>
            </div>
        </div>
        </div>
      
          <div className="mt-8 v7-neu-card p-6 rounded-xl">
            <h1 className="text-xl font-bold text-[#3498db] mb-4">الشحنات الأخيرة</h1>
            <div className="flex items-center justify-between p-4 rounded-lg v7-neu-card-inner">
              <div className="flex items-center gap-3">
                 <div className="v7-neu-icon-sm">
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
  className="lucide lucide-circle-check-big h-6 w-6 text-green-500"
>
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
<path d="m9 11 3 3L22 4"></path>
</svg>                
                </div>
<div className=" flex flex-col">
                <span className="font-medium">SE1001202504</span>
                <span className="text-sm text-[#6d6a67]">الرياض ← جدة</span>
  </div>
              </div>
              <div className=" flex flex-col">
                <span className="text-sm font-medium text-green-500">تم التسليم</span>
                <span className="text-xs text-[#6d6a67]">18 أبريل</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg v7-neu-card-inner">
              <div className="flex items-center gap-3">

                 <div className="v7-neu-icon-sm">
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
  className="lucide lucide-package h-6 w-6 text-blue-500"
><path d="m7.5 4.27 9 5.15"></path>
  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
  <path d="m3.3 7 8.7 5 8.7-5"></path>

<path d="M12 22V12"></path>
</svg>       
  </div>

   <div className=" flex flex-col">
                <span className="font-medium">SE1001202504</span>
                <span className="text-sm text-[#6d6a67]">
جدة ← الدمام</span>
                </div>
              </div>
              <div className=" flex flex-col"> 
                <span className="text-sm font-medium text-blue-500">قيد المعالجة</span>
                <span className="text-xs text-[#6d6a67]">15 أبريل</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg v7-neu-card-inner">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm">

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
  className="lucide lucide-package h-6 w-6 text-purple-500"
><path d="m7.5 4.27 9 5.15"></path>
  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
  <path d="m3.3 7 8.7 5 8.7-5"></path>

<path d="M12 22V12"></path>
</svg>              
                </div>
  <div className=" flex flex-col">
                <span className="font-medium">SE1001202504</span>
                <span className="text-sm text-[#6d6a67]"> الرياض ← مكة </span>
  </div>
              </div>
              <div className=" flex flex-col">
                <span className="text-sm font-medium text-gray-500">جاهز للشحن </span>
                <span className="text-xs text-[#6d6a67]">17 أبريل</span>
              </div>
            </div>
          </div>
      </div>
    </V7Layout>
  )
}
