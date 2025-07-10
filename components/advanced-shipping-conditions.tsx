"use client"

import { useState } from "react"
import { X, ChevronDown, Plus } from "lucide-react"

export default function AdvancedShippingConditions() {
  const [conditions, setConditions] = useState([{ id: 1 }])
  const [actions, setActions] = useState([{ id: 1 }])

  const addCondition = () => {
    const newId = conditions.length > 0 ? Math.max(...conditions.map((c) => c.id)) + 1 : 1
    setConditions([...conditions, { id: newId }])
  }

  const removeCondition = (id: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((condition) => condition.id !== id))
    }
  }

  const addAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1
    setActions([...actions, { id: newId }])
  }

  const removeAction = (id: number) => {
    if (actions.length > 1) {
      setActions(actions.filter((action) => action.id !== id))
    }
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Main content area */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">تقسيم الشحنات لفئات</h1>
          <button className="bg-[#1a3a6c] text-white hover:bg-[#15305a] rounded-md text-sm px-4 py-2">
            إنشاء خاصية أتمتة جديدة
          </button>
        </div>

        {/* Conditions Section */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="text-red-500 font-bold">*</div>
            <div className="text-[#1a3a6c] font-semibold">إذا</div>
          </div>

          <div className="p-4">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="mb-4">
                {index > 0 && <div className="text-gray-500 text-sm mb-2">وكذلك</div>}
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-red-500"
                    aria-label="حذف الشرط"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex-1">
                    <div className="relative border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between p-2 cursor-pointer">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">إختر خصائص الشحنة</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="relative border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between p-2 cursor-pointer">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">يساوي</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex">
                      <div className="bg-gray-100 border border-gray-200 rounded-r-md flex items-center px-3">
                        <span className="text-gray-600">SAR</span>
                      </div>
                      <input
                        type="text"
                        placeholder="السعر"
                        className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="w-full mt-2 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 font-medium p-2 rounded-md flex items-center justify-center"
              onClick={addCondition}
            >
              <Plus className="h-4 w-4 ml-2" /> إضافة شرط
            </button>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="text-red-500 font-bold">*</div>
            <div className="text-[#1a3a6c] font-semibold">قم</div>
          </div>

          <div className="p-4">
            {actions.map((action, index) => (
              <div key={action.id} className="mb-4">
                {index > 0 && <div className="text-gray-500 text-sm mb-2">بتنفيذ</div>}
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => removeAction(action.id)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-red-500"
                    aria-label="حذف الإجراء"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex-1">
                    <div className="relative border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between p-2 cursor-pointer">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">لا تستخدم شركة الشحن</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="relative border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between p-2 cursor-pointer">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">أرامكس</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="w-full mt-2 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 font-medium p-2 rounded-md flex items-center justify-center"
              onClick={addAction}
            >
              <Plus className="h-4 w-4 ml-2" /> إضافة إجراء
            </button>
          </div>
        </div>

        {/* Support Message */}
        <div className="text-gray-600 text-sm mb-6">لم تتمكن من إيجاد ماتبحث عنه ، يرجى التواصل معنا</div>

        {/* Shipping Property Name */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="text-[#1a3a6c] font-semibold">خاصية الشحن</div>
            <div className="text-red-500 font-bold mr-1">*</div>
          </div>
          <input
            type="text"
            placeholder="يرجى تسمية خاصية الشحن مثلا (الشحنات الأكبر من 10 كيلو)"
            className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Shipping Property Description */}
        <div className="mb-6">
          <div className="text-[#1a3a6c] font-semibold mb-2">وصف خاصية الشحن</div>
          <textarea
            placeholder="أضف وصف للخاصية ليسهل العودة لها مستقبلاً (اختياري)"
            className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <div className="h-1 bg-gray-800 w-1/3 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
