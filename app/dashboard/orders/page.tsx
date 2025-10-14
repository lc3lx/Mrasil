"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { useGetAdminStatsQuery, useGetAllOrdersQuery } from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterToolbar from '@/components/ui/FilterToolbar';
import DataTable from '@/components/ui/DataTable';
import ModernPagination from '@/components/ui/ModernPagination';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, Search, ArrowLeft, TrendingUp, Calendar, Eye, Edit, Trash2, Filter, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersManagement() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = (searchParams.get('userId') || '').trim();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

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
  const { data: ordersResponse, isLoading: listLoading, error: listError } = useGetAllOrdersQuery({
    page,
    limit: 10,
    status: statusFilter,
    search,
    userId,
  });


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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
        <motion.div 
          className="space-y-8 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl shadow-2xl"
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
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة الطلبات</h1>
                  <p className="text-purple-100 text-lg">إدارة ومتابعة جميع طلبات العملاء</p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <Plus className="w-5 h-5" />
                    طلب جديد
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
                    boxShadow: '0 20px 40px -12px rgba(139, 92, 246, 0.15), 0 8px 16px -8px rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الطلبات</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.orders?.total?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+14% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">قيد المراجعة</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.orders?.pending?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-amber-500 ml-1" />
                        <span className="text-sm text-amber-600 font-medium">يحتاج مراجعة</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Clock className="h-10 w-10 text-white" />
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
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">موافق عليها</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.orders?.approved?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+22% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    boxShadow: '0 20px 40px -12px rgba(239, 68, 68, 0.15), 0 8px 16px -8px rgba(239, 68, 68, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">مرفوضة</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.orders?.rejected?.toLocaleString() || '0'}</p>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 font-medium">تحتاج مراجعة</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <XCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Orders Table */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden"
            variants={itemVariants}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-purple-50/30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full translate-y-16 -translate-x-16"></div>
            
            <div className="relative space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">قائمة الطلبات</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="بحث برقم الطلب..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">كل الحالات</option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="approved">موافق عليها</option>
                    <option value="rejected">مرفوضة</option>
                    <option value="completed">مكتملة</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-semibold text-gray-700">
                    <div>رقم الطلب</div>
                    <div className="hidden md:block">العميل</div>
                    <div className="hidden md:block">الحالة</div>
                    <div className="hidden md:block">التاريخ</div>
                    <div className="hidden md:block">الإجراءات</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {listLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="px-6 py-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-4 bg-gray-300 rounded w-32 hidden md:block"></div>
                          <div className="h-6 bg-gray-300 rounded w-20 hidden md:block"></div>
                          <div className="h-4 bg-gray-300 rounded w-28 hidden md:block"></div>
                          <div className="flex gap-2 hidden md:flex">
                            <div className="h-8 w-8 bg-gray-300 rounded"></div>
                            <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : ordersResponse?.data?.length > 0 ? (
                    ordersResponse.data.map((order: any, index: number) => (
                      <motion.div
                        key={order._id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{order.orderNumber || order._id?.slice(-6) || '-'}</div>
                              <div className="text-sm text-gray-500">طلب #{index + 1}</div>
                            </div>
                          </div>
                          
                          <div className="hidden md:block text-gray-600">
                            {`${order.customerId?.firstName || ''} ${order.customerId?.lastName || ''}`.trim() || 'غير محدد'}
                          </div>
                          
                          <div className="hidden md:block">
                            <StatusBadge status={order.status} type="order" />
                          </div>
                          
                          <div className="hidden md:block text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                          </div>
                          
                          <div className="hidden md:flex items-center space-x-2 space-x-reverse">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
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
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                      <p className="text-gray-500 mb-6">لم يتم العثور على أي طلبات بالمعايير المحددة</p>
                    </div>
                  )}
                </div>
              </div>

              {ordersResponse?.pagination && (
                <div className="flex justify-center mt-6">
                  <ModernPagination
                    currentPage={ordersResponse.pagination.currentPage}
                    totalPages={ordersResponse.pagination.totalPages}
                    totalItems={ordersResponse.pagination.totalItems}
                    itemsPerPage={ordersResponse.pagination.itemsPerPage}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
