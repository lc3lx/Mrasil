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
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  
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
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-3">مرحباً، {user?.firstName || 'المستخدم'}</h1>
                <p className="text-blue-100 text-lg">لوحة التحكم الإدارية - إدارة شاملة للنظام</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>متصل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>مدير النظام</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <StatsCard
                  key={index}
                  title=""
                  value=""
                  icon={Users}
                  loading={true}
                />
              ))
            ) : statsError ? (
              <div className="col-span-4 bg-red-50/80 backdrop-blur-sm border border-red-200 p-6 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 font-medium">خطأ في تحميل الإحصائيات</p>
                </div>
              </div>
            ) : (
              <>
                <StatsCard
                  title="إجمالي المستخدمين"
                  value={stats?.data?.users?.total || 0}
                  icon={Users}
                  gradientFrom="from-blue-500"
                  gradientTo="to-indigo-600"
                  trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                  title="إجمالي الشحنات"
                  value={stats?.data?.shipments?.total || 0}
                  icon={Truck}
                  gradientFrom="from-emerald-500"
                  gradientTo="to-teal-600"
                  trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                  title="إجمالي الطلبات"
                  value={stats?.data?.orders?.total || 0}
                  icon={Package}
                  gradientFrom="from-purple-500"
                  gradientTo="to-pink-600"
                  trend={{ value: 15, isPositive: true }}
                />
                <StatsCard
                  title="رصيد المحافظ"
                  value={`${(stats?.data?.wallets?.totalBalance || 0).toLocaleString()} ريال`}
                  icon={Wallet}
                  gradientFrom="from-amber-500"
                  gradientTo="to-orange-600"
                  trend={{ value: 5, isPositive: false }}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">الأنشطة الأخيرة</h2>
                <Link href="/dashboard/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  عرض الكل
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            {activitiesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.data?.map((activity: any) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-gray-100/30 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(activity.timestamp).toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">لا توجد أنشطة حالياً</p>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
              <div className="space-y-3">
              <Link href="/dashboard/users" className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:border-blue-200 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">إدارة المستخدمين</p>
                    <p className="text-xs text-gray-500">إضافة وإدارة المستخدمين والأدوار</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
              </Link>

              <Link href="/dashboard/shipments" className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100/50 hover:border-emerald-200 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">إدارة الشحنات</p>
                    <p className="text-xs text-gray-500">متابعة وإدارة الشحنات</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200" />
                </div>
              </Link>

              <Link href="/dashboard/orders" className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:border-purple-200 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">إدارة الطلبات</p>
                    <p className="text-xs text-gray-500">متابعة ومراجعة الطلبات</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-200" />
                </div>
              </Link>

              <Link href="/dashboard/wallets" className="group flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100/50 hover:border-amber-200 transition-all duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="mr-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">إدارة المحافظ</p>
                    <p className="text-xs text-gray-500">إدارة المحافظ والمعاملات</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors duration-200" />
                </div>
              </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
    </DashboardLayout>
  );
}
