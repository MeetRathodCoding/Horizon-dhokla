'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { Calculator, BarChart3, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EMIPage() {
  const { emi, updateEmi } = useCalculatorStore();

  const results = useMemo(() => {
    const monthlyRate = emi.rate / 100 / 12;
    const totalMonths = emi.years * 12;

    const monthlyEmi = emi.amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalRepayment = monthlyEmi * totalMonths;
    const totalInterest = totalRepayment - emi.amount;

    const data = [
      { label: 'Principal', value: emi.amount },
      { label: 'Total Interest', value: Math.round(totalInterest) }
    ];

    return {
      monthlyEmi: Math.round(monthlyEmi),
      totalInterest: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
      projectionData: data
    };
  }, [emi]);

  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Quickly calculate your monthly installments for any loan."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Loan Amount (₹)</label>
            <div className="relative group">
              <input type="number" value={emi.amount} onChange={(e) => updateEmi({ amount: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Interest Rate (%)</label>
            <div className="relative group">
              <input type="number" value={emi.rate} onChange={(e) => updateEmi({ rate: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tenure (Years)</label>
            <div className="relative group">
              <input type="number" value={emi.years} onChange={(e) => updateEmi({ years: Number(e.target.value) })} className="horizon-input !bg-white group-hover:shadow-glow transition-all" />
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
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.monthlyEmi.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Repayment</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">₹{results.totalRepayment.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </>
      }
    />
  );
}
