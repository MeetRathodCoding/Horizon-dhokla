'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { TrendingUp, Coins, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SIPPage() {
  const { sip, updateSip } = useCalculatorStore();

  const results = useMemo(() => {
    const monthlyRate = sip.rate / 100 / 12;
    const months = sip.years * 12;
    
    // SIP Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = sip.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = sip.monthly * months;
    
    const data = [];
    for (let yr = 0; yr <= sip.years; yr++) {
      const yrMonths = yr * 12;
      const yrValue = sip.monthly * ((Math.pow(1 + monthlyRate, yrMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      data.push({ label: `Yr ${yr}`, value: Math.round(yrValue || 0) });
    }

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      projectionData: data
    };
  }, [sip]);

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Calculate the potential wealth you can create through Systematic Investment Plans."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Investment (₹)</label>
            <div className="relative group">
              <input type="number" value={sip.monthly} onChange={(e) => updateSip({ monthly: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Return (%)</label>
            <div className="relative group">
              <input type="number" value={sip.rate} onChange={(e) => updateSip({ rate: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tenure (Years)</label>
            <div className="relative group">
              <input type="number" value={sip.years} onChange={(e) => updateSip({ years: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">YR</div>
            </div>
          </div>
        </div>
      }
      results={
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Future Value</h3>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.futureValue.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Coins className="w-8 h-8" />
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
