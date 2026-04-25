'use client';

import { useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { TimelineRenderer } from '../components/Timeline/TimelineRenderer';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Target, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    initialNetWorth, 
    monthlySavings, 
    setInitialNetWorth, 
    setMonthlySavings,
    results,
    milestones
  } = useSimulationStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const currentNW = results[results.length - 1]?.netWorth || 0;
  const achievedGoals = milestones.filter(m => m.age <= 30).length;
  
  return (
    <main className="min-h-[calc(100vh-80px)] p-6 md:p-12 flex flex-col gap-10">
      {/* Top Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Projected Wealth', value: `₹${(currentNW / 10000000).toFixed(2)}Cr`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
          { label: 'Monthly Savings', value: `₹${monthlySavings.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
          { label: 'Total Milestones', value: milestones.length, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50/50' },
          { label: 'Financial Health', value: 'Excellent', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50/50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="horizon-card p-6 flex items-center gap-5 group"
          >
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className="text-xl font-black text-black tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Scenario Panel (Sidebar) */}
        <aside className="w-full xl:w-[400px] flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="horizon-card overflow-hidden bg-white"
          >
            <div className="bg-slate-900 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white tracking-tighter leading-none">Scenario</h2>
                <p className="text-xs text-indigo-200 font-black uppercase tracking-[0.2em] mt-2">Simulator Engine</p>
              </div>
            </div>
            
            <div className="p-10 space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Net Worth (₹)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={initialNetWorth === 0 ? '' : initialNetWorth} 
                    onChange={(e) => setInitialNetWorth(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="horizon-input !py-5 text-2xl !bg-white group-hover:shadow-glow transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Savings (₹)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={monthlySavings === 0 ? '' : monthlySavings} 
                    onChange={(e) => setMonthlySavings(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="horizon-input !py-5 text-2xl !bg-white group-hover:shadow-glow transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Financial Toolbox</h3>
               <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'SIP', href: '/sip', color: 'bg-indigo-500' },
                   { label: 'EMI', href: '/emi', color: 'bg-blue-500' },
                   { label: 'House', href: '/house', color: 'bg-amber-500' },
                   { label: 'Mutual', href: '/mutual-funds', color: 'bg-violet-500' },
                 ].map((tool) => (
                   <Link key={tool.label} href={tool.href} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-premium transition-all group">
                     <div className={`w-2 h-2 rounded-full ${tool.color} group-hover:scale-125 transition-transform`} />
                     <span className="text-xs font-black text-slate-600 group-hover:text-slate-900">{tool.label}</span>
                   </Link>
                 ))}
               </div>
            </div>
            
            <div className="p-8 bg-slate-900 rounded-[32px] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-glow"></div>
                AI Intelligence
              </h3>
              <p className="text-sm text-white leading-relaxed font-bold">
                {currentNW > 100000000 
                  ? "You are on track to become a deca-millionaire. Consider diversifying into high-yield assets."
                  : currentNW > 0 
                    ? `Your current trajectory leads to financial independence by age ${Math.min(60, 30 + Math.round(10000000 / (monthlySavings * 12)))}.`
                    : "Action required: Your current expenses exceed your savings profile. Adjust parameters to stabilize."}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                 <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Confidence Score</span>
                 <span className="text-xs font-black text-emerald-400">94%</span>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Timeline Section */}
        <section className="flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full min-h-[600px]"
          >
            <TimelineRenderer />
          </motion.div>
        </section>
      </div>
    </main>
  );
}
