"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { chartColors } from "@/lib/chart-data"

interface PaymentLineChartProps {
  data?: any[]
  height?: number
  totalDeposits?: number
  totalPayments?: number
}

export function PaymentLineChart({ data, height = 300, totalDeposits, totalPayments }: PaymentLineChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let chartData = data || [];
  if (typeof totalDeposits === 'number' && typeof totalPayments === 'number') {
    chartData = [
      { name: 'الإيداعات', "إيرادات": totalDeposits, "مصروفات": 0 },
      { name: 'المدفوعات', "إيرادات": 0, "مصروفات": totalPayments },
    ];
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center bg-[#f0f4f8] rounded-lg" style={{ height: `${height}px` }}>
        <div className="text-[#6d6a67]">جاري تحميل الرسم البياني...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis
          dataKey="name"
          stroke={chartColors.text}
          fontSize={12}
          tickMargin={10}
          axisLine={{ stroke: chartColors.grid }}
        />
        <YAxis stroke={chartColors.text} fontSize={12} tickMargin={10} axisLine={{ stroke: chartColors.grid }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
            textAlign: "right",
            direction: "rtl",
          }}
          formatter={(value) => [value === 0 ? "0 ريال" : `${value} ريال`]}
        />
        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} iconType="circle" />
        <Line
          type="monotone"
          dataKey="إيرادات"
          stroke={chartColors.secondary}
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 0 }}
          dot={{ r: 4, strokeWidth: 0, fill: chartColors.secondary }}
        />
        <Line
          type="monotone"
          dataKey="مصروفات"
          stroke={"#e74c3c"}
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 0 }}
          dot={{ r: 4, strokeWidth: 0, fill: "#e74c3c" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
