"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import { Plus, X, Save, Edit3, Trash2, Percent, Wallet, Calendar, Users, Truck, TicketPercent } from "lucide-react";
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
          <motion.div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 rounded-3xl shadow-2xl border border-white/10" variants={itemVariants}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="relative p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <TicketPercent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">إدارة الكوبونات</h1>
                    <p className="text-pink-100 text-lg drop-shadow-sm">إنشاء وتخصيص الكوبونات للمستخدمين وشركات الشحن</p>
                  </div>
                </div>
                <motion.button 
                  onClick={startCreate} 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }} 
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center gap-3 border border-white/20 shadow-lg hover:shadow-xl group"
                >
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold text-lg">كوبون جديد</span>
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
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-6 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-bold text-gray-700 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <TicketPercent className="w-4 h-4 text-rose-500" />
                    الكود
                  </div>
                  <div>النوع</div>
                  <div>القيمة</div>
                  <div>الفترة</div>
                  <div>الحالة</div>
                  <div className="text-right">إجراءات</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {list.map((c, index) => (
                    <motion.div 
                      key={c._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="grid grid-cols-6 gap-4 p-6 items-center hover:bg-gray-50/50 transition-colors group"
                    >
                      <div className="font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg text-center group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
                        {c.code}
                      </div>
                      <div className="capitalize">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.discountType === "percentage" ? "bg-blue-100 text-blue-700" :
                          c.discountType === "fixed" ? "bg-green-100 text-green-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {c.discountType === "percentage" ? "نسبة" : c.discountType === "fixed" ? "قيمة ثابتة" : "رصيد محفظة"}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-700">
                        {c.discountType === "percentage" ? `${c.discountValue}%` : `${c.discountValue} ر.س`}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {c.startDate?.slice(0,10)} → {c.endDate?.slice(0,10)}
                      </div>
                      <div>
                        <span className={`px-3 py-1.5 text-xs rounded-full font-bold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {c.isActive ? 'مفعل' : 'معطل'}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <motion.button 
                          onClick={() => startEdit(c)} 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300 transition-all font-medium"
                        >
                          <Edit3 className="w-4 h-4" /> تعديل
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDelete(c._id)} 
                          disabled={deleting} 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> حذف
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Form Modal */}
        {openForm && (
          <motion.div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="bg-white w-full max-w-6xl rounded-3xl border border-gray-200 shadow-2xl max-h-[95vh] overflow-hidden" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", damping: 20 }}>
              {/* Header */}
              <div className="p-8 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg">
                    <TicketPercent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{editing ? 'تعديل كوبون' : 'إضافة كوبون جديد'}</h2>
                    <p className="text-gray-600 text-sm mt-1">قم بملء البيانات المطلوبة لإنشاء الكوبون</p>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setOpenForm(false)} 
                  whileHover={{ scale: 1.1, rotate: 90 }} 
                  whileTap={{ scale: 0.9 }} 
                  className="p-3 rounded-2xl hover:bg-gray-100 transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                </motion.button>
              </div>

              <div className="max-h-[calc(95vh-200px)] overflow-y-auto p-8 space-y-8">
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
              <div className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {editing ? 'تعديل كوبون موجود' : 'إضافة كوبون جديد للنظام'}
                </div>
                <div className="flex items-center gap-4">
                  <motion.button 
                    onClick={() => setOpenForm(false)} 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button 
                    onClick={handleSave} 
                    disabled={creating || updating} 
                    whileHover={{ scale: 1.02, y: -1 }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <Save className="w-5 h-5" />
                    {creating || updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الحفظ...
                      </>
                    ) : editing ? 'حفظ التعديلات' : 'إضافة الكوبون'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
