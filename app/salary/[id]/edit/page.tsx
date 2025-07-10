"use client"

import V7Layout from "@/components/v7/v7-layout"

export default function EditSalaryPage({ params }: { params: { id: string } }) {
  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">تعديل سجل الراتب</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">سيتم إضافة نموذج تعديل الراتب هنا لاحقًا.</p>
      </div>
    </V7Layout>
  )
} 