"use client"

import { useEffect, useState } from "react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { chartColors } from "@/lib/chart-data"

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey?: string
  height?: number
  colors?: string[]
}

export function PieChart({
  data,
  dataKey,
  nameKey = "name",
  height = 300,
  colors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.tertiary,
    chartColors.quaternary,
    chartColors.quinary,
  ],
}: PieChartProps) {
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
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill={chartColors.primary}
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
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
        <Legend align="right" verticalAlign="bottom" layout="horizontal" iconType="circle" />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
