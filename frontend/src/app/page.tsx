'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '../store/useSimulationStore';
import { TimelineRenderer } from '../components/Timeline/TimelineRenderer';

export default function Home() {
  const router = useRouter();
  const { initialNetWorth, monthlySavings, setInitialNetWorth, setMonthlySavings } = useSimulationStore();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);
  
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* Scenario Panel (Sidebar) */}
      <aside className="w-full md:w-[320px] horizon-card p-6 flex-shrink-0 flex flex-col gap-6 z-10 relative shadow-2xl">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Horizon</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Life Milestone Simulator</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Initial Net Worth ($)</label>
            <input 
              type="number" 
              value={initialNetWorth} 
              onChange={(e) => setInitialNetWorth(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg p-2.5 text-slate-50 font-medium transition-all shadow-inner outline-none"
            />
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Monthly Savings ($)</label>
            <input 
              type="number" 
              value={monthlySavings} 
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg p-2.5 text-slate-50 font-medium transition-all shadow-inner outline-none"
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Drag to Simulate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag milestone nodes along the timeline to instantly shift their target age. The projection curve will adapt forward.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Timeline Workspace */}
      <section className="flex-1 horizon-card p-2 flex flex-col relative overflow-hidden bg-slate-900/50 shadow-inner">
        <div className="flex-1 rounded-xl relative overflow-hidden bg-slate-900/80 border border-slate-800">
          <TimelineRenderer />
        </div>
      </section>
    </main>
  );
}
