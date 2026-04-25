'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { Home, Landmark, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HousePaymentPage() {
  const { house, updateHouse } = useCalculatorStore();

  const results = useMemo(() => {
    const loanAmount = house.price - house.downPayment;
    const monthlyRate = house.rate / 100 / 12;
    const totalMonths = house.years * 12;

    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalRepayment = emi * totalMonths;
    const totalInterest = totalRepayment - loanAmount;

    const data = [];
    let balance = loanAmount;
    for (let yr = 0; yr <= house.years; yr++) {
      data.push({ label: `Yr ${yr}`, value: Math.max(0, Math.round(balance)) });
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        const principal = emi - interest;
        balance -= principal;
      }
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      loanAmount,
      projectionData: data
    };
  }, [house]);

  return (
    <CalculatorLayout
      title="House Planner"
      description="Calculate your home loan EMI and see how your principal decreases over time."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Price (₹)</label>
            <div className="relative group">
              <input type="number" value={house.price} onChange={(e) => updateHouse({ price: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Down Payment (₹)</label>
            <div className="relative group">
              <input type="number" value={house.downPayment} onChange={(e) => updateHouse({ downPayment: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Interest Rate (%)</label>
            <div className="relative group">
              <input type="number" value={house.rate} onChange={(e) => updateHouse({ rate: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tenure (Years)</label>
            <div className="relative group">
              <input type="number" value={house.years} onChange={(e) => updateHouse({ years: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">YR</div>
            </div>
          </div>
        </div>
      }
      results={
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Monthly EMI</h3>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.emi.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Interest</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">₹{results.totalInterest.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </>
      }
      chart={<SimpleChart data={results.projectionData} />}
    />
  );
}
