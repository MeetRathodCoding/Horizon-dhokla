'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Compass } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Horizon</span>
        </Link>

        <div className="flex items-center gap-6">
          {!isAuthPage && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-sm transition-all group">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-500/30">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{user.name}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                    Log in
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
