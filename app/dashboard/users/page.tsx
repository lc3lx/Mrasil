"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { 
  useGetAllUsersQuery, 
  useUpdateUserStatusMutation, 
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useAddBalanceToUserMutation,
  useSubtractBalanceFromUserMutation 
} from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterToolbar from '@/components/ui/FilterToolbar';
import DataTable from '@/components/ui/DataTable';
import ModernPagination from '@/components/ui/ModernPagination';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { Users, Shield, User, UserCheck, Search, Filter, MoreVertical, Mail, Phone, Calendar, Ban, Check, Trash2, Wallet, Eye, ArrowLeft, TrendingUp, Plus, Edit, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UsersManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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

  // Fetch users data
  const { data: usersResponse, isLoading, error, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    search,
    status: statusFilter,
    role: roleFilter
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addBalance] = useAddBalanceToUserMutation();
  const [subtractBalance] = useSubtractBalanceFromUserMutation();
  const { showToast } = useToast();

  // Modal states
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showSubtractBalanceModal, setShowSubtractBalanceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [subtractAmount, setSubtractAmount] = useState('');
  const [subtractReason, setSubtractReason] = useState('');

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      refetch();
      showToast('success', 'تم تحديث حالة المستخدم');
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('error', 'فشل تحديث الحالة');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      refetch();
      showToast('success', 'تم تحديث دور المستخدم');
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('error', 'فشل تحديث الدور');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${userName}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        await deleteUser({ userId }).unwrap();
        refetch();
        showToast('success', 'تم حذف المستخدم بنجاح');
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('error', 'خطأ في حذف المستخدم');
      }
    }
  };

  const handleAddBalance = async () => {
    if (!balanceAmount || !selectedUserId) return;
    
    try {
      await addBalance({ 
        userId: selectedUserId, 
        amount: parseFloat(balanceAmount), 
        reason: balanceReason 
      }).unwrap();
      setShowAddBalanceModal(false);
      setBalanceAmount('');
      setBalanceReason('');
      setSelectedUserId('');
      refetch();
      showToast('success', 'تم إضافة الرصيد بنجاح');
    } catch (error) {
      console.error('Error adding balance:', error);
      showToast('error', 'خطأ في إضافة الرصيد');
    }
  };

  const handleSubtractBalance = async () => {
    if (!subtractAmount || !selectedUserId) return;
    try {
      await subtractBalance({
        userId: selectedUserId,
        amount: parseFloat(subtractAmount),
        reason: subtractReason,
      }).unwrap();
      setShowSubtractBalanceModal(false);
      setSubtractAmount('');
      setSubtractReason('');
      setSelectedUserId('');
      refetch();
      showToast('success', 'تم خصم الرصيد بنجاح');
    } catch (error) {
      console.error('Error subtracting balance:', error);
      showToast('error', 'خطأ في خصم الرصيد');
    }
  };

  if (!user || user.role !== 'admin') {
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
            className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800 rounded-2xl shadow-2xl"
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
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة المستخدمين</h1>
                  <p className="text-indigo-100 text-lg">إدارة ومتابعة جميع المستخدمين والصلاحيات</p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <Plus className="w-5 h-5" />
                    مستخدم جديد
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl ml-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-4 bg-red-50 border border-red-200 p-6 rounded-xl">
                <p className="text-red-600 text-center">خطأ في تحميل البيانات</p>
              </div>
            ) : (
              <>
                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.15), 0 8px 16px -8px rgba(99, 102, 241, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي المستخدمين</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{usersResponse?.pagination?.totalItems?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+16% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    boxShadow: '0 20px 40px -12px rgba(147, 51, 234, 0.15), 0 8px 16px -8px rgba(147, 51, 234, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">المديرون</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{usersResponse?.data?.filter((u: any) => u.role === 'admin')?.length?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-purple-500 ml-1" />
                        <span className="text-sm text-purple-600 font-medium">صلاحيات إدارية</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    boxShadow: '0 20px 40px -12px rgba(107, 114, 128, 0.15), 0 8px 16px -8px rgba(107, 114, 128, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">المستخدمون العاديون</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{usersResponse?.data?.filter((u: any) => u.role !== 'admin')?.length?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-500 ml-1" />
                        <span className="text-sm text-gray-600 font-medium">مستخدمون عاديون</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <User className="h-10 w-10 text-white" />
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
                      <p className="text-sm font-medium text-gray-600 mb-2">المستخدمون النشطون</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{usersResponse?.data?.filter((u: any) => u.active)?.length?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+9% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <UserCheck className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </>
            )}

      {/* Subtract Balance Modal */}
      {showSubtractBalanceModal && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <MinusCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">خصم رصيد من المستخدم</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ</label>
                <input
                  type="number"
                  placeholder="أدخل المبلغ بالريال"
                  value={subtractAmount}
                  onChange={(e) => setSubtractAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السبب (اختياري)</label>
                <input
                  type="text"
                  placeholder="سبب خصم الرصيد"
                  value={subtractReason}
                  onChange={(e) => setSubtractReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setShowSubtractBalanceModal(false); setSubtractAmount(''); setSubtractReason(''); setSelectedUserId(''); }}
                className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubtractBalance}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all font-medium shadow-lg"
              >
                خصم الرصيد
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
          </motion.div>

          {/* Users Table */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden"
            variants={itemVariants}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-indigo-50/30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">قائمة المستخدمين</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="بحث بالاسم أو الإيميل..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                  
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">كل الأدوار</option>
                    <option value="admin">مدير</option>
                    <option value="user">مستخدم</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm font-semibold text-gray-700">
                    <div>المستخدم</div>
                    <div className="hidden md:block">الدور</div>
                    <div className="hidden md:block">الحالة</div>
                    <div className="hidden md:block">تاريخ الانضمام</div>
                    <div className="hidden md:block">الرصيد</div>
                    <div className="hidden md:block">الإجراءات</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="px-6 py-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded mb-1"></div>
                              <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-gray-300 rounded w-16 hidden md:block"></div>
                          <div className="h-6 bg-gray-300 rounded w-20 hidden md:block"></div>
                          <div className="h-4 bg-gray-300 rounded w-24 hidden md:block"></div>
                          <div className="h-4 bg-gray-300 rounded w-20 hidden md:block"></div>
                          <div className="flex gap-2 hidden md:flex">
                            <div className="h-8 w-8 bg-gray-300 rounded"></div>
                            <div className="h-8 w-8 bg-gray-300 rounded"></div>
                            <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : usersResponse?.data?.length > 0 ? (
                    usersResponse.data.map((user: any, index: number) => (
                      <motion.div
                        key={user._id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          
                          <div className="hidden md:block">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="user">مستخدم</option>
                              <option value="admin">مدير</option>
                            </select>
                          </div>
                          
                          <div className="hidden md:block">
                            <button
                              onClick={() => handleStatusChange(user._id, user.active ? 'inactive' : 'active')}
                              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors duration-200 ${
                                user.active 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {user.active ? 'نشط' : 'غير نشط'}
                            </button>
                          </div>
                          
                          <div className="hidden md:block text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                          
                          <div className="hidden md:block text-gray-600 font-medium">
                            {user.balance?.toLocaleString() || '0'} ريال
                          </div>
                          
                          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
                            <Link
                              href={`/dashboard/users/${user._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedUserId(user._id);
                                setShowAddBalanceModal(true);
                              }}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <Wallet className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedUserId(user._id);
                                setShowSubtractBalanceModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستخدمون</h3>
                      <p className="text-gray-500 mb-6">لم يتم العثور على أي مستخدمين بالمعايير المحددة</p>
                    </div>
                  )}
                </div>
              </div>

              {usersResponse?.pagination && (
                <div className="flex justify-center mt-6">
                  <ModernPagination
                    currentPage={usersResponse.pagination.currentPage}
                    totalPages={usersResponse.pagination.totalPages}
                    totalItems={usersResponse.pagination.totalItems}
                    itemsPerPage={usersResponse.pagination.itemsPerPage}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">إضافة رصيد للمستخدم</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ</label>
                <input
                  type="number"
                  placeholder="أدخل المبلغ بالريال"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السبب (اختياري)</label>
                <input
                  type="text"
                  placeholder="سبب إضافة الرصيد"
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setShowAddBalanceModal(false); setBalanceAmount(''); setBalanceReason(''); setSelectedUserId(''); }}
                className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddBalance}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all font-medium shadow-lg"
              >
                إضافة الرصيد
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </DashboardLayout>
  );
}

