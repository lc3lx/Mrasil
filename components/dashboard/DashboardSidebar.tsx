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
  ShoppingCart,
  Shield,
  Sparkles,
  ChevronRight,
  Home,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  {
    title: 'الداشبورد الرئيسي',
    href: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    title: 'إدارة المستخدمين',
    href: '/dashboard/users',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
  },
  {
    title: 'إدارة العملاء',
    href: '/dashboard/customers',
    icon: UserCheck,
    gradient: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    title: 'إدارة المحافظ',
    href: '/dashboard/wallets',
    icon: Wallet,
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    title: 'إدارة الشحنات',
    href: '/dashboard/shipments',
    icon: Truck,
    gradient: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    title: 'إدارة الطلبات',
    href: '/dashboard/orders',
    icon: Package,
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    title: 'إدارة الإشعارات',
    href: '/dashboard/notifications',
    icon: Bell,
    gradient: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    title: 'إحصائيات شركات الشحن',
    href: '/dashboard/carriers',
    icon: Truck,
    gradient: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
];

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const sidebarVariants = {
    expanded: { width: 288 },
    collapsed: { width: 80 }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200"
      >
        <Menu size={24} className="text-gray-700" />
      </motion.button>

      {/* Sidebar */}
      <motion.div 
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className={`
          bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-xl transition-all duration-300 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative h-full overflow-hidden
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-200/60 flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
                  <p className="text-xs text-gray-500">نظام الإدارة</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <Menu size={20} className="text-gray-600" /> : <X size={20} className="text-gray-600" />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                      : `text-gray-700 hover:${item.bgColor} hover:${item.textColor} hover:scale-105 hover:shadow-md`
                  }`}
                >
                  <div className={`relative ${isActive ? 'text-white' : item.textColor}`}>
                    <Icon size={22} className="transition-all duration-300 group-hover:scale-110" />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -inset-1 bg-white/20 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex items-center justify-between flex-1"
                      >
                        <span className="font-semibold text-sm">{item.title}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!isCollapsed && (
                    <ChevronRight 
                      size={16} 
                      className={`transition-all duration-300 group-hover:translate-x-1 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`} 
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Info & Settings */}
        <div className="p-4 border-t border-gray-200/60">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">المدير</p>
                    <p className="text-xs text-gray-500">صلاحيات كاملة</p>
                  </div>
                  <div className="mr-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all w-full ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <Settings size={20} />
              {!isCollapsed && <span className="font-medium text-sm">الإعدادات</span>}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="font-medium text-sm">تسجيل خروج</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
