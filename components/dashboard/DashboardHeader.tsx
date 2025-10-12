"use client";

import { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';

export default function DashboardHeader() {
  const { user } = useAuth();
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ابحث في الشحنات، الطلبات، المستخدمين..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setOpenNotif(!openNotif); setOpenProfile(false); }}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            {openNotif && (
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">إشعارات</div>
                <ul className="max-h-64 overflow-auto text-sm">
                  <li className="px-3 py-2 hover:bg-gray-50">تم إنشاء شحنة جديدة</li>
                  <li className="px-3 py-2 hover:bg-gray-50">طلب جديد قيد المراجعة</li>
                  <li className="px-3 py-2 hover:bg-gray-50">إضافة رصيد لمحفظة عميل</li>
                </ul>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => { setOpenProfile(!openProfile); setOpenNotif(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {openProfile && (
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden text-sm">
                <button className="w-full text-right px-3 py-2 hover:bg-gray-50">الملف الشخصي</button>
                <button className="w-full text-right px-3 py-2 hover:bg-gray-50">الإعدادات</button>
                <button className="w-full text-right px-3 py-2 text-red-600 hover:bg-red-50">تسجيل الخروج</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
