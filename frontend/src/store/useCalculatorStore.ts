import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HouseInput = {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  tenure: number;
};

interface CalculatorState {
  // Savings
  savings: {
    initial: number;
    monthly: number;
    rate: number;
    years: number;
  };
  
  // House (Updated to match User's 'Correct Way')
  house: HouseInput;

  // Loan
  loan: {
    amount: number;
    rate: number;
    years: number;
  };
  // EMI
  emi: {
    amount: number;
    rate: number;
    years: number;
  };
  // SIP
  sip: {
    monthly: number;
    rate: number;
    years: number;
  };
  // Mutual Funds
  mutualFunds: {
    lumpSum: number;
    rate: number;
    years: number;
  };
  
  // Actions
  updateSavings: (data: Partial<CalculatorState['savings']>) => void;
  setHouseInput: (field: keyof HouseInput, value: number) => void;
  updateLoan: (data: Partial<CalculatorState['loan']>) => void;
  updateEmi: (data: Partial<CalculatorState['emi']>) => void;
  updateSip: (data: Partial<CalculatorState['sip']>) => void;
  updateMutualFunds: (data: Partial<CalculatorState['mutualFunds']>) => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      savings: { initial: 100000, monthly: 10000, rate: 7, years: 10 },
      
      house: { 
        propertyPrice: 5000000, 
        downPayment: 1000000, 
        interestRate: 8.5, 
        tenure: 20 
      },
      
      loan: { amount: 1000000, rate: 10, years: 5 },
      emi: { amount: 1000000, rate: 9.5, years: 3 },
      sip: { monthly: 5000, rate: 12, years: 10 },
      mutualFunds: { lumpSum: 100000, rate: 15, years: 5 },

      updateSavings: (data) => set((state) => ({ savings: { ...state.savings, ...data } })),
      
      setHouseInput: (field, value) =>
        set((state) => ({
          house: {
            ...state.house,
            [field]: value,
          },
        })),

      updateLoan: (data) => set((state) => ({ loan: { ...state.loan, ...data } })),
      updateEmi: (data) => set((state) => ({ emi: { ...state.emi, ...data } })),
      updateSip: (data) => set((state) => ({ sip: { ...state.sip, ...data } })),
      updateMutualFunds: (data) => set((state) => ({ mutualFunds: { ...state.mutualFunds, ...data } })),
    }),
    { name: 'ascentia-calculators' }
  )
);
