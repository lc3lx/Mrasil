"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGetCarrierStatsQuery } from "@/app/api/adminApi";
import { ArrowLeft, Calendar, DollarSign, Package, Scale, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function CarriersStatsPage() {
  const { user } = useAuth();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const queryArgs = useMemo(() => ({ startDate: startDate || undefined, endDate: endDate || undefined }), [startDate, endDate]);
  const { data, isLoading, error, refetch } = useGetCarrierStatsQuery(queryArgs);

  useEffect(() => {
    // refetch when filters change
    refetch();
  }, [startDate, endDate, refetch]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
          <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">
            العودة للداشبورد
          </Link>
        </div>
      </div>
    );
  }

  const byCarrier = data?.data?.byCarrier || [];
  const overall = data?.data?.overall || {
    totals: { total: 0, delivered: 0, inTransit: 0, readyForPickup: 0, canceled: 0, returns: 0 },
    financials: { totalRevenue: 0, payableToCarrier: 0, ourProfit: 0, overweightKg: 0, overweightChargesBase: 0, overweightProfit: 0, codCount: 0, codBaseFeesTotal: 0, codProfitTotal: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100">
        <motion.div className="space-y-8 p-6" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl" variants={itemVariants}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard" className="text-white/80 hover:text-white mb-2 inline-flex items-center gap-2 transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  العودة للداشبورد
                </Link>
              </div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">إحصائيات شركات الشحن</h1>
                  <p className="text-cyan-100 text-lg">مقارنة أداء الشركات والحسابات المالية</p>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex flex-col">
                    <label className="text-white/80 text-sm mb-1">من</label>
                    <div className="flex items-center bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                      <Calendar className="w-4 h-4 mr-2 opacity-80" />
                      <input type="date" className="bg-transparent outline-none placeholder:text-white/60" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-white/80 text-sm mb-1">إلى</label>
                    <div className="flex items-center bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white">
                      <Calendar className="w-4 h-4 mr-2 opacity-80" />
                      <input type="date" className="bg-transparent outline-none placeholder:text-white/60" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overall Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الشحنات</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{overall.totals.total.toLocaleString()}</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white">
                  <Package className="h-10 w-10" />
                </div>
              </div>
            </div>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">تم التسليم</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{overall.totals.delivered.toLocaleString()}</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white">
                  <Truck className="h-10 w-10" />
                </div>
              </div>
            </div>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">مستحق للشركات</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{overall.financials.payableToCarrier.toLocaleString()} ريال</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center text-white">
                  <DollarSign className="h-10 w-10" />
                </div>
              </div>
            </div>
            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">الربح</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{overall.financials.ourProfit.toLocaleString()} ريال</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center text-white">
                  <Scale className="h-10 w-10" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden" variants={itemVariants}>
            <div className="relative space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">تفاصيل حسب الشركة</h3>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr className="text-right text-sm text-gray-700">
                      <th className="px-4 py-3 font-semibold">الشركة</th>
                      <th className="px-4 py-3 font-semibold">إجمالي</th>
                      <th className="px-4 py-3 font-semibold">تم التسليم</th>
                      <th className="px-4 py-3 font-semibold">مرتجع</th>
                      <th className="px-4 py-3 font-semibold">في الطريق</th>
                      <th className="px-4 py-3 font-semibold">جاهزة</th>
                      <th className="px-4 py-3 font-semibold">ملغية</th>
                      <th className="px-4 py-3 font-semibold">وزن زائد (كجم)</th>
                      <th className="px-4 py-3 font-semibold">رسوم الوزن الزائد (أساس)</th>
                      <th className="px-4 py-3 font-semibold">ربح الوزن الزائد</th>
                      <th className="px-4 py-3 font-semibold">COD (#)</th>
                      <th className="px-4 py-3 font-semibold">رسوم COD (أساس)</th>
                      <th className="px-4 py-3 font-semibold">ربح COD</th>
                      <th className="px-4 py-3 font-semibold">إيراد</th>
                      <th className="px-4 py-3 font-semibold">مستحق للشركة</th>
                      <th className="px-4 py-3 font-semibold">الربح</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={16} className="px-4 py-8 text-center text-gray-500">جاري التحميل...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={16} className="px-4 py-8 text-center text-red-500">فشل تحميل البيانات</td>
                      </tr>
                    ) : byCarrier.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="px-4 py-8 text-center text-gray-500">لا توجد بيانات</td>
                      </tr>
                    ) : (
                      byCarrier.map((row: any) => (
                        <tr key={row.company} className="text-sm text-gray-700">
                          <td className="px-4 py-3 font-semibold">{row.company}</td>
                          <td className="px-4 py-3">{row.totals.total.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.totals.delivered.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.totals.returns.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.totals.inTransit.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.totals.readyForPickup.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.totals.canceled.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.overweightKg.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.overweightChargesBase.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.overweightProfit.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.codCount.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.codBaseFeesTotal.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.codProfitTotal.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.totalRevenue.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.payableToCarrier.toLocaleString()}</td>
                          <td className="px-4 py-3">{row.financials.ourProfit.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
