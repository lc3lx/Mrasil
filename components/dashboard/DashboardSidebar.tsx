"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Truck, 
  CreditCard, 
  UserCog, 
  CheckCircle, 
  LogOut,
  X,
  Menu,
  UserCheck,
  Wallet,
  ShoppingCart
} from 'lucide-react';

const menuItems = [
  {
    title: 'الداشبورد الرئيسي',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'إدارة المستخدمين',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'إدارة العملاء',
    href: '/dashboard/customers',
    icon: UserCheck,
  },
  {
    title: 'إدارة المحافظ',
    href: '/dashboard/wallets',
    icon: CreditCard,
  },
  {
    title: 'إدارة الشحنات',
    href: '/dashboard/shipments',
    icon: Truck,
  },
  {
    title: 'إدارة الطلبات',
    href: '/dashboard/orders',
    icon: Package,
  },
];

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`
        bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-sm transition-all duration-300 z-50
        ${isCollapsed ? 'w-16' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative h-full
      `}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold">M</div>
            <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className="transition-transform group-hover:scale-105" />
              {!isCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">تسجيل خروج</span>}
        </button>
      </div>
    </div>
    </>
  );
}
