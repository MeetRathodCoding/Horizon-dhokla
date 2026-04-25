'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { InputCard } from '@/components/calculator/InputCard';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Chart } from '@/components/calculator/Chart';
import { Calendar, IndianRupee, TrendingUp, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

export default function SIPPage() {
  const { sip, setSIPInput } = useCalculatorStore();

  const { data, futureValue, totalInvested } = useMemo(() => {
    let currentVal = 0;
    let invested = 0;
    const monthlyRate = sip.returnRate / 100 / 12;
    const months = sip.durationYears * 12;
    
    const chartData = [];
    
    for (let i = 1; i <= months; i++) {
        // PMT at beginning of month
        currentVal = (currentVal + sip.monthlyInvestment) * (1 + monthlyRate);
        invested += sip.monthlyInvestment;

        if (i % 12 === 0 || i === months) {
            chartData.push({
            label: `${Math.ceil(i/12)}Y`,
            value: Math.round(currentVal),
            secondaryValue: Math.round(invested)
            });
        }
    }
    
    return {
      data: chartData,
      futureValue: Math.round(currentVal),
      totalInvested: Math.round(invested),
    };
  }, [sip]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          SIP Calculator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Calculate returns for Systematic Investment Plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputCard title="Monthly Investment" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={sip.monthlyInvestment} 
            onChange={(e) => setSIPInput('monthlyInvestment', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Expected Return (%)" icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={sip.returnRate} 
            onChange={(e) => setSIPInput('returnRate', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Time Period (Years)" icon={<Calendar className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={sip.durationYears} 
            onChange={(e) => setSIPInput('durationYears', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard 
          title="Total Invested Amount" 
          value={`₹${totalInvested.toLocaleString('en-IN')}`} 
        />
        <ResultCard 
          title="Total Value" 
          value={`₹${futureValue.toLocaleString('en-IN')}`} 
          subtitle={`Estimated Wealth Gained: ₹${(futureValue - totalInvested).toLocaleString('en-IN')}`}
          highlight
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Investment Growth Over Time</h3>
        <p className="text-sm font-bold text-indigo-600 flex items-center gap-2">
          <span className="w-3 h-3 bg-indigo-500 rounded-full inline-block"></span> Portfolio Value
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block ml-4"></span> Amount Invested
        </p>
        <Chart data={data} height={300} />
      </div>
    </div>
  );
}
