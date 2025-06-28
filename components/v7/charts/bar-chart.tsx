"use client"

import { useEffect, useState } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { chartColors } from "@/lib/chart-data"

interface BarChartProps {
  data: any[]
  dataKey: string
  height?: number
  color?: string
  xAxisDataKey?: string
}

export function BarChart({
  data,
  dataKey,
  height = 300,
  color = chartColors.primary,
  xAxisDataKey = "name",
}: BarChartProps) {
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
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis
          dataKey={xAxisDataKey}
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
        />
        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} iconType="circle" />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
