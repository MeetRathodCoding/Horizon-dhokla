'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Target, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Settings, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import ProfileAvatar from '@/components/Profile/ProfileAvatar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const { initialNetWorth, monthlySavings, milestones, setMonthlySavings } = useSimulationStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleSaveProfile = () => {
    if (user) {
      updateUser({ name: editedName });
      setIsEditingProfile(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const achievedGoals = milestones.filter(m => m.age <= 30).length;

  return (
    <div className="min-h-screen pb-24">
      {/* Background blobs for depth */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <header className="h-20 flex items-center bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto w-full px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-primary transition-all font-black text-xs uppercase tracking-widest group">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Simulation
          </Link>
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow" />
               Verified Account
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-16 space-y-12">
        {/* Profile Card Overlay */}
        <section className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="horizon-card p-12 bg-gradient-surface relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <ProfileAvatar />

              <div className="text-center md:text-left flex-1 space-y-6">
                <div>
                  {isEditingProfile ? (
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <input 
                        type="text" 
                        value={editedName} 
                        onChange={(e) => setEditedName(e.target.value)} 
                        className="text-4xl font-black text-slate-900 bg-transparent border-b-4 border-primary outline-none px-2 py-1 max-w-sm"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button onClick={handleSaveProfile} className="horizon-btn-primary !py-2 !px-6 !text-xs !rounded-full">Save</button>
                        <button onClick={() => setIsEditingProfile(false)} className="horizon-btn-secondary !py-2 !px-6 !text-xs !rounded-full">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
                  )}
                  <div className="flex items-center justify-center md:justify-start gap-2.5 mt-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{user.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="px-5 py-2 bg-primary/5 border border-primary/10 text-primary font-black text-xs uppercase tracking-[0.1em] rounded-full">
                    “Planning your future with clarity”
                  </div>
                  <div className="px-5 py-2 bg-amber-50 border border-amber-100 text-amber-600 font-black text-xs uppercase tracking-[0.1em] rounded-full flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    Pro Planner
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Growth Vector', value: `₹${monthlySavings.toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
            { label: 'Current Equity', value: `₹${initialNetWorth.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
            { label: 'Life Goals', value: milestones.length, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
            { label: 'Success Rate', value: '88%', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white p-7 rounded-4xl border ${stat.border} shadow-premium flex flex-col gap-6 group hover:border-primary/30 transition-all`}
            >
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Milestone Feed */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Timeline Events</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{milestones.length} ITEMS</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar pb-10">
              {milestones.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-primary/40 hover:shadow-premium transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-primary text-lg group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      {m.age}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{m.label}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.category}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-sm font-black text-emerald-600">₹{(m.cost / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 group-hover:bg-primary/5 p-3 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quick Controls */}
          <section className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight px-4">Workspace Settings</h2>
            <div className="horizon-card p-10 bg-gradient-surface space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Simulation Savings Rate (₹)</label>
                <div className="relative group">
                   <input 
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                    className="horizon-input !bg-white group-hover:shadow-glow transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-slate-900">Personal Preferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-700 group-hover:text-slate-900">Privacy & Security</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-full bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-black py-5 rounded-[28px] transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-lg shadow-red-500/5 hover:shadow-red-500/20 active:scale-[0.98]"
                >
                  <LogOut className="w-5 h-5" />
                  Terminate Session
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
