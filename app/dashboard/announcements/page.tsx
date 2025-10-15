"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Eye, EyeOff, Megaphone, Settings, Palette } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  useGetAllAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useToggleAnnouncementStatusMutation,
  type Announcement,
  type CreateAnnouncementRequest
} from "@/app/api/announcementApi";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const { data: announcements = [], isLoading } = useGetAllAnnouncementsQuery();
  const [createAnnouncement, { isLoading: creating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: updating }] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: deleting }] = useDeleteAnnouncementMutation();
  const [toggleStatus] = useToggleAnnouncementStatusMutation();

  const [form, setForm] = useState<CreateAnnouncementRequest>({
    title: "",
    content: "",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    fontSize: "text-base",
    isActive: true,
    priority: 0,
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await updateAnnouncement({ ...form, _id: editingAnnouncement._id }).unwrap();
      } else {
        await createAnnouncement(form).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      backgroundColor: "#3B82F6",
      textColor: "#FFFFFF",
      fontSize: "text-base",
      isActive: true,
      priority: 0,
    });
    setEditingAnnouncement(null);
    setOpenForm(false);
  };

  const startEdit = (announcement: Announcement) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      backgroundColor: announcement.backgroundColor,
      textColor: announcement.textColor,
      fontSize: announcement.fontSize,
      isActive: announcement.isActive,
      priority: announcement.priority,
    });
    setEditingAnnouncement(announcement);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      try {
        await deleteAnnouncement(id).unwrap();
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id).unwrap();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
        <motion.div className="space-y-8 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <motion.div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 rounded-2xl shadow-2xl p-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">إدارة الإعلانات</h1>
                <p className="text-purple-100 text-lg">إنشاء وإدارة إعلانات الموقع</p>
              </div>
              <motion.button
                onClick={() => setOpenForm(true)}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Plus className="w-5 h-5" />
                إعلان جديد
              </motion.button>
            </div>
          </motion.div>

          {/* Announcements List */}
          <motion.div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">جاري التحميل...</div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">لا توجد إعلانات</div>
              ) : (
                announcements.map((announcement) => (
                  <motion.div
                    key={announcement._id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {announcement.isActive ? 'نشط' : 'معطل'}
                        </span>
                        <span className="text-sm text-gray-500">أولوية: {announcement.priority}</span>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div 
                      className={`p-4 rounded-lg mb-4 ${announcement.fontSize}`}
                      style={{ 
                        backgroundColor: announcement.backgroundColor,
                        color: announcement.textColor 
                      }}
                    >
                      <div className="font-bold mb-2">{announcement.title}</div>
                      <div>{announcement.content}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        بواسطة: {announcement.createdBy.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(announcement._id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          {announcement.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => startEdit(announcement)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Form Modal */}
        {openForm && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAnnouncement ? 'تعديل الإعلان' : 'إعلان جديد'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">لون الخلفية</label>
                    <input
                      type="color"
                      value={form.backgroundColor}
                      onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                      className="w-full h-12 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">لون النص</label>
                    <input
                      type="color"
                      value={form.textColor}
                      onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                      className="w-full h-12 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">حجم الخط</label>
                    <select
                      value={form.fontSize}
                      onChange={(e) => setForm({ ...form, fontSize: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="text-sm">صغير</option>
                      <option value="text-base">عادي</option>
                      <option value="text-lg">كبير</option>
                      <option value="text-xl">كبير جداً</option>
                      <option value="text-2xl">عملاق</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                    <input
                      type="number"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="mr-2 text-sm font-medium text-gray-700">
                    إعلان نشط
                  </label>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">معاينة</label>
                  <div
                    className={`p-4 rounded-lg ${form.fontSize}`}
                    style={{
                      backgroundColor: form.backgroundColor,
                      color: form.textColor
                    }}
                  >
                    <div className="font-bold mb-2">{form.title || 'عنوان الإعلان'}</div>
                    <div>{form.content || 'محتوى الإعلان'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={creating || updating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {creating || updating ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
