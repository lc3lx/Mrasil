"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, ChevronDown } from "lucide-react"
import Image from "next/image"

const AdvancedShippingConditionsForm = () => {
  const [conditions, setConditions] = useState([{ id: 1 }])
  const [actions, setActions] = useState([{ id: 1 }])
  const [shippingName, setShippingName] = useState("")
  const [shippingDescription, setShippingDescription] = useState("")

  const addCondition = () => {
    const newId = conditions.length > 0 ? Math.max(...conditions.map((c) => c.id)) + 1 : 1
    setConditions([...conditions, { id: newId }])
  }

  const removeCondition = (id: number) => {
    setConditions(conditions.filter((condition) => condition.id !== id))
  }

  const addAction = () => {
    const newId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1
    setActions([...actions, { id: newId }])
  }

  const removeAction = (id: number) => {
    setActions(actions.filter((action) => action.id !== id))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col items-center">
        <div className="py-6 w-full flex justify-center">
          <div className="relative w-32 h-16">
            <Image src="/marasil-logo-blue-wings.png" alt="Marasil Logo" fill className="object-contain" />
          </div>
        </div>

        <div className="w-full px-4 py-2 space-y-4">
          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">الإعدادات</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">حسابي</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">الملف الشخصي</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">الباقات</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">المحفوظة</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">الفواتير</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                <path d="M8 10h8"></path>
                <path d="M8 14h8"></path>
                <path d="M8 18h8"></path>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <span className="text-gray-700">المتجر</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                <path d="M2 7h20"></path>
                <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path>
              </svg>
            </div>
          </div>

          {/* Add more sidebar items as needed */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#294D8B]">تقسيم الشحنات لفئات</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                إنشاء خاصية شحن جديدة
              </Button>
            </div>
          </div>

          {/* Conditions Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="text-lg font-semibold text-[#294D8B]">إذا*</div>
              <div className="text-sm text-gray-500">إختر خصائص الشحنة</div>
            </div>
            <div className="p-4">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="mb-4">
                  {index > 0 && <div className="text-sm text-gray-500 mb-2 text-right">وكذلك</div>}
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="absolute left-0 text-red-500 hover:text-red-700"
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
                        <Input placeholder="السعر" className="rounded-l-none" />
                        <div className="bg-gray-100 border border-gray-200 rounded-l-md flex items-center px-3">
                          <span className="text-gray-600">SAR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 font-medium"
                onClick={addCondition}
              >
                <Plus className="h-4 w-4 ml-2" /> إضافة شرط
              </Button>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="text-lg font-semibold text-[#294D8B]">قم*</div>
              <div className="text-sm text-gray-500">إختيار إجراء</div>
            </div>
            <div className="p-4">
              {actions.map((action, index) => (
                <div key={action.id} className="mb-4">
                  {index > 0 && <div className="text-sm text-gray-500 mb-2 text-right">بتنفيذ</div>}
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => removeAction(action.id)}
                      className="absolute left-0 text-red-500 hover:text-red-700"
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

              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-green-300 text-green-600 hover:bg-green-50 font-medium"
                onClick={addAction}
              >
                <Plus className="h-4 w-4 ml-2" /> إضافة إجراء
              </Button>
            </div>
          </div>

          {/* Message */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm mb-6 text-right">
            لم تتمكن من إيجاد ماتبحث عنه ، يرجى التواصل معنا
          </div>

          {/* Shipping Property Name */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100">
              <div className="text-lg font-semibold text-[#294D8B]">خاصية الشحن*</div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-right">
                  يرجى تسمية خاصية الشحن مثلا (الشحنات الأكبر من 10 كيلو)
                </label>
                <Input
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-right">وصف خاصية الشحن</label>
                <Textarea
                  value={shippingDescription}
                  onChange={(e) => setShippingDescription(e.target.value)}
                  placeholder="أضف وصف للخاصية ليسهل العودة لها مستقبلاً (اختياري)"
                  className="w-full min-h-[100px] text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-gray-200 text-gray-700">
              إلغاء
            </Button>
            <Button className="bg-[#294D8B] hover:bg-[#1e3a6a]">حفظ</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedShippingConditionsForm
