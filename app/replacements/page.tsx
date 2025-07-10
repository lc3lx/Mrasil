"use client"

import { useState, useEffect } from "react"
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useCreateRequestMutation } from '../api/createReturnOrExchangeRequestApi';
import { useGetShipmentsQuery } from '../api/getReturnOrExchangeShipmentsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useHandleApprovalMutation } from '../api/handleReturnApprovalApi';
import { useSearchShipmentsQuery } from '../api/searchMyCustomerShipmentsApi';
import { useGetReturnShipmentsQuery } from '../api/returnShipmentsApi';

export default function ReplacementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const [selectedReplacements, setSelectedReplacements] = useState<string[]>([])
  const [dynamicReplacements, setDynamicReplacements] = useState(null)
  const [showExtraBtns, setShowExtraBtns] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [shipmentId, setShipmentId] = useState('');
  const [type, setType] = useState('return');
  const [requestNote, setRequestNote] = useState('');
  const [alertMsg, setAlertMsg] = useState<string|null>(null);
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [showType, setShowType] = useState('return');
  const [showTableType, setShowTableType] = useState<string|null>(null);
  const { data: shipmentsData, isLoading: isShipmentsLoading, error: shipmentsError } = useGetShipmentsQuery(showTableType ? { type: showTableType } : skipToken);
  const [handleApproval, { isLoading: isApproving }] = useHandleApprovalMutation();
  const [approvalResult, setApprovalResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchEmailToQuery, setSearchEmailToQuery] = useState<string|null>(null);
  const { data: searchData, isLoading: isSearchLoading, error: searchError } = useSearchShipmentsQuery(searchEmailToQuery ? { email: searchEmailToQuery } : skipToken);
  const [searchAlert, setSearchAlert] = useState<string|null>(null);
  const { data: returnShipmentsData, isLoading: isReturnShipmentsLoading, error: returnShipmentsError } = useGetReturnShipmentsQuery({ type: 'exchange' });

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (event.data && event.data.replacements) {
        setDynamicReplacements(event.data.replacements)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('showExtraReplacementBtns')) {
        setShowExtraBtns(true)
        localStorage.removeItem('showExtraReplacementBtns')
      }
    }
  }, [])

  useEffect(() => {
    if (
      searchEmailToQuery &&
      !isSearchLoading &&
      !searchError &&
      (!searchData || !Array.isArray(searchData.data) || searchData.data.length === 0)
    ) {
      setSearchAlert('لا توجد بيانات لهذا البريد الإلكتروني أو لا توجد شحنات.');
    }
  }, [searchEmailToQuery, isSearchLoading, searchError, searchData]);

  return (
    <V7Layout>
      <V7Content title="إدارة الاستبدال" description="إدارة طلبات الاستبدال وتتبع حالتها">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#294D8B] dark:text-blue-400">ادارة الاستبدال</h1>
              <p className="text-[#6d6a67] dark:text-gray-400">إدارة طلبات الاستبدال  وتتبع حالتها</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
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
            <Button
              className="bg-[#294D8B] hover:bg-[#1e3b6f] text-white shadow-sm transition-all duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => window.open("/replacements/verify-email", "_blank")}
            >
              التحقق من البريد الالكترونى
            </Button>
            
          </div>

          <div className="flex flex-wrap gap-2 mb-2 rtl">
            <div className="flex flex-wrap w-full gap-4">
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[180px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">إجمالي الاستبدالات</p>
                        <h3 className="text-lg font-bold text-[#294D8B] dark:text-blue-400">128</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <RepeatIcon className="h-4 w-4 text-[#294D8B] dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[180px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">قيد المراجعة</p>
                        <h3 className="text-lg font-bold text-[#f39c12] dark:text-yellow-400">24</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <ClockIcon className="h-4 w-4 text-[#f39c12] dark:text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex flex-wrap w-full gap-4">
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[180px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">تمت الموافقة</p>
                        <h3 className="text-lg font-bold text-[#2ecc71] dark:text-green-400">86</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <CheckCircleIcon className="h-4 w-4 text-[#2ecc71] dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex-1 basis-[calc(50%-0.5rem)] min-w-[180px]">
                <Card className="v7-neu-card dark:bg-gray-800">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-[#6d6a67] dark:text-gray-400 whitespace-nowrap">مرفوضة</p>
                        <h3 className="text-lg font-bold text-[#e74c3c] dark:text-red-400">18</h3>
                      </div>
                      <div className="v7-neu-icon-lg flex-shrink-0 me-2">
                        <XCircleIcon className="h-4 w-4 text-[#e74c3c] dark:text-red-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Card className="v7-neu-card dark:bg-gray-800">
            <CardContent dir="rtl" className="rtl">
              <div className="rounded-md border v7-neu-table dark:border-gray-700 overflow-x-auto">
                {!isShipmentsLoading && !shipmentsError && shipmentsData && shipmentsData.data.length > 0 && (
                  <table className="w-full min-w-[800px] text-sm text-right whitespace-nowrap" dir="rtl">
                      </table>
                )}
                    </div>
            </CardContent>
          </Card>

          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>انشاء طلب استبدال & استرجاع</AlertDialogTitle>
              </AlertDialogHeader>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await createRequest({ shipmentId, typerequesst: type, requestNote }).unwrap();
                  setAlertMsg(res.message);
                  setOpenDialog(false);
                  setShipmentId(''); setType('return'); setRequestNote('');
                } catch (err: any) {
                  setAlertMsg(err?.data?.message || 'حدث خطأ');
                }
              }} className="space-y-4">
                <label className="block text-right font-medium">رقم الشحنة</label>
                <Input value={shipmentId} onChange={e => setShipmentId(e.target.value)} required />
                <label className="block text-right font-medium">نوع الطلب</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return">استبدال</SelectItem>
                    <SelectItem value="exchange">استرجاع</SelectItem>
                  </SelectContent>
                </Select>
                <label className="block text-right font-medium">ملاحظات</label>
                <Input value={requestNote} onChange={e => setRequestNote(e.target.value)} />
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel type="button">إلغاء</AlertDialogCancel>
                  <AlertDialogAction type="submit" disabled={isCreating}>{isCreating ? 'جاري الإرسال...' : 'ارسال'}</AlertDialogAction>
                                  </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={openShowDialog} onOpenChange={setOpenShowDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>عرض طلبات الاستبدال & الاسترجاع</AlertDialogTitle>
              </AlertDialogHeader>
              <form onSubmit={e => { e.preventDefault(); setOpenShowDialog(false); setShowTableType(showType); }} className="space-y-4">
                <label className="block text-right font-medium">اختر نوع الطلب</label>
                <Select value={showType} onValueChange={setShowType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return">استبدال</SelectItem>
                    <SelectItem value="exchange">استرجاع</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel type="button">إلغاء</AlertDialogCancel>
                  <AlertDialogAction type="submit">عرض</AlertDialogAction>
                    </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          {showTableType && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-[#294D8B] dark:text-blue-400 mb-4 text-right">
                {showTableType === 'return' ? 'طلبات الاستبدال' : 'طلبات الاسترجاع'}
              </h2>
              <div className="rounded-md border v7-neu-table dark:border-gray-700 overflow-x-auto">
                {isShipmentsLoading && <div className="text-center py-8">جاري التحميل...</div>}
                {shipmentsError && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
                {!isShipmentsLoading && !shipmentsError && (!shipmentsData || !shipmentsData.data.length) && (
                  <div className="text-center py-8">لا توجد بيانات</div>
                )}
                {!isShipmentsLoading && !shipmentsError && shipmentsData && shipmentsData.data.length > 0 && (
                  <table className="w-full min-w-[800px] text-sm text-right whitespace-nowrap" dir="rtl">
                        <thead>
                          <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">رقم الطلب</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">نوع الطلب</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[200px]">ملاحظات</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">تاريخ الإنشاء</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">شركة الشحن</th>
                        <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="dark:bg-gray-800">
                      {shipmentsData.data.map((item) => (
                        <tr key={item._id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 text-blue-700 break-all">{item._id}</td>
                          <td className="px-4 py-3">{item.type === 'return' ? 'استبدال' : 'استرجاع'}</td>
                          <td className="px-4 py-3 break-all">{item.requestNote}</td>
                          <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString('ar-EG')}</td>
                          <td className="px-4 py-3">{item.shipment?.company || '-'}</td>
                                <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50 whitespace-nowrap" disabled={isApproving}
                                onClick={async () => {
                                  try {
                                    const res = await handleApproval({ returnRequestId: item._id, approve: 'true' }).unwrap();
                                    setApprovalResult({ status: 'success', message: res.message || 'تمت الموافقة بنجاح' });
                                  } catch (err: any) {
                                    setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الموافقة' });
                                  }
                                }}>
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
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50 whitespace-nowrap" disabled={isApproving}
                                onClick={async () => {
                                  try {
                                    const res = await handleApproval({ returnRequestId: item._id, approve: 'false' }).unwrap();
                                    setApprovalResult({ status: 'success', message: res.message || 'تم الرفض بنجاح' });
                                  } catch (err: any) {
                                    setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الرفض' });
                                  }
                                }}>
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
                )}
                    </div>
                  </div>
          )}

          {approvalResult && (
            <AlertDialog open={!!approvalResult} onOpenChange={() => setApprovalResult(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{approvalResult.status === 'success' ? 'نجاح' : 'خطأ'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className={`text-center py-4 ${approvalResult.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>{approvalResult.message}</div>
                <div className="flex justify-end">
                  <AlertDialogAction onClick={() => setApprovalResult(null)}>حسناً</AlertDialogAction>
                                  </div>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {alertMsg && (
            <AlertDialog open={!!alertMsg} onOpenChange={() => setAlertMsg(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>النتيجة</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="text-center py-4">{alertMsg}</div>
                <div className="flex justify-end">
                  <AlertDialogAction onClick={() => setAlertMsg(null)}>حسناً</AlertDialogAction>
                    </div>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <AlertDialog open={openSearchDialog} onOpenChange={setOpenSearchDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>البحث عن شحنتك</AlertDialogTitle>
              </AlertDialogHeader>
              <form onSubmit={e => { e.preventDefault(); setOpenSearchDialog(false); setSearchEmailToQuery(searchEmail); }} className="space-y-4">
                <label className="block text-right font-medium">البريد الإلكتروني</label>
                <Input value={searchEmail} onChange={e => setSearchEmail(e.target.value)} type="email" required />
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel type="button">إلغاء</AlertDialogCancel>
                  <AlertDialogAction type="submit">بحث</AlertDialogAction>
                </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          {searchAlert && (
            <AlertDialog open={!!searchAlert} onOpenChange={() => setSearchAlert(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>تنبيه</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="text-center py-4 text-red-700">{searchAlert}</div>
                <div className="flex justify-end">
                  <AlertDialogAction onClick={() => setSearchAlert(null)}>حسناً</AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {searchEmailToQuery && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#294D8B] dark:text-blue-400 mb-4 text-right">نتائج البحث عن الشحنات</h2>
              {isSearchLoading && <div className="text-center py-8">جاري التحميل...</div>}
              {searchError && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
              {!isSearchLoading && !searchError && (!searchData || !Array.isArray(searchData.data) || searchData.data.length === 0) && (
                null
              )}
              {!isSearchLoading && !searchError && searchData && Array.isArray(searchData.data) && searchData.data.length > 0 && (
                <table className="w-full min-w-[800px] text-sm text-right whitespace-nowrap rounded-md border v7-neu-table dark:border-gray-700 overflow-x-auto">
                  <thead>
                    <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                      {Object.keys(searchData.data[0]).map((key) => (
                        <th key={key} className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="dark:bg-gray-800">
                    {searchData.data.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-3">{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold text-[#294D8B] dark:text-blue-400 mb-4 text-right">طلبات الاستبدال</h2>
            <div className="rounded-md border v7-neu-table dark:border-gray-700 overflow-x-auto">
              {isReturnShipmentsLoading && <div className="text-center py-8">جاري التحميل...</div>}
              {returnShipmentsError && <div className="text-center py-8 text-red-600">حدث خطأ أثناء جلب البيانات</div>}
              {!isReturnShipmentsLoading && !returnShipmentsError && (!returnShipmentsData || !returnShipmentsData.data.length) && (
                <div className="text-center py-8">لا توجد بيانات</div>
              )}
              {!isReturnShipmentsLoading && !returnShipmentsError && returnShipmentsData && returnShipmentsData.data.length > 0 && (
                <table className="w-full min-w-[800px] text-sm text-right whitespace-nowrap rounded-md border v7-neu-table dark:border-gray-700 overflow-x-auto">
                  <thead>
                    <tr className="border-b bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-700">
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">رقم الطلب</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">نوع الطلب</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[200px]">ملاحظات</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[180px]">تاريخ الإنشاء</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">شركة الشحن</th>
                      <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-200 min-w-[120px]">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="dark:bg-gray-800">
                    {returnShipmentsData.data.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-blue-700 break-all">{item._id}</td>
                        <td className="px-4 py-3">{item.type === 'return' ? 'استبدال' : item.type}</td>
                        <td className="px-4 py-3 break-all">{item.requestNote}</td>
                        <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString('ar-EG')}</td>
                        <td className="px-4 py-3">{item.shipment?.company || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600 hover:bg-green-50 whitespace-nowrap" disabled={isApproving}
                              onClick={async () => {
                                try {
                                  const res = await handleApproval({ returnRequestId: item._id, approve: 'true' }).unwrap();
                                  setApprovalResult({ status: 'success', message: res.message || 'تمت الموافقة بنجاح' });
                                } catch (err: any) {
                                  setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الموافقة' });
                                }
                              }}>
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
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50 whitespace-nowrap" disabled={isApproving}
                                onClick={async () => {
                                  try {
                                    const res = await handleApproval({ returnRequestId: item._id, approve: 'false' }).unwrap();
                                    setApprovalResult({ status: 'success', message: res.message || 'تم الرفض بنجاح' });
                                  } catch (err: any) {
                                    setApprovalResult({ status: 'error', message: err?.data?.message || 'حدث خطأ أثناء الرفض' });
                                  }
                                }}>
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
              )}
            </div>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
