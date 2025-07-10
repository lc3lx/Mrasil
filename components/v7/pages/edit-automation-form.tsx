"use client"

import { Switch } from "@/components/ui/switch"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { routes } from "@/lib/routes"
import { ArrowRight, Save, X } from "lucide-react"

interface EditAutomationFormProps {
  id: string
}

export default function EditAutomationForm({ id }: EditAutomationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال البيانات
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // التنقل إلى صفحة تفاصيل القاعدة بعد التعديل
    router.push(routes.automationDetails(id))
  }

  const handleCancel = () => {
    router.push(routes.automationDetails(id))
  }

  return (
    <div className="space-y-6">
      <div className={`v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" className="v7-neu-button-secondary ml-2" onClick={handleCancel}>
            <ArrowRight className="h-4 w-4" />
            العودة
          </Button>
          <h1 className="text-2xl font-bold">تعديل قاعدة الأتمتة</h1>
        </div>

        <Card className="v7-neu-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم القاعدة</Label>
                    <Input id="name" className="v7-neu-input" placeholder="أدخل اسم القاعدة" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف القاعدة</Label>
                    <Textarea id="description" className="v7-neu-input" placeholder="أدخل وصفاً للقاعدة" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">تفعيل القاعدة</Label>
                  <Switch id="active" />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" className="v7-neu-button-sm gap-2" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  إلغاء
                </Button>

                <Button type="submit" className="v7-neu-button-primary gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
