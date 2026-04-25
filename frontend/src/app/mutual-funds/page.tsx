'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { LineChart, Percent, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MutualFundsPage() {
  const { mutualFunds, updateMutualFunds } = useCalculatorStore();

  const results = useMemo(() => {
    const r = mutualFunds.rate / 100;
    const n = mutualFunds.years;
    
    // Lump Sum: FV = P * (1 + r)^n
    const futureValue = mutualFunds.lumpSum * Math.pow(1 + r, n);
    const totalReturns = futureValue - mutualFunds.lumpSum;
    
    const data = [];
    for (let yr = 0; yr <= n; yr++) {
      const yrValue = mutualFunds.lumpSum * Math.pow(1 + r, yr);
      data.push({ label: `Yr ${yr}`, value: Math.round(yrValue) });
    }

    return {
      futureValue: Math.round(futureValue),
      totalReturns: Math.round(totalReturns),
      projectionData: data
    };
  }, [mutualFunds]);

  return (
    <CalculatorLayout
      title="Mutual Funds"
      description="Calculate the potential growth of your lump sum investments."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lump Sum Amount (₹)</label>
            <div className="relative group">
              <input type="number" value={mutualFunds.lumpSum} onChange={(e) => updateMutualFunds({ lumpSum: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Return (%)</label>
            <div className="relative group">
              <input type="number" value={mutualFunds.rate} onChange={(e) => updateMutualFunds({ rate: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Years)</label>
            <div className="relative group">
              <input type="number" value={mutualFunds.years} onChange={(e) => updateMutualFunds({ years: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">YR</div>
            </div>
          </div>
        </div>
      }
      results={
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <LineChart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Maturity Value</h3>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.futureValue.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
              <Percent className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Estimated Wealth</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">₹{results.totalReturns.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </>
      }
      chart={<SimpleChart data={results.projectionData} />}
    />
  );
}
