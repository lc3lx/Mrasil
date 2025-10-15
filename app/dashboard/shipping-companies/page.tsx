"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  useGetAllShipmentCompaniesQuery,
  useCreateShipmentCompanyMutation,
  useUpdateShipmentCompanyMutation,
  useDeleteShipmentCompanyMutation,
} from "@/app/api/shipmentCompanyApi";
import type { ShipmentCompany } from "@/app/api/shipmentCompanyApi";
import { Plus, Save, Trash2, X, Edit3 } from "lucide-react";

type AllowedBoxSize = { length: number; width: number; height: number; _id?: string };

type ShippingTypeRow = {
  type: "Dry" | "Cold" | "Quick" | "Box" | "offices";
  code: string;
  RTOcode: string;
  COD: boolean;
  maxCodAmount: number;
  maxWeight: number;
  denayWeight?: number;
  maxBoxes: number;
  priceaddedtax: number;
  basePrice: number;
  profitPrice: number;
  baseRTOprice: number;
  profitRTOprice: number;
  baseAdditionalweigth: number;
  profitAdditionalweigth: number;
  baseCODfees: number;
  profitCODfees: number;
  insurancecost: number;
  basepickUpPrice: number;
  profitpickUpPrice: number;
  _id?: string;
};

type FormState = {
  _id?: string;
  company: "smsa" | "redbox" | "omniclama" | "aramex" | "";
  deliveryTime: string;
  caver?: string;
  deliveryAt?: string;
  shipmentDelivertype?: string;
  minShipments: number;
  status: "Enabled" | "Disabled" | "";
  conditions: string;
  details: string;
  conditionsAr: string;
  detailsAr: string;
  trackingURL: string;
  pickUpStatus: "Yes" | "No" | "";
  shippingTypes: ShippingTypeRow[];
  allowedBoxSizes: AllowedBoxSize[];
};

const emptyType: ShippingTypeRow = {
  type: "Dry",
  code: "",
  RTOcode: "",
  COD: false,
  maxCodAmount: 0,
  maxWeight: 0,
  denayWeight: 0,
  maxBoxes: 1,
  priceaddedtax: 0.15,
  basePrice: 0,
  profitPrice: 0,
  baseRTOprice: 0,
  profitRTOprice: 0,
  baseAdditionalweigth: 0,
  profitAdditionalweigth: 0,
  baseCODfees: 0,
  profitCODfees: 0,
  insurancecost: 0,
  basepickUpPrice: 0,
  profitpickUpPrice: 0,
};

const emptyBox: AllowedBoxSize = { length: 0, width: 0, height: 0 };

const emptyForm: FormState = {
  company: "",
  deliveryTime: "2-3 أيام عمل",
  minShipments: 1,
  status: "Enabled",
  conditions: "",
  details: "",
  conditionsAr: "",
  detailsAr: "",
  trackingURL: "",
  pickUpStatus: "Yes",
  shippingTypes: [emptyType],
  allowedBoxSizes: [],
};

export default function ShippingCompaniesPage() {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGetAllShipmentCompaniesQuery();
  const [createCompany, { isLoading: creating }] = useCreateShipmentCompanyMutation();
  const [updateCompany, { isLoading: updating }] = useUpdateShipmentCompanyMutation();
  const [deleteCompany, { isLoading: deleting }] = useDeleteShipmentCompanyMutation();

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const saving = creating || updating;

  useEffect(() => {
    if (!openForm) setForm(emptyForm);
  }, [openForm]);

  const list = useMemo(() => Array.isArray(data) ? data : [], [data]);

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

  const startCreate = () => {
    setIsEdit(false);
    setForm(emptyForm);
    setOpenForm(true);
  };

  const startEdit = (c: ShipmentCompany) => {
    setIsEdit(true);
    setForm({
      _id: c._id,
      company: (c.company as any) || "",
      deliveryTime: c.deliveryTime || "2-3 أيام عمل",
      caver: (c as any).caver || "",
      deliveryAt: (c as any).deliveryAt || "",
      shipmentDelivertype: (c as any).shipmentDelivertype || "",
      minShipments: c.minShipments || 1,
      status: c.status || "Enabled",
      conditions: c.conditions || "",
      details: c.details || "",
      conditionsAr: c.conditionsAr || "",
      detailsAr: c.detailsAr || "",
      trackingURL: c.trackingURL || "",
      pickUpStatus: c.pickUpStatus || "Yes",
      shippingTypes: (c as any).shipmentType?.length ? (c as any).shipmentType as any : ((c as any).shippingTypes || []),
      allowedBoxSizes: c.allowedBoxSizes || [],
    });
    setOpenForm(true);
  };

  const handleSave = async () => {
    if (!form.company || !form.status || !form.pickUpStatus) return;
    if ((form.company === "omniclama" || form.company === "redbox") && form.allowedBoxSizes.length === 0) return;
    const payload: any = {
      company: form.company,
      deliveryTime: form.deliveryTime,
      caver: form.caver,
      deliveryAt: form.deliveryAt,
      shipmentDelivertype: form.shipmentDelivertype,
      minShipments: form.minShipments,
      status: form.status,
      conditions: form.conditions,
      details: form.details,
      conditionsAr: form.conditionsAr,
      detailsAr: form.detailsAr,
      trackingURL: form.trackingURL,
      pickUpStatus: form.pickUpStatus,
      shippingTypes: form.shippingTypes,
      allowedBoxSizes: form.allowedBoxSizes,
    };
    if (isEdit && form._id) {
      await updateCompany({ id: form._id, data: payload }).unwrap().catch(() => {});
    } else {
      await createCompany(payload).unwrap().catch(() => {});
    }
    setOpenForm(false);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteCompany(id).unwrap().catch(() => {});
    refetch();
  };

  const updateType = (idx: number, key: keyof ShippingTypeRow, value: any) => {
    setForm((prev) => {
      const arr = [...prev.shippingTypes];
      const row = { ...arr[idx], [key]: value } as ShippingTypeRow;
      arr[idx] = row;
      return { ...prev, shippingTypes: arr };
    });
  };

  const updateBox = (idx: number, key: keyof AllowedBoxSize, value: any) => {
    setForm((prev) => {
      const arr = [...prev.allowedBoxSizes];
      const row = { ...arr[idx], [key]: value } as AllowedBoxSize;
      arr[idx] = row;
      return { ...prev, allowedBoxSizes: arr };
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة شركات الشحن</h1>
        <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-4 h-4" /> إضافة شركة
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3">الشركة</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">الالتقاط</th>
                <th className="px-4 py-3">الحد الأدنى للشحنات</th>
                <th className="px-4 py-3">أنواع الشحن</th>
                <th className="px-4 py-3">صناديق</th>
                <th className="px-4 py-3">تحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={7}>جاري التحميل...</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={7}>لا توجد شركات</td></tr>
              ) : (
                list.map((c) => (
                  <tr key={c._id} className="text-sm">
                    <td className="px-4 py-3 font-semibold">{c.company}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3">{c.pickUpStatus}</td>
                    <td className="px-4 py-3">{c.minShipments}</td>
                    <td className="px-4 py-3">{((c as any).shipmentType || (c as any).shippingTypes || []).length}</td>
                    <td className="px-4 py-3">{(c.allowedBoxSizes || []).length}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Edit3 className="w-4 h-4" /> تعديل
                        </button>
                        <button onClick={() => handleDelete(c._id)} disabled={deleting} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl border shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">{isEdit ? "تعديل شركة" : "إضافة شركة"}</div>
              <button onClick={() => setOpenForm(false)} className="p-2 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">الشركة</label>
                <select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value as any })} className="w-full border rounded-lg px-3 py-2">
                  <option value="">اختر</option>
                  <option value="smsa">smsa</option>
                  <option value="redbox">redbox</option>
                  <option value="omniclama">omniclama</option>
                  <option value="aramex">aramex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">مدة التوصيل</label>
                <input value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">الحالة</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full border rounded-lg px-3 py-2">
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">الالتقاط</label>
                <select value={form.pickUpStatus} onChange={(e) => setForm({ ...form, pickUpStatus: e.target.value as any })} className="w-full border rounded-lg px-3 py-2">
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">الحد الأدنى للشحنات</label>
                <input type="number" value={form.minShipments} onChange={(e) => setForm({ ...form, minShipments: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">رابط التتبع</label>
                <input value={form.trackingURL} onChange={(e) => setForm({ ...form, trackingURL: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">الشروط</label>
                  <textarea value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} className="w-full border rounded-lg px-3 py-2 h-24" />
                </div>
                <div>
                  <label className="block text-sm mb-1">التفاصيل</label>
                  <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="w-full border rounded-lg px-3 py-2 h-24" />
                </div>
                <div>
                  <label className="block text-sm mb-1">الشروط (عربي)</label>
                  <textarea value={form.conditionsAr} onChange={(e) => setForm({ ...form, conditionsAr: e.target.value })} className="w-full border rounded-lg px-3 py-2 h-24" />
                </div>
                <div>
                  <label className="block text-sm mb-1">التفاصيل (عربي)</label>
                  <textarea value={form.detailsAr} onChange={(e) => setForm({ ...form, detailsAr: e.target.value })} className="w-full border rounded-lg px-3 py-2 h-24" />
                </div>
              </div>
            </div>

            <div className="px-4">
              <div className="text-base font-semibold mb-2">أنواع الشحن</div>
              <div className="space-y-3">
                {form.shippingTypes.map((t, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded-lg p-3">
                    <div>
                      <label className="block text-xs mb-1">النوع</label>
                      <select value={t.type} onChange={(e) => updateType(idx, "type", e.target.value)} className="w-full border rounded px-2 py-1">
                        <option value="Dry">Dry</option>
                        <option value="Cold">Cold</option>
                        <option value="Quick">Quick</option>
                        <option value="Box">Box</option>
                        <option value="offices">offices</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Code</label>
                      <input value={t.code} onChange={(e) => updateType(idx, "code", e.target.value)} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">RTO Code</label>
                      <input value={t.RTOcode} onChange={(e) => updateType(idx, "RTOcode", e.target.value)} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="text-xs">COD</label>
                      <input type="checkbox" checked={t.COD} onChange={(e) => updateType(idx, "COD", e.target.checked)} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Max COD</label>
                      <input type="number" value={t.maxCodAmount} onChange={(e) => updateType(idx, "maxCodAmount", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Max Weight</label>
                      <input type="number" value={t.maxWeight} onChange={(e) => updateType(idx, "maxWeight", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Denay Weight</label>
                      <input type="number" value={t.denayWeight ?? 0} onChange={(e) => updateType(idx, "denayWeight", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Max Boxes</label>
                      <input type="number" value={t.maxBoxes} onChange={(e) => updateType(idx, "maxBoxes", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">سعر أساسي</label>
                      <input type="number" step="0.01" value={t.basePrice} onChange={(e) => updateType(idx, "basePrice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">ربح</label>
                      <input type="number" step="0.01" value={t.profitPrice} onChange={(e) => updateType(idx, "profitPrice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">RTO أساس</label>
                      <input type="number" step="0.01" value={t.baseRTOprice} onChange={(e) => updateType(idx, "baseRTOprice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">RTO ربح</label>
                      <input type="number" step="0.01" value={t.profitRTOprice} onChange={(e) => updateType(idx, "profitRTOprice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">وزن إضافي أساس</label>
                      <input type="number" step="0.01" value={t.baseAdditionalweigth} onChange={(e) => updateType(idx, "baseAdditionalweigth", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">وزن إضافي ربح</label>
                      <input type="number" step="0.01" value={t.profitAdditionalweigth} onChange={(e) => updateType(idx, "profitAdditionalweigth", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">رسوم COD أساس</label>
                      <input type="number" step="0.01" value={t.baseCODfees} onChange={(e) => updateType(idx, "baseCODfees", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">رسوم COD ربح</label>
                      <input type="number" step="0.01" value={t.profitCODfees} onChange={(e) => updateType(idx, "profitCODfees", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">تأمين</label>
                      <input type="number" step="0.01" value={t.insurancecost} onChange={(e) => updateType(idx, "insurancecost", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">التقاط أساس</label>
                      <input type="number" step="0.01" value={t.basepickUpPrice} onChange={(e) => updateType(idx, "basepickUpPrice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">التقاط ربح</label>
                      <input type="number" step="0.01" value={t.profitpickUpPrice} onChange={(e) => updateType(idx, "profitpickUpPrice", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div className="md:col-span-6 flex justify-end">
                      <button onClick={() => setForm((prev) => ({ ...prev, shippingTypes: prev.shippingTypes.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" /> حذف
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setForm((prev) => ({ ...prev, shippingTypes: [...prev.shippingTypes, { ...emptyType }] }))} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Plus className="w-4 h-4" /> إضافة نوع
                </button>
              </div>
            </div>

            <div className="px-4 mt-6">
              <div className="text-base font-semibold mb-2">أحجام الصناديق</div>
              <div className="space-y-3">
                {form.allowedBoxSizes.map((b, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 border rounded-lg p-3">
                    <div>
                      <label className="block text-xs mb-1">الطول</label>
                      <input type="number" value={b.length} onChange={(e) => updateBox(idx, "length", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">العرض</label>
                      <input type="number" value={b.width} onChange={(e) => updateBox(idx, "width", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">الارتفاع</label>
                      <input type="number" value={b.height} onChange={(e) => updateBox(idx, "height", Number(e.target.value))} className="w-full border rounded px-2 py-1" />
                    </div>
                    <div className="col-span-3 flex justify-end">
                      <button onClick={() => setForm((prev) => ({ ...prev, allowedBoxSizes: prev.allowedBoxSizes.filter((_, i) => i !== idx) }))} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" /> حذف
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setForm((prev) => ({ ...prev, allowedBoxSizes: [...prev.allowedBoxSizes, { ...emptyBox }] }))} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Plus className="w-4 h-4" /> إضافة صندوق
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t mt-6">
              <button onClick={() => setOpenForm(false)} className="px-4 py-2 rounded-lg border">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                <Save className="w-4 h-4" /> حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
