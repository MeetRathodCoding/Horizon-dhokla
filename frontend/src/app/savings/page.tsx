'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { TrendingUp, Wallet, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SavingsPage() {
  const { savings, updateSavings } = useCalculatorStore();

  const results = useMemo(() => {
    let current = savings.initial;
    const data = [];
    const monthlyRate = savings.rate / 100 / 12;
    const totalMonths = savings.years * 12;

    for (let m = 0; m <= totalMonths; m++) {
      if (m > 0) {
        current = current * (1 + monthlyRate) + savings.monthly;
      }
      if (m % 12 === 0) {
        data.push({ label: `Yr ${m / 12}`, value: Math.round(current) });
      }
    }

    return {
      finalValue: Math.round(current),
      totalInvested: savings.initial + (savings.monthly * totalMonths),
      projectionData: data
    };
  }, [savings]);

  return (
    <CalculatorLayout
      title="Savings Planner"
      description="Calculate how your savings grow over time with compound interest."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Balance (₹)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={savings.initial} 
                onChange={(e) => updateSavings({ initial: Number(e.target.value) })}
                className="horizon-input !bg-white group-hover:shadow-glow transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Contribution (₹)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={savings.monthly} 
                onChange={(e) => updateSavings({ monthly: Number(e.target.value) })}
                className="horizon-input !bg-white group-hover:shadow-glow transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Interest Rate (% p.a.)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={savings.rate} 
                onChange={(e) => updateSavings({ rate: Number(e.target.value) })}
                className="horizon-input !bg-white group-hover:shadow-glow transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Years)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={savings.years} 
                onChange={(e) => updateSavings({ years: Number(e.target.value) })}
                className="horizon-input !bg-white group-hover:shadow-glow transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">YR</div>
            </div>
          </div>
        </div>
      }
      results={
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="horizon-card p-8 flex items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Maturity Value</h3>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.finalValue.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="horizon-card p-8 flex items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Invested</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">₹{results.totalInvested.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </>
      }
      chart={<SimpleChart data={results.projectionData} />}
    />
  );
}
