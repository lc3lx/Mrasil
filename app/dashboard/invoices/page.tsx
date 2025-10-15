"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGetAllShipmentsQuery } from "@/app/api/adminApi";
import { useGetAllShipmentCompaniesQuery } from "@/app/api/shipmentCompanyApi";
import { Search, Eye, X, Download } from "lucide-react";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";

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

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl border text-center">
            <div className="text-xl font-semibold mb-2">غير مصرح لك بالوصول</div>
            <a href="/dashboard" className="text-blue-600 underline">العودة للداشبورد</a>
          </div>
        </div>
      </DashboardLayout>
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
        s.shapmentCompany || "",
        s.paymentMathod || "",
        s.shipmentstates || "",
        s.boxNum ?? "",
        s.weight ?? "",
        s.createdAt ? new Date(s.createdAt).toLocaleString("ar-SA") : "",
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الفواتير</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="بحث برقم التتبع أو رقم الشركة"
              className="pl-4 pr-10 py-2 border rounded-lg"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg">
            <option value="">كل الحالات</option>
            <option value="IN_TRANSIT">في الطريق</option>
            <option value="READY_FOR_PICKUP">جاهزة للاستلام</option>
            <option value="Delivered">تم التسليم</option>
            <option value="Canceled">ملغية</option>
          </select>
          <select value={company} onChange={(e) => { setCompany(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg">
            <option value="">كل الشركات</option>
            {companyOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={String(limit)} onChange={(e) => { const v = e.target.value === "1000" ? 1000 : Number(e.target.value); setLimit(v); setPage(1); }} className="px-3 py-2 border rounded-lg">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">الكل</option>
          </select>
          <button onClick={exportExcel} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-green-600 border-green-200 hover:bg-green-50">
            <Download className="w-4 h-4" />
            تصدير Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-0 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
          <div className="col-span-2">رقم التتبع</div>
          <div className="col-span-2">العميل</div>
          <div className="col-span-2">شركة الشحن</div>
          <div className="col-span-2">القيمة</div>
          <div className="col-span-2">التاريخ</div>
          <div className="col-span-2">الإجراءات</div>
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا توجد بيانات</div>
          ) : (
            filteredRows.map((s: any, i: number) => {
              const price = computePricing(s);
              return (
                <div key={s._id} className="grid grid-cols-12 gap-0 px-4 py-3 items-center">
                  <div className="col-span-2">{s.trackingId || s.companyshipmentid || `#${i+1}`}</div>
                  <div className="col-span-2">{`${s.customerId?.firstName || ''} ${s.customerId?.lastName || ''}`.trim() || '—'}</div>
                  <div className="col-span-2">{s.shapmentCompany}</div>
                  <div className="col-span-2">{currency(price.total)}</div>
                  <div className="col-span-2">{new Date(s.createdAt).toLocaleDateString('ar-SA')}</div>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => setPreview(s)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Eye className="w-4 h-4" /> عرض الفاتورة
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl border shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">فاتورة الشحنة</div>
              <button onClick={() => setPreview(null)} className="p-2 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">رقم التتبع</div>
                  <div className="font-semibold">{preview.trackingId || preview.companyshipmentid}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">تاريخ الإنشاء</div>
                  <div className="font-semibold">{new Date(preview.createdAt).toLocaleString("ar-SA")}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">شركة الشحن</div>
                  <div className="font-semibold">{preview.shapmentCompany}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">نوع الشحن</div>
                  <div className="font-semibold">{preview.shapmentingType}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 border">
                  <div className="font-semibold mb-2">بيانات المرسل</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>{preview.senderAddress?.full_name}</div>
                    <div>{preview.senderAddress?.mobile}</div>
                    <div>{[preview.senderAddress?.address, preview.senderAddress?.city, preview.senderAddress?.country].filter(Boolean).join("، ")}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border">
                  <div className="font-semibold mb-2">بيانات المستلم</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>{preview.receiverAddress?.clientName}</div>
                    <div>{preview.receiverAddress?.clientPhone}</div>
                    <div>{[preview.receiverAddress?.clientAddress, preview.receiverAddress?.city, preview.receiverAddress?.country].filter(Boolean).join("، ")}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">عدد الصناديق</div>
                  <div className="font-semibold">{preview.boxNum}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">الوزن</div>
                  <div className="font-semibold">{preview.weight} كجم</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">طريقة الدفع</div>
                  <div className="font-semibold">{preview.paymentMathod}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">الحالة</div>
                  <div className="font-semibold">{preview.shipmentstates}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 font-semibold">تفاصيل التسعير</div>
                {(() => {
                  const p = computePricing(preview);
                  return (
                    <div className="p-4 text-sm text-gray-700 space-y-1">
                      <div className="grid grid-cols-2">
                        <div>السعر الأساسي</div>
                        <div className="text-right">{currency(p.base)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>الربح</div>
                        <div className="text-right">{currency(p.profit)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>وزن زائد ({p.overweightKg} كجم)</div>
                        <div className="text-right">{currency(p.baseAdd + p.profitAdd)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>COD</div>
                        <div className="text-right">{currency(p.baseCOD + p.profitCOD)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>RTO</div>
                        <div className="text-right">{currency(p.baseRTO + p.profitRTO)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>التقاط</div>
                        <div className="text-right">{currency(p.pickupBase + p.pickupProfit)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>المجموع قبل الضريبة</div>
                        <div className="text-right">{currency(p.subtotal)}</div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div>ضريبة ({Math.round(p.priceaddedtax*100)}%)</div>
                        <div className="text-right">{currency(p.vat)}</div>
                      </div>
                      <div className="grid grid-cols-2 font-semibold">
                        <div>الإجمالي</div>
                        <div className="text-right">{currency(p.total)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
