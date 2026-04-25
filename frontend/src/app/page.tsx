'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '../store/useSimulationStore';
import { useAuthStore } from '../store/useAuthStore';
import { TimelineRenderer } from '../components/Timeline/TimelineRenderer';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { initialNetWorth, monthlySavings, setInitialNetWorth, setMonthlySavings } = useSimulationStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6 bg-slate-50">
      {/* Scenario Panel (Sidebar) */}
      <aside className="w-full md:w-[320px] horizon-card p-6 flex-shrink-0 flex flex-col gap-6 z-10 relative bg-white shadow-sm border-slate-200">
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tighter">Horizon</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">Wealth Simulator</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Net Worth (₹)</label>
            <input 
              type="number" 
              value={initialNetWorth === 0 ? '' : initialNetWorth} 
              onChange={(e) => setInitialNetWorth(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl p-3 text-slate-900 font-bold transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Monthly Savings (₹)</label>
            <input 
              type="number" 
              value={monthlySavings === 0 ? '' : monthlySavings} 
              onChange={(e) => setMonthlySavings(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl p-3 text-slate-900 font-bold transition-all outline-none"
            />
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <h3 className="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              Simulation Guide
            </h3>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              Drag the milestone cards on the graph to shift life events. Watch the projection curve adapt to your ₹ savings.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Timeline Workspace */}
      <section className="flex-1 horizon-card p-2 flex flex-col relative overflow-hidden bg-white border-slate-200 shadow-sm">
        <div className="flex-1 rounded-xl relative overflow-hidden bg-slate-50 border border-slate-100">
          <TimelineRenderer />
        </div>
      </section>
    </main>
  );
}
