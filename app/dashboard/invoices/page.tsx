"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGetAllShipmentsQuery } from "@/app/api/adminApi";
import { useGetAllShipmentCompaniesQuery } from "@/app/api/shipmentCompanyApi";
import { Search, Eye, X, Download, Receipt, TrendingUp, Package, DollarSign, ArrowLeft } from "lucide-react";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import Link from "next/link";

function currency(n: number | undefined) {
  return (Number(n) || 0).toLocaleString() + " ريال";
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [company, setCompany] = useState("");
  const [limit, setLimit] = useState(25 as number);
  const { data: listRes, isLoading } = useGetAllShipmentsQuery({ page, limit, status, search });
  const { data: companies } = useGetAllShipmentCompaniesQuery();

  const [preview, setPreview] = useState<any | null>(null);

  const companiesMap = useMemo(() => {
    const map: Record<string, any> = {};
    (companies || []).forEach((c: any) => {
      map[c.company] = c;
    });
    return map;
  }, [companies]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

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

  const rows = listRes?.data || [];
  const companyOptions = useMemo(() => {
    const set = new Set<string>();
    (companies || []).forEach((c: any) => set.add(c.company));
    return Array.from(set);
  }, [companies]);
  const filteredRows = useMemo(() => rows.filter((s: any) => !company || s.shapmentCompany === company), [rows, company]);

  const computePricing = (shipment: any) => {
    const c = companiesMap[shipment.shapmentCompany || ""];
    const sp = shipment.shapmentPrice || {};
    const maxWeight = (() => {
      const types = (c?.shipmentType || c?.shippingTypes || []) as any[];
      const t = types.find((x: any) => x.type === shipment.shapmentingType);
      return t?.maxWeight || 0;
    })();
    const weight = Number(shipment.weight) || 0;
    const overweightKg = maxWeight > 0 ? Math.max(0, Math.ceil(weight - maxWeight)) : 0;

    const base = Number(sp.basePrice) || 0;
    const profit = Number(sp.profitPrice) || 0;
    const baseAdd = Number(sp.baseAdditionalweigth) || 0;
    const profitAdd = Number(sp.profitAdditionalweigth) || 0;
    const baseCOD = Number(sp.baseCODfees) || 0;
    const profitCOD = Number(sp.profitCODfees) || 0;
    const baseRTO = Number(sp.baseRTOprice) || 0;
    const profitRTO = Number(sp.profitRTOprice) || 0;
    const pickupBase = Number(sp.basepickUpPrice) || 0;
    const pickupProfit = Number(sp.profitpickUpPrice) || 0;
    const priceaddedtax = Number(sp.priceaddedtax) || 0.15;

    const isReturn = shipment.shapmentType === "reverse";
    const isCOD = shipment.paymentMathod === "COD";

    const payable = base + overweightKg * baseAdd + (isCOD ? baseCOD : 0) + (isReturn ? baseRTO : 0) + pickupBase;
    const ourProfit = profit + overweightKg * profitAdd + (isCOD ? profitCOD : 0) + (isReturn ? profitRTO : 0) + pickupProfit;
    const subtotal = payable + ourProfit;
    const vat = subtotal * priceaddedtax;
    const total = Number(shipment.totalprice) || subtotal + vat;

    return { base, profit, baseAdd, profitAdd, baseCOD, profitCOD, baseRTO, profitRTO, pickupBase, pickupProfit, priceaddedtax, overweightKg, subtotal, vat, total };
  };

  const exportExcel = async () => {
    const headers = [
      "رقم التتبع",
      "العميل",
      "إيميل المرسل",
      "إيميل التاجر",
      "إيميل المستلم",
      "الشركة",
      "طريقة الدفع",
      "الحالة",
      "عدد الصناديق",
      "الوزن",
      "التاريخ",
      "الإجمالي",
      "الأساسي",
      "الربح",
      "وزن زائد (كجم)",
      "COD",
      "RTO",
      "التقاط",
      "قبل الضريبة",
      "الضريبة",
    ];
    const data = filteredRows.map((s: any) => {
      const p = computePricing(s);
      return [
        s.trackingId || s.companyshipmentid || "",
        `${s.customerId?.firstName || ""} ${s.customerId?.lastName || ""}`.trim(),
        s.senderAddress?.email || s.customerId?.email || "",
        s.customerId?.email || "",
        s.receiverAddress?.email || "",
        s.shapmentCompany || "",
        s.paymentMathod || "",
        s.shipmentstates || "",
        s.boxNum ?? "",
        s.weight ?? "",
        s.createdAt ? new Date(s.createdAt).toLocaleString("en-GB") : "",
        p.total,
        p.base,
        p.profit,
        p.overweightKg,
        p.baseCOD + p.profitCOD,
        p.baseRTO + p.profitRTO,
        p.pickupBase + p.pickupProfit,
        p.subtotal,
        p.vat,
      ];
    });
    const wb = await XlsxPopulate.fromBlankAsync();
    const sheet = wb.sheet(0);
    headers.forEach((h, i) => {
      sheet.cell(1, i + 1).value(h).style({ bold: true });
      sheet.column(i + 1).width(Math.max(14, String(h).length + 6));
    });
    data.forEach((row, i) => {
      row.forEach((cell, j) => {
        sheet.cell(i + 2, j + 1).value(cell);
      });
    });
    const blob = await wb.outputAsync("blob");
    saveAs(blob, "invoices.xlsx");
  };

  // Calculate stats
  const totalInvoices = filteredRows.length;
  const totalRevenue = filteredRows.reduce((sum: number, s: any) => sum + computePricing(s).total, 0);
  const deliveredCount = filteredRows.filter((s: any) => s.shipmentstates === 'Delivered').length;
  const pendingCount = filteredRows.filter((s: any) => s.shipmentstates === 'IN_TRANSIT' || s.shipmentstates === 'READY_FOR_PICKUP').length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
        <motion.div 
          className="space-y-8 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-fuchsia-600 via-pink-700 to-rose-800 rounded-2xl shadow-2xl"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href="/dashboard" 
                  className="text-white/80 hover:text-white mb-2 inline-flex items-center gap-2 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  العودة للداشبورد
                </Link>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة الفواتير</h1>
                  <p className="text-pink-100 text-lg">عرض وإدارة جميع فواتير الشحنات والتفاصيل المالية</p>
                </div>
                
                <div className="hidden md:flex items-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Receipt className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(236, 72, 153, 0.15), 0 8px 16px -8px rgba(236, 72, 153, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الفواتير</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{totalInvoices.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Receipt className="w-4 h-4 text-pink-500 ml-1" />
                    <span className="text-sm text-pink-600 font-medium">فاتورة نشطة</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Receipt className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(34, 197, 94, 0.15), 0 8px 16px -8px rgba(34, 197, 94, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الإيرادات</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{currency(totalRevenue)}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-600 font-medium">+12% من الشهر الماضي</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <DollarSign className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.15), 0 8px 16px -8px rgba(59, 130, 246, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">شحنات مسلمة</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{deliveredCount.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-blue-500 ml-1" />
                    <span className="text-sm text-blue-600 font-medium">مكتملة</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Package className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(245, 158, 11, 0.15), 0 8px 16px -8px rgba(245, 158, 11, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">شحنات معلقة</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{pendingCount.toLocaleString()}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-amber-500 ml-1" />
                    <span className="text-sm text-amber-600 font-medium">في الانتظار</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Invoices Table */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden"
            variants={itemVariants}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-indigo-50/30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-500/5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">قائمة الفواتير</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="بحث برقم التتبع أو رقم الشركة"
                      className="pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                    />
                  </div>
                  
                  <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
            <option value="">كل الحالات</option>
            <option value="IN_TRANSIT">في الطريق</option>
            <option value="READY_FOR_PICKUP">جاهزة للاستلام</option>
            <option value="Delivered">تم التسليم</option>
            <option value="Canceled">ملغية</option>
          </select>
                  <select value={company} onChange={(e) => { setCompany(e.target.value); setPage(1); }} className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
                    <option value="">كل الشركات</option>
                    {companyOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select value={String(limit)} onChange={(e) => { const v = e.target.value === "1000" ? 1000 : Number(e.target.value); setLimit(v); setPage(1); }} className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">الكل</option>
                  </select>
                  <motion.button 
                    onClick={exportExcel} 
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    تصدير Excel
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-x-auto">
                <div className="overflow-hidden rounded-xl border border-gray-200 min-w-[1200px]">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                      <div className="col-span-2">رقم التتبع</div>
                      <div className="col-span-2">العميل</div>
                      <div className="col-span-2">إيميل المرسل</div>
                      <div className="col-span-2">إيميل المستلم</div>
                      <div className="col-span-2">شركة الشحن</div>
                      <div className="col-span-1">القيمة</div>
                      <div className="col-span-1">الإجراءات</div>
                    </div>
                  </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
                  ) : rows.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">لا توجد بيانات</div>
                  ) : (
                    filteredRows.map((s: any, i: number) => {
                      const price = computePricing(s);
                      return (
                        <motion.div 
                          key={s._id} 
                          className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                          whileHover={{ backgroundColor: "#f9fafb" }}
                        >
                          <div className="col-span-2 font-medium text-gray-900">{s.trackingId || s.companyshipmentid || `#${i+1}`}</div>
                          <div className="col-span-2 text-gray-700">{`${s.customerId?.firstName || ''} ${s.customerId?.lastName || ''}`.trim() || '—'}</div>
                          <div className="col-span-2 text-gray-600 text-sm">
                            <div className="truncate" title={s.senderAddress?.email || s.customerId?.email || '—'}>
                              {s.senderAddress?.email || s.customerId?.email || '—'}
                            </div>
                          </div>
                          <div className="col-span-2 text-gray-600 text-sm">
                            <div className="truncate" title={s.receiverAddress?.email || '—'}>
                              {s.receiverAddress?.email || '—'}
                            </div>
                          </div>
                          <div className="col-span-2 text-gray-700">{s.shapmentCompany}</div>
                          <div className="col-span-1 font-semibold text-gray-900">{currency(price.total)}</div>
                          <div className="col-span-1 flex justify-end">
                            <motion.button 
                              onClick={() => setPreview(s)} 
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-4 h-4" /> عرض
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Invoice Detail Modal */}
      {preview && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white w-full max-w-4xl rounded-2xl border shadow-xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">فاتورة الشحنة</h2>
              <button 
                onClick={() => setPreview(null)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">رقم التتبع</div>
                  <div className="font-semibold text-gray-900">{preview.trackingId || preview.companyshipmentid}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">تاريخ الإنشاء</div>
                  <div className="font-semibold text-gray-900">{new Date(preview.createdAt).toLocaleString("en-GB")}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">شركة الشحن</div>
                  <div className="font-semibold text-gray-900">{preview.shapmentCompany}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">نوع الشحن</div>
                  <div className="font-semibold text-gray-900">{preview.shapmentingType}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    بيانات المرسل
                  </div>
                  <div className="text-sm text-blue-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الاسم:</span>
                      <span>{preview.senderAddress?.full_name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الإيميل:</span>
                      <span className="bg-blue-100 px-2 py-1 rounded text-xs font-mono break-all">
                        {preview.senderAddress?.email || preview.customerId?.email || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الهاتف:</span>
                      <span>{preview.senderAddress?.mobile || '—'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">العنوان:</span>
                      <span>{[preview.senderAddress?.address, preview.senderAddress?.city, preview.senderAddress?.country].filter(Boolean).join("، ") || '—'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                  <div className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    بيانات التاجر/العميل
                  </div>
                  <div className="text-sm text-purple-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الاسم:</span>
                      <span>{`${preview.customerId?.firstName || ''} ${preview.customerId?.lastName || ''}`.trim() || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الإيميل:</span>
                      <span className="bg-purple-100 px-2 py-1 rounded text-xs font-mono break-all">
                        {preview.customerId?.email || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الهاتف:</span>
                      <span>{preview.customerId?.mobile || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الدور:</span>
                      <span className="bg-purple-100 px-2 py-1 rounded text-xs">
                        {preview.customerId?.role || 'عميل'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    بيانات المستلم
                  </div>
                  <div className="text-sm text-green-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الاسم:</span>
                      <span>{preview.receiverAddress?.clientName || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الإيميل:</span>
                      <span className="bg-green-100 px-2 py-1 rounded text-xs font-mono break-all">
                        {preview.receiverAddress?.email || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">الهاتف:</span>
                      <span>{preview.receiverAddress?.clientPhone || '—'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">العنوان:</span>
                      <span>{[preview.receiverAddress?.clientAddress, preview.receiverAddress?.city, preview.receiverAddress?.country].filter(Boolean).join("، ") || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500 mb-1">عدد الصناديق</div>
                  <div className="font-semibold text-gray-900">{preview.boxNum}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500 mb-1">الوزن</div>
                  <div className="font-semibold text-gray-900">{preview.weight} كجم</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500 mb-1">طريقة الدفع</div>
                  <div className="font-semibold text-gray-900">{preview.paymentMathod}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500 mb-1">الحالة</div>
                  <div className="font-semibold text-gray-900">{preview.shipmentstates}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-xl border border-fuchsia-100 overflow-hidden">
                <div className="bg-gradient-to-r from-fuchsia-500 to-pink-600 px-6 py-4">
                  <h3 className="font-bold text-white">تفاصيل التسعير</h3>
                </div>
                {(() => {
                  const p = computePricing(preview);
                  return (
                    <div className="p-6 space-y-3">
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">السعر الأساسي</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.base)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">الربح</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.profit)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">وزن زائد ({p.overweightKg} كجم)</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.baseAdd + p.profitAdd)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">COD</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.baseCOD + p.profitCOD)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">RTO</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.baseRTO + p.profitRTO)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">التقاط</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.pickupBase + p.pickupProfit)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">المجموع قبل الضريبة</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.subtotal)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-2 border-b border-fuchsia-100">
                        <div className="text-gray-700 font-medium">ضريبة ({Math.round(p.priceaddedtax*100)}%)</div>
                        <div className="text-right font-semibold text-gray-900">{currency(p.vat)}</div>
                      </div>
                      <div className="grid grid-cols-2 py-3 bg-gradient-to-r from-fuchsia-100 to-pink-100 rounded-lg px-4">
                        <div className="text-fuchsia-900 font-bold text-lg">الإجمالي</div>
                        <div className="text-right font-bold text-fuchsia-900 text-lg">{currency(p.total)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
