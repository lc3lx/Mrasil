"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useGetAdminStatsQuery } from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from 'next/link';
import { Users, UserCheck, UserX, MapPin, TrendingUp, Calendar, Search, Filter, Plus, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomersManagement() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div 
          className="space-y-8 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* Header */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl"
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
                <h1 className="text-4xl font-bold text-white mb-2">إدارة العملاء</h1>
                <p className="text-blue-100 text-lg">إدارة وتتبع جميع عملاء المنصة</p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                  <Plus className="w-5 h-5" />
                  إضافة عميل جديد
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
                  boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.15), 0 8px 16px -8px rgba(59, 130, 246, 0.1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">إجمالي العملاء</p>
                    <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.customers?.total?.toLocaleString() || '0'}</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                      <span className="text-sm text-green-600 font-medium">+12% من الشهر الماضي</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Users className="h-10 w-10 text-white" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">العملاء النشطون</p>
                    <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.customers?.active?.toLocaleString() || '0'}</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                      <span className="text-sm text-green-600 font-medium">+8% من الشهر الماضي</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <UserCheck className="h-10 w-10 text-white" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">العملاء غير النشطون</p>
                    <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.customers?.inactive?.toLocaleString() || '0'}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 font-medium">بحاجة لمتابعة</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <UserX className="h-10 w-10 text-white" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">جدد هذا الشهر</p>
                    <p className="text-4xl font-bold text-gray-900 mb-3">{stats?.data?.customers?.newThisMonth?.toLocaleString() || '0'}</p>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-purple-500 ml-1" />
                      <span className="text-sm text-purple-600 font-medium">هذا الشهر</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 overflow-hidden"
          variants={itemVariants}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="relative">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">قائمة العملاء</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">جميع العملاء</option>
                <option value="active">النشطون</option>
                <option value="inactive">غير النشطون</option>
              </select>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-semibold text-gray-700">
                <div>العميل</div>
                <div className="hidden md:block">البريد الإلكتروني</div>
                <div className="hidden md:block">رقم الهاتف</div>
                <div className="hidden md:block">الحالة</div>
                <div className="hidden md:block">الإجراءات</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Sample Customer Rows */}
              {[1, 2, 3].map((customer) => (
                <motion.div
                  key={customer}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        ع{customer}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">عميل تجريبي {customer}</div>
                        <div className="text-sm text-gray-500">منذ {customer} أشهر</div>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-gray-600">
                      customer{customer}@example.com
                    </div>
                    
                    <div className="hidden md:block text-gray-600">
                      +966 5{customer}0 123 456
                    </div>
                    
                    <div className="hidden md:block">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        customer % 2 === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer % 2 === 0 ? 'نشط' : 'غير نشط'}
                      </span>
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
              ))}
            </div>
            
            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات عملاء</h3>
              <p className="text-gray-500 mb-6">ابدأ بإضافة عملاء جدد لإدارة قاعدة بياناتك</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                إضافة عميل جديد
              </motion.button>
            </div>
          </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </DashboardLayout>
  );
}
