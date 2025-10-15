"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import { Plus, X, Save, Edit3, Trash2, Percent, Wallet, Calendar, Users, Truck } from "lucide-react";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  type Coupon,
  type CouponCreateRequest,
  type DiscountType,
} from "@/app/api/couponApi";
import { useGetAllShipmentCompaniesQuery } from "@/app/api/shipmentCompanyApi";
import { useGetAllUsersQuery } from "@/app/api/adminApi";

export default function CouponsPage() {
  const { user } = useAuth();

  const { data: coupons = [], isLoading } = useGetCouponsQuery();
  const list: Coupon[] = Array.isArray(coupons) ? coupons : ((coupons as any)?.data ?? []);
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const { data: companiesData = [] } = useGetAllShipmentCompaniesQuery();
  const companies = useMemo(() => Array.isArray(companiesData) ? companiesData : [], [companiesData]);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const [form, setForm] = useState<CouponCreateRequest>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10),
    isActive: true,
    applicableUsers: [],
    applicableShippingCompanies: [],
    usageLimit: 0,
    perUserLimit: 0,
  });
  // Email search for users
  const [userQuery, setUserQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Record<string, string>>({});
  const { data: usersResp, isLoading: loadingUsers } = useGetAllUsersQuery(
    userQuery && userQuery.length >= 2 ? { page: 1, limit: 5, search: userQuery, status: '', role: '' } as any : ({} as any),
    { skip: !userQuery || userQuery.length < 2 }
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const addUserBySearch = (u: any) => {
    setForm((prev) => {
      const set = new Set(prev.applicableUsers || []);
      set.add(String(u.id || u._id));
      return { ...prev, applicableUsers: Array.from(set) };
    });
    setSelectedLabels((prev) => ({ ...prev, [String(u.id || u._id)]: u.email || `${u.firstName || ''} ${u.lastName || ''}`.trim() }));
    setUserQuery("");
  };

  const removeUserId = (id: string) => {
    setForm((prev) => ({ ...prev, applicableUsers: (prev.applicableUsers || []).filter((x) => x !== id) }));
    setSelectedLabels((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
          <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">العودة للداشبورد</Link>
        </div>
      </div>
    );
  }

  const startCreate = () => {
    setEditing(null);
    setUserQuery("");
    setSelectedLabels({});
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10),
      isActive: true,
      applicableUsers: [],
      applicableShippingCompanies: [],
      usageLimit: 0,
      perUserLimit: 0,
    });
    setOpenForm(true);
  };

  const startEdit = (c: Coupon) => {
    setEditing(c);
    setUserQuery("");
    setSelectedLabels({});
    setForm({
      code: c.code,
      description: c.description,
      discountType: c.discountType as DiscountType,
      discountValue: c.discountValue,
      startDate: c.startDate?.slice(0, 10),
      endDate: c.endDate?.slice(0, 10),
      isActive: c.isActive,
      applicableUsers: c.applicableUsers || [],
      applicableShippingCompanies: c.applicableShippingCompanies || [],
      usageLimit: c.usageLimit ?? 0,
      perUserLimit: c.perUserLimit ?? 0,
    });
    setOpenForm(true);
  };

  const handleToggleCompany = (id: string) => {
    setForm((prev) => {
      const set = new Set(prev.applicableShippingCompanies || []);
      if (set.has(id)) set.delete(id); else set.add(id);
      return { ...prev, applicableShippingCompanies: Array.from(set) };
    });
  };

  const handleSave = async () => {
    const payload: CouponCreateRequest = { ...form };

    if (editing) {
      await updateCoupon({ _id: editing._id, ...payload }).unwrap().catch(() => {});
    } else {
      await createCoupon(payload).unwrap().catch(() => {});
    }
    setOpenForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الكوبون؟")) return;
    await deleteCoupon(id).unwrap().catch(() => {});
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
        <motion.div className="space-y-8 p-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-700 to-fuchsia-800 rounded-2xl shadow-2xl" variants={itemVariants}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة الكوبونات</h1>
                  <p className="text-pink-100">إنشاء وتخصيص الكوبونات للمستخدمين وشركات الشحن</p>
                </div>
                <motion.button onClick={startCreate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20">
                  <Plus className="w-5 h-5" />
                  كوبون جديد
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <motion.div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden" variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">الكوبونات</h3>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : list.length === 0 ? (
              <div className="p-6 text-center text-gray-500">لا توجد كوبونات</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 text-sm font-semibold text-gray-700">
                  <div>الكود</div>
                  <div>النوع</div>
                  <div>القيمة</div>
                  <div>الفترة</div>
                  <div>الحالة</div>
                  <div className="text-right">إجراءات</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {list.map((c) => (
                    <div key={c._id} className="grid grid-cols-6 gap-4 p-4 items-center">
                      <div className="font-mono font-semibold">{c.code}</div>
                      <div className="capitalize">
                        {c.discountType === "percentage" ? "نسبة" : c.discountType === "fixed" ? "قيمة ثابتة" : "رصيد محفظة"}
                      </div>
                      <div>
                        {c.discountType === "percentage" ? `${c.discountValue}%` : `${c.discountValue} ر.س`}
                      </div>
                      <div className="text-sm text-gray-600">{c.startDate?.slice(0,10)} → {c.endDate?.slice(0,10)}</div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {c.isActive ? 'مفعل' : 'معطل'}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-sky-600 border-sky-200 hover:bg-sky-50">
                          <Edit3 className="w-4 h-4" /> تعديل
                        </button>
                        <button onClick={() => handleDelete(c._id)} disabled={deleting} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50">
                          <Trash2 className="w-4 h-4" /> حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Form Modal */}
        {openForm && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="bg-white w-full max-w-5xl rounded-2xl border shadow-xl max-h-[95vh] overflow-hidden" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-rose-600" />
                  <h2 className="text-xl font-bold">{editing ? 'تعديل كوبون' : 'إضافة كوبون جديد'}</h2>
                </div>
                <button onClick={() => setOpenForm(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>

              <div className="max-h-[calc(95vh-140px)] overflow-y-auto p-6 space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الكود</label>
                    <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full border rounded-xl px-3 py-2" placeholder="SALE2025" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                    <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as DiscountType })} className="w-full border rounded-xl px-3 py-2">
                      <option value="percentage">نسبة مئوية</option>
                      <option value="fixed">قيمة ثابتة</option>
                      <option value="wallet_credit">رصيد محفظة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">القيمة</label>
                    <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" />تاريخ البداية</label>
                    <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" />تاريخ النهاية</label>
                    <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <select value={form.isActive ? '1' : '0'} onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })} className="w-full border rounded-xl px-3 py-2">
                      <option value="1">مفعل</option>
                      <option value="0">معطل</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">حد الاستخدام الكلي</label>
                    <input type="number" value={form.usageLimit ?? 0} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">حد المستخدم الواحد</label>
                    <input type="number" value={form.perUserLimit ?? 0} onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })} className="w-full border rounded-xl px-3 py-2" />
                  </div>
                </div>

                {/* Users selection by email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> المستخدمون (بحث بالبريد - اختياري)</label>
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2"
                    placeholder="ابحث بالبريد الإلكتروني (اكتب 2 أحرف على الأقل)"
                  />
                  {userQuery.length >= 2 && (
                    <div className="mt-2 border rounded-xl bg-white divide-y">
                      {loadingUsers && (
                        <div className="p-2 text-sm text-gray-500">جاري البحث...</div>
                      )}
                      {!loadingUsers && Array.isArray((usersResp as any)?.data) && (usersResp as any).data.length === 0 && (
                        <div className="p-2 text-sm text-gray-500">لا نتائج</div>
                      )}
                      {!loadingUsers && Array.isArray((usersResp as any)?.data) && (usersResp as any).data.slice(0,5).map((u: any) => (
                        <button key={u._id}
                          type="button"
                          onClick={() => addUserBySearch({ id: u._id, email: u.email, firstName: u.firstName, lastName: u.lastName })}
                          className="w-full text-right p-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-sm">{u.email}</span>
                          <span className="text-xs text-gray-500">{u.firstName} {u.lastName}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {(form.applicableUsers || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(form.applicableUsers || []).map((id) => (
                        <span key={id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                          {selectedLabels[id] || id}
                          <button type="button" onClick={() => removeUserId(id)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">اتركه فارغاً ليكون متاحاً لجميع المستخدمين.</p>
                </div>

                {/* Shipping companies selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Truck className="w-4 h-4" /> شركات الشحن (اختياري)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {companies.map((co: any) => (
                      <label key={co._id} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
                        <input type="checkbox" checked={form.applicableShippingCompanies?.includes(co._id)} onChange={() => handleToggleCompany(co._id)} />
                        <span className="text-sm">{co.company}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">اتركها فارغة لتكون متاحة لجميع شركات الشحن.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-4 p-6 bg-gray-50 border-t">
                <button onClick={() => setOpenForm(false)} className="px-6 py-3 rounded-xl border">إلغاء</button>
                <button onClick={handleSave} disabled={creating || updating} className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 transition-all font-medium shadow-lg disabled:opacity-50 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {creating || updating ? 'جاري الحفظ...' : editing ? 'حفظ التعديلات' : 'إضافة الكوبون'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
