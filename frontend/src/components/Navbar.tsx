'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Activity } from 'lucide-react';
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

  const navLinks = [
    { href: '/savings', label: 'Savings' },
    { href: '/house', label: 'House' },
    { href: '/loan', label: 'Loan' },
    { href: '/emi', label: 'EMI' },
    { href: '/sip', label: 'SIP' },
    { href: '/mutual-funds', label: 'Mutual Funds' },
  ];

  return (
    <nav className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-[100] transition-all">
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-primary rounded-[14px] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <span className="text-white font-black text-2xl italic leading-none">A</span>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">ASCENTIA</span>
              <span className="text-[10px] font-black text-primary tracking-[0.2em] opacity-80">FINANCE</span>
            </div>
          </Link>

          {user && !isAuthPage && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-[18px] border border-slate-200/50">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative px-5 py-2 text-xs font-black tracking-wide rounded-[12px] transition-all duration-300 ${
                    pathname === link.href 
                      ? 'text-primary' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {pathname === link.href && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white shadow-sm rounded-[12px] -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {!isAuthPage && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-3 bg-white/50 border border-slate-200 hover:border-primary/30 hover:bg-white rounded-2xl pl-1.5 pr-5 py-1.5 shadow-sm transition-all group">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-xl border border-slate-200 object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center border border-primary/20">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Account</span>
                      <span className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{user.name}</span>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="horizon-btn-primary !py-2.5 !px-6 !text-xs !rounded-xl">
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
