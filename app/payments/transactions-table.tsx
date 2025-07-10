"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetMyTransactionsQuery } from "@/app/api/transicationApi"

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
    case "failed":
      return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
  }
}

export function TransactionsTable() {
  const { data, isLoading, isError } = useGetMyTransactionsQuery();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
        <div className="relative flex-grow md:flex-grow-0 md:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
          <Input placeholder="بحث في المعاملات..." className="v7-neu-input pr-12 text-left bg-white dark:bg-gray-800 dark:text-gray-200" />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px] v7-neu-input flex items-center justify-between bg-white dark:bg-gray-800 text-[#294D8B] dark:text-blue-400 font-medium shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-[#294D8B] dark:border-blue-500">
              <SelectValue placeholder="نوع المعاملة" />
              <Filter className="h-4 w-4 ml-2" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all" className="dark:text-gray-200">جميع المعاملات</SelectItem>
              <SelectItem value="deposit" className="dark:text-gray-200">إيداع</SelectItem>
              <SelectItem value="payment" className="dark:text-gray-200">دفع</SelectItem>
              <SelectItem value="refund" className="dark:text-gray-200">استرداد</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border dark:border-gray-700 v7-neu-card-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead>
              <tr className="bg-[#f0f4f8] dark:bg-gray-800 border-b dark:border-gray-700">
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">رقم المعاملة</th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">التاريخ</th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">النوع</th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">نوع الشحن</th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">المبلغ</th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {isLoading && (
                <tr><td colSpan={6} className="text-center py-6">جاري التحميل...</td></tr>
              )}
              {isError && (
                <tr><td colSpan={6} className="text-center text-red-500 py-6">حدث خطأ أثناء جلب البيانات</td></tr>
              )}
              {data && data.data && data.data.length === 0 && !isLoading && !isError && (
                <tr><td colSpan={6} className="text-center py-6">لا توجد معاملات</td></tr>
              )}
              {data && data.data && data.data.map((trx) => (
                <tr key={trx._id} className="border-b dark:border-gray-700 hover:bg-[#f0f4f8] dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-[#3498db] dark:text-blue-400">{trx._id}</td>
                  <td className="py-3 px-4 text-muted-foreground dark:text-gray-400">{new Date(trx.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs">
                      {trx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground dark:text-gray-400">{trx.method}</td>
                  <td className={trx.amount > 0 ? "py-3 px-4 text-green-600 dark:text-green-400" : "py-3 px-4 text-red-600 dark:text-red-400"}>
                    {trx.amount > 0 ? "+" : ""}{trx.amount.toLocaleString()} ريال
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(trx.status)}`}>
                      {trx.status === 'completed' ? 'مكتمل' : trx.status === 'pending' ? 'قيد الانتظار' : trx.status === 'failed' ? 'فشل' : trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
} 