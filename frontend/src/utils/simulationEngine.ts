export interface Milestone {
  id: string;
  label: string;
  age: number;
  cost: number;
  category: string;
}

export interface SimulationResult {
  age: number;
  netWorth: number;
}

export const calculateSimulation = (
  initialNetWorth: number,
  monthlySavings: number,
  annualGrowthRate: number,
  milestones: Milestone[],
  startAge: number = 20,
  endAge: number = 80
): SimulationResult[] => {
  const results: SimulationResult[] = [];
  let currentNetWorth = initialNetWorth;

  for (let age = startAge; age <= endAge; age++) {
    // 1. Add yearly savings
    currentNetWorth += monthlySavings * 12;

    // 2. Apply annual growth (simulate growing over the year, applied at end of year)
    currentNetWorth *= (1 + annualGrowthRate);

    // 3. Subtract milestone costs that occur at this exact age
    const ageMilestones = milestones.filter(m => m.age === age);
    const totalMilestoneCost = ageMilestones.reduce((sum, m) => sum + m.cost, 0);
    
    currentNetWorth -= totalMilestoneCost;

    results.push({ age, netWorth: currentNetWorth });
  }

  return results;
};
