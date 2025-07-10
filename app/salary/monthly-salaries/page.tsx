"use client"
import { useState } from "react";
import { useGetSalariesByMonthQuery, SalaryByMonth, useUpdateSalaryStatusToPaidMutation } from "../../api/salaryApi";
import V7Layout from "@/components/v7/v7-layout";

const months = [
  { value: 1, label: "يناير" },
  { value: 2, label: "فبراير" },
  { value: 3, label: "مارس" },
  { value: 4, label: "إبريل" },
  { value: 5, label: "مايو" },
  { value: 6, label: "يونيو" },
  { value: 7, label: "يوليو" },
  { value: 8, label: "أغسطس" },
  { value: 9, label: "سبتمبر" },
  { value: 10, label: "أكتوبر" },
  { value: 11, label: "نوفمبر" },
  { value: 12, label: "ديسمبر" },
];

export default function MonthlySalariesPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const year = now.getFullYear();
  const { data, isLoading, error, refetch } = useGetSalariesByMonthQuery({ month, year });
  const [updateSalaryStatusToPaid, { isLoading: isPaying }] = useUpdateSalaryStatusToPaidMutation();

  const handlePaySalary = async (id: string) => {
    try {
      const res = await updateSalaryStatusToPaid({ id }).unwrap();
      alert(res.message);
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "حدث خطأ أثناء دفع الراتب");
    }
  };

  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">الرواتب الشهرية</h1>
        <div className="flex gap-4 mb-8">
          <select
            className="border rounded-lg px-4 py-2"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <input
            className="border rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800"
            value={year}
            readOnly
            type="number"
          />
        </div>
        {isLoading && <div className="text-center p-4">جاري التحميل...</div>}
        {error && <div className="text-center p-4 text-red-500">حدث خطأ أثناء جلب البيانات</div>}
        {data && (
          <div className="overflow-x-auto rounded-xl v7-neu-card mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2">الموظف</th>
                  <th className="px-4 py-2">الراتب الأساسي</th>
                  <th className="px-4 py-2">الحوافز</th>
                  <th className="px-4 py-2">الخصومات</th>
                  <th className="px-4 py-2">إجمالي الراتب</th>
                  <th className="px-4 py-2">تاريخ الراتب</th>
                  <th className="px-4 py-2">الحالة</th>
                  <th className="px-4 py-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.data.salaries.map((item: SalaryByMonth) => (
                  <tr key={item._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-2">{item.employeeId?.fullName || "-"}</td>
                    <td className="px-4 py-2">{item.baseSalary}</td>
                    <td className="px-4 py-2">{item.bonus}</td>
                    <td className="px-4 py-2">{item.deduction}</td>
                    <td className="px-4 py-2">{item.totalSalary}</td>
                    <td className="px-4 py-2">{item.salaryDate ? new Date(item.salaryDate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2">{item.isPaid ? "مدفوع" : "غير مدفوع"}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                        type="button"
                        disabled={item.isPaid || isPaying}
                        onClick={() => handlePaySalary(item._id)}
                      >
                        دفع الراتب
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </V7Layout>
  );
} 