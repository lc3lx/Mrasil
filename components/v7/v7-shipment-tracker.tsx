"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Package, CheckCircle, Truck, MapPin } from "lucide-react"

interface V7ShipmentTrackerProps {
  theme: "light" | "dark"
}

export function V7ShipmentTracker({ theme }: V7ShipmentTrackerProps) {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = () => {
    if (trackingNumber) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setIsTracking(true)
      }, 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="v7-neu-input-container flex-1">
          <input
            type="text"
            placeholder="أدخل رقم الشحنة"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="v7-neu-input w-full"
          />
        </div>
        <Button onClick={handleTrack} className="v7-neu-button-accent" disabled={isLoading}>
          {isLoading ? (
            <div className="flex space-x-1">
              <div className="v7-loading-dot h-2 w-2 rounded-full bg-white"></div>
              <div className="v7-loading-dot h-2 w-2 rounded-full bg-white"></div>
              <div className="v7-loading-dot h-2 w-2 rounded-full bg-white"></div>
            </div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isTracking && (
        <div className="mt-4 rounded-xl v7-neu-card-inset p-4 v7-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">شحنة #1001</div>
            <div className="v7-badge bg-amber-100 text-amber-600">جاري التوصيل</div>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#6d6a67]" />
              <span>الرياض</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-[#6d6a67]" />
              <span>جدة</span>
            </div>
          </div>

          <div className="relative space-y-0">
            <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="relative flex items-center gap-3 pb-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">تم استلام الشحنة</div>
                <div className="text-xs text-[#6d6a67]">15 أبريل، 10:30 ص</div>
              </div>
            </div>

            <div className="relative flex items-center gap-3 pb-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">غادرت المستودع</div>
                <div className="text-xs text-[#6d6a67]">15 أبريل، 2:45 م</div>
              </div>
            </div>

            <div className="relative flex items-center gap-3 pb-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 v7-pulse">
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium">جاري التوصيل</div>
                <div className="text-xs text-[#6d6a67]">16 أبريل، 9:15 ص</div>
              </div>
            </div>

            <div className="relative flex items-center gap-3">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#6d6a67]">تم التسليم</div>
                <div className="text-xs text-[#6d6a67]">قريباً</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isTracking && (
        <div className="flex flex-col items-center justify-center rounded-xl v7-neu-card-inset p-6 text-center">
          <Package className="mb-2 h-10 w-10 text-[#6d6a67]" />
          <p className="text-sm text-[#6d6a67]">أدخل رقم الشحنة لمعرفة حالتها وموقعها الحالي</p>
        </div>
      )}
    </div>
  )
}
