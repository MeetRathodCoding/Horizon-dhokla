'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
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
    <nav className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {user ? (
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
              <Image src="/logo.png" alt="Ascentia Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Ascentia</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0 cursor-default">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Image src="/logo.png" alt="Ascentia Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Ascentia</span>
          </div>
        )}

        {user && !isAuthPage && (
          <div className="hidden md:flex items-center gap-6 ml-8 flex-1">
            <Link href="/savings" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Savings</Link>
            <Link href="/house-payment" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">House</Link>
            <Link href="/loan" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Loan</Link>
            <Link href="/emi" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Quick EMI</Link>
            <Link href="/sip" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">SIP</Link>
            <Link href="/mutual-funds" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">Mutual Funds</Link>
          </div>
        )}

        <div className="flex items-center gap-6">
          {!isAuthPage && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-indigo-300 hover:bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-sm transition-all group">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-500/30">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{user.name}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
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
