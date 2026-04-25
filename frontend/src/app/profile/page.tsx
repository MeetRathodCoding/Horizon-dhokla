'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  User, 
  Mail, 
  Target, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Settings, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { initialNetWorth, monthlySavings, milestones, setMonthlySavings } = useSimulationStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const achievedGoals = milestones.filter(m => m.age <= 30).length; // Mock logic for achieved

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Simulator
          </Link>
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10 space-y-8">
        {/* 1. TOP SECTION: User Identity Card */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center border-4 border-indigo-50 shadow-xl">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white w-7 h-7 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-slate-500">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <p className="mt-4 text-indigo-600 font-bold text-sm bg-indigo-50 inline-block px-4 py-1.5 rounded-full">
              “Planning your future with clarity”
            </p>
          </div>
        </section>

        {/* 2. QUICK STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Savings', value: `₹${monthlySavings.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Net Worth', value: `₹${initialNetWorth.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Milestones', value: milestones.length, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Achieved', value: achievedGoals, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* 3. MILESTONE SUMMARY (Left Column) */}
          <section className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800">Upcoming Milestones</h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{milestones.length} TOTAL</span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {milestones.length > 0 ? milestones.map((m, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-sm group-hover:bg-indigo-50 transition-colors">
                      {m.age}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.label}</h4>
                      <p className="text-xs font-bold text-indigo-500 mt-0.5">₹{(m.cost / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-tighter ${m.age < 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {m.age < 50 ? '🟢 On Track' : '🟡 At Risk'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-400 text-sm font-medium">No milestones added yet</p>
                </div>
              )}
            </div>
          </section>

          {/* 4. SETTINGS SECTION (Right Column) */}
          <section className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 px-2">Quick Settings</h2>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Savings Rate (₹)</label>
                <input 
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Security</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout from Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
