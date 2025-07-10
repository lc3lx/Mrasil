"use client"

import { useEffect, useState } from "react"
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { chartColors } from "@/lib/chart-data"

interface ScatterChartProps {
  data: any[]
  xAxisDataKey: string
  yAxisDataKey: string
  height?: number
  color?: string
}

export function ScatterChart({
  data,
  xAxisDataKey,
  yAxisDataKey,
  height = 300,
  color = chartColors.primary,
}: ScatterChartProps) {
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
      <RechartsScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis
          dataKey={xAxisDataKey}
          name={xAxisDataKey}
          stroke={chartColors.text}
          fontSize={12}
          tickMargin={10}
          axisLine={{ stroke: chartColors.grid }}
          type="number"
          domain={["auto", "auto"]}
        />
        <YAxis
          dataKey={yAxisDataKey}
          name={yAxisDataKey}
          stroke={chartColors.text}
          fontSize={12}
          tickMargin={10}
          axisLine={{ stroke: chartColors.grid }}
          type="number"
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
            textAlign: "right",
            direction: "rtl",
          }}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} iconType="circle" />
        <Scatter name="البيانات" data={data} fill={color} />
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}
