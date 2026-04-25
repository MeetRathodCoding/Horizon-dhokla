'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Calculator } from 'lucide-react';
import { useMemo } from 'react';

export default function EMIPage() {
  const { emi, setEMIInput } = useCalculatorStore();

  const emiValue = useMemo(() => {
    const P = emi.amount;
    const R = emi.rate / 12 / 100;
    const N = emi.months;
    if (P > 0 && R > 0 && N > 0) {
      return Math.round((P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1));
    }
    if (P > 0 && R === 0 && N > 0) return Math.round(P / N);
    return 0;
  }, [emi]);

  return (
    <div className="max-w-xl mx-auto px-6 py-20 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <Calculator className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Quick EMI</h1>
        <p className="text-gray-500 mt-2 font-medium">Fast and simple EMI calculator.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Principal Amount</label>
          <input 
            type="number" 
            value={emi.amount} 
            onChange={(e) => setEMIInput('amount', Number(e.target.value))}
            className="w-full mt-1 border-b-2 border-gray-200 py-2 text-2xl font-extrabold text-gray-900 focus:border-indigo-600 bg-transparent outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Rate (%)</label>
            <input 
              type="number" 
              value={emi.rate} 
              onChange={(e) => setEMIInput('rate', Number(e.target.value))}
              className="w-full mt-1 border-b-2 border-gray-200 py-2 text-2xl font-extrabold text-gray-900 focus:border-indigo-600 bg-transparent outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Months</label>
            <input 
              type="number" 
              value={emi.months} 
              onChange={(e) => setEMIInput('months', Number(e.target.value))}
              className="w-full mt-1 border-b-2 border-gray-200 py-2 text-2xl font-extrabold text-gray-900 focus:border-indigo-600 bg-transparent outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-6">
          <ResultCard 
            title="Your EMI" 
            value={`₹${emiValue.toLocaleString('en-IN')}`} 
            subtitle="per month"
            highlight
          />
        </div>
      </div>
    </div>
  );
}
