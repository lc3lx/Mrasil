// استبدال كامل المكون بتقرير تفاعلي بدلاً من الخريطة

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Filter,
  BarChart3,
  PieChart,
  Maximize2,
  Printer,
  ArrowUp,
  ArrowDown,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react"

// تعريف بيانات المناطق
const regionData = [
  { id: "riyadh", name: "الرياض", value: 35, growth: "+12%", deliveryTime: "1.2 يوم", position: [24.7136, 46.6753] },
  {
    id: "makkah",
    name: "مكة المكرمة",
    value: 28,
    growth: "+8%",
    deliveryTime: "1.5 يوم",
    position: [21.4225, 39.8262],
  },
  {
    id: "madinah",
    name: "المدينة المنورة",
    value: 15,
    growth: "+5%",
    deliveryTime: "1.8 يوم",
    position: [24.4539, 39.6142],
  },
  {
    id: "eastern",
    name: "المنطقة الشرقية",
    value: 22,
    growth: "+9%",
    deliveryTime: "1.4 يوم",
    position: [26.4207, 50.0888],
  },
  { id: "asir", name: "عسير", value: 18, growth: "+7%", deliveryTime: "2.1 يوم", position: [18.2164, 42.5053] },
  { id: "qassim", name: "القصيم", value: 12, growth: "+3%", deliveryTime: "1.6 يوم", position: [26.3088, 43.7695] },
  { id: "tabuk", name: "تبوك", value: 8, growth: "+2%", deliveryTime: "2.3 يوم", position: [28.3998, 36.5715] },
  { id: "hail", name: "حائل", value: 7, growth: "+1%", deliveryTime: "2.0 يوم", position: [27.5114, 41.7208] },
  { id: "jazan", name: "جازان", value: 10, growth: "+4%", deliveryTime: "2.2 يوم", position: [16.8892, 42.5611] },
]

export function RegionMap() {
  const [mounted, setMounted] = useState(false)
  const [sortField, setSortField] = useState("value")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filteredData, setFilteredData] = useState(regionData)
  const [activeTab, setActiveTab] = useState("table")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024)
  const [hoveredRow, setHoveredRow] = useState(null)
  const reportRef = useRef(null)

  useEffect(() => {
    setMounted(true)

    // تحديد عرض النافذة للاستجابة
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // إضافة اختصارات لوحة المفاتيح
    const handleKeyDown = (e) => {
      // Alt + P للطباعة
      if (e.altKey && e.key === "p") {
        handlePrint()
      }
      // Alt + F للتكبير/التصغير
      if (e.altKey && e.key === "f") {
        toggleFullScreen()
      }
      // استخدام الأسهم للتنقل بين التبويبات
      if (e.altKey) {
        if (e.key === "1") setActiveTab("table")
        if (e.key === "2") setActiveTab("bar")
        if (e.key === "3") setActiveTab("pie")
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    // ترتيب البيانات حسب الحقل المحدد والاتجاه
    const sortedData = [...regionData].sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1
      } else {
        return a[sortField] < b[sortField] ? 1 : -1
      }
    })
    setFilteredData(sortedData)
  }, [sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const content = document.getElementById("region-report")?.innerHTML

    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>تقرير توزيع الشحنات حسب المناطق</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: right; }
              th { background-color: #f0f4f8; }
              h1 { color: #3498db; }
              @media print {
                button { display: none !important; }
              }
            </style>
          </head>
          <body>
            <h1>تقرير توزيع الشحنات حسب المناطق</h1>
            ${content}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)

    // استخدام واجهة برمجة تطبيقات ملء الشاشة إذا كانت متاحة
    if (reportRef.current) {
      if (!isFullScreen && reportRef.current.requestFullscreen) {
        reportRef.current.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const getViewportClass = () => {
    if (windowWidth >= 1536) return "2xl-screen" // 2xl
    if (windowWidth >= 1280) return "xl-screen" // xl
    if (windowWidth >= 1024) return "lg-screen" // lg
    if (windowWidth >= 768) return "md-screen" // md
    if (windowWidth >= 640) return "sm-screen" // sm
    return "xs-screen" // xs
  }

  // دالة لتحديد لون الخلفية للصف بناءً على قيمة النمو
  const getGrowthColor = (growth) => {
    const value = Number.parseFloat(growth)
    if (value >= 10) return "bg-green-50 dark:bg-green-900/20"
    if (value >= 5) return "bg-green-50/50 dark:bg-green-900/10"
    if (value >= 0) return ""
    return "bg-red-50/50 dark:bg-red-900/10"
  }

  // دالة لتحديد لون النص للنمو
  const getGrowthTextColor = (growth) => {
    const value = Number.parseFloat(growth)
    if (value >= 10) return "text-green-600 dark:text-green-400"
    if (value >= 5) return "text-green-500 dark:text-green-500"
    if (value >= 0) return "text-green-400 dark:text-green-600"
    return "text-red-500 dark:text-red-400"
  }

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f0f4f8] rounded-lg">
        <div className="text-[#6d6a67]">جاري تحميل التقرير...</div>
      </div>
    )
  }

  return (
    <div
      ref={reportRef}
      id="region-report-container"
      className={`
        w-full h-full relative bg-[#EFF2F7] 
        rounded-xl p-4 md:p-6 overflow-auto shadow-lg border border-[#e6edf3] 
        backdrop-blur-sm transition-all ${getViewportClass()}
        ${isFullScreen ? "fixed inset-0 z-50 m-0 rounded-none" : ""}
      `}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <h3 className="font-bold text-[#3498db] text-lg md:text-xl">تقرير توزيع الشحنات حسب المناطق</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="v7-neu-button-sm text-xs"
            onClick={() => alert("فلترة التقرير")}
          >
            <Filter className="h-3 w-3 ml-1" />
            <span className="hidden sm:inline">تصفية</span>
          </Button>
          <Button size="sm" variant="outline" className="v7-neu-button-sm text-xs" onClick={handlePrint}>
            <Printer className="h-3 w-3 ml-1" />
            <span className="hidden sm:inline">طباعة</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="v7-neu-button-sm text-xs"
            onClick={() => alert("تصدير البيانات")}
          >
            <Download className="h-3 w-3 ml-1" />
            <span className="hidden sm:inline">تصدير</span>
          </Button>
          <Button size="sm" variant="outline" className="v7-neu-button-sm text-xs" onClick={toggleFullScreen}>
            <Maximize2 className="h-3 w-3 ml-1" />
            <span className="hidden sm:inline">{isFullScreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="v7-neu-tabs mb-4 flex flex-wrap">
          <TabsTrigger value="table" className="v7-neu-tab flex-1" data-shortcut="Alt+1">
            <span className="hidden sm:inline">جدول البيانات</span>
            <span className="sm:hidden">جدول</span>
          </TabsTrigger>
          <TabsTrigger value="bar" className="v7-neu-tab flex-1" data-shortcut="Alt+2">
            <BarChart3 className="h-4 w-4 sm:ml-1 sm:mr-0 mr-0" />
            <span className="hidden sm:inline">رسم شريطي</span>
          </TabsTrigger>
          <TabsTrigger value="pie" className="v7-neu-tab flex-1" data-shortcut="Alt+3">
            <PieChart className="h-4 w-4 sm:ml-1 sm:mr-0 mr-0" />
            <span className="hidden sm:inline">رسم دائري</span>
          </TabsTrigger>
        </TabsList>

        <div className="border border-[#e6edf3] rounded-lg shadow-sm bg-white p-0.5">
          <TabsContent value="table" className="mt-0">
            <div className="overflow-x-auto" style={{ maxHeight: isFullScreen ? "calc(100vh - 160px)" : "500px" }}>
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th
                      className={`
                        p-3 text-right font-medium text-[#3498db] cursor-pointer 
                        bg-gradient-to-b from-[#f8fafc] to-[#f0f4f8] 
                        border-b-2 border-[#e6edf3] transition-colors
                        hover:bg-gradient-to-b hover:from-[#f0f4f8] hover:to-[#e6edf3]
                        first:rounded-tr-md last:rounded-tl-md
                      `}
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center justify-end">
                        <span>المنطقة</span>
                        <div className="mr-1 flex flex-col">
                          <ArrowUp
                            className={`h-2 w-2 ${
                              sortField === "name" && sortDirection === "asc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                          <ArrowDown
                            className={`h-2 w-2 ${
                              sortField === "name" && sortDirection === "desc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className={`
                        p-3 text-right font-medium text-[#3498db] cursor-pointer 
                        bg-gradient-to-b from-[#f8fafc] to-[#f0f4f8] 
                        border-b-2 border-[#e6edf3] transition-colors
                        hover:bg-gradient-to-b hover:from-[#f0f4f8] hover:to-[#e6edf3]
                      `}
                      onClick={() => handleSort("value")}
                    >
                      <div className="flex items-center justify-end">
                        <Package className="ml-1 h-3 w-3 text-[#3498db]" />
                        <span>عدد الشحنات</span>
                        <div className="mr-1 flex flex-col">
                          <ArrowUp
                            className={`h-2 w-2 ${
                              sortField === "value" && sortDirection === "asc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                          <ArrowDown
                            className={`h-2 w-2 ${
                              sortField === "value" && sortDirection === "desc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className={`
                        p-3 text-right font-medium text-[#3498db] cursor-pointer 
                        bg-gradient-to-b from-[#f8fafc] to-[#f0f4f8] 
                        border-b-2 border-[#e6edf3] transition-colors
                        hover:bg-gradient-to-b hover:from-[#f0f4f8] hover:to-[#e6edf3]
                      `}
                      onClick={() => handleSort("growth")}
                    >
                      <div className="flex items-center justify-end">
                        <TrendingUp className="ml-1 h-3 w-3 text-[#3498db]" />
                        <span>النمو</span>
                        <div className="mr-1 flex flex-col">
                          <ArrowUp
                            className={`h-2 w-2 ${
                              sortField === "growth" && sortDirection === "asc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                          <ArrowDown
                            className={`h-2 w-2 ${
                              sortField === "growth" && sortDirection === "desc" ? "text-[#3498db]" : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      className={`
                        p-3 text-right font-medium text-[#3498db] cursor-pointer 
                        bg-gradient-to-b from-[#f8fafc] to-[#f0f4f8] 
                        border-b-2 border-[#e6edf3] transition-colors
                        hover:bg-gradient-to-b hover:from-[#f0f4f8] hover:to-[#e6edf3]
                      `}
                      onClick={() => handleSort("deliveryTime")}
                    >
                      <div className="flex items-center justify-end">
                        <Clock className="ml-1 h-3 w-3 text-[#3498db]" />
                        <span>متوسط وقت التوصيل</span>
                        <div className="mr-1 flex flex-col">
                          <ArrowUp
                            className={`h-2 w-2 ${
                              sortField === "deliveryTime" && sortDirection === "asc"
                                ? "text-[#3498db]"
                                : "text-gray-400"
                            }`}
                          />
                          <ArrowDown
                            className={`h-2 w-2 ${
                              sortField === "deliveryTime" && sortDirection === "desc"
                                ? "text-[#3498db]"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((region, index) => (
                    <tr
                      key={region.id}
                      className={`
                        transition-all duration-150 
                        ${index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}
                        ${hoveredRow === region.id ? "bg-blue-50 shadow-sm scale-[1.01] z-10 relative" : ""}
                        ${getGrowthColor(region.growth)}
                      `}
                      onMouseEnter={() => setHoveredRow(region.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="p-3 border-b border-[#e6edf3] font-medium">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full ml-2"
                            style={{ backgroundColor: getColorByIndex(index) }}
                          ></div>
                          {region.name}
                        </div>
                      </td>
                      <td className="p-3 border-b border-[#e6edf3]">
                        <div className="flex items-center justify-end">
                          <span className="font-semibold text-[#2c3e50]">{region.value}</span>
                          <div
                            className="mr-2 h-1.5 bg-[#3498db] rounded-full"
                            style={{ width: `${(region.value / 35) * 100}px`, maxWidth: "100px" }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-3 border-b border-[#e6edf3]">
                        <div
                          className={`font-semibold ${getGrowthTextColor(region.growth)} flex items-center justify-end`}
                        >
                          {Number.parseFloat(region.growth) > 0 ? (
                            <TrendingUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="ml-1 h-3 w-3" />
                          )}
                          {region.growth}
                        </div>
                      </td>
                      <td className="p-3 border-b border-[#e6edf3] text-[#2c3e50]">
                        <div className="flex items-center justify-end">
                          <span>{region.deliveryTime}</span>
                          <div
                            className="mr-2 h-1.5 bg-[#f39c12] rounded-full opacity-70"
                            style={{
                              width: `${Number.parseFloat(region.deliveryTime) * 20}px`,
                              maxWidth: "60px",
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#f8fafc] sticky bottom-0 shadow-sm">
                  <tr>
                    <td className="p-3 border-t-2 border-[#e6edf3] font-bold text-[#3498db]">الإجمالي</td>
                    <td className="p-3 border-t-2 border-[#e6edf3] font-bold text-[#2c3e50] text-right">
                      {filteredData.reduce((sum, region) => sum + region.value, 0)} شحنة
                    </td>
                    <td className="p-3 border-t-2 border-[#e6edf3] font-bold text-[#2c3e50] text-right">
                      {(
                        filteredData.reduce((sum, region) => sum + Number.parseFloat(region.growth), 0) /
                        filteredData.length
                      ).toFixed(1)}
                      %
                    </td>
                    <td className="p-3 border-t-2 border-[#e6edf3] font-bold text-[#2c3e50] text-right">
                      {(
                        filteredData.reduce((sum, region) => sum + Number.parseFloat(region.deliveryTime), 0) /
                        filteredData.length
                      ).toFixed(1)}{" "}
                      يوم
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="mt-0">
            <CardHeader className="p-3 border-b border-[#e6edf3]">
              <CardTitle className="text-[#3498db] text-base md:text-lg">توزيع الشحنات حسب المناطق</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[300px] md:h-[400px] w-full">
                {/* رسم بياني شريطي تفاعلي */}
                <div className="flex h-full">
                  <div className="w-12 flex flex-col justify-between text-xs text-[#6d6a67] py-2">
                    <div>35</div>
                    <div>30</div>
                    <div>25</div>
                    <div>20</div>
                    <div>15</div>
                    <div>10</div>
                    <div>5</div>
                    <div>0</div>
                  </div>
                  <div className="flex-1 flex items-end justify-around">
                    {filteredData.map((region) => (
                      <div key={region.id} className="flex flex-col items-center group">
                        <div className="text-xs opacity-0 group-hover:opacity-100 bg-[#3498db] text-white px-2 py-1 rounded mb-1 transition-opacity">
                          {region.value} شحنة
                        </div>
                        <div
                          className="w-8 md:w-12 lg:w-16 bg-[#3498db] bg-opacity-80 hover:bg-opacity-100 transition-all cursor-pointer relative rounded-t-sm"
                          style={{ height: `${(region.value / 35) * 100}%`, minHeight: "10px" }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2980b9] to-transparent opacity-30"></div>
                        </div>
                        <div className="text-xs mt-1 text-[#6d6a67] whitespace-nowrap overflow-hidden text-ellipsis w-12 text-center">
                          {windowWidth > 768 ? region.name : region.name.substring(0, 6) + "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="pie" className="mt-0">
            <CardHeader className="p-3 border-b border-[#e6edf3]">
              <CardTitle className="text-[#3498db] text-base md:text-lg">النسبة المئوية للشحنات حسب المناطق</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-center items-center">
                <div
                  className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] relative rounded-full border-8 border-[#f0f4f8] 
                  overflow-hidden shadow-inner"
                >
                  {/* رسم دائري تفاعلي مبسط */}
                  {filteredData.map((region, index) => {
                    const total = filteredData.reduce((sum, r) => sum + r.value, 0)
                    const percentage = (region.value / total) * 100
                    const previousPercentages = filteredData
                      .slice(0, index)
                      .reduce((sum, r) => sum + (r.value / total) * 100, 0)

                    return (
                      <div
                        key={region.id}
                        className="absolute inset-0 hover:opacity-90 transition-opacity cursor-pointer"
                        style={{
                          background: `conic-gradient(transparent ${previousPercentages}%, ${getColorByIndex(index)} ${previousPercentages}%, ${getColorByIndex(index)} ${previousPercentages + percentage}%, transparent ${previousPercentages + percentage}%)`,
                        }}
                        title={`${region.name}: ${percentage.toFixed(1)}%`}
                      ></div>
                    )
                  })}
                </div>
                <div className="md:mr-6 md:ml-6 mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-1 gap-2">
                  {filteredData.map((region, index) => {
                    const total = filteredData.reduce((sum, r) => sum + r.value, 0)
                    const percentage = (region.value / total) * 100

                    return (
                      <div key={region.id} className="flex items-center text-sm">
                        <div
                          className="w-3 h-3 rounded-full ml-2"
                          style={{ backgroundColor: getColorByIndex(index) }}
                        ></div>
                        <div className="whitespace-nowrap">
                          {windowWidth < 640 && region.name.length > 8
                            ? region.name.substring(0, 8) + "..."
                            : region.name}
                          : {percentage.toFixed(1)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-4 text-xs text-[#6d6a67] text-center">
        آخر تحديث: {new Date().toLocaleDateString("ar-SA")} - إجمالي الشحنات:{" "}
        {filteredData.reduce((sum, region) => sum + region.value, 0)}
      </div>

      <div className="text-xs text-[#a0aec0] text-center mt-1">
        اختصارات لوحة المفاتيح: Alt+1 (جدول)، Alt+2 (رسم شريطي)، Alt+3 (رسم دائري)، Alt+F (ملء الشاشة)، Alt+P (طباعة)
      </div>
    </div>
  )
}

// دالة مساعدة للحصول على لون مختلف لكل منطقة
function getColorByIndex(index) {
  const colors = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#d35400",
    "#34495e",
    "#16a085",
    "#c0392b",
  ]
  return colors[index % colors.length]
}
