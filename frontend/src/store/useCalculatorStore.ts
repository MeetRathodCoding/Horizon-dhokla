import { create } from 'zustand';

interface CalculatorState {
  savings: {
    monthlySavings: number;
    initialBalance: number;
    expectedReturnRate: number;
    durationYears: number;
  };
  house: {
    propertyPrice: number;
    downPayment: number;
    loanRate: number;
    tenureYears: number;
  };
  loan: {
    loanAmount: number;
    loanRate: number;
    tenureYears: number;
  };
  sip: {
    monthlyInvestment: number;
    returnRate: number;
    durationYears: number;
  };
  mutualFund: {
    lumpSum: number;
    sipAmount: number;
    returnRate: number;
    durationYears: number;
  };
  emi: {
    amount: number;
    rate: number;
    months: number;
  };
  setSavingsInput: (field: keyof CalculatorState['savings'], value: number) => void;
  setHouseInput: (field: keyof CalculatorState['house'], value: number) => void;
  setLoanInput: (field: keyof CalculatorState['loan'], value: number) => void;
  setSIPInput: (field: keyof CalculatorState['sip'], value: number) => void;
  setMutualFundInput: (field: keyof CalculatorState['mutualFund'], value: number) => void;
  setEMIInput: (field: keyof CalculatorState['emi'], value: number) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  savings: {
    monthlySavings: 10000,
    initialBalance: 0,
    expectedReturnRate: 12,
    durationYears: 10,
  },
  house: {
    propertyPrice: 5000000,
    downPayment: 1000000,
    loanRate: 8.5,
    tenureYears: 20,
  },
  loan: {
    loanAmount: 1000000,
    loanRate: 10.5,
    tenureYears: 5,
  },
  sip: {
    monthlyInvestment: 5000,
    returnRate: 12,
    durationYears: 15,
  },
  mutualFund: {
    lumpSum: 50000,
    sipAmount: 2000,
    returnRate: 12,
    durationYears: 10,
  },
  emi: {
    amount: 500000,
    rate: 9,
    months: 60,
  },
  
  setSavingsInput: (field, value) => set((state) => ({ savings: { ...state.savings, [field]: value } })),
  setHouseInput: (field, value) => set((state) => ({ house: { ...state.house, [field]: value } })),
  setLoanInput: (field, value) => set((state) => ({ loan: { ...state.loan, [field]: value } })),
  setSIPInput: (field, value) => set((state) => ({ sip: { ...state.sip, [field]: value } })),
  setMutualFundInput: (field, value) => set((state) => ({ mutualFund: { ...state.mutualFund, [field]: value } })),
  setEMIInput: (field, value) => set((state) => ({ emi: { ...state.emi, [field]: value } })),
}));
