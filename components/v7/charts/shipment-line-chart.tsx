"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { chartColors } from "@/lib/chart-data"

interface LineChartProps {
  data: any[]
  height?: number
  colors?: string[]
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}

export function V7ShipmentLineChart({
  data = [],
  height = 300,
  colors = [chartColors.primary],
  showLegend = true,
  valueFormatter = (value) => `${value}`,
}: LineChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center bg-[#f0f4f8] rounded-lg" style={{ height: `${height}px` }}>
        <div className="text-[#6d6a67]">جاري تحميل الرسم البياني...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
          formatter={(value) => [valueFormatter(Number(value))]}
        />
        {showLegend && (
          <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} iconType="circle" />
        )}
        <Line
          type="monotone"
          dataKey="شحنات"
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line type="monotone" dataKey="تسليم" stroke={chartColors.success} strokeWidth={2} dot={{ strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
