"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetCustomerMeQuery } from "@/app/api/customerApi"

interface V7WelcomeBannerProps {
  theme: "light" | "dark"
}

const formatCustomerName = (customer?: {
  firstName?: string | null
  lastName?: string | null
  company_name_ar?: string | null
  company_name_en?: string | null
}) => {
  if (!customer) return ""
  const first = customer.firstName?.trim() ?? ""
  const last = customer.lastName?.trim() ?? ""
  const fullName = `${first} ${last}`.trim()
  if (fullName) return fullName
  return customer.company_name_ar?.trim() || customer.company_name_en?.trim() || ""
}

export function V7WelcomeBanner({ theme }: V7WelcomeBannerProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const [cachedName, setCachedName] = useState("")
  const router = useRouter()
  const { data, isLoading } = useGetCustomerMeQuery()
  const apiName = !isLoading ? formatCustomerName(data?.data) : ""
  const displayName = apiName || cachedName || "ضيفنا الكريم"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedUser =
      localStorage.getItem("userData") || localStorage.getItem("user")
    if (!storedUser) return
    try {
      const parsed = JSON.parse(storedUser)
      setCachedName((prev) => prev || formatCustomerName(parsed))
    } catch (error) {
      console.warn("Failed to parse stored user data", error)
    }
  }, [])

  useEffect(() => {
    if (!apiName) return
    setCachedName(apiName)
  }, [apiName])

  return (
    <div
      className={` mt-16 relative v7-neu-card-welcome p-6 rounded-xl md:p-8 transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0 translate-y-10"}`}
    >
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-[#294D8B]">مرحباً، {displayName}</h1>
          <p className="text-gry">مرحباً بك في لوحة تحكم مراسيل المطورة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* <Button className="v7-neu-button gap-2" onClick={() => router.push("/reports")}>
            <TrendingUp className="h-5 w-5" />
            <span>تقرير الأداء</span>
          </Button> */}
          <Button className="v7-neu-button-accent gap-2" onClick={() => router.push("/create-shipment")}>
            <Plus className="h-5 w-5" />
            <span>إنشاء شحنة جديدة</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
