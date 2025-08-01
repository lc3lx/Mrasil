"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ShipmentChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = [
    { name: "السبت", شحنات: 4, توصيل: 3, إلغاء: 1 },
    { name: "الأحد", شحنات: 7, توصيل: 5, إلغاء: 0 },
    { name: "الإثنين", شحنات: 10, توصيل: 8, إلغاء: 1 },
    { name: "الثلاثاء", شحنات: 8, توصيل: 7, إلغاء: 0 },
    { name: "الأربعاء", شحنات: 12, توصيل: 10, إلغاء: 2 },
    { name: "الخميس", شحنات: 15, توصيل: 12, إلغاء: 1 },
    { name: "الجمعة", شحنات: 9, توصيل: 8, إلغاء: 0 },
  ]

  if (!mounted) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">جاري تحميل الرسم البياني...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
            textAlign: "right",
            direction: "rtl",
          }}
        />
        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
        <Line
          type="monotone"
          dataKey="شحنات"
          stroke="#3b82f6"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ strokeWidth: 2 }}
        />
        <Line type="monotone" dataKey="توصيل" stroke="#10b981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
        <Line type="monotone" dataKey="إلغاء" stroke="#f43f5e" strokeWidth={2} dot={{ strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
