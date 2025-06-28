"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface V7WhatsAppWebhookProps {
  theme: "light" | "dark"
}

export function V7WhatsAppWebhook({ theme }: V7WhatsAppWebhookProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [wabaId, setWabaId] = useState("")
  const [phoneNumberId, setPhoneNumberId] = useState("")
  const [token, setToken] = useState("whsec_f7d91a2b3c4e5f6789abcdef0123456789")
  const [showNotification, setShowNotification] = useState(false)

  // للتبديل بين النشط وغير النشط
  const handleToggle = () => {
    setIsEnabled(!isEnabled)
  }

  // لنسخ رمز التوكن
  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  // لتوليد رمز جديد
  const generateNewToken = () => {
    const newToken =
      "whsec_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setToken(newToken)
  }

  // لتحديث معلومات الويب هوك
  const updateWebhook = () => {
    // هنا يمكن إضافة منطق لتحديث الويب هوك
    alert("تم تحديث بيانات الويب هوك بنجاح")
  }

  return (
    <Card
      className={`v7-neu-card mb-6 relative overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-[#1a2e4c] to-[#162238]" : "bg-gradient-to-br from-[#f8fafc] to-[#eef2f6]"}`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full transform translate-x-20 -translate-y-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/5 rounded-full transform -translate-x-20 translate-y-20 z-0"></div>
    </Card>
  )
}
