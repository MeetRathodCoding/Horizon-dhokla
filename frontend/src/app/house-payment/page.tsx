'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { InputCard } from '@/components/calculator/InputCard';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Home, Calendar, IndianRupee, Percent } from 'lucide-react';
import { useMemo } from 'react';

export default function HousePaymentPage() {
  const { house, setHouseInput } = useCalculatorStore();

  const { emi, totalInterest, totalPayment, affordableStatus } = useMemo(() => {
    const P = house.propertyPrice - house.downPayment;
    const R = house.loanRate / 12 / 100;
    const N = house.tenureYears * 12;

    let emiVal = 0;
    let totalInt = 0;
    
    if (P > 0 && R > 0 && N > 0) {
      emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      totalInt = (emiVal * N) - P;
    }

    let status = '🟢 Comfortable';
    if (emiVal > 100000) status = '🔴 High Risk';
    else if (emiVal > 50000) status = '🟡 Moderate';

    return {
      emi: Math.round(emiVal),
      totalInterest: Math.round(totalInt),
      totalPayment: Math.round(P + totalInt),
      affordableStatus: status
    };
  }, [house]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Home className="w-8 h-8 text-indigo-600" />
          House Payment Calculator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Calculate your EMI and total interest for a home loan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard title="Property Price" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={house.propertyPrice} 
            onChange={(e) => setHouseInput('propertyPrice', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Down Payment" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={house.downPayment} 
            onChange={(e) => setHouseInput('downPayment', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Loan Interest Rate (%)" icon={<Percent className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={house.loanRate} 
            onChange={(e) => setHouseInput('loanRate', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Tenure (Years)" icon={<Calendar className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={house.tenureYears} 
            onChange={(e) => setHouseInput('tenureYears', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard 
          title="Monthly EMI" 
          value={`₹${emi.toLocaleString('en-IN')}`} 
          highlight
        />
        <ResultCard 
          title="Total Interest" 
          value={`₹${totalInterest.toLocaleString('en-IN')}`} 
        />
        <ResultCard 
          title="Total Payment" 
          value={`₹${totalPayment.toLocaleString('en-IN')}`} 
          subtitle={`Affordability: ${affordableStatus}`}
        />
      </div>
    </div>
  );
}
