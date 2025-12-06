"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { useGetAdminStatsQuery, useGetRecentActivityQuery } from '../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  Truck, 
  Wallet, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Shield,
  Star,
  Zap,
  Eye,
  Settings,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
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
  
  // Fetch admin data
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetAdminStatsQuery({});
  const { data: activities, isLoading: activitiesLoading } = useGetRecentActivityQuery({ limit: 5 });

  useEffect(() => {
    // التحقق من تسجيل الدخول والصلاحية
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // التحقق من أن المستخدم أدمن
    if (user?.role !== 'admin') {
      router.push('/'); // توجيه للصفحة الرئيسية إذا لم يكن أدمن
      return;
    }
  }, [isAuthenticated, user, router]);

  // إذا لم يكن مسجل دخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">يرجى تسجيل الدخول</h1>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول للوصول للداشبورد</p>
          <Link href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  // إذا لم يكن أدمن
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
          <p className="text-gray-600 mb-6">هذه الصفحة مخصصة للمديرين فقط</p>
          <p className="text-sm text-gray-500 mb-4">الدور الحالي: {user.role || 'غير محدد'}</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">
            العودة للصفحة الرئيسية
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
          {/* Welcome Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl shadow-2xl"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative p-8">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2">مرحباً، {user?.firstName || 'المستخدم'}</h1>
                      <p className="text-blue-100 text-lg">لوحة التحكم الإدارية - إدارة شاملة للنظام</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-blue-100">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>متصل</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <Shield className="h-4 w-4 text-yellow-400" />
                      <span>مدير النظام</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <Star className="h-4 w-4 text-orange-400" />
                      <span>صلاحيات كاملة</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <Settings className="w-5 h-5" />
                    الإعدادات
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <BarChart3 className="w-5 h-5" />
                    التقارير
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
            {statsLoading ? (
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
            ) : statsError ? (
              <div className="col-span-4 bg-red-50 border border-red-200 p-6 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">خطأ في تحميل الإحصائيات</p>
                </div>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي المستخدمين</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.users?.total || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+12% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الشحنات</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.shipments?.total || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+8% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Truck className="h-10 w-10 text-white" />
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الطلبات</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.orders?.total || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600 font-medium">+15% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
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
                      <p className="text-sm font-medium text-gray-600 mb-2">رصيد المحافظ</p>
                      <p className="text-4xl font-bold text-gray-900 mb-3">{(stats?.data?.wallets?.totalBalance || 0).toLocaleString()}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-red-500 ml-1 rotate-180" />
                        <span className="text-sm text-red-600 font-medium">-5% من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Wallet className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">الأنشطة الأخيرة</h2>
                    </div>
                    <Link 
                      href="/dashboard/activity" 
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      عرض الكل
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl animate-pulse">
                          <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-32"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities?.data?.map((activity: any, index: number) => (
                        <motion.div 
                          key={activity.id} 
                          className="flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white transition-colors"
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{activity.message}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(activity.timestamp).toLocaleString('ar-SA')}</span>
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-600" />
                          </div>
                        </motion.div>
                      )) || (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أنشطة حالياً</h3>
                          <p className="text-gray-500">ستظهر الأنشطة الأخيرة هنا عند توفرها</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="lg:col-span-1"
              variants={itemVariants}
            >
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-indigo-50/30"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">إجراءات سريعة</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link href="/dashboard/users" className="group flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white border border-gray-100 hover:border-blue-200 transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">إدارة المستخدمين</p>
                          <p className="text-sm text-gray-500">إضافة وإدارة المستخدمين والأدوار</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link href="/dashboard/shipments" className="group flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white border border-gray-100 hover:border-emerald-200 transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">إدارة الشحنات</p>
                          <p className="text-sm text-gray-500">متابعة وإدارة الشحنات</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200" />
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link href="/dashboard/orders" className="group flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white border border-gray-100 hover:border-purple-200 transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">إدارة الطلبات</p>
                          <p className="text-sm text-gray-500">متابعة ومراجعة الطلبات</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-200" />
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link href="/dashboard/wallets" className="group flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white border border-gray-100 hover:border-amber-200 transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">إدارة المحافظ</p>
                          <p className="text-sm text-gray-500">إدارة المحافظ والمعاملات</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors duration-200" />
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link href="/dashboard/customers" className="group flex items-center gap-4 p-4 bg-white/70 rounded-xl hover:bg-white border border-gray-100 hover:border-cyan-200 transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">إدارة العملاء</p>
                          <p className="text-sm text-gray-500">متابعة وإدارة العملاء</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-600 transition-colors duration-200" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
