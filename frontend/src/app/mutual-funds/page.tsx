'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { InputCard } from '@/components/calculator/InputCard';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Chart } from '@/components/calculator/Chart';
import { Calendar, IndianRupee, TrendingUp, PieChart } from 'lucide-react';
import { useMemo } from 'react';

export default function MutualFundsPage() {
  const { mutualFund, setMutualFundInput } = useCalculatorStore();

  const { data, futureValue, totalInvested, cagr } = useMemo(() => {
    let currentVal = mutualFund.lumpSum;
    let invested = mutualFund.lumpSum;
    const monthlyRate = mutualFund.returnRate / 100 / 12;
    const months = mutualFund.durationYears * 12;
    
    const chartData = [];
    
    for (let i = 0; i <= months; i++) {
        if (i % 12 === 0 || i === months) {
            chartData.push({
            label: i === 0 ? 'Start' : `${Math.ceil(i/12)}Y`,
            value: Math.round(currentVal),
            secondaryValue: Math.round(invested)
            });
        }
        
        if (i < months) {
          currentVal = (currentVal + mutualFund.sipAmount) * (1 + monthlyRate);
          invested += mutualFund.sipAmount;
        }
    }

    // CAGR = (FV / PV)^(1/t) - 1. But here PV is not fixed since there are SIPs.
    // XIRR is more accurate. But we can display the absolute growth multiplier instead or just use the input returnRate for CAGR. 
    // Actually CAGR of a pure SIP doesn't make direct mathematical sense as a single formula without XIRR. 
    // So we'll just display Expected Return % as the CAGR, and show absolute returns.
    
    return {
      data: chartData,
      futureValue: Math.round(currentVal),
      totalInvested: Math.round(invested),
      cagr: mutualFund.returnRate
    };
  }, [mutualFund]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <PieChart className="w-8 h-8 text-indigo-600" />
          Mutual Fund Calculator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Calculate the combined growth of Lumpsum and SIPs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard title="Lumpsum Investment" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={mutualFund.lumpSum} 
            onChange={(e) => setMutualFundInput('lumpSum', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Monthly SIP Amount" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={mutualFund.sipAmount} 
            onChange={(e) => setMutualFundInput('sipAmount', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Expected CAGR (%)" icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={mutualFund.returnRate} 
            onChange={(e) => setMutualFundInput('returnRate', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Duration (Years)" icon={<Calendar className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={mutualFund.durationYears} 
            onChange={(e) => setMutualFundInput('durationYears', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard 
          title="Total Invested" 
          value={`₹${totalInvested.toLocaleString('en-IN')}`} 
        />
        <ResultCard 
          title="Est. Returns" 
          value={`₹${(futureValue - totalInvested).toLocaleString('en-IN')}`} 
          subtitle={`${cagr}% Expected CAGR`}
        />
        <ResultCard 
          title="Total Portfolio" 
          value={`₹${futureValue.toLocaleString('en-IN')}`} 
          highlight
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Portfolio Growth Snapshot</h3>
        <Chart data={data} height={300} />
      </div>
    </div>
  );
}
