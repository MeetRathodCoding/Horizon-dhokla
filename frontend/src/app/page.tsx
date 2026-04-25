'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '../store/useSimulationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { TimelineRenderer } from '../components/Timeline/TimelineRenderer';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { initialNetWorth, monthlySavings, setInitialNetWorth, setMonthlySavings } = useSimulationStore();
  const { savings, sip, mutualFund, emi, house, loan } = useCalculatorStore();

  const totalInvestments = sip.monthlyInvestment + mutualFund.sipAmount + mutualFund.lumpSum;
  
  const calcEMI = (p: number, r: number, n: number) => {
    if (p <= 0 || n <= 0) return 0;
    if (r === 0) return p / n;
    const rate = r / 12 / 100;
    return (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  };

  const quickEmiVal = calcEMI(emi.amount, emi.rate, emi.months);
  const houseEmiVal = calcEMI(house.propertyPrice - house.downPayment, house.loanRate, house.tenureYears * 12);
  const loanEmiVal = calcEMI(loan.loanAmount, loan.loanRate, loan.tenureYears * 12);

  const pendingEmi = Math.round(quickEmiVal + houseEmiVal + loanEmiVal);


  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6 bg-gray-50">
      {/* Scenario Panel (Sidebar) */}
      <aside className="w-full md:w-[320px] ascentia-card p-6 flex-shrink-0 flex flex-col gap-6 z-10 relative bg-white shadow-sm border-gray-200">
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tighter">Ascentia</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Wealth Simulator</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Initial Net Worth (₹)</label>
            <input 
              type="number" 
              value={initialNetWorth === 0 ? '' : initialNetWorth} 
              onChange={(e) => setInitialNetWorth(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl p-3 text-gray-900 font-bold transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Monthly Savings (₹)</label>
            <input 
              type="number" 
              value={monthlySavings === 0 ? '' : monthlySavings} 
              onChange={(e) => setMonthlySavings(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="0"
              className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl p-3 text-gray-900 font-bold transition-all outline-none"
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

      {/* Main Timeline Workspace & Summaries */}
      <section className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ascentia-card p-6 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Savings</h3>
            <p className="text-3xl font-extrabold text-green-500">₹{savings.monthlySavings.toLocaleString('en-IN')}<span className="text-sm text-gray-400 font-medium ml-1">/mo</span></p>
          </div>
          <div className="ascentia-card p-6 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Active Investments</h3>
            <p className="text-3xl font-extrabold text-indigo-600">₹{totalInvestments.toLocaleString('en-IN')}</p>
          </div>
          <div className="ascentia-card p-6 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pending EMI</h3>
            <p className="text-3xl font-extrabold text-amber-500">₹{pendingEmi.toLocaleString('en-IN')}<span className="text-sm text-gray-400 font-medium ml-1">/mo</span></p>
          </div>
        </div>

        <div className="flex-1 ascentia-card p-2 flex flex-col relative overflow-hidden bg-white border-gray-200 shadow-sm min-h-[400px]">
          <div className="flex-1 rounded-xl relative overflow-hidden bg-gray-50 border border-gray-100">
            <TimelineRenderer />
          </div>
        </div>
      </section>
    </main>
  );
}
