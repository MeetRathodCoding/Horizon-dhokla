'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { InputCard } from '@/components/calculator/InputCard';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Chart } from '@/components/calculator/Chart';
import { PiggyBank, Calendar, IndianRupee, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export default function SavingsPage() {
  const { savings, setSavingsInput } = useCalculatorStore();

  const { data, futureValue, totalInvested } = useMemo(() => {
    let currentVal = savings.initialBalance;
    let invested = savings.initialBalance;
    const monthlyRate = savings.expectedReturnRate / 100 / 12;
    const months = savings.durationYears * 12;
    
    const chartData = [];
    
    for (let i = 0; i <= months; i++) {
      if (i % 12 === 0 || i === months) {
        chartData.push({
          label: i === 0 ? 'Now' : `${i/12}Y`,
          value: Math.round(currentVal),
          secondaryValue: Math.round(invested)
        });
      }
      currentVal = (currentVal + savings.monthlySavings) * (1 + monthlyRate);
      invested += savings.monthlySavings;
    }
    
    return {
      data: chartData,
      futureValue: Math.round(currentVal),
      totalInvested: Math.round(invested - savings.monthlySavings), // account for last iteration
    };
  }, [savings]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <PiggyBank className="w-8 h-8 text-indigo-600" />
          Savings Calculator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Project your compound growth over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard title="Monthly Savings" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={savings.monthlySavings} 
            onChange={(e) => setSavingsInput('monthlySavings', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Initial Balance" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={savings.initialBalance} 
            onChange={(e) => setSavingsInput('initialBalance', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Expected Return Rate (%)" icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={savings.expectedReturnRate} 
            onChange={(e) => setSavingsInput('expectedReturnRate', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Duration (Years)" icon={<Calendar className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={savings.durationYears} 
            onChange={(e) => setSavingsInput('durationYears', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard 
          title="Total Invested" 
          value={`₹${totalInvested.toLocaleString('en-IN')}`} 
          subtitle="Your pure contribution"
        />
        <ResultCard 
          title="Future Value" 
          value={`₹${futureValue.toLocaleString('en-IN')}`} 
          subtitle="Total with compound interest"
          highlight
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Growth Projection</h3>
        <p className="text-sm font-bold text-indigo-600 flex items-center gap-2">
          <span className="w-3 h-3 bg-indigo-500 rounded-full inline-block"></span> Future Value
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block ml-4"></span> Total Invested
        </p>
        <Chart data={data} height={300} />
      </div>
    </div>
  );
}
