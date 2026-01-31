'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseJwt } from '../../lib/jwt';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // تحقق من صلاحية التوكن تلقائياً
  useEffect(() => {
    if (!token) return;
    const payload = parseJwt(token);
    if (payload && payload.exp) {
      const expiry = payload.exp * 1000;
      const now = Date.now();
      if (expiry < now) {
        logout();
      } else {
        const timeout = setTimeout(() => {
          logout();
        }, expiry - now);
        return () => clearTimeout(timeout);
      }
    }
  }, [token]);

  const login = (newToken: string, userData: any) => {
    console.log('AuthProvider - Login called with userData:', userData);
    console.log('AuthProvider - User role:', userData.role);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userData', JSON.stringify(userData)); // للـ AI أيضاً
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    // توجيه جميع المستخدمين للوحة التحكم
    router.push('/home');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData'); // للـ AI أيضاً
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 