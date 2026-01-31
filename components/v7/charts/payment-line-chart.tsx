"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { chartColors } from "@/lib/chart-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface PaymentLineChartProps {
  data?: any[];
  height?: number;
  totalDeposits?: number;
  totalPayments?: number;
  walletSummary?: any;
}

export function PaymentLineChart({
  data,
  height = 300,
  totalDeposits,
  totalPayments,
  walletSummary,
}: PaymentLineChartProps) {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    setMounted(true);
  }, []);

  // إنشاء بيانات شهرية افتراضية إذا لم تكن متوفرة
  const generateMonthlyData = () => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];

    return months.map((month, index) => {
      const baseDeposit = totalDeposits ? totalDeposits / 12 : 1000;
      const basePayment = totalPayments ? totalPayments / 12 : 800;

      // إضافة تباين طبيعي للبيانات
      const depositVariation = 0.7 + Math.random() * 0.6; // بين 0.7 و 1.3
      const paymentVariation = 0.7 + Math.random() * 0.6;

      return {
        name: month,
        إيرادات: Math.round(baseDeposit * depositVariation),
        مصروفات: Math.round(basePayment * paymentVariation),
        صافي: Math.round(
          baseDeposit * depositVariation - basePayment * paymentVariation
        ),
      };
    });
  };

  // إنشاء بيانات أسبوعية
  const generateWeeklyData = () => {
    const weeks = ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"];

    return weeks.map((week, index) => {
      const baseDeposit = totalDeposits ? totalDeposits / 4 : 3000;
      const basePayment = totalPayments ? totalPayments / 4 : 2400;

      const depositVariation = 0.7 + Math.random() * 0.6;
      const paymentVariation = 0.7 + Math.random() * 0.6;

      return {
        name: week,
        إيرادات: Math.round(baseDeposit * depositVariation),
        مصروفات: Math.round(basePayment * paymentVariation),
        صافي: Math.round(
          baseDeposit * depositVariation - basePayment * paymentVariation
        ),
      };
    });
  };

  let chartData = data || [];

  if (!data || data.length === 0) {
    if (timeRange === "week") {
      chartData = generateWeeklyData();
    } else {
      chartData = generateMonthlyData();
    }
  }

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center bg-[#f0f4f8] rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-gry">جاري تحميل الرسم البياني...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* فلتر الفترة الزمنية - نفس تصميم المعاملات المالية */}
      <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-4" dir="rtl">
        <div className="flex gap-2 w-full md:w-auto justify-start">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-full md:w-[180px] v7-neu-input pe-4 flex items-center justify-between bg-white dark:bg-gray-800 text-[#294D8B] dark:text-blue-400 font-medium shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-[#294D8B] dark:border-blue-500"
              dir="rtl"
            >
              <SelectValue placeholder="اختر الفترة" />
              <Filter className="h-4 w-4 ml-2" />
            </SelectTrigger>
            <SelectContent
              className="dark:bg-gray-800 bg-[#f0f4f8] border-none"
              dir="rtl"
            >
              <SelectItem value="week" className="dark:text-gray-200">
                أسبوعي
              </SelectItem>
              <SelectItem value="month" className="dark:text-gray-200">
                شهري
              </SelectItem>
              <SelectItem value="year" className="dark:text-gray-200">
                سنوي
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="name"
            stroke={chartColors.text}
            fontSize={12}
            tickMargin={10}
            axisLine={{ stroke: chartColors.grid }}
          />
          <YAxis
            stroke={chartColors.text}
            fontSize={12}
            tickMargin={10}
            axisLine={{ stroke: chartColors.grid }}
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
            formatter={(value) => [value === 0 ? "0 ريال" : `${value} ريال`]}
          />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "10px" }}
            iconType="circle"
            formatter={(value: string) => (
              <span style={{ marginInlineStart: "6px" }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="إيرادات"
            stroke={chartColors.secondary}
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{ r: 4, strokeWidth: 0, fill: chartColors.secondary }}
          />
          <Line
            type="monotone"
            dataKey="مصروفات"
            stroke={"#e74c3c"}
            strokeWidth={3}
            activeDot={{ r: 6, strokeWidth: 0 }}
            dot={{ r: 4, strokeWidth: 0, fill: "#e74c3c" }}
          />
          <Line
            type="monotone"
            dataKey="صافي"
            stroke={"#27ae60"}
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={{ r: 5, strokeWidth: 0 }}
            dot={{ r: 3, strokeWidth: 0, fill: "#27ae60" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
