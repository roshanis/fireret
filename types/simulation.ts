export interface SimulationInputs {
  currentAge: number;
  retirementAge: number;
  location: string;
  maritalStatus: string;
  dependents: number;
  occupation: string;
  includeHealthInfo: boolean;
  healthCoverage?: string;
  healthStatus?: string;
  annualExpenses: number;
  netWorth: number;
  annualIncome: number;
  jobLossProbability: number;
  unemploymentDuration: number;
  healthcareShockProbability: number;
  healthcareShockCost: number;
  withdrawalRate: number;
  emergencyFundAmount: number;
  expectedReturn: number;
  inflationRate: number;
  volatility: number;
  simulationsCount: number;
  savingsRate: number;
  monteCarloVolatility: number;
  maxSimulationYears: number;
  currentSavings: number;
  monthlyExpenses: number;
  unemploymentProbability: number;
}

export interface SimulationResults {
  successProbability: number;
  timestamp: number;
  netWorthProjections: Array<{
    year: number;
    value: number;
    p5: number;
    p50: number;
    p95: number;
  }>;
  retirementAgeDistribution: Array<{
    age: number;
    count: number;
  }>;
  annualExpensesHistory: number[];
  percentiles: {
    p5: number;
    p50: number;
    p95: number;
  };
} 