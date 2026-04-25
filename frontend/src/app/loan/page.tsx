'use client';

import { useMemo } from 'react';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import CalculatorLayout from '@/components/Calculators/CalculatorLayout';
import SimpleChart from '@/components/Calculators/SimpleChart';
import { CreditCard, History, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoanPage() {
  const { loan, updateLoan } = useCalculatorStore();

  const results = useMemo(() => {
    const monthlyRate = loan.rate / 100 / 12;
    const totalMonths = loan.years * 12;

    const emi = loan.amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalRepayment = emi * totalMonths;
    const totalInterest = totalRepayment - loan.amount;

    const data = [];
    let balance = loan.amount;
    for (let yr = 0; yr <= loan.years; yr++) {
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
      projectionData: data
    };
  }, [loan]);

  return (
    <CalculatorLayout
      title="Loan Calculator"
      description="Understand your loan repayment schedule and total interest costs."
      inputs={
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-white uppercase tracking-widest ml-1">Loan Amount (₹)</label>
            <div className="relative group">
              <input type="number" value={loan.amount} onChange={(e) => updateLoan({ amount: Number(e.target.value) })} className="horizon-input bg-slate-700/50 text-white border-white/10 group-hover:border-primary/50 transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 font-black text-lg">₹</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-white uppercase tracking-widest ml-1">Interest Rate (%)</label>
            <div className="relative group">
              <input type="number" value={loan.rate} onChange={(e) => updateLoan({ rate: Number(e.target.value) })} className="horizon-input bg-slate-700/50 text-white border-white/10 group-hover:border-primary/50 transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 font-black text-lg">%</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-white uppercase tracking-widest ml-1">Tenure (Years)</label>
            <div className="relative group">
              <input type="number" value={loan.years} onChange={(e) => updateLoan({ years: Number(e.target.value) })} className="horizon-input bg-slate-700/50 text-white border-white/10 group-hover:border-primary/50 transition-all" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 font-black text-lg">YR</div>
            </div>
          </div>
        </div>
      }
      results={
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-1.5">Monthly EMI</h3>
              <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{results.emi.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="horizon-card p-8 flex items-center gap-6 group">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Banknote className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-1.5">Total Interest</h3>
              <p className="text-3xl font-black text-black tracking-tight">₹{results.totalInterest.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        </>
      }
      chart={<SimpleChart data={results.projectionData} />}
    />
  );
}
