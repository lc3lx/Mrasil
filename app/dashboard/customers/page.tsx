"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useGetAdminStatsQuery } from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from 'next/link';
import { Users, UserCheck, UserX, MapPin } from 'lucide-react';

export default function CustomersManagement() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});

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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center">
                ← العودة للداشبورد
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded ml-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-4 bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-600">خطأ في تحميل البيانات</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.data?.customers?.total?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-500 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">العملاء النشطون</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.data?.customers?.active?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <UserX className="h-8 w-8 text-red-500 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">العملاء غير النشطون</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.data?.customers?.inactive?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-purple-500 ml-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">جدد هذا الشهر</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.data?.customers?.newThisMonth?.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Simple Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">العملاء الجدد</h3>
            <div className="text-center py-8">
              <p className="text-gray-500">لا توجد بيانات عملاء حالياً</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
