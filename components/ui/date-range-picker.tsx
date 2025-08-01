"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { ar } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  variant?: "default" | "compact" | "sidebar"
  align?: "start" | "center" | "end"
  sideOffset?: number
  placeholder?: string
  buttonClassName?: string
  calendarClassName?: string
  showSaveButton?: boolean
  numberOfMonths?: number
  isInFilters?: boolean
}

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
  variant = "default",
  align = "start",
  sideOffset = 4,
  placeholder = "اختر تاريخ",
  buttonClassName,
  calendarClassName,
  showSaveButton = true,
  numberOfMonths = 2,
  isInFilters = false,
  ...props
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    dateRange || {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
  )

  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
  const [open, setOpen] = React.useState(false)

  const handleDateChange = (newDate: DateRange | undefined) => {
    setTempDate(newDate)
    if (!showSaveButton || variant === "sidebar") {
      setDate(newDate)
      if (onDateRangeChange) {
        onDateRangeChange(newDate)
      }

      // إغلاق تلقائي للقائمة المنسدلة عند استخدام نمط السايدبار والاختيار المباشر
      if (variant === "sidebar" && newDate?.from && newDate.to) {
        setTimeout(() => setOpen(false), 300)
      }
    }
  }

  const handleSave = () => {
    setDate(tempDate)
    if (onDateRangeChange) {
      onDateRangeChange(tempDate)
    }
    setOpen(false)
  }

  // دوال للاختيارات السريعة
  const selectToday = () => {
    const today = new Date()
    const newRange = { from: today, to: today }
    setTempDate(newRange)
    setDate(newRange)
    if (onDateRangeChange) {
      onDateRangeChange(newRange)
    }
    setOpen(false)
  }

  const selectThisWeek = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // الأحد كبداية الأسبوع
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // السبت كنهاية الأسبوع

    const newRange = { from: startOfWeek, to: endOfWeek }
    setTempDate(newRange)
    setDate(newRange)
    if (onDateRangeChange) {
      onDateRangeChange(newRange)
    }
    setOpen(false)
  }

  const selectThisMonth = () => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const newRange = { from: startOfMonth, to: endOfMonth }
    setTempDate(newRange)
    setDate(newRange)
    if (onDateRangeChange) {
      onDateRangeChange(newRange)
    }
    setOpen(false)
  }

  React.useEffect(() => {
    if (open) {
      setTempDate(date)
    }
  }, [open, date])

  // تحديد أنماط مختلفة بناءً على الخيار المحدد
  const getButtonStyles = () => {
    switch (variant) {
      case "compact":
        return "py-1 px-2 h-8 text-xs"
      case "sidebar":
        return "w-full justify-between text-right py-2 text-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
      default:
        return "w-full justify-start text-right font-normal v7-neu-input"
    }
  }

  // تحديد عدد الأشهر بناءً على الخيار المحدد
  const getMonthsCount = () => {
    switch (variant) {
      case "compact":
      case "sidebar":
        return 1
      default:
        return numberOfMonths
    }
  }

  // التحقق من المسار الحالي
  const pathname = usePathname() || ""

  // التحقق من الأقسام المختلفة
  const isCreateShipmentSection = pathname.includes("/create-shipment")
  const isCustomizeReturnPage = pathname.includes("/returns/customize")
  const isAutomationSection = pathname.includes("/automation")
  const isApiSection = pathname.includes("/api")
  const isCarriersSection = pathname.includes("/carriers")
  const isStoreDeliverySection = pathname.includes("/store-delivery") || pathname.includes("/stores")
  const isWebhooksSection = pathname.includes("/webhooks")
  const isTrackingSection = pathname.includes("/tracking")
  const isCustomTrackingPage = pathname.includes("/custom-tracking") // إضافة تحقق جديد لقسم تخصيص التتبع
  const isHiddenSection = pathname.includes("/hidden-section") // استبدل "/hidden-section" بالمسار الذي تريد إخفاء منتقي التاريخ منه

  // إذا كنا في أحد الأقسام التي لا تحتاج منتقي التاريخ، أو إذا كان المكون موجوداً في قسم الفلاتر، نعيد div فارغ
  if (
    isCreateShipmentSection ||
    isCustomizeReturnPage ||
    isAutomationSection ||
    isStoreDeliverySection ||
    isApiSection ||
    isCarriersSection ||
    isWebhooksSection ||
    isTrackingSection ||
    isCustomTrackingPage ||
    isHiddenSection // إضافة شرط للتحقق إذا كان المكون موجوداً في قسم الفلاتر
  ) {
    return <div className={className} {...props}></div>
  }

  // If the component is in filters section, return an empty div
  if (isInFilters) {
    return <div className={className} {...props}></div>
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(getButtonStyles(), !date && "text-muted-foreground", "!bg-[#EFF2F7]", buttonClassName)}
          >
            <CalendarIcon className={cn("ml-2 h-4 w-4", variant === "sidebar" && "ml-0 mr-2")} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ar })} - {format(date.to, "LLL dd, y", { locale: ar })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ar })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-auto p-0", variant === "sidebar" && "w-[280px]")}
          align={align}
          sideOffset={sideOffset}
        >
          <div className="space-y-4 p-0">
            {variant === "sidebar" && (
              <div className="flex flex-wrap gap-1 p-2 border-b text-xs">
                <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={selectToday}>
                  اليوم
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={selectThisWeek}>
                  هذا الأسبوع
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={selectThisMonth}>
                  هذا الشهر
                </Button>
              </div>
            )}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempDate?.from}
              selected={tempDate}
              onSelect={handleDateChange}
              numberOfMonths={getMonthsCount()}
              locale={ar}
              className={calendarClassName}
            />
            {showSaveButton && (
              <div className="flex items-center justify-end gap-2 border-t p-3">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button size="sm" onClick={handleSave} className="v7-neu-button">
                  حفظ
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
