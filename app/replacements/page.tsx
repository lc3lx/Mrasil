"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Filter,
  Search,
  Sliders,
  RepeatIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"

export default function ReplacementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const [selectedReplacements, setSelectedReplacements] = useState<string[]>([])

  // Mock data for replacements
  const replacements = [
    {
      id: "REP-2023-001",
      date: "15 مايو 2023",
      originalProduct: "سماعات بلوتوث",
      replacementProduct: "سماعات بلوتوث - موديل متطور",
      reason: "عيب في الصوت",
      priceDifference: "+50 ريال",
      status: "قيد المراجعة",
    },
    {
      id: "REP-2023-002",
      date: "18 مايو 2023",
      originalProduct: "شاحن لاسلكي",
      replacementProduct: "شاحن لاسلكي سريع",
      reason: "لا يعمل بشكل صحيح",
      priceDifference: "+35 ريال",
      status: "تمت الموافقة",
    },
    {
      id: "REP-2023-003",
      date: "20 مايو 2023",
      originalProduct: "ساعة ذكية",
      replacementProduct: "ساعة ذكية - الإصدار الجديد",
      reason: "مشكلة في البطارية",
      priceDifference: "+120 ريال",
      status: "تم الاستبدال",
    },
    {
      id: "REP-2023-004",
      date: "22 مايو 2023",
      originalProduct: "حافظة هاتف",
      replacementProduct: "حافظة هاتف مقاومة للصدمات",
      reason: "لون مختلف عن الطلب",
      priceDifference: "+0 ريال",
      status: "مرفوضة",
    },
  ]

  // Toggle select all replacements
  const toggleSelectAll = () => {
    if (selectedReplacements.length === replacements.length) {
      setSelectedReplacements([])
    } else {
      setSelectedReplacements(replacements.map((replacement) => replacement.id))
    }
  }

  // Toggle select single replacement
  const toggleSelectReplacement = (id: string) => {
    if (selectedReplacements.includes(id)) {
      setSelectedReplacements(selectedReplacements.filter((replacementId) => replacementId !== id))
    } else {
      setSelectedReplacements([...selectedReplacements, id])
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedReplacements.length === 0) return

    switch (action) {
      case "approve":
        alert(`تمت الموافقة على ${selectedReplacements.length} استبدال`)
        break
      case "reject":
        alert(`تم رفض ${selectedReplacements.length} استبدال`)
        break
      case "export":
        alert(`تم تصدير بيانات ${selectedReplacements.length} استبدال`)
        break
      case "delete":
        alert(`تم حذف ${selectedReplacements.length} استبدال`)
        break
      default:
        break
    }
  }

  return (
    <V7Layout>
      <V7Content title="إدارة الاستبدال" description="إدارة طلبات الاستبدال وتتبع حالتها">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#294D8B] dark:text-blue-400">إدارة الاستبدال</h1>
              <p className="text-[#6d6a67] dark:text-gray-400">إدارة طلبات الاستبدال وتتبع حالتها</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => router.push("/replacements/customize")}
              >
                <Sliders className="mr-2 h-4 w-4" />
                تخصيص صفحة الاستبدال
              </Button>
              <Button className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                تصدير التقرير
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 rtl">
            <div className="flex flex-wrap w-full gap-4">
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[300px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">إجمالي الاستبدالات</p>
                        <h3 className="text-2xl font-bold text-[#294D8B] dark:text-blue-400">128</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <RepeatIcon className="h-6 w-6 text-[#294D8B] dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[300px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">قيد المراجعة</p>
                        <h3 className="text-2xl font-bold text-[#f39c12] dark:text-yellow-400">24</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <ClockIcon className="h-6 w-6 text-[#f39c12] dark:text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex flex-wrap w-full gap-4">
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[300px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">تمت الموافقة</p>
                        <h3 className="text-2xl font-bold text-[#2ecc71] dark:text-green-400">86</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <CheckCircleIcon className="h-6 w-6 text-[#2ecc71] dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[300px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">مرفوضة</p>
                        <h3 className="text-2xl font-bold text-[#e74c3c] dark:text-red-400">18</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <XCircleIcon className="h-6 w-6 text-[#e74c3c] dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Card className="v7-neu-card dark:bg-gray-800">
            <CardHeader className="pb-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 my-4">
                  <CardTitle className="text-[#294D8B] dark:text-blue-400 m-2">طلبات الاستبدال</CardTitle>
                  <CardDescription className="mx-2 dark:text-gray-400">عرض وإدارة جميع طلبات الاستبدال</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 md:min-w-[240px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6d6a67] dark:text-gray-400" />
                    <Input 
                      type="search" 
                      placeholder="بحث..." 
                      className="pl-8 pr-4 v7-neu-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                    />
                  </div>
                  <Button variant="outline" className="v7-neu-button dark:text-gray-200 dark:border-gray-600">
                    <Filter className="mr-2 h-4 w-4" />
                    تصفية
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent dir="rtl" className="rtl">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid w-full grid-cols-5 v7-neu-tabs dark:bg-gray-700">
                  <TabsTrigger value="all" className="text-sm dark:data-[state=active]:bg-gray-600">
                    الكل
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-sm dark:data-[state=active]:bg-gray-600">
                    قيد المراجعة
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="text-sm dark:data-[state=active]:bg-gray-600">
                    تمت الموافقة
                  </TabsTrigger>
                  <TabsTrigger value="processed" className="text-sm dark:data-[state=active]:bg-gray-600">
                    تم الاستبدال
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="text-sm dark:data-[state=active]:bg-gray-600">
                    مرفوضة
                  </TabsTrigger>
                </TabsList>

                {selectedReplacements.length > 0 && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      تم تحديد {selectedReplacements.length} استبدال
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          disabled={selectedReplacements.length === 0}
                        >
                          إجراءات جماعية <ChevronDown className="mr-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">
                        <DropdownMenuLabel>اختر إجراء</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleBulkAction("approve")}
                          className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                        >
                          <CheckCircleIcon className="ml-2 h-4 w-4 text-green-600" />
                          الموافقة على الكل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBulkAction("reject")}
                          className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                        >
                          <XCircleIcon className="ml-2 h-4 w-4 text-red-600" />
                          رفض الكل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleBulkAction("export")}
                          className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                        >
                          <FileText className="ml-2 h-4 w-4 text-blue-600" />
                          تصدير البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBulkAction("delete")}
                          className="text-red-600 text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-2 h-4 w-4 text-red-600"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          حذف المحدد
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                <TabsContent value="all" className="mt-0">
                  <div className="rounded-md border v7-neu-table dark:border-gray-700">
                    <div className="overflow-x-auto min-w-full">
                      <table className="w-full table-fixed" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                            <th className="w-[40px] px-2 py-3 text-right">
                              <Checkbox
                                checked={selectedReplacements.length === replacements.length && replacements.length > 0}
                                onCheckedChange={toggleSelectAll}
                                aria-label="تحديد كل الاستبدالات"
                                className="dark:border-gray-600"
                              />
                            </th>
                            <th className="w-[120px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              رقم الاستبدال
                            </th>
                            <th className="w-[120px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              التاريخ
                            </th>
                            <th className="w-[150px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              المنتج الأصلي
                            </th>
                            <th className="w-[150px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              المنتج البديل
                            </th>
                            <th className="w-[150px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              سبب الاستبدال
                            </th>
                            <th className="w-[100px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              فرق السعر
                            </th>
                            <th className="w-[120px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              الحالة
                            </th>
                            <th className="w-[160px] px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                          {replacements.map((replacement) => (
                            <tr key={replacement.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                              <td className="px-2 py-3">
                                <Checkbox
                                  checked={selectedReplacements.includes(replacement.id)}
                                  onCheckedChange={() => toggleSelectReplacement(replacement.id)}
                                  aria-label={`تحديد الاستبدال ${replacement.id}`}
                                  className="dark:border-gray-600"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer truncate">
                                {replacement.id}
                              </td>
                              <td className="px-4 py-3 text-sm truncate">{replacement.date}</td>
                              <td className="px-4 py-3 text-sm truncate">{replacement.originalProduct}</td>
                              <td className="px-4 py-3 text-sm truncate">{replacement.replacementProduct}</td>
                              <td className="px-4 py-3 text-sm truncate">{replacement.reason}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">{replacement.priceDifference}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  className={`inline-flex whitespace-nowrap ${
                                    replacement.status === "قيد المراجعة"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : replacement.status === "تمت الموافقة"
                                        ? "bg-green-100 text-green-800"
                                        : replacement.status === "تم الاستبدال"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {replacement.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 justify-end">
                                  <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50 whitespace-nowrap">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    <span>موافقة</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50 whitespace-nowrap">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="mr-1"
                                    >
                                      <path d="M18 6L6 18" />
                                      <path d="M6 6l12 12" />
                                    </svg>
                                    <span>رفض</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-0">
                  <div className="rounded-md border v7-neu-table dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                            <th className="px-2 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              <Checkbox
                                checked={
                                  selectedReplacements.length ===
                                    replacements.filter((r) => r.status === "قيد المراجعة").length &&
                                  replacements.filter((r) => r.status === "قيد المراجعة").length > 0
                                }
                                onCheckedChange={toggleSelectAll}
                                aria-label="تحديد كل الاستبدالات قيد المراجعة"
                                className="dark:border-gray-600"
                              />
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">رقم الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">التاريخ</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج الأصلي</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج البديل</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">سبب الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">فرق السعر</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الحالة</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                          {replacements
                            .filter((replacement) => replacement.status === "قيد المراجعة")
                            .map((replacement) => (
                              <tr key={replacement.id} className="border-b">
                                <td className="px-2 py-3">
                                  <Checkbox
                                    checked={selectedReplacements.includes(replacement.id)}
                                    onCheckedChange={() => toggleSelectReplacement(replacement.id)}
                                    aria-label={`تحديد الاستبدال ${replacement.id}`}
                                    className="dark:border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                  {replacement.id}
                                </td>
                                <td className="px-4 py-3 text-sm">{replacement.date}</td>
                                <td className="px-4 py-3 text-sm">{replacement.originalProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.replacementProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.reason}</td>
                                <td className="px-4 py-3 text-sm">{replacement.priceDifference}</td>
                                <td className="px-4 py-3">
                                  <Badge className="bg-yellow-100 text-yellow-800">{replacement.status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M20 6L9 17l-5-5" />
                                      </svg>
                                      <span>موافقة</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                      </svg>
                                      <span>رفض</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-0">
                  <div className="rounded-md border v7-neu-table dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                            <th className="px-2 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              <Checkbox
                                checked={
                                  selectedReplacements.length ===
                                    replacements.filter((r) => r.status === "تمت الموافقة").length &&
                                  replacements.filter((r) => r.status === "تمت الموافقة").length > 0
                                }
                                onCheckedChange={toggleSelectAll}
                                aria-label="تحديد كل الاستبدالات الموافق عليها"
                                className="dark:border-gray-600"
                              />
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">رقم الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">التاريخ</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج الأصلي</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج البديل</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">سبب الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">فرق السعر</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الحالة</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                          {replacements
                            .filter((replacement) => replacement.status === "تمت الموافقة")
                            .map((replacement) => (
                              <tr key={replacement.id} className="border-b">
                                <td className="px-2 py-3">
                                  <Checkbox
                                    checked={selectedReplacements.includes(replacement.id)}
                                    onCheckedChange={() => toggleSelectReplacement(replacement.id)}
                                    aria-label={`تحديد الاستبدال ${replacement.id}`}
                                    className="dark:border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                  {replacement.id}
                                </td>
                                <td className="px-4 py-3 text-sm">{replacement.date}</td>
                                <td className="px-4 py-3 text-sm">{replacement.originalProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.replacementProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.reason}</td>
                                <td className="px-4 py-3 text-sm">{replacement.priceDifference}</td>
                                <td className="px-4 py-3">
                                  <Badge className="bg-green-100 text-green-800">{replacement.status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M20 6L9 17l-5-5" />
                                      </svg>
                                      <span>موافقة</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                      </svg>
                                      <span>رفض</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="processed" className="mt-0">
                  <div className="rounded-md border v7-neu-table dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                            <th className="px-2 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              <Checkbox
                                checked={
                                  selectedReplacements.length ===
                                    replacements.filter((r) => r.status === "تم الاستبدال").length &&
                                  replacements.filter((r) => r.status === "تم الاستبدال").length > 0
                                }
                                onCheckedChange={toggleSelectAll}
                                aria-label="تحديد كل الاستبدالات المكتملة"
                                className="dark:border-gray-600"
                              />
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">رقم الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">التاريخ</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج الأصلي</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج البديل</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">سبب الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">فرق السعر</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الحالة</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                          {replacements
                            .filter((replacement) => replacement.status === "تم الاستبدال")
                            .map((replacement) => (
                              <tr key={replacement.id} className="border-b">
                                <td className="px-2 py-3">
                                  <Checkbox
                                    checked={selectedReplacements.includes(replacement.id)}
                                    onCheckedChange={() => toggleSelectReplacement(replacement.id)}
                                    aria-label={`تحديد الاستبدال ${replacement.id}`}
                                    className="dark:border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                  {replacement.id}
                                </td>
                                <td className="px-4 py-3 text-sm">{replacement.date}</td>
                                <td className="px-4 py-3 text-sm">{replacement.originalProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.replacementProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.reason}</td>
                                <td className="px-4 py-3 text-sm">{replacement.priceDifference}</td>
                                <td className="px-4 py-3">
                                  <Badge className="bg-blue-100 text-blue-800">{replacement.status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M20 6L9 17l-5-5" />
                                      </svg>
                                      <span>موافقة</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                      </svg>
                                      <span>رفض</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-0">
                  <div className="rounded-md border v7-neu-table dark:border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="w-full" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                            <th className="px-2 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">
                              <Checkbox
                                checked={
                                  selectedReplacements.length ===
                                    replacements.filter((r) => r.status === "مرفوضة").length &&
                                  replacements.filter((r) => r.status === "مرفوضة").length > 0
                                }
                                onCheckedChange={toggleSelectAll}
                                aria-label="تحديد كل الاستبدالات المرفوضة"
                                className="dark:border-gray-600"
                              />
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">رقم الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">التاريخ</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج الأصلي</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">المنتج البديل</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">سبب الاستبدال</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">فرق السعر</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الحالة</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-200">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                          {replacements
                            .filter((replacement) => replacement.status === "مرفوضة")
                            .map((replacement) => (
                              <tr key={replacement.id} className="border-b">
                                <td className="px-2 py-3">
                                  <Checkbox
                                    checked={selectedReplacements.includes(replacement.id)}
                                    onCheckedChange={() => toggleSelectReplacement(replacement.id)}
                                    aria-label={`تحديد الاستبدال ${replacement.id}`}
                                    className="dark:border-gray-600"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                  {replacement.id}
                                </td>
                                <td className="px-4 py-3 text-sm">{replacement.date}</td>
                                <td className="px-4 py-3 text-sm">{replacement.originalProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.replacementProduct}</td>
                                <td className="px-4 py-3 text-sm">{replacement.reason}</td>
                                <td className="px-4 py-3 text-sm">{replacement.priceDifference}</td>
                                <td className="px-4 py-3">
                                  <Badge className="bg-red-100 text-red-800">{replacement.status}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M20 6L9 17l-5-5" />
                                      </svg>
                                      <span>موافقة</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-1"
                                      >
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                      </svg>
                                      <span>رفض</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </V7Content>
    </V7Layout>
  )
}
