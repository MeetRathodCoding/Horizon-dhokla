import { create } from 'zustand';
import { Milestone, SimulationResult, calculateSimulation } from '../utils/simulationEngine';

interface SimulationState {
  initialNetWorth: number;
  monthlySavings: number;
  annualGrowthRate: number;
  milestones: Milestone[];
  results: SimulationResult[];

  setInitialNetWorth: (val: number) => void;
  setMonthlySavings: (val: number) => void;
  setAnnualGrowthRate: (val: number) => void;
  
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  removeMilestone: (id: string) => void;
  
  recalculate: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  initialNetWorth: 10000,
  monthlySavings: 1000,
  annualGrowthRate: 0.07,
  milestones: [
    { id: '1', label: 'Buy a Car', age: 25, cost: 30000, category: 'Vehicle' },
    { id: '2', label: 'Wedding', age: 28, cost: 50000, category: 'Event' },
    { id: '3', label: 'House Downpayment', age: 32, cost: 100000, category: 'Property' }
  ],
  results: [],

  setInitialNetWorth: (initialNetWorth) => {
    set({ initialNetWorth });
    get().recalculate();
  },
  
  setMonthlySavings: (monthlySavings) => {
    set({ monthlySavings });
    get().recalculate();
  },
  
  setAnnualGrowthRate: (annualGrowthRate) => {
    set({ annualGrowthRate });
    get().recalculate();
  },

  addMilestone: (milestone) => {
    set((state) => ({ milestones: [...state.milestones, milestone] }));
    get().recalculate();
  },

  updateMilestone: (id, updates) => {
    set((state) => ({
      milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m))
    }));
    get().recalculate();
  },

  removeMilestone: (id) => {
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id)
    }));
    get().recalculate();
  },

  recalculate: () => {
    const { initialNetWorth, monthlySavings, annualGrowthRate, milestones } = get();
    const newResults = calculateSimulation(initialNetWorth, monthlySavings, annualGrowthRate, milestones);
    set({ results: newResults });
  }
}));

// Initialize calculation
useSimulationStore.getState().recalculate();
