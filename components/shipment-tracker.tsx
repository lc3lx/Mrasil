"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package, CheckCircle, Truck, MapPin } from "lucide-react"

export function ShipmentTracker() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isTracking, setIsTracking] = useState(false)

  const handleTrack = () => {
    if (trackingNumber) {
      setIsTracking(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="أدخل رقم الشحنة"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="rounded-xl"
        />
        <Button onClick={handleTrack} className="primary-gradient button-hover rounded-xl">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isTracking && (
        <div className="mt-4 rounded-xl border bg-accent p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-medium">شحنة #1001</div>
            <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">جاري التوصيل</div>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>الرياض</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>جدة</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">تم استلام الشحنة</div>
                <div className="text-xs text-muted-foreground">15 أبريل، 10:30 ص</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium">غادرت المستودع</div>
                <div className="text-xs text-muted-foreground">15 أبريل، 2:45 م</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <Truck className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium">جاري التوصيل</div>
                <div className="text-xs text-muted-foreground">16 أبريل، 9:15 ص</div>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-40">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <div className="text-sm font-medium">تم التسليم</div>
                <div className="text-xs text-muted-foreground">قريباً</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isTracking && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
          <Package className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">أدخل رقم الشحنة لمعرفة حالتها وموقعها الحالي</p>
        </div>
      )}
    </div>
  )
}
