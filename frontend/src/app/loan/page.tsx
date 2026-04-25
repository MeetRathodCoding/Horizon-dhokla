'use client';

import { useCalculatorStore } from '@/store/useCalculatorStore';
import { InputCard } from '@/components/calculator/InputCard';
import { ResultCard } from '@/components/calculator/ResultCard';
import { CreditCard, Calendar, IndianRupee, Percent } from 'lucide-react';
import { useMemo } from 'react';

export default function LoanPage() {
  const { loan, setLoanInput } = useCalculatorStore();

  const { emi, totalRepayment, schedule } = useMemo(() => {
    const P = loan.loanAmount;
    const R = loan.loanRate / 12 / 100;
    const N = loan.tenureYears * 12;

    let emiVal = 0;
    if (P > 0 && R > 0 && N > 0) {
      emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

    const sched = [];
    let balance = P;
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let month = 1; month <= N; month++) {
      const interest = balance * R;
      const principal = emiVal - interest;
      balance -= principal;
      yearlyInterest += interest;
      yearlyPrincipal += principal;

      if (month % 12 === 0 || month === N) {
        sched.push({
          year: Math.ceil(month / 12),
          principal: Math.round(yearlyPrincipal),
          interest: Math.round(yearlyInterest),
          balance: Math.max(0, Math.round(balance)),
        });
        yearlyInterest = 0;
        yearlyPrincipal = 0;
      }
    }

    return {
      emi: Math.round(emiVal),
      totalRepayment: Math.round(emiVal * N),
      schedule: sched
    };
  }, [loan]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-indigo-600" />
          Loan Payment Calculator
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Simple loan EMI and amortization schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputCard title="Loan Amount" icon={<IndianRupee className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={loan.loanAmount} 
            onChange={(e) => setLoanInput('loanAmount', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Interest Rate (%)" icon={<Percent className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={loan.loanRate} 
            onChange={(e) => setLoanInput('loanRate', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>

        <InputCard title="Tenure (Years)" icon={<Calendar className="w-5 h-5 text-indigo-600" />}>
          <input 
            type="number" 
            value={loan.tenureYears} 
            onChange={(e) => setLoanInput('tenureYears', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-900 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
          />
        </InputCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard 
          title="Monthly EMI" 
          value={`₹${emi.toLocaleString('en-IN')}`} 
          highlight
        />
        <ResultCard 
          title="Total Repayment" 
          value={`₹${totalRepayment.toLocaleString('en-IN')}`} 
          subtitle="Principal + Interest"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Yearly Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-gray-400 text-sm tracking-wider uppercase">
                <th className="pb-3 font-bold">Year</th>
                <th className="pb-3 font-bold">Principal Paid</th>
                <th className="pb-3 font-bold">Interest Paid</th>
                <th className="pb-3 font-bold">Balance Remaining</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium">
              {schedule.map((row) => (
                <tr key={row.year} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-bold text-gray-900">{row.year}</td>
                  <td className="py-3 text-green-600">₹{row.principal.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-amber-500">₹{row.interest.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-indigo-600 font-bold">₹{row.balance.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
