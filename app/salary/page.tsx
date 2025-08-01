"use client"

import V7Layout from "@/components/v7/v7-layout"
import { useGetAllSalaryModificationsQuery } from "../api/salaryApi"
import DeductionForm from "./add/DeductionForm"
import BonusForm from "./add/BonusForm"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SalaryPage() {
  const { data, isLoading, error } = useGetAllSalaryModificationsQuery();
  const [deductionOpen, setDeductionOpen] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);
  const router = useRouter();

  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            إدارة الرواتب
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all text-base"
            type="button"
            onClick={() => router.push("/salary/monthly-salaries")}
          >
            الراتب الشهري
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">هنا يمكنك إدارة رواتب الموظفين.</p>
        {/* Action buttons for bonus and deduction */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 mb-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg"
            onClick={() => setBonusOpen(true)}
          >
            اضافة حافز لموظف
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg"
            onClick={() => setDeductionOpen(true)}
          >
            خصم من مرتب موظف
          </button>
        </div>
        <DeductionForm open={deductionOpen} onClose={() => setDeductionOpen(false)} />
        <BonusForm open={bonusOpen} onClose={() => setBonusOpen(false)} />
        {isLoading && <div className="text-center p-4">جاري التحميل...</div>}
        {error && <div className="text-center p-4 text-red-500">حدث خطأ أثناء جلب البيانات</div>}
        {data && (
          <div className="overflow-x-auto rounded-xl v7-neu-card mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2">الموظف</th>
                  <th className="px-4 py-2">النوع</th>
                  <th className="px-4 py-2">المبلغ</th>
                  <th className="px-4 py-2">إجمالي الراتب</th>
                  <th className="px-4 py-2">السبب</th>
                  <th className="px-4 py-2">المسؤول</th>
                  <th className="px-4 py-2">الشهر</th>
                  <th className="px-4 py-2">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-2">{item.employee?._id || "-"}</td>
                    <td className="px-4 py-2">{item.type}</td>
                    <td className="px-4 py-2">{item.amount}</td>
                    <td className="px-4 py-2">{item.totalSalary}</td>
                    <td className="px-4 py-2">{item.reason}</td>
                    <td className="px-4 py-2">{item.admin}</td>
                    <td className="px-4 py-2">{item.month ? new Date(item.month).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </V7Layout>
  )
} 