'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Compass } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:rotate-12 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-50 tracking-tight">Horizon</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full pl-1.5 pr-4 py-1.5 shadow-inner">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full border border-slate-700" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                    <User className="w-3 h-3 text-violet-400" />
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-300">{user.name}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors">
                Log in
              </Link>
              <Link 
                href="/register" 
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-violet-600/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
