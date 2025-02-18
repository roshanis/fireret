import { NextApiRequest, NextApiResponse } from 'next';
import { SimulationInputs, SimulationResults } from '../../types/simulation';

// Helper function for normal distribution
function gaussianRandom() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimulationResults | { error: string }>
) {
  console.log('API called with method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Invalid method, expected POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received input data:', JSON.stringify(req.body, null, 2));
    
    const inputs = req.body as SimulationInputs;
    console.log('Starting Monte Carlo simulation with params:', {
      simulationsCount: inputs.simulationsCount,
      currentAge: inputs.currentAge,
      retirementAge: inputs.retirementAge,
      expectedReturn: inputs.expectedReturn,
      volatility: inputs.volatility
    });

    const results = runMonteCarloSimulation(inputs);
    console.log('Simulation completed successfully. Results:', {
      successProbability: results.successProbability,
      numProjections: results.netWorthProjections.length,
      timestamp: results.timestamp
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Simulation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function runMonteCarloSimulation(params: SimulationInputs): SimulationResults {
  let successes = 0;
  const retirementAges: number[] = [];
  const netWorthHistory: number[][] = [];
  const annualExpensesHistory: number[][] = [];

  for (let i = 0; i < params.simulationsCount; i++) {
    let portfolio = params.currentSavings;
    let emergencyFund = params.emergencyFundAmount;
    let isEmployed = true;
    let unemployedDuration = 0;
    let retired = false;
    let currentYear = 0;
    
    const annualExpenses = params.monthlyExpenses * 12;
    let currentExpenses = annualExpenses;

    const simulationNetWorth: number[] = [];
    const simulationExpenses: number[] = [];

    while (currentYear < params.maxSimulationYears && portfolio > 0) {
      // Job loss scenario
      if (isEmployed && Math.random() < params.unemploymentProbability / 100) {
        unemployedDuration = params.unemploymentDuration;
        isEmployed = false;
      }

      // Handle unemployment
      if (unemployedDuration > 0) {
        if (emergencyFund > 0) {
          emergencyFund -= currentExpenses / 12; // Monthly expenses
        } else {
          portfolio -= currentExpenses / 12;
        }
        unemployedDuration--;
      } else {
        isEmployed = true;
      }

      // Apply investment returns (convert percentage to decimal)
      const marketReturn = Math.exp(
        (params.expectedReturn / 100) - (params.volatility / 100) ** 2 / 2 
        + (params.volatility / 100) * gaussianRandom()
      );
      portfolio *= marketReturn;

      // Add savings if employed (convert percentage to decimal)
      if (isEmployed && !retired) {
        portfolio += (params.annualIncome * (params.savingsRate / 100)) / 12;
      }

      // Handle retirement
      if (!retired && currentYear >= params.retirementAge - params.currentAge) {
        retired = true;
        retirementAges.push(currentYear + (params.retirementAge - params.currentAge));
      }

      // Handle expenses
      if (retired) {
        portfolio -= currentExpenses / 12; // Monthly withdrawal
      }

      // Apply inflation and healthcare shocks (convert percentages to decimal)
      currentExpenses *= (1 + params.inflationRate / 100 / 12); // Monthly inflation
      if (Math.random() < params.healthcareShockProbability / 100) {
        currentExpenses *= (1 + params.healthcareShockCost / 100);
      }

      // Track annual metrics
      if (currentYear % 12 === 0) {
        simulationNetWorth.push(portfolio);
        simulationExpenses.push(currentExpenses * 12); // Annualize for tracking
      }
      
      currentYear++;
    }

    // Store simulation results
    netWorthHistory.push(simulationNetWorth);
    annualExpensesHistory.push(simulationExpenses);

    if (portfolio > 0) successes++;
  }

  // Process retirement age distribution
  const ageDistribution = retirementAges.reduce((acc: Record<number, number>, age) => {
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Process net worth percentiles
  const processedProjections = netWorthHistory[0].map((_, index) => {
    const yearlyValues = netWorthHistory.map(sim => sim[index]).filter(v => v !== undefined);
    return {
      year: new Date().getFullYear() + Math.floor(index / 12),
      value: percentile(50, yearlyValues),
      p5: percentile(5, yearlyValues),
      p50: percentile(50, yearlyValues),
      p95: percentile(95, yearlyValues)
    };
  });

  // Process average annual expenses
  const averageExpenses = annualExpensesHistory[0].map((_, index) => 
    annualExpensesHistory.reduce((sum, sim) => sum + (sim[index] || 0), 0) / params.simulationsCount
  );

  return {
    successProbability: (successes / params.simulationsCount) * 100,
    netWorthProjections: processedProjections,
    retirementAgeDistribution: Object.entries(ageDistribution).map(([age, count]) => ({
      age: Number(age),
      count: Number(count)
    })).sort((a, b) => a.age - b.age),
    annualExpensesHistory: averageExpenses,
    percentiles: {
      p5: percentile(5, processedProjections.map(p => p.p5)),
      p50: percentile(50, processedProjections.map(p => p.p50)),
      p95: percentile(95, processedProjections.map(p => p.p95))
    },
    timestamp: Date.now()
  };
}

// Helper functions
function percentile(p: number, arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  return sorted[Math.floor(index)] || 0;
} 