"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { 
  useGetAdminStatsQuery,
  useGetPendingBankTransfersQuery,
  useApproveBankTransferMutation
} from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { DollarSign, TrendingUp, TrendingDown, Users, Wallet, ArrowLeft, CreditCard, Plus, CheckCircle, XCircle, Clock, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletsManagement() {
  const { user } = useAuth();

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

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});
  const { data: pendingTransfers, isLoading: transfersLoading, refetch: refetchTransfers } = useGetPendingBankTransfersQuery({});
  const [approveBankTransfer] = useApproveBankTransferMutation();

  const { showToast } = useToast();

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
        <motion.div 
          className="space-y-8 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 rounded-2xl shadow-2xl"
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
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة المحافظ</h1>
                  <p className="text-amber-100 text-lg">إدارة المحافظ والمعاملات المالية</p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة رصيد
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
                    boxShadow: '0 20px 40px -12px rgba(34, 197, 94, 0.15), 0 8px 16px -8px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">الرصيد الإجمالي</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.wallets?.totalBalance || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+7% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Wallet className="h-10 w-10 text-white" />
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي المعاملات</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.wallets?.totalTransactions || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+23% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <TrendingUp className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    boxShadow: '0 20px 40px -12px rgba(249, 115, 22, 0.15), 0 8px 16px -8px rgba(249, 115, 22, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الإيداعات</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.wallets?.totalDeposits || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+11% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <DollarSign className="h-10 w-10 text-white" />
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">المحافظ النشطة</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.wallets?.activeWallets || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                        <span className="text-sm text-red-600 font-medium">-4% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-amber-50/30"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">المعاملات الأخيرة</h3>
              </div>
              
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد معاملات حالياً</h3>
                <p className="text-gray-500 mb-6">ستظهر المعاملات هنا عند توفرها</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-lg flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  إضافة معاملة جديدة
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Pending Bank Transfers */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg"
            variants={itemVariants}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-orange-50/30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">طلبات التحويل البنكي المعلقة</h3>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                    <div>العميل</div>
                    <div className="hidden md:block">المبلغ</div>
                    <div className="hidden md:block">التاريخ</div>
                    <div className="hidden md:block">الإجراءات</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {transfersLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="px-6 py-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded mb-1"></div>
                              <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                          </div>
                          <div className="h-4 bg-gray-300 rounded w-20 hidden md:block"></div>
                          <div className="h-4 bg-gray-300 rounded w-24 hidden md:block"></div>
                          <div className="flex gap-2 hidden md:flex">
                            <div className="h-8 w-16 bg-gray-300 rounded"></div>
                            <div className="h-8 w-16 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : pendingTransfers?.data?.length > 0 ? (
                    pendingTransfers.data.map((transfer: any, index: number) => (
                      <motion.div
                        key={transfer._id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {transfer.customerId?.firstName?.charAt(0)}{transfer.customerId?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {transfer.customerId?.firstName} {transfer.customerId?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {transfer.customerId?.email} · {transfer.customerId?.phone}
                              </div>
                            </div>
                          </div>
                          
                          <div className="hidden md:block text-gray-600 font-medium">
                            {transfer.amount?.toLocaleString() || 0} ريال
                          </div>
                          
                          <div className="hidden md:block text-gray-600">
                            {new Date(transfer.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                          
                          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                try {
                                  await approveBankTransfer({ transactionId: transfer._id, approved: true }).unwrap();
                                  refetchTransfers();
                                  showToast('success', 'تمت الموافقة');
                                } catch {
                                  showToast('error', 'فشل التنفيذ');
                                }
                              }}
                              className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors font-medium flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              موافقة
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                try {
                                  await approveBankTransfer({ transactionId: transfer._id, approved: false }).unwrap();
                                  refetchTransfers();
                                  showToast('success', 'تم الرفض');
                                } catch {
                                  showToast('error', 'فشل التنفيذ');
                                }
                              }}
                              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              رفض
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Clock className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات تحويل معلقة</h3>
                      <p className="text-gray-500">جميع طلبات التحويل تم معالجتها</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
