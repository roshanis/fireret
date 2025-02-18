import { createContext, useContext, useState, useEffect } from 'react';
import { SimulationInputs, SimulationResults } from '../types/simulation';

type FireSimulationContextType = {
  inputs: SimulationInputs;
  setInputs: (inputs: SimulationInputs) => void;
  results?: SimulationResults;
  setResults: (results: SimulationResults) => void;
};

const defaultInputs: SimulationInputs = {
  currentAge: 30,
  retirementAge: 65,
  location: 'California',
  maritalStatus: 'Single',
  dependents: 0,
  occupation: 'Software Engineer',
  includeHealthInfo: false,
  currentSavings: 100000,
  monthlyExpenses: 5000,
  emergencyFundAmount: 25000,
  expectedReturn: 7,
  savingsRate: 25,
  inflationRate: 3,
  unemploymentProbability: 5,
  unemploymentDuration: 6,
  simulationsCount: 1000,
  maxSimulationYears: 35,
  annualExpenses: 60000,
  netWorth: 100000,
  annualIncome: 120000,
  jobLossProbability: 5,
  healthcareShockProbability: 2,
  healthcareShockCost: 10000,
  withdrawalRate: 4,
  volatility: 15,
  monteCarloVolatility: 15
};

const FireSimulationContext = createContext<FireSimulationContextType>({
  inputs: defaultInputs,
  setInputs: () => {},
  setResults: () => {},
});

export const FireSimulationProvider = ({ children }: { children: React.ReactNode }) => {
  const [inputs, setInputs] = useState<SimulationInputs>(() => {
    // Load from local storage on initial load
    const savedInputs = typeof window !== 'undefined' 
      ? localStorage.getItem('fireSimulationInputs')
      : null;
    return savedInputs ? JSON.parse(savedInputs) : defaultInputs;
  });

  const [results, setResults] = useState<SimulationResults>(() => {
    // Load from local storage on initial load
    const savedResults = typeof window !== 'undefined'
      ? localStorage.getItem('fireSimulationResults')
      : null;
    return savedResults ? JSON.parse(savedResults) : undefined;
  });

  // Persist inputs to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fireSimulationInputs', JSON.stringify(inputs));
    }
  }, [inputs]);

  // Persist results to local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && results) {
      localStorage.setItem('fireSimulationResults', JSON.stringify(results));
    }
  }, [results]);

  return (
    <FireSimulationContext.Provider value={{ inputs, setInputs, results, setResults }}>
      {children}
    </FireSimulationContext.Provider>
  );
};

export const useFireSimulation = () => useContext(FireSimulationContext); 